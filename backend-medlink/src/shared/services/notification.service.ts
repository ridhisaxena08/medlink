import { Types } from 'mongoose';
import { Notification } from '../../modules/notifications/notification.model';
import { NotificationChannel } from '../constants';
import { ObjectIdLike } from '../types';
import { logger } from '../utils/logger';
import { smsService } from '../../modules/intelligence/sms/sms.service';

export interface NotifyInput {
  user: ObjectIdLike;
  type: string;
  title: string;
  body: string;
  channels?: NotificationChannel[];
  data?: Record<string, unknown>;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  /** Required for the sms channel; omitted means sms is skipped. */
  phone?: string;
  smsConsent?: boolean;
}

/**
 * Single entry point for every outbound user notification.
 * in_app is always persisted; push/sms are delegated to providers and recorded
 * per channel so delivery can be audited.
 */
export const notify = async (input: NotifyInput) => {
  const channels = input.channels?.length ? input.channels : (['in_app'] as NotificationChannel[]);
  const deliveryStatus: Record<string, 'pending' | 'sent' | 'failed' | 'skipped'> = {};

  for (const channel of channels) {
    if (channel === 'in_app') deliveryStatus.in_app = 'sent';
    else deliveryStatus[channel] = 'pending';
  }

  const notification = await Notification.create({
    user: new Types.ObjectId(String(input.user)),
    type: input.type,
    title: input.title,
    body: input.body,
    channels,
    data: input.data,
    priority: input.priority ?? 'normal',
    deliveredAt: new Date(),
    deliveryStatus,
  });

  if (channels.includes('sms')) {
    if (!input.phone || input.smsConsent === false) {
      notification.deliveryStatus.sms = 'skipped';
    } else {
      try {
        await smsService.send({ to: input.phone, body: `${input.title}: ${input.body}` });
        notification.deliveryStatus.sms = 'sent';
      } catch (err) {
        logger.error('SMS delivery failed', err);
        notification.deliveryStatus.sms = 'failed';
      }
    }
    notification.markModified('deliveryStatus');
    await notification.save();
  }

  if (channels.includes('push')) {
    // Push provider is not wired yet; the record keeps the intent visible.
    notification.deliveryStatus.push = 'pending';
    notification.markModified('deliveryStatus');
    await notification.save();
  }

  return notification;
};

export const notifyMany = async (inputs: NotifyInput[]) => Promise.all(inputs.map((i) => notify(i)));
