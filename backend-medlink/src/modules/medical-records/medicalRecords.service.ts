import { Types } from 'mongoose';
import { CONSENT_SCOPES, ROLES } from '../../shared/constants';
import { AuthenticatedUser } from '../../shared/types';
import { ApiError } from '../../shared/utils/ApiError';
import { pageMeta, parsePagination } from '../../shared/utils/pagination';
import { assertPatientAccess } from '../../shared/services/access.service';
import { auditAsync } from '../../shared/services/audit.service';
import { IMedicalRecord, MedicalRecord, MedicalRecordType } from './medicalRecord.model';

const oid = (v: string | Types.ObjectId) => (typeof v === 'string' ? new Types.ObjectId(v) : v);

const sourceFor = (role: string): IMedicalRecord['source'] => {
  if (role === ROLES.DOCTOR) return 'clinician';
  if (role === ROLES.ASHA) return 'asha_reported';
  if (role === ROLES.HOSPITAL) return 'clinician';
  return 'patient_reported';
};

export interface CreateRecordInput {
  type: MedicalRecordType;
  title: string;
  description?: string;
  details?: Record<string, unknown>;
  severity?: 'mild' | 'moderate' | 'severe' | 'critical';
  status?: 'active' | 'resolved' | 'inactive';
  onsetDate?: Date;
  resolvedDate?: Date;
  attachments?: string[];
  patient?: string;
  clientRecordId?: string;
  syncedFromOffline?: boolean;
}

export const createRecord = async (actor: AuthenticatedUser, input: CreateRecordInput) => {
  const patientId = input.patient ?? actor.id;
  if (patientId !== actor.id) {
    await assertPatientAccess(actor, patientId, CONSENT_SCOPES.MEDICAL_HISTORY, 'medical_record');
  } else if (actor.role !== ROLES.PATIENT) {
    throw ApiError.badRequest('patient is required');
  }

  const record = await MedicalRecord.create({
    patient: oid(patientId),
    type: input.type,
    title: input.title,
    description: input.description,
    details: input.details,
    severity: input.severity,
    status: input.status ?? 'active',
    onsetDate: input.onsetDate ?? null,
    resolvedDate: input.resolvedDate ?? null,
    recordedBy: oid(actor.id),
    recordedByRole: actor.role,
    source: sourceFor(actor.role),
    attachments: (input.attachments ?? []).map(oid),
    syncedFromOffline: input.syncedFromOffline ?? false,
    clientRecordId: input.clientRecordId,
  });

  auditAsync({
    actor, action: 'create', resourceType: 'medical_record', resourceId: String(record._id),
    subject: patientId, metadata: { type: input.type },
  });

  return record;
};

export const listRecords = async (
  actor: AuthenticatedUser,
  query: { patient?: string; type?: string; status?: string; page?: number; limit?: number },
) => {
  const patientId = query.patient ?? actor.id;
  if (patientId !== actor.id) {
    await assertPatientAccess(actor, patientId, CONSENT_SCOPES.MEDICAL_HISTORY, 'medical_record');
  }

  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> = { patient: oid(patientId) };
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    MedicalRecord.find(filter)
      .populate('recordedBy', 'name role')
      .sort({ createdAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    MedicalRecord.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

/** Compact view used by dashboards, consultations and emergency snapshots. */
export const summarise = async (patientId: string) => {
  const records = await MedicalRecord.find({ patient: oid(patientId), status: 'active' })
    .select('type title severity onsetDate details')
    .lean();

  return {
    conditions: records.filter((r) => r.type === 'condition').map((r) => r.title),
    allergies: records
      .filter((r) => r.type === 'allergy')
      .map((r) => ({ title: r.title, severity: r.severity })),
    surgeries: records.filter((r) => r.type === 'surgery').map((r) => r.title),
    immunizations: records.filter((r) => r.type === 'immunization').map((r) => r.title),
    totalActive: records.length,
  };
};

export const updateRecord = async (
  actor: AuthenticatedUser,
  recordId: string,
  updates: Partial<CreateRecordInput>,
) => {
  const record = await MedicalRecord.findById(recordId);
  if (!record) throw ApiError.notFound('Record not found');

  if (String(record.patient) !== actor.id) {
    await assertPatientAccess(actor, record.patient, CONSENT_SCOPES.MEDICAL_HISTORY, 'medical_record');
  }
  // Only the original author (or a clinician) may edit a record's clinical content.
  if (String(record.recordedBy) !== actor.id && actor.role !== ROLES.DOCTOR && actor.role !== ROLES.ADMIN) {
    throw ApiError.forbidden('Only the author or a clinician can edit this record');
  }

  Object.assign(record, updates);
  if (actor.role === ROLES.DOCTOR) {
    record.verifiedBy = oid(actor.id);
    record.verifiedAt = new Date();
  }
  await record.save();

  auditAsync({
    actor, action: 'update', resourceType: 'medical_record', resourceId: recordId, subject: record.patient,
  });

  return record;
};

export const deleteRecord = async (actor: AuthenticatedUser, recordId: string) => {
  const record = await MedicalRecord.findById(recordId);
  if (!record) throw ApiError.notFound('Record not found');
  if (String(record.patient) !== actor.id && actor.role !== ROLES.ADMIN) {
    throw ApiError.forbidden('Only the patient can delete their record');
  }
  await record.deleteOne();
  auditAsync({
    actor, action: 'delete', resourceType: 'medical_record', resourceId: recordId, subject: record.patient,
  });
  return { deleted: true };
};
