import { Schema, model, Document, Types } from 'mongoose';

export interface IPrescribedItem {
  medicine?: Types.ObjectId | null;
  medicineName: string;
  dosage: string;
  frequency: string;
  durationDays?: number;
  timings: string[];
  route?: string;
  instructions?: string;
  /** Parser confidence 0-1 when the item came from OCR rather than typed entry. */
  confidence?: number;
  verified: boolean;
}

export interface IPrescription extends Document {
  _id: Types.ObjectId;
  patient: Types.ObjectId;
  doctor?: Types.ObjectId | null;
  consultation?: Types.ObjectId | null;
  hospital?: Types.ObjectId | null;
  issuedAt: Date;
  validUntil?: Date | null;
  items: IPrescribedItem[];
  advice?: string;
  diagnosisSummary?: string;
  document?: Types.ObjectId | null;
  source: 'doctor_issued' | 'uploaded_scan' | 'parsed';
  /** Parsed prescriptions stay unverified until a clinician or the patient confirms. */
  verificationStatus: 'unverified' | 'patient_confirmed' | 'clinician_verified' | 'rejected';
  verifiedBy?: Types.ObjectId | null;
  verifiedAt?: Date | null;
  rawParsedText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const prescriptionSchema = new Schema<IPrescription>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    consultation: { type: Schema.Types.ObjectId, ref: 'Consultation', default: null },
    hospital: { type: Schema.Types.ObjectId, ref: 'HospitalProfile', default: null },
    issuedAt: { type: Date, default: Date.now, index: true },
    validUntil: { type: Date, default: null },
    items: [
      {
        medicine: { type: Schema.Types.ObjectId, ref: 'Medicine', default: null },
        medicineName: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        durationDays: Number,
        timings: { type: [String], default: [] },
        route: String,
        instructions: String,
        confidence: Number,
        verified: { type: Boolean, default: false },
      },
    ],
    advice: String,
    diagnosisSummary: String,
    document: { type: Schema.Types.ObjectId, ref: 'Document', default: null },
    source: { type: String, enum: ['doctor_issued', 'uploaded_scan', 'parsed'], default: 'doctor_issued' },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'patient_confirmed', 'clinician_verified', 'rejected'],
      default: 'unverified',
      index: true,
    },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
    rawParsedText: String,
  },
  { timestamps: true, collection: 'prescriptions' },
);

prescriptionSchema.index({ patient: 1, issuedAt: -1 });

export const Prescription = model<IPrescription>('Prescription', prescriptionSchema);
