import { z } from 'zod';
import { ACCOUNT_STATUS, ALL_ROLES, VERIFICATION_STATUS } from '../../shared/constants';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const listUsersSchema = z.object({
  role: z.enum(ALL_ROLES as [string, ...string[]]).optional(),
  status: z.enum(Object.values(ACCOUNT_STATUS) as [string, ...string[]]).optional(),
  q: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(Object.values(ACCOUNT_STATUS) as [string, ...string[]]),
  reason: z.string().max(500).optional(),
});

export const verificationQueueSchema = z.object({
  role: z.enum(['doctor', 'asha', 'hospital', 'responder']).optional(),
  status: z.enum(Object.values(VERIFICATION_STATUS) as [string, ...string[]]).default('pending'),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const verifyEntitySchema = z.object({
  role: z.enum(['doctor', 'asha', 'hospital', 'responder']),
  status: z.enum([VERIFICATION_STATUS.VERIFIED, VERIFICATION_STATUS.REJECTED]),
  reason: z.string().max(500).optional(),
});

export const idParamSchema = z.object({ id: objectId });
