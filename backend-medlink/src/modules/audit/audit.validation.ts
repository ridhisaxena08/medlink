import { z } from 'zod';
import { AUDIT_ACTIONS } from '../../shared/constants';

export const listAuditSchema = z.object({
  action: z.enum(Object.values(AUDIT_ACTIONS) as [string, ...string[]]).optional(),
  resourceType: z.string().optional(),
  actor: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  subject: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  outcome: z.enum(['success', 'denied', 'failure']).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});
