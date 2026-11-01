import rateLimit from 'express-rate-limit';
import { env } from '../config/environment';
import { ApiError } from '../shared/utils/ApiError';

const handler = () => {
  throw ApiError.tooMany();
};

export const globalLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.isTest,
  handler,
});

/** Tighter budget for credential endpoints. */
export const authLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.isTest,
  handler,
});

/** SOS must stay reachable; this only stops runaway clients. */
export const emergencyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.isTest,
  handler,
});

export const intelligenceLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.isTest,
  handler,
});
