import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

export const requestContext = (req: Request, res: Response, next: NextFunction) => {
  req.requestId = (req.get('x-request-id') || crypto.randomUUID()) as string;
  res.setHeader('x-request-id', req.requestId);
  next();
};
