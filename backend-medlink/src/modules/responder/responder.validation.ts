import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);
const coordinates = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);

export const updateResponderProfileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  serviceDistricts: z.array(z.string()).optional(),
  vehicle: z
    .object({
      registrationNumber: z.string(),
      type: z.enum(['basic', 'advanced', 'cardiac', 'bike', 'other']),
      deviceId: z.string().optional(),
      capacity: z.number().int().min(1).max(10).optional(),
      equipment: z.array(z.string()).default([]),
    })
    .optional(),
});

export const availabilitySchema = z.object({
  isAvailable: z.boolean(),
  location: coordinates.optional(),
});

export const listAssignmentsSchema = z.object({
  status: z.enum(['offered', 'accepted', 'declined', 'expired', 'completed', 'cancelled']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const acceptSchema = z.object({ etaMinutes: z.number().int().min(1).max(600).optional() });
export const declineSchema = z.object({ reason: z.string().max(500).optional() });

export const locationSchema = z.object({
  location: coordinates,
  accuracyMeters: z.number().min(0).max(10000).optional(),
  speedKph: z.number().min(0).max(300).optional(),
  headingDegrees: z.number().min(0).max(360).optional(),
  source: z.enum(['app', 'device', 'manual']).default('app'),
  deviceId: z.string().max(100).optional(),
  recordedAt: z.coerce.date().optional(),
});

export const statusSchema = z.object({
  status: z.enum(['en_route', 'arrived', 'transporting', 'at_hospital', 'completed']),
  note: z.string().max(500).optional(),
  outcome: z.string().max(500).optional(),
});

export const idParamSchema = z.object({ id: objectId });
