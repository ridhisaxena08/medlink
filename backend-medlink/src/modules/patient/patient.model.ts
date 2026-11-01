import { Schema, model, Document, Types } from 'mongoose';
import { GeoPoint } from '../../shared/types';

export interface IEmergencyContactRef {
  name: string;
  phone: string;
  relationship: string;
}

export interface IPatientProfile extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'undisclosed';
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  heightCm?: number;
  weightKg?: number;
  address?: {
    line1?: string;
    line2?: string;
    village?: string;
    district?: string;
    state?: string;
    pincode?: string;
    location?: GeoPoint;
  };
  governmentId?: { type: 'abha' | 'aadhaar_masked' | 'other'; value: string };
  primaryLanguage: 'en' | 'hi';
  registeredBy?: Types.ObjectId | null;   // ASHA worker for assisted registration
  registrationChannel: 'self' | 'asha_assisted' | 'hospital';
  createdAt: Date;
  updatedAt: Date;
  age?: number;
}

const patientProfileSchema = new Schema<IPatientProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other', 'undisclosed'] },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    heightCm: { type: Number, min: 0, max: 300 },
    weightKg: { type: Number, min: 0, max: 500 },
    address: {
      line1: String,
      line2: String,
      village: String,
      district: String,
      state: String,
      pincode: String,
      location: {
        type: { type: String, enum: ['Point'] },
        coordinates: { type: [Number] },
      },
    },
    governmentId: {
      type: { type: String, enum: ['abha', 'aadhaar_masked', 'other'] },
      value: String,
    },
    primaryLanguage: { type: String, enum: ['en', 'hi'], default: 'en' },
    registeredBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    registrationChannel: { type: String, enum: ['self', 'asha_assisted', 'hospital'], default: 'self' },
  },
  { timestamps: true, collection: 'patientProfiles', toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

patientProfileSchema.index({ 'address.location': '2dsphere' });
patientProfileSchema.index({ 'address.district': 1, 'address.state': 1 });

patientProfileSchema.virtual('age').get(function (this: IPatientProfile) {
  if (!this.dateOfBirth) return undefined;
  const diff = Date.now() - this.dateOfBirth.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
});

export const PatientProfile = model<IPatientProfile>('PatientProfile', patientProfileSchema);
