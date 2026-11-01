import { ok } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import * as service from './sync.service';

export const push = authedHandler(async (req, res) =>
  ok(res, await service.push(req.user, req.body.deviceId, req.body.records)),
);

export const pull = authedHandler(async (req, res) => ok(res, await service.pull(req.user, req.query as never)));

export const status = authedHandler(async (req, res) =>
  ok(res, await service.listSyncRecords(req.user, (req.query as { deviceId?: string }).deviceId)),
);
