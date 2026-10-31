import { z } from 'zod';

export const pushSchema = z.object({
  deviceId: z.string().trim().min(3).max(100),
  records: z
    .array(
      z.object({
        clientRecordId: z.string().trim().min(1).max(100),
        entity: z.enum(['medical_record', 'follow_up', 'reminder', 'appointment', 'emergency_request', 'document']),
        operation: z.enum(['create', 'update', 'delete']),
        payload: z.record(z.unknown()),
        clientUpdatedAt: z.coerce.date(),
      }),
    )
    .min(1)
    .max(200),
});

export const pullSchema = z.object({
  deviceId: z.string().trim().min(3).max(100),
  since: z.coerce.date().optional(),
  entities: z
    .union([z.array(z.string()), z.string()])
    .transform((v) => (Array.isArray(v) ? v : v.split(',').map((s) => s.trim()).filter(Boolean)))
    .optional(),
  limit: z.coerce.number().int().min(1).max(500).default(200),
});
