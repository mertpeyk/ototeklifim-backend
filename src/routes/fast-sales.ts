import { randomUUID } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import { AccountType, FastSaleStatus } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '../db.js';
import { hashPassword, requireAuth, resolveAuthUser } from '../lib/auth.js';
import { notifyNewApplicationViaTelegram, notifyNewApplicationViaWhatsapp } from '../lib/admin-alerts.js';

const statusValues = [
  FastSaleStatus.NEW,
  FastSaleStatus.UNDER_REVIEW,
  FastSaleStatus.APPROVED,
  FastSaleStatus.OFFER_SENT,
  FastSaleStatus.COUNTER_OFFER_RECEIVED,
  FastSaleStatus.ACCEPTED,
  FastSaleStatus.REJECTED,
  FastSaleStatus.EXPIRED,
  FastSaleStatus.CANCELLED,
] as const;

const vehicleInfoSchema = z.object({
  vehicleType: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  packageName: z.string().min(1),
  year: z.number().int().min(1950).max(2100),
  mileage: z.number().int().min(0),
  fuelType: z.string().min(1),
  transmission: z.string().min(1),
  bodyType: z.string().min(1),
  engineVolume: z.string().min(1),
  enginePower: z.string().optional().default(''),
  color: z.string().min(1),
  city: z.string().min(1),
  district: z.string().optional().default(''),
});

const damagePartSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  status: z.enum(['Orijinal', 'Lokal Boyali', 'Boyali', 'Onarimli', 'Degisen']),
});

const structuralConditionInputSchema = z.enum(['Belirtilmedi', 'clean', 'issue', 'Sorun yok', 'İşlem / sorun var']);

function normalizeStructuralConditionValue(value: z.infer<typeof structuralConditionInputSchema>) {
  if (value === 'Sorun yok') {
    return 'clean' as const;
  }

  if (value === 'İşlem / sorun var') {
    return 'issue' as const;
  }

  return value;
}

const structuralConditionValueSchema = structuralConditionInputSchema.transform(normalizeStructuralConditionValue);

const criticalCheckSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  status: structuralConditionValueSchema,
});

const conditionSchema = z.object({
  tramerAmount: z.number().min(0),
  severeDamage: z.boolean(),
  paintedParts: z.array(z.string()).default([]),
  changedParts: z.array(z.string()).default([]),
  mechanicalStatus: z.string().min(1),
  maintenanceHistory: z.string().min(1),
  appraisalReport: z.string().optional().default(''),
  airbagCondition: structuralConditionValueSchema.optional().default('Belirtilmedi'),
  chassisPodyeCondition: structuralConditionValueSchema.optional().default('Belirtilmedi'),
  pillarCondition: structuralConditionValueSchema.optional().default('Belirtilmedi'),
  criticalChecks: z.array(criticalCheckSchema).default([]),
  damageParts: z.array(damagePartSchema).default([]),
});

const photoSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  url: z.url(),
  cover: z.boolean().optional().default(false),
});

const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(10),
  email: z.email(),
});

const createFastSaleSchema = z.object({
  vehicleInfo: vehicleInfoSchema,
  condition: conditionSchema,
  photos: z.array(photoSchema).max(10).default([]),
  expectedPrice: z.number().nonnegative(),
  estimatedMarketValue: z.number().nonnegative(),
  quickSaleValue: z.number().nonnegative(),
  dealerBuyValue: z.number().nonnegative(),
  valuationSummary: z.string().trim().min(10).max(5000),
  contact: contactSchema,
});

const statusQuerySchema = z.object({
  status: z.enum(statusValues).optional(),
});

function toDecimal(value: number) {
  return Number(value.toFixed(2));
}

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

  return digits || undefined;
}

function buildRequestNo() {
  const year = new Date().getFullYear();
  const randomBlock = Math.floor(100000 + Math.random() * 900000);
  return `HS-${year}-${randomBlock}`;
}

async function createUniqueRequestNo() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const requestNo = buildRequestNo();
    const exists = await prisma.fastSaleRequest.findUnique({
      where: { requestNo },
      select: { id: true },
    });

    if (!exists) {
      return requestNo;
    }
  }

  throw new Error('Unique fast sale request number could not be generated');
}

function serializeFastSaleWithDetails(
  fastSale: {
    id: string;
    requestNo: string;
    status: FastSaleStatus;
    vehicleInfo: unknown;
    condition: unknown;
    photos: unknown;
    expectedPrice: unknown;
    estimatedMarketValue: unknown;
    quickSaleValue: unknown;
    dealerBuyValue: unknown;
    valuationSummary: string;
    createdAt: Date;
    offers: Array<{
      id: string;
      amount: unknown;
      status: string;
      validUntil: Date;
      appraisalRequired: boolean;
      pickupOption: string;
      paymentMethod: string;
      adminNote: string;
      message: string;
      createdAt: Date;
    }>;
  },
  messageHistory: Array<{ id: string; sender: string; senderType: 'admin' | 'user' | 'dealer'; content: string; createdAt: string }>,
) {
  return {
    ...fastSale,
    expectedPrice: toDecimal(Number(fastSale.expectedPrice)),
    estimatedMarketValue: toDecimal(Number(fastSale.estimatedMarketValue)),
    quickSaleValue: toDecimal(Number(fastSale.quickSaleValue)),
    dealerBuyValue: toDecimal(Number(fastSale.dealerBuyValue)),
    currentOffer: fastSale.offers[0] ? toDecimal(Number(fastSale.offers[0].amount)) : 0,
    previousOffers: fastSale.offers.map((offer) => ({
      id: offer.id,
      amount: toDecimal(Number(offer.amount)),
      status: offer.status,
      validUntil: offer.validUntil.toISOString(),
      appraisalRequired: offer.appraisalRequired,
      pickupOption: offer.pickupOption,
      paymentMethod: offer.paymentMethod,
      adminNote: offer.adminNote,
      message: offer.message,
      createdAt: offer.createdAt.toISOString(),
    })),
    messageHistory,
  };
}

async function buildFastSaleMessageHistory(requestId: string) {
  const activityLogs = await prisma.adminActivityLog.findMany({
    where: { recordId: requestId, module: 'Hızlı Sat' },
    orderBy: { createdAt: 'desc' },
  });

  return activityLogs
    .filter((item) => item.description.trim().length > 0)
    .map((item) => ({
      id: item.id,
      sender: item.adminName,
      senderType: 'admin' as const,
      content: item.description,
      createdAt: item.createdAt.toISOString(),
    }));
}

export async function fastSaleRoutes(app: FastifyInstance) {
  app.post('/fast-sales', async (request, reply) => {
    const payload = createFastSaleSchema.parse(request.body);
    const requestNo = await createUniqueRequestNo();
    const fullName = `${payload.contact.firstName} ${payload.contact.lastName}`.trim();
    const normalizedEmail = payload.contact.email.trim().toLowerCase();
    const normalizedPhone = normalizePhone(payload.contact.phone);
    const authUser = await resolveAuthUser(request);
    if (authUser?.accountType === AccountType.ADMIN || authUser?.accountType === AccountType.DEALER) {
      reply.code(403);
      return { message: 'Admin veya galeri oturumu acikken bu formdan hizli sat talebi gonderemezsiniz.' };
    }

    let userId = authUser?.id;
    let existingAccountType: AccountType | undefined = authUser?.accountType;

    if (!userId) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: normalizedEmail },
            normalizedPhone ? { phone: normalizedPhone } : undefined,
          ].filter(Boolean) as Array<{ email?: string; phone?: string }>,
        },
        select: { id: true, accountType: true },
      });

      if (existingUser) {
        if (existingUser.accountType === AccountType.ADMIN || existingUser.accountType === AccountType.DEALER) {
          reply.code(403);
          return { message: 'Admin veya galeri hesabiyla public hizli sat talebi olusturulamaz.' };
        }
        userId = existingUser.id;
        existingAccountType = existingUser.accountType;
      } else {
        const createdUser = await prisma.user.create({
          data: {
            fullName,
            email: normalizedEmail,
            phone: normalizedPhone,
            city: payload.vehicleInfo.city,
            accountType: AccountType.INDIVIDUAL,
            passwordHash: hashPassword(randomUUID()),
          },
          select: { id: true },
        });

        userId = createdUser.id;
        existingAccountType = AccountType.INDIVIDUAL;
      }
    }

    if (
      existingAccountType === undefined
      || existingAccountType === AccountType.INDIVIDUAL
      || existingAccountType === AccountType.CORPORATE
    ) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          fullName,
          email: normalizedEmail,
          phone: normalizedPhone,
          city: payload.vehicleInfo.city,
          accountType: AccountType.INDIVIDUAL,
        },
      });
    }

    const fastSale = await prisma.fastSaleRequest.create({
      data: {
        requestNo,
        userId,
        status: FastSaleStatus.NEW,
        vehicleInfo: payload.vehicleInfo,
        condition: payload.condition,
        photos: payload.photos,
        expectedPrice: toDecimal(payload.expectedPrice),
        estimatedMarketValue: toDecimal(payload.estimatedMarketValue),
        quickSaleValue: toDecimal(payload.quickSaleValue),
        dealerBuyValue: toDecimal(payload.dealerBuyValue),
        valuationSummary: payload.valuationSummary,
      },
      include: {
        offers: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    void notifyNewApplicationViaWhatsapp({
      type: 'hizli-sat',
      referenceNo: requestNo,
      customerName: fullName,
      customerPhone: normalizedPhone,
      customerEmail: normalizedEmail,
      vehicleSummary: `${payload.vehicleInfo.year} ${payload.vehicleInfo.brand} ${payload.vehicleInfo.model}`.trim(),
      city: payload.vehicleInfo.city,
      district: payload.vehicleInfo.district,
      details: [
        `Paket: ${payload.vehicleInfo.packageName}`,
        `Motor hacmi: ${payload.vehicleInfo.engineVolume}`,
        `Motor gucu: ${payload.vehicleInfo.enginePower || '-'}`,
        `Yakit: ${payload.vehicleInfo.fuelType}`,
        `Vites: ${payload.vehicleInfo.transmission}`,
        `KM: ${payload.vehicleInfo.mileage}`,
        `Kasa: ${payload.vehicleInfo.bodyType}`,
        `Renk: ${payload.vehicleInfo.color}`,
        `Beklenen fiyat: ${payload.expectedPrice} TL`,
        `Piyasa degeri: ${payload.estimatedMarketValue} TL`,
        `Hizli sat degeri: ${payload.quickSaleValue} TL`,
        `Bayi alim degeri: ${payload.dealerBuyValue} TL`,
        `Tramer: ${payload.condition.tramerAmount} TL`,
        `Agir hasar: ${payload.condition.severeDamage ? 'Var' : 'Yok'}`,
        `Mekanik: ${payload.condition.mechanicalStatus}`,
        `Bakim gecmisi: ${payload.condition.maintenanceHistory}`,
        `Airbag durumu: ${payload.condition.airbagCondition}`,
        `Sase/Podye durumu: ${payload.condition.chassisPodyeCondition}`,
        `Direk durumu: ${payload.condition.pillarCondition}`,
        `Ekspertiz notu: ${payload.condition.appraisalReport || '-'}`,
        `Foto sayisi: ${payload.photos.length}`,
        `Degerleme notu: ${payload.valuationSummary}`,
      ],
    }).catch((error) => {
      request.log.error(
        { error, requestNo, route: 'fast-sales.create' },
        'WhatsApp hizli sat bildirimi gonderilemedi',
      );
    });
    void notifyNewApplicationViaTelegram({
      type: 'hizli-sat',
      referenceNo: requestNo,
      customerName: fullName,
      customerPhone: normalizedPhone,
      customerEmail: normalizedEmail,
      vehicleSummary: `${payload.vehicleInfo.year} ${payload.vehicleInfo.brand} ${payload.vehicleInfo.model}`.trim(),
      city: payload.vehicleInfo.city,
      district: payload.vehicleInfo.district,
      details: [
        `Paket: ${payload.vehicleInfo.packageName}`,
        `Motor hacmi: ${payload.vehicleInfo.engineVolume}`,
        `Motor gucu: ${payload.vehicleInfo.enginePower || '-'}`,
        `Yakit: ${payload.vehicleInfo.fuelType}`,
        `Vites: ${payload.vehicleInfo.transmission}`,
        `KM: ${payload.vehicleInfo.mileage}`,
        `Kasa: ${payload.vehicleInfo.bodyType}`,
        `Renk: ${payload.vehicleInfo.color}`,
        `Beklenen fiyat: ${payload.expectedPrice} TL`,
        `Piyasa degeri: ${payload.estimatedMarketValue} TL`,
        `Hizli sat degeri: ${payload.quickSaleValue} TL`,
        `Bayi alim degeri: ${payload.dealerBuyValue} TL`,
        `Tramer: ${payload.condition.tramerAmount} TL`,
        `Agir hasar: ${payload.condition.severeDamage ? 'Var' : 'Yok'}`,
        `Mekanik: ${payload.condition.mechanicalStatus}`,
        `Bakim gecmisi: ${payload.condition.maintenanceHistory}`,
        `Airbag durumu: ${payload.condition.airbagCondition}`,
        `Sase/Podye durumu: ${payload.condition.chassisPodyeCondition}`,
        `Direk durumu: ${payload.condition.pillarCondition}`,
        `Ekspertiz notu: ${payload.condition.appraisalReport || '-'}`,
        `Foto sayisi: ${payload.photos.length}`,
        `Degerleme notu: ${payload.valuationSummary}`,
      ],
    }).catch((error) => {
      request.log.error(
        { error, requestNo, route: 'fast-sales.create' },
        'Telegram hizli sat bildirimi gonderilemedi',
      );
    });

    const messageHistory = await buildFastSaleMessageHistory(fastSale.id);
    reply.code(201);
    return serializeFastSaleWithDetails(fastSale, messageHistory);
  });

  app.get('/fast-sales/reference/:requestNo', async (request, reply) => {
    const params = z.object({ requestNo: z.string().min(1) }).parse(request.params);
    const query = z.object({
      email: z.email(),
      phone: z.string().optional(),
    }).parse(request.query);

    const normalizedEmail = query.email.trim().toLowerCase();
    const normalizedPhone = normalizePhone(query.phone);

    const fastSale = await prisma.fastSaleRequest.findUnique({
      where: { requestNo: params.requestNo },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
        offers: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!fastSale) {
      reply.code(404);
      return { message: 'Hizli sat talebi bulunamadi.' };
    }

    const matchesEmail = fastSale.user.email.trim().toLowerCase() === normalizedEmail;
    const matchesPhone = normalizedPhone && normalizePhone(fastSale.user.phone) === normalizedPhone;

    if (!matchesEmail && !matchesPhone) {
      reply.code(403);
      return { message: 'Bu talebe erisim yetkiniz yok.' };
    }

    const messageHistory = await buildFastSaleMessageHistory(fastSale.id);
    return serializeFastSaleWithDetails(fastSale, messageHistory);
  });

  app.get('/me/fast-sales', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    const query = statusQuerySchema.parse(request.query);

    const fastSales = await prisma.fastSaleRequest.findMany({
      where: {
        userId: authUser.id,
        status: query.status,
      },
      include: {
        offers: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Promise.all(
      fastSales.map(async (fastSale) => serializeFastSaleWithDetails(fastSale, await buildFastSaleMessageHistory(fastSale.id))),
    );
  });
}
