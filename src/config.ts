import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(3001),
  SMS_PROVIDER: z.enum(['log', 'twilio']).default('log'),
  SMS_SENDER_ID: z.string().default('OtoTeklifim'),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),
  ADMIN_EMAIL: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_FULL_NAME: z.string().optional(),
  ADMIN_PHONE: z.string().optional(),
  ADMIN_CITY: z.string().optional(),
  ADMIN_DISTRICT: z.string().optional(),
});

export const env = envSchema.parse(process.env);
