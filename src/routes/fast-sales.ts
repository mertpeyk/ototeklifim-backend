import type { FastifyInstance } from 'fastify';
import { FastSaleStatus } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '../db.js';
import { requireAuth } from '../lib/auth.js';

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

const conditionSchema = z.object({
  tramerAmount: z.number().min(0),
  severeDamage: z.boolean(),
  paintedParts: z.array(z.string()).default([]),
  changedParts: z.array(z.string()).default([]),
  mechanicalStatus: z.string().min(1),
  maintenanceHistory: z.string().min(1),
  appraisalReport: z.string().optional().default(''),
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
  photos: z.array(photoSchema).max(20).default([]),
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

export async function fastSaleRoutes(app: FastifyInstance) {
  app.post('/fast-sales', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    const payload = createFastSaleSchema.parse(request.body);
    const requestNo = await createUniqueRequestNo();
    const fullName = `${payload.contact.firstName} ${payload.contact.lastName}`.trim();

    await prisma.user.update({
      where: { id: authUser.id },
      data: {
        fullName,
        phone: payload.contact.phone,
        city: payload.vehicleInfo.city,
      },
    });

    const fastSale = await prisma.fastSaleRequest.create({
      data: {
        requestNo,
        userId: authUser.id,
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

    reply.code(201);
    return fastSale;
  });

  app.get('/me/fast-sales', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    const query = statusQuerySchema.parse(request.query);

    return prisma.fastSaleRequest.findMany({
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
  });
}
