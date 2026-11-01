import { z } from 'zod';
import { ALL_CONSENT_SCOPES, ALL_ROLES } from '../../shared/constants';

export const createConsentSchema = z.object({
  grantee: z.string().regex(/^[0-9a-fA-F]{24}$/, 'grantee must be a user id'),
  granteeRole: z.enum(ALL_ROLES as [string, ...string[]]),
  scopes: z.array(z.enum(ALL_CONSENT_SCOPES as [string, ...string[]])).min(1),
  purpose: z.string().max(500).optional(),
  durationDays: z.number().int().min(1).max(730).optional(),
  /** Patient id is only accepted for assisted flows and is verified server-side. */
  patient: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  evidence: z
    .object({
      method: z.enum(['in_app', 'otp', 'verbal_recorded', 'paper']).default('in_app'),
      reference: z.string().optional(),
    })
    .optional(),
});

export const listConsentSchema = z.object({
  status: z.enum(['active', 'revoked', 'expired']).optional(),
  direction: z.enum(['granted', 'received']).default('granted'),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const idParamSchema = z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/) });

export const revokeConsentSchema = z.object({ reason: z.string().max(500).optional() });
