import { env } from '../config.js';

type WhatsAppPayload = {
  message: string;
  phone: string;
};

export type WhatsAppSendResult = {
  delivered: boolean;
  provider: 'log' | 'twilio';
};

export function normalizeTurkeyPhone(phone?: string | null) {
  if (!phone) {
    return undefined;
  }

  const digits = phone.replace(/\D/g, '');

  if (digits.startsWith('90') && digits.length >= 12) {
    return digits.slice(2);
  }

  if (digits.startsWith('0') && digits.length >= 11) {
    return digits.slice(1);
  }

  return digits || undefined;
}

export async function sendWhatsapp({ message, phone }: WhatsAppPayload): Promise<WhatsAppSendResult> {
  const normalizedPhone = normalizeTurkeyPhone(phone);

  if (!normalizedPhone) {
    throw new Error('WhatsApp hedef telefonu gecersiz');
  }

  if (env.SMS_PROVIDER === 'twilio') {
    const fromNumber = env.TWILIO_WHATSAPP_FROM_NUMBER || env.TWILIO_FROM_NUMBER;

    if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !fromNumber) {
      throw new Error('Twilio WhatsApp ayarlari eksik');
    }

    const fromValue = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`;
    const toValue = `whatsapp:+90${normalizedPhone}`;
    const body = new URLSearchParams({
      To: toValue,
      From: fromValue,
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

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Twilio WhatsApp gonderimi basarisiz: ${details}`);
    }

    return {
      delivered: true,
      provider: 'twilio',
    };
  }

  console.info(`[whatsapp] +90${normalizedPhone} -> ${message}`);

  return {
    delivered: false,
    provider: 'log',
  };
}
