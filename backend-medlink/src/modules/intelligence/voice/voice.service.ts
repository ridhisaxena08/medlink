import { env } from '../../../config/environment';

export interface SpeechRequest {
  text: string;
  language: 'en' | 'hi';
  voice?: string;
}

export interface SpeechResponse {
  provider: string;
  language: string;
  /** base64 audio when a provider is configured; null for the stub. */
  audioBase64: string | null;
  mimeType: string;
  /** Clients fall back to the device's own TTS when audio is null. */
  fallback: 'device_tts' | 'none';
  text: string;
}

export interface VoiceProvider {
  readonly name: string;
  synthesize(request: SpeechRequest): Promise<SpeechResponse>;
}

class StubVoiceProvider implements VoiceProvider {
  readonly name = 'stub';

  async synthesize(request: SpeechRequest): Promise<SpeechResponse> {
    return {
      provider: this.name,
      language: request.language,
      audioBase64: null,
      mimeType: 'audio/mpeg',
      fallback: 'device_tts',
      text: request.text,
    };
  }
}

const providers: Record<string, VoiceProvider> = { stub: new StubVoiceProvider() };

export const voiceService: VoiceProvider = providers[env.providers.tts] ?? providers.stub;
