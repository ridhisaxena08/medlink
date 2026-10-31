import { Schema, model, Document, Types } from 'mongoose';
import { VERIFICATION_STATUS, VerificationStatus } from '../../shared/constants';
import { GeoPoint } from '../../shared/types';
import { Weekday, WEEKDAYS } from '../../shared/utils/dates';

export interface IHospitalProfile extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  type: 'phc' | 'chc' | 'district_hospital' | 'private_hospital' | 'clinic' | 'diagnostic_center';
  registrationNumber: string;
  contact: { phone: string; alternatePhone?: string; email?: string; website?: string };
  address: {
    line1: string;
    line2?: string;
    village?: string;
    city?: string;
    district: string;
    state: string;
    pincode: string;
    location: GeoPoint;
  };
  services: string[];
  facilities: { ambulance: boolean; emergency24x7: boolean; icu: boolean; bloodBank: boolean; pharmacy: boolean; laboratory: boolean };
  bedCapacity: { total: number; available: number; icu: number; icuAvailable: number };
  operatingHours: { weekday: Weekday; openTime: string; closeTime: string; closed: boolean }[];
  verificationStatus: VerificationStatus;
  verifiedBy?: Types.ObjectId | null;
  verifiedAt?: Date | null;
  acceptsEmergencies: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const hospitalProfileSchema = new Schema<IHospitalProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    type: {
      type: String,
      enum: ['phc', 'chc', 'district_hospital', 'private_hospital', 'clinic', 'diagnostic_center'],
      required: true,
      index: true,
    },
    registrationNumber: { type: String, required: true, unique: true, trim: true },
    contact: {
      phone: { type: String, required: true },
      alternatePhone: String,
      email: String,
      website: String,
    },
    address: {
      line1: { type: String, required: true },
      line2: String,
      village: String,
      city: String,
      district: { type: String, required: true, index: true },
      state: { type: String, required: true, index: true },
      pincode: { type: String, required: true },
      location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true },
      },
    },
    services: { type: [String], default: [] },
    facilities: {
      ambulance: { type: Boolean, default: false },
      emergency24x7: { type: Boolean, default: false },
      icu: { type: Boolean, default: false },
      bloodBank: { type: Boolean, default: false },
      pharmacy: { type: Boolean, default: false },
      laboratory: { type: Boolean, default: false },
    },
    bedCapacity: {
      total: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
      icu: { type: Number, default: 0 },
      icuAvailable: { type: Number, default: 0 },
    },
    operatingHours: [
      {
        weekday: { type: String, enum: WEEKDAYS, required: true },
        openTime: { type: String, default: '00:00' },
        closeTime: { type: String, default: '23:59' },
        closed: { type: Boolean, default: false },
      },
    ],
    verificationStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
      index: true,
    },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
    acceptsEmergencies: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, collection: 'hospitalProfiles' },
);

hospitalProfileSchema.index({ 'address.location': '2dsphere' });

export const HospitalProfile = model<IHospitalProfile>('HospitalProfile', hospitalProfileSchema);

export interface IDepartment extends Document {
  _id: Types.ObjectId;
  hospital: Types.ObjectId;
  name: string;
  specialty: string;
  description?: string;
  headDoctor?: Types.ObjectId | null;
  contactExtension?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    hospital: { type: Schema.Types.ObjectId, ref: 'HospitalProfile', required: true, index: true },
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, index: true },
    description: String,
    headDoctor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    contactExtension: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'departments' },
);

departmentSchema.index({ hospital: 1, name: 1 }, { unique: true });

export const Department = model<IDepartment>('Department', departmentSchema);
