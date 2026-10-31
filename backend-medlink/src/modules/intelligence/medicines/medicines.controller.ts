import { created, ok, paginated } from '../../../shared/utils/apiResponse';
import { authedHandler } from '../../../shared/utils/asyncHandler';
import * as service from './medicines.service';

export const search = authedHandler(async (req, res) => {
  const { items, meta } = await service.searchCatalogue(req.query as never);
  return paginated(res, items, meta);
});

export const getOne = authedHandler(async (req, res) => ok(res, await service.getMedicine(req.params.id)));

export const explanation = authedHandler(async (req, res) =>
  ok(res, await service.getExplanation(req.params.id, (req.query as { lang: 'en' | 'hi' }).lang)),
);

export const addForPatient = authedHandler(async (req, res) =>
  created(res, await service.addPatientMedication(req.user, req.body)),
);

export const listForPatient = authedHandler(async (req, res) => {
  const { items, meta } = await service.listPatientMedications(req.user, req.query as never);
  return paginated(res, items, meta);
});
