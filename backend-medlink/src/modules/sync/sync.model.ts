import { Schema, model, Document, Types } from 'mongoose';

export interface ISyncRecord extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  deviceId: string;
  clientRecordId: string;
  entity: 'medical_record' | 'follow_up' | 'reminder' | 'appointment' | 'emergency_request' | 'document';
  operation: 'create' | 'update' | 'delete';
  payload: Record<string, unknown>;
  clientUpdatedAt: Date;
  status: 'pending' | 'applied' | 'conflict' | 'rejected';
  serverRecordId?: Types.ObjectId | null;
  conflictReason?: string;
  resolution?: 'server_wins' | 'client_wins' | 'merged' | 'manual';
  processedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const syncRecordSchema = new Schema<ISyncRecord>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    deviceId: { type: String, required: true, index: true },
    clientRecordId: { type: String, required: true },
    entity: {
      type: String,
      enum: ['medical_record', 'follow_up', 'reminder', 'appointment', 'emergency_request', 'document'],
      required: true,
    },
    operation: { type: String, enum: ['create', 'update', 'delete'], required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    clientUpdatedAt: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'applied', 'conflict', 'rejected'], default: 'pending', index: true },
    serverRecordId: { type: Schema.Types.ObjectId, default: null },
    conflictReason: String,
    resolution: { type: String, enum: ['server_wins', 'client_wins', 'merged', 'manual'] },
    processedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'syncRecords' },
);

/** Idempotency: the same client record from the same device is applied once. */
syncRecordSchema.index({ deviceId: 1, clientRecordId: 1 }, { unique: true });

export const SyncRecord = model<ISyncRecord>('SyncRecord', syncRecordSchema);
