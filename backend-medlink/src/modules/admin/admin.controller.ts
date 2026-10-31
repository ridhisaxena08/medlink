import { ok, paginated } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import * as auditService from '../audit/audit.service';
import * as service from './admin.service';

export const dashboard = authedHandler(async (_req, res) => ok(res, await service.getDashboard()));

export const listUsers = authedHandler(async (req, res) => {
  const { items, meta } = await service.listUsers(req.query as never);
  return paginated(res, items, meta);
});

export const updateUserStatus = authedHandler(async (req, res) =>
  ok(res, await service.updateUserStatus(req.user, req.params.id, req.body.status, req.body.reason)),
);

export const verificationQueue = authedHandler(async (req, res) =>
  ok(res, await service.verificationQueue(req.query as never)),
);

export const verifyEntity = authedHandler(async (req, res) =>
  ok(res, await service.verifyEntity(req.user, req.params.id, req.body.role, req.body.status, req.body.reason)),
);

export const auditLogs = authedHandler(async (req, res) => {
  const { items, meta } = await auditService.listAuditLogs(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const accessReport = authedHandler(async (req, res) => {
  const days = Number((req.query as { days?: string }).days ?? 7);
  return ok(res, await service.getAccessReport(days));
});
