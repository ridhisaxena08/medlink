import { ok } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import { ApiError } from '../../shared/utils/ApiError';
import { auditAsync } from '../../shared/services/audit.service';
import { ROLES } from '../../shared/constants';
import { uploadDocument } from '../files/files.service';
import { summarise } from '../medical-records/medicalRecords.service';
import { aiService } from './ai/ai.service';
import { identifyFromText } from './ocr/identification.service';
import { ocrService } from './ocr/ocr.service';
import { activeIngredientsFor } from './medicines/medicines.service';
import * as offlineData from './offlineData.service';
import { voiceService } from './voice/voice.service';

export const chat = authedHandler(async (req, res) => {
  const { messages, language, shareHealthContext } = req.body;

  // Health context is attached only when the user explicitly opts in.
  const context =
    shareHealthContext && req.user.role === ROLES.PATIENT
      ? {
          summary: await summarise(req.user.id),
          activeIngredients: await activeIngredientsFor(req.user.id),
        }
      : undefined;

  const response = await aiService.chat({ messages, language, context });

  auditAsync({
    actor: req.user,
    action: 'create',
    resourceType: 'ai_chat',
    subject: req.user.role === ROLES.PATIENT ? req.user.id : null,
    metadata: { escalated: response.escalate, sharedContext: Boolean(context) },
  });

  return ok(res, response);
});

/**
 * Online OCR path. On-device OCR stays the primary route for field use -
 * clients that already have text should call /identify instead.
 */
export const scan = authedHandler(async (req, res) => {
  const file = req.file;
  if (!file) throw ApiError.badRequest('An image is required under the "image" field');

  const { kind, patient, saveDocument, lang } = req.body;

  const ocr = await ocrService.extract(file.buffer, file.mimetype);
  const matches = ocr.rawText ? await identifyFromText(ocr.rawText, 5) : [];

  let document = null;
  if (saveDocument) {
    document = await uploadDocument(req.user, {
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      category: kind === 'prescription' ? 'prescription' : 'medicine_image',
      title: kind === 'prescription' ? 'Scanned prescription' : 'Scanned medicine',
      patient,
    });
  }

  return ok(res, {
    kind,
    language: lang,
    ocr: { provider: ocr.provider, rawText: ocr.rawText, lines: ocr.lines, processingMs: ocr.processingMs },
    matches,
    document,
    ...(ocr.rawText
      ? {}
      : {
          warning:
            'No text was extracted. Run OCR on the device and post the text to /api/intelligence/identify, or configure OCR_PROVIDER.',
        }),
    note: 'Matches are suggestions. Confirm the medicine before acting on it.',
  });
});

/** Accepts text extracted on-device so offline clients never depend on /scan. */
export const identify = authedHandler(async (req, res) => {
  const { text, limit } = req.body;
  const matches = await identifyFromText(text, limit);
  return ok(res, {
    query: text,
    matches,
    note: 'Ranked suggestions only - a human confirms the match.',
  });
});

export const speak = authedHandler(async (req, res) =>
  ok(res, await voiceService.synthesize(req.body)),
);

export const offlineVersion = authedHandler(async (_req, res) => ok(res, await offlineData.getVersion()));

export const offlineMedicines = authedHandler(async (req, res) => {
  const { sinceVersion, limit, cursor } = req.query as unknown as {
    sinceVersion: number; limit?: number; cursor?: string;
  };
  return ok(res, await offlineData.getMedicineBundle(sinceVersion, limit ?? 1000, cursor));
});

export const offlineInteractions = authedHandler(async (req, res) => {
  const { sinceVersion, limit, cursor } = req.query as unknown as {
    sinceVersion: number; limit?: number; cursor?: string;
  };
  return ok(res, await offlineData.getInteractionBundle(sinceVersion, limit ?? 2000, cursor));
});
