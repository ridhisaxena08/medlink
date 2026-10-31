import mongoose from 'mongoose';
import { env } from './environment';
import { logger } from '../shared/utils/logger';

mongoose.set('strictQuery', true);

/**
 * Builds every registered model's collection and indexes up front.
 *
 * Multi-document transactions cannot create a collection, and a concurrent
 * index build will make the first write in a transaction fail with a lock
 * timeout - so registration on a fresh database would break without this.
 */
export const ensureCollections = async (): Promise<void> => {
  await Promise.all(Object.values(mongoose.models).map((model) => model.init()));
};

export const connectDatabase = async (uri: string = env.mongoUri): Promise<typeof mongoose> => {
  mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
  mongoose.connection.on('error', (err) => logger.error('MongoDB error', err));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    autoIndex: !env.isProduction,
  });

  await ensureCollections();

  return mongoose;
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.close();
};
