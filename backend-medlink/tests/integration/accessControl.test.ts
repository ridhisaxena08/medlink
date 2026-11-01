/**
 * End-to-end check of the access model against a real MongoDB:
 * a clinician with no relationship is refused, consent opens exactly the
 * granted scope, and revocation closes it again - with every decision audited.
 */
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { createApp } from '../../src/app';
import { ensureCollections } from '../../src/config/database';
import { AuditLog } from '../../src/modules/audit/audit.model';
import { DoctorProfile } from '../../src/modules/doctor/doctor.model';

jest.setTimeout(180000);

const app = createApp();
let replSet: MongoMemoryReplSet;

const register = (body: Record<string, unknown>) => request(app).post('/api/auth/register').send(body);

const patientPayload = (phone: string, name: string) => ({
  name,
  phone,
  password: 'Passw0rd123',
  role: 'patient',
  profile: { gender: 'female', bloodGroup: 'O+' },
});

let patientA: { id: string; token: string };
let patientB: { id: string; token: string };
let doctor: { id: string; token: string };

beforeAll(async () => {
  replSet = await MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } });
  await mongoose.connect(replSet.getUri(), { dbName: 'medlink-test' });
  await ensureCollections();

  const a = await register(patientPayload('+919000000001', 'Asha Devi'));
  patientA = { id: a.body.data.user._id, token: a.body.data.tokens.accessToken };

  const b = await register(patientPayload('+919000000002', 'Ram Kumar'));
  patientB = { id: b.body.data.user._id, token: b.body.data.tokens.accessToken };

  const d = await register({
    name: 'Dr Mehta',
    phone: '+919000000003',
    password: 'Passw0rd123',
    role: 'doctor',
    profile: {
      registrationNumber: 'MCI-12345',
      specialties: ['general medicine'],
      experienceYears: 8,
    },
  });
  doctor = { id: d.body.data.user._id, token: d.body.data.tokens.accessToken };

  // Verification normally comes from a hospital/admin; do it directly here.
  await DoctorProfile.updateOne({ user: doctor.id }, { $set: { verificationStatus: 'verified' } });
});

afterAll(async () => {
  await mongoose.disconnect();
  await replSet.stop();
});

describe('registration and identity', () => {
  it('activates patients immediately but keeps doctors pending', async () => {
    const patient = await request(app).get('/api/users/me').set('Authorization', `Bearer ${patientA.token}`);
    expect(patient.status).toBe(200);
    expect(patient.body.data.status).toBe('active');
    expect(patient.body.data.passwordHash).toBeUndefined();

    const clinician = await request(app).get('/api/users/me').set('Authorization', `Bearer ${doctor.token}`);
    expect(clinician.body.data.status).toBe('pending');
  });

  it('refuses a duplicate phone number', async () => {
    const res = await register(patientPayload('+919000000001', 'Someone Else'));
    expect(res.status).toBe(409);
  });

  it('issues a working refresh token and rotates it', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ phone: '+919000000002', password: 'Passw0rd123' });
    expect(login.status).toBe(200);

    const refreshToken = login.body.data.tokens.refreshToken;
    const refreshed = await request(app).post('/api/auth/refresh').send({ refreshToken });
    expect(refreshed.status).toBe(200);

    // The old token must not work twice.
    const reused = await request(app).post('/api/auth/refresh').send({ refreshToken });
    expect(reused.status).toBe(401);
  });
});

describe('patient data access', () => {
  it('lets a patient read their own dashboard', async () => {
    const res = await request(app).get('/api/patients/dashboard').set('Authorization', `Bearer ${patientA.token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.healthSummary).toBeDefined();
  });

  it('refuses one patient reading another', async () => {
    const res = await request(app)
      .get(`/api/patients/${patientB.id}`)
      .set('Authorization', `Bearer ${patientA.token}`);
    expect(res.status).toBe(403);
  });

  it('refuses a doctor with no relationship or consent', async () => {
    const res = await request(app)
      .get(`/api/doctors/patients/${patientA.id}`)
      .set('Authorization', `Bearer ${doctor.token}`);
    expect(res.status).toBe(403);
    expect(res.body.error.message).toMatch(/consent|relationship/i);
  });

  it('records the denial in the audit trail', async () => {
    const denial = await AuditLog.findOne({
      actor: new mongoose.Types.ObjectId(doctor.id),
      outcome: 'denied',
    }).lean();
    expect(denial).not.toBeNull();
    expect(String(denial?.subject)).toBe(patientA.id);
  });
});

describe('consent lifecycle', () => {
  let consentId: string;

  it('opens access once the patient grants consent', async () => {
    const grant = await request(app)
      .post('/api/consents')
      .set('Authorization', `Bearer ${patientA.token}`)
      .send({
        grantee: doctor.id,
        granteeRole: 'doctor',
        scopes: ['medical_history', 'profile'],
        purpose: 'Consultation',
        durationDays: 30,
      });
    expect(grant.status).toBe(201);
    consentId = grant.body.data._id;

    const res = await request(app)
      .get(`/api/doctors/patients/${patientA.id}`)
      .set('Authorization', `Bearer ${doctor.token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.patient.name).toBe('Asha Devi');
  });

  it('does not extend consent beyond the granted scopes', async () => {
    // Prescriptions were never consented to.
    const res = await request(app)
      .get(`/api/prescriptions?patient=${patientA.id}`)
      .set('Authorization', `Bearer ${doctor.token}`);
    expect(res.status).toBe(403);
  });

  it('closes access again on revocation', async () => {
    const revoke = await request(app)
      .delete(`/api/consents/${consentId}`)
      .set('Authorization', `Bearer ${patientA.token}`)
      .send({ reason: 'No longer needed' });
    expect(revoke.status).toBe(200);
    expect(revoke.body.data.status).toBe('revoked');

    const res = await request(app)
      .get(`/api/doctors/patients/${patientA.id}`)
      .set('Authorization', `Bearer ${doctor.token}`);
    expect(res.status).toBe(403);
  });

  it('refuses a third party granting consent over someone else', async () => {
    const res = await request(app)
      .post('/api/consents')
      .set('Authorization', `Bearer ${doctor.token}`)
      .send({
        grantee: doctor.id,
        granteeRole: 'doctor',
        scopes: ['medical_history'],
        patient: patientA.id,
      });
    expect(res.status).toBe(403);
  });
});

describe('medication confirmation', () => {
  it('marks self-added medicines as patient-confirmed', async () => {
    const res = await request(app)
      .post('/api/patients/medicines')
      .set('Authorization', `Bearer ${patientA.token}`)
      .send({ medicineName: 'Paracetamol', dosage: '500mg', frequency: 'BD', timings: ['08:00', '20:00'] });
    expect(res.status).toBe(200);
    expect(res.body.data.confirmedByPatient).toBe(true);
  });
});

describe('emergency', () => {
  it('creates an SOS and refuses a second open request', async () => {
    const first = await request(app)
      .post('/api/emergency/sos')
      .set('Authorization', `Bearer ${patientB.token}`)
      .send({ emergencyType: 'cardiac', severity: 'critical', location: [77.209, 28.6139] });
    expect(first.status).toBe(201);
    expect(first.body.data.request.status).toBe('notified');
    expect(first.body.data.request.patientSnapshot).toBeDefined();

    const second = await request(app)
      .post('/api/emergency/sos')
      .set('Authorization', `Bearer ${patientB.token}`)
      .send({ emergencyType: 'medical', severity: 'high', location: [77.209, 28.6139] });
    expect(second.status).toBe(409);
  });

  it('hides another patient\'s emergency request', async () => {
    const mine = await request(app)
      .get('/api/emergency/my-requests')
      .set('Authorization', `Bearer ${patientB.token}`);
    const requestId = mine.body.data[0]._id;

    const res = await request(app)
      .get(`/api/emergency/requests/${requestId}`)
      .set('Authorization', `Bearer ${patientA.token}`);
    expect(res.status).toBe(403);
  });

  it('rejects an illegal status transition', async () => {
    const mine = await request(app)
      .get('/api/emergency/my-requests')
      .set('Authorization', `Bearer ${patientB.token}`);
    const requestId = mine.body.data[0]._id;

    const res = await request(app)
      .patch(`/api/emergency/requests/${requestId}/status`)
      .set('Authorization', `Bearer ${patientB.token}`)
      .send({ status: 'transporting' });
    expect(res.status).toBe(400);
  });
});

describe('appointments', () => {
  it('refuses a booking outside published availability', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patientA.token}`)
      .send({
        doctor: doctor.id,
        scheduledStart: new Date(Date.now() + 86400000).toISOString(),
        reason: 'Fever for three days',
      });
    expect(res.status).toBe(400);
    expect(res.body.error.message).toMatch(/availability/i);
  });
});
