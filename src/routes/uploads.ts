import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import type { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '../db.js';

const uploadDir = path.resolve(process.cwd(), 'uploads');

mkdirSync(uploadDir, { recursive: true });

function getUploadPublicUrl(request: FastifyRequest, fileName: string) {
  const forwardedProto = request.headers['x-forwarded-proto'];
  const protocol = typeof forwardedProto === 'string' ? forwardedProto.split(',')[0]?.trim() : request.protocol;
  const host = request.headers['x-forwarded-host'] ?? request.headers.host ?? request.hostname;
  const origin = `${protocol || 'https'}://${host}`;
  return `${origin}/uploads/${fileName}`;
}

export async function publicUploadRoutes(app: FastifyInstance) {
  app.get('/uploads/:filename', async (request, reply) => {
    const filename = String((request.params as { filename?: string }).filename || '').trim();

    if (!filename) {
      reply.code(400);
      return { message: 'Dosya adi bulunamadi' };
    }

    const uploadedImage = await prisma.uploadedImage.findUnique({
      where: { filename },
    });

    if (uploadedImage) {
      reply.header('Cache-Control', 'public, max-age=31536000, immutable');
      reply.type(uploadedImage.contentType);
      return reply.send(Buffer.from(uploadedImage.content));
    }

    const localPath = path.join(uploadDir, filename);
    if (existsSync(localPath)) {
      reply.header('Cache-Control', 'public, max-age=31536000, immutable');
      return reply.send(readFileSync(localPath));
    }

    reply.code(404);
    return { message: 'Dosya bulunamadi' };
  });

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
    const fileBuffer = await file.toBuffer();

    await prisma.uploadedImage.upsert({
      where: { filename: safeName },
      update: {
        originalName: file.filename,
        contentType: file.mimetype,
        content: fileBuffer,
      },
      create: {
        filename: safeName,
        originalName: file.filename,
        contentType: file.mimetype,
        content: fileBuffer,
      },
    });

    writeFileSync(targetPath, fileBuffer);

    return {
      url: getUploadPublicUrl(request, safeName),
      filename: safeName,
    };
  });
}
