import { Schema, model, Document, Types } from 'mongoose';
import { VERIFICATION_STATUS, VerificationStatus, ALL_CONSENT_SCOPES, ConsentScope } from '../../shared/constants';
import { GeoPoint } from '../../shared/types';

export interface IAshaProfile extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  ashaId: string;
  block?: string;
  village?: string;
  district: string;
  state: string;
  coverageArea?: GeoPoint;
  supervisorName?: string;
  supervisorPhone?: string;
  hospital?: Types.ObjectId | null;
  verificationStatus: VerificationStatus;
  verifiedBy?: Types.ObjectId | null;
  verifiedAt?: Date | null;
  trainingCertificates: Types.ObjectId[];
  languages: string[];
  deviceId?: string;
  lastSyncAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ashaProfileSchema = new Schema<IAshaProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    ashaId: { type: String, required: true, unique: true, trim: true },
    block: String,
    village: String,
    district: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    coverageArea: { type: { type: String, enum: ['Point'] }, coordinates: { type: [Number] } },
    supervisorName: String,
    supervisorPhone: String,
    hospital: { type: Schema.Types.ObjectId, ref: 'HospitalProfile', default: null, index: true },
    verificationStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
      index: true,
    },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
    trainingCertificates: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    languages: { type: [String], default: ['hi'] },
    deviceId: String,
    lastSyncAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'ashaProfiles' },
);

ashaProfileSchema.index({ coverageArea: '2dsphere' });

export const AshaProfile = model<IAshaProfile>('AshaProfile', ashaProfileSchema);

/**
 * Explicit, expiring link between an ASHA worker and a patient.
 * Nothing in the ASHA module reads patient data without an active row here
 * AND an active consent record - see shared/services/access.service.ts.
 */
export interface IAshaAssignment extends Document {
  _id: Types.ObjectId;
  asha: Types.ObjectId;
  patient: Types.ObjectId;
  assignedBy: Types.ObjectId;
  assignedByRole: 'hospital' | 'admin' | 'patient';
  scopes: ConsentScope[];
  reason?: string;
  status: 'active' | 'expired' | 'revoked';
  startsAt: Date;
  expiresAt: Date;
  revokedAt?: Date | null;
  revokedBy?: Types.ObjectId | null;
  consent?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const ashaAssignmentSchema = new Schema<IAshaAssignment>(
  {
    asha: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedByRole: { type: String, enum: ['hospital', 'admin', 'patient'], required: true },
    scopes: { type: [String], enum: ALL_CONSENT_SCOPES, default: ['profile', 'medical_history', 'reminders'] },
    reason: String,
    status: { type: String, enum: ['active', 'expired', 'revoked'], default: 'active', index: true },
    startsAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
    revokedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    consent: { type: Schema.Types.ObjectId, ref: 'Consent', default: null },
  },
  { timestamps: true, collection: 'ashaAssignments' },
);

ashaAssignmentSchema.index({ asha: 1, patient: 1, status: 1 });

export const AshaAssignment = model<IAshaAssignment>('AshaAssignment', ashaAssignmentSchema);

export interface IFollowUp extends Document {
  _id: Types.ObjectId;
  asha: Types.ObjectId;
  patient: Types.ObjectId;
  visitedAt: Date;
  visitType: 'home_visit' | 'phone' | 'camp' | 'other';
  notes: string;
  vitals?: { temperatureC?: number; pulseBpm?: number; systolic?: number; diastolic?: number; spo2?: number };
  adherenceReported?: 'good' | 'partial' | 'poor' | 'unknown';
  concerns: string[];
  referralMade: boolean;
  referredTo?: Types.ObjectId | null;
  nextVisitDate?: Date | null;
  attachments: Types.ObjectId[];
  location?: { type: 'Point'; coordinates: [number, number] };
  syncedFromOffline: boolean;
  clientRecordId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const followUpSchema = new Schema<IFollowUp>(
  {
    asha: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    visitedAt: { type: Date, default: Date.now, index: true },
    visitType: { type: String, enum: ['home_visit', 'phone', 'camp', 'other'], default: 'home_visit' },
    notes: { type: String, required: true },
    vitals: { temperatureC: Number, pulseBpm: Number, systolic: Number, diastolic: Number, spo2: Number },
    adherenceReported: { type: String, enum: ['good', 'partial', 'poor', 'unknown'], default: 'unknown' },
    concerns: { type: [String], default: [] },
    referralMade: { type: Boolean, default: false },
    referredTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    nextVisitDate: { type: Date, default: null },
    attachments: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    location: { type: { type: String, enum: ['Point'] }, coordinates: { type: [Number] } },
    syncedFromOffline: { type: Boolean, default: false },
    clientRecordId: { type: String, index: true },
  },
  { timestamps: true, collection: 'ashaFollowUps' },
);

export const FollowUp = model<IFollowUp>('FollowUp', followUpSchema);
