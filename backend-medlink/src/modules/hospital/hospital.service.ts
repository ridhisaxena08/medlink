import { Types } from 'mongoose';
import {
  ACCOUNT_STATUS,
  APPOINTMENT_STATUS,
  ROLES,
  TERMINAL_EMERGENCY_STATUSES,
  VERIFICATION_STATUS,
  VerificationStatus,
} from '../../shared/constants';
import { AuthenticatedUser } from '../../shared/types';
import { ApiError } from '../../shared/utils/ApiError';
import { endOfDay, startOfDay } from '../../shared/utils/dates';
import { pageMeta, parsePagination } from '../../shared/utils/pagination';
import { withTransaction } from '../../shared/utils/transaction';
import { auditAsync } from '../../shared/services/audit.service';
import { notify } from '../../shared/services/notification.service';
import { Appointment } from '../appointments/appointment.model';
import { AshaProfile } from '../asha/asha.model';
import { User, hashPassword } from '../auth/auth.model';
import { Consultation } from '../doctor/consultation.model';
import { DoctorProfile } from '../doctor/doctor.model';
import { EmergencyRequest } from '../emergency/emergency.model';
import { Department, HospitalProfile, IHospitalProfile } from './hospital.model';

const oid = (v: string | Types.ObjectId) => (typeof v === 'string' ? new Types.ObjectId(v) : v);

export const resolveHospital = async (hospitalUserId: string): Promise<IHospitalProfile> => {
  const hospital = await HospitalProfile.findOne({ user: oid(hospitalUserId) });
  if (!hospital) throw ApiError.notFound('Hospital profile not found');
  return hospital;
};

export const getProfile = async (hospitalUserId: string) => {
  const [user, profile] = await Promise.all([
    User.findById(hospitalUserId).lean(),
    HospitalProfile.findOne({ user: oid(hospitalUserId) }).lean(),
  ]);
  if (!user || user.role !== ROLES.HOSPITAL) throw ApiError.notFound('Hospital not found');
  return { ...user, profile };
};

export const updateProfile = async (hospitalUserId: string, updates: Record<string, any>) => {
  const { name, ...rest } = updates;
  if (name) await User.updateOne({ _id: oid(hospitalUserId) }, { $set: { name } });

  if (rest.address?.coordinates) {
    rest.address.location = { type: 'Point', coordinates: rest.address.coordinates };
    delete rest.address.coordinates;
  }

  const flattened: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Merge nested objects field-by-field so a partial update never wipes siblings.
      for (const [childKey, childValue] of Object.entries(value as Record<string, unknown>)) {
        flattened[`${key}.${childKey}`] = childValue;
      }
    } else {
      flattened[key] = value;
    }
  }

  const profile = await HospitalProfile.findOneAndUpdate(
    { user: oid(hospitalUserId) },
    { $set: flattened },
    { new: true, runValidators: true },
  );
  if (!profile) throw ApiError.notFound('Hospital profile not found');
  return profile;
};

/* ------------------------- doctor management --------------------------- */

/** Creates a doctor account already attached to (and verified by) this hospital. */
export const registerDoctor = async (actor: AuthenticatedUser, input: Record<string, any>) => {
  const hospital = await resolveHospital(actor.id);

  const existing = await User.findOne({
    $or: [{ phone: input.phone }, ...(input.email ? [{ email: input.email.toLowerCase() }] : [])],
  }).lean();
  if (existing) throw ApiError.conflict('An account with this phone or email already exists');

  const { user, profile } = await withTransaction(async (session) => {
    const [user] = await User.create(
      [
        {
          name: input.name,
          phone: input.phone,
          email: input.email?.toLowerCase(),
          passwordHash: await hashPassword(input.password),
          role: ROLES.DOCTOR,
          status: ACCOUNT_STATUS.ACTIVE,
        },
      ],
      { session },
    );

    const [profile] = await DoctorProfile.create(
      [
        {
          user: user._id,
          registrationNumber: input.registrationNumber,
          specialties: input.specialties,
          qualifications: input.qualifications,
          experienceYears: input.experienceYears,
          languages: input.languages,
          departments: input.departments,
          consultationFee: input.consultationFee,
          hospitals: [hospital._id],
          verificationStatus: VERIFICATION_STATUS.VERIFIED,
          verifiedBy: oid(actor.id),
          verifiedAt: new Date(),
        },
      ],
      { session },
    );

    user.profileId = profile._id;
    await user.save({ session });
    return { user, profile };
  });

  auditAsync({
    actor, action: 'create', resourceType: 'doctor', resourceId: String(user._id),
    metadata: { hospital: String(hospital._id), verified: true },
  });

  return { user: user.toJSON(), profile };
};

export const linkDoctor = async (actor: AuthenticatedUser, doctorUserId: string) => {
  const hospital = await resolveHospital(actor.id);
  const profile = await DoctorProfile.findOne({ user: oid(doctorUserId) });
  if (!profile) throw ApiError.notFound('Doctor not found');

  if (profile.hospitals.some((h) => String(h) === String(hospital._id))) {
    throw ApiError.conflict('Doctor is already linked to this hospital');
  }
  profile.hospitals.push(hospital._id);
  await profile.save();

  auditAsync({
    actor, action: 'update', resourceType: 'doctor', resourceId: doctorUserId,
    metadata: { linkedHospital: String(hospital._id) },
  });

  return profile;
};

export const listDoctors = async (
  actor: AuthenticatedUser,
  query: { verificationStatus?: string; q?: string; page?: number; limit?: number },
) => {
  const hospital = await resolveHospital(actor.id);
  const page = parsePagination(query as Record<string, unknown>);

  const filter: Record<string, unknown> = { hospitals: hospital._id };
  if (query.verificationStatus) filter.verificationStatus = query.verificationStatus;

  const [items, total] = await Promise.all([
    DoctorProfile.find(filter)
      .populate('user', 'name phone email status')
      .sort({ createdAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    DoctorProfile.countDocuments(filter),
  ]);

  const filtered = query.q
    ? items.filter((d) =>
        ((d.user as unknown as { name?: string })?.name ?? '').toLowerCase().includes(query.q!.toLowerCase()),
      )
    : items;

  return { items: filtered, meta: pageMeta(total, page) };
};

export const verifyDoctor = async (
  actor: AuthenticatedUser,
  doctorUserId: string,
  status: VerificationStatus,
  reason?: string,
) => {
  const hospital = actor.role === ROLES.HOSPITAL ? await resolveHospital(actor.id) : null;
  const profile = await DoctorProfile.findOne({ user: oid(doctorUserId) });
  if (!profile) throw ApiError.notFound('Doctor not found');

  if (hospital && !profile.hospitals.some((h) => String(h) === String(hospital._id))) {
    throw ApiError.forbidden('This doctor is not affiliated with your facility');
  }

  profile.verificationStatus = status;
  profile.verifiedBy = oid(actor.id);
  profile.verifiedAt = new Date();
  if (status === VERIFICATION_STATUS.REJECTED) profile.rejectionReason = reason;
  await profile.save();

  // A verified clinician needs an active account to do anything.
  await User.updateOne(
    { _id: oid(doctorUserId) },
    { $set: { status: status === VERIFICATION_STATUS.VERIFIED ? ACCOUNT_STATUS.ACTIVE : ACCOUNT_STATUS.PENDING } },
  );

  auditAsync({
    actor, action: 'verify', resourceType: 'doctor', resourceId: doctorUserId,
    metadata: { status, reason },
  });

  await notify({
    user: doctorUserId,
    type: 'verification.updated',
    title: `Your profile was ${status}`,
    body: reason ?? `Your doctor profile is now ${status}.`,
    priority: 'high',
  });

  return profile;
};

/* --------------------------- departments ------------------------------- */

export const createDepartment = async (actor: AuthenticatedUser, input: Record<string, any>) => {
  const hospital = await resolveHospital(actor.id);
  const department = await Department.create({
    ...input,
    hospital: hospital._id,
    headDoctor: input.headDoctor ? oid(input.headDoctor) : null,
  });
  auditAsync({
    actor, action: 'create', resourceType: 'department', resourceId: String(department._id),
  });
  return department;
};

export const listDepartments = async (actor: AuthenticatedUser) => {
  const hospital = await resolveHospital(actor.id);
  return Department.find({ hospital: hospital._id }).populate('headDoctor', 'name').sort({ name: 1 }).lean();
};

/* ---------------------------- ASHA management -------------------------- */

export const registerAsha = async (actor: AuthenticatedUser, input: Record<string, any>) => {
  const hospital = await resolveHospital(actor.id);

  const existing = await User.findOne({ phone: input.phone }).lean();
  if (existing) throw ApiError.conflict('An account with this phone already exists');

  const { user, profile } = await withTransaction(async (session) => {
    const [user] = await User.create(
      [
        {
          name: input.name,
          phone: input.phone,
          passwordHash: await hashPassword(input.password),
          role: ROLES.ASHA,
          status: ACCOUNT_STATUS.ACTIVE,
          preferredLanguage: 'hi',
        },
      ],
      { session },
    );

    const [profile] = await AshaProfile.create(
      [
        {
          user: user._id,
          ashaId: input.ashaId,
          district: input.district,
          state: input.state,
          block: input.block,
          village: input.village,
          languages: input.languages,
          hospital: hospital._id,
          verificationStatus: VERIFICATION_STATUS.VERIFIED,
          verifiedBy: oid(actor.id),
          verifiedAt: new Date(),
        },
      ],
      { session },
    );

    user.profileId = profile._id;
    await user.save({ session });
    return { user, profile };
  });

  auditAsync({
    actor, action: 'create', resourceType: 'asha', resourceId: String(user._id),
    metadata: { hospital: String(hospital._id) },
  });

  return { user: user.toJSON(), profile };
};

export const listAshaWorkers = async (
  actor: AuthenticatedUser,
  query: { verificationStatus?: string; page?: number; limit?: number },
) => {
  const hospital = await resolveHospital(actor.id);
  const page = parsePagination(query as Record<string, unknown>);

  const filter: Record<string, unknown> = { hospital: hospital._id };
  if (query.verificationStatus) filter.verificationStatus = query.verificationStatus;

  const [items, total] = await Promise.all([
    AshaProfile.find(filter)
      .populate('user', 'name phone status')
      .sort({ createdAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    AshaProfile.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

export const verifyAsha = async (
  actor: AuthenticatedUser,
  ashaUserId: string,
  status: VerificationStatus,
  reason?: string,
) => {
  const profile = await AshaProfile.findOne({ user: oid(ashaUserId) });
  if (!profile) throw ApiError.notFound('ASHA worker not found');

  if (actor.role === ROLES.HOSPITAL) {
    const hospital = await resolveHospital(actor.id);
    if (String(profile.hospital) !== String(hospital._id)) {
      throw ApiError.forbidden('This worker is not attached to your facility');
    }
  }

  profile.verificationStatus = status;
  profile.verifiedBy = oid(actor.id);
  profile.verifiedAt = new Date();
  await profile.save();

  await User.updateOne(
    { _id: oid(ashaUserId) },
    { $set: { status: status === VERIFICATION_STATUS.VERIFIED ? ACCOUNT_STATUS.ACTIVE : ACCOUNT_STATUS.PENDING } },
  );

  auditAsync({ actor, action: 'verify', resourceType: 'asha', resourceId: ashaUserId, metadata: { status, reason } });

  return profile;
};

/* ------------------------------ operations ----------------------------- */

export const listAppointments = async (
  actor: AuthenticatedUser,
  query: { status?: string; from?: Date; to?: Date; page?: number; limit?: number },
) => {
  const hospital = await resolveHospital(actor.id);
  const page = parsePagination(query as Record<string, unknown>);

  const filter: Record<string, unknown> = { hospital: hospital._id };
  if (query.status) filter.status = query.status;
  if (query.from || query.to) {
    filter.scheduledStart = {
      ...(query.from ? { $gte: query.from } : {}),
      ...(query.to ? { $lte: query.to } : {}),
    };
  }

  const [items, total] = await Promise.all([
    Appointment.find(filter)
      .populate('patient', 'name phone')
      .populate('doctor', 'name')
      .sort({ scheduledStart: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    Appointment.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

export const listEmergencyRequests = async (
  actor: AuthenticatedUser,
  query: { status?: string; page?: number; limit?: number },
) => {
  const hospital = await resolveHospital(actor.id);
  const page = parsePagination(query as Record<string, unknown>);

  const filter: Record<string, unknown> = {
    $or: [{ assignedHospital: hospital._id }, { notifiedHospitals: hospital._id }],
  };
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    EmergencyRequest.find(filter)
      .populate('patient', 'name phone')
      .populate('assignedResponder', 'name phone')
      .sort({ createdAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    EmergencyRequest.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

export const getDashboard = async (hospitalUserId: string) => {
  const hospital = await resolveHospital(hospitalUserId);
  const now = new Date();

  const [todayAppointments, pending, doctors, ashaWorkers, departments, openEmergencies, weekConsultations] =
    await Promise.all([
      Appointment.countDocuments({
        hospital: hospital._id,
        scheduledStart: { $gte: startOfDay(now), $lte: endOfDay(now) },
        status: { $nin: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.REJECTED] },
      }),
      Appointment.countDocuments({ hospital: hospital._id, status: APPOINTMENT_STATUS.REQUESTED }),
      DoctorProfile.countDocuments({ hospitals: hospital._id }),
      AshaProfile.countDocuments({ hospital: hospital._id }),
      Department.countDocuments({ hospital: hospital._id, isActive: true }),
      EmergencyRequest.countDocuments({
        $or: [{ assignedHospital: hospital._id }, { notifiedHospitals: hospital._id }],
        status: { $nin: TERMINAL_EMERGENCY_STATUSES },
      }),
      Consultation.countDocuments({
        hospital: hospital._id,
        consultedAt: { $gte: new Date(now.getTime() - 7 * 864e5) },
      }),
    ]);

  return {
    hospital: {
      id: hospital._id,
      name: hospital.name,
      verificationStatus: hospital.verificationStatus,
      bedCapacity: hospital.bedCapacity,
      acceptsEmergencies: hospital.acceptsEmergencies,
    },
    appointments: { today: todayAppointments, pendingRequests: pending },
    staff: { doctors, ashaWorkers, departments },
    emergency: { open: openEmergencies },
    consultationsThisWeek: weekConsultations,
  };
};

/** Operational statistics over a date window. */
export const getReports = async (hospitalUserId: string, from?: Date, to?: Date) => {
  const hospital = await resolveHospital(hospitalUserId);
  const start = from ?? new Date(Date.now() - 30 * 864e5);
  const end = to ?? new Date();

  const [byStatus, byDoctor, emergencyByType, consultations] = await Promise.all([
    Appointment.aggregate([
      { $match: { hospital: hospital._id, scheduledStart: { $gte: start, $lte: end } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Appointment.aggregate([
      { $match: { hospital: hospital._id, scheduledStart: { $gte: start, $lte: end } } },
      { $group: { _id: '$doctor', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'doctor' } },
      { $project: { count: 1, doctor: { $arrayElemAt: ['$doctor.name', 0] } } },
    ]),
    EmergencyRequest.aggregate([
      {
        $match: {
          $or: [{ assignedHospital: hospital._id }, { notifiedHospitals: hospital._id }],
          createdAt: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: { type: '$emergencyType', severity: '$severity' }, count: { $sum: 1 } } },
    ]),
    Consultation.countDocuments({ hospital: hospital._id, consultedAt: { $gte: start, $lte: end } }),
  ]);

  return {
    period: { from: start, to: end },
    appointments: { byStatus, topDoctors: byDoctor },
    emergency: { byTypeAndSeverity: emergencyByType },
    consultations,
  };
};
