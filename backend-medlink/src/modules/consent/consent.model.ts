import { Schema, model, Document, Types } from 'mongoose';
import {
  ALL_CONSENT_SCOPES,
  ALL_ROLES,
  CONSENT_STATUS,
  ConsentScope,
  ConsentStatus,
  Role,
} from '../../shared/constants';

export interface IConsent extends Document {
  _id: Types.ObjectId;
  patient: Types.ObjectId;       // users._id of the patient (data subject)
  grantee: Types.ObjectId;       // users._id receiving access
  granteeRole: Role;
  scopes: ConsentScope[];
  purpose?: string;
  status: ConsentStatus;
  grantedBy: Types.ObjectId;     // who recorded the consent (patient or assisted-by)
  grantedAt: Date;
  expiresAt: Date;
  revokedAt?: Date | null;
  revokedBy?: Types.ObjectId | null;
  revocationReason?: string;
  evidence?: { method: 'in_app' | 'otp' | 'verbal_recorded' | 'paper'; reference?: string };
  createdAt: Date;
  updatedAt: Date;
}

const consentSchema = new Schema<IConsent>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    grantee: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    granteeRole: { type: String, enum: ALL_ROLES, required: true },
    scopes: { type: [String], enum: ALL_CONSENT_SCOPES, required: true },
    purpose: String,
    status: { type: String, enum: Object.values(CONSENT_STATUS), default: CONSENT_STATUS.ACTIVE, index: true },
    grantedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    grantedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
    revokedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    revocationReason: String,
    evidence: {
      method: { type: String, enum: ['in_app', 'otp', 'verbal_recorded', 'paper'], default: 'in_app' },
      reference: String,
    },
  },
  { timestamps: true, collection: 'consents' },
);

consentSchema.index({ patient: 1, grantee: 1, status: 1 });

export const Consent = model<IConsent>('Consent', consentSchema);
