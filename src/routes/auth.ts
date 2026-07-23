import type { FastifyInstance } from 'fastify';
import { AccountType } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '../db.js';
import { createSession, hashPassword, requireAuth, verifyPassword } from '../lib/auth.js';

const registerSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.email(),
    password: z.string().min(8),
    phone: z.string().min(10).optional(),
    city: z.string().min(2).optional(),
    district: z.string().min(2).optional(),
    address: z.string().min(10).optional(),
    companyName: z.string().min(2).optional(),
    taxOffice: z.string().min(2).optional(),
    taxNumber: z.string().min(10).optional(),
    listingVolume: z.string().min(1).optional(),
    packagePlan: z.string().min(1).optional(),
    authorizedFirstName: z.string().min(2).optional(),
    authorizedLastName: z.string().min(2).optional(),
    documentConfirmation: z.boolean().optional(),
    accountType: z.enum(AccountType).default(AccountType.INDIVIDUAL),
  })
  .superRefine((payload, ctx) => {
    if (payload.accountType !== AccountType.CORPORATE) {
      return;
    }

    const requiredCorporateFields = [
      ['companyName', payload.companyName],
      ['taxOffice', payload.taxOffice],
      ['taxNumber', payload.taxNumber],
      ['city', payload.city],
      ['district', payload.district],
      ['address', payload.address],
      ['listingVolume', payload.listingVolume],
      ['packagePlan', payload.packagePlan],
      ['authorizedFirstName', payload.authorizedFirstName],
      ['authorizedLastName', payload.authorizedLastName],
    ] as const;

    for (const [field, value] of requiredCorporateFields) {
      if (!value) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: 'Bu alan zorunludur',
        });
      }
    }

    if (!payload.documentConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['documentConfirmation'],
        message: 'Belge onayı gereklidir',
      });
    }
  });

const loginSchema = z.object({
  identity: z.string().min(3),
  password: z.string().min(6),
});

function normalizePhone(phone?: string | null) {
  if (!phone) {
    return undefined;
  }

  const digits = phone.replace(/\D/g, '');

  if (digits.startsWith('90') && digits.length >= 12) {
    return digits.slice(2);
  }

  if (digits.startsWith('0') && digits.length >= 11) {
    return digits.slice(1);
  }

  return digits;
}

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request, reply) => {
    const payload = registerSchema.parse(request.body);
    const normalizedEmail = payload.email.trim().toLowerCase();
    const normalizedPhone = normalizePhone(payload.phone);

    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          normalizedPhone ? { phone: normalizedPhone } : undefined,
        ].filter(Boolean) as Array<{ email?: string; phone?: string }>,
      },
    });

    if (exists) {
      reply.code(409);
      return { message: 'Bu e-posta veya telefon zaten kayitli' };
    }

    const user = await prisma.user.create({
      data: {
        fullName: payload.fullName.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        city: payload.city?.trim(),
        district: payload.district?.trim(),
        address: payload.address?.trim(),
        companyName: payload.companyName?.trim(),
        taxOffice: payload.taxOffice?.trim(),
        taxNumber: payload.taxNumber?.trim(),
        listingVolume: payload.listingVolume,
        packagePlan: payload.packagePlan,
        authorizedFirstName: payload.authorizedFirstName?.trim(),
        authorizedLastName: payload.authorizedLastName?.trim(),
        documentConfirmed: payload.documentConfirmation ?? false,
        accountType: payload.accountType,
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
    const phoneIdentity = normalizePhone(normalizedIdentity);
    const phoneIdentityWithZero = phoneIdentity ? `0${phoneIdentity}` : undefined;
    const identityMatchers = [
      { email: normalizedIdentity },
      ...(phoneIdentity ? [{ phone: phoneIdentity }] : []),
      ...(phoneIdentityWithZero ? [{ phone: phoneIdentityWithZero }] : []),
    ];

    const user = await prisma.user.findFirst({
      where: {
        OR: identityMatchers,
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
