import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const prepareSmsSchema = z.object({
  reminder: objectId.optional(),
  patient: objectId.optional(),
  template: z.enum(['medicine_reminder', 'appointment_reminder', 'followup', 'custom']).default('medicine_reminder'),
  lang: z.enum(['en', 'hi']).default('en'),
  variables: z.record(z.string()).default({}),
  customBody: z.string().max(600).optional(),
});

export const sendSmsSchema = z.object({
  patient: objectId,
  body: z.string().trim().min(5).max(600),
  /** The prepared message the caller reviewed; sending requires an explicit approval. */
  approved: z.literal(true),
  reminder: objectId.optional(),
});
