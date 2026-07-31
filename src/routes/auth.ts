import type { FastifyInstance } from 'fastify';
import { AccountType, AuthOtpPurpose } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '../db.js';
import {
  createSession,
  hashPassword,
  hashToken,
  requireAuth,
  verifyPassword,
} from '../lib/auth.js';
import { env } from '../config.js';
import { sendSms } from '../lib/sms.js';

const OTP_TTL_MINUTES = 10;
const OTP_RESEND_COOLDOWN_MS = 60_000;
const OTP_MAX_ATTEMPTS = 5;

const registerSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().optional(),
    password: z.string().min(6),
    phone: z.string().min(10),
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

    if (!payload.email?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['email'],
        message: 'Bu alan zorunludur',
      });
    } else if (!z.email().safeParse(payload.email.trim().toLowerCase()).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['email'],
        message: 'Gecerli bir e-posta adresi girin',
      });
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

const verifyOtpSchema = z.object({
  challengeId: z.string().min(1),
  code: z.string().length(6).regex(/^\d+$/),
});

const forgotPasswordRequestSchema = z.object({
  phone: z.string().min(10),
});

const passwordResetConfirmSchema = verifyOtpSchema.extend({
  password: z.string().min(6),
});

const changePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
  })
  .refine((payload) => payload.currentPassword !== payload.newPassword, {
    message: 'Yeni sifre mevcut sifre ile ayni olamaz',
    path: ['newPassword'],
  });

type PendingRegistrationPayload = {
  accountType: AccountType;
  address?: string;
  authorizedFirstName?: string;
  authorizedLastName?: string;
  city?: string;
  companyName?: string;
  district?: string;
  documentConfirmed: boolean;
  email: string;
  fullName: string;
  listingVolume?: string;
  packagePlan?: string;
  passwordHash: string;
  phone: string;
  taxNumber?: string;
  taxOffice?: string;
};

const INTERNAL_OPTIONAL_EMAIL_DOMAIN = 'users.ototeklifim.local';

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

function normalizeEmail(email?: string | null) {
  const value = email?.trim().toLowerCase();
  return value ? value : undefined;
}

function buildOptionalEmailPlaceholder(phone: string) {
  return `user-${phone}@${INTERNAL_OPTIONAL_EMAIL_DOMAIN}`;
}

function isOptionalEmailPlaceholder(email?: string | null) {
  return Boolean(email && email.endsWith(`@${INTERNAL_OPTIONAL_EMAIL_DOMAIN}`));
}

function maskPhone(phone: string) {
  if (phone.length < 4) {
    return phone;
  }

  return `0${phone.slice(0, 3)} *** ** ${phone.slice(-2)}`;
}

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function otpHash(code: string) {
  return hashToken(`otp:${code}`);
}

function expiresAtFromNow() {
  return new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
}

function buildSmsMessage(code: string) {
  return `OtoTeklifim dogrulama kodunuz: ${code}. Kod ${OTP_TTL_MINUTES} dakika gecerlidir.`;
}

function authPayloadFromUser(user: {
  id: string;
  fullName: string;
  email: string;
  accountType: AccountType;
  phone: string | null;
  city: string | null;
  district: string | null;
}) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: isOptionalEmailPlaceholder(user.email) ? '' : user.email,
    accountType: user.accountType,
    phone: user.phone,
    city: user.city,
    district: user.district,
  };
}

async function ensureUniqueIdentity(email: string | undefined, phone: string) {
  const orConditions = [{ phone }] as Array<{ phone?: string; email?: string }>;
  if (email) {
    orConditions.push({ email });
  }

  const exists = await prisma.user.findFirst({
    where: {
      OR: orConditions,
    },
  });

  if (exists) {
    throw new Error('Bu e-posta veya telefon zaten kayitli');
  }
}

async function createOtpChallenge(input: {
  pendingPasswordHash?: string;
  pendingRegistration?: PendingRegistrationPayload;
  phone: string;
  purpose: AuthOtpPurpose;
  userId?: string;
}) {
  const recentChallenge = await prisma.authOtpChallenge.findFirst({
    where: {
      phone: input.phone,
      purpose: input.purpose,
      consumedAt: null,
      createdAt: {
        gte: new Date(Date.now() - OTP_RESEND_COOLDOWN_MS),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (recentChallenge) {
    throw new Error('Lutfen yeni kod istemeden once 1 dakika bekleyin');
  }

  const code = generateOtpCode();
  const smsMessage = buildSmsMessage(code);
  const delivery = await sendSms({
    phone: input.phone,
    message: smsMessage,
  });

  const challenge = await prisma.authOtpChallenge.create({
    data: {
      userId: input.userId,
      purpose: input.purpose,
      phone: input.phone,
      codeHash: otpHash(code),
      expiresAt: expiresAtFromNow(),
      pendingRegistration: input.pendingRegistration,
      pendingPasswordHash: input.pendingPasswordHash,
    },
  });

  return {
    challenge,
    code: env.SMS_PROVIDER === 'twilio' ? undefined : code,
    provider: delivery.provider,
  };
}

async function verifyOtpChallenge(input: {
  challengeId: string;
  code: string;
  purpose: AuthOtpPurpose;
}) {
  const challenge = await prisma.authOtpChallenge.findUnique({
    where: {
      id: input.challengeId,
    },
  });

  if (!challenge || challenge.purpose !== input.purpose) {
    throw new Error('Dogrulama kaydi bulunamadi');
  }

  if (challenge.consumedAt) {
    throw new Error('Bu kod daha once kullanilmis');
  }

  if (challenge.expiresAt <= new Date()) {
    throw new Error('Kodun suresi dolmus');
  }

  if (challenge.attemptCount >= OTP_MAX_ATTEMPTS) {
    throw new Error('Cok fazla hatali deneme yaptiniz');
  }

  if (challenge.codeHash !== otpHash(input.code)) {
    await prisma.authOtpChallenge.update({
      where: {
        id: challenge.id,
      },
      data: {
        attemptCount: {
          increment: 1,
        },
      },
    });

    throw new Error('Kod hatali');
  }

  return prisma.authOtpChallenge.update({
    where: {
      id: challenge.id,
    },
    data: {
      consumedAt: new Date(),
    },
  });
}

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request, reply) => {
    const payload = registerSchema.parse(request.body);
    const normalizedPhone = normalizePhone(payload.phone);

    if (!normalizedPhone || normalizedPhone.length !== 10) {
      reply.code(400);
      return { message: 'Gecerli bir telefon numarasi girin' };
    }

    const normalizedEmail = normalizeEmail(payload.email);
    const resolvedEmail = normalizedEmail ?? buildOptionalEmailPlaceholder(normalizedPhone);

    const exists = await prisma.user.findFirst({
      where: {
        OR: normalizedEmail
          ? [{ email: normalizedEmail }, { phone: normalizedPhone }]
          : [{ phone: normalizedPhone }],
      },
    });

    if (exists) {
      reply.code(409);
      return { message: 'Bu e-posta veya telefon zaten kayitli' };
    }

    const user = await prisma.user.create({
      data: {
        fullName: payload.fullName.trim(),
        email: resolvedEmail,
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
        verifiedAt: new Date(),
      },
    });

    const token = await createSession(user.id);

    reply.code(201);
    return {
      token,
      user: authPayloadFromUser(user),
    };
  });

  app.post('/auth/register/request-phone-verification', async (request, reply) => {
    const payload = registerSchema.parse(request.body);
    const normalizedPhone = normalizePhone(payload.phone);

    if (!normalizedPhone || normalizedPhone.length !== 10) {
      reply.code(400);
      return { message: 'Gecerli bir telefon numarasi girin' };
    }

    const normalizedEmail = normalizeEmail(payload.email);
    const resolvedEmail = normalizedEmail ?? buildOptionalEmailPlaceholder(normalizedPhone);

    try {
      await ensureUniqueIdentity(normalizedEmail, normalizedPhone);

      const pendingRegistration: PendingRegistrationPayload = {
        fullName: payload.fullName.trim(),
        email: resolvedEmail,
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
      };

      const { challenge, code } = await createOtpChallenge({
        phone: normalizedPhone,
        purpose: AuthOtpPurpose.SIGNUP_VERIFY,
        pendingRegistration,
      });

      reply.code(201);
      return {
        challengeId: challenge.id,
        phone: maskPhone(normalizedPhone),
        expiresInSeconds: OTP_TTL_MINUTES * 60,
        debugCode: code,
      };
    } catch (error) {
      reply.code(error instanceof Error && error.message.includes('1 dakika') ? 429 : 409);
      return { message: error instanceof Error ? error.message : 'Kayit baslatilamadi' };
    }
  });

  app.post('/auth/register/verify-phone', async (request, reply) => {
    const payload = verifyOtpSchema.parse(request.body);

    try {
      const challenge = await verifyOtpChallenge({
        challengeId: payload.challengeId,
        code: payload.code,
        purpose: AuthOtpPurpose.SIGNUP_VERIFY,
      });

      const pendingRegistration = challenge.pendingRegistration as PendingRegistrationPayload | null;

      if (!pendingRegistration) {
        reply.code(400);
        return { message: 'Kayit bilgileri bulunamadi' };
      }

      await ensureUniqueIdentity(pendingRegistration.email, pendingRegistration.phone);

      const user = await prisma.user.create({
        data: {
          fullName: pendingRegistration.fullName,
          email: pendingRegistration.email,
          phone: pendingRegistration.phone,
          city: pendingRegistration.city,
          district: pendingRegistration.district,
          address: pendingRegistration.address,
          companyName: pendingRegistration.companyName,
          taxOffice: pendingRegistration.taxOffice,
          taxNumber: pendingRegistration.taxNumber,
          listingVolume: pendingRegistration.listingVolume,
          packagePlan: pendingRegistration.packagePlan,
          authorizedFirstName: pendingRegistration.authorizedFirstName,
          authorizedLastName: pendingRegistration.authorizedLastName,
          documentConfirmed: pendingRegistration.documentConfirmed,
          accountType: pendingRegistration.accountType,
          passwordHash: pendingRegistration.passwordHash,
          verifiedAt: new Date(),
        },
      });

      const token = await createSession(user.id);

      return {
        token,
        user: authPayloadFromUser(user),
      };
    } catch (error) {
      reply.code(400);
      return { message: error instanceof Error ? error.message : 'Telefon dogrulanamadi' };
    }
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
      user: authPayloadFromUser(user),
    };
  });

  app.post('/auth/password-reset/request', async (request, reply) => {
    const payload = forgotPasswordRequestSchema.parse(request.body);
    const normalizedPhone = normalizePhone(payload.phone);

    if (!normalizedPhone || normalizedPhone.length !== 10) {
      reply.code(400);
      return { message: 'Gecerli bir telefon numarasi girin' };
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ phone: normalizedPhone }, { phone: `0${normalizedPhone}` }],
      },
    });

    if (!user) {
      reply.code(404);
      return { message: 'Bu telefon numarasi ile eslesen bir hesap bulunamadi' };
    }

    try {
      const { challenge, code } = await createOtpChallenge({
        phone: normalizedPhone,
        purpose: AuthOtpPurpose.PASSWORD_RESET,
        userId: user.id,
      });

      reply.code(201);
      return {
        challengeId: challenge.id,
        phone: maskPhone(normalizedPhone),
        expiresInSeconds: OTP_TTL_MINUTES * 60,
        debugCode: code,
      };
    } catch (error) {
      reply.code(error instanceof Error && error.message.includes('1 dakika') ? 429 : 400);
      return { message: error instanceof Error ? error.message : 'Sifirlama kodu gonderilemedi' };
    }
  });

  app.post('/auth/password-reset/confirm', async (request, reply) => {
    const payload = passwordResetConfirmSchema.parse(request.body);

    try {
      const challenge = await verifyOtpChallenge({
        challengeId: payload.challengeId,
        code: payload.code,
        purpose: AuthOtpPurpose.PASSWORD_RESET,
      });

      if (!challenge.userId) {
        reply.code(400);
        return { message: 'Sifre sifirlama kaydi gecersiz' };
      }

      await prisma.user.update({
        where: {
          id: challenge.userId,
        },
        data: {
          passwordHash: hashPassword(payload.password),
        },
      });

      await prisma.authSession.updateMany({
        where: {
          userId: challenge.userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      return { message: 'Sifreniz guncellendi' };
    } catch (error) {
      reply.code(400);
      return { message: error instanceof Error ? error.message : 'Sifre guncellenemedi' };
    }
  });

  app.post('/auth/password-change/request', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    const payload = changePasswordRequestSchema.parse(request.body);
    const user = await prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
    });

    if (!user || !verifyPassword(payload.currentPassword, user.passwordHash)) {
      reply.code(400);
      return { message: 'Mevcut sifreniz hatali' };
    }

    const normalizedPhone = normalizePhone(user.phone);

    if (!normalizedPhone || normalizedPhone.length !== 10) {
      reply.code(400);
      return { message: 'Hesabinizda dogrulanabilir bir telefon numarasi yok' };
    }

    try {
      const { challenge, code } = await createOtpChallenge({
        phone: normalizedPhone,
        purpose: AuthOtpPurpose.PASSWORD_CHANGE,
        userId: user.id,
        pendingPasswordHash: hashPassword(payload.newPassword),
      });

      reply.code(201);
      return {
        challengeId: challenge.id,
        phone: maskPhone(normalizedPhone),
        expiresInSeconds: OTP_TTL_MINUTES * 60,
        debugCode: code,
      };
    } catch (error) {
      reply.code(error instanceof Error && error.message.includes('1 dakika') ? 429 : 400);
      return { message: error instanceof Error ? error.message : 'Dogrulama kodu gonderilemedi' };
    }
  });

  app.post('/auth/password-change/confirm', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    const payload = verifyOtpSchema.parse(request.body);

    try {
      const challenge = await verifyOtpChallenge({
        challengeId: payload.challengeId,
        code: payload.code,
        purpose: AuthOtpPurpose.PASSWORD_CHANGE,
      });

      if (challenge.userId !== authUser.id || !challenge.pendingPasswordHash) {
        reply.code(400);
        return { message: 'Sifre degistirme kaydi gecersiz' };
      }

      await prisma.user.update({
        where: {
          id: authUser.id,
        },
        data: {
          passwordHash: challenge.pendingPasswordHash,
        },
      });

      await prisma.authSession.updateMany({
        where: {
          userId: authUser.id,
          revokedAt: null,
          tokenHash: {
            not: request.headers.authorization?.startsWith('Bearer ')
              ? hashToken(request.headers.authorization.slice('Bearer '.length).trim())
              : undefined,
          },
        },
        data: {
          revokedAt: new Date(),
        },
      });

      return { message: 'Sifreniz basariyla degistirildi' };
    } catch (error) {
      reply.code(400);
      return { message: error instanceof Error ? error.message : 'Sifre degistirilemedi' };
    }
  });

  app.get('/auth/me', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    return { user: authUser };
  });
}
