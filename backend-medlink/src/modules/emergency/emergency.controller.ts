import { created, ok, paginated } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import * as service from './emergency.service';

export const createSos = authedHandler(async (req, res) => created(res, await service.createSos(req.user, req.body)));

export const getRequest = authedHandler(async (req, res) =>
  ok(res, await service.getRequest(req.user, req.params.id)),
);

export const myRequests = authedHandler(async (req, res) => {
  const { items, meta } = await service.listMyRequests(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const addContact = authedHandler(async (req, res) => created(res, await service.addContact(req.user, req.body)));

export const listContacts = authedHandler(async (req, res) =>
  ok(res, await service.listContacts(req.user, (req.query as { patient?: string }).patient)),
);

export const updateContact = authedHandler(async (req, res) =>
  ok(res, await service.updateContact(req.user, req.params.contactId, req.body)),
);

export const deleteContact = authedHandler(async (req, res) =>
  ok(res, await service.deleteContact(req.user, req.params.contactId)),
);

export const nearbyHospitals = authedHandler(async (req, res) =>
  ok(res, await service.findNearbyHospitals(req.query as never)),
);

export const assign = authedHandler(async (req, res) =>
  ok(res, await service.assignResponder(req.user, req.params.id, req.body)),
);

export const updateStatus = authedHandler(async (req, res) =>
  ok(res, await service.updateStatus(req.user, req.params.id, req.body.status, req.body.note, req.body.outcome)),
);

export const postLocation = authedHandler(async (req, res) =>
  created(res, await service.recordLocation(req.user, req.params.id, req.body)),
);

export const tracking = authedHandler(async (req, res) =>
  ok(res, await service.getTracking(req.user, req.params.id)),
);
