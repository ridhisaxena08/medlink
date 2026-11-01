import { Types } from 'mongoose';
import { ApiError } from '../../shared/utils/ApiError';
import { pageMeta, parsePagination } from '../../shared/utils/pagination';
import { Notification } from './notification.model';

export const listForUser = async (
  userId: string,
  query: { unreadOnly?: boolean; type?: string; page?: number; limit?: number },
) => {
  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> = { user: new Types.ObjectId(userId) };
  if (query.unreadOnly) filter.readAt = null;
  if (query.type) filter.type = query.type;

  const [items, total, unread] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(page.skip).limit(page.limit).lean(),
    Notification.countDocuments(filter),
    Notification.countDocuments({ user: new Types.ObjectId(userId), readAt: null }),
  ]);

  return { items, meta: { ...pageMeta(total, page), unread } };
};

export const markRead = async (userId: string, notificationId: string) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: new Types.ObjectId(userId) },
    { $set: { readAt: new Date() } },
    { new: true },
  );
  if (!notification) throw ApiError.notFound('Notification not found');
  return notification;
};

export const markAllRead = async (userId: string) => {
  const result = await Notification.updateMany(
    { user: new Types.ObjectId(userId), readAt: null },
    { $set: { readAt: new Date() } },
  );
  return { updated: result.modifiedCount };
};
