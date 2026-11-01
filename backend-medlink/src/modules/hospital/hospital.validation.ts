import { z } from 'zod';
import { ALL_CONSENT_SCOPES, VERIFICATION_STATUS } from '../../shared/constants';
import { WEEKDAYS } from '../../shared/utils/dates';
import { passwordSchema, phoneSchema } from '../auth/auth.validation';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);
const timePattern = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:mm');

export const updateHospitalSchema = z.object({
  name: z.string().trim().min(2).max(200).optional(),
  contact: z
    .object({
      phone: z.string().optional(),
      alternatePhone: z.string().optional(),
      email: z.string().email().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
  address: z
    .object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      village: z.string().optional(),
      city: z.string().optional(),
      district: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]).optional(),
    })
    .optional(),
  services: z.array(z.string()).optional(),
  facilities: z
    .object({
      ambulance: z.boolean().optional(),
      emergency24x7: z.boolean().optional(),
      icu: z.boolean().optional(),
      bloodBank: z.boolean().optional(),
      pharmacy: z.boolean().optional(),
      laboratory: z.boolean().optional(),
    })
    .optional(),
  bedCapacity: z
    .object({
      total: z.number().int().min(0).optional(),
      available: z.number().int().min(0).optional(),
      icu: z.number().int().min(0).optional(),
      icuAvailable: z.number().int().min(0).optional(),
    })
    .optional(),
  operatingHours: z
    .array(
      z.object({
        weekday: z.enum(WEEKDAYS as unknown as [string, ...string[]]),
        openTime: timePattern.default('00:00'),
        closeTime: timePattern.default('23:59'),
        closed: z.boolean().default(false),
      }),
    )
    .optional(),
  acceptsEmergencies: z.boolean().optional(),
});

export const registerDoctorSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: phoneSchema,
  email: z.string().email().optional(),
  password: passwordSchema,
  registrationNumber: z.string().trim().min(3),
  specialties: z.array(z.string()).min(1),
  qualifications: z
    .array(z.object({ degree: z.string(), institution: z.string().optional(), year: z.number().int().optional() }))
    .default([]),
  experienceYears: z.number().int().min(0).max(80).default(0),
  languages: z.array(z.string()).default(['en']),
  departments: z.array(z.string()).default([]),
  consultationFee: z.number().min(0).optional(),
});

export const linkExistingDoctorSchema = z.object({ doctor: objectId });

export const verifySchema = z.object({
  status: z.enum([VERIFICATION_STATUS.VERIFIED, VERIFICATION_STATUS.REJECTED]),
  reason: z.string().max(500).optional(),
});

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2).max(120),
  specialty: z.string().trim().min(2).max(120),
  description: z.string().max(1000).optional(),
  headDoctor: objectId.optional(),
  contactExtension: z.string().max(20).optional(),
});

export const registerAshaSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: phoneSchema,
  password: passwordSchema,
  ashaId: z.string().trim().min(3),
  district: z.string().trim().min(2),
  state: z.string().trim().min(2),
  block: z.string().optional(),
  village: z.string().optional(),
  languages: z.array(z.string()).default(['hi']),
});

export const assignAshaSchema = z.object({
  asha: objectId,
  patient: objectId,
  scopes: z.array(z.enum(ALL_CONSENT_SCOPES as [string, ...string[]])).min(1),
  durationDays: z.number().int().min(1).max(365).optional(),
  reason: z.string().max(500).optional(),
});

export const listStaffSchema = z.object({
  verificationStatus: z.enum(Object.values(VERIFICATION_STATUS) as [string, ...string[]]).optional(),
  q: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const reportsSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const idParamSchema = z.object({ id: objectId });
