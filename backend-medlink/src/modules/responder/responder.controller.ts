import { ok, paginated } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import * as emergency from '../emergency/emergency.service';
import { ResponderAssignment } from '../emergency/emergency.model';
import { ApiError } from '../../shared/utils/ApiError';
import * as service from './responder.service';

export const getMe = authedHandler(async (req, res) => ok(res, await service.getProfile(req.user.id)));

export const updateMe = authedHandler(async (req, res) =>
  ok(res, await service.updateProfile(req.user.id, req.body)),
);

export const setAvailability = authedHandler(async (req, res) =>
  ok(res, await service.setAvailability(req.user.id, req.body)),
);

export const listAssignments = authedHandler(async (req, res) => {
  const { items, meta } = await service.listAssignments(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const getAssignment = authedHandler(async (req, res) =>
  ok(res, await service.getAssignment(req.user, req.params.id)),
);

export const accept = authedHandler(async (req, res) =>
  ok(res, await emergency.acceptAssignment(req.user, req.params.id, req.body?.etaMinutes)),
);

export const decline = authedHandler(async (req, res) =>
  ok(res, await emergency.declineAssignment(req.user, req.params.id, req.body?.reason)),
);

export const navigation = authedHandler(async (req, res) =>
  ok(res, await service.getNavigation(req.user, req.params.id)),
);

/** Posts a location against the assignment's own emergency request. */
export const postLocation = authedHandler(async (req, res) => {
  const assignment = await ResponderAssignment.findOne({
    responder: req.user.id,
    status: 'accepted',
  }).lean();
  if (!assignment) throw ApiError.badRequest('No active assignment to report a location for');
  return ok(res, await emergency.recordLocation(req.user, String(assignment.request), req.body));
});

export const updateAssignmentStatus = authedHandler(async (req, res) => {
  const assignment = await ResponderAssignment.findById(req.params.id).lean();
  if (!assignment) throw ApiError.notFound('Assignment not found');
  if (String(assignment.responder) !== req.user.id) throw ApiError.forbidden('This assignment is not yours');

  return ok(
    res,
    await emergency.updateStatus(req.user, String(assignment.request), req.body.status, req.body.note, req.body.outcome),
  );
});

export const history = authedHandler(async (req, res) => {
  const { items, meta, stats } = await service.getHistory(req.user, req.query as never);
  return ok(res, { items, stats }, meta as unknown as Record<string, unknown>);
});
