import { z } from 'zod';
import { APPOINTMENT_STATUS } from '../../shared/constants';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Must be a 24-character id');

export const createAppointmentSchema = z.object({
  doctor: objectId,
  hospital: objectId.optional(),
  department: objectId.optional(),
  scheduledStart: z.coerce.date(),
  durationMinutes: z.number().int().min(5).max(180).optional(),
  mode: z.enum(['in_person', 'teleconsult']).default('in_person'),
  reason: z.string().trim().min(3).max(500),
  symptoms: z.array(z.string()).default([]),
  /** Only accepted from ASHA/hospital callers booking on a patient's behalf. */
  patient: objectId.optional(),
});

export const listAppointmentsSchema = z.object({
  status: z.enum(Object.values(APPOINTMENT_STATUS) as [string, ...string[]]).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  upcoming: z.coerce.boolean().optional(),
  patient: objectId.optional(),
  doctor: objectId.optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const cancelSchema = z.object({ reason: z.string().max(500).optional() });

export const rescheduleSchema = z.object({
  scheduledStart: z.coerce.date(),
  durationMinutes: z.number().int().min(5).max(180).optional(),
  reason: z.string().max(500).optional(),
});

export const statusUpdateSchema = z.object({
  status: z.enum(['confirmed', 'rejected', 'completed', 'no_show']),
  reason: z.string().max(500).optional(),
});

export const slotQuerySchema = z.object({
  date: z.coerce.date(),
  mode: z.enum(['in_person', 'teleconsult']).optional(),
});

export const idParamSchema = z.object({ id: objectId });
