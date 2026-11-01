import { Types } from 'mongoose';
import {
  APPOINTMENT_STATUS,
  AppointmentStatus,
  CONSENT_SCOPES,
  ROLES,
} from '../../shared/constants';
import { AuthenticatedUser } from '../../shared/types';
import { ApiError } from '../../shared/utils/ApiError';
import { addMinutes, endOfDay, startOfDay, timeToMinutes, weekdayOf } from '../../shared/utils/dates';
import { pageMeta, parsePagination } from '../../shared/utils/pagination';
import { assertPatientAccess } from '../../shared/services/access.service';
import { auditAsync } from '../../shared/services/audit.service';
import { notify } from '../../shared/services/notification.service';
import { User } from '../auth/auth.model';
import { DoctorProfile } from '../doctor/doctor.model';
import { HospitalProfile } from '../hospital/hospital.model';
import { Appointment, IAppointment } from './appointment.model';

const oid = (v: string | Types.ObjectId) => (typeof v === 'string' ? new Types.ObjectId(v) : v);

const ACTIVE_STATUSES: AppointmentStatus[] = [
  APPOINTMENT_STATUS.REQUESTED,
  APPOINTMENT_STATUS.CONFIRMED,
  APPOINTMENT_STATUS.RESCHEDULED,
];

export interface CreateAppointmentInput {
  doctor: string;
  hospital?: string;
  department?: string;
  scheduledStart: Date;
  durationMinutes?: number;
  mode: 'in_person' | 'teleconsult';
  reason: string;
  symptoms: string[];
  patient?: string;
}

const loadDoctor = async (doctorUserId: string) => {
  const profile = await DoctorProfile.findOne({ user: oid(doctorUserId) });
  if (!profile) throw ApiError.notFound('Doctor not found');
  if (profile.verificationStatus !== 'verified') {
    throw ApiError.badRequest('This doctor is not verified for bookings yet');
  }
  return profile;
};

/** Returns the matching availability template, or null when the slot is outside working hours. */
const findTemplate = (
  profile: Awaited<ReturnType<typeof loadDoctor>>,
  start: Date,
  durationMinutes: number,
  mode: string,
) => {
  const weekday = weekdayOf(start);
  const startMinutes = start.getHours() * 60 + start.getMinutes();

  const blocked = profile.availabilityExceptions.some(
    (ex) => ex.unavailableAllDay && startOfDay(ex.date).getTime() === startOfDay(start).getTime(),
  );
  if (blocked) return null;

  return (
    profile.availability.find((tpl) => {
      if (!tpl.isActive || tpl.weekday !== weekday || tpl.mode !== mode) return false;
      const open = timeToMinutes(tpl.startTime);
      const close = timeToMinutes(tpl.endTime);
      if (Number.isNaN(open) || Number.isNaN(close)) return false;
      if (startMinutes < open || startMinutes + durationMinutes > close) return false;
      // Slot must align to the template grid so the day stays evenly divided.
      return (startMinutes - open) % tpl.slotDurationMinutes === 0;
    }) ?? null
  );
};

export const getAvailableSlots = async (doctorUserId: string, date: Date, mode?: string) => {
  const profile = await loadDoctor(doctorUserId);
  const weekday = weekdayOf(date);
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const blocked = profile.availabilityExceptions.some(
    (ex) => ex.unavailableAllDay && startOfDay(ex.date).getTime() === dayStart.getTime(),
  );
  if (blocked) return { date: dayStart, slots: [] };

  const booked = await Appointment.find({
    doctor: oid(doctorUserId),
    status: { $in: ACTIVE_STATUSES },
    scheduledStart: { $gte: dayStart, $lte: dayEnd },
  })
    .select('scheduledStart scheduledEnd')
    .lean();

  const slots: { start: Date; end: Date; mode: string; available: boolean }[] = [];

  for (const tpl of profile.availability) {
    if (!tpl.isActive || tpl.weekday !== weekday) continue;
    if (mode && tpl.mode !== mode) continue;

    const open = timeToMinutes(tpl.startTime);
    const close = timeToMinutes(tpl.endTime);
    if (Number.isNaN(open) || Number.isNaN(close)) continue;

    for (let m = open; m + tpl.slotDurationMinutes <= close; m += tpl.slotDurationMinutes) {
      const start = new Date(dayStart.getTime() + m * 60 * 1000);
      const end = addMinutes(start, tpl.slotDurationMinutes);
      if (end.getTime() <= Date.now()) continue;
      const taken = booked.some((b) => start < b.scheduledEnd && end > b.scheduledStart);
      slots.push({ start, end, mode: tpl.mode, available: !taken });
    }
  }

  slots.sort((a, b) => a.start.getTime() - b.start.getTime());
  return { date: dayStart, slots };
};

export const createAppointment = async (
  actor: AuthenticatedUser,
  input: CreateAppointmentInput,
): Promise<IAppointment> => {
  let patientId = actor.id;
  let bookedByRole: 'patient' | 'asha' | 'hospital' = 'patient';

  if (actor.role !== ROLES.PATIENT) {
    if (!input.patient) throw ApiError.badRequest('patient is required when booking on behalf of someone');
    if (actor.role !== ROLES.ASHA && actor.role !== ROLES.HOSPITAL) {
      throw ApiError.forbidden('Only patients, ASHA workers and hospitals can create appointments');
    }
    await assertPatientAccess(actor, input.patient, CONSENT_SCOPES.APPOINTMENTS, 'appointment');
    patientId = input.patient;
    bookedByRole = actor.role === ROLES.ASHA ? 'asha' : 'hospital';
  }

  if (input.scheduledStart.getTime() <= Date.now()) {
    throw ApiError.badRequest('Appointments must be scheduled in the future');
  }

  const profile = await loadDoctor(input.doctor);
  const duration = input.durationMinutes ?? 15;
  const template = findTemplate(profile, input.scheduledStart, duration, input.mode);
  if (!template) throw ApiError.badRequest('Requested time is outside the doctor\'s published availability');

  const scheduledEnd = addMinutes(input.scheduledStart, duration);

  const clash = await Appointment.findOne({
    doctor: oid(input.doctor),
    status: { $in: ACTIVE_STATUSES },
    scheduledStart: { $lt: scheduledEnd },
    scheduledEnd: { $gt: input.scheduledStart },
  }).lean();
  if (clash) throw ApiError.conflict('That slot has just been taken');

  const duplicate = await Appointment.findOne({
    patient: oid(patientId),
    doctor: oid(input.doctor),
    status: { $in: ACTIVE_STATUSES },
    scheduledStart: input.scheduledStart,
  }).lean();
  if (duplicate) throw ApiError.conflict('You already have a booking for this slot');

  const appointment = await Appointment.create({
    patient: oid(patientId),
    doctor: oid(input.doctor),
    hospital: input.hospital ? oid(input.hospital) : template.hospital ?? null,
    department: input.department ? oid(input.department) : null,
    scheduledStart: input.scheduledStart,
    scheduledEnd,
    mode: input.mode,
    reason: input.reason,
    symptoms: input.symptoms,
    status: APPOINTMENT_STATUS.REQUESTED,
    bookedBy: oid(actor.id),
    bookedByRole,
    statusHistory: [{ status: APPOINTMENT_STATUS.REQUESTED, at: new Date(), by: oid(actor.id) }],
  });

  auditAsync({
    actor, action: 'create', resourceType: 'appointment', resourceId: String(appointment._id),
    subject: patientId, metadata: { doctor: input.doctor, scheduledStart: input.scheduledStart },
  });

  await notify({
    user: input.doctor,
    type: 'appointment.requested',
    title: 'New appointment request',
    body: `A new ${input.mode} appointment was requested for ${input.scheduledStart.toISOString()}`,
    data: { appointmentId: String(appointment._id) },
    priority: 'high',
  });

  return appointment;
};

export const listAppointments = async (
  actor: AuthenticatedUser,
  query: {
    status?: string; from?: Date; to?: Date; upcoming?: boolean;
    patient?: string; doctor?: string; page?: number; limit?: number;
  },
) => {
  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> = {};

  if (actor.role === ROLES.PATIENT) filter.patient = oid(actor.id);
  else if (actor.role === ROLES.DOCTOR) filter.doctor = oid(actor.id);
  else if (actor.role === ROLES.HOSPITAL) {
    const hospital = await HospitalProfile.findOne({ user: oid(actor.id) }).select('_id').lean();
    if (!hospital) throw ApiError.notFound('Hospital profile not found');
    filter.hospital = hospital._id;
  } else if (actor.role === ROLES.ASHA) {
    if (!query.patient) throw ApiError.badRequest('patient is required');
    await assertPatientAccess(actor, query.patient, CONSENT_SCOPES.APPOINTMENTS, 'appointment');
    filter.patient = oid(query.patient);
  } else if (actor.role === ROLES.ADMIN) {
    if (query.patient) filter.patient = oid(query.patient);
    if (query.doctor) filter.doctor = oid(query.doctor);
  }

  if (query.status) filter.status = query.status;
  if (query.upcoming) filter.scheduledStart = { $gte: new Date() };
  if (query.from || query.to) {
    filter.scheduledStart = {
      ...(filter.scheduledStart as object | undefined),
      ...(query.from ? { $gte: query.from } : {}),
      ...(query.to ? { $lte: query.to } : {}),
    };
  }

  const [items, total] = await Promise.all([
    Appointment.find(filter)
      .populate('patient', 'name phone')
      .populate('doctor', 'name')
      .populate('hospital', 'name address.district')
      .sort({ scheduledStart: query.upcoming ? 1 : -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    Appointment.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

const loadForActor = async (actor: AuthenticatedUser, appointmentId: string) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw ApiError.notFound('Appointment not found');

  const isPatient = String(appointment.patient) === actor.id;
  const isDoctor = String(appointment.doctor) === actor.id;
  const isBooker = String(appointment.bookedBy) === actor.id;

  if (isPatient || isDoctor || isBooker || actor.role === ROLES.ADMIN) return appointment;

  if (actor.role === ROLES.HOSPITAL && appointment.hospital) {
    const hospital = await HospitalProfile.findOne({ user: oid(actor.id) }).select('_id').lean();
    if (hospital && String(hospital._id) === String(appointment.hospital)) return appointment;
  }
  if (actor.role === ROLES.ASHA) {
    await assertPatientAccess(actor, appointment.patient, CONSENT_SCOPES.APPOINTMENTS, 'appointment');
    return appointment;
  }

  throw ApiError.forbidden('You do not have access to this appointment');
};

export const getAppointment = async (actor: AuthenticatedUser, appointmentId: string) => {
  const appointment = await loadForActor(actor, appointmentId);
  return appointment.populate([
    { path: 'patient', select: 'name phone' },
    { path: 'doctor', select: 'name' },
    { path: 'hospital', select: 'name address' },
  ]);
};

export const cancelAppointment = async (actor: AuthenticatedUser, appointmentId: string, reason?: string) => {
  const appointment = await loadForActor(actor, appointmentId);

  if (!ACTIVE_STATUSES.includes(appointment.status)) {
    throw ApiError.badRequest(`Cannot cancel an appointment that is ${appointment.status}`);
  }

  appointment.status = APPOINTMENT_STATUS.CANCELLED;
  appointment.cancellationReason = reason;
  appointment.statusHistory.push({
    status: APPOINTMENT_STATUS.CANCELLED, at: new Date(), by: oid(actor.id), reason,
  });
  await appointment.save();

  auditAsync({
    actor, action: 'status_change', resourceType: 'appointment', resourceId: appointmentId,
    subject: appointment.patient, metadata: { status: 'cancelled', reason },
  });

  const notifyTarget = String(appointment.patient) === actor.id ? appointment.doctor : appointment.patient;
  await notify({
    user: notifyTarget,
    type: 'appointment.cancelled',
    title: 'Appointment cancelled',
    body: reason ? `Reason: ${reason}` : 'An appointment was cancelled.',
    data: { appointmentId },
    priority: 'high',
  });

  return appointment;
};

export const rescheduleAppointment = async (
  actor: AuthenticatedUser,
  appointmentId: string,
  input: { scheduledStart: Date; durationMinutes?: number; reason?: string },
) => {
  const appointment = await loadForActor(actor, appointmentId);
  if (!ACTIVE_STATUSES.includes(appointment.status)) {
    throw ApiError.badRequest(`Cannot reschedule an appointment that is ${appointment.status}`);
  }
  if (input.scheduledStart.getTime() <= Date.now()) {
    throw ApiError.badRequest('New time must be in the future');
  }

  const profile = await loadDoctor(String(appointment.doctor));
  const duration =
    input.durationMinutes ??
    Math.round((appointment.scheduledEnd.getTime() - appointment.scheduledStart.getTime()) / 60000);

  if (!findTemplate(profile, input.scheduledStart, duration, appointment.mode)) {
    throw ApiError.badRequest('Requested time is outside the doctor\'s published availability');
  }

  const scheduledEnd = addMinutes(input.scheduledStart, duration);
  const clash = await Appointment.findOne({
    _id: { $ne: appointment._id },
    doctor: appointment.doctor,
    status: { $in: ACTIVE_STATUSES },
    scheduledStart: { $lt: scheduledEnd },
    scheduledEnd: { $gt: input.scheduledStart },
  }).lean();
  if (clash) throw ApiError.conflict('That slot is already taken');

  appointment.scheduledStart = input.scheduledStart;
  appointment.scheduledEnd = scheduledEnd;
  appointment.status = APPOINTMENT_STATUS.RESCHEDULED;
  appointment.statusHistory.push({
    status: APPOINTMENT_STATUS.RESCHEDULED, at: new Date(), by: oid(actor.id), reason: input.reason,
  });
  await appointment.save();

  auditAsync({
    actor, action: 'status_change', resourceType: 'appointment', resourceId: appointmentId,
    subject: appointment.patient, metadata: { status: 'rescheduled', scheduledStart: input.scheduledStart },
  });

  const target = String(appointment.patient) === actor.id ? appointment.doctor : appointment.patient;
  await notify({
    user: target,
    type: 'appointment.rescheduled',
    title: 'Appointment rescheduled',
    body: `New time: ${input.scheduledStart.toISOString()}`,
    data: { appointmentId },
    priority: 'high',
  });

  return appointment;
};

/** Doctor-side decision: accept, reject, complete or mark no-show. */
export const updateStatusAsDoctor = async (
  actor: AuthenticatedUser,
  appointmentId: string,
  status: 'confirmed' | 'rejected' | 'completed' | 'no_show',
  reason?: string,
) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw ApiError.notFound('Appointment not found');
  if (String(appointment.doctor) !== actor.id) {
    throw ApiError.forbidden('Only the assigned doctor can change this appointment status');
  }

  const allowed: Record<string, AppointmentStatus[]> = {
    confirmed: [APPOINTMENT_STATUS.REQUESTED, APPOINTMENT_STATUS.RESCHEDULED],
    rejected: [APPOINTMENT_STATUS.REQUESTED, APPOINTMENT_STATUS.RESCHEDULED],
    completed: [APPOINTMENT_STATUS.CONFIRMED],
    no_show: [APPOINTMENT_STATUS.CONFIRMED],
  };
  if (!allowed[status].includes(appointment.status)) {
    throw ApiError.badRequest(`Cannot move an appointment from ${appointment.status} to ${status}`);
  }

  appointment.status = status as AppointmentStatus;
  appointment.statusHistory.push({ status: appointment.status, at: new Date(), by: oid(actor.id), reason });
  await appointment.save();

  auditAsync({
    actor, action: 'status_change', resourceType: 'appointment', resourceId: appointmentId,
    subject: appointment.patient, metadata: { status, reason },
  });

  const patient = await User.findById(appointment.patient).select('phone').lean();
  await notify({
    user: appointment.patient,
    type: `appointment.${status}`,
    title: `Appointment ${status}`,
    body: reason ?? `Your appointment is now ${status}.`,
    data: { appointmentId },
    priority: 'high',
    channels: ['in_app'],
    phone: patient?.phone,
  });

  return appointment;
};
