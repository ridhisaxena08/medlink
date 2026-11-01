import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { ClientSession, Types } from 'mongoose';
import { Request } from 'express';
import { env } from '../../config/environment';
import { ACCOUNT_STATUS, AuditAction, ROLES, Role, VERIFICATION_STATUS } from '../../shared/constants';
import { ApiError } from '../../shared/utils/ApiError';
import { addDays } from '../../shared/utils/dates';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../shared/utils/jwt';
import { withTransaction } from '../../shared/utils/transaction';
import { recordAudit } from '../../shared/services/audit.service';
import { AshaProfile } from '../asha/asha.model';
import { DoctorProfile } from '../doctor/doctor.model';
import { HospitalProfile } from '../hospital/hospital.model';
import { PatientProfile } from '../patient/patient.model';
import { ResponderProfile } from '../responder/responder.model';
import { IUser, User, hashPassword } from './auth.model';
import { RegisterInput } from './auth.validation';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

const refreshTtlDays = (): number => {
  const match = /^(\d+)([dhm])$/.exec(env.jwt.refreshExpiresIn);
  if (!match) return 30;
  const value = Number(match[1]);
  return match[2] === 'd' ? value : match[2] === 'h' ? value / 24 : value / (24 * 60);
};

const issueTokens = async (user: IUser, req?: Request): Promise<TokenPair> => {
  const sessionId = crypto.randomUUID();
  const payload = { sub: String(user._id), role: user.role, sid: sessionId };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await User.updateOne(
    { _id: user._id },
    {
      $push: {
        sessions: {
          sessionId,
          tokenHash: hashToken(refreshToken),
          userAgent: req?.get('user-agent'),
          ip: req?.ip,
          createdAt: new Date(),
          expiresAt: addDays(new Date(), refreshTtlDays()),
        },
      },
    },
  );

  return { accessToken, refreshToken, expiresIn: env.jwt.accessExpiresIn };
};

/** Creates the role-specific profile document and links it to the user. */
const createProfile = async (
  user: IUser,
  role: Role,
  profile: Record<string, unknown>,
  session?: ClientSession,
): Promise<Types.ObjectId | null> => {
  const base = { user: user._id };

  switch (role) {
    case ROLES.PATIENT: {
      const address = profile.address as Record<string, unknown> | undefined;
      const [doc] = await PatientProfile.create(
        [
          {
            ...base,
            dateOfBirth: profile.dateOfBirth,
            gender: profile.gender,
            bloodGroup: profile.bloodGroup,
            primaryLanguage: user.preferredLanguage,
            address: address
              ? {
                  ...address,
                  location: address.coordinates
                    ? { type: 'Point', coordinates: address.coordinates as [number, number] }
                    : undefined,
                }
              : undefined,
          },
        ],
        { session },
      );
      return doc._id;
    }
    case ROLES.DOCTOR: {
      const [doc] = await DoctorProfile.create(
        [{ ...base, ...profile, verificationStatus: VERIFICATION_STATUS.PENDING }],
        { session },
      );
      return doc._id;
    }
    case ROLES.ASHA: {
      const [doc] = await AshaProfile.create(
        [{ ...base, ...profile, verificationStatus: VERIFICATION_STATUS.PENDING }],
        { session },
      );
      return doc._id;
    }
    case ROLES.HOSPITAL: {
      const address = profile.address as Record<string, unknown>;
      const [doc] = await HospitalProfile.create(
        [
          {
            ...base,
            ...profile,
            address: {
              ...address,
              location: { type: 'Point', coordinates: address.coordinates as [number, number] },
            },
            verificationStatus: VERIFICATION_STATUS.PENDING,
          },
        ],
        { session },
      );
      return doc._id;
    }
    case ROLES.RESPONDER: {
      const [doc] = await ResponderProfile.create(
        [{ ...base, ...profile, verificationStatus: VERIFICATION_STATUS.PENDING }],
        { session },
      );
      return doc._id;
    }
    default:
      return null;
  }
};

/**
 * Patients are active immediately; every other role stays pending until a
 * hospital or admin verifies it, so unverified staff cannot reach patient data.
 */
const initialStatus = (role: Role) =>
  role === ROLES.PATIENT ? ACCOUNT_STATUS.ACTIVE : ACCOUNT_STATUS.PENDING;

export const register = async (input: RegisterInput, req?: Request) => {
  const role = input.role as Role;
  if (role === ROLES.ADMIN) {
    throw ApiError.forbidden('Admin accounts are provisioned internally, not through registration');
  }

  const existing = await User.findOne({
    $or: [{ phone: input.phone }, ...(input.email ? [{ email: input.email.toLowerCase() }] : [])],
  }).lean();
  if (existing) throw ApiError.conflict('An account with this phone or email already exists');

  const user: IUser = await withTransaction(async (session) => {
    const [created] = await User.create(
      [
        {
          name: input.name,
          phone: input.phone,
          email: input.email?.toLowerCase(),
          passwordHash: await hashPassword(input.password),
          role,
          status: initialStatus(role),
          preferredLanguage: input.preferredLanguage,
        },
      ],
      { session },
    );

    const profileId = await createProfile(created, role, (input.profile ?? {}) as Record<string, unknown>, session);
    if (profileId) {
      created.profileId = profileId;
      await created.save({ session });
    }
    return created;
  });

  await recordAudit({
    actor: { id: String(user._id), role, status: user.status, sessionId: 'registration' },
    action: 'create' as AuditAction,
    resourceType: 'user',
    resourceId: String(user._id),
    req,
    metadata: { role },
  });

  const tokens = await issueTokens(user, req);
  return { user: user.toJSON(), tokens };
};

export const login = async (
  credentials: { phone?: string; email?: string; password: string },
  req?: Request,
) => {
  const query = credentials.phone
    ? { phone: credentials.phone }
    : { email: credentials.email?.toLowerCase() };

  const user = await User.findOne(query).select('+passwordHash');
  if (!user) throw ApiError.unauthorized('Invalid credentials');

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    throw ApiError.forbidden('Account temporarily locked after repeated failed logins');
  }
  if (user.status === ACCOUNT_STATUS.SUSPENDED || user.status === ACCOUNT_STATUS.DEACTIVATED) {
    throw ApiError.forbidden(`Account is ${user.status}`);
  }

  const valid = await bcrypt.compare(credentials.password, user.passwordHash);
  if (!valid) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
      user.failedLoginAttempts = 0;
    }
    await user.save();
    await recordAudit({
      actor: { id: String(user._id), role: user.role, status: user.status, sessionId: 'login' },
      action: 'login',
      resourceType: 'user',
      resourceId: String(user._id),
      outcome: 'failure',
      reason: 'Invalid password',
      req,
    });
    throw ApiError.unauthorized('Invalid credentials');
  }

  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
  user.lastLoginAt = new Date();
  await user.save();

  const tokens = await issueTokens(user, req);
  await recordAudit({
    actor: { id: String(user._id), role: user.role, status: user.status, sessionId: 'login' },
    action: 'login',
    resourceType: 'user',
    resourceId: String(user._id),
    req,
  });

  return { user: user.toJSON(), tokens };
};

export const refresh = async (refreshToken: string, req?: Request): Promise<TokenPair> => {
  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.sub).select('+sessions role status');
  if (!user) throw ApiError.unauthorized('Account no longer exists');

  const tokenHash = hashToken(refreshToken);
  const session = user.sessions.find((s) => s.sessionId === payload.sid && !s.revokedAt);

  if (!session || session.tokenHash !== tokenHash) {
    // Token reuse or unknown session: drop every session for this account.
    user.sessions.forEach((s) => (s.revokedAt = s.revokedAt ?? new Date()));
    await user.save();
    throw ApiError.unauthorized('Refresh token is no longer valid');
  }
  if (session.expiresAt.getTime() <= Date.now()) {
    session.revokedAt = new Date();
    await user.save();
    throw ApiError.unauthorized('Refresh token expired');
  }

  // Rotate: the presented token is retired as the new pair is issued.
  session.revokedAt = new Date();
  await user.save();
  return issueTokens(user, req);
};

export const logout = async (userId: string, refreshToken?: string, allDevices = false) => {
  const user = await User.findById(userId).select('+sessions');
  if (!user) return;

  if (allDevices || !refreshToken) {
    user.sessions.forEach((s) => (s.revokedAt = s.revokedAt ?? new Date()));
  } else {
    const tokenHash = hashToken(refreshToken);
    const session = user.sessions.find((s) => s.tokenHash === tokenHash);
    if (session) session.revokedAt = new Date();
  }
  await user.save();
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await User.findById(userId).select('+passwordHash +sessions');
  if (!user) throw ApiError.notFound('User not found');

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw ApiError.unauthorized('Current password is incorrect');

  user.passwordHash = await hashPassword(newPassword);
  user.sessions.forEach((s) => (s.revokedAt = s.revokedAt ?? new Date()));
  await user.save();
};
