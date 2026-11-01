import { Response } from 'express';
import { PageMeta } from '../types';

export const ok = <T>(res: Response, data: T, meta?: Record<string, unknown>) =>
  res.status(200).json({ success: true, data, ...(meta ? { meta } : {}) });

export const created = <T>(res: Response, data: T) => res.status(201).json({ success: true, data });

export const noContent = (res: Response) => res.status(204).send();

export const paginated = <T>(res: Response, items: T[], meta: PageMeta) =>
  res.status(200).json({ success: true, data: items, meta });
