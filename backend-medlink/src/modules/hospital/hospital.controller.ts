import { created, ok, paginated } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import * as asha from '../asha/asha.service';
import * as emergency from '../emergency/emergency.service';
import * as service from './hospital.service';

export const getMe = authedHandler(async (req, res) => ok(res, await service.getProfile(req.user.id)));

export const updateMe = authedHandler(async (req, res) =>
  ok(res, await service.updateProfile(req.user.id, req.body)),
);

export const dashboard = authedHandler(async (req, res) => ok(res, await service.getDashboard(req.user.id)));

export const registerDoctor = authedHandler(async (req, res) =>
  created(res, await service.registerDoctor(req.user, req.body)),
);

export const linkDoctor = authedHandler(async (req, res) =>
  ok(res, await service.linkDoctor(req.user, req.body.doctor)),
);

export const listDoctors = authedHandler(async (req, res) => {
  const { items, meta } = await service.listDoctors(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const verifyDoctor = authedHandler(async (req, res) =>
  ok(res, await service.verifyDoctor(req.user, req.params.id, req.body.status, req.body.reason)),
);

export const createDepartment = authedHandler(async (req, res) =>
  created(res, await service.createDepartment(req.user, req.body)),
);

export const listDepartments = authedHandler(async (req, res) =>
  ok(res, await service.listDepartments(req.user)),
);

export const registerAsha = authedHandler(async (req, res) =>
  created(res, await service.registerAsha(req.user, req.body)),
);

export const listAsha = authedHandler(async (req, res) => {
  const { items, meta } = await service.listAshaWorkers(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const verifyAsha = authedHandler(async (req, res) =>
  ok(res, await service.verifyAsha(req.user, req.params.id, req.body.status, req.body.reason)),
);

export const assignAsha = authedHandler(async (req, res) =>
  created(res, await asha.createAssignment(req.user, req.body)),
);

export const listAppointments = authedHandler(async (req, res) => {
  const { items, meta } = await service.listAppointments(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const listEmergencyRequests = authedHandler(async (req, res) => {
  const { items, meta } = await service.listEmergencyRequests(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const updateEmergencyStatus = authedHandler(async (req, res) =>
  ok(res, await emergency.updateStatus(req.user, req.params.id, req.body.status, req.body.note, req.body.outcome)),
);

export const assignResponder = authedHandler(async (req, res) =>
  ok(res, await emergency.assignResponder(req.user, req.params.id, req.body)),
);

export const reports = authedHandler(async (req, res) => {
  const { from, to } = req.query as unknown as { from?: Date; to?: Date };
  return ok(res, await service.getReports(req.user.id, from, to));
});
