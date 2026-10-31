import { z } from 'zod';

export const chatSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().min(1).max(4000) }))
    .min(1)
    .max(30),
  language: z.enum(['en', 'hi']).default('en'),
  shareHealthContext: z.boolean().default(false),
});

export const speakSchema = z.object({
  text: z.string().trim().min(1).max(2000),
  language: z.enum(['en', 'hi']).default('en'),
  voice: z.string().optional(),
});

export const offlineQuerySchema = z.object({
  sinceVersion: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(2000).optional(),
  cursor: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
});
