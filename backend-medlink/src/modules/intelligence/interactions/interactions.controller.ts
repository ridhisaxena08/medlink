import { ok } from '../../../shared/utils/apiResponse';
import { authedHandler } from '../../../shared/utils/asyncHandler';
import * as service from './interactions.service';

export const check = authedHandler(async (req, res) =>
  ok(res, await service.checkInteractions(req.user, req.body)),
);
