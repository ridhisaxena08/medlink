import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { env } from './config/environment';
import { createSwaggerRouter } from './config/swagger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { globalLimiter } from './middleware/rateLimiter';
import { requestContext } from './middleware/requestContext';
import routes from './routes';

export const createApp = (): Application => {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(requestContext);

  if (!env.isTest) {
    app.use(morgan(env.isProduction ? 'combined' : 'dev'));
  }

  app.get('/health', (_req: Request, res: Response) => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    res.json({
      status: 'ok',
      uptimeSeconds: Math.round(process.uptime()),
      environment: env.nodeEnv,
      database: states[mongoose.connection.readyState] ?? 'unknown',
      timestamp: new Date().toISOString(),
    });
  });

  if (env.docs.enabled) {
    const swagger = createSwaggerRouter();
    if (swagger) {
      // Swagger UI injects inline styles and a config script, so the strict
      // default CSP set above is relaxed on this path only.
      app.use(
        env.docs.path,
        helmet.contentSecurityPolicy({
          useDefaults: true,
          directives: {
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https://validator.swagger.io'],
          },
        }),
        swagger,
      );
      app.get('/', (_req, res) => res.redirect(env.docs.path));
    }
  }

  app.use(env.apiPrefix, globalLimiter, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
