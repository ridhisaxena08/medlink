import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { env } from './config/environment';
import { logger } from './shared/utils/logger';

const start = async (): Promise<void> => {
  try {
    await connectDatabase();

    const app = createApp();
    const server = app.listen(env.port, () => {
      logger.info(`MedLink360 API listening on port ${env.port}`, {
        environment: env.nodeEnv,
        apiPrefix: env.apiPrefix,
      });
    });

    const shutdown = (signal: string) => {
      logger.info(`${signal} received, shutting down`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
      // Don't hang forever on an in-flight request.
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled promise rejection', reason);
    });
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught exception - exiting', err);
      process.exit(1);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

void start();
