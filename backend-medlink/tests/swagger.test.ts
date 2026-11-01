import request from 'supertest';
import { createApp } from '../src/app';
import { loadOpenApiDocument } from '../src/config/swagger';

const app = createApp();

describe('Swagger UI', () => {
  it('loads and parses the OpenAPI document', () => {
    const doc = loadOpenApiDocument();
    expect(doc).not.toBeNull();
    expect(doc?.info.title).toBe('MedLink360 API');
    expect(Object.keys(doc!.paths).length).toBeGreaterThan(100);
  });

  it('puts this running server first in the server list', () => {
    const doc = loadOpenApiDocument();
    expect(doc?.servers?.[0].url).toMatch(/\/api$/);
  });

  it('serves the explorer HTML', async () => {
    const res = await request(app).get('/docs/').redirects(1);
    expect(res.status).toBe(200);
    expect(res.text).toContain('swagger-ui');
  });

  it('redirects the site root to the docs', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/docs');
  });

  it('serves the raw spec as JSON', async () => {
    const res = await request(app).get('/docs/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.0.3');
    expect(res.body.paths['/auth/login'].post).toBeDefined();
  });

  it('serves the raw spec as YAML', async () => {
    const res = await request(app).get('/docs/openapi.yaml');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/yaml/);
    expect(res.text).toContain('openapi: 3.0.3');
  });

  it('declares bearer auth so "Authorize" works in the UI', () => {
    const doc = loadOpenApiDocument() as unknown as {
      components: { securitySchemes: Record<string, { scheme: string }> };
    };
    expect(doc.components.securitySchemes.bearerAuth.scheme).toBe('bearer');
  });

  it('keeps docs off the API surface', async () => {
    const res = await request(app).get('/api/docs');
    expect(res.status).toBe(404);
  });
});
