import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const createRecordSchema = z.object({
  type: z.enum(['condition', 'allergy', 'surgery', 'immunization', 'family_history', 'lifestyle', 'lab_result', 'note']),
  title: z.string().trim().min(2).max(200),
  description: z.string().max(2000).optional(),
  details: z.record(z.unknown()).optional(),
  severity: z.enum(['mild', 'moderate', 'severe', 'critical']).optional(),
  status: z.enum(['active', 'resolved', 'inactive']).default('active'),
  onsetDate: z.coerce.date().optional(),
  resolvedDate: z.coerce.date().optional(),
  attachments: z.array(objectId).default([]),
  patient: objectId.optional(),
  clientRecordId: z.string().optional(),
});

export const updateRecordSchema = createRecordSchema.partial().omit({ patient: true });

export const listRecordsSchema = z.object({
  patient: objectId.optional(),
  type: z.string().optional(),
  status: z.enum(['active', 'resolved', 'inactive']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const idParamSchema = z.object({ id: objectId });
