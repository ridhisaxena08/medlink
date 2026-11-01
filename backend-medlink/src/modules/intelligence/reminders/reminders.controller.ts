import { created, ok, paginated } from '../../../shared/utils/apiResponse';
import { authedHandler } from '../../../shared/utils/asyncHandler';
import * as service from './reminders.service';

export const generate = authedHandler(async (req, res) => ok(res, await service.generate(req.user, req.body)));

export const create = authedHandler(async (req, res) =>
  created(res, await service.createReminder(req.user, req.body)),
);

export const list = authedHandler(async (req, res) => {
  const { items, meta } = await service.listReminders(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const update = authedHandler(async (req, res) =>
  ok(res, await service.updateReminder(req.user, req.params.id, req.body)),
);

export const adherence = authedHandler(async (req, res) =>
  ok(res, await service.recordAdherence(req.user, req.params.id, req.body.outcome)),
);
