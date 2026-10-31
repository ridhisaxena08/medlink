import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);
const coordinates = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);

export const updatePatientProfileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(['male', 'female', 'other', 'undisclosed']).optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  heightCm: z.number().min(0).max(300).optional(),
  weightKg: z.number().min(0).max(500).optional(),
  primaryLanguage: z.enum(['en', 'hi']).optional(),
  address: z
    .object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      village: z.string().optional(),
      district: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      coordinates: coordinates.optional(),
    })
    .optional(),
  governmentId: z.object({ type: z.enum(['abha', 'aadhaar_masked', 'other']), value: z.string() }).optional(),
});

export const patientIdParamSchema = z.object({ patientId: objectId });
