import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { prisma } from '../db.js';
import { requireAuth } from '../lib/auth.js';

const startConversationSchema = z.object({
  listingId: z.string().min(1),
  sellerId: z.string().min(1),
  body: z.string().min(1).max(2000),
});

const sendMessageSchema = z.object({
  body: z.string().min(1).max(2000),
});

export async function messageRoutes(app: FastifyInstance) {
  app.get('/me/conversations', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    return prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: authUser.id }, { sellerId: authUser.id }],
      },
      include: {
        listing: true,
        buyer: { select: { id: true, fullName: true, email: true } },
        seller: { select: { id: true, fullName: true, email: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    }).then((conversations) =>
      conversations.map((conversation) => ({
        ...conversation,
        counterpartyName:
            conversation.buyerId === authUser.id
              ? conversation.seller.fullName
              : conversation.buyer.fullName,
      })),
    );
  });

  app.post('/conversations', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    const payload = startConversationSchema.parse(request.body);

    const conversation = await prisma.conversation.upsert({
      where: {
        listingId_buyerId_sellerId: {
          listingId: payload.listingId,
          buyerId: authUser.id,
          sellerId: payload.sellerId,
        },
      },
      create: {
        listingId: payload.listingId,
        buyerId: authUser.id,
        sellerId: payload.sellerId,
        messages: {
          create: {
            body: payload.body,
            senderId: authUser.id,
          },
        },
      },
      update: {
        messages: {
          create: {
            body: payload.body,
            senderId: authUser.id,
          },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    reply.code(201);
    return conversation;
  });

  app.get('/conversations/:id/messages', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    const paramsSchema = z.object({ id: z.string().min(1) });
    const { id } = paramsSchema.parse(request.params);

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        OR: [{ buyerId: authUser.id }, { sellerId: authUser.id }],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      reply.code(404);
      return { message: 'Konusma bulunamadi' };
    }

    return conversation;
  });

  app.post('/conversations/:id/messages', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    const paramsSchema = z.object({ id: z.string().min(1) });
    const { id } = paramsSchema.parse(request.params);
    const payload = sendMessageSchema.parse(request.body);

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        OR: [{ buyerId: authUser.id }, { sellerId: authUser.id }],
      },
    });

    if (!conversation) {
      reply.code(404);
      return { message: 'Konusma bulunamadi' };
    }

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: authUser.id,
        body: payload.body,
      },
    });

    return message;
  });
}
