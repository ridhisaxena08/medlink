import { env } from '../../../config/environment';
import { logger } from '../../../shared/utils/logger';

export interface SmsMessage {
  to: string;
  body: string;
  senderId?: string;
}

export interface SmsResult {
  provider: string;
  messageId: string;
  status: 'sent' | 'queued' | 'failed';
  segments: number;
}

export interface SmsProvider {
  readonly name: string;
  send(message: SmsMessage): Promise<SmsResult>;
}

/** 160 GSM-7 chars per segment, 70 when any non-GSM character forces UCS-2. */
export const countSegments = (body: string): number => {
  const unicode = /[^\x00-\x7F]/.test(body);
  const size = unicode ? 70 : 160;
  return Math.max(1, Math.ceil(body.length / size));
};

class StubSmsProvider implements SmsProvider {
  readonly name = 'stub';

  async send(message: SmsMessage): Promise<SmsResult> {
    logger.info('SMS (stub provider - not actually delivered)', {
      to: message.to,
      body: message.body,
      senderId: message.senderId ?? env.providers.smsSenderId,
    });
    return {
      provider: this.name,
      messageId: `stub-${Date.now()}`,
      status: 'sent',
      segments: countSegments(message.body),
    };
  }
}

const providers: Record<string, SmsProvider> = { stub: new StubSmsProvider() };

export const smsService: SmsProvider = providers[env.providers.sms] ?? providers.stub;
