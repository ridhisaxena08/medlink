import { Types } from 'mongoose';
import { CONSENT_SCOPES, ROLES } from '../../../shared/constants';
import { AuthenticatedUser } from '../../../shared/types';
import { ApiError } from '../../../shared/utils/ApiError';
import { pageMeta, parsePagination } from '../../../shared/utils/pagination';
import { assertPatientAccess } from '../../../shared/services/access.service';
import { auditAsync } from '../../../shared/services/audit.service';
import { notify } from '../../../shared/services/notification.service';
import { Medicine } from './medicine.model';
import { IPatientMedication, PatientMedication } from './patientMedication.model';

const oid = (v: string | Types.ObjectId) => (typeof v === 'string' ? new Types.ObjectId(v) : v);

/* ----------------------------- catalogue ------------------------------ */

export const searchCatalogue = async (query: {
  q: string; form?: string; prescriptionRequired?: boolean; page?: number; limit?: number;
}) => {
  const page = parsePagination(query as Record<string, unknown>);
  const tokens = query.q.toLowerCase().split(/[^a-z0-9]+/i).filter(Boolean);

  const filter: Record<string, unknown> = {
    $or: [
      { name: { $regex: query.q, $options: 'i' } },
      { genericName: { $regex: query.q, $options: 'i' } },
      { brandNames: { $regex: query.q, $options: 'i' } },
      ...(tokens.length ? [{ searchTokens: { $in: tokens } }] : []),
    ],
  };
  if (query.form) filter.form = query.form;
  if (query.prescriptionRequired !== undefined) filter.prescriptionRequired = query.prescriptionRequired;

  const [items, total] = await Promise.all([
    Medicine.find(filter)
      .select('name genericName brandNames form strength prescriptionRequired therapeuticClass isVerified')
      .sort({ isVerified: -1, name: 1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    Medicine.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

export const getMedicine = async (medicineId: string) => {
  const medicine = await Medicine.findById(medicineId).lean();
  if (!medicine) throw ApiError.notFound('Medicine not found');
  return medicine;
};

/** Curated bilingual explanation - never generated at request time. */
export const getExplanation = async (medicineId: string, lang: 'en' | 'hi') => {
  const medicine = await getMedicine(medicineId);
  const explanation = medicine.explanation?.[lang] ?? medicine.explanation?.en;
  if (!explanation?.uses) {
    throw ApiError.notFound(`No reviewed ${lang} explanation is available for this medicine yet`);
  }
  return {
    medicineId,
    name: medicine.name,
    genericName: medicine.genericName,
    language: lang,
    prescriptionRequired: medicine.prescriptionRequired,
    ...explanation,
    disclaimer:
      lang === 'hi'
        ? 'यह जानकारी केवल सामान्य जागरूकता के लिए है। दवा शुरू या बंद करने से पहले डॉक्टर से सलाह लें।'
        : 'This information is for general awareness only. Consult a doctor before starting or stopping any medicine.',
  };
};

/* -------------------------- patient medications ------------------------ */

export interface AddMedicationInput {
  medicine?: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  timings?: string[];
  route?: string;
  instructions?: string;
  startDate?: Date;
  endDate?: Date;
  durationDays?: number;
  source?: 'prescription' | 'self_reported' | 'asha_reported' | 'scan';
  prescription?: string;
  patient?: string;
}

/**
 * Anyone with medication scope may propose an entry, but only the patient's own
 * confirmation flips confirmedByPatient - reminders key off that flag.
 */
export const addPatientMedication = async (
  actor: AuthenticatedUser,
  input: AddMedicationInput,
): Promise<IPatientMedication> => {
  const patientId = input.patient ?? actor.id;
  if (patientId !== actor.id) {
    await assertPatientAccess(actor, patientId, CONSENT_SCOPES.MEDICATIONS, 'patient_medication');
  } else if (actor.role !== ROLES.PATIENT) {
    throw ApiError.badRequest('patient is required');
  }

  const selfAdded = patientId === actor.id;

  const medication = await PatientMedication.create({
    patient: oid(patientId),
    medicine: input.medicine ? oid(input.medicine) : null,
    medicineName: input.medicineName,
    dosage: input.dosage,
    frequency: input.frequency,
    timings: input.timings ?? [],
    route: input.route,
    instructions: input.instructions,
    startDate: input.startDate ?? new Date(),
    endDate: input.endDate ?? null,
    durationDays: input.durationDays,
    source: input.source ?? (actor.role === ROLES.ASHA ? 'asha_reported' : 'self_reported'),
    prescription: input.prescription ? oid(input.prescription) : null,
    confirmedByPatient: selfAdded,
    confirmedAt: selfAdded ? new Date() : null,
    addedBy: oid(actor.id),
    addedByRole: actor.role,
  });

  auditAsync({
    actor, action: 'create', resourceType: 'patient_medication', resourceId: String(medication._id),
    subject: patientId, metadata: { medicineName: input.medicineName, confirmed: selfAdded },
  });

  if (!selfAdded) {
    await notify({
      user: patientId,
      type: 'medication.pending_confirmation',
      title: 'Confirm a medicine added for you',
      body: `${input.medicineName} (${input.dosage}) was added by a health worker. Confirm it to activate reminders.`,
      data: { medicationId: String(medication._id) },
    });
  }

  return medication;
};

export const listPatientMedications = async (
  actor: AuthenticatedUser,
  query: { patient?: string; status?: string; confirmedOnly?: boolean; page?: number; limit?: number },
) => {
  const patientId = query.patient ?? actor.id;
  if (patientId !== actor.id) {
    await assertPatientAccess(actor, patientId, CONSENT_SCOPES.MEDICATIONS, 'patient_medication');
  }

  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> = { patient: oid(patientId) };
  if (query.status) filter.status = query.status;
  if (query.confirmedOnly) filter.confirmedByPatient = true;

  const [items, total] = await Promise.all([
    PatientMedication.find(filter)
      .populate('medicine', 'name genericName form strength')
      .sort({ status: 1, createdAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    PatientMedication.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

export const confirmPatientMedication = async (actor: AuthenticatedUser, medicationId: string) => {
  const medication = await PatientMedication.findById(medicationId);
  if (!medication) throw ApiError.notFound('Medication not found');
  if (String(medication.patient) !== actor.id) {
    throw ApiError.forbidden('Only the patient can confirm their medication list');
  }

  medication.confirmedByPatient = true;
  medication.confirmedAt = new Date();
  await medication.save();

  auditAsync({
    actor, action: 'update', resourceType: 'patient_medication', resourceId: medicationId,
    subject: medication.patient, metadata: { confirmed: true },
  });

  return medication;
};

export const stopPatientMedication = async (
  actor: AuthenticatedUser,
  medicationId: string,
  reason?: string,
) => {
  const medication = await PatientMedication.findById(medicationId);
  if (!medication) throw ApiError.notFound('Medication not found');
  if (String(medication.patient) !== actor.id) {
    await assertPatientAccess(actor, medication.patient, CONSENT_SCOPES.MEDICATIONS, 'patient_medication');
  }

  medication.status = 'stopped';
  medication.stopReason = reason;
  medication.endDate = new Date();
  await medication.save();

  auditAsync({
    actor, action: 'update', resourceType: 'patient_medication', resourceId: medicationId,
    subject: medication.patient, metadata: { status: 'stopped', reason },
  });

  return medication;
};

/** Ingredient names for the interaction checker, resolved from the catalogue where possible. */
export const activeIngredientsFor = async (patientId: string): Promise<string[]> => {
  const medications = await PatientMedication.find({
    patient: oid(patientId),
    status: 'active',
    confirmedByPatient: true,
  })
    .populate('medicine', 'genericName ingredients')
    .lean();

  const names = new Set<string>();
  for (const med of medications) {
    const catalogue = med.medicine as unknown as { genericName?: string; ingredients?: { name: string }[] } | null;
    if (catalogue?.genericName) names.add(catalogue.genericName.toLowerCase());
    catalogue?.ingredients?.forEach((i) => names.add(i.name.toLowerCase()));
    if (!catalogue) names.add(med.medicineName.toLowerCase());
  }
  return Array.from(names);
};
