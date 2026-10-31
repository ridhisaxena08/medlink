import { created, ok, paginated } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import * as service from './medicalRecords.service';

export const create = authedHandler(async (req, res) =>
  created(res, await service.createRecord(req.user, req.body)),
);

export const list = authedHandler(async (req, res) => {
  const { items, meta } = await service.listRecords(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const update = authedHandler(async (req, res) =>
  ok(res, await service.updateRecord(req.user, req.params.id, req.body)),
);

export const remove = authedHandler(async (req, res) =>
  ok(res, await service.deleteRecord(req.user, req.params.id)),
);
