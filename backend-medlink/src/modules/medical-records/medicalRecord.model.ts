import { Schema, model, Document, Types } from 'mongoose';

export type MedicalRecordType =
  | 'condition'
  | 'allergy'
  | 'surgery'
  | 'immunization'
  | 'family_history'
  | 'lifestyle'
  | 'lab_result'
  | 'note';

export interface IMedicalRecord extends Document {
  _id: Types.ObjectId;
  patient: Types.ObjectId;
  type: MedicalRecordType;
  title: string;
  description?: string;
  /** Free-form structured payload per record type (e.g. allergen + reaction). */
  details?: Record<string, unknown>;
  severity?: 'mild' | 'moderate' | 'severe' | 'critical';
  status: 'active' | 'resolved' | 'inactive';
  onsetDate?: Date | null;
  resolvedDate?: Date | null;
  recordedBy: Types.ObjectId;
  recordedByRole: string;
  /** Patient-reported data is never silently promoted to clinician-verified. */
  source: 'patient_reported' | 'asha_reported' | 'clinician' | 'imported';
  verifiedBy?: Types.ObjectId | null;
  verifiedAt?: Date | null;
  attachments: Types.ObjectId[];
  syncedFromOffline: boolean;
  clientRecordId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const medicalRecordSchema = new Schema<IMedicalRecord>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['condition', 'allergy', 'surgery', 'immunization', 'family_history', 'lifestyle', 'lab_result', 'note'],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    description: String,
    details: { type: Schema.Types.Mixed },
    severity: { type: String, enum: ['mild', 'moderate', 'severe', 'critical'] },
    status: { type: String, enum: ['active', 'resolved', 'inactive'], default: 'active', index: true },
    onsetDate: { type: Date, default: null },
    resolvedDate: { type: Date, default: null },
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recordedByRole: { type: String, required: true },
    source: {
      type: String,
      enum: ['patient_reported', 'asha_reported', 'clinician', 'imported'],
      default: 'patient_reported',
    },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
    attachments: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    syncedFromOffline: { type: Boolean, default: false },
    clientRecordId: { type: String, index: true },
  },
  { timestamps: true, collection: 'medicalRecords' },
);

medicalRecordSchema.index({ patient: 1, type: 1, status: 1 });

export const MedicalRecord = model<IMedicalRecord>('MedicalRecord', medicalRecordSchema);
