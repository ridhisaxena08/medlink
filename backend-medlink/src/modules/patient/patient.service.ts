import { Types } from 'mongoose';
import {
  APPOINTMENT_STATUS,
  CONSENT_SCOPES,
  CONSENT_STATUS,
  REMINDER_STATUS,
  ROLES,
  TERMINAL_EMERGENCY_STATUSES,
} from '../../shared/constants';
import { AuthenticatedUser } from '../../shared/types';
import { ApiError } from '../../shared/utils/ApiError';
import { assertPatientAccess } from '../../shared/services/access.service';
import { auditAsync } from '../../shared/services/audit.service';
import { User } from '../auth/auth.model';
import { Appointment } from '../appointments/appointment.model';
import { Consent } from '../consent/consent.model';
import { DocumentModel } from '../files/document.model';
import { EmergencyContact, EmergencyRequest } from '../emergency/emergency.model';
import { Notification } from '../notifications/notification.model';
import { PatientMedication } from '../intelligence/medicines/patientMedication.model';
import { Reminder } from '../intelligence/reminders/reminder.model';
import { summarise } from '../medical-records/medicalRecords.service';
import { IPatientProfile, PatientProfile } from './patient.model';

const oid = (v: string | Types.ObjectId) => (typeof v === 'string' ? new Types.ObjectId(v) : v);

export const getProfile = async (patientUserId: string) => {
  const [user, profile] = await Promise.all([
    User.findById(patientUserId).lean(),
    PatientProfile.findOne({ user: oid(patientUserId) }).lean(),
  ]);
  if (!user || user.role !== ROLES.PATIENT) throw ApiError.notFound('Patient not found');
  return { ...user, profile };
};

/** Reads another patient's profile; always goes through the access gate. */
export const getProfileFor = async (actor: AuthenticatedUser, patientId: string) => {
  if (patientId !== actor.id) {
    await assertPatientAccess(actor, patientId, CONSENT_SCOPES.PROFILE, 'patient_profile');
  }
  return getProfile(patientId);
};

export const updateProfile = async (
  patientUserId: string,
  updates: Record<string, unknown>,
): Promise<IPatientProfile> => {
  const { name, ...profileUpdates } = updates as { name?: string } & Record<string, unknown>;
  if (name) await User.updateOne({ _id: oid(patientUserId) }, { $set: { name } });

  const address = profileUpdates.address as Record<string, unknown> | undefined;
  if (address?.coordinates) {
    address.location = { type: 'Point', coordinates: address.coordinates };
    delete address.coordinates;
  }

  const profile = await PatientProfile.findOneAndUpdate(
    { user: oid(patientUserId) },
    { $set: profileUpdates },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );
  return profile;
};

/**
 * Aggregated patient home screen. Every query is scoped to the patient id, so
 * this is also safe to serve to an authorised ASHA worker or clinician.
 */
export const getDashboard = async (patientUserId: string) => {
  const patientId = oid(patientUserId);
  const now = new Date();
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    profile,
    upcomingAppointments,
    activeMedications,
    activeReminders,
    recentDocuments,
    history,
    unreadNotifications,
    activeConsents,
    openEmergencies,
    emergencyContacts,
  ] = await Promise.all([
    PatientProfile.findOne({ user: patientId }).lean(),
    Appointment.find({
      patient: patientId,
      scheduledStart: { $gte: now, $lte: weekAhead },
      status: { $in: [APPOINTMENT_STATUS.REQUESTED, APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.RESCHEDULED] },
    })
      .populate('doctor', 'name')
      .populate('hospital', 'name')
      .sort({ scheduledStart: 1 })
      .limit(5)
      .lean(),
    PatientMedication.find({ patient: patientId, status: 'active', confirmedByPatient: true })
      .select('medicineName dosage frequency timings endDate')
      .lean(),
    Reminder.find({ patient: patientId, status: REMINDER_STATUS.ACTIVE })
      .select('medicineName doses nextTriggerAt adherence')
      .sort({ nextTriggerAt: 1 })
      .limit(10)
      .lean(),
    DocumentModel.find({ patient: patientId, isArchived: false })
      .select('title category createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    summarise(patientUserId),
    Notification.countDocuments({ user: patientId, readAt: null }),
    Consent.countDocuments({ patient: patientId, status: CONSENT_STATUS.ACTIVE, expiresAt: { $gt: now } }),
    EmergencyRequest.find({ patient: patientId, status: { $nin: TERMINAL_EMERGENCY_STATUSES } })
      .select('status emergencyType severity createdAt assignedResponder')
      .lean(),
    EmergencyContact.countDocuments({ patient: patientId }),
  ]);

  const adherence = activeReminders.reduce(
    (acc, r) => {
      acc.taken += r.adherence?.taken ?? 0;
      acc.missed += r.adherence?.missed ?? 0;
      return acc;
    },
    { taken: 0, missed: 0 },
  );
  const adherenceRate =
    adherence.taken + adherence.missed > 0
      ? Math.round((adherence.taken / (adherence.taken + adherence.missed)) * 100)
      : null;

  return {
    profile,
    healthSummary: history,
    appointments: { upcoming: upcomingAppointments, count: upcomingAppointments.length },
    medications: { active: activeMedications, count: activeMedications.length },
    reminders: { active: activeReminders, adherenceRate },
    documents: { recent: recentDocuments },
    notifications: { unread: unreadNotifications },
    consents: { active: activeConsents },
    emergency: { openRequests: openEmergencies, contactsConfigured: emergencyContacts },
  };
};

export const getDashboardFor = async (actor: AuthenticatedUser, patientId: string) => {
  if (patientId !== actor.id) {
    await assertPatientAccess(actor, patientId, CONSENT_SCOPES.PROFILE, 'patient_dashboard');
  }
  auditAsync({ actor, action: 'read', resourceType: 'patient_dashboard', resourceId: patientId, subject: patientId });
  return getDashboard(patientId);
};
