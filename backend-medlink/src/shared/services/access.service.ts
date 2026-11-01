import { Types } from 'mongoose';
import { AshaAssignment } from '../../modules/asha/asha.model';
import { Appointment } from '../../modules/appointments/appointment.model';
import { Consultation } from '../../modules/doctor/consultation.model';
import { Consent } from '../../modules/consent/consent.model';
import { EmergencyRequest } from '../../modules/emergency/emergency.model';
import { HospitalProfile } from '../../modules/hospital/hospital.model';
import { APPOINTMENT_STATUS, CONSENT_STATUS, ConsentScope, ROLES } from '../constants';
import { AuthenticatedUser, ObjectIdLike } from '../types';
import { ApiError } from '../utils/ApiError';
import { auditAsync } from './audit.service';

export type AccessBasis =
  | 'self'
  | 'admin'
  | 'consent'
  | 'treatment_relationship'
  | 'asha_assignment'
  | 'hospital_relationship'
  | 'emergency_grant';

export interface AccessDecision {
  allowed: boolean;
  basis?: AccessBasis;
  reason?: string;
  /** Scopes the caller actually holds, when access came from consent. */
  grantedScopes?: ConsentScope[];
  expiresAt?: Date | null;
}

const oid = (value: ObjectIdLike) => (typeof value === 'string' ? new Types.ObjectId(value) : value);

const activeConsent = async (patientId: ObjectIdLike, granteeId: string, scope: ConsentScope) => {
  return Consent.findOne({
    patient: oid(patientId),
    grantee: oid(granteeId),
    status: CONSENT_STATUS.ACTIVE,
    expiresAt: { $gt: new Date() },
    scopes: scope,
  }).lean();
};

const hasTreatmentRelationship = async (doctorId: string, patientId: ObjectIdLike) => {
  const [appointment, consultation] = await Promise.all([
    Appointment.exists({
      doctor: oid(doctorId),
      patient: oid(patientId),
      status: { $in: [APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.RESCHEDULED] },
    }),
    Consultation.exists({ doctor: oid(doctorId), patient: oid(patientId) }),
  ]);
  return Boolean(appointment || consultation);
};

const hospitalIdFor = async (hospitalUserId: string) => {
  const hospital = await HospitalProfile.findOne({ user: oid(hospitalUserId) }).select('_id').lean();
  return hospital?._id ?? null;
};

/**
 * Central authorisation gate for every read/write that touches a patient's data.
 *
 * No role short-circuits to "all patients": doctors need a treatment relationship
 * or consent, ASHA workers need an unexpired assignment AND matching consent,
 * hospitals need an operational relationship, responders need a per-request grant.
 */
export const evaluatePatientAccess = async (
  actor: AuthenticatedUser,
  patientId: ObjectIdLike,
  scope: ConsentScope,
): Promise<AccessDecision> => {
  if (String(actor.id) === String(patientId)) return { allowed: true, basis: 'self' };

  if (actor.role === ROLES.ADMIN) return { allowed: true, basis: 'admin' };

  if (actor.role === ROLES.DOCTOR) {
    const consent = await activeConsent(patientId, actor.id, scope);
    if (consent) {
      return { allowed: true, basis: 'consent', grantedScopes: consent.scopes, expiresAt: consent.expiresAt };
    }
    if (await hasTreatmentRelationship(actor.id, patientId)) {
      return { allowed: true, basis: 'treatment_relationship' };
    }
    return { allowed: false, reason: 'No active consent or treatment relationship with this patient' };
  }

  if (actor.role === ROLES.ASHA) {
    const assignment = await AshaAssignment.findOne({
      asha: oid(actor.id),
      patient: oid(patientId),
      status: 'active',
      startsAt: { $lte: new Date() },
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!assignment) {
      return { allowed: false, reason: 'No active assignment for this patient' };
    }
    if (!assignment.scopes.includes(scope)) {
      return { allowed: false, reason: `Assignment does not cover scope "${scope}"` };
    }
    const consent = await activeConsent(patientId, actor.id, scope);
    if (!consent) {
      return { allowed: false, reason: `Patient consent for scope "${scope}" is missing, expired or revoked` };
    }
    return {
      allowed: true,
      basis: 'asha_assignment',
      grantedScopes: assignment.scopes.filter((s) => consent.scopes.includes(s)),
      expiresAt: new Date(Math.min(assignment.expiresAt.getTime(), consent.expiresAt.getTime())),
    };
  }

  if (actor.role === ROLES.HOSPITAL) {
    const hospitalId = await hospitalIdFor(actor.id);
    if (!hospitalId) return { allowed: false, reason: 'Hospital profile not found' };
    const [appointment, emergency] = await Promise.all([
      Appointment.exists({ hospital: hospitalId, patient: oid(patientId) }),
      EmergencyRequest.exists({ assignedHospital: hospitalId, patient: oid(patientId) }),
    ]);
    if (appointment || emergency) return { allowed: true, basis: 'hospital_relationship' };
    const consent = await activeConsent(patientId, actor.id, scope);
    if (consent) return { allowed: true, basis: 'consent', grantedScopes: consent.scopes, expiresAt: consent.expiresAt };
    return { allowed: false, reason: 'No appointment, emergency or consent links this patient to your facility' };
  }

  if (actor.role === ROLES.RESPONDER) {
    const grant = await EmergencyRequest.findOne({
      patient: oid(patientId),
      'accessGrantedTo.user': oid(actor.id),
      'accessGrantedTo.expiresAt': { $gt: new Date() },
    })
      .select('accessGrantedTo')
      .lean();
    if (grant) return { allowed: true, basis: 'emergency_grant' };
    return { allowed: false, reason: 'No active emergency assignment grants access to this patient' };
  }

  return { allowed: false, reason: 'Role is not permitted to access patient data' };
};

/** Throws 403 and writes a denial audit entry when access is not permitted. */
export const assertPatientAccess = async (
  actor: AuthenticatedUser,
  patientId: ObjectIdLike,
  scope: ConsentScope,
  resourceType = 'patient',
): Promise<AccessDecision> => {
  const decision = await evaluatePatientAccess(actor, patientId, scope);
  if (!decision.allowed) {
    auditAsync({
      actor,
      action: 'access_denied',
      resourceType,
      resourceId: String(patientId),
      subject: patientId,
      outcome: 'denied',
      reason: decision.reason,
      metadata: { scope },
    });
    throw ApiError.forbidden(decision.reason ?? 'Access denied', { scope });
  }
  if (decision.basis !== 'self') {
    auditAsync({
      actor,
      action: 'read',
      resourceType,
      resourceId: String(patientId),
      subject: patientId,
      metadata: { scope, basis: decision.basis },
    });
  }
  return decision;
};

/** Patient ids the actor may legitimately list (used by dashboards and lists). */
export const accessiblePatientIds = async (actor: AuthenticatedUser): Promise<Types.ObjectId[]> => {
  if (actor.role === ROLES.PATIENT) return [oid(actor.id)];

  if (actor.role === ROLES.ASHA) {
    const assignments = await AshaAssignment.find({
      asha: oid(actor.id),
      status: 'active',
      expiresAt: { $gt: new Date() },
    })
      .select('patient')
      .lean();
    return assignments.map((a) => a.patient as Types.ObjectId);
  }

  if (actor.role === ROLES.DOCTOR) {
    const ids = await Appointment.distinct('patient', {
      doctor: oid(actor.id),
      status: { $ne: APPOINTMENT_STATUS.CANCELLED },
    });
    return ids as Types.ObjectId[];
  }

  if (actor.role === ROLES.HOSPITAL) {
    const hospitalId = await hospitalIdFor(actor.id);
    if (!hospitalId) return [];
    const ids = await Appointment.distinct('patient', { hospital: hospitalId });
    return ids as Types.ObjectId[];
  }

  return [];
};
