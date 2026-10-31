import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);
const timePattern = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:mm');

export const searchMedicinesSchema = z.object({
  q: z.string().trim().min(2).max(100),
  form: z.string().optional(),
  prescriptionRequired: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const explanationQuerySchema = z.object({ lang: z.enum(['en', 'hi']).default('en') });

export const addPatientMedicationSchema = z.object({
  medicine: objectId.optional(),
  medicineName: z.string().trim().min(2).max(200),
  dosage: z.string().trim().min(1).max(100),
  frequency: z.string().trim().min(1).max(100),
  timings: z.array(timePattern).default([]),
  route: z.string().max(50).optional(),
  instructions: z.string().max(500).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  durationDays: z.number().int().min(1).max(3650).optional(),
  source: z.enum(['prescription', 'self_reported', 'asha_reported', 'scan']).default('self_reported'),
  prescription: objectId.optional(),
  patient: objectId.optional(),
});

export const listPatientMedicationsSchema = z.object({
  patient: objectId.optional(),
  status: z.enum(['active', 'completed', 'stopped']).optional(),
  confirmedOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const stopMedicationSchema = z.object({ reason: z.string().max(500).optional() });

export const idParamSchema = z.object({ id: objectId });
