import { z } from 'zod';

const coordinates = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);

export const validateLocationSchema = z.object({
  location: coordinates,
  accuracyMeters: z.number().min(0).max(100000).optional(),
  /** Optional sanity check against a declared district/state. */
  expectedDistrict: z.string().max(100).optional(),
  expectedState: z.string().max(100).optional(),
});

export const shareLocationSchema = z.object({
  location: coordinates,
  accuracyMeters: z.number().min(0).max(100000).optional(),
  /** Only an open emergency can receive a shared location. */
  request: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  deviceId: z.string().max(100).optional(),
});

export const nearbySchema = z.object({
  lng: z.coerce.number().min(-180).max(180),
  lat: z.coerce.number().min(-90).max(90),
  radiusKm: z.coerce.number().min(0.5).max(200).default(20),
  type: z.enum(['hospital', 'doctor']).default('hospital'),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
