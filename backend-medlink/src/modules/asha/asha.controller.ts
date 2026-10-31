import { created, ok, paginated } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import * as appointments from '../appointments/appointments.service';
import * as patientService from '../patient/patient.service';
import * as reminders from '../intelligence/reminders/reminders.service';
import * as service from './asha.service';

export const getMe = authedHandler(async (req, res) => ok(res, await service.getProfile(req.user.id)));

export const updateMe = authedHandler(async (req, res) =>
  ok(res, await service.updateProfile(req.user.id, req.body)),
);

export const dashboard = authedHandler(async (req, res) => ok(res, await service.getDashboard(req.user.id)));

export const listPatients = authedHandler(async (req, res) => {
  const { items, meta } = await service.listAssignedPatients(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const registerPatient = authedHandler(async (req, res) =>
  created(res, await service.registerPatient(req.user, req.body)),
);

export const getPatient = authedHandler(async (req, res) =>
  ok(res, await patientService.getProfileFor(req.user, req.params.patientId)),
);

export const createAssignment = authedHandler(async (req, res) =>
  created(res, await service.createAssignment(req.user, req.body)),
);

export const listAssignments = authedHandler(async (req, res) => {
  const { items, meta } = await service.listAssignments(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const revokeAssignment = authedHandler(async (req, res) =>
  ok(res, await service.revokeAssignment(req.user, req.params.id)),
);

export const createFollowUp = authedHandler(async (req, res) =>
  created(res, await service.createFollowUp(req.user, req.body)),
);

export const listFollowUps = authedHandler(async (req, res) => {
  const { items, meta } = await service.listFollowUps(req.user, req.query as never);
  return paginated(res, items, meta);
});

/** Assisted booking - the access gate runs inside the appointments service. */
export const bookAppointment = authedHandler(async (req, res) =>
  created(res, await appointments.createAppointment(req.user, req.body)),
);

/** Proposes a schedule; it stays inactive until the patient approves it. */
export const proposeReminder = authedHandler(async (req, res) =>
  created(res, await reminders.createReminder(req.user, { ...req.body, activate: false })),
);
