import type { FastifyInstance } from 'fastify';
import { smsConfiguration } from '../config.js';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    return {
      ok: true,
      service: 'OtoTeklifim API',
      sms: smsConfiguration,
      now: new Date().toISOString(),
    };
  });
}
