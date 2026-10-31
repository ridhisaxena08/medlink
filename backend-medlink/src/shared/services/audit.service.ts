import { Request } from 'express';
import { Types } from 'mongoose';
import { AuditLog } from '../../modules/audit/audit.model';
import { AuditAction, Role } from '../constants';
import { AuthenticatedUser, ObjectIdLike } from '../types';
import { logger } from '../utils/logger';

export interface AuditInput {
  actor?: AuthenticatedUser | null;
  action: AuditAction;
  resourceType: string;
  resourceId?: ObjectIdLike;
  subject?: ObjectIdLike | null;
  outcome?: 'success' | 'denied' | 'failure';
  reason?: string;
  req?: Request;
  metadata?: Record<string, unknown>;
}

const toId = (value?: ObjectIdLike | null): Types.ObjectId | null => {
  if (!value) return null;
  return typeof value === 'string' ? new Types.ObjectId(value) : value;
};

/**
 * Fire-and-forget audit write. Auditing must never break the request it records,
 * so failures are logged, not thrown.
 */
export const recordAudit = async (input: AuditInput): Promise<void> => {
  try {
    await AuditLog.create({
      actor: input.actor ? new Types.ObjectId(input.actor.id) : null,
      actorRole: (input.actor?.role as Role) ?? null,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId ? String(input.resourceId) : undefined,
      subject: toId(input.subject),
      outcome: input.outcome ?? 'success',
      reason: input.reason,
      ip: input.req?.ip,
      userAgent: input.req?.get('user-agent'),
      metadata: input.metadata,
    });
  } catch (err) {
    logger.error('Failed to write audit log', err);
  }
};

export const auditAsync = (input: AuditInput): void => {
  void recordAudit(input);
};
