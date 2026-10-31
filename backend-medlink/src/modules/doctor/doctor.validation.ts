import { z } from 'zod';
import { WEEKDAYS } from '../../shared/utils/dates';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);
const timePattern = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:mm');

export const updateDoctorProfileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  specialties: z.array(z.string().trim()).min(1).optional(),
  qualifications: z
    .array(z.object({ degree: z.string(), institution: z.string().optional(), year: z.number().int().optional() }))
    .optional(),
  experienceYears: z.number().int().min(0).max(80).optional(),
  languages: z.array(z.string()).optional(),
  consultationFee: z.number().min(0).optional(),
  teleconsultFee: z.number().min(0).optional(),
  bio: z.string().max(2000).optional(),
  departments: z.array(z.string()).optional(),
  acceptingNewPatients: z.boolean().optional(),
  practiceLocation: z
    .object({
      city: z.string().optional(),
      district: z.string().optional(),
      state: z.string().optional(),
      coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]).optional(),
    })
    .optional(),
});

export const setAvailabilitySchema = z.object({
  availability: z
    .array(
      z.object({
        weekday: z.enum(WEEKDAYS as unknown as [string, ...string[]]),
        startTime: timePattern,
        endTime: timePattern,
        slotDurationMinutes: z.number().int().min(5).max(180).default(15),
        mode: z.enum(['in_person', 'teleconsult']).default('in_person'),
        hospital: objectId.optional(),
        isActive: z.boolean().default(true),
      }),
    )
    .max(50),
  exceptions: z
    .array(z.object({ date: z.coerce.date(), reason: z.string().max(200).optional(), unavailableAllDay: z.boolean().default(true) }))
    .max(100)
    .optional(),
});

export const searchDoctorsSchema = z.object({
  q: z.string().trim().max(100).optional(),
  specialty: z.string().optional(),
  language: z.string().optional(),
  hospital: objectId.optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  mode: z.enum(['in_person', 'teleconsult']).optional(),
  maxFee: z.coerce.number().min(0).optional(),
  minExperience: z.coerce.number().int().min(0).optional(),
  acceptingNewPatients: z.coerce.boolean().optional(),
  /** Geo search: longitude,latitude plus radius in km. */
  lng: z.coerce.number().min(-180).max(180).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  radiusKm: z.coerce.number().min(0.5).max(200).default(25),
  sort: z.enum(['experience', 'fee', 'rating', 'distance']).default('rating'),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const createConsultationSchema = z.object({
  patient: objectId,
  appointment: objectId.optional(),
  hospital: objectId.optional(),
  mode: z.enum(['in_person', 'teleconsult', 'field_visit']).default('in_person'),
  chiefComplaint: z.string().trim().min(3).max(500),
  symptoms: z.array(z.string()).default([]),
  vitals: z
    .object({
      temperatureC: z.number().min(25).max(45).optional(),
      pulseBpm: z.number().int().min(20).max(250).optional(),
      systolic: z.number().int().min(50).max(300).optional(),
      diastolic: z.number().int().min(30).max(200).optional(),
      spo2: z.number().int().min(50).max(100).optional(),
      respiratoryRate: z.number().int().min(5).max(80).optional(),
      bloodSugarMgDl: z.number().min(20).max(900).optional(),
    })
    .optional(),
  examinationNotes: z.string().max(5000).optional(),
  diagnosis: z
    .array(
      z.object({
        code: z.string().optional(),
        description: z.string().min(2),
        type: z.enum(['provisional', 'confirmed']).default('provisional'),
      }),
    )
    .default([]),
  advice: z.string().max(5000).optional(),
  followUpDate: z.coerce.date().optional(),
  attachments: z.array(objectId).default([]),
  status: z.enum(['draft', 'final']).default('final'),
});

export const doctorIdParamSchema = z.object({ doctorId: objectId });
export const patientIdParamSchema = z.object({ patientId: objectId });
export const idParamSchema = z.object({ id: objectId });
export const slotQuerySchema = z.object({
  date: z.coerce.date(),
  mode: z.enum(['in_person', 'teleconsult']).optional(),
});
