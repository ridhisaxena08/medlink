import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const num = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const str = (value: string | undefined, fallback: string): string =>
  value === undefined || value.trim() === '' ? fallback : value;

export const env = {
  nodeEnv: str(process.env.NODE_ENV, 'development'),
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  port: num(process.env.PORT, 5000),
  apiPrefix: str(process.env.API_PREFIX, '/api'),

  mongoUri: str(process.env.MONGODB_URI, 'mongodb://127.0.0.1:27017/medlink360'),

  jwt: {
    accessSecret: str(process.env.JWT_ACCESS_SECRET, 'dev-access-secret'),
    refreshSecret: str(process.env.JWT_REFRESH_SECRET, 'dev-refresh-secret'),
    accessExpiresIn: str(process.env.JWT_ACCESS_EXPIRES_IN, '15m'),
    refreshExpiresIn: str(process.env.JWT_REFRESH_EXPIRES_IN, '30d'),
  },
  bcryptRounds: num(process.env.BCRYPT_ROUNDS, 10),

  storage: {
    driver: str(process.env.STORAGE_DRIVER, 'local') as 'local' | 's3',
    localDir: path.resolve(process.cwd(), str(process.env.STORAGE_LOCAL_DIR, 'uploads')),
    publicBaseUrl: str(process.env.STORAGE_PUBLIC_BASE_URL, 'http://localhost:5000/api/files'),
    maxUploadBytes: num(process.env.MAX_UPLOAD_SIZE_MB, 15) * 1024 * 1024,
  },

  rateLimit: {
    windowMs: num(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    max: num(process.env.RATE_LIMIT_MAX, 300),
    authMax: num(process.env.AUTH_RATE_LIMIT_MAX, 20),
  },

  providers: {
    ai: str(process.env.AI_PROVIDER, 'stub'),
    aiApiKey: str(process.env.AI_API_KEY, ''),
    ocr: str(process.env.OCR_PROVIDER, 'stub'),
    ocrApiKey: str(process.env.OCR_API_KEY, ''),
    sms: str(process.env.SMS_PROVIDER, 'stub'),
    smsApiKey: str(process.env.SMS_API_KEY, ''),
    smsSenderId: str(process.env.SMS_SENDER_ID, 'MEDLNK'),
    tts: str(process.env.TTS_PROVIDER, 'stub'),
  },

  offlineDataVersion: num(process.env.OFFLINE_DATA_VERSION, 1),

  docs: {
    /** Swagger UI path, and whether to expose it at all. */
    enabled: str(process.env.SWAGGER_ENABLED, 'true') !== 'false',
    path: str(process.env.SWAGGER_PATH, '/docs'),
  },

  access: {
    ashaDefaultAccessDays: num(process.env.ASHA_DEFAULT_ACCESS_DAYS, 90),
    consentDefaultDays: num(process.env.CONSENT_DEFAULT_DAYS, 180),
  },
};

export type Env = typeof env;
