import { paginated } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import * as service from './audit.service';

export const list = authedHandler(async (req, res) => {
  const { items, meta } = await service.listAuditLogs(req.user, req.query as never);
  return paginated(res, items, meta);
});
