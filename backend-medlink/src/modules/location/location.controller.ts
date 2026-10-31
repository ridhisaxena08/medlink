import { ok } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import { ApiError } from '../../shared/utils/ApiError';
import * as emergency from '../emergency/emergency.service';
import * as service from './location.service';

export const validateLocation = authedHandler(async (req, res) =>
  ok(res, await service.validateLocation(req.body)),
);

/** Sharing is only meaningful against an open emergency the caller belongs to. */
export const share = authedHandler(async (req, res) => {
  const { request, location, accuracyMeters, deviceId } = req.body;
  if (!request) throw ApiError.badRequest('An emergency request id is required to share a location');

  return ok(
    res,
    await emergency.recordLocation(req.user, request, {
      location,
      accuracyMeters,
      deviceId,
      source: 'app',
    }),
  );
});

export const nearby = authedHandler(async (req, res) => ok(res, await service.findNearby(req.query as never)));
