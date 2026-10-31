import { Types } from 'mongoose';
import { CONSENT_SCOPES, REMINDER_STATUS, ROLES } from '../../../shared/constants';
import { AuthenticatedUser } from '../../../shared/types';
import { ApiError } from '../../../shared/utils/ApiError';
import { pageMeta, parsePagination } from '../../../shared/utils/pagination';
import { assertPatientAccess } from '../../../shared/services/access.service';
import { auditAsync } from '../../../shared/services/audit.service';
import { notify } from '../../../shared/services/notification.service';
import { PatientMedication } from '../medicines/patientMedication.model';
import { computeNextTrigger, proposeSchedule } from './reminder.engine';
import { IReminder, Reminder } from './reminder.model';

const oid = (v: string | Types.ObjectId) => (typeof v === 'string' ? new Types.ObjectId(v) : v);

const resolvePatient = async (actor: AuthenticatedUser, patient?: string, scope = CONSENT_SCOPES.REMINDERS) => {
  const patientId = patient ?? actor.id;
  if (patientId !== actor.id) {
    await assertPatientAccess(actor, patientId, scope, 'reminder');
  } else if (actor.role !== ROLES.PATIENT) {
    throw ApiError.badRequest('patient is required');
  }
  return patientId;
};

/** Returns a proposal only - nothing is persisted or activated here. */
export const generate = async (
  actor: AuthenticatedUser,
  input: {
    medication?: string; medicineName?: string; frequency?: string; dosage?: string;
    durationDays?: number; wakeTime: string; sleepTime: string; patient?: string;
  },
) => {
  let patientId = input.patient;
  let medicineName = input.medicineName;
  let frequency = input.frequency;
  let dosage = input.dosage;
  let explicitTimings: string[] | undefined;

  if (input.medication) {
    const medication = await PatientMedication.findById(input.medication).lean();
    if (!medication) throw ApiError.notFound('Medication not found');
    patientId = String(medication.patient);
    medicineName = medication.medicineName;
    frequency = medication.frequency;
    dosage = medication.dosage;
    explicitTimings = medication.timings?.length ? medication.timings : undefined;

    if (!medication.confirmedByPatient) {
      throw ApiError.badRequest('This medication is not confirmed by the patient yet');
    }
  }

  patientId = await resolvePatient(actor, patientId);

  const proposal = proposeSchedule(frequency as string, {
    wakeTime: input.wakeTime,
    sleepTime: input.sleepTime,
    dosage,
    explicitTimings,
  });

  return {
    patient: patientId,
    medicineName,
    medication: input.medication ?? null,
    ...proposal,
    durationDays: input.durationDays,
    requiresPatientApproval: true,
    note: 'POST /api/reminders to save. Only the patient can activate a schedule.',
  };
};

export const createReminder = async (
  actor: AuthenticatedUser,
  input: {
    medication?: string; medicineName: string;
    doses: { time: string; label?: string; amount?: string }[];
    daysOfWeek: number[]; startDate?: Date; endDate?: Date; timezone: string;
    channels: ('in_app' | 'push' | 'sms')[]; notes?: string; patient?: string; activate: boolean;
  },
): Promise<IReminder> => {
  const patientId = await resolvePatient(actor, input.patient);
  const isPatient = patientId === actor.id;

  // Only the patient can bring a schedule to life; others can only propose one.
  const approved = isPatient && input.activate;

  const reminder = await Reminder.create({
    patient: oid(patientId),
    medication: input.medication ? oid(input.medication) : null,
    medicineName: input.medicineName,
    doses: input.doses,
    daysOfWeek: input.daysOfWeek,
    startDate: input.startDate ?? new Date(),
    endDate: input.endDate ?? null,
    timezone: input.timezone,
    channels: input.channels,
    status: approved ? REMINDER_STATUS.ACTIVE : REMINDER_STATUS.PROPOSED,
    createdBy: oid(actor.id),
    createdByRole: actor.role,
    approvedByPatient: approved,
    approvedAt: approved ? new Date() : null,
    nextTriggerAt: approved ? computeNextTrigger(input.doses, input.daysOfWeek, new Date(), input.endDate) : null,
    notes: input.notes,
  });

  auditAsync({
    actor, action: 'create', resourceType: 'reminder', resourceId: String(reminder._id),
    subject: patientId, metadata: { status: reminder.status, doses: input.doses.length },
  });

  if (!isPatient) {
    await notify({
      user: patientId,
      type: 'reminder.proposed',
      title: 'A medicine reminder is waiting for your approval',
      body: `${input.medicineName}: ${input.doses.map((d) => d.time).join(', ')}`,
      data: { reminderId: String(reminder._id) },
    });
  }

  return reminder;
};

export const listReminders = async (
  actor: AuthenticatedUser,
  query: { patient?: string; status?: string; page?: number; limit?: number },
) => {
  const patientId = query.patient ?? actor.id;
  if (patientId !== actor.id) {
    await assertPatientAccess(actor, patientId, CONSENT_SCOPES.REMINDERS, 'reminder');
  }

  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> = { patient: oid(patientId) };
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    Reminder.find(filter).sort({ nextTriggerAt: 1, createdAt: -1 }).skip(page.skip).limit(page.limit).lean(),
    Reminder.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

export const updateReminder = async (
  actor: AuthenticatedUser,
  reminderId: string,
  updates: Record<string, unknown>,
) => {
  const reminder = await Reminder.findById(reminderId);
  if (!reminder) throw ApiError.notFound('Reminder not found');

  const isPatient = String(reminder.patient) === actor.id;
  if (!isPatient) {
    await assertPatientAccess(actor, reminder.patient, CONSENT_SCOPES.REMINDERS, 'reminder');
    if (updates.status === REMINDER_STATUS.ACTIVE) {
      throw ApiError.forbidden('Only the patient can activate a reminder schedule');
    }
  }

  Object.assign(reminder, updates);

  if (updates.status === REMINDER_STATUS.ACTIVE) {
    reminder.approvedByPatient = true;
    reminder.approvedAt = new Date();
  }
  reminder.nextTriggerAt =
    reminder.status === REMINDER_STATUS.ACTIVE
      ? computeNextTrigger(reminder.doses, reminder.daysOfWeek, new Date(), reminder.endDate)
      : null;

  await reminder.save();

  auditAsync({
    actor, action: 'update', resourceType: 'reminder', resourceId: reminderId,
    subject: reminder.patient, metadata: updates,
  });

  return reminder;
};

export const recordAdherence = async (
  actor: AuthenticatedUser,
  reminderId: string,
  outcome: 'taken' | 'missed' | 'skipped',
) => {
  const reminder = await Reminder.findById(reminderId);
  if (!reminder) throw ApiError.notFound('Reminder not found');
  if (String(reminder.patient) !== actor.id) {
    await assertPatientAccess(actor, reminder.patient, CONSENT_SCOPES.REMINDERS, 'reminder');
  }

  reminder.adherence[outcome] += 1;
  reminder.lastTriggeredAt = new Date();
  reminder.nextTriggerAt = computeNextTrigger(reminder.doses, reminder.daysOfWeek, new Date(), reminder.endDate);
  await reminder.save();

  return reminder;
};

/**
 * Dispatch pass for due reminders. Call from a scheduler (cron/worker);
 * it is idempotent per trigger because nextTriggerAt advances on each run.
 */
export const dispatchDueReminders = async (now: Date = new Date()) => {
  const due = await Reminder.find({
    status: REMINDER_STATUS.ACTIVE,
    approvedByPatient: true,
    nextTriggerAt: { $lte: now },
  })
    .populate('patient', 'phone preferredLanguage')
    .limit(500);

  let dispatched = 0;
  for (const reminder of due) {
    const patient = reminder.patient as unknown as { _id: Types.ObjectId; phone?: string };
    await notify({
      user: patient._id,
      type: 'reminder.due',
      title: 'Medicine reminder',
      body: `Time to take ${reminder.medicineName}.`,
      channels: reminder.channels,
      data: { reminderId: String(reminder._id) },
      priority: 'high',
      phone: patient.phone,
    });

    reminder.lastTriggeredAt = now;
    reminder.nextTriggerAt = computeNextTrigger(reminder.doses, reminder.daysOfWeek, now, reminder.endDate);
    if (!reminder.nextTriggerAt) reminder.status = REMINDER_STATUS.COMPLETED;
    await reminder.save();
    dispatched += 1;
  }

  return { dispatched };
};
