import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
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

type ImageVariant = 'gallery' | 'card' | 'thumb' | 'original';

function normalizeVariant(value: string): ImageVariant {
  if (value === 'original') return 'original';
  if (value === 'card') return 'card';
  if (value === 'thumb') return 'thumb';
  return 'gallery';
}

function canOptimize(contentType: string) {
  return /^image\/(?:jpe?g|png|webp|avif|heic|heif)$/i.test(contentType);
}

async function optimizeImage(content: Buffer, variant: Exclude<ImageVariant, 'original'>) {
  const { default: sharp } = await import('sharp');
  const image = sharp(content, { failOn: 'none' }).rotate();

  if (variant === 'thumb') {
    return image
      .resize({ width: 640, height: 480, fit: 'cover', position: 'centre', withoutEnlargement: true })
      .webp({ quality: 76, effort: 4 })
      .toBuffer();
  }

  if (variant === 'card') {
    return image
      .resize({ width: 800, height: 600, fit: 'cover', position: 'centre', withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();
  }

  return image
    .resize({ width: 1600, height: 1200, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84, effort: 4 })
    .toBuffer();
}

async function sendUploadedImage(
  reply: FastifyReply,
  content: Buffer,
  contentType: string,
  variant: ImageVariant,
) {
  reply.header('Cache-Control', 'public, max-age=31536000, immutable');
  reply.header('Vary', 'Accept');

  if (variant === 'original' || !canOptimize(contentType)) {
    reply.type(contentType || 'application/octet-stream');
    return reply.send(content);
  }

  try {
    const optimized = await optimizeImage(content, variant);
    reply.type('image/webp');
    return reply.send(optimized);
  } catch (error) {
    // A damaged or unsupported upload must remain viewable instead of turning
    // an existing listing image into a 500 response.
    reply.type(contentType || 'application/octet-stream');
    return reply.send(content);
  }
}

export async function publicUploadRoutes(app: FastifyInstance) {
  app.get('/uploads/:filename', async (request, reply) => {
    const filename = String((request.params as { filename?: string }).filename || '').trim();
    const variant = normalizeVariant(String((request.query as { variant?: string })?.variant || '').trim().toLowerCase());

    if (!filename) {
      reply.code(400);
      return { message: 'Dosya adi bulunamadi' };
    }

    const uploadedImage = await prisma.uploadedImage.findUnique({
      where: { filename },
    });

    if (uploadedImage) {
      return sendUploadedImage(reply, Buffer.from(uploadedImage.content), uploadedImage.contentType, variant);
    }

    const localPath = path.join(uploadDir, filename);
    if (existsSync(localPath)) {
      const content = readFileSync(localPath);
      const extension = path.extname(filename).toLowerCase();
      const contentType = extension === '.png' ? 'image/png'
        : extension === '.webp' ? 'image/webp'
          : extension === '.avif' ? 'image/avif'
            : 'image/jpeg';
      return sendUploadedImage(reply, content, contentType, variant);
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
      variants: {
        gallery: getUploadPublicUrl(request, safeName),
        card: `${getUploadPublicUrl(request, safeName)}?variant=card`,
        thumb: `${getUploadPublicUrl(request, safeName)}?variant=thumb`,
        original: `${getUploadPublicUrl(request, safeName)}?variant=original`,
      },
      filename: safeName,
    };
  });
}
