import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const scanSchema = z.object({
  /** What the image is, so the right post-processing runs. */
  kind: z.enum(['medicine_strip', 'prescription']).default('medicine_strip'),
  patient: objectId.optional(),
  /** Store the image as a patient document as well as processing it. */
  saveDocument: z.coerce.boolean().default(false),
  lang: z.enum(['en', 'hi']).default('en'),
});

export const identifySchema = z.object({
  /** Text already extracted on-device; lets offline clients skip upload. */
  text: z.string().trim().min(2).max(5000),
  limit: z.coerce.number().int().min(1).max(20).default(5),
});
