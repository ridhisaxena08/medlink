import { created, ok, paginated } from '../../../shared/utils/apiResponse';
import { authedHandler } from '../../../shared/utils/asyncHandler';
import * as service from './prescriptions.service';

export const create = authedHandler(async (req, res) =>
  created(res, await service.createPrescription(req.user, req.body)),
);

export const list = authedHandler(async (req, res) => {
  const { items, meta } = await service.listPrescriptions(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const listForPatient = authedHandler(async (req, res) => {
  const { items, meta } = await service.listPrescriptions(req.user, {
    ...(req.query as object),
    patient: req.params.patientId,
  } as never);
  return paginated(res, items, meta);
});

export const getOne = authedHandler(async (req, res) =>
  ok(res, await service.getPrescription(req.user, req.params.id)),
);

export const parse = authedHandler(async (req, res) =>
  ok(res, await service.parsePrescription(req.user, req.body)),
);

export const verify = authedHandler(async (req, res) =>
  ok(res, await service.verifyPrescription(req.user, req.body)),
);
