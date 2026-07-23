import type { FastifyInstance } from 'fastify';
import { ListingStatus } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '../db.js';
import { requireAdmin } from '../lib/auth.js';

const updateListingStatusSchema = z.object({
  status: z.enum(ListingStatus),
  moderationNote: z.string().max(300).optional(),
});

export async function adminRoutes(app: FastifyInstance) {
  app.get('/admin/dashboard', async (request, reply) => {
    const admin = await requireAdmin(request, reply);

    if (!admin) {
      return;
    }

    const [users, listings, pendingListings, liveAuctions] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: ListingStatus.PENDING_REVIEW } }),
      prisma.auction.count({ where: { status: 'LIVE' } }),
    ]);

    return {
      users,
      listings,
      pendingListings,
      liveAuctions,
    };
  });

  app.get('/admin/listings/pending', async (request, reply) => {
    const admin = await requireAdmin(request, reply);

    if (!admin) {
      return;
    }

    return prisma.listing.findMany({
      where: {
        status: ListingStatus.PENDING_REVIEW,
      },
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        images: true,
        auction: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  });

  app.post('/admin/listings/:id/status', async (request, reply) => {
    const admin = await requireAdmin(request, reply);

    if (!admin) {
      return;
    }

    const paramsSchema = z.object({ id: z.string().min(1) });
    const { id } = paramsSchema.parse(request.params);
    const payload = updateListingStatusSchema.parse(request.body);

    const listing = await prisma.listing.update({
      where: { id },
      data: {
        status: payload.status,
        moderationNote: payload.moderationNote ?? '',
        publishedAt:
          payload.status === ListingStatus.ACTIVE ? new Date() : undefined,
      },
    });

    return listing;
  });
}
