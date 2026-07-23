import type { FastifyInstance } from 'fastify';
import { AccountType } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '../db.js';
import { createSession, hashPassword, requireAuth, verifyPassword } from '../lib/auth.js';

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  phone: z.string().min(10).optional(),
  city: z.string().min(2).optional(),
  accountType: z.enum(AccountType).default(AccountType.INDIVIDUAL),
});

const loginSchema = z.object({
  identity: z.string().min(3),
  password: z.string().min(6),
});

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request, reply) => {
    const payload = registerSchema.parse(request.body);

    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          { email: payload.email },
          payload.phone ? { phone: payload.phone } : undefined,
        ].filter(Boolean) as Array<{ email?: string; phone?: string }>,
      },
    });

    if (exists) {
      reply.code(409);
      return { message: 'Bu e-posta veya telefon zaten kayitli' };
    }

    const user = await prisma.user.create({
      data: {
        ...payload,
        passwordHash: hashPassword(payload.password),
      },
    });

    const token = await createSession(user.id);

    reply.code(201);
    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        accountType: user.accountType,
      },
    };
  });

  app.post('/auth/login', async (request, reply) => {
    const payload = loginSchema.parse(request.body);

    const normalizedIdentity = payload.identity.trim().toLowerCase();
    const phoneIdentity = normalizedIdentity.replace(/^\+?90/, '').replace(/\D/g, '');

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedIdentity },
          { phone: phoneIdentity },
        ],
      },
    });

    if (!user || !verifyPassword(payload.password, user.passwordHash)) {
      reply.code(401);
      return { message: 'E-posta veya sifre hatali' };
    }

    const token = await createSession(user.id);

    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        accountType: user.accountType,
      },
    };
  });

  app.get('/auth/me', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    return { user: authUser };
  });
}
