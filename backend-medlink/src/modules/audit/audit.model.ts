import { Schema, model, Document, Types } from 'mongoose';
import { AuditAction, AUDIT_ACTIONS, ALL_ROLES, Role } from '../../shared/constants';

export interface IAuditLog extends Document {
  _id: Types.ObjectId;
  actor?: Types.ObjectId | null;
  actorRole?: Role | null;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  /** Patient whose data was touched, when applicable - powers "who saw my record". */
  subject?: Types.ObjectId | null;
  outcome: 'success' | 'denied' | 'failure';
  reason?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    actorRole: { type: String, enum: ALL_ROLES, default: null },
    action: { type: String, enum: Object.values(AUDIT_ACTIONS), required: true, index: true },
    resourceType: { type: String, required: true, index: true },
    resourceId: String,
    subject: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    outcome: { type: String, enum: ['success', 'denied', 'failure'], default: 'success', index: true },
    reason: String,
    ip: String,
    userAgent: String,
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: 'auditLogs' },
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ subject: 1, createdAt: -1 });

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
