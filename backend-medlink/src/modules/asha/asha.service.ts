import { Types } from 'mongoose';
import crypto from 'crypto';
import { env } from '../../config/environment';
import {
  ACCOUNT_STATUS,
  CONSENT_SCOPES,
  CONSENT_STATUS,
  ConsentScope,
  ROLES,
  VERIFICATION_STATUS,
} from '../../shared/constants';
import { AuthenticatedUser } from '../../shared/types';
import { ApiError } from '../../shared/utils/ApiError';
import { addDays, endOfDay, startOfDay } from '../../shared/utils/dates';
import { pageMeta, parsePagination } from '../../shared/utils/pagination';
import { withTransaction } from '../../shared/utils/transaction';
import { assertPatientAccess } from '../../shared/services/access.service';
import { auditAsync } from '../../shared/services/audit.service';
import { notify } from '../../shared/services/notification.service';
import { User, hashPassword } from '../auth/auth.model';
import { Appointment } from '../appointments/appointment.model';
import { Consent } from '../consent/consent.model';
import { EmergencyRequest } from '../emergency/emergency.model';
import { PatientProfile } from '../patient/patient.model';
import { AshaAssignment, AshaProfile, FollowUp, IAshaAssignment } from './asha.model';

const oid = (v: string | Types.ObjectId) => (typeof v === 'string' ? new Types.ObjectId(v) : v);

export const getProfile = async (ashaUserId: string) => {
  const [user, profile] = await Promise.all([
    User.findById(ashaUserId).lean(),
    AshaProfile.findOne({ user: oid(ashaUserId) }).populate('hospital', 'name address.district').lean(),
  ]);
  if (!user || user.role !== ROLES.ASHA) throw ApiError.notFound('ASHA worker not found');
  return { ...user, profile };
};

export const updateProfile = async (ashaUserId: string, updates: Record<string, unknown>) => {
  const { name, coverageArea, ...rest } = updates as {
    name?: string; coverageArea?: [number, number];
  } & Record<string, unknown>;
  if (name) await User.updateOne({ _id: oid(ashaUserId) }, { $set: { name } });

  const profile = await AshaProfile.findOneAndUpdate(
    { user: oid(ashaUserId) },
    {
      $set: {
        ...rest,
        ...(coverageArea ? { coverageArea: { type: 'Point', coordinates: coverageArea } } : {}),
      },
    },
    { new: true, runValidators: true },
  );
  if (!profile) throw ApiError.notFound('ASHA profile not found');
  return profile;
};

const requireVerifiedAsha = async (ashaUserId: string) => {
  const profile = await AshaProfile.findOne({ user: oid(ashaUserId) }).lean();
  if (!profile) throw ApiError.notFound('ASHA profile not found');
  if (profile.verificationStatus !== VERIFICATION_STATUS.VERIFIED) {
    throw ApiError.forbidden('Your ASHA account must be verified before you can work with patients');
  }
  return profile;
};

/* ----------------------------- assignments ----------------------------- */

/**
 * Hospitals and admins assign patients to workers. An ASHA worker can never
 * assign themselves - that would defeat the access model.
 */
export const createAssignment = async (
  actor: AuthenticatedUser,
  input: { asha: string; patient: string; scopes: ConsentScope[]; durationDays?: number; reason?: string },
): Promise<IAshaAssignment> => {
  if (actor.role !== ROLES.HOSPITAL && actor.role !== ROLES.ADMIN) {
    throw ApiError.forbidden('Only a hospital or admin can assign patients to ASHA workers');
  }

  const [asha, patient] = await Promise.all([
    User.findById(input.asha).select('role name').lean(),
    User.findById(input.patient).select('role name').lean(),
  ]);
  if (!asha || asha.role !== ROLES.ASHA) throw ApiError.badRequest('Target user is not an ASHA worker');
  if (!patient || patient.role !== ROLES.PATIENT) throw ApiError.badRequest('Target user is not a patient');

  await requireVerifiedAsha(input.asha);

  const existing = await AshaAssignment.findOne({
    asha: oid(input.asha),
    patient: oid(input.patient),
    status: 'active',
    expiresAt: { $gt: new Date() },
  });
  if (existing) throw ApiError.conflict('An active assignment already exists for this pair');

  const expiresAt = addDays(new Date(), input.durationDays ?? env.access.ashaDefaultAccessDays);

  // Consent must come from the patient separately; the assignment alone grants nothing.
  const consent = await Consent.findOne({
    patient: oid(input.patient),
    grantee: oid(input.asha),
    status: CONSENT_STATUS.ACTIVE,
    expiresAt: { $gt: new Date() },
  }).lean();

  const assignment = await AshaAssignment.create({
    asha: oid(input.asha),
    patient: oid(input.patient),
    assignedBy: oid(actor.id),
    assignedByRole: actor.role === ROLES.ADMIN ? 'admin' : 'hospital',
    scopes: input.scopes,
    reason: input.reason,
    expiresAt,
    consent: consent?._id ?? null,
  });

  auditAsync({
    actor, action: 'assign', resourceType: 'asha_assignment', resourceId: String(assignment._id),
    subject: input.patient, metadata: { asha: input.asha, scopes: input.scopes, expiresAt },
  });

  await Promise.all([
    notify({
      user: input.asha,
      type: 'assignment.created',
      title: 'New patient assigned',
      body: consent
        ? `${patient.name} has been assigned to you.`
        : `${patient.name} has been assigned to you. Record the patient's consent before accessing their records.`,
      data: { assignmentId: String(assignment._id), consentPending: !consent },
    }),
    notify({
      user: input.patient,
      type: 'assignment.created',
      title: 'A health worker was assigned to you',
      body: `${asha.name} can support your care. You can revoke access any time from consent settings.`,
      data: { assignmentId: String(assignment._id) },
    }),
  ]);

  return assignment;
};

export const listAssignments = async (
  actor: AuthenticatedUser,
  query: { status?: string; patient?: string; asha?: string; page?: number; limit?: number },
) => {
  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> = {};

  if (actor.role === ROLES.ASHA) filter.asha = oid(actor.id);
  else if (actor.role === ROLES.PATIENT) filter.patient = oid(actor.id);
  else {
    if (query.asha) filter.asha = oid(query.asha);
    if (query.patient) filter.patient = oid(query.patient);
  }
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    AshaAssignment.find(filter)
      .populate('asha', 'name phone')
      .populate('patient', 'name phone')
      .sort({ createdAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    AshaAssignment.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

export const revokeAssignment = async (actor: AuthenticatedUser, assignmentId: string) => {
  const assignment = await AshaAssignment.findById(assignmentId);
  if (!assignment) throw ApiError.notFound('Assignment not found');

  const isPatient = String(assignment.patient) === actor.id;
  if (!isPatient && actor.role !== ROLES.HOSPITAL && actor.role !== ROLES.ADMIN) {
    throw ApiError.forbidden('Only the patient, the assigning hospital or an admin can revoke this');
  }

  assignment.status = 'revoked';
  assignment.revokedAt = new Date();
  assignment.revokedBy = oid(actor.id);
  await assignment.save();

  auditAsync({
    actor, action: 'update', resourceType: 'asha_assignment', resourceId: assignmentId,
    subject: assignment.patient, metadata: { status: 'revoked' },
  });

  return assignment;
};

/* -------------------------- assisted registration ---------------------- */

/**
 * Creates a patient account on behalf of someone who cannot self-register.
 * Requires recorded (non-in-app) consent evidence, and produces three linked
 * artefacts: the account, the consent record, and a scoped assignment.
 */
export const registerPatient = async (actor: AuthenticatedUser, input: Record<string, any>) => {
  if (actor.role !== ROLES.ASHA) throw ApiError.forbidden('Only ASHA workers use assisted registration');
  await requireVerifiedAsha(actor.id);

  const existing = await User.findOne({ phone: input.phone }).lean();
  if (existing) throw ApiError.conflict('A user with this phone number already exists');

  const tempPassword = input.password ?? crypto.randomBytes(6).toString('base64url');

  const { user, profile, consent, assignment, expiresAt } = await withTransaction(async (session) => {
    const [user] = await User.create(
      [
        {
          name: input.name,
          phone: input.phone,
          passwordHash: await hashPassword(tempPassword),
          role: ROLES.PATIENT,
          status: ACCOUNT_STATUS.ACTIVE,
          preferredLanguage: input.preferredLanguage ?? 'hi',
        },
      ],
      { session },
    );

    const [profile] = await PatientProfile.create(
      [
        {
          user: user._id,
          dateOfBirth: input.dateOfBirth,
          gender: input.gender,
          bloodGroup: input.bloodGroup,
          primaryLanguage: input.preferredLanguage ?? 'hi',
          registeredBy: oid(actor.id),
          registrationChannel: 'asha_assisted',
          address: input.address
            ? {
                ...input.address,
                location: input.address.coordinates
                  ? { type: 'Point', coordinates: input.address.coordinates }
                  : undefined,
              }
            : undefined,
        },
      ],
      { session },
    );

    user.profileId = profile._id;
    await user.save({ session });

    const expiresAt = addDays(new Date(), input.consent.durationDays ?? env.access.ashaDefaultAccessDays);

    const [consent] = await Consent.create(
      [
        {
          patient: user._id,
          grantee: oid(actor.id),
          granteeRole: ROLES.ASHA,
          scopes: input.consent.scopes,
          purpose: 'Assisted registration and ongoing field support',
          grantedBy: oid(actor.id),
          expiresAt,
          evidence: input.consent.evidence,
        },
      ],
      { session },
    );

    const [assignment] = await AshaAssignment.create(
      [
        {
          asha: oid(actor.id),
          patient: user._id,
          assignedBy: oid(actor.id),
          assignedByRole: 'patient',
          scopes: input.consent.scopes,
          reason: 'Assisted registration',
          expiresAt,
          consent: consent._id,
        },
      ],
      { session },
    );

    return { user, profile, consent, assignment, expiresAt };
  });

  auditAsync({
    actor, action: 'create', resourceType: 'patient', resourceId: String(user._id), subject: user._id,
    metadata: {
      channel: 'asha_assisted',
      consentMethod: input.consent.evidence.method,
      scopes: input.consent.scopes,
      expiresAt,
    },
  });

  return {
    patient: user.toJSON(),
    profile,
    consent,
    assignment,
    /** Hand this to the patient so they can sign in and change it. */
    temporaryPassword: input.password ? undefined : tempPassword,
  };
};

/* ------------------------------- patients ------------------------------ */

export const listAssignedPatients = async (
  actor: AuthenticatedUser,
  query: { q?: string; page?: number; limit?: number },
) => {
  const page = parsePagination(query as Record<string, unknown>);

  const assignments = await AshaAssignment.find({
    asha: oid(actor.id),
    status: 'active',
    expiresAt: { $gt: new Date() },
  }).lean();

  const patientIds = assignments.map((a) => a.patient);
  const filter: Record<string, unknown> = { _id: { $in: patientIds } };
  if (query.q) filter.name = { $regex: query.q, $options: 'i' };

  const [users, total] = await Promise.all([
    User.find(filter).select('name phone preferredLanguage').skip(page.skip).limit(page.limit).lean(),
    User.countDocuments(filter),
  ]);

  const consents = await Consent.find({
    grantee: oid(actor.id),
    patient: { $in: users.map((u) => u._id) },
    status: CONSENT_STATUS.ACTIVE,
    expiresAt: { $gt: new Date() },
  }).lean();

  const items = users.map((user) => {
    const assignment = assignments.find((a) => String(a.patient) === String(user._id));
    const consent = consents.find((c) => String(c.patient) === String(user._id));
    return {
      ...user,
      assignment: assignment
        ? { id: assignment._id, scopes: assignment.scopes, expiresAt: assignment.expiresAt }
        : null,
      /** Without an active consent the worker sees the name only, nothing clinical. */
      consent: consent ? { scopes: consent.scopes, expiresAt: consent.expiresAt } : null,
      accessible: Boolean(assignment && consent),
    };
  });

  return { items, meta: pageMeta(total, page) };
};

/* ------------------------------ follow-ups ----------------------------- */

export const createFollowUp = async (actor: AuthenticatedUser, input: Record<string, any>) => {
  await assertPatientAccess(actor, input.patient, CONSENT_SCOPES.MEDICAL_HISTORY, 'followup');

  const followUp = await FollowUp.create({
    asha: oid(actor.id),
    patient: oid(input.patient),
    visitedAt: input.visitedAt ?? new Date(),
    visitType: input.visitType,
    notes: input.notes,
    vitals: input.vitals,
    adherenceReported: input.adherenceReported,
    concerns: input.concerns ?? [],
    referralMade: input.referralMade ?? false,
    referredTo: input.referredTo ? oid(input.referredTo) : null,
    nextVisitDate: input.nextVisitDate ?? null,
    attachments: (input.attachments ?? []).map(oid),
    location: input.location ? { type: 'Point', coordinates: input.location } : undefined,
    syncedFromOffline: input.syncedFromOffline ?? false,
    clientRecordId: input.clientRecordId,
  });

  auditAsync({
    actor, action: 'create', resourceType: 'asha_followup', resourceId: String(followUp._id),
    subject: input.patient, metadata: { visitType: input.visitType },
  });

  if (input.referralMade) {
    await notify({
      user: input.patient,
      type: 'followup.referral',
      title: 'Referral recorded',
      body: 'Your health worker recommended a clinical review. Please book an appointment.',
      data: { followUpId: String(followUp._id) },
      priority: 'high',
    });
  }

  return followUp;
};

export const listFollowUps = async (
  actor: AuthenticatedUser,
  query: { patient?: string; from?: Date; to?: Date; page?: number; limit?: number },
) => {
  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> = {};

  if (actor.role === ROLES.ASHA) filter.asha = oid(actor.id);
  if (query.patient) {
    if (actor.role !== ROLES.ASHA || query.patient !== actor.id) {
      await assertPatientAccess(actor, query.patient, CONSENT_SCOPES.MEDICAL_HISTORY, 'followup');
    }
    filter.patient = oid(query.patient);
  } else if (actor.role === ROLES.PATIENT) {
    filter.patient = oid(actor.id);
  }

  if (query.from || query.to) {
    filter.visitedAt = {
      ...(query.from ? { $gte: query.from } : {}),
      ...(query.to ? { $lte: query.to } : {}),
    };
  }

  const [items, total] = await Promise.all([
    FollowUp.find(filter)
      .populate('patient', 'name phone')
      .sort({ visitedAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    FollowUp.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

/* ------------------------------ dashboard ------------------------------ */

export const getDashboard = async (ashaUserId: string) => {
  const ashaId = oid(ashaUserId);
  const now = new Date();

  const [profile, assignments, todayFollowUps, weekFollowUps, dueVisits, openEmergencies] = await Promise.all([
    AshaProfile.findOne({ user: ashaId }).select('verificationStatus district block village lastSyncAt').lean(),
    AshaAssignment.find({ asha: ashaId, status: 'active', expiresAt: { $gt: now } }).lean(),
    FollowUp.countDocuments({ asha: ashaId, visitedAt: { $gte: startOfDay(now), $lte: endOfDay(now) } }),
    FollowUp.countDocuments({ asha: ashaId, visitedAt: { $gte: new Date(now.getTime() - 7 * 864e5) } }),
    FollowUp.find({ asha: ashaId, nextVisitDate: { $lte: endOfDay(now) } })
      .populate('patient', 'name phone')
      .select('patient nextVisitDate notes')
      .sort({ nextVisitDate: 1 })
      .limit(20)
      .lean(),
    EmergencyRequest.countDocuments({
      raisedBy: ashaId,
      status: { $nin: ['completed', 'cancelled'] },
    }),
  ]);

  const patientIds = assignments.map((a) => a.patient);
  const consentCount = await Consent.countDocuments({
    grantee: ashaId,
    patient: { $in: patientIds },
    status: CONSENT_STATUS.ACTIVE,
    expiresAt: { $gt: now },
  });

  const upcomingAppointments = await Appointment.countDocuments({
    patient: { $in: patientIds },
    scheduledStart: { $gte: now },
    status: { $in: ['requested', 'confirmed', 'rescheduled'] },
  });

  const expiringSoon = assignments.filter(
    (a) => a.expiresAt.getTime() - now.getTime() < 14 * 864e5,
  ).length;

  return {
    profile,
    patients: {
      assigned: assignments.length,
      /** Assignments whose consent is missing or lapsed - no clinical access. */
      withoutActiveConsent: Math.max(0, assignments.length - consentCount),
      assignmentsExpiringIn14Days: expiringSoon,
    },
    followUps: { today: todayFollowUps, lastSevenDays: weekFollowUps, due: dueVisits },
    appointments: { upcomingForMyPatients: upcomingAppointments },
    emergency: { openRequestsRaised: openEmergencies },
  };
};
