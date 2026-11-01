import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/environment';
import { JwtPayload } from '../types';
import { ApiError } from './ApiError';

export const signAccessToken = (payload: Omit<JwtPayload, 'type'>): string =>
  jwt.sign({ ...payload, type: 'access' }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  } as SignOptions);

export const signRefreshToken = (payload: Omit<JwtPayload, 'type'>): string =>
  jwt.sign({ ...payload, type: 'refresh' }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  } as SignOptions);

const verify = (token: string, secret: string, expected: 'access' | 'refresh'): JwtPayload => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    if (decoded.type !== expected) throw ApiError.unauthorized('Invalid token type');
    return decoded;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw ApiError.unauthorized('Invalid or expired token');
  }
};

export const verifyAccessToken = (token: string) => verify(token, env.jwt.accessSecret, 'access');
export const verifyRefreshToken = (token: string) => verify(token, env.jwt.refreshSecret, 'refresh');
