import { Schema, model, Document, Types } from 'mongoose';
import { APPOINTMENT_STATUS, AppointmentStatus } from '../../shared/constants';

export interface IAppointmentStatusEvent {
  status: AppointmentStatus;
  at: Date;
  by: Types.ObjectId;
  reason?: string;
}

export interface IAppointment extends Document {
  _id: Types.ObjectId;
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  hospital?: Types.ObjectId | null;
  department?: Types.ObjectId | null;
  scheduledStart: Date;
  scheduledEnd: Date;
  mode: 'in_person' | 'teleconsult';
  reason: string;
  symptoms: string[];
  status: AppointmentStatus;
  bookedBy: Types.ObjectId;
  bookedByRole: 'patient' | 'asha' | 'hospital';
  rescheduledFrom?: Types.ObjectId | null;
  cancellationReason?: string;
  statusHistory: IAppointmentStatusEvent[];
  consultation?: Types.ObjectId | null;
  attachments: Types.ObjectId[];
  remindersSent: number;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'HospitalProfile', default: null, index: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
    scheduledStart: { type: Date, required: true, index: true },
    scheduledEnd: { type: Date, required: true },
    mode: { type: String, enum: ['in_person', 'teleconsult'], default: 'in_person' },
    reason: { type: String, required: true },
    symptoms: { type: [String], default: [] },
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.REQUESTED,
      index: true,
    },
    bookedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookedByRole: { type: String, enum: ['patient', 'asha', 'hospital'], default: 'patient' },
    rescheduledFrom: { type: Schema.Types.ObjectId, ref: 'Appointment', default: null },
    cancellationReason: String,
    statusHistory: [
      {
        status: { type: String, enum: Object.values(APPOINTMENT_STATUS), required: true },
        at: { type: Date, default: Date.now },
        by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        reason: String,
      },
    ],
    consultation: { type: Schema.Types.ObjectId, ref: 'Consultation', default: null },
    attachments: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    remindersSent: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'appointments' },
);

appointmentSchema.index({ doctor: 1, scheduledStart: 1, status: 1 });
appointmentSchema.index({ patient: 1, scheduledStart: -1 });

export const Appointment = model<IAppointment>('Appointment', appointmentSchema);
