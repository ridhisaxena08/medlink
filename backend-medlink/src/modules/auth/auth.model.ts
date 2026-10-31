import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../../config/environment';
import { ACCOUNT_STATUS, AccountStatus, ALL_ROLES, Role } from '../../shared/constants';

export interface IRefreshSession {
  sessionId: string;
  tokenHash: string;
  userAgent?: string;
  ip?: string;
  createdAt: Date;
  expiresAt: Date;
  revokedAt?: Date | null;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  phone: string;
  email?: string;
  passwordHash: string;
  role: Role;
  status: AccountStatus;
  name: string;
  preferredLanguage: 'en' | 'hi';
  profileId?: Types.ObjectId;
  phoneVerified: boolean;
  emailVerified: boolean;
  lastLoginAt?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date | null;
  sessions: IRefreshSession[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(plain: string): Promise<boolean>;
}

const refreshSessionSchema = new Schema<IRefreshSession>(
  {
    sessionId: { type: String, required: true },
    tokenHash: { type: String, required: true },
    userAgent: String,
    ip: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, lowercase: true, trim: true, sparse: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ALL_ROLES, required: true, index: true },
    status: { type: String, enum: Object.values(ACCOUNT_STATUS), default: ACCOUNT_STATUS.ACTIVE, index: true },
    name: { type: String, required: true, trim: true },
    preferredLanguage: { type: String, enum: ['en', 'hi'], default: 'en' },
    profileId: { type: Schema.Types.ObjectId },
    phoneVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: Date,
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null },
    sessions: { type: [refreshSessionSchema], default: [], select: false },
  },
  {
    timestamps: true,
    collection: 'users',
    toJSON: {
      transform: (_doc, ret) => {
        delete (ret as Record<string, unknown>).passwordHash;
        delete (ret as Record<string, unknown>).sessions;
        return ret;
      },
    },
  },
);

userSchema.methods.comparePassword = function (plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.passwordHash);
};

export const hashPassword = (plain: string): Promise<string> => bcrypt.hash(plain, env.bcryptRounds);

export const User = model<IUser>('User', userSchema);
