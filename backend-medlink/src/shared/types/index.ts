import { Request } from 'express';
import { Types } from 'mongoose';
import { AccountStatus, Role } from '../constants';

export interface AuthenticatedUser {
  id: string;
  role: Role;
  status: AccountStatus;
  sessionId: string;
  /** Profile document id for the role-specific profile collection, when present. */
  profileId?: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export interface JwtPayload {
  sub: string;
  role: Role;
  sid: string;
  type: 'access' | 'refresh';
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PageMeta;
}

export type ObjectIdLike = Types.ObjectId | string;

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      requestId?: string;
    }
  }
}
