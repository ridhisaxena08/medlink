import { env } from '../../../config/environment';
import { logger } from '../../../shared/utils/logger';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  language: 'en' | 'hi';
  /** Non-identifying context the caller chose to share (conditions, allergies). */
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  provider: string;
  reply: string;
  /** Set when the message looks like an emergency and the UI should escalate. */
  escalate: boolean;
  disclaimer: string;
  sources: string[];
}

export interface AiProvider {
  readonly name: string;
  chat(request: ChatRequest): Promise<ChatResponse>;
}

const RED_FLAGS = [
  /chest\s*pain/i, /can'?t\s*breathe|difficulty\s*breathing|breathless/i,
  /unconscious|fainted|not\s*responding/i, /severe\s*bleeding|bleeding\s*heavily/i,
  /stroke|face\s*droop|slurred\s*speech/i, /suicid|kill\s*myself|end\s*my\s*life/i,
  /सीने\s*में\s*दर्द/i, /साँस\s*नहीं/i, /बेहोश/i,
];

export const detectEmergency = (text: string): boolean => RED_FLAGS.some((r) => r.test(text));

const DISCLAIMER = {
  en: 'This is general health information, not a diagnosis or prescription. Consult a qualified doctor for medical advice.',
  hi: 'यह केवल सामान्य स्वास्थ्य जानकारी है, निदान या नुस्खा नहीं। चिकित्सीय सलाह के लिए योग्य डॉक्टर से मिलें।',
} as const;

const ESCALATION = {
  en: 'These symptoms can be serious. Please seek emergency care now - use the SOS button in the app or call your local emergency number.',
  hi: 'ये लक्षण गंभीर हो सकते हैं। कृपया तुरंत आपातकालीन सहायता लें - ऐप में SOS बटन दबाएँ या आपातकालीन नंबर पर कॉल करें।',
} as const;

/**
 * Safe default assistant. It never diagnoses or recommends a prescription
 * medicine; it escalates red-flag symptoms and otherwise returns a clearly
 * generic response. Wire a real model by implementing AiProvider.
 */
class StubAiProvider implements AiProvider {
  readonly name = 'stub';

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const last = request.messages[request.messages.length - 1]?.content ?? '';
    const escalate = detectEmergency(last);

    if (!env.providers.aiApiKey) {
      logger.warn('AI stub provider used - set AI_PROVIDER/AI_API_KEY for real conversations');
    }

    const reply = escalate
      ? ESCALATION[request.language]
      : request.language === 'hi'
        ? 'मैं आपकी बात समझ गया/गई। सटीक सलाह के लिए कृपया डॉक्टर से परामर्श करें। आप ऐप में डॉक्टर खोज सकते हैं या अपॉइंटमेंट बुक कर सकते हैं।'
        : 'Thanks for sharing that. For anything specific to your health, please consult a doctor - you can search for one or book an appointment in the app.';

    return {
      provider: this.name,
      reply,
      escalate,
      disclaimer: DISCLAIMER[request.language],
      sources: [],
    };
  }
}

const providers: Record<string, AiProvider> = { stub: new StubAiProvider() };

export const aiService: AiProvider = providers[env.providers.ai] ?? providers.stub;
