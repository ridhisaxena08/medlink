import { created, ok, paginated } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import * as appointments from '../appointments/appointments.service';
import * as service from './doctor.service';

export const getMe = authedHandler(async (req, res) => ok(res, await service.getProfile(req.user.id)));

export const updateMe = authedHandler(async (req, res) =>
  ok(res, await service.updateProfile(req.user.id, req.body)),
);

export const setAvailability = authedHandler(async (req, res) =>
  ok(res, await service.setAvailability(req.user.id, req.body)),
);

export const getAvailability = authedHandler(async (req, res) =>
  ok(res, await service.getAvailability(req.user.id)),
);

export const dashboard = authedHandler(async (req, res) => ok(res, await service.getDashboard(req.user.id)));

export const search = authedHandler(async (req, res) => {
  const { items, meta } = await service.searchDoctors(req.query as Record<string, unknown>);
  return paginated(res, items, meta);
});

export const getPublic = authedHandler(async (req, res) =>
  ok(res, await service.getPublicDoctor(req.params.doctorId)),
);

export const slots = authedHandler(async (req, res) => {
  const { date, mode } = req.query as unknown as { date: Date; mode?: string };
  return ok(res, await appointments.getAvailableSlots(req.params.doctorId, date, mode));
});

export const listAppointments = authedHandler(async (req, res) => {
  const { items, meta } = await appointments.listAppointments(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const updateAppointmentStatus = authedHandler(async (req, res) =>
  ok(res, await appointments.updateStatusAsDoctor(req.user, req.params.id, req.body.status, req.body.reason)),
);

export const patientView = authedHandler(async (req, res) =>
  ok(res, await service.getPatientView(req.user, req.params.patientId)),
);

export const createConsultation = authedHandler(async (req, res) =>
  created(res, await service.createConsultation(req.user, req.body)),
);

export const getConsultation = authedHandler(async (req, res) =>
  ok(res, await service.getConsultation(req.user, req.params.id)),
);
