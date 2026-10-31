import { Schema, model, Document, Types } from 'mongoose';

export interface IConsultation extends Document {
  _id: Types.ObjectId;
  appointment?: Types.ObjectId | null;
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  hospital?: Types.ObjectId | null;
  consultedAt: Date;
  mode: 'in_person' | 'teleconsult' | 'field_visit';
  chiefComplaint: string;
  symptoms: string[];
  vitals?: {
    temperatureC?: number;
    pulseBpm?: number;
    systolic?: number;
    diastolic?: number;
    spo2?: number;
    respiratoryRate?: number;
    bloodSugarMgDl?: number;
  };
  examinationNotes?: string;
  diagnosis: { code?: string; description: string; type: 'provisional' | 'confirmed' }[];
  advice?: string;
  followUpDate?: Date | null;
  prescriptions: Types.ObjectId[];
  attachments: Types.ObjectId[];
  status: 'draft' | 'final' | 'amended';
  createdAt: Date;
  updatedAt: Date;
}

const consultationSchema = new Schema<IConsultation>(
  {
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', default: null, index: true },
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'HospitalProfile', default: null },
    consultedAt: { type: Date, default: Date.now, index: true },
    mode: { type: String, enum: ['in_person', 'teleconsult', 'field_visit'], default: 'in_person' },
    chiefComplaint: { type: String, required: true },
    symptoms: { type: [String], default: [] },
    vitals: {
      temperatureC: Number,
      pulseBpm: Number,
      systolic: Number,
      diastolic: Number,
      spo2: Number,
      respiratoryRate: Number,
      bloodSugarMgDl: Number,
    },
    examinationNotes: String,
    diagnosis: [
      {
        code: String,
        description: { type: String, required: true },
        type: { type: String, enum: ['provisional', 'confirmed'], default: 'provisional' },
      },
    ],
    advice: String,
    followUpDate: { type: Date, default: null },
    prescriptions: [{ type: Schema.Types.ObjectId, ref: 'Prescription' }],
    attachments: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    status: { type: String, enum: ['draft', 'final', 'amended'], default: 'final' },
  },
  { timestamps: true, collection: 'consultations' },
);

consultationSchema.index({ patient: 1, consultedAt: -1 });

export const Consultation = model<IConsultation>('Consultation', consultationSchema);
