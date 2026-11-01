import { Schema, model, Document, Types } from 'mongoose';
import { NOTIFICATION_CHANNELS, NotificationChannel } from '../../shared/constants';

export interface INotification extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  type: string;
  title: string;
  body: string;
  channels: NotificationChannel[];
  data?: Record<string, unknown>;
  priority: 'low' | 'normal' | 'high' | 'critical';
  readAt?: Date | null;
  deliveredAt?: Date | null;
  deliveryStatus: Record<string, 'pending' | 'sent' | 'failed' | 'skipped'>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    channels: { type: [String], enum: NOTIFICATION_CHANNELS, default: ['in_app'] },
    data: { type: Schema.Types.Mixed },
    priority: { type: String, enum: ['low', 'normal', 'high', 'critical'], default: 'normal' },
    readAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    deliveryStatus: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, collection: 'notifications' },
);

notificationSchema.index({ user: 1, readAt: 1, createdAt: -1 });

export const Notification = model<INotification>('Notification', notificationSchema);
