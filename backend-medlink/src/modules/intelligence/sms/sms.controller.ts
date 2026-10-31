import { Types } from 'mongoose';
import { CONSENT_SCOPES, ROLES } from '../../../shared/constants';
import { ApiError } from '../../../shared/utils/ApiError';
import { ok } from '../../../shared/utils/apiResponse';
import { authedHandler } from '../../../shared/utils/asyncHandler';
import { assertPatientAccess } from '../../../shared/services/access.service';
import { auditAsync } from '../../../shared/services/audit.service';
import { User } from '../../auth/auth.model';
import { Reminder } from '../reminders/reminder.model';
import { countSegments, smsService } from './sms.service';

const TEMPLATES: Record<string, Record<'en' | 'hi', string>> = {
  medicine_reminder: {
    en: 'MedLink: Time to take {{medicine}} ({{dosage}}). Reply or open the app to mark it taken.',
    hi: 'MedLink: {{medicine}} ({{dosage}}) लेने का समय हो गया है। ऐप में दर्ज करें।',
  },
  appointment_reminder: {
    en: 'MedLink: Appointment with {{doctor}} on {{datetime}}. Please arrive 10 minutes early.',
    hi: 'MedLink: {{doctor}} के साथ {{datetime}} को अपॉइंटमेंट है। कृपया 10 मिनट पहले पहुँचें।',
  },
  followup: {
    en: 'MedLink: Your health worker will visit on {{date}}. Keep your medicines ready.',
    hi: 'MedLink: आपकी स्वास्थ्य कार्यकर्ता {{date}} को आएंगी। अपनी दवाइयाँ तैयार रखें।',
  },
  custom: { en: '{{body}}', hi: '{{body}}' },
};

const render = (template: string, variables: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_m, key: string) => variables[key] ?? '');

/** Builds the exact text that would be sent, without sending anything. */
export const prepare = authedHandler(async (req, res) => {
  const { reminder, patient, template, lang, variables, customBody } = req.body;

  let patientId: string | undefined = patient;
  let vars: Record<string, string> = { ...variables };

  if (reminder) {
    const doc = await Reminder.findById(reminder).lean();
    if (!doc) throw ApiError.notFound('Reminder not found');
    patientId = String(doc.patient);
    vars = { medicine: doc.medicineName, dosage: doc.doses[0]?.amount ?? '', ...vars };
  }
  if (!patientId) throw ApiError.badRequest('patient or reminder is required');
  if (patientId !== req.user.id) {
    await assertPatientAccess(req.user, patientId, CONSENT_SCOPES.SMS, 'sms');
  }

  const target = await User.findById(patientId).select('phone preferredLanguage name').lean();
  if (!target) throw ApiError.notFound('Patient not found');

  const language = (lang ?? target.preferredLanguage ?? 'en') as 'en' | 'hi';
  const body = render(
    template === 'custom' ? TEMPLATES.custom[language] : TEMPLATES[template][language],
    { ...vars, body: customBody ?? '' },
  ).trim();

  const segments = countSegments(body);

  return ok(res, {
    patient: patientId,
    to: target.phone,
    language,
    body,
    segments,
    requiresApproval: true,
    note: 'Review this message, then POST /api/sms/send with approved:true to deliver it.',
  });
});

/**
 * Delivery requires: explicit approval in the payload, an SMS consent record
 * when sending on someone else's behalf, and a recorded audit entry.
 */
export const send = authedHandler(async (req, res) => {
  const { patient, body, reminder } = req.body;

  if (patient !== req.user.id) {
    await assertPatientAccess(req.user, patient, CONSENT_SCOPES.SMS, 'sms');
  } else if (req.user.role !== ROLES.PATIENT) {
    throw ApiError.badRequest('patient is required');
  }

  const target = await User.findById(patient).select('phone phoneVerified').lean();
  if (!target) throw ApiError.notFound('Patient not found');
  if (!target.phoneVerified) {
    throw ApiError.badRequest('Patient phone number is not verified; SMS will not be sent');
  }

  const result = await smsService.send({ to: target.phone, body });

  auditAsync({
    actor: req.user,
    action: 'create',
    resourceType: 'sms',
    resourceId: result.messageId,
    subject: patient,
    metadata: { segments: result.segments, provider: result.provider, reminder: reminder ?? null },
  });

  return ok(res, result);
});
