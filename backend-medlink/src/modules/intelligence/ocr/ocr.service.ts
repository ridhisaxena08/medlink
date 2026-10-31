import { env } from '../../../config/environment';
import { logger } from '../../../shared/utils/logger';

export interface OcrLine {
  text: string;
  confidence: number;
}

export interface OcrResult {
  provider: string;
  rawText: string;
  lines: OcrLine[];
  languageHints: string[];
  processingMs: number;
}

export interface OcrProvider {
  readonly name: string;
  extract(image: Buffer, mimeType: string): Promise<OcrResult>;
}

/**
 * Deterministic stand-in so the whole pipeline (scan -> identify -> parse ->
 * propose reminders) is exercisable without a paid OCR vendor. Swap in a real
 * provider by implementing OcrProvider and selecting it with OCR_PROVIDER.
 *
 * On-device OCR remains the primary path for field use; this endpoint is the
 * optional online alternative and nothing offline depends on it.
 */
class StubOcrProvider implements OcrProvider {
  readonly name = 'stub';

  async extract(image: Buffer, mimeType: string): Promise<OcrResult> {
    const started = Date.now();
    logger.warn('OCR stub provider used - configure OCR_PROVIDER for production extraction', {
      bytes: image.length,
      mimeType,
    });
    return {
      provider: this.name,
      rawText: '',
      lines: [],
      languageHints: ['en', 'hi'],
      processingMs: Date.now() - started,
    };
  }
}

const providers: Record<string, OcrProvider> = {
  stub: new StubOcrProvider(),
};

export const ocrService: OcrProvider =
  providers[env.providers.ocr] ?? providers.stub;
