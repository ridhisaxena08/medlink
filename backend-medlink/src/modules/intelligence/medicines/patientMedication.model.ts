import { Schema, model, Document, Types } from 'mongoose';

export interface IPatientMedication extends Document {
  _id: Types.ObjectId;
  patient: Types.ObjectId;
  medicine?: Types.ObjectId | null;
  /** Free-text fallback when the medicine is not in the catalogue yet. */
  medicineName: string;
  dosage: string;
  frequency: string;
  timings: string[];           // ["08:00","20:00"]
  route?: string;
  instructions?: string;
  startDate: Date;
  endDate?: Date | null;
  durationDays?: number;
  status: 'active' | 'completed' | 'stopped';
  stopReason?: string;
  source: 'prescription' | 'self_reported' | 'asha_reported' | 'scan';
  prescription?: Types.ObjectId | null;
  /** Nothing becomes an active medication or reminder without this flag. */
  confirmedByPatient: boolean;
  confirmedAt?: Date | null;
  addedBy: Types.ObjectId;
  addedByRole: string;
  createdAt: Date;
  updatedAt: Date;
}

const patientMedicationSchema = new Schema<IPatientMedication>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    medicine: { type: Schema.Types.ObjectId, ref: 'Medicine', default: null },
    medicineName: { type: String, required: true, trim: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    timings: { type: [String], default: [] },
    route: String,
    instructions: String,
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    durationDays: Number,
    status: { type: String, enum: ['active', 'completed', 'stopped'], default: 'active', index: true },
    stopReason: String,
    source: {
      type: String,
      enum: ['prescription', 'self_reported', 'asha_reported', 'scan'],
      default: 'self_reported',
    },
    prescription: { type: Schema.Types.ObjectId, ref: 'Prescription', default: null },
    confirmedByPatient: { type: Boolean, default: false, index: true },
    confirmedAt: { type: Date, default: null },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    addedByRole: { type: String, required: true },
  },
  { timestamps: true, collection: 'patientMedications' },
);

patientMedicationSchema.index({ patient: 1, status: 1 });

export const PatientMedication = model<IPatientMedication>('PatientMedication', patientMedicationSchema);
