import { Schema, model, Document, Types } from 'mongoose';
import { EMERGENCY_STATUS, EmergencyStatus } from '../../shared/constants';
import { GeoPoint } from '../../shared/types';

/* ------------------------------- contacts -------------------------------- */

export interface IEmergencyContact extends Document {
  _id: Types.ObjectId;
  patient: Types.ObjectId;
  name: string;
  phone: string;
  alternatePhone?: string;
  relationship: string;
  isPrimary: boolean;
  notifyOnSos: boolean;
  canShareLocation: boolean;
  address?: string;
  addedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const emergencyContactSchema = new Schema<IEmergencyContact>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    alternatePhone: String,
    relationship: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    notifyOnSos: { type: Boolean, default: true },
    canShareLocation: { type: Boolean, default: true },
    address: String,
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, collection: 'emergencyContacts' },
);

emergencyContactSchema.index({ patient: 1, phone: 1 }, { unique: true });

export const EmergencyContact = model<IEmergencyContact>('EmergencyContact', emergencyContactSchema);

/* ------------------------------- requests -------------------------------- */

export interface IEmergencyStatusEvent {
  status: EmergencyStatus;
  at: Date;
  by?: Types.ObjectId | null;
  note?: string;
}

export interface IEmergencyRequest extends Document {
  _id: Types.ObjectId;
  patient: Types.ObjectId;
  raisedBy: Types.ObjectId;
  raisedByRole: string;
  emergencyType: 'medical' | 'accident' | 'cardiac' | 'maternity' | 'respiratory' | 'trauma' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  symptoms: string[];
  pickupLocation: GeoPoint;
  pickupAddress?: string;
  landmark?: string;
  status: EmergencyStatus;
  statusHistory: IEmergencyStatusEvent[];
  assignedHospital?: Types.ObjectId | null;
  assignedResponder?: Types.ObjectId | null;
  assignment?: Types.ObjectId | null;
  notifiedHospitals: Types.ObjectId[];
  notifiedContacts: Types.ObjectId[];
  /** Explicit, time-boxed read access for responders/hospitals handling this SOS. */
  accessGrantedTo: { user: Types.ObjectId; role: string; grantedAt: Date; expiresAt: Date }[];
  patientSnapshot?: {
    name?: string;
    age?: number;
    bloodGroup?: string;
    allergies: string[];
    conditions: string[];
    activeMedications: string[];
  };
  resolvedAt?: Date | null;
  outcome?: string;
  cancellationReason?: string;
  syncedFromOffline: boolean;
  clientRecordId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const emergencyRequestSchema = new Schema<IEmergencyRequest>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    raisedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    raisedByRole: { type: String, required: true },
    emergencyType: {
      type: String,
      enum: ['medical', 'accident', 'cardiac', 'maternity', 'respiratory', 'trauma', 'other'],
      default: 'medical',
      index: true,
    },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'high', index: true },
    description: String,
    symptoms: { type: [String], default: [] },
    pickupLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    pickupAddress: String,
    landmark: String,
    status: {
      type: String,
      enum: Object.values(EMERGENCY_STATUS),
      default: EMERGENCY_STATUS.CREATED,
      index: true,
    },
    statusHistory: [
      {
        status: { type: String, enum: Object.values(EMERGENCY_STATUS), required: true },
        at: { type: Date, default: Date.now },
        by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        note: String,
      },
    ],
    assignedHospital: { type: Schema.Types.ObjectId, ref: 'HospitalProfile', default: null, index: true },
    assignedResponder: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    assignment: { type: Schema.Types.ObjectId, ref: 'ResponderAssignment', default: null },
    notifiedHospitals: [{ type: Schema.Types.ObjectId, ref: 'HospitalProfile' }],
    notifiedContacts: [{ type: Schema.Types.ObjectId, ref: 'EmergencyContact' }],
    accessGrantedTo: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, required: true },
        grantedAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true },
      },
    ],
    patientSnapshot: {
      name: String,
      age: Number,
      bloodGroup: String,
      allergies: { type: [String], default: [] },
      conditions: { type: [String], default: [] },
      activeMedications: { type: [String], default: [] },
    },
    resolvedAt: { type: Date, default: null },
    outcome: String,
    cancellationReason: String,
    syncedFromOffline: { type: Boolean, default: false },
    clientRecordId: { type: String, index: true },
  },
  { timestamps: true, collection: 'emergencyRequests' },
);

emergencyRequestSchema.index({ pickupLocation: '2dsphere' });
emergencyRequestSchema.index({ status: 1, createdAt: -1 });

export const EmergencyRequest = model<IEmergencyRequest>('EmergencyRequest', emergencyRequestSchema);

/* ------------------------------ assignments ------------------------------ */

export interface IResponderAssignment extends Document {
  _id: Types.ObjectId;
  request: Types.ObjectId;
  responder: Types.ObjectId;
  hospital?: Types.ObjectId | null;
  assignedBy: Types.ObjectId;
  assignedAt: Date;
  status: 'offered' | 'accepted' | 'declined' | 'expired' | 'completed' | 'cancelled';
  respondedAt?: Date | null;
  declineReason?: string;
  etaMinutes?: number;
  destination?: { hospital?: Types.ObjectId | null; location?: GeoPoint; address?: string };
  startedAt?: Date | null;
  completedAt?: Date | null;
  offerExpiresAt: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const responderAssignmentSchema = new Schema<IResponderAssignment>(
  {
    request: { type: Schema.Types.ObjectId, ref: 'EmergencyRequest', required: true, index: true },
    responder: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'HospitalProfile', default: null },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['offered', 'accepted', 'declined', 'expired', 'completed', 'cancelled'],
      default: 'offered',
      index: true,
    },
    respondedAt: { type: Date, default: null },
    declineReason: String,
    etaMinutes: Number,
    destination: {
      hospital: { type: Schema.Types.ObjectId, ref: 'HospitalProfile', default: null },
      location: { type: { type: String, enum: ['Point'] }, coordinates: { type: [Number] } },
      address: String,
    },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    offerExpiresAt: { type: Date, required: true },
    notes: String,
  },
  { timestamps: true, collection: 'responderAssignments' },
);

responderAssignmentSchema.index({ request: 1, responder: 1 }, { unique: true });

export const ResponderAssignment = model<IResponderAssignment>('ResponderAssignment', responderAssignmentSchema);

/* ---------------------------- location updates --------------------------- */

export interface ILocationUpdate extends Document {
  _id: Types.ObjectId;
  request?: Types.ObjectId | null;
  assignment?: Types.ObjectId | null;
  reporter: Types.ObjectId;
  reporterRole: string;
  source: 'app' | 'device' | 'manual';
  deviceId?: string;
  location: GeoPoint;
  accuracyMeters?: number;
  speedKph?: number;
  headingDegrees?: number;
  recordedAt: Date;
  createdAt: Date;
}

const locationUpdateSchema = new Schema<ILocationUpdate>(
  {
    request: { type: Schema.Types.ObjectId, ref: 'EmergencyRequest', default: null, index: true },
    assignment: { type: Schema.Types.ObjectId, ref: 'ResponderAssignment', default: null, index: true },
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reporterRole: { type: String, required: true },
    source: { type: String, enum: ['app', 'device', 'manual'], default: 'app' },
    deviceId: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    accuracyMeters: Number,
    speedKph: Number,
    headingDegrees: Number,
    recordedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: 'locationUpdates' },
);

locationUpdateSchema.index({ request: 1, recordedAt: -1 });
locationUpdateSchema.index({ location: '2dsphere' });

export const LocationUpdate = model<ILocationUpdate>('LocationUpdate', locationUpdateSchema);
