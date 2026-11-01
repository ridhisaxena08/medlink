import { Types } from 'mongoose';
import {
  CONSENT_SCOPES,
  EMERGENCY_STATUS,
  EMERGENCY_TRANSITIONS,
  EmergencyStatus,
  ROLES,
  TERMINAL_EMERGENCY_STATUSES,
  VERIFICATION_STATUS,
} from '../../shared/constants';
import { AuthenticatedUser } from '../../shared/types';
import { ApiError } from '../../shared/utils/ApiError';
import { addMinutes } from '../../shared/utils/dates';
import { haversineKm } from '../../shared/utils/geo';
import { pageMeta, parsePagination } from '../../shared/utils/pagination';
import { assertPatientAccess } from '../../shared/services/access.service';
import { auditAsync } from '../../shared/services/audit.service';
import { notify } from '../../shared/services/notification.service';
import { smsService } from '../intelligence/sms/sms.service';
import { User } from '../auth/auth.model';
import { HospitalProfile } from '../hospital/hospital.model';
import { PatientMedication } from '../intelligence/medicines/patientMedication.model';
import { summarise } from '../medical-records/medicalRecords.service';
import { PatientProfile } from '../patient/patient.model';
import { ResponderProfile } from '../responder/responder.model';
import {
  EmergencyContact,
  EmergencyRequest,
  IEmergencyRequest,
  LocationUpdate,
  ResponderAssignment,
} from './emergency.model';

const oid = (v: string | Types.ObjectId) => (typeof v === 'string' ? new Types.ObjectId(v) : v);

/** Responders and hospitals get read access for the life of the incident only. */
const ACCESS_GRANT_HOURS = 12;

/* ------------------------------- contacts ------------------------------ */

export const addContact = async (actor: AuthenticatedUser, input: Record<string, any>) => {
  const patientId = input.patient ?? actor.id;
  if (patientId !== actor.id) {
    await assertPatientAccess(actor, patientId, CONSENT_SCOPES.EMERGENCY, 'emergency_contact');
  } else if (actor.role !== ROLES.PATIENT) {
    throw ApiError.badRequest('patient is required');
  }

  if (input.isPrimary) {
    await EmergencyContact.updateMany({ patient: oid(patientId) }, { $set: { isPrimary: false } });
  }

  const contact = await EmergencyContact.create({
    ...input,
    patient: oid(patientId),
    addedBy: oid(actor.id),
  });

  auditAsync({
    actor, action: 'create', resourceType: 'emergency_contact', resourceId: String(contact._id),
    subject: patientId,
  });

  return contact;
};

export const listContacts = async (actor: AuthenticatedUser, patientParam?: string) => {
  const patientId = patientParam ?? actor.id;
  if (patientId !== actor.id) {
    await assertPatientAccess(actor, patientId, CONSENT_SCOPES.EMERGENCY, 'emergency_contact');
  }
  return EmergencyContact.find({ patient: oid(patientId) }).sort({ isPrimary: -1, name: 1 }).lean();
};

export const updateContact = async (
  actor: AuthenticatedUser,
  contactId: string,
  updates: Record<string, unknown>,
) => {
  const contact = await EmergencyContact.findById(contactId);
  if (!contact) throw ApiError.notFound('Contact not found');
  if (String(contact.patient) !== actor.id) {
    await assertPatientAccess(actor, contact.patient, CONSENT_SCOPES.EMERGENCY, 'emergency_contact');
  }
  if (updates.isPrimary) {
    await EmergencyContact.updateMany(
      { patient: contact.patient, _id: { $ne: contact._id } },
      { $set: { isPrimary: false } },
    );
  }
  Object.assign(contact, updates);
  await contact.save();
  return contact;
};

export const deleteContact = async (actor: AuthenticatedUser, contactId: string) => {
  const contact = await EmergencyContact.findById(contactId);
  if (!contact) throw ApiError.notFound('Contact not found');
  if (String(contact.patient) !== actor.id) {
    await assertPatientAccess(actor, contact.patient, CONSENT_SCOPES.EMERGENCY, 'emergency_contact');
  }
  await contact.deleteOne();
  return { deleted: true };
};

/* --------------------------- hospital discovery ------------------------ */

export const findNearbyHospitals = async (query: {
  lng: number; lat: number; radiusKm: number; emergencyOnly: boolean; requiresIcu?: boolean; limit: number;
}) => {
  const filter: Record<string, unknown> = {
    verificationStatus: VERIFICATION_STATUS.VERIFIED,
    'address.location': {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [query.lng, query.lat] },
        $maxDistance: query.radiusKm * 1000,
      },
    },
  };
  if (query.emergencyOnly) filter.acceptsEmergencies = true;
  if (query.requiresIcu) filter['facilities.icu'] = true;

  const hospitals = await HospitalProfile.find(filter)
    .select('name type address contact facilities bedCapacity acceptsEmergencies')
    .limit(query.limit)
    .lean();

  return hospitals.map((h) => ({
    ...h,
    distanceKm: Number(
      haversineKm([query.lng, query.lat], h.address.location.coordinates as [number, number]).toFixed(2),
    ),
  }));
};

/* ------------------------------ SOS creation --------------------------- */

/** Minimal clinical context, captured at creation so responders never query live records. */
const buildSnapshot = async (patientId: string) => {
  const [user, profile, history, medications] = await Promise.all([
    User.findById(patientId).select('name').lean(),
    PatientProfile.findOne({ user: oid(patientId) }).select('dateOfBirth bloodGroup').lean(),
    summarise(patientId),
    PatientMedication.find({ patient: oid(patientId), status: 'active', confirmedByPatient: true })
      .select('medicineName dosage')
      .lean(),
  ]);

  const age = profile?.dateOfBirth
    ? Math.floor((Date.now() - new Date(profile.dateOfBirth).getTime()) / (365.25 * 864e5))
    : undefined;

  return {
    name: user?.name,
    age,
    bloodGroup: profile?.bloodGroup,
    allergies: history.allergies.map((a) => a.title),
    conditions: history.conditions,
    activeMedications: medications.map((m) => `${m.medicineName} ${m.dosage}`),
  };
};

export const createSos = async (
  actor: AuthenticatedUser,
  input: {
    emergencyType: string; severity: string; description?: string; symptoms: string[];
    location: [number, number]; pickupAddress?: string; landmark?: string;
    patient?: string; notifyRadiusKm: number; clientRecordId?: string;
  },
): Promise<{ request: IEmergencyRequest; notifiedHospitals: number; notifiedContacts: number }> => {
  let patientId = actor.id;

  if (actor.role !== ROLES.PATIENT) {
    if (!input.patient) throw ApiError.badRequest('patient is required when raising SOS for someone else');
    await assertPatientAccess(actor, input.patient, CONSENT_SCOPES.EMERGENCY, 'emergency_request');
    patientId = input.patient;
  }

  const open = await EmergencyRequest.findOne({
    patient: oid(patientId),
    status: { $nin: TERMINAL_EMERGENCY_STATUSES },
  }).lean();
  if (open) {
    throw ApiError.conflict(`An emergency request is already open (${String(open._id)}, status ${open.status})`);
  }

  const snapshot = await buildSnapshot(patientId);

  const request = await EmergencyRequest.create({
    patient: oid(patientId),
    raisedBy: oid(actor.id),
    raisedByRole: actor.role,
    emergencyType: input.emergencyType,
    severity: input.severity,
    description: input.description,
    symptoms: input.symptoms,
    pickupLocation: { type: 'Point', coordinates: input.location },
    pickupAddress: input.pickupAddress,
    landmark: input.landmark,
    status: EMERGENCY_STATUS.CREATED,
    statusHistory: [{ status: EMERGENCY_STATUS.CREATED, at: new Date(), by: oid(actor.id) }],
    patientSnapshot: snapshot,
    clientRecordId: input.clientRecordId,
  });

  const hospitals = await findNearbyHospitals({
    lng: input.location[0],
    lat: input.location[1],
    radiusKm: input.notifyRadiusKm,
    emergencyOnly: true,
    limit: 10,
  });

  const contacts = await EmergencyContact.find({ patient: oid(patientId), notifyOnSos: true }).lean();

  await Promise.all([
    ...hospitals.map((h) =>
      notify({
        user: h.user as unknown as Types.ObjectId,
        type: 'emergency.incoming',
        title: `Incoming ${input.severity} emergency`,
        body: `${input.emergencyType} ${h.distanceKm}km away. ${input.pickupAddress ?? ''}`.trim(),
        data: { requestId: String(request._id), distanceKm: h.distanceKm },
        priority: 'critical',
      }),
    ),
    ...contacts.map((c) =>
      smsService
        .send({
          to: c.phone,
          body: `MedLink SOS: ${snapshot.name ?? 'A contact'} raised an emergency${
            c.canShareLocation && input.pickupAddress ? ` at ${input.pickupAddress}` : ''
          }. Help is being arranged.`,
        })
        .catch(() => undefined),
    ),
  ]);

  request.notifiedHospitals = hospitals.map((h) => h._id as Types.ObjectId);
  request.notifiedContacts = contacts.map((c) => c._id as Types.ObjectId);
  request.status = EMERGENCY_STATUS.NOTIFIED;
  request.statusHistory.push({ status: EMERGENCY_STATUS.NOTIFIED, at: new Date(), by: oid(actor.id) });
  await request.save();

  auditAsync({
    actor, action: 'create', resourceType: 'emergency_request', resourceId: String(request._id),
    subject: patientId,
    metadata: { severity: input.severity, hospitalsNotified: hospitals.length, contactsNotified: contacts.length },
  });

  return { request, notifiedHospitals: hospitals.length, notifiedContacts: contacts.length };
};

/* ------------------------------ access gate ---------------------------- */

const hospitalIdFor = async (userId: string) => {
  const hospital = await HospitalProfile.findOne({ user: oid(userId) }).select('_id').lean();
  return hospital?._id ?? null;
};

/**
 * Who may read an emergency request: the patient, whoever raised it, the
 * assigned responder, a notified or assigned hospital, an explicitly granted
 * user (within the grant window), or an admin.
 */
const loadAccessibleRequest = async (actor: AuthenticatedUser, requestId: string) => {
  const request = await EmergencyRequest.findById(requestId);
  if (!request) throw ApiError.notFound('Emergency request not found');

  if (actor.role === ROLES.ADMIN) return request;
  if (String(request.patient) === actor.id || String(request.raisedBy) === actor.id) return request;
  if (request.assignedResponder && String(request.assignedResponder) === actor.id) return request;

  const grant = request.accessGrantedTo.find(
    (g) => String(g.user) === actor.id && g.expiresAt.getTime() > Date.now(),
  );
  if (grant) return request;

  if (actor.role === ROLES.HOSPITAL) {
    const hospitalId = await hospitalIdFor(actor.id);
    if (
      hospitalId &&
      (String(request.assignedHospital) === String(hospitalId) ||
        request.notifiedHospitals.some((h) => String(h) === String(hospitalId)))
    ) {
      return request;
    }
  }

  auditAsync({
    actor, action: 'access_denied', resourceType: 'emergency_request', resourceId: requestId,
    subject: request.patient, outcome: 'denied', reason: 'No relationship to this emergency',
  });
  throw ApiError.forbidden('You do not have access to this emergency request');
};

export const getRequest = async (actor: AuthenticatedUser, requestId: string) => {
  const request = await loadAccessibleRequest(actor, requestId);
  auditAsync({
    actor, action: 'read', resourceType: 'emergency_request', resourceId: requestId, subject: request.patient,
  });
  return request.populate([
    { path: 'patient', select: 'name phone' },
    { path: 'assignedResponder', select: 'name phone' },
    { path: 'assignedHospital', select: 'name address contact' },
  ]);
};

export const listMyRequests = async (
  actor: AuthenticatedUser,
  query: { status?: string; from?: Date; to?: Date; page?: number; limit?: number },
) => {
  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> = {
    $or: [{ patient: oid(actor.id) }, { raisedBy: oid(actor.id) }],
  };
  if (query.status) filter.status = query.status;
  if (query.from || query.to) {
    filter.createdAt = {
      ...(query.from ? { $gte: query.from } : {}),
      ...(query.to ? { $lte: query.to } : {}),
    };
  }

  const [items, total] = await Promise.all([
    EmergencyRequest.find(filter)
      .populate('assignedResponder', 'name phone')
      .populate('assignedHospital', 'name address.district')
      .sort({ createdAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    EmergencyRequest.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

/* ------------------------------ assignment ----------------------------- */

export const assignResponder = async (
  actor: AuthenticatedUser,
  requestId: string,
  input: { responder: string; hospital?: string; destinationHospital?: string; offerMinutes: number; notes?: string },
) => {
  if (actor.role !== ROLES.HOSPITAL && actor.role !== ROLES.ADMIN) {
    throw ApiError.forbidden('Only a hospital or admin can assign a responder');
  }

  const request = await loadAccessibleRequest(actor, requestId);
  if (TERMINAL_EMERGENCY_STATUSES.includes(request.status)) {
    throw ApiError.badRequest(`Request is already ${request.status}`);
  }

  const responderProfile = await ResponderProfile.findOne({ user: oid(input.responder) }).lean();
  if (!responderProfile) throw ApiError.notFound('Responder not found');
  if (responderProfile.verificationStatus !== VERIFICATION_STATUS.VERIFIED) {
    throw ApiError.badRequest('Responder is not verified');
  }
  if (!responderProfile.isAvailable) throw ApiError.badRequest('Responder is marked unavailable');
  if (responderProfile.activeAssignment) throw ApiError.conflict('Responder already has an active assignment');

  const hospitalId = input.hospital
    ? oid(input.hospital)
    : actor.role === ROLES.HOSPITAL
      ? await hospitalIdFor(actor.id)
      : null;

  const expiresAt = addMinutes(new Date(), ACCESS_GRANT_HOURS * 60);

  const assignment = await ResponderAssignment.create({
    request: request._id,
    responder: oid(input.responder),
    hospital: hospitalId,
    assignedBy: oid(actor.id),
    status: 'offered',
    offerExpiresAt: addMinutes(new Date(), input.offerMinutes),
    destination: input.destinationHospital ? { hospital: oid(input.destinationHospital) } : undefined,
    notes: input.notes,
  });

  request.assignment = assignment._id;
  request.assignedResponder = oid(input.responder);
  if (hospitalId) request.assignedHospital = hospitalId;
  request.status = EMERGENCY_STATUS.ASSIGNED;
  request.statusHistory.push({ status: EMERGENCY_STATUS.ASSIGNED, at: new Date(), by: oid(actor.id) });
  // Time-boxed read access, scoped to this incident.
  request.accessGrantedTo.push({
    user: oid(input.responder),
    role: ROLES.RESPONDER,
    grantedAt: new Date(),
    expiresAt,
  });
  await request.save();

  auditAsync({
    actor, action: 'assign', resourceType: 'emergency_request', resourceId: requestId,
    subject: request.patient, metadata: { responder: input.responder, assignment: String(assignment._id) },
  });

  await Promise.all([
    notify({
      user: input.responder,
      type: 'emergency.assigned',
      title: 'New emergency assignment',
      body: `${request.emergencyType} (${request.severity}). Accept within ${input.offerMinutes} minutes.`,
      data: { requestId, assignmentId: String(assignment._id) },
      priority: 'critical',
    }),
    notify({
      user: request.patient,
      type: 'emergency.responder_assigned',
      title: 'Help is on the way',
      body: 'A responder has been assigned to your emergency.',
      data: { requestId },
      priority: 'critical',
    }),
  ]);

  return { request, assignment };
};

export const acceptAssignment = async (actor: AuthenticatedUser, assignmentId: string, etaMinutes?: number) => {
  const assignment = await ResponderAssignment.findById(assignmentId);
  if (!assignment) throw ApiError.notFound('Assignment not found');
  if (String(assignment.responder) !== actor.id) throw ApiError.forbidden('This assignment is not yours');
  if (assignment.status !== 'offered') throw ApiError.badRequest(`Assignment is already ${assignment.status}`);

  if (assignment.offerExpiresAt.getTime() < Date.now()) {
    assignment.status = 'expired';
    await assignment.save();
    throw ApiError.badRequest('This offer has expired');
  }

  assignment.status = 'accepted';
  assignment.respondedAt = new Date();
  assignment.startedAt = new Date();
  assignment.etaMinutes = etaMinutes;
  await assignment.save();

  await ResponderProfile.updateOne(
    { user: oid(actor.id) },
    { $set: { activeAssignment: assignment._id, isAvailable: false } },
  );

  const request = await EmergencyRequest.findById(assignment.request);
  if (request) {
    request.status = EMERGENCY_STATUS.ACCEPTED;
    request.statusHistory.push({ status: EMERGENCY_STATUS.ACCEPTED, at: new Date(), by: oid(actor.id) });
    await request.save();

    await notify({
      user: request.patient,
      type: 'emergency.accepted',
      title: 'Responder accepted',
      body: etaMinutes ? `Estimated arrival in ${etaMinutes} minutes.` : 'A responder is on the way.',
      data: { requestId: String(request._id) },
      priority: 'critical',
    });
  }

  auditAsync({
    actor, action: 'status_change', resourceType: 'responder_assignment', resourceId: assignmentId,
    subject: request?.patient ?? null, metadata: { status: 'accepted', etaMinutes },
  });

  return assignment;
};

export const declineAssignment = async (actor: AuthenticatedUser, assignmentId: string, reason?: string) => {
  const assignment = await ResponderAssignment.findById(assignmentId);
  if (!assignment) throw ApiError.notFound('Assignment not found');
  if (String(assignment.responder) !== actor.id) throw ApiError.forbidden('This assignment is not yours');
  if (assignment.status !== 'offered') throw ApiError.badRequest(`Assignment is already ${assignment.status}`);

  assignment.status = 'declined';
  assignment.respondedAt = new Date();
  assignment.declineReason = reason;
  await assignment.save();

  // Release the request so dispatch can offer it to someone else.
  const request = await EmergencyRequest.findById(assignment.request);
  if (request) {
    request.assignedResponder = null;
    request.assignment = null;
    request.status = EMERGENCY_STATUS.NOTIFIED;
    request.accessGrantedTo = request.accessGrantedTo.filter((g) => String(g.user) !== actor.id);
    request.statusHistory.push({
      status: EMERGENCY_STATUS.NOTIFIED, at: new Date(), by: oid(actor.id), note: `Declined: ${reason ?? 'no reason'}`,
    });
    await request.save();
  }

  return assignment;
};

/* -------------------------------- status ------------------------------- */

const CAN_SET_STATUS: Record<string, string[]> = {
  en_route: [ROLES.RESPONDER],
  arrived: [ROLES.RESPONDER],
  transporting: [ROLES.RESPONDER],
  at_hospital: [ROLES.RESPONDER, ROLES.HOSPITAL],
  completed: [ROLES.RESPONDER, ROLES.HOSPITAL, ROLES.ADMIN],
  cancelled: [ROLES.PATIENT, ROLES.ASHA, ROLES.HOSPITAL, ROLES.ADMIN],
};

export const updateStatus = async (
  actor: AuthenticatedUser,
  requestId: string,
  status: EmergencyStatus,
  note?: string,
  outcome?: string,
) => {
  const request = await loadAccessibleRequest(actor, requestId);

  const allowedNext = EMERGENCY_TRANSITIONS[request.status];
  if (!allowedNext.includes(status)) {
    throw ApiError.badRequest(
      `Cannot move from ${request.status} to ${status}. Allowed: ${allowedNext.join(', ') || 'none'}`,
    );
  }

  const allowedRoles = CAN_SET_STATUS[status];
  if (allowedRoles && !allowedRoles.includes(actor.role)) {
    throw ApiError.forbidden(`Role ${actor.role} cannot set status "${status}"`);
  }
  if (status === 'cancelled' && actor.role === ROLES.PATIENT && String(request.patient) !== actor.id) {
    throw ApiError.forbidden('Only the patient can cancel their own request');
  }

  request.status = status;
  request.statusHistory.push({ status, at: new Date(), by: oid(actor.id), note });

  if (TERMINAL_EMERGENCY_STATUSES.includes(status)) {
    request.resolvedAt = new Date();
    request.outcome = outcome;
    if (status === EMERGENCY_STATUS.CANCELLED) request.cancellationReason = note;

    if (request.assignment) {
      await ResponderAssignment.updateOne(
        { _id: request.assignment },
        { $set: { status: status === EMERGENCY_STATUS.COMPLETED ? 'completed' : 'cancelled', completedAt: new Date() } },
      );
    }
    if (request.assignedResponder) {
      await ResponderProfile.updateOne(
        { user: request.assignedResponder },
        {
          $set: { activeAssignment: null, isAvailable: true },
          ...(status === EMERGENCY_STATUS.COMPLETED ? { $inc: { 'stats.completedAssignments': 1 } } : {}),
        },
      );
    }
    // Read access ends with the incident.
    request.accessGrantedTo = request.accessGrantedTo.map((g) => ({ ...g, expiresAt: new Date() }));
  }

  await request.save();

  auditAsync({
    actor, action: 'status_change', resourceType: 'emergency_request', resourceId: requestId,
    subject: request.patient, metadata: { status, note },
  });

  await notify({
    user: request.patient,
    type: `emergency.${status}`,
    title: 'Emergency update',
    body: note ?? `Your emergency request is now ${status.replace(/_/g, ' ')}.`,
    data: { requestId },
    priority: 'critical',
  });

  return request;
};

/* ------------------------------- tracking ------------------------------ */

export const recordLocation = async (
  actor: AuthenticatedUser,
  requestId: string,
  input: {
    location: [number, number]; accuracyMeters?: number; speedKph?: number;
    headingDegrees?: number; source: 'app' | 'device' | 'manual'; deviceId?: string; recordedAt?: Date;
  },
) => {
  const request = await loadAccessibleRequest(actor, requestId);
  if (TERMINAL_EMERGENCY_STATUSES.includes(request.status)) {
    throw ApiError.badRequest('This emergency is closed; location updates are no longer accepted');
  }

  const isResponder = request.assignedResponder && String(request.assignedResponder) === actor.id;
  const isPatientSide = String(request.patient) === actor.id || String(request.raisedBy) === actor.id;
  if (!isResponder && !isPatientSide) {
    throw ApiError.forbidden('Only the assigned responder or the patient side can post locations');
  }

  const update = await LocationUpdate.create({
    request: request._id,
    assignment: request.assignment,
    reporter: oid(actor.id),
    reporterRole: actor.role,
    source: input.source,
    deviceId: input.deviceId,
    location: { type: 'Point', coordinates: input.location },
    accuracyMeters: input.accuracyMeters,
    speedKph: input.speedKph,
    headingDegrees: input.headingDegrees,
    recordedAt: input.recordedAt ?? new Date(),
  });

  if (isResponder) {
    await ResponderProfile.updateOne(
      { user: oid(actor.id) },
      { $set: { currentLocation: { type: 'Point', coordinates: input.location }, locationUpdatedAt: new Date() } },
    );
  }

  return update;
};

export const getTracking = async (actor: AuthenticatedUser, requestId: string) => {
  const request = await loadAccessibleRequest(actor, requestId);

  const [latest, trail] = await Promise.all([
    LocationUpdate.findOne({ request: request._id, reporterRole: ROLES.RESPONDER })
      .sort({ recordedAt: -1 })
      .lean(),
    LocationUpdate.find({ request: request._id })
      .sort({ recordedAt: -1 })
      .limit(50)
      .select('location recordedAt speedKph reporterRole')
      .lean(),
  ]);

  const pickup = request.pickupLocation.coordinates as [number, number];
  const responderAt = latest?.location.coordinates as [number, number] | undefined;
  const distanceKm = responderAt ? Number(haversineKm(responderAt, pickup).toFixed(2)) : null;

  // Simple ETA from the last reported speed; falls back to a 30km/h urban average.
  const speed = latest?.speedKph && latest.speedKph > 5 ? latest.speedKph : 30;
  const etaMinutes = distanceKm !== null ? Math.max(1, Math.round((distanceKm / speed) * 60)) : null;

  return {
    requestId,
    status: request.status,
    pickup: { coordinates: pickup, address: request.pickupAddress },
    destination: request.assignedHospital,
    responder: {
      user: request.assignedResponder,
      lastKnown: responderAt ?? null,
      lastUpdatedAt: latest?.recordedAt ?? null,
    },
    distanceKm,
    etaMinutes,
    trail,
  };
};

export const getHistory = async (
  actor: AuthenticatedUser,
  query: { page?: number; limit?: number },
) => {
  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> = {
    status: { $in: TERMINAL_EMERGENCY_STATUSES },
  };

  if (actor.role === ROLES.RESPONDER) filter.assignedResponder = oid(actor.id);
  else if (actor.role === ROLES.HOSPITAL) {
    const hospitalId = await hospitalIdFor(actor.id);
    filter.assignedHospital = hospitalId;
  } else filter.$or = [{ patient: oid(actor.id) }, { raisedBy: oid(actor.id) }];

  const [items, total] = await Promise.all([
    EmergencyRequest.find(filter)
      .populate('patient', 'name')
      .sort({ resolvedAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    EmergencyRequest.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};
