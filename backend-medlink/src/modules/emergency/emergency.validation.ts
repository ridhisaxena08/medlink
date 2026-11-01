import { z } from 'zod';
import { EMERGENCY_STATUS } from '../../shared/constants';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);
const coordinates = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);

export const createSosSchema = z.object({
  emergencyType: z
    .enum(['medical', 'accident', 'cardiac', 'maternity', 'respiratory', 'trauma', 'other'])
    .default('medical'),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('high'),
  description: z.string().max(1000).optional(),
  symptoms: z.array(z.string()).default([]),
  location: coordinates,
  pickupAddress: z.string().max(500).optional(),
  landmark: z.string().max(200).optional(),
  /** Set when an ASHA worker or family member raises it for someone else. */
  patient: objectId.optional(),
  notifyRadiusKm: z.number().min(1).max(100).default(20),
  clientRecordId: z.string().max(100).optional(),
});

export const nearbyHospitalsSchema = z.object({
  lng: z.coerce.number().min(-180).max(180),
  lat: z.coerce.number().min(-90).max(90),
  radiusKm: z.coerce.number().min(0.5).max(200).default(20),
  emergencyOnly: z.coerce.boolean().default(true),
  requiresIcu: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const assignSchema = z.object({
  responder: objectId,
  hospital: objectId.optional(),
  destinationHospital: objectId.optional(),
  offerMinutes: z.number().int().min(1).max(60).default(10),
  notes: z.string().max(500).optional(),
});

export const statusUpdateSchema = z.object({
  status: z.enum(Object.values(EMERGENCY_STATUS) as [string, ...string[]]),
  note: z.string().max(500).optional(),
  outcome: z.string().max(500).optional(),
});

export const locationUpdateSchema = z.object({
  location: coordinates,
  accuracyMeters: z.number().min(0).max(10000).optional(),
  speedKph: z.number().min(0).max(300).optional(),
  headingDegrees: z.number().min(0).max(360).optional(),
  source: z.enum(['app', 'device', 'manual']).default('app'),
  deviceId: z.string().max(100).optional(),
  recordedAt: z.coerce.date().optional(),
});

export const createContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(20),
  alternatePhone: z.string().max(20).optional(),
  relationship: z.string().trim().min(2).max(50),
  isPrimary: z.boolean().default(false),
  notifyOnSos: z.boolean().default(true),
  canShareLocation: z.boolean().default(true),
  address: z.string().max(300).optional(),
  patient: objectId.optional(),
});

export const updateContactSchema = createContactSchema.partial().omit({ patient: true });

export const listRequestsSchema = z.object({
  status: z.enum(Object.values(EMERGENCY_STATUS) as [string, ...string[]]).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const idParamSchema = z.object({ id: objectId });
export const contactIdParamSchema = z.object({ contactId: objectId });
