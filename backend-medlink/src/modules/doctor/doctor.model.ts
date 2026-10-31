import { Schema, model, Document, Types } from 'mongoose';
import { VERIFICATION_STATUS, VerificationStatus } from '../../shared/constants';
import { GeoPoint } from '../../shared/types';
import { Weekday, WEEKDAYS } from '../../shared/utils/dates';

export interface IAvailabilitySlotTemplate {
  weekday: Weekday;
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
  slotDurationMinutes: number;
  mode: 'in_person' | 'teleconsult';
  hospital?: Types.ObjectId | null;
  isActive: boolean;
}

export interface IDoctorProfile extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  registrationNumber: string;
  specialties: string[];
  qualifications: { degree: string; institution?: string; year?: number }[];
  experienceYears: number;
  languages: string[];
  consultationFee?: number;
  teleconsultFee?: number;
  bio?: string;
  hospitals: Types.ObjectId[];
  departments: string[];
  verificationStatus: VerificationStatus;
  verifiedBy?: Types.ObjectId | null;
  verifiedAt?: Date | null;
  rejectionReason?: string;
  availability: IAvailabilitySlotTemplate[];
  availabilityExceptions: { date: Date; reason?: string; unavailableAllDay: boolean }[];
  acceptingNewPatients: boolean;
  rating: { average: number; count: number };
  practiceLocation?: { city?: string; district?: string; state?: string; location?: GeoPoint };
  createdAt: Date;
  updatedAt: Date;
}

const availabilitySchema = new Schema<IAvailabilitySlotTemplate>(
  {
    weekday: { type: String, enum: WEEKDAYS, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotDurationMinutes: { type: Number, default: 15, min: 5, max: 180 },
    mode: { type: String, enum: ['in_person', 'teleconsult'], default: 'in_person' },
    hospital: { type: Schema.Types.ObjectId, ref: 'HospitalProfile', default: null },
    isActive: { type: Boolean, default: true },
  },
  { _id: true },
);

const doctorProfileSchema = new Schema<IDoctorProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    registrationNumber: { type: String, required: true, unique: true, trim: true },
    specialties: { type: [String], default: [], index: true },
    qualifications: [{ degree: { type: String, required: true }, institution: String, year: Number }],
    experienceYears: { type: Number, default: 0, min: 0 },
    languages: { type: [String], default: ['en'] },
    consultationFee: { type: Number, min: 0 },
    teleconsultFee: { type: Number, min: 0 },
    bio: String,
    hospitals: [{ type: Schema.Types.ObjectId, ref: 'HospitalProfile', index: true }],
    departments: { type: [String], default: [] },
    verificationStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
      index: true,
    },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
    rejectionReason: String,
    availability: { type: [availabilitySchema], default: [] },
    availabilityExceptions: [
      { date: { type: Date, required: true }, reason: String, unavailableAllDay: { type: Boolean, default: true } },
    ],
    acceptingNewPatients: { type: Boolean, default: true },
    rating: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    practiceLocation: {
      city: String,
      district: String,
      state: String,
      location: { type: { type: String, enum: ['Point'] }, coordinates: { type: [Number] } },
    },
  },
  { timestamps: true, collection: 'doctorProfiles' },
);

doctorProfileSchema.index({ 'practiceLocation.location': '2dsphere' });
doctorProfileSchema.index({ specialties: 1, verificationStatus: 1, acceptingNewPatients: 1 });

export const DoctorProfile = model<IDoctorProfile>('DoctorProfile', doctorProfileSchema);
