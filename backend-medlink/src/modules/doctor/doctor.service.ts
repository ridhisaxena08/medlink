import { Types } from 'mongoose';
import {
  APPOINTMENT_STATUS,
  CONSENT_SCOPES,
  ROLES,
  VERIFICATION_STATUS,
} from '../../shared/constants';
import { AuthenticatedUser } from '../../shared/types';
import { ApiError } from '../../shared/utils/ApiError';
import { endOfDay, startOfDay, timeToMinutes } from '../../shared/utils/dates';
import { haversineKm } from '../../shared/utils/geo';
import { pageMeta, parsePagination } from '../../shared/utils/pagination';
import { assertPatientAccess } from '../../shared/services/access.service';
import { auditAsync } from '../../shared/services/audit.service';
import { Appointment } from '../appointments/appointment.model';
import { User } from '../auth/auth.model';
import { DocumentModel } from '../files/document.model';
import { Notification } from '../notifications/notification.model';
import { PatientMedication } from '../intelligence/medicines/patientMedication.model';
import { Prescription } from '../intelligence/prescriptions/prescription.model';
import { MedicalRecord } from '../medical-records/medicalRecord.model';
import { summarise } from '../medical-records/medicalRecords.service';
import { PatientProfile } from '../patient/patient.model';
import { Consultation, IConsultation } from './consultation.model';
import { DoctorProfile, IDoctorProfile } from './doctor.model';

const oid = (v: string | Types.ObjectId) => (typeof v === 'string' ? new Types.ObjectId(v) : v);

export const getProfile = async (doctorUserId: string) => {
  const [user, profile] = await Promise.all([
    User.findById(doctorUserId).lean(),
    DoctorProfile.findOne({ user: oid(doctorUserId) }).populate('hospitals', 'name address.district type').lean(),
  ]);
  if (!user || user.role !== ROLES.DOCTOR) throw ApiError.notFound('Doctor not found');
  return { ...user, profile };
};

export const updateProfile = async (doctorUserId: string, updates: Record<string, unknown>) => {
  const { name, ...profileUpdates } = updates as { name?: string } & Record<string, unknown>;
  if (name) await User.updateOne({ _id: oid(doctorUserId) }, { $set: { name } });

  const location = profileUpdates.practiceLocation as Record<string, unknown> | undefined;
  if (location?.coordinates) {
    location.location = { type: 'Point', coordinates: location.coordinates };
    delete location.coordinates;
  }

  const profile = await DoctorProfile.findOneAndUpdate(
    { user: oid(doctorUserId) },
    { $set: profileUpdates },
    { new: true, runValidators: true },
  );
  if (!profile) throw ApiError.notFound('Doctor profile not found');
  return profile;
};

/** Replaces the weekly template wholesale so the published schedule is unambiguous. */
export const setAvailability = async (
  doctorUserId: string,
  input: { availability: Record<string, unknown>[]; exceptions?: Record<string, unknown>[] },
): Promise<IDoctorProfile> => {
  for (const slot of input.availability) {
    const start = timeToMinutes(String(slot.startTime));
    const end = timeToMinutes(String(slot.endTime));
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
      throw ApiError.badRequest(`Invalid window ${slot.startTime}-${slot.endTime}`);
    }
    if ((end - start) % Number(slot.slotDurationMinutes ?? 15) !== 0) {
      throw ApiError.badRequest(
        `Window ${slot.startTime}-${slot.endTime} is not divisible into ${slot.slotDurationMinutes}-minute slots`,
      );
    }
  }

  const profile = await DoctorProfile.findOneAndUpdate(
    { user: oid(doctorUserId) },
    {
      $set: {
        availability: input.availability,
        ...(input.exceptions ? { availabilityExceptions: input.exceptions } : {}),
      },
    },
    { new: true, runValidators: true },
  );
  if (!profile) throw ApiError.notFound('Doctor profile not found');
  return profile;
};

export const getAvailability = async (doctorUserId: string) => {
  const profile = await DoctorProfile.findOne({ user: oid(doctorUserId) })
    .select('availability availabilityExceptions acceptingNewPatients')
    .lean();
  if (!profile) throw ApiError.notFound('Doctor profile not found');
  return profile;
};

/** Public-facing discovery. Only verified doctors are discoverable. */
export const searchDoctors = async (query: Record<string, unknown>) => {
  const page = parsePagination(query);
  const filter: Record<string, unknown> = { verificationStatus: VERIFICATION_STATUS.VERIFIED };

  if (query.specialty) filter.specialties = { $regex: String(query.specialty), $options: 'i' };
  if (query.language) filter.languages = { $regex: String(query.language), $options: 'i' };
  if (query.hospital) filter.hospitals = oid(String(query.hospital));
  if (query.district) filter['practiceLocation.district'] = { $regex: String(query.district), $options: 'i' };
  if (query.state) filter['practiceLocation.state'] = { $regex: String(query.state), $options: 'i' };
  if (query.maxFee !== undefined) filter.consultationFee = { $lte: Number(query.maxFee) };
  if (query.minExperience !== undefined) filter.experienceYears = { $gte: Number(query.minExperience) };
  if (query.acceptingNewPatients !== undefined) filter.acceptingNewPatients = query.acceptingNewPatients;
  if (query.mode) filter['availability.mode'] = query.mode;

  const hasGeo = query.lng !== undefined && query.lat !== undefined;
  if (hasGeo) {
    filter['practiceLocation.location'] = {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [Number(query.lng), Number(query.lat)] },
        $maxDistance: Number(query.radiusKm ?? 25) * 1000,
      },
    };
  }

  let profiles = await DoctorProfile.find(filter)
    .populate('user', 'name preferredLanguage')
    .populate('hospitals', 'name address.district address.city type')
    .select('-availabilityExceptions')
    .lean();

  if (query.q) {
    const term = String(query.q).toLowerCase();
    profiles = profiles.filter((p) => {
      const user = p.user as unknown as { name?: string } | null;
      return (
        user?.name?.toLowerCase().includes(term) ||
        p.specialties.some((s) => s.toLowerCase().includes(term)) ||
        p.bio?.toLowerCase().includes(term)
      );
    });
  }

  const withDistance = profiles.map((p) => {
    const coords = p.practiceLocation?.location?.coordinates;
    const distanceKm =
      hasGeo && coords
        ? Number(haversineKm([Number(query.lng), Number(query.lat)], coords as [number, number]).toFixed(2))
        : null;
    return { ...p, distanceKm };
  });

  const sorters: Record<string, (a: typeof withDistance[0], b: typeof withDistance[0]) => number> = {
    experience: (a, b) => b.experienceYears - a.experienceYears,
    fee: (a, b) => (a.consultationFee ?? Infinity) - (b.consultationFee ?? Infinity),
    rating: (a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0),
    distance: (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
  };
  withDistance.sort(sorters[String(query.sort ?? 'rating')] ?? sorters.rating);

  const items = withDistance.slice(page.skip, page.skip + page.limit);
  return { items, meta: pageMeta(withDistance.length, page) };
};

export const getPublicDoctor = async (doctorUserId: string) => {
  const profile = await DoctorProfile.findOne({
    user: oid(doctorUserId),
    verificationStatus: VERIFICATION_STATUS.VERIFIED,
  })
    .populate('user', 'name preferredLanguage')
    .populate('hospitals', 'name address type contact.phone')
    .lean();
  if (!profile) throw ApiError.notFound('Doctor not found');
  return profile;
};

/** Today's schedule plus the counters a doctor needs on opening the app. */
export const getDashboard = async (doctorUserId: string) => {
  const doctorId = oid(doctorUserId);
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const [todayAppointments, pendingRequests, upcomingCount, consultationsThisWeek, unreadNotifications, profile] =
    await Promise.all([
      Appointment.find({
        doctor: doctorId,
        scheduledStart: { $gte: todayStart, $lte: todayEnd },
        status: { $nin: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.REJECTED] },
      })
        .populate('patient', 'name phone')
        .sort({ scheduledStart: 1 })
        .lean(),
      Appointment.countDocuments({ doctor: doctorId, status: APPOINTMENT_STATUS.REQUESTED }),
      Appointment.countDocuments({
        doctor: doctorId,
        scheduledStart: { $gt: todayEnd },
        status: { $in: [APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.RESCHEDULED] },
      }),
      Consultation.countDocuments({
        doctor: doctorId,
        consultedAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
      }),
      Notification.countDocuments({ user: doctorId, readAt: null }),
      DoctorProfile.findOne({ user: doctorId }).select('verificationStatus acceptingNewPatients rating').lean(),
    ]);

  return {
    profile,
    today: {
      date: todayStart,
      appointments: todayAppointments,
      total: todayAppointments.length,
      completed: todayAppointments.filter((a) => a.status === APPOINTMENT_STATUS.COMPLETED).length,
    },
    pendingRequests,
    upcomingCount,
    consultationsThisWeek,
    unreadNotifications,
  };
};

/**
 * Consolidated clinical view of one patient. Every section is fetched only
 * after the access gate passes for the matching consent scope.
 */
export const getPatientView = async (actor: AuthenticatedUser, patientId: string) => {
  await assertPatientAccess(actor, patientId, CONSENT_SCOPES.MEDICAL_HISTORY, 'patient_record');

  const id = oid(patientId);
  const [user, profile, history, medications, prescriptions, consultations, documents, appointments] =
    await Promise.all([
      User.findById(id).select('name phone preferredLanguage').lean(),
      PatientProfile.findOne({ user: id }).lean(),
      summarise(patientId),
      PatientMedication.find({ patient: id, status: 'active' })
        .select('medicineName dosage frequency timings confirmedByPatient source')
        .lean(),
      Prescription.find({ patient: id }).sort({ issuedAt: -1 }).limit(10).lean(),
      Consultation.find({ patient: id }).sort({ consultedAt: -1 }).limit(10).populate('doctor', 'name').lean(),
      DocumentModel.find({ patient: id, isArchived: false })
        .select('title category createdAt mimeType')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      Appointment.find({ patient: id }).sort({ scheduledStart: -1 }).limit(10).populate('doctor', 'name').lean(),
    ]);

  if (!user) throw ApiError.notFound('Patient not found');

  const records = await MedicalRecord.find({ patient: id }).sort({ createdAt: -1 }).limit(50).lean();

  return {
    patient: { ...user, profile },
    healthSummary: history,
    medicalRecords: records,
    medications,
    prescriptions,
    consultations,
    documents,
    appointments,
  };
};

export const createConsultation = async (
  actor: AuthenticatedUser,
  input: Record<string, unknown>,
): Promise<IConsultation> => {
  const patientId = String(input.patient);
  await assertPatientAccess(actor, patientId, CONSENT_SCOPES.MEDICAL_HISTORY, 'consultation');

  if (input.appointment) {
    const appointment = await Appointment.findById(String(input.appointment));
    if (!appointment) throw ApiError.notFound('Appointment not found');
    if (String(appointment.doctor) !== actor.id) {
      throw ApiError.forbidden('This appointment belongs to another doctor');
    }
    if (String(appointment.patient) !== patientId) {
      throw ApiError.badRequest('Appointment patient does not match');
    }
  }

  const consultation = await Consultation.create({
    ...input,
    patient: oid(patientId),
    doctor: oid(actor.id),
    consultedAt: new Date(),
  });

  if (input.appointment) {
    await Appointment.updateOne(
      { _id: oid(String(input.appointment)) },
      {
        $set: { consultation: consultation._id, status: APPOINTMENT_STATUS.COMPLETED },
        $push: {
          statusHistory: { status: APPOINTMENT_STATUS.COMPLETED, at: new Date(), by: oid(actor.id) },
        },
      },
    );
  }

  auditAsync({
    actor, action: 'create', resourceType: 'consultation', resourceId: String(consultation._id),
    subject: patientId,
  });

  return consultation;
};

export const getConsultation = async (actor: AuthenticatedUser, consultationId: string) => {
  const consultation = await Consultation.findById(consultationId)
    .populate('doctor', 'name')
    .populate('patient', 'name phone');
  if (!consultation) throw ApiError.notFound('Consultation not found');

  const patientId = (consultation.patient as unknown as { _id: Types.ObjectId })._id;
  if (String(patientId) !== actor.id && String(consultation.doctor) !== actor.id) {
    await assertPatientAccess(actor, patientId, CONSENT_SCOPES.MEDICAL_HISTORY, 'consultation');
  }
  return consultation;
};
