import { Types } from 'mongoose';
import { ROLES } from '../../shared/constants';
import { AuthenticatedUser } from '../../shared/types';
import { pageMeta, parsePagination } from '../../shared/utils/pagination';
import { AuditLog } from './audit.model';

export interface AuditQuery {
  action?: string;
  resourceType?: string;
  actor?: string;
  subject?: string;
  outcome?: string;
  from?: Date;
  to?: Date;
  page?: number;
  limit?: number;
}

/**
 * Admins see the whole trail; every other role sees only entries about
 * themselves - either as the actor or as the data subject.
 */
export const listAuditLogs = async (actor: AuthenticatedUser, query: AuditQuery) => {
  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> = {};

  if (actor.role !== ROLES.ADMIN) {
    filter.$or = [{ actor: new Types.ObjectId(actor.id) }, { subject: new Types.ObjectId(actor.id) }];
  } else {
    if (query.actor) filter.actor = new Types.ObjectId(query.actor);
    if (query.subject) filter.subject = new Types.ObjectId(query.subject);
  }

  if (query.action) filter.action = query.action;
  if (query.resourceType) filter.resourceType = query.resourceType;
  if (query.outcome) filter.outcome = query.outcome;
  if (query.from || query.to) {
    filter.createdAt = {
      ...(query.from ? { $gte: query.from } : {}),
      ...(query.to ? { $lte: query.to } : {}),
    };
  }

  const [items, total] = await Promise.all([
    AuditLog.find(filter)
      .populate('actor', 'name role')
      .sort({ createdAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

export const auditStats = async (days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return AuditLog.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: { action: '$action', outcome: '$outcome' }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};
