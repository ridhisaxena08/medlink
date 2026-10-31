import { z } from 'zod';

export const listNotificationsSchema = z.object({
  unreadOnly: z.coerce.boolean().optional(),
  type: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const idParamSchema = z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/) });
