import { createWriteStream, mkdirSync } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

import type { FastifyInstance } from 'fastify';

import { requireAuth } from '../lib/auth.js';

const uploadDir = path.resolve(process.cwd(), 'uploads');

mkdirSync(uploadDir, { recursive: true });

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/uploads/images', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    const file = await request.file();

    if (!file) {
      reply.code(400);
      return { message: 'Dosya bulunamadi' };
    }

    const safeName = `${Date.now()}-${file.filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const targetPath = path.join(uploadDir, safeName);

    await pipeline(file.file, createWriteStream(targetPath));

    return {
      url: `/uploads/${safeName}`,
      filename: safeName,
    };
  });
}
