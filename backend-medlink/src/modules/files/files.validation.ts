import { z } from 'zod';

export const uploadSchema = z.object({
  category: z
    .enum([
      'prescription', 'lab_report', 'scan', 'discharge_summary',
      'insurance', 'id_proof', 'certificate', 'medicine_image', 'other',
    ])
    .default('other'),
  title: z.string().trim().min(1).max(200),
  description: z.string().max(1000).optional(),
  tags: z
    .union([z.array(z.string()), z.string()])
    .transform((v) => (Array.isArray(v) ? v : v.split(',').map((s) => s.trim()).filter(Boolean)))
    .optional(),
  documentDate: z.coerce.date().optional(),
  patient: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  relatedConsultation: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  relatedAppointment: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
});

export const listDocumentsSchema = z.object({
  patient: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const idParamSchema = z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/) });
