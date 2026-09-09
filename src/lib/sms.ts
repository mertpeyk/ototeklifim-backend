import { env } from '../config.js';

type SmsPayload = {
  message: string;
  phone: string;
};

export type SmsSendResult = {
  delivered: boolean;
  provider: 'log' | 'twilio';
  providerMessageId?: string;
  providerStatus?: string;
};

function normalizeTurkishMobilePhone(phone: string) {
  const digits = String(phone || '').replace(/\D/g, '');
  const normalized = digits.startsWith('90') && digits.length === 12
    ? digits.slice(2)
    : digits.startsWith('0') && digits.length === 11
      ? digits.slice(1)
      : digits;

  if (!/^5\d{9}$/.test(normalized)) {
    throw new Error('SMS gönderilemedi: geçerli bir cep telefonu numarası bulunamadı.');
  }

  return `+90${normalized}`;
}

function twilioFailureMessage(status: number, payload: unknown) {
  const record = payload && typeof payload === 'object' && !Array.isArray(payload)
    ? payload as Record<string, unknown>
    : {};
  const code = typeof record.code === 'number' || typeof record.code === 'string'
    ? String(record.code)
    : String(status);
  const knownMessages: Record<string, string> = {
    '21211': 'Müşteri telefon numarası geçersiz.',
    '21408': 'Twilio hesabında Türkiye SMS gönderim izni kapalı.',
    '21606': 'Twilio gönderen numarası SMS için uygun değil.',
    '21610': 'Müşteri SMS almayı reddetmiş.',
    '21614': 'Girilen numara SMS alabilen bir cep telefonu değil.',
    '21617': 'SMS metni sağlayıcı sınırını aşıyor.',
  };

  return `SMS sağlayıcısı hatası (${code}): ${knownMessages[code] || 'Gönderim kabul edilmedi.'}`;
}

export async function sendSms({ message, phone }: SmsPayload): Promise<SmsSendResult> {
  const to = normalizeTurkishMobilePhone(phone);

  if (env.SMS_PROVIDER === 'twilio') {
    if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER) {
      throw new Error('Twilio SMS ayarlari eksik');
    }

    const body = new URLSearchParams({
      To: to,
      From: env.TWILIO_FROM_NUMBER,
      Body: message,
    });

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`,
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      },
    );

    const responsePayload = await response.json().catch(() => null) as Record<string, unknown> | null;

    if (!response.ok) {
      throw new Error(twilioFailureMessage(response.status, responsePayload));
    }

    const providerMessageId = typeof responsePayload?.sid === 'string' ? responsePayload.sid : undefined;
    const providerStatus = typeof responsePayload?.status === 'string' ? responsePayload.status : 'queued';

    return {
      delivered: true,
      provider: 'twilio',
      providerMessageId,
      providerStatus,
    };
  }

  console.info(`[sms:${env.SMS_SENDER_ID}] ${to} -> ${message}`);

  return {
    delivered: false,
    provider: 'log',
  };
}
