import { Schema, model, Document, Types } from 'mongoose';
import { VERIFICATION_STATUS, VerificationStatus } from '../../shared/constants';
import { GeoPoint } from '../../shared/types';

export interface IResponderProfile extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  responderType: 'ambulance_driver' | 'paramedic' | 'emt' | 'volunteer';
  employeeId?: string;
  licenseNumber?: string;
  hospital?: Types.ObjectId | null;
  vehicle?: {
    registrationNumber: string;
    type: 'basic' | 'advanced' | 'cardiac' | 'bike' | 'other';
    deviceId?: string;
    capacity?: number;
    equipment: string[];
  };
  isAvailable: boolean;
  availabilityUpdatedAt?: Date;
  currentLocation?: GeoPoint;
  locationUpdatedAt?: Date | null;
  activeAssignment?: Types.ObjectId | null;
  serviceDistricts: string[];
  verificationStatus: VerificationStatus;
  verifiedBy?: Types.ObjectId | null;
  verifiedAt?: Date | null;
  stats: { completedAssignments: number; averageResponseMinutes: number };
  createdAt: Date;
  updatedAt: Date;
}

const responderProfileSchema = new Schema<IResponderProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    responderType: {
      type: String,
      enum: ['ambulance_driver', 'paramedic', 'emt', 'volunteer'],
      required: true,
    },
    employeeId: String,
    licenseNumber: String,
    hospital: { type: Schema.Types.ObjectId, ref: 'HospitalProfile', default: null, index: true },
    vehicle: {
      registrationNumber: String,
      type: { type: String, enum: ['basic', 'advanced', 'cardiac', 'bike', 'other'] },
      deviceId: { type: String, index: true },
      capacity: Number,
      equipment: { type: [String], default: [] },
    },
    isAvailable: { type: Boolean, default: false, index: true },
    availabilityUpdatedAt: Date,
    currentLocation: { type: { type: String, enum: ['Point'] }, coordinates: { type: [Number] } },
    locationUpdatedAt: { type: Date, default: null },
    activeAssignment: { type: Schema.Types.ObjectId, ref: 'ResponderAssignment', default: null },
    serviceDistricts: { type: [String], default: [], index: true },
    verificationStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
      index: true,
    },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
    stats: {
      completedAssignments: { type: Number, default: 0 },
      averageResponseMinutes: { type: Number, default: 0 },
    },
  },
  { timestamps: true, collection: 'responderProfiles' },
);

responderProfileSchema.index({ currentLocation: '2dsphere' });
responderProfileSchema.index({ isAvailable: 1, verificationStatus: 1 });

export const ResponderProfile = model<IResponderProfile>('ResponderProfile', responderProfileSchema);
