import { Schema, model, Document as MongooseDocument, Types } from 'mongoose';

export type DocumentCategory =
  | 'prescription'
  | 'lab_report'
  | 'scan'
  | 'discharge_summary'
  | 'insurance'
  | 'id_proof'
  | 'certificate'
  | 'medicine_image'
  | 'other';

export interface IDocument extends MongooseDocument {
  _id: Types.ObjectId;
  /** Patient the document belongs to (the access-control subject). */
  patient?: Types.ObjectId | null;
  owner: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  uploadedByRole: string;
  category: DocumentCategory;
  title: string;
  description?: string;
  storageKey: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  checksum: string;
  tags: string[];
  documentDate?: Date | null;
  relatedConsultation?: Types.ObjectId | null;
  relatedAppointment?: Types.ObjectId | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedByRole: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'prescription', 'lab_report', 'scan', 'discharge_summary',
        'insurance', 'id_proof', 'certificate', 'medicine_image', 'other',
      ],
      default: 'other',
      index: true,
    },
    title: { type: String, required: true },
    description: String,
    storageKey: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    checksum: { type: String, required: true },
    tags: { type: [String], default: [] },
    documentDate: { type: Date, default: null },
    relatedConsultation: { type: Schema.Types.ObjectId, ref: 'Consultation', default: null },
    relatedAppointment: { type: Schema.Types.ObjectId, ref: 'Appointment', default: null },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'documents' },
);

documentSchema.index({ patient: 1, category: 1, createdAt: -1 });

export const DocumentModel = model<IDocument>('Document', documentSchema);
