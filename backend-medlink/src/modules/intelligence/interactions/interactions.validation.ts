import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const checkInteractionsSchema = z
  .object({
    /** Generic/ingredient names to check. */
    ingredients: z.array(z.string().trim().min(2)).max(30).default([]),
    /** Catalogue ids; their ingredients are resolved server-side. */
    medicineIds: z.array(objectId).max(30).default([]),
    /** Include the patient's confirmed active medications in the check. */
    includePatientMedications: z.boolean().default(false),
    patient: objectId.optional(),
    lang: z.enum(['en', 'hi']).default('en'),
  })
  .refine(
    (v) => v.ingredients.length + v.medicineIds.length > 0 || v.includePatientMedications,
    { message: 'Provide ingredients, medicineIds, or set includePatientMedications' },
  );
