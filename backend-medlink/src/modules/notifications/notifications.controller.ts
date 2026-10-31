import { ok, paginated } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import * as service from './notifications.service';

export const list = authedHandler(async (req, res) => {
  const { items, meta } = await service.listForUser(req.user.id, req.query as never);
  return paginated(res, items, meta);
});

export const markRead = authedHandler(async (req, res) =>
  ok(res, await service.markRead(req.user.id, req.params.id)),
);

export const markAllRead = authedHandler(async (req, res) =>
  ok(res, await service.markAllRead(req.user.id)),
);
