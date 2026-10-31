import { Model, Types } from 'mongoose';
import {
  ACCOUNT_STATUS,
  AccountStatus,
  CONSENT_STATUS,
  ROLES,
  TERMINAL_EMERGENCY_STATUSES,
  VERIFICATION_STATUS,
  VerificationStatus,
} from '../../shared/constants';
import { AuthenticatedUser } from '../../shared/types';
import { ApiError } from '../../shared/utils/ApiError';
import { pageMeta, parsePagination } from '../../shared/utils/pagination';
import { auditAsync } from '../../shared/services/audit.service';
import { notify } from '../../shared/services/notification.service';
import { Appointment } from '../appointments/appointment.model';
import { AshaAssignment, AshaProfile } from '../asha/asha.model';
import { AuditLog } from '../audit/audit.model';
import { User } from '../auth/auth.model';
import { Consent } from '../consent/consent.model';
import { Consultation } from '../doctor/consultation.model';
import { DoctorProfile } from '../doctor/doctor.model';
import { EmergencyRequest } from '../emergency/emergency.model';
import { HospitalProfile } from '../hospital/hospital.model';
import { Medicine } from '../intelligence/medicines/medicine.model';
import { ResponderProfile } from '../responder/responder.model';

const oid = (v: string | Types.ObjectId) => (typeof v === 'string' ? new Types.ObjectId(v) : v);

const PROFILE_MODELS: Record<string, Model<any>> = {
  doctor: DoctorProfile,
  asha: AshaProfile,
  hospital: HospitalProfile,
  responder: ResponderProfile,
};

export const listUsers = async (query: {
  role?: string; status?: string; q?: string; page?: number; limit?: number;
}) => {
  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> = {};
  if (query.role) filter.role = query.role;
  if (query.status) filter.status = query.status;
  if (query.q) {
    filter.$or = [
      { name: { $regex: query.q, $options: 'i' } },
      { phone: { $regex: query.q, $options: 'i' } },
      { email: { $regex: query.q, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(page.skip).limit(page.limit).lean(),
    User.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

export const updateUserStatus = async (
  actor: AuthenticatedUser,
  userId: string,
  status: AccountStatus,
  reason?: string,
) => {
  if (userId === actor.id) throw ApiError.badRequest('You cannot change your own account status');

  const user = await User.findById(userId).select('+sessions');
  if (!user) throw ApiError.notFound('User not found');

  user.status = status;
  if (status !== ACCOUNT_STATUS.ACTIVE) {
    // Suspension must take effect immediately, not at token expiry.
    user.sessions.forEach((s) => (s.revokedAt = s.revokedAt ?? new Date()));
  }
  await user.save();

  auditAsync({
    actor, action: 'status_change', resourceType: 'user', resourceId: userId,
    metadata: { status, reason },
  });

  await notify({
    user: userId,
    type: 'account.status_changed',
    title: `Your account is now ${status}`,
    body: reason ?? `An administrator set your account status to ${status}.`,
    priority: 'high',
  });

  return user.toJSON();
};

/** Everything awaiting verification, across all staff roles. */
export const verificationQueue = async (query: {
  role?: string; status: VerificationStatus; page?: number; limit?: number;
}) => {
  const page = parsePagination(query as Record<string, unknown>);
  const roles = query.role ? [query.role] : Object.keys(PROFILE_MODELS);

  const groups = await Promise.all(
    roles.map(async (role) => {
      const items = await PROFILE_MODELS[role]
        .find({ verificationStatus: query.status })
        .populate('user', 'name phone email status createdAt')
        .sort({ createdAt: 1 })
        .limit(page.limit)
        .lean();
      return { role, count: items.length, items };
    }),
  );

  return { status: query.status, groups };
};

export const verifyEntity = async (
  actor: AuthenticatedUser,
  userId: string,
  role: string,
  status: VerificationStatus,
  reason?: string,
) => {
  const Model = PROFILE_MODELS[role];
  if (!Model) throw ApiError.badRequest(`Unsupported role: ${role}`);

  const profile = await Model.findOne({ user: oid(userId) });
  if (!profile) throw ApiError.notFound(`${role} profile not found`);

  profile.verificationStatus = status;
  profile.verifiedBy = oid(actor.id);
  profile.verifiedAt = new Date();
  if (status === VERIFICATION_STATUS.REJECTED && 'rejectionReason' in profile) {
    profile.rejectionReason = reason;
  }
  await profile.save();

  await User.updateOne(
    { _id: oid(userId) },
    { $set: { status: status === VERIFICATION_STATUS.VERIFIED ? ACCOUNT_STATUS.ACTIVE : ACCOUNT_STATUS.PENDING } },
  );

  auditAsync({ actor, action: 'verify', resourceType: role, resourceId: userId, metadata: { status, reason } });

  await notify({
    user: userId,
    type: 'verification.updated',
    title: `Your ${role} profile was ${status}`,
    body: reason ?? `Your profile is now ${status}.`,
    priority: 'high',
  });

  return profile;
};

/** Platform-wide health: adoption, operations and access-control posture. */
export const getDashboard = async () => {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 864e5);
  const weekAgo = new Date(now.getTime() - 7 * 864e5);

  const [
    usersByRole,
    newUsers24h,
    pendingVerifications,
    appointments7d,
    consultations7d,
    openEmergencies,
    emergencies7d,
    activeConsents,
    expiringAssignments,
    deniedAccess7d,
    medicinesVerified,
  ] = await Promise.all([
    User.aggregate([{ $group: { _id: { role: '$role', status: '$status' }, count: { $sum: 1 } } }]),
    User.countDocuments({ createdAt: { $gte: dayAgo } }),
    Promise.all(
      Object.entries(PROFILE_MODELS).map(async ([role, Model]) => ({
        role,
        count: await Model.countDocuments({ verificationStatus: VERIFICATION_STATUS.PENDING }),
      })),
    ),
    Appointment.countDocuments({ createdAt: { $gte: weekAgo } }),
    Consultation.countDocuments({ createdAt: { $gte: weekAgo } }),
    EmergencyRequest.countDocuments({ status: { $nin: TERMINAL_EMERGENCY_STATUSES } }),
    EmergencyRequest.countDocuments({ createdAt: { $gte: weekAgo } }),
    Consent.countDocuments({ status: CONSENT_STATUS.ACTIVE, expiresAt: { $gt: now } }),
    AshaAssignment.countDocuments({
      status: 'active',
      expiresAt: { $gt: now, $lt: new Date(now.getTime() + 14 * 864e5) },
    }),
    AuditLog.countDocuments({ outcome: 'denied', createdAt: { $gte: weekAgo } }),
    Medicine.countDocuments({ isVerified: true }),
  ]);

  return {
    users: { byRoleAndStatus: usersByRole, newLast24h: newUsers24h },
    verification: { pending: pendingVerifications },
    activity: { appointmentsLast7d: appointments7d, consultationsLast7d: consultations7d },
    emergency: { open: openEmergencies, last7d: emergencies7d },
    privacy: {
      activeConsents,
      ashaAssignmentsExpiringIn14Days: expiringAssignments,
      accessDenialsLast7d: deniedAccess7d,
    },
    catalogue: { verifiedMedicines: medicinesVerified },
  };
};

/** Access-control report: who looked at patient data, and what was blocked. */
export const getAccessReport = async (days = 7) => {
  const since = new Date(Date.now() - days * 864e5);

  const [byRole, denials, topSubjects] = await Promise.all([
    AuditLog.aggregate([
      { $match: { createdAt: { $gte: since }, action: 'read', subject: { $ne: null } } },
      { $group: { _id: '$actorRole', reads: { $sum: 1 } } },
      { $sort: { reads: -1 } },
    ]),
    AuditLog.aggregate([
      { $match: { createdAt: { $gte: since }, outcome: 'denied' } },
      { $group: { _id: { role: '$actorRole', resource: '$resourceType' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]),
    AuditLog.aggregate([
      { $match: { createdAt: { $gte: since }, subject: { $ne: null } } },
      { $group: { _id: '$subject', accesses: { $sum: 1 } } },
      { $sort: { accesses: -1 } },
      { $limit: 10 },
    ]),
  ]);

  return { period: { since, days }, readsByRole: byRole, denials, mostAccessedSubjects: topSubjects };
};
