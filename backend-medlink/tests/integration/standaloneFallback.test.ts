/**
 * A standalone mongod cannot run transactions. Registration must still work -
 * withTransaction detects the unsupported deployment and retries the writes
 * sequentially, so a developer with a plain `mongod` is not blocked.
 */
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../../src/app';
import { ensureCollections } from '../../src/config/database';
import { PatientProfile } from '../../src/modules/patient/patient.model';

jest.setTimeout(180000);

const app = createApp();
let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri(), { dbName: 'medlink-standalone' });
  await ensureCollections();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

it('registers a patient without transaction support, profile included', async () => {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Standalone Patient',
    phone: '+919111100001',
    password: 'Passw0rd123',
    role: 'patient',
    profile: { gender: 'male', bloodGroup: 'B+' },
  });

  expect(res.status).toBe(201);
  const userId = res.body.data.user._id;
  expect(res.body.data.user.profileId).toBeDefined();

  const profile = await PatientProfile.findOne({ user: userId }).lean();
  expect(profile?.bloodGroup).toBe('B+');
});
