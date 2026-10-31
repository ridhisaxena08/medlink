import { Types } from 'mongoose';
import { ACCOUNT_STATUS, ROLES } from '../../shared/constants';
import { ApiError } from '../../shared/utils/ApiError';
import { AshaProfile } from '../asha/asha.model';
import { User } from '../auth/auth.model';
import { DoctorProfile } from '../doctor/doctor.model';
import { HospitalProfile } from '../hospital/hospital.model';
import { PatientProfile } from '../patient/patient.model';
import { ResponderProfile } from '../responder/responder.model';

const profileModelFor = (role: string) => {
  switch (role) {
    case ROLES.PATIENT: return PatientProfile;
    case ROLES.DOCTOR: return DoctorProfile;
    case ROLES.ASHA: return AshaProfile;
    case ROLES.HOSPITAL: return HospitalProfile;
    case ROLES.RESPONDER: return ResponderProfile;
    default: return null;
  }
};

/** Account identity plus the role-specific profile in one payload. */
export const getMe = async (userId: string) => {
  const user = await User.findById(userId).lean();
  if (!user) throw ApiError.notFound('User not found');

  const Model = profileModelFor(user.role);
  const profile = Model ? await (Model as any).findOne({ user: new Types.ObjectId(userId) }).lean() : null;

  return { ...user, profile };
};

export const updateMe = async (userId: string, updates: Record<string, unknown>) => {
  if (updates.email) {
    const clash = await User.findOne({ email: String(updates.email).toLowerCase(), _id: { $ne: userId } }).lean();
    if (clash) throw ApiError.conflict('Email already in use');
    updates.email = String(updates.email).toLowerCase();
    updates.emailVerified = false;
  }
  const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true });
  if (!user) throw ApiError.notFound('User not found');
  return user.toJSON();
};

export const deactivate = async (userId: string) => {
  const user = await User.findById(userId).select('+sessions');
  if (!user) throw ApiError.notFound('User not found');
  user.status = ACCOUNT_STATUS.DEACTIVATED;
  user.sessions.forEach((s) => (s.revokedAt = s.revokedAt ?? new Date()));
  await user.save();
  return user.toJSON();
};
