import { NextFunction, Request, Response } from 'express';
import { User } from '../modules/auth/auth.model';
import { ACCOUNT_STATUS } from '../shared/constants';
import { ApiError } from '../shared/utils/ApiError';
import { verifyAccessToken } from '../shared/utils/jwt';

const extractToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7).trim();
  return null;
};

/** Verifies the access token and loads the live account state on every request. */
export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    if (!token) throw ApiError.unauthorized('Missing bearer token');

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select('role status profileId').lean();
    if (!user) throw ApiError.unauthorized('Account no longer exists');
    if (user.status === ACCOUNT_STATUS.SUSPENDED) throw ApiError.forbidden('Account suspended');
    if (user.status === ACCOUNT_STATUS.DEACTIVATED) throw ApiError.forbidden('Account deactivated');

    req.user = {
      id: String(user._id),
      role: user.role,
      status: user.status,
      sessionId: payload.sid,
      profileId: user.profileId ? String(user.profileId) : undefined,
    };
    next();
  } catch (err) {
    next(err);
  }
};

/** Attaches req.user when a valid token is present, but never rejects. */
export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  if (!extractToken(req)) return next();
  return authenticate(req, res, (err?: unknown) => next(err instanceof ApiError ? undefined : err));
};
