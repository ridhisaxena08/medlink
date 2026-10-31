import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from './environment';
import { logger } from '../shared/utils/logger';

export interface OpenApiDocument {
  openapi: string;
  info: { title: string; version: string; description?: string };
  servers?: { url: string; description?: string }[];
  paths: Record<string, Record<string, unknown>>;
  [key: string]: unknown;
}

/**
 * docs/openapi.yaml is not compiled into dist/, so look for it relative to the
 * working directory first and fall back to a path relative to this file -
 * that covers `npm run dev`, `npm start` and tests alike.
 */
const CANDIDATE_PATHS = [
  path.resolve(process.cwd(), 'docs/openapi.yaml'),
  path.resolve(__dirname, '../../docs/openapi.yaml'),
  path.resolve(__dirname, '../../../docs/openapi.yaml'),
];

const resolveSpecPath = (): string | null =>
  CANDIDATE_PATHS.find((candidate) => fs.existsSync(candidate)) ?? null;

let cached: OpenApiDocument | null = null;

/** Parses the spec once, then serves it from memory (re-read per request in dev). */
export const loadOpenApiDocument = (): OpenApiDocument | null => {
  if (cached && env.isProduction) return cached;

  const specPath = resolveSpecPath();
  if (!specPath) {
    logger.warn('OpenAPI spec not found - Swagger UI will be unavailable', { searched: CANDIDATE_PATHS });
    return null;
  }

  try {
    const document = yaml.load(fs.readFileSync(specPath, 'utf8')) as OpenApiDocument;

    // Point the "Try it out" button at the server actually running this process.
    const localUrl = `http://localhost:${env.port}${env.apiPrefix}`;
    const servers = document.servers ?? [];
    document.servers = [
      { url: localUrl, description: `This server (${env.nodeEnv})` },
      ...servers.filter((s) => s.url !== localUrl),
    ];

    cached = document;
    return document;
  } catch (err) {
    logger.error('Failed to parse docs/openapi.yaml', err);
    return null;
  }
};

const UI_OPTIONS: swaggerUi.SwaggerUiOptions = {
  explorer: true,
  customSiteTitle: 'MedLink360 API',
  swaggerOptions: {
    // Keep the bearer token across page reloads while exploring.
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
    tryItOutEnabled: true,
  },
};

/**
 * Interactive API explorer plus the raw spec in both formats.
 * Mounted outside the API prefix so it never collides with a resource route.
 */
export const createSwaggerRouter = (): Router | null => {
  const document = loadOpenApiDocument();
  if (!document) return null;

  const router = Router();

  router.get('/openapi.json', (_req, res) => {
    res.json(loadOpenApiDocument() ?? document);
  });

  router.get('/openapi.yaml', (_req, res) => {
    const specPath = resolveSpecPath();
    if (!specPath) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND' } });
    res.type('text/yaml').send(fs.readFileSync(specPath, 'utf8'));
  });

  router.use('/', swaggerUi.serveFiles(document, UI_OPTIONS), swaggerUi.setup(document, UI_OPTIONS));

  return router;
};
