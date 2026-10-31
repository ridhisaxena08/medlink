import { ok } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import { auditAsync } from '../../shared/services/audit.service';
import * as service from './users.service';

export const getMe = authedHandler(async (req, res) => ok(res, await service.getMe(req.user.id)));

export const updateMe = authedHandler(async (req, res) => {
  const user = await service.updateMe(req.user.id, req.body);
  auditAsync({ actor: req.user, action: 'update', resourceType: 'user', resourceId: req.user.id, req });
  return ok(res, user);
});

export const deactivateMe = authedHandler(async (req, res) => {
  const user = await service.deactivate(req.user.id);
  auditAsync({
    actor: req.user, action: 'update', resourceType: 'user', resourceId: req.user.id,
    req, metadata: { action: 'deactivate', reason: req.body?.reason },
  });
  return ok(res, user);
});
