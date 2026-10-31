import { created, ok, paginated } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import * as service from './appointments.service';

export const create = authedHandler(async (req, res) =>
  created(res, await service.createAppointment(req.user, req.body)),
);

export const listMine = authedHandler(async (req, res) => {
  const { items, meta } = await service.listAppointments(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const getOne = authedHandler(async (req, res) =>
  ok(res, await service.getAppointment(req.user, req.params.id)),
);

export const cancel = authedHandler(async (req, res) =>
  ok(res, await service.cancelAppointment(req.user, req.params.id, req.body?.reason)),
);

export const reschedule = authedHandler(async (req, res) =>
  ok(res, await service.rescheduleAppointment(req.user, req.params.id, req.body)),
);

export const updateStatus = authedHandler(async (req, res) =>
  ok(res, await service.updateStatusAsDoctor(req.user, req.params.id, req.body.status, req.body.reason)),
);
