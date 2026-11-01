import { z } from 'zod';
import { ALL_CONSENT_SCOPES } from '../../shared/constants';
import { phoneSchema } from '../auth/auth.validation';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

const consentEvidenceSchema = z.object({
  /** Assisted flows cannot claim in-app consent - the patient was not on the device. */
  method: z.enum(['otp', 'verbal_recorded', 'paper']),
  reference: z.string().max(200).optional(),
});

export const updateAshaProfileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  block: z.string().max(100).optional(),
  village: z.string().max(100).optional(),
  supervisorName: z.string().max(120).optional(),
  supervisorPhone: z.string().max(20).optional(),
  languages: z.array(z.string()).optional(),
  deviceId: z.string().max(100).optional(),
  coverageArea: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]).optional(),
});

export const registerPatientSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: phoneSchema,
  password: z.string().min(8).max(128).optional(),
  preferredLanguage: z.enum(['en', 'hi']).default('hi'),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(['male', 'female', 'other', 'undisclosed']).optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  address: z
    .object({
      line1: z.string().optional(),
      village: z.string().optional(),
      district: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]).optional(),
    })
    .optional(),
  /** Required: the patient must have agreed to the worker holding their data. */
  consent: z.object({
    scopes: z.array(z.enum(ALL_CONSENT_SCOPES as [string, ...string[]])).min(1),
    durationDays: z.number().int().min(1).max(365).optional(),
    evidence: consentEvidenceSchema,
  }),
  clientRecordId: z.string().max(100).optional(),
});

export const createAssignmentSchema = z.object({
  asha: objectId,
  patient: objectId,
  scopes: z.array(z.enum(ALL_CONSENT_SCOPES as [string, ...string[]])).min(1),
  durationDays: z.number().int().min(1).max(365).optional(),
  reason: z.string().max(500).optional(),
});

export const listAssignmentsSchema = z.object({
  status: z.enum(['active', 'expired', 'revoked']).optional(),
  patient: objectId.optional(),
  asha: objectId.optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const createFollowUpSchema = z.object({
  patient: objectId,
  visitedAt: z.coerce.date().optional(),
  visitType: z.enum(['home_visit', 'phone', 'camp', 'other']).default('home_visit'),
  notes: z.string().trim().min(3).max(5000),
  vitals: z
    .object({
      temperatureC: z.number().min(25).max(45).optional(),
      pulseBpm: z.number().int().min(20).max(250).optional(),
      systolic: z.number().int().min(50).max(300).optional(),
      diastolic: z.number().int().min(30).max(200).optional(),
      spo2: z.number().int().min(50).max(100).optional(),
    })
    .optional(),
  adherenceReported: z.enum(['good', 'partial', 'poor', 'unknown']).default('unknown'),
  concerns: z.array(z.string()).default([]),
  referralMade: z.boolean().default(false),
  referredTo: objectId.optional(),
  nextVisitDate: z.coerce.date().optional(),
  attachments: z.array(objectId).default([]),
  location: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]).optional(),
  clientRecordId: z.string().max(100).optional(),
});

export const listFollowUpsSchema = z.object({
  patient: objectId.optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const listPatientsSchema = z.object({
  q: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const patientIdParamSchema = z.object({ patientId: objectId });
export const idParamSchema = z.object({ id: objectId });
