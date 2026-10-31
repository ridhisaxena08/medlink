import { z } from 'zod';
import { NOTIFICATION_CHANNELS } from '../../../shared/constants';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);
const timePattern = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:mm');

export const generateRemindersSchema = z.object({
  /** Generate from a confirmed medication, or from an explicit frequency. */
  medication: objectId.optional(),
  medicineName: z.string().min(2).max(200).optional(),
  frequency: z.string().min(1).max(100).optional(),
  dosage: z.string().max(100).optional(),
  durationDays: z.number().int().min(1).max(3650).optional(),
  wakeTime: timePattern.default('08:00'),
  sleepTime: timePattern.default('22:00'),
  patient: objectId.optional(),
}).refine((v) => v.medication || (v.medicineName && v.frequency), {
  message: 'Provide a medication id, or medicineName plus frequency',
});

export const createReminderSchema = z.object({
  medication: objectId.optional(),
  medicineName: z.string().trim().min(2).max(200),
  doses: z.array(z.object({ time: timePattern, label: z.string().max(60).optional(), amount: z.string().max(60).optional() })).min(1),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).default([]),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  timezone: z.string().default('Asia/Kolkata'),
  channels: z.array(z.enum(NOTIFICATION_CHANNELS)).default(['in_app']),
  notes: z.string().max(500).optional(),
  patient: objectId.optional(),
  /** Patients may activate directly; proposals from others start as 'proposed'. */
  activate: z.boolean().default(false),
});

export const updateReminderSchema = z.object({
  doses: z.array(z.object({ time: timePattern, label: z.string().optional(), amount: z.string().optional() })).optional(),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
  endDate: z.coerce.date().nullable().optional(),
  channels: z.array(z.enum(NOTIFICATION_CHANNELS)).optional(),
  status: z.enum(['active', 'paused', 'cancelled', 'completed']).optional(),
  notes: z.string().max(500).optional(),
});

export const listRemindersSchema = z.object({
  patient: objectId.optional(),
  status: z.enum(['proposed', 'active', 'paused', 'completed', 'cancelled']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const adherenceSchema = z.object({ outcome: z.enum(['taken', 'missed', 'skipped']) });

export const idParamSchema = z.object({ id: objectId });
