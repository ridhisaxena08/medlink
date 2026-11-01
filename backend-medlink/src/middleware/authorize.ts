import { NextFunction, Request, Response } from 'express';
import { ACCOUNT_STATUS, Role } from '../shared/constants';
import { ApiError } from '../shared/utils/ApiError';

/** Coarse role gate. Record-level checks live in access.service. */
export const authorize =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (roles.length && !roles.includes(req.user.role)) {
      return next(ApiError.forbidden(`This endpoint requires role: ${roles.join(', ')}`));
    }
    next();
  };

/** Blocks accounts that have not completed verification/activation. */
export const requireActiveAccount = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) return next(ApiError.unauthorized());
  if (req.user.status !== ACCOUNT_STATUS.ACTIVE) {
    return next(ApiError.forbidden('Account is not active yet'));
  }
  next();
};
