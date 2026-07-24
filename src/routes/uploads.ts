import { createWriteStream, mkdirSync } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

import type { FastifyInstance, FastifyRequest } from 'fastify';

const uploadDir = path.resolve(process.cwd(), 'uploads');

mkdirSync(uploadDir, { recursive: true });

function getUploadPublicUrl(request: FastifyRequest, fileName: string) {
  const forwardedProto = request.headers['x-forwarded-proto'];
  const protocol = typeof forwardedProto === 'string' ? forwardedProto.split(',')[0]?.trim() : request.protocol;
  const host = request.headers['x-forwarded-host'] ?? request.headers.host ?? request.hostname;
  const origin = `${protocol || 'https'}://${host}`;
  return `${origin}/uploads/${fileName}`;
}

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/uploads/images', async (request, reply) => {
    const file = await request.file();

    if (!file) {
      reply.code(400);
      return { message: 'Dosya bulunamadi' };
    }

    const safeName = `${Date.now()}-${file.filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const targetPath = path.join(uploadDir, safeName);

    await pipeline(file.file, createWriteStream(targetPath));

    return {
      url: getUploadPublicUrl(request, safeName),
      filename: safeName,
    };
  });
}
