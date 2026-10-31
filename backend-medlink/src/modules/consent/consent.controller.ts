import { created, ok, paginated } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import * as service from './consent.service';

export const create = authedHandler(async (req, res) =>
  created(res, await service.createConsent(req.user, req.body)),
);

export const list = authedHandler(async (req, res) => {
  const { items, meta } = await service.listConsents(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const revoke = authedHandler(async (req, res) =>
  ok(res, await service.revokeConsent(req.user, req.params.id, req.body?.reason)),
);
