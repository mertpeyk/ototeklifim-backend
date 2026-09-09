import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(3001),
  SMS_PROVIDER: z.enum(['log', 'twilio']).optional(),
  SMS_SENDER_ID: z.string().default('OtoTeklifim'),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),
  TWILIO_VERIFY_SERVICE_SID: z.string().optional(),
  TWILIO_WHATSAPP_FROM_NUMBER: z.string().optional(),
  WHATSAPP_ALERT_PHONE: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_ALERT_CHAT_ID: z.string().optional(),
  ADMIN_EMAIL: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_FULL_NAME: z.string().optional(),
  ADMIN_PHONE: z.string().optional(),
  ADMIN_CITY: z.string().optional(),
  ADMIN_DISTRICT: z.string().optional(),
});

const parsedEnv = envSchema.parse(process.env);
const normalizedBrandSender = parsedEnv.SMS_SENDER_ID
  .replace(/[^A-Za-z0-9]/g, '')
  .slice(0, 11);
const twilioSmsSender = /[A-Za-z]/.test(normalizedBrandSender)
  ? normalizedBrandSender
  : 'OtoTeklifim';
const hasTwilioSmsCredentials = Boolean(
  parsedEnv.TWILIO_ACCOUNT_SID &&
  parsedEnv.TWILIO_AUTH_TOKEN &&
  twilioSmsSender,
);
const hasTwilioVerifyCredentials = Boolean(
  parsedEnv.TWILIO_ACCOUNT_SID &&
  parsedEnv.TWILIO_AUTH_TOKEN &&
  parsedEnv.TWILIO_VERIFY_SERVICE_SID,
);

export const env = {
  ...parsedEnv,
  // Railway'de Twilio bilgileri mevcutken SMS_PROVIDER unutulursa sessizce
  // log moduna düşmek gerçek SMS gönderimini engelliyordu.
  SMS_PROVIDER: parsedEnv.SMS_PROVIDER === 'twilio' || hasTwilioSmsCredentials
    ? 'twilio' as const
    : 'log' as const,
  TWILIO_SMS_SENDER: twilioSmsSender,
};

export const smsConfiguration = {
  configured: hasTwilioSmsCredentials,
  provider: env.SMS_PROVIDER,
  senderType: twilioSmsSender?.startsWith('+') ? 'numeric' : 'alphanumeric',
  twilioVerifyConfigured: hasTwilioVerifyCredentials,
};
