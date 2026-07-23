import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { prisma } from '../db.js';
import { requireAuth } from '../lib/auth.js';

export async function favoriteRoutes(app: FastifyInstance) {
  app.get('/me/favorites', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    return prisma.favorite.findMany({
      where: { userId: authUser.id },
      include: {
        listing: {
          include: {
            images: true,
            auction: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  });

  app.post('/listings/:id/favorite', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    const paramsSchema = z.object({ id: z.string().min(1) });
    const { id } = paramsSchema.parse(request.params);

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: authUser.id,
          listingId: id,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    }

    await prisma.favorite.create({
      data: {
        userId: authUser.id,
        listingId: id,
      },
    });

    return { favorited: true };
  });
}
