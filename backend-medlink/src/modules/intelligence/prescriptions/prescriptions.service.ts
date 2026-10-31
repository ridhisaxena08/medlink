import { Types } from 'mongoose';
import { CONSENT_SCOPES, ROLES } from '../../../shared/constants';
import { AuthenticatedUser } from '../../../shared/types';
import { ApiError } from '../../../shared/utils/ApiError';
import { pageMeta, parsePagination } from '../../../shared/utils/pagination';
import { assertPatientAccess } from '../../../shared/services/access.service';
import { auditAsync } from '../../../shared/services/audit.service';
import { notify } from '../../../shared/services/notification.service';
import { DocumentModel } from '../../files/document.model';
import { storage } from '../../../config/storage';
import { addPatientMedication } from '../medicines/medicines.service';
import { ocrService } from '../ocr/ocr.service';
import { parsePrescriptionText } from './prescription.parser';
import { IPrescription, Prescription } from './prescription.model';

const oid = (v: string | Types.ObjectId) => (typeof v === 'string' ? new Types.ObjectId(v) : v);

export const createPrescription = async (
  actor: AuthenticatedUser,
  input: {
    patient: string; consultation?: string; hospital?: string; document?: string;
    items: Record<string, unknown>[]; advice?: string; diagnosisSummary?: string; validUntil?: Date;
  },
): Promise<IPrescription> => {
  if (actor.role !== ROLES.DOCTOR) throw ApiError.forbidden('Only doctors can issue prescriptions');
  await assertPatientAccess(actor, input.patient, CONSENT_SCOPES.PRESCRIPTIONS, 'prescription');

  const prescription = await Prescription.create({
    patient: oid(input.patient),
    doctor: oid(actor.id),
    consultation: input.consultation ? oid(input.consultation) : null,
    hospital: input.hospital ? oid(input.hospital) : null,
    document: input.document ? oid(input.document) : null,
    items: input.items.map((i) => ({ ...i, verified: true })),
    advice: input.advice,
    diagnosisSummary: input.diagnosisSummary,
    validUntil: input.validUntil ?? null,
    source: 'doctor_issued',
    verificationStatus: 'clinician_verified',
    verifiedBy: oid(actor.id),
    verifiedAt: new Date(),
  });

  auditAsync({
    actor, action: 'create', resourceType: 'prescription', resourceId: String(prescription._id),
    subject: input.patient, metadata: { items: input.items.length },
  });

  await notify({
    user: input.patient,
    type: 'prescription.issued',
    title: 'New prescription',
    body: `A prescription with ${input.items.length} medicine(s) was issued for you.`,
    data: { prescriptionId: String(prescription._id) },
    priority: 'high',
  });

  return prescription;
};

export const listPrescriptions = async (
  actor: AuthenticatedUser,
  query: { patient?: string; status?: string; page?: number; limit?: number },
) => {
  const patientId = query.patient ?? actor.id;
  if (patientId !== actor.id) {
    await assertPatientAccess(actor, patientId, CONSENT_SCOPES.PRESCRIPTIONS, 'prescription');
  }

  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> = { patient: oid(patientId) };
  if (query.status) filter.verificationStatus = query.status;

  const [items, total] = await Promise.all([
    Prescription.find(filter)
      .populate('doctor', 'name')
      .sort({ issuedAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    Prescription.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

export const getPrescription = async (actor: AuthenticatedUser, prescriptionId: string) => {
  const prescription = await Prescription.findById(prescriptionId).populate('doctor', 'name');
  if (!prescription) throw ApiError.notFound('Prescription not found');
  if (String(prescription.patient) !== actor.id) {
    await assertPatientAccess(actor, prescription.patient, CONSENT_SCOPES.PRESCRIPTIONS, 'prescription');
  }
  return prescription;
};

/**
 * Parses prescription text (or a stored document via server-side OCR) into a
 * draft prescription marked unverified. Nothing here reaches the medication
 * list or the reminder engine until it is explicitly verified.
 */
export const parsePrescription = async (
  actor: AuthenticatedUser,
  input: { text?: string; document?: string; patient?: string },
) => {
  const patientId = input.patient ?? actor.id;
  if (patientId !== actor.id) {
    await assertPatientAccess(actor, patientId, CONSENT_SCOPES.PRESCRIPTIONS, 'prescription');
  }

  let rawText = input.text ?? '';
  let documentId = input.document;

  if (!rawText && documentId) {
    const doc = await DocumentModel.findById(documentId).lean();
    if (!doc) throw ApiError.notFound('Document not found');
    const buffer = await storage.get(doc.storageKey);
    const ocr = await ocrService.extract(buffer, doc.mimeType);
    rawText = ocr.rawText;
    if (!rawText) {
      throw ApiError.unprocessable(
        'Server-side OCR returned no text. Extract the text on-device and send it as "text".',
      );
    }
  }

  const parsed = await parsePrescriptionText(rawText);

  const prescription = await Prescription.create({
    patient: oid(patientId),
    document: documentId ? oid(documentId) : null,
    items: parsed.items.map((i) => ({
      medicine: i.candidates[0]?.medicineId ? oid(i.candidates[0].medicineId) : null,
      medicineName: i.medicineName,
      dosage: i.dosage,
      frequency: i.frequency,
      timings: i.timings,
      durationDays: i.durationDays,
      instructions: i.instructions,
      confidence: i.confidence,
      verified: false,
    })),
    source: 'parsed',
    verificationStatus: 'unverified',
    rawParsedText: rawText,
  });

  auditAsync({
    actor, action: 'create', resourceType: 'prescription', resourceId: String(prescription._id),
    subject: patientId, metadata: { source: 'parsed', items: parsed.items.length },
  });

  return {
    prescription,
    parsed,
    nextStep: 'Review each item and call POST /api/prescriptions/verify before using it.',
  };
};

/**
 * Human verification step. The caller confirms or corrects each parsed item;
 * only accepted items survive, and only then can they become medications.
 */
export const verifyPrescription = async (
  actor: AuthenticatedUser,
  input: {
    prescription: string;
    items: {
      index: number; medicine?: string; medicineName?: string; dosage?: string;
      frequency?: string; timings?: string[]; durationDays?: number; instructions?: string; accepted: boolean;
    }[];
    addToMedications: boolean;
  },
) => {
  const prescription = await Prescription.findById(input.prescription);
  if (!prescription) throw ApiError.notFound('Prescription not found');

  const isPatient = String(prescription.patient) === actor.id;
  if (!isPatient) {
    await assertPatientAccess(actor, prescription.patient, CONSENT_SCOPES.PRESCRIPTIONS, 'prescription');
    if (actor.role !== ROLES.DOCTOR && actor.role !== ROLES.ADMIN) {
      throw ApiError.forbidden('Only the patient or a clinician can verify a prescription');
    }
  }

  const corrections = new Map(input.items.map((i) => [i.index, i]));
  const kept: typeof prescription.items = [] as typeof prescription.items;

  prescription.items.forEach((item, index) => {
    const correction = corrections.get(index);
    if (correction && !correction.accepted) return;

    if (correction) {
      if (correction.medicine) item.medicine = oid(correction.medicine);
      if (correction.medicineName) item.medicineName = correction.medicineName;
      if (correction.dosage) item.dosage = correction.dosage;
      if (correction.frequency) item.frequency = correction.frequency;
      if (correction.timings) item.timings = correction.timings;
      if (correction.durationDays) item.durationDays = correction.durationDays;
      if (correction.instructions) item.instructions = correction.instructions;
    }
    item.verified = true;
    kept.push(item);
  });

  if (!kept.length) throw ApiError.badRequest('At least one item must be accepted');

  prescription.items = kept;
  prescription.verificationStatus = actor.role === ROLES.DOCTOR ? 'clinician_verified' : 'patient_confirmed';
  prescription.verifiedBy = oid(actor.id);
  prescription.verifiedAt = new Date();
  await prescription.save();

  const medications = [];
  if (input.addToMedications) {
    for (const item of kept) {
      medications.push(
        await addPatientMedication(actor, {
          medicine: item.medicine ? String(item.medicine) : undefined,
          medicineName: item.medicineName,
          dosage: item.dosage,
          frequency: item.frequency,
          timings: item.timings,
          instructions: item.instructions,
          durationDays: item.durationDays,
          source: 'prescription',
          prescription: String(prescription._id),
          patient: String(prescription.patient),
        }),
      );
    }
  }

  auditAsync({
    actor, action: 'update', resourceType: 'prescription', resourceId: input.prescription,
    subject: prescription.patient,
    metadata: { verificationStatus: prescription.verificationStatus, accepted: kept.length },
  });

  return { prescription, medications };
};
