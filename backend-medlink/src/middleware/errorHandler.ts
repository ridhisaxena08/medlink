import { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { env } from '../config/environment';
import { ApiError } from '../shared/utils/ApiError';
import { logger } from '../shared/utils/logger';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  let apiError: ApiError;

  if (err instanceof ApiError) {
    apiError = err;
  } else if (err instanceof MongooseError.ValidationError) {
    apiError = ApiError.badRequest(
      'Validation failed',
      Object.values(err.errors).map((e) => ({ path: e.path, message: e.message })),
    );
  } else if (err instanceof MongooseError.CastError) {
    apiError = ApiError.badRequest(`Invalid value for "${err.path}"`);
  } else if ((err as MongoServerError)?.code === 11000) {
    const keys = Object.keys((err as MongoServerError).keyValue ?? {});
    apiError = ApiError.conflict(`Duplicate value for: ${keys.join(', ') || 'unique field'}`);
  } else {
    apiError = ApiError.internal(err instanceof Error ? err.message : 'Unexpected error');
  }

  if (apiError.statusCode >= 500) {
    logger.error('Unhandled request error', { path: req.originalUrl, err });
  }

  res.status(apiError.statusCode).json({
    success: false,
    error: {
      code: apiError.code,
      message: apiError.message,
      ...(apiError.details ? { details: apiError.details } : {}),
      ...(env.isProduction || apiError.statusCode < 500 ? {} : { stack: (err as Error)?.stack }),
    },
    requestId: req.requestId,
  });
};
