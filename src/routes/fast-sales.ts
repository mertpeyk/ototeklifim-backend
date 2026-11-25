import { createHash, randomUUID } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import { AccountType, FastSaleStatus } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '../db.js';
import { hashPassword, requireAuth, resolveAuthUser } from '../lib/auth.js';
import { notifyNewApplicationViaTelegram } from '../lib/admin-alerts.js';
import {
  buildEstimatedFastSaleNumbers,
  valuationConditionSchema,
  valuationEstimateInputSchema,
  valuationVehicleInfoSchema,
} from '../lib/valuation.js';

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

const structuralConditionInputSchema = z.enum(['Belirtilmedi', 'clean', 'issue', 'Temiz', 'İşlemli', 'Sorun yok', 'İşlem / sorun var']);

function normalizeStructuralConditionValue(value: z.infer<typeof structuralConditionInputSchema>) {
  if (value === 'Sorun yok') {
    return 'clean' as const;
  }

  if (value === 'Temiz') {
    return 'clean' as const;
  }

  if (value === 'İşlem / sorun var') {
    return 'issue' as const;
  }

  if (value === 'İşlemli') {
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
  tireCondition: z.enum(['Belirtilmedi', 'Yeni', 'İyi', 'Orta', 'Zayıf']).optional(),
  inspectionDate: z.string().optional(),
  ownerCount: z.number().int().min(0).max(30).optional(),
  documentedService: z.boolean().optional(),
  airbagCondition: structuralConditionValueSchema.optional().default('Belirtilmedi'),
  chassisPodyeCondition: structuralConditionValueSchema.optional().default('Belirtilmedi'),
  pillarCondition: structuralConditionValueSchema.optional().default('Belirtilmedi'),
  criticalChecks: z.array(criticalCheckSchema).default([]),
  damageParts: z.array(damagePartSchema).default([]),
});

function summarizeDamageCondition(condition: z.infer<typeof conditionSchema>) {
  const unique = (values: string[]) => [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  const paintStatusLabels: Record<'Lokal Boyali' | 'Boyali' | 'Onarimli', string> = {
    'Lokal Boyali': 'Lokal boyalı',
    Boyali: 'Boyalı',
    Onarimli: 'Onarımlı',
  };

  const detailedPaintedParts = condition.damageParts
    .filter((part) => part.status === 'Lokal Boyali' || part.status === 'Boyali' || part.status === 'Onarimli')
    .map((part) => `${part.label} (${paintStatusLabels[part.status as keyof typeof paintStatusLabels]})`);
  const detailedChangedParts = condition.damageParts
    .filter((part) => part.status === 'Degisen')
    .map((part) => part.label);

  const paintedParts = unique(detailedPaintedParts.length ? detailedPaintedParts : condition.paintedParts);
  const changedParts = unique(detailedChangedParts.length ? detailedChangedParts : condition.changedParts);

  return {
    painted: paintedParts.length ? paintedParts.join(', ') : 'Yok',
    changed: changedParts.length ? changedParts.join(', ') : 'Yok',
  };
}

function formatTelegramCurrency(value: number) {
  return `${new Intl.NumberFormat('tr-TR').format(Math.round(value))} TL`;
}

function roundTelegramOffer(value: number) {
  return Math.round(value / 5000) * 5000;
}

function buildTelegramValuationDetails(
  estimatedValues: Awaited<ReturnType<typeof buildEstimatedFastSaleNumbers>>,
  condition: z.infer<typeof conditionSchema>,
) {
  const { result } = estimatedValues;
  const sourceCount = result.intelligence.sources.length;
  const preliminaryOffer = roundTelegramOffer(result.recommendedOffer);
  const cleanInspectionUpperOffer = roundTelegramOffer(Math.min(
    estimatedValues.quickSaleValue,
    result.recommendedOffer * 1.025,
  ));
  const marketMinimum = Number(result.minimum || estimatedValues.estimatedMarketValue * 0.96);
  const marketMaximum = Number(result.maximum || estimatedValues.estimatedMarketValue * 1.04);
  const conciseExplanation = result.intelligence.explanation?.trim().slice(0, 600);
  const attentionNotes = result.negatives.slice(0, 4);
  const hasStructuralRisk = condition.severeDamage
    || [condition.airbagCondition, condition.chassisPodyeCondition, condition.pillarCondition]
      .some((value) => value === 'issue')
    || condition.criticalChecks.some((check) => check.status === 'issue');
  const offerGuidance = hasStructuralRisk
    ? ['Ön teklif: VERMEYİN — yapısal ekspertiz ve uzman incelemesi gerekli']
    : [
        `Güvenli ilk bayi teklifi: ${formatTelegramCurrency(preliminaryOffer)}`,
        `Ekspertiz temizse üst teklif: ${formatTelegramCurrency(cleanInspectionUpperOffer)}`,
      ];

  return [
    '',
    '💰 DEĞERLEME ÖZETİ',
    `Makul piyasa aralığı: ${formatTelegramCurrency(marketMinimum)} – ${formatTelegramCurrency(marketMaximum)}`,
    `Hesaplanan piyasa değeri: ${formatTelegramCurrency(estimatedValues.estimatedMarketValue)}`,
    `Hızlı satış değeri: ${formatTelegramCurrency(estimatedValues.quickSaleValue)}`,
    ...offerGuidance,
    `Güven: ${result.confidenceLabel} (${result.confidenceScore}/100) · İncelenen kaynak: ${sourceCount}`,
    `Otomatik fiyat durumu: ${result.pricingReady ? 'Hazır' : 'Manuel inceleme gerekli'}`,
    ...(!result.pricingReady
      ? [`Kilitleme nedeni: ${result.unavailableReason || result.intelligence.reviewReason || 'Güven eşiği karşılanmadı.'}`]
      : []),
    ...(conciseExplanation ? [`AI değerlendirme notu: ${conciseExplanation}`] : []),
    ...(attentionNotes.length
      ? ['Dikkat noktaları:', ...attentionNotes.map((note) => `• ${note}`)]
      : []),
    'Nihai teklif ekspertiz, kilometre ve mekanik kontrollerden sonra kesinleştirilmelidir.',
  ];
}

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
  submissionKey: z.string().trim().min(16).max(100).optional(),
  vehicleInfo: vehicleInfoSchema,
  condition: conditionSchema,
  photos: z.array(photoSchema).max(10).default([]),
  expertiseReportPhotos: z.array(photoSchema).max(8).default([]),
  expectedPrice: z.number().nonnegative().optional().default(0),
  estimatedMarketValue: z.number().nonnegative().optional().default(0),
  quickSaleValue: z.number().nonnegative().optional().default(0),
  dealerBuyValue: z.number().nonnegative().optional().default(0),
  valuationSummary: z.string().trim().min(10).max(5000).optional().default(''),
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

function buildIdempotentRequestNo(submissionKey: string) {
  const year = new Date().getFullYear();
  const digest = createHash('sha256').update(submissionKey).digest('hex').slice(0, 12).toUpperCase();
  return `HS-${year}-${digest}`;
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
    valuationAudit: unknown;
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
  const valuationAudit = fastSale.valuationAudit && typeof fastSale.valuationAudit === 'object'
    ? fastSale.valuationAudit as Record<string, unknown>
    : {};
  const pricingReady = valuationAudit.pricingReady !== false;
  return {
    ...fastSale,
    expectedPrice: toDecimal(Number(fastSale.expectedPrice)),
    estimatedMarketValue: pricingReady ? toDecimal(Number(fastSale.estimatedMarketValue)) : 0,
    quickSaleValue: pricingReady ? toDecimal(Number(fastSale.quickSaleValue)) : 0,
    dealerBuyValue: pricingReady ? toDecimal(Number(fastSale.dealerBuyValue)) : 0,
    valuationAudit: {
      ...valuationAudit,
      pricingReady,
    },
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
  app.post('/fast-sales/estimate', async (request) => {
    const payload = z.object({
      vehicleInfo: valuationVehicleInfoSchema,
      condition: valuationConditionSchema,
      extraKey: z.boolean().optional().default(false),
      serviceHistory: z.boolean().optional().default(false),
      fast: z.boolean().optional().default(false),
    }).parse(request.body);

    return buildEstimatedFastSaleNumbers(
      valuationEstimateInputSchema.parse(payload),
      payload.fast ? { skipMarketComps: true, skipOpenAi: true } : {},
    );
  });

  app.post('/fast-sales', async (request, reply) => {
    const payload = createFastSaleSchema.parse(request.body);
    if (payload.submissionKey) {
      const idempotentRequestNo = buildIdempotentRequestNo(payload.submissionKey);
      const existingRequest = await prisma.fastSaleRequest.findUnique({
        where: { requestNo: idempotentRequestNo },
        include: { offers: { orderBy: { createdAt: 'desc' } } },
      });

      if (existingRequest) {
        reply.header('x-idempotent-replay', 'true');
        return serializeFastSaleWithDetails(
          existingRequest,
          await buildFastSaleMessageHistory(existingRequest.id),
        );
      }
    }

    const estimatedValues = await buildEstimatedFastSaleNumbers({
        vehicleInfo: payload.vehicleInfo,
        condition: payload.condition,
        extraKey: false,
        serviceHistory:
          payload.condition.mechanicalStatus.toLocaleLowerCase('tr-TR').includes('bakim')
          || payload.condition.maintenanceHistory.toLocaleLowerCase('tr-TR').includes('bakim')
          || payload.condition.maintenanceHistory.toLocaleLowerCase('tr-TR').includes('servis'),
      },
      {},
    );
    const normalizedVehicleInfo = estimatedValues.normalizedVehicleInfo;
    const requestNo = payload.submissionKey
      ? buildIdempotentRequestNo(payload.submissionKey)
      : await createUniqueRequestNo();
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
            city: normalizedVehicleInfo.city,
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
          city: normalizedVehicleInfo.city,
          accountType: AccountType.INDIVIDUAL,
        },
      });
    }

    const customerExpectedPrice = Number(payload.expectedPrice || 0);

    const createFastSale = () => prisma.fastSaleRequest.create({
        data: {
          requestNo,
          userId,
          status: FastSaleStatus.NEW,
          vehicleInfo: normalizedVehicleInfo,
          condition: {
            ...payload.condition,
            expertisePhotos: payload.expertiseReportPhotos,
          },
          photos: payload.photos,
          expectedPrice: toDecimal(customerExpectedPrice),
          estimatedMarketValue: toDecimal(estimatedValues.estimatedMarketValue),
          quickSaleValue: toDecimal(estimatedValues.quickSaleValue),
          dealerBuyValue: toDecimal(estimatedValues.dealerBuyValue),
          valuationSummary: estimatedValues.valuationSummary,
          valuationAudit: {
            provider: estimatedValues.result.intelligence.provider,
            aiEnabled: estimatedValues.result.intelligence.aiEnabled,
            aiDiagnostic: estimatedValues.result.intelligence.aiDiagnostic,
            model: estimatedValues.result.intelligence.provider === 'deterministic'
              ? 'fallback-deterministic'
              : (process.env.OPENAI_VALUATION_WEB_MODEL || 'gpt-6-sol'),
            fallbackModel: process.env.OPENAI_VALUATION_MODEL || 'gpt-4.1-mini',
            marketCompSampleSize: estimatedValues.result.marketComps?.sampleSize || 0,
            marketMedian: estimatedValues.result.marketComps?.median || 0,
            averageSimilarity: estimatedValues.result.intelligence.averageSimilarity,
            confidenceScore: estimatedValues.result.confidenceScore,
            reviewRecommendation: estimatedValues.result.intelligence.reviewRecommendation,
            reviewReason: estimatedValues.result.intelligence.reviewReason,
            explanation: estimatedValues.result.intelligence.explanation,
            pricingReady: estimatedValues.result.pricingReady,
            unavailableReason: estimatedValues.result.unavailableReason,
            offerDiscountPercent: 10,
            recommendedOffer: estimatedValues.result.recommendedOffer,
          },
        },
        include: {
          offers: {
            orderBy: { createdAt: 'desc' as const },
          },
        },
      });
    let fastSale: Awaited<ReturnType<typeof createFastSale>>;

    try {
      fastSale = await createFastSale();
    } catch (error) {
      const isDuplicateSubmission = payload.submissionKey
        && typeof error === 'object'
        && error !== null
        && 'code' in error
        && error.code === 'P2002';

      if (!isDuplicateSubmission) {
        throw error;
      }

      const existingRequest = await prisma.fastSaleRequest.findUnique({
        where: { requestNo },
        include: { offers: { orderBy: { createdAt: 'desc' } } },
      });

      if (!existingRequest) {
        throw error;
      }

      reply.header('x-idempotent-replay', 'true');
      return serializeFastSaleWithDetails(
        existingRequest,
        await buildFastSaleMessageHistory(existingRequest.id),
      );
    }

    const telegramDamageSummary = summarizeDamageCondition(payload.condition);

    const telegramValuationDetails = buildTelegramValuationDetails(estimatedValues, payload.condition);

    void notifyNewApplicationViaTelegram({
      type: 'hizli-sat',
      compact: true,
      referenceNo: requestNo,
      customerName: fullName,
      customerPhone: normalizedPhone,
      customerEmail: normalizedEmail,
      vehicleSummary: `${normalizedVehicleInfo.year} ${normalizedVehicleInfo.brand} ${normalizedVehicleInfo.model}`.trim(),
      city: normalizedVehicleInfo.city,
      district: normalizedVehicleInfo.district,
      details: [
        `Paket / Motor: ${normalizedVehicleInfo.packageName} / ${normalizedVehicleInfo.engineVolume}`,
        `Yakıt / Vites: ${normalizedVehicleInfo.fuelType} / ${normalizedVehicleInfo.transmission}`,
        `Renk: ${normalizedVehicleInfo.color || 'Belirtilmedi'}`,
        `KM: ${new Intl.NumberFormat('tr-TR').format(normalizedVehicleInfo.mileage)}`,
        `Tramer: ${new Intl.NumberFormat('tr-TR').format(payload.condition.tramerAmount)} TL`,
        `Boya: ${telegramDamageSummary.painted}`,
        `Değişen: ${telegramDamageSummary.changed}`,
        `Ekspertiz raporu: ${payload.expertiseReportPhotos.length ? `${payload.expertiseReportPhotos.length} fotoğraf paylaşıldı` : 'Paylaşılmadı'}`,
        ...telegramValuationDetails,
      ],
      media: [
        ...payload.photos.map((photo, index) => ({
          url: photo.url,
          caption: `Araç fotoğrafı ${index + 1}/${payload.photos.length}`,
        })),
        ...payload.expertiseReportPhotos.map((photo, index) => ({
          url: photo.url,
          caption: `Ekspertiz fotoğrafı ${index + 1}/${payload.expertiseReportPhotos.length}`,
        })),
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
