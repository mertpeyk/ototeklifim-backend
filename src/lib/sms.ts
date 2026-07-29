import { env } from '../config.js';

type SmsPayload = {
  message: string;
  phone: string;
};

export type SmsSendResult = {
  delivered: boolean;
  provider: 'log' | 'twilio';
};

export async function sendSms({ message, phone }: SmsPayload): Promise<SmsSendResult> {
  if (env.SMS_PROVIDER === 'twilio') {
    if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER) {
      throw new Error('Twilio SMS ayarlari eksik');
    }

    const body = new URLSearchParams({
      To: `+90${phone}`,
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

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Twilio SMS gonderimi basarisiz: ${details}`);
    }

    return {
      delivered: true,
      provider: 'twilio',
    };
  }

  console.info(`[sms:${env.SMS_SENDER_ID}] +90${phone} -> ${message}`);

  return {
    delivered: false,
    provider: 'log',
  };
}
