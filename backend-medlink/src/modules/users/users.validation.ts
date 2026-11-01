import { z } from 'zod';

export const updateMeSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  email: z.string().email().optional(),
  preferredLanguage: z.enum(['en', 'hi']).optional(),
});

export const deactivateSchema = z.object({ reason: z.string().max(500).optional() });
