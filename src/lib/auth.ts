import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AccountType } from '@prisma/client';

import { prisma } from '../db.js';

const SESSION_TTL_DAYS = 30;

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  accountType: AccountType;
  phone?: string | null;
  city?: string | null;
  district?: string | null;
};

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, expectedHash] = storedHash.split(':');

  if (!salt || !expectedHash) {
    return false;
  }

  const incoming = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, 'hex');

  return incoming.length === expected.length && timingSafeEqual(incoming, expected);
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string) {
  const rawToken = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_TTL_DAYS);

  await prisma.authSession.create({
    data: {
      userId,
      tokenHash: hashToken(rawToken),
      expiresAt,
    },
  });

  return rawToken;
}

export async function resolveAuthUser(request: FastifyRequest) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  const rawToken = authorization.slice('Bearer '.length).trim();

  if (!rawToken) {
    return null;
  }

  const session = await prisma.authSession.findUnique({
    where: {
      tokenHash: hashToken(rawToken),
    },
    include: {
      user: true,
    },
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date()) {
    return null;
  }

  await prisma.authSession.update({
    where: {
      id: session.id,
    },
    data: {
      lastUsedAt: new Date(),
    },
  });

  return {
    id: session.user.id,
    email: session.user.email,
    fullName: session.user.fullName,
    accountType: session.user.accountType,
    phone: session.user.phone,
    city: session.user.city,
    district: session.user.district,
  } satisfies AuthUser;
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const user = await resolveAuthUser(request);

  if (!user) {
    reply.code(401);
    return reply.send({ message: 'Unauthorized' });
  }

  request.authUser = user;
  return user;
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  const user = await requireAuth(request, reply);

  if (!user || user.accountType !== 'ADMIN') {
    if (!reply.sent) {
      reply.code(403);
      return reply.send({ message: 'Admin yetkisi gerekiyor' });
    }

    return null;
  }

  return user;
}
