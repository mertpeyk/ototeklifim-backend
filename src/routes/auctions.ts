import type { FastifyInstance } from 'fastify';
import { AuctionStatus } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '../db.js';
import { requireAuth } from '../lib/auth.js';

const createAuctionSchema = z.object({
  listingId: z.string().min(1),
  startPrice: z.number().positive(),
  minIncrement: z.number().positive(),
  reservePrice: z.number().positive().optional(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
});

const bidSchema = z.object({
  bidderId: z.string().min(1),
  amount: z.number().positive(),
});

export async function auctionRoutes(app: FastifyInstance) {
  app.get('/auctions', async () => {
    return prisma.auction.findMany({
      where: {
        status: {
          in: [AuctionStatus.SCHEDULED, AuctionStatus.LIVE],
        },
      },
      include: {
        listing: true,
        bids: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: {
        endAt: 'asc',
      },
    });
  });

  app.post('/auctions', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    const payload = createAuctionSchema.parse(request.body);
    const listing = await prisma.listing.findUnique({
      where: {
        id: payload.listingId,
      },
    });

    if (!listing || listing.sellerId != authUser.id) {
      reply.code(403);
      return { message: 'Sadece kendi ilaniniz icin ihale acabilirsiniz' };
    }

    const auction = await prisma.auction.create({
      data: {
        ...payload,
        status:
            payload.startAt <= new Date() ? AuctionStatus.LIVE : AuctionStatus.SCHEDULED,
      },
    });

    reply.code(201);
    return auction;
  });

  app.post('/auctions/:id/bids', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    const paramsSchema = z.object({ id: z.string().min(1) });
    const { id } = paramsSchema.parse(request.params);
    const payload = bidSchema.omit({ bidderId: true }).parse(request.body);

    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        bids: {
          orderBy: { amount: 'desc' },
          take: 1,
        },
      },
    });

    if (!auction) {
      reply.code(404);
      return { message: 'Auction not found' };
    }

    const highestBid = auction.bids[0]?.amount ? Number(auction.bids[0].amount) : 0;
    const minNextBid = Math.max(
      Number(auction.startPrice),
      highestBid + Number(auction.minIncrement),
    );

    if (payload.amount < minNextBid) {
      reply.code(400);
      return { message: `Minimum teklif ${minNextBid} olmali` };
    }

    const bid = await prisma.bid.create({
      data: {
        auctionId: id,
        bidderId: authUser.id,
        amount: payload.amount,
      },
    });

    reply.code(201);
    return bid;
  });
}
