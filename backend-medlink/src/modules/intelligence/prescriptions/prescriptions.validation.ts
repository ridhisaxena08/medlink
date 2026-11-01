import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);
const timePattern = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:mm');

const itemSchema = z.object({
  medicine: objectId.optional(),
  medicineName: z.string().trim().min(2).max(200),
  dosage: z.string().trim().min(1).max(100),
  frequency: z.string().trim().min(1).max(100),
  durationDays: z.number().int().min(1).max(3650).optional(),
  timings: z.array(timePattern).default([]),
  route: z.string().max(50).optional(),
  instructions: z.string().max(500).optional(),
});

export const createPrescriptionSchema = z.object({
  patient: objectId,
  consultation: objectId.optional(),
  hospital: objectId.optional(),
  items: z.array(itemSchema).min(1),
  advice: z.string().max(2000).optional(),
  diagnosisSummary: z.string().max(1000).optional(),
  validUntil: z.coerce.date().optional(),
  document: objectId.optional(),
});

export const parsePrescriptionSchema = z
  .object({
    /** Text extracted on-device, or raw text typed in. */
    text: z.string().trim().min(5).max(10000).optional(),
    /** Alternatively, a previously uploaded document to run server-side OCR on. */
    document: objectId.optional(),
    patient: objectId.optional(),
  })
  .refine((v) => v.text || v.document, { message: 'Provide text or document' });

export const verifyPrescriptionSchema = z.object({
  prescription: objectId,
  /** Index-addressed corrections; omitted items keep their parsed values. */
  items: z
    .array(
      z.object({
        index: z.number().int().min(0),
        medicine: objectId.optional(),
        medicineName: z.string().min(2).optional(),
        dosage: z.string().min(1).optional(),
        frequency: z.string().min(1).optional(),
        timings: z.array(timePattern).optional(),
        durationDays: z.number().int().min(1).max(3650).optional(),
        instructions: z.string().max(500).optional(),
        accepted: z.boolean().default(true),
      }),
    )
    .default([]),
  /** Add the accepted items to the patient's medication list. */
  addToMedications: z.boolean().default(false),
});

export const listPrescriptionsSchema = z.object({
  patient: objectId.optional(),
  status: z.enum(['unverified', 'patient_confirmed', 'clinician_verified', 'rejected']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const patientIdParamSchema = z.object({ patientId: objectId });
export const idParamSchema = z.object({ id: objectId });
