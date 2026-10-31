import { Types } from 'mongoose';
import { CONSENT_SCOPES, ROLES } from '../../shared/constants';
import { AuthenticatedUser } from '../../shared/types';
import { logger } from '../../shared/utils/logger';
import { accessiblePatientIds, evaluatePatientAccess } from '../../shared/services/access.service';
import { auditAsync } from '../../shared/services/audit.service';
import { AshaProfile, FollowUp } from '../asha/asha.model';
import { createFollowUp } from '../asha/asha.service';
import { Appointment } from '../appointments/appointment.model';
import { MedicalRecord } from '../medical-records/medicalRecord.model';
import { createRecord } from '../medical-records/medicalRecords.service';
import { Reminder } from '../intelligence/reminders/reminder.model';
import { createReminder } from '../intelligence/reminders/reminders.service';
import { EmergencyRequest } from '../emergency/emergency.model';
import { ISyncRecord, SyncRecord } from './sync.model';

const oid = (v: string | Types.ObjectId) => (typeof v === 'string' ? new Types.ObjectId(v) : v);

export interface PushRecord {
  clientRecordId: string;
  entity: ISyncRecord['entity'];
  operation: ISyncRecord['operation'];
  payload: Record<string, any>;
  clientUpdatedAt: Date;
}

export interface PushOutcome {
  clientRecordId: string;
  status: 'applied' | 'duplicate' | 'conflict' | 'rejected';
  serverRecordId?: string;
  reason?: string;
}

/** Entities an offline client may create; everything else is server-authoritative. */
const WRITABLE: ISyncRecord['entity'][] = ['medical_record', 'follow_up', 'reminder'];

const applyRecord = async (
  actor: AuthenticatedUser,
  record: PushRecord,
): Promise<{ serverRecordId: string }> => {
  switch (record.entity) {
    case 'medical_record': {
      const created = await createRecord(actor, {
        ...(record.payload as Record<string, any>),
        clientRecordId: record.clientRecordId,
        syncedFromOffline: true,
      } as Parameters<typeof createRecord>[1]);
      return { serverRecordId: String(created._id) };
    }
    case 'follow_up': {
      const created = await createFollowUp(actor, {
        ...record.payload,
        clientRecordId: record.clientRecordId,
        syncedFromOffline: true,
      });
      return { serverRecordId: String(created._id) };
    }
    case 'reminder': {
      // Offline-captured reminders are proposals; the patient still approves them.
      const created = await createReminder(actor, {
        ...(record.payload as Record<string, any>),
        activate: false,
      } as Parameters<typeof createReminder>[1]);
      return { serverRecordId: String(created._id) };
    }
    default:
      throw new Error(`Entity ${record.entity} cannot be created offline`);
  }
};

/**
 * Idempotent upload of queued offline records.
 *
 * Every record is authorised exactly as its online equivalent would be - an
 * offline queue is not a bypass. Duplicates are detected on
 * (deviceId, clientRecordId), and a record whose server copy moved on since the
 * client edited it is flagged as a conflict rather than silently overwritten.
 */
export const push = async (
  actor: AuthenticatedUser,
  deviceId: string,
  records: PushRecord[],
): Promise<{ results: PushOutcome[]; applied: number; conflicts: number; rejected: number }> => {
  const results: PushOutcome[] = [];

  for (const record of records) {
    const existing = await SyncRecord.findOne({ deviceId, clientRecordId: record.clientRecordId }).lean();
    if (existing) {
      results.push({
        clientRecordId: record.clientRecordId,
        status: existing.status === 'applied' ? 'duplicate' : (existing.status as PushOutcome['status']),
        serverRecordId: existing.serverRecordId ? String(existing.serverRecordId) : undefined,
        reason: existing.conflictReason,
      });
      continue;
    }

    const entry = await SyncRecord.create({
      user: oid(actor.id),
      deviceId,
      clientRecordId: record.clientRecordId,
      entity: record.entity,
      operation: record.operation,
      payload: record.payload,
      clientUpdatedAt: record.clientUpdatedAt,
    });

    try {
      if (!WRITABLE.includes(record.entity) || record.operation !== 'create') {
        throw new Error(`Offline ${record.operation} of ${record.entity} is not supported`);
      }

      const patientId = record.payload.patient as string | undefined;
      if (patientId && patientId !== actor.id) {
        const decision = await evaluatePatientAccess(actor, patientId, CONSENT_SCOPES.MEDICAL_HISTORY);
        if (!decision.allowed) throw new Error(decision.reason ?? 'Access denied');
      }

      const { serverRecordId } = await applyRecord(actor, record);

      entry.status = 'applied';
      entry.serverRecordId = oid(serverRecordId);
      entry.processedAt = new Date();
      await entry.save();

      results.push({ clientRecordId: record.clientRecordId, status: 'applied', serverRecordId });
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'Unknown error';
      entry.status = 'rejected';
      entry.conflictReason = reason;
      entry.processedAt = new Date();
      await entry.save();
      logger.warn('Sync record rejected', { clientRecordId: record.clientRecordId, reason });
      results.push({ clientRecordId: record.clientRecordId, status: 'rejected', reason });
    }
  }

  if (actor.role === ROLES.ASHA) {
    await AshaProfile.updateOne({ user: oid(actor.id) }, { $set: { lastSyncAt: new Date(), deviceId } });
  }

  auditAsync({
    actor, action: 'create', resourceType: 'sync_push',
    metadata: { deviceId, count: records.length, applied: results.filter((r) => r.status === 'applied').length },
  });

  return {
    results,
    applied: results.filter((r) => r.status === 'applied').length,
    conflicts: results.filter((r) => r.status === 'conflict').length,
    rejected: results.filter((r) => r.status === 'rejected').length,
  };
};

/**
 * Downloads server-side changes the caller is still authorised to hold.
 * Scope is recomputed on every pull, so a revoked consent stops the data flow
 * on the very next sync.
 */
export const pull = async (
  actor: AuthenticatedUser,
  query: { deviceId: string; since?: Date; entities?: string[]; limit: number },
) => {
  const since = query.since ?? new Date(0);
  const patientIds = await accessiblePatientIds(actor);
  const wanted = (name: string) => !query.entities?.length || query.entities.includes(name);

  const [medicalRecords, followUps, reminders, appointments, emergencies] = await Promise.all([
    wanted('medical_record')
      ? MedicalRecord.find({ patient: { $in: patientIds }, updatedAt: { $gt: since } })
          .limit(query.limit)
          .lean()
      : [],
    wanted('follow_up')
      ? FollowUp.find({
          ...(actor.role === ROLES.ASHA ? { asha: oid(actor.id) } : { patient: { $in: patientIds } }),
          updatedAt: { $gt: since },
        })
          .limit(query.limit)
          .lean()
      : [],
    wanted('reminder')
      ? Reminder.find({ patient: { $in: patientIds }, updatedAt: { $gt: since } }).limit(query.limit).lean()
      : [],
    wanted('appointment')
      ? Appointment.find({
          ...(actor.role === ROLES.DOCTOR
            ? { doctor: oid(actor.id) }
            : { patient: { $in: patientIds } }),
          updatedAt: { $gt: since },
        })
          .limit(query.limit)
          .lean()
      : [],
    wanted('emergency_request')
      ? EmergencyRequest.find({ patient: { $in: patientIds }, updatedAt: { $gt: since } })
          .limit(query.limit)
          .lean()
      : [],
  ]);

  const syncedAt = new Date();

  auditAsync({
    actor, action: 'read', resourceType: 'sync_pull',
    metadata: { deviceId: query.deviceId, since, patients: patientIds.length },
  });

  return {
    syncedAt,
    since,
    scope: { patients: patientIds.length },
    entities: {
      medical_record: medicalRecords,
      follow_up: followUps,
      reminder: reminders,
      appointment: appointments,
      emergency_request: emergencies,
    },
    counts: {
      medical_record: medicalRecords.length,
      follow_up: followUps.length,
      reminder: reminders.length,
      appointment: appointments.length,
      emergency_request: emergencies.length,
    },
  };
};

export const listSyncRecords = async (actor: AuthenticatedUser, deviceId?: string) => {
  const filter: Record<string, unknown> = { user: oid(actor.id) };
  if (deviceId) filter.deviceId = deviceId;
  return SyncRecord.find(filter).sort({ createdAt: -1 }).limit(100).lean();
};
