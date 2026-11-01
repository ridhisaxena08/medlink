import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('app wiring', () => {
  it('serves a health check without authentication', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('returns a structured 404 for unknown routes', async () => {
    const res = await request(app).get('/api/not-a-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('rejects protected routes without a token', async () => {
    const res = await request(app).get('/api/patients/me');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('validates the registration payload before touching the database', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', phone: 'nope', password: 'short', role: 'patient' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
    expect(Array.isArray(res.body.error.details)).toBe(true);
  });

  it('requires role-specific profile fields at registration', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Dr Test',
      phone: '+919876543210',
      password: 'Passw0rd123',
      role: 'doctor',
    });
    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body.error.details)).toContain('registrationNumber');
  });
});
