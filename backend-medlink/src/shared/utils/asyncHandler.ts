import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { ApiError } from './ApiError';

/** Wraps an async handler so rejected promises reach the error middleware. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/** Same as asyncHandler but guarantees req.user is present (routes behind authenticate). */
export const authedHandler =
  (fn: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    Promise.resolve(fn(req as AuthenticatedRequest, res, next)).catch(next);
  };
