import { Types } from 'mongoose';
import { env } from '../../config/environment';
import {
  CONSENT_STATUS,
  ConsentScope,
  ROLES,
  Role,
} from '../../shared/constants';
import { AuthenticatedUser, ObjectIdLike } from '../../shared/types';
import { ApiError } from '../../shared/utils/ApiError';
import { addDays } from '../../shared/utils/dates';
import { pageMeta, parsePagination } from '../../shared/utils/pagination';
import { auditAsync } from '../../shared/services/audit.service';
import { notify } from '../../shared/services/notification.service';
import { User } from '../auth/auth.model';
import { Consent, IConsent } from './consent.model';

const oid = (v: ObjectIdLike) => (typeof v === 'string' ? new Types.ObjectId(v) : v);

export interface CreateConsentInput {
  grantee: string;
  granteeRole: Role;
  scopes: ConsentScope[];
  purpose?: string;
  durationDays?: number;
  patient?: string;
  evidence?: { method: 'in_app' | 'otp' | 'verbal_recorded' | 'paper'; reference?: string };
}

/**
 * Only the patient may grant consent over their own data. Assisted grants
 * (an ASHA recording a verbal consent) must carry non-in_app evidence and are
 * always attributed to the recording user in grantedBy.
 */
export const createConsent = async (actor: AuthenticatedUser, input: CreateConsentInput): Promise<IConsent> => {
  const patientId = input.patient ?? actor.id;

  if (actor.role !== ROLES.PATIENT && String(patientId) !== actor.id) {
    if (actor.role !== ROLES.ASHA && actor.role !== ROLES.HOSPITAL) {
      throw ApiError.forbidden('Only the patient can grant consent over their data');
    }
    if (!input.evidence || input.evidence.method === 'in_app') {
      throw ApiError.badRequest('Assisted consent requires recorded evidence (otp, verbal_recorded or paper)');
    }
  }

  const [patient, grantee] = await Promise.all([
    User.findById(patientId).select('role name phone').lean(),
    User.findById(input.grantee).select('role name').lean(),
  ]);

  if (!patient || patient.role !== ROLES.PATIENT) throw ApiError.badRequest('Consent subject must be a patient');
  if (!grantee) throw ApiError.notFound('Grantee account not found');
  if (grantee.role !== input.granteeRole) throw ApiError.badRequest('granteeRole does not match the grantee account');
  if (String(grantee._id) === String(patientId)) throw ApiError.badRequest('Cannot grant consent to yourself');

  const expiresAt = addDays(new Date(), input.durationDays ?? env.access.consentDefaultDays);

  const consent = await Consent.create({
    patient: oid(patientId),
    grantee: oid(input.grantee),
    granteeRole: input.granteeRole,
    scopes: input.scopes,
    purpose: input.purpose,
    grantedBy: oid(actor.id),
    expiresAt,
    evidence: input.evidence ?? { method: 'in_app' },
  });

  auditAsync({
    actor,
    action: 'consent_granted',
    resourceType: 'consent',
    resourceId: String(consent._id),
    subject: patientId,
    metadata: { grantee: input.grantee, scopes: input.scopes, expiresAt },
  });

  await notify({
    user: input.grantee,
    type: 'consent.granted',
    title: 'New data access granted',
    body: `${patient.name} granted you access to: ${input.scopes.join(', ')}`,
    data: { consentId: String(consent._id), scopes: input.scopes },
  });

  return consent;
};

export const listConsents = async (
  actor: AuthenticatedUser,
  query: { status?: string; direction: 'granted' | 'received'; page?: number; limit?: number },
) => {
  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> =
    query.direction === 'received' ? { grantee: oid(actor.id) } : { patient: oid(actor.id) };
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    Consent.find(filter)
      .populate('grantee', 'name role phone')
      .populate('patient', 'name role')
      .sort({ createdAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    Consent.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

export const revokeConsent = async (actor: AuthenticatedUser, consentId: string, reason?: string) => {
  const consent = await Consent.findById(consentId);
  if (!consent) throw ApiError.notFound('Consent not found');

  const isPatient = String(consent.patient) === actor.id;
  if (!isPatient && actor.role !== ROLES.ADMIN) {
    throw ApiError.forbidden('Only the patient (or an admin) can revoke this consent');
  }
  if (consent.status !== CONSENT_STATUS.ACTIVE) return consent;

  consent.status = CONSENT_STATUS.REVOKED;
  consent.revokedAt = new Date();
  consent.revokedBy = oid(actor.id);
  consent.revocationReason = reason;
  await consent.save();

  auditAsync({
    actor,
    action: 'consent_revoked',
    resourceType: 'consent',
    resourceId: consentId,
    subject: consent.patient,
    metadata: { reason },
  });

  await notify({
    user: consent.grantee,
    type: 'consent.revoked',
    title: 'Data access revoked',
    body: 'A patient revoked your access to their records.',
    data: { consentId },
  });

  return consent;
};

/** Marks expired rows so listings and dashboards stay truthful. */
export const expireStaleConsents = async (): Promise<number> => {
  const result = await Consent.updateMany(
    { status: CONSENT_STATUS.ACTIVE, expiresAt: { $lte: new Date() } },
    { $set: { status: CONSENT_STATUS.EXPIRED } },
  );
  return result.modifiedCount;
};
