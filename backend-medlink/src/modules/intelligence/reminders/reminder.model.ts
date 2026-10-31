import { Schema, model, Document, Types } from 'mongoose';
import { NOTIFICATION_CHANNELS, NotificationChannel, REMINDER_STATUS, ReminderStatus } from '../../../shared/constants';

export interface IReminderDose {
  time: string;          // HH:mm local
  label?: string;
  amount?: string;
}

export interface IReminder extends Document {
  _id: Types.ObjectId;
  patient: Types.ObjectId;
  medication?: Types.ObjectId | null;
  medicineName: string;
  doses: IReminderDose[];
  daysOfWeek: number[];  // 0-6, empty = every day
  startDate: Date;
  endDate?: Date | null;
  timezone: string;
  channels: NotificationChannel[];
  status: ReminderStatus;
  /** Proposed schedules (engine-generated) require explicit approval to activate. */
  createdBy: Types.ObjectId;
  createdByRole: string;
  approvedByPatient: boolean;
  approvedAt?: Date | null;
  lastTriggeredAt?: Date | null;
  nextTriggerAt?: Date | null;
  adherence: { taken: number; missed: number; skipped: number };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reminderSchema = new Schema<IReminder>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    medication: { type: Schema.Types.ObjectId, ref: 'PatientMedication', default: null },
    medicineName: { type: String, required: true },
    doses: [{ time: { type: String, required: true }, label: String, amount: String }],
    daysOfWeek: { type: [Number], default: [] },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    timezone: { type: String, default: 'Asia/Kolkata' },
    channels: { type: [String], enum: NOTIFICATION_CHANNELS, default: ['in_app'] },
    status: {
      type: String,
      enum: Object.values(REMINDER_STATUS),
      default: REMINDER_STATUS.PROPOSED,
      index: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdByRole: { type: String, required: true },
    approvedByPatient: { type: Boolean, default: false, index: true },
    approvedAt: { type: Date, default: null },
    lastTriggeredAt: { type: Date, default: null },
    nextTriggerAt: { type: Date, default: null, index: true },
    adherence: { taken: { type: Number, default: 0 }, missed: { type: Number, default: 0 }, skipped: { type: Number, default: 0 } },
    notes: String,
  },
  { timestamps: true, collection: 'reminders' },
);

reminderSchema.index({ patient: 1, status: 1 });

export const Reminder = model<IReminder>('Reminder', reminderSchema);
