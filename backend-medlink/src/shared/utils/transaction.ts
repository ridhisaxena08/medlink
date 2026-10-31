import { ClientSession, startSession } from 'mongoose';
import { logger } from './logger';

const UNSUPPORTED = /Transaction numbers are only allowed on a replica set|Transactions are not supported|This MongoDB deployment does not support retryable writes/i;

const isUnsupported = (err: unknown): boolean => {
  const error = err as { code?: number; codeName?: string; message?: string };
  return error?.code === 20 || UNSUPPORTED.test(error?.message ?? '');
};

/**
 * Runs a multi-collection write in a transaction, falling back to a plain
 * sequential write on a standalone mongod (which cannot do transactions).
 *
 * The fallback is safe because an aborted transaction persists nothing, so the
 * retry starts from the same state. Production should run a replica set so the
 * atomic path is the one that executes.
 */
export const withTransaction = async <T>(fn: (session?: ClientSession) => Promise<T>): Promise<T> => {
  const session = await startSession();

  try {
    session.startTransaction();
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (err) {
    await session.abortTransaction().catch(() => undefined);

    if (isUnsupported(err)) {
      logger.warn('MongoDB deployment does not support transactions - writing without atomicity', {
        hint: 'Run MongoDB as a replica set to make multi-collection writes atomic',
      });
      return fn(undefined);
    }
    throw err;
  } finally {
    await session.endSession();
  }
};
