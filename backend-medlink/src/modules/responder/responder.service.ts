import { Types } from 'mongoose';
import { EmergencyStatus, ROLES, TERMINAL_EMERGENCY_STATUSES } from '../../shared/constants';
import { AuthenticatedUser } from '../../shared/types';
import { ApiError } from '../../shared/utils/ApiError';
import { haversineKm, isValidCoordinates } from '../../shared/utils/geo';
import { pageMeta, parsePagination } from '../../shared/utils/pagination';
import { auditAsync } from '../../shared/services/audit.service';
import { User } from '../auth/auth.model';
import { EmergencyRequest, ResponderAssignment } from '../emergency/emergency.model';
import { HospitalProfile } from '../hospital/hospital.model';
import { IResponderProfile, ResponderProfile } from './responder.model';

const oid = (v: string | Types.ObjectId) => (typeof v === 'string' ? new Types.ObjectId(v) : v);

export const getProfile = async (responderUserId: string) => {
  const [user, profile] = await Promise.all([
    User.findById(responderUserId).lean(),
    ResponderProfile.findOne({ user: oid(responderUserId) }).populate('hospital', 'name address.district').lean(),
  ]);
  if (!user || user.role !== ROLES.RESPONDER) throw ApiError.notFound('Responder not found');
  return { ...user, profile };
};

export const updateProfile = async (responderUserId: string, updates: Record<string, unknown>) => {
  const { name, ...rest } = updates as { name?: string } & Record<string, unknown>;
  if (name) await User.updateOne({ _id: oid(responderUserId) }, { $set: { name } });

  const profile = await ResponderProfile.findOneAndUpdate(
    { user: oid(responderUserId) },
    { $set: rest },
    { new: true, runValidators: true },
  );
  if (!profile) throw ApiError.notFound('Responder profile not found');
  return profile;
};

/** Going offline is refused while an assignment is still running. */
export const setAvailability = async (
  responderUserId: string,
  input: { isAvailable: boolean; location?: [number, number] },
): Promise<IResponderProfile> => {
  const profile = await ResponderProfile.findOne({ user: oid(responderUserId) });
  if (!profile) throw ApiError.notFound('Responder profile not found');

  if (!input.isAvailable && profile.activeAssignment) {
    throw ApiError.badRequest('Finish or hand over the active assignment before going offline');
  }
  if (input.isAvailable && profile.verificationStatus !== 'verified') {
    throw ApiError.forbidden('Your responder account must be verified before going online');
  }

  profile.isAvailable = input.isAvailable;
  profile.availabilityUpdatedAt = new Date();

  if (input.location) {
    if (!isValidCoordinates(input.location[0], input.location[1])) {
      throw ApiError.badRequest('Invalid coordinates');
    }
    profile.currentLocation = { type: 'Point', coordinates: input.location };
    profile.locationUpdatedAt = new Date();
  }

  await profile.save();
  return profile;
};

export const listAssignments = async (
  actor: AuthenticatedUser,
  query: { status?: string; page?: number; limit?: number },
) => {
  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> = { responder: oid(actor.id) };
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    ResponderAssignment.find(filter)
      .populate({
        path: 'request',
        select: 'emergencyType severity status pickupLocation pickupAddress landmark createdAt',
      })
      .populate('hospital', 'name address.district')
      .sort({ assignedAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    ResponderAssignment.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

/**
 * Full incident detail for an assignment the responder actually holds,
 * including the clinical snapshot captured when the SOS was raised.
 */
export const getAssignment = async (actor: AuthenticatedUser, assignmentId: string) => {
  const assignment = await ResponderAssignment.findById(assignmentId)
    .populate('hospital', 'name address contact')
    .populate({ path: 'destination.hospital', select: 'name address contact' });
  if (!assignment) throw ApiError.notFound('Assignment not found');
  if (String(assignment.responder) !== actor.id) throw ApiError.forbidden('This assignment is not yours');

  const request = await EmergencyRequest.findById(assignment.request)
    .populate('patient', 'name phone')
    .lean();
  if (!request) throw ApiError.notFound('Emergency request not found');

  const grant = request.accessGrantedTo.find(
    (g) => String(g.user) === actor.id && new Date(g.expiresAt).getTime() > Date.now(),
  );
  const closed = TERMINAL_EMERGENCY_STATUSES.includes(request.status as EmergencyStatus);

  auditAsync({
    actor, action: 'read', resourceType: 'emergency_request', resourceId: String(request._id),
    subject: request.patient as Types.ObjectId, metadata: { via: 'responder_assignment' },
  });

  return {
    assignment,
    request: {
      ...request,
      // Clinical detail disappears once the grant lapses or the incident closes.
      patientSnapshot: grant && !closed ? request.patientSnapshot : null,
      accessGrantedTo: undefined,
    },
    accessExpiresAt: grant?.expiresAt ?? null,
  };
};

/** Destination plus a straight-line bearing; a routing provider can replace this. */
export const getNavigation = async (actor: AuthenticatedUser, assignmentId: string) => {
  const assignment = await ResponderAssignment.findById(assignmentId).lean();
  if (!assignment) throw ApiError.notFound('Assignment not found');
  if (String(assignment.responder) !== actor.id) throw ApiError.forbidden('This assignment is not yours');

  const [request, profile] = await Promise.all([
    EmergencyRequest.findById(assignment.request).select('pickupLocation pickupAddress landmark status').lean(),
    ResponderProfile.findOne({ user: oid(actor.id) }).select('currentLocation').lean(),
  ]);
  if (!request) throw ApiError.notFound('Emergency request not found');

  const destinationHospitalId = assignment.destination?.hospital;
  const hospital = destinationHospitalId
    ? await HospitalProfile.findById(destinationHospitalId).select('name address contact').lean()
    : null;

  // Before pickup the target is the patient; after pickup it is the hospital.
  const transporting = ['transporting', 'at_hospital'].includes(request.status);
  const target: [number, number] = transporting && hospital
    ? (hospital.address.location.coordinates as [number, number])
    : (request.pickupLocation.coordinates as [number, number]);

  const from = profile?.currentLocation?.coordinates as [number, number] | undefined;
  const distanceKm = from ? Number(haversineKm(from, target).toFixed(2)) : null;

  return {
    phase: transporting ? 'to_hospital' : 'to_patient',
    from: from ?? null,
    destination: {
      coordinates: target,
      address: transporting && hospital ? hospital.address : request.pickupAddress,
      landmark: transporting ? undefined : request.landmark,
      hospital: hospital ? { id: hospital._id, name: hospital.name, phone: hospital.contact?.phone } : null,
    },
    distanceKm,
    etaMinutes: distanceKm !== null ? Math.max(1, Math.round((distanceKm / 30) * 60)) : null,
    note: 'Straight-line estimate. Plug in a routing provider for turn-by-turn directions.',
  };
};

export const getHistory = async (actor: AuthenticatedUser, query: { page?: number; limit?: number }) => {
  const page = parsePagination(query as Record<string, unknown>);
  const filter = { responder: oid(actor.id), status: { $in: ['completed', 'cancelled', 'declined', 'expired'] } };

  const [items, total, profile] = await Promise.all([
    ResponderAssignment.find(filter)
      .populate({ path: 'request', select: 'emergencyType severity status resolvedAt outcome pickupAddress' })
      .sort({ completedAt: -1, assignedAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    ResponderAssignment.countDocuments(filter),
    ResponderProfile.findOne({ user: oid(actor.id) }).select('stats').lean(),
  ]);

  return { items, meta: pageMeta(total, page), stats: profile?.stats ?? null };
};
