import { z } from 'zod';
import { ALL_ROLES } from '../../shared/constants';

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, 'Phone must be in E.164-like format, e.g. +919876543210');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128)
  .regex(/[a-zA-Z]/, 'Password must contain a letter')
  .regex(/\d/, 'Password must contain a digit');

const coordinates = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);

const doctorProfileSchema = z.object({
  registrationNumber: z.string().trim().min(3),
  specialties: z.array(z.string().trim()).min(1),
  qualifications: z
    .array(z.object({ degree: z.string(), institution: z.string().optional(), year: z.number().optional() }))
    .default([]),
  experienceYears: z.number().int().min(0).max(80).default(0),
  languages: z.array(z.string()).default(['en']),
  consultationFee: z.number().min(0).optional(),
});

const ashaProfileSchema = z.object({
  ashaId: z.string().trim().min(3),
  district: z.string().trim().min(2),
  state: z.string().trim().min(2),
  block: z.string().optional(),
  village: z.string().optional(),
  supervisorName: z.string().optional(),
  supervisorPhone: z.string().optional(),
  languages: z.array(z.string()).default(['hi']),
});

const hospitalProfileSchema = z.object({
  name: z.string().trim().min(2),
  type: z.enum(['phc', 'chc', 'district_hospital', 'private_hospital', 'clinic', 'diagnostic_center']),
  registrationNumber: z.string().trim().min(3),
  contact: z.object({ phone: z.string(), alternatePhone: z.string().optional(), email: z.string().email().optional() }),
  address: z.object({
    line1: z.string().min(3),
    line2: z.string().optional(),
    village: z.string().optional(),
    city: z.string().optional(),
    district: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(4),
    coordinates,
  }),
  services: z.array(z.string()).default([]),
});

const responderProfileSchema = z.object({
  responderType: z.enum(['ambulance_driver', 'paramedic', 'emt', 'volunteer']),
  employeeId: z.string().optional(),
  licenseNumber: z.string().optional(),
  serviceDistricts: z.array(z.string()).default([]),
  vehicle: z
    .object({
      registrationNumber: z.string(),
      type: z.enum(['basic', 'advanced', 'cardiac', 'bike', 'other']).default('basic'),
      deviceId: z.string().optional(),
      capacity: z.number().int().optional(),
      equipment: z.array(z.string()).default([]),
    })
    .optional(),
});

const patientProfileSchema = z.object({
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
      coordinates: coordinates.optional(),
    })
    .optional(),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    phone: phoneSchema,
    email: z.string().email().optional(),
    password: passwordSchema,
    role: z.enum(ALL_ROLES as [string, ...string[]]),
    preferredLanguage: z.enum(['en', 'hi']).default('en'),
    profile: z.record(z.unknown()).optional(),
  })
  .superRefine((value, ctx) => {
    const schemas: Record<string, z.ZodTypeAny> = {
      doctor: doctorProfileSchema,
      asha: ashaProfileSchema,
      hospital: hospitalProfileSchema,
      responder: responderProfileSchema,
      patient: patientProfileSchema,
      admin: z.object({}).passthrough(),
    };
    const schema = schemas[value.role];
    if (!schema) return;
    const result = schema.safeParse(value.profile ?? {});
    if (!result.success) {
      result.error.issues.forEach((issue) =>
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['profile', ...issue.path], message: issue.message }),
      );
    }
  });

export const loginSchema = z.object({
  phone: phoneSchema.optional(),
  email: z.string().email().optional(),
  password: z.string().min(1),
}).refine((v) => v.phone || v.email, { message: 'Provide phone or email' });

export const refreshSchema = z.object({ refreshToken: z.string().min(10) });
export const logoutSchema = z.object({ refreshToken: z.string().min(10).optional(), allDevices: z.boolean().default(false) });
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
