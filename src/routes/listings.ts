import type { FastifyInstance } from 'fastify';
import { ListingStatus, ListingType } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '../db.js';
import { requireAuth } from '../lib/auth.js';

const createListingSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  category: z.string().min(2),
  brand: z.string().min(2),
  model: z.string().min(1),
  packageName: z.string().min(1).optional(),
  year: z.number().int().min(1950),
  km: z.number().int().min(0),
  city: z.string().min(2),
  district: z.string().optional(),
  fuelType: z.string().min(2),
  transmission: z.string().min(2),
  bodyType: z.string().min(2),
  color: z.string().min(2),
  engineVolume: z.string().optional(),
  enginePower: z.string().optional(),
  driveType: z.string().optional(),
  condition: z.string().min(2).default('Ikinci El'),
  plateOrigin: z.string().optional(),
  fromWho: z.string().min(2).default('Sahibinden'),
  exchangeAllowed: z.boolean().default(false),
  damageRecord: z.string().optional(),
  price: z.number().positive().optional(),
  listingType: z.enum(ListingType),
  imageUrls: z.array(z.url()).max(12).default([]),
});

export async function listingRoutes(app: FastifyInstance) {
  app.get('/listings', async (request) => {
    const querySchema = z.object({
      city: z.string().optional(),
      listingType: z.enum(ListingType).optional(),
      status: z.enum(ListingStatus).default(ListingStatus.ACTIVE),
    });

    const query = querySchema.parse(request.query);

    return prisma.listing.findMany({
      where: {
        city: query.city,
        listingType: query.listingType,
        status: query.status,
      },
      include: {
        images: true,
        auction: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 30,
    });
  });

  app.get('/listings/:id', async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().min(1) });
    const { id } = paramsSchema.parse(request.params);

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            city: true,
            accountType: true,
          },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        auction: {
          include: {
            bids: {
              orderBy: { amount: 'desc' },
              take: 10,
            },
          },
        },
      },
    });

    if (!listing) {
      reply.code(404);
      return { message: 'Ilan bulunamadi' };
    }

    return listing;
  });

  app.get('/me/listings', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    return prisma.listing.findMany({
      where: {
        sellerId: authUser.id,
      },
      include: {
        images: true,
        auction: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  app.post('/listings', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    const payload = createListingSchema.parse(request.body);

    const listing = await prisma.listing.create({
      data: {
        title: payload.title,
        description: payload.description,
        category: payload.category,
        brand: payload.brand,
        model: payload.model,
        packageName: payload.packageName,
        year: payload.year,
        km: payload.km,
        city: payload.city,
        district: payload.district,
        fuelType: payload.fuelType,
        transmission: payload.transmission,
        bodyType: payload.bodyType,
        color: payload.color,
        engineVolume: payload.engineVolume,
        enginePower: payload.enginePower,
        driveType: payload.driveType,
        condition: payload.condition,
        plateOrigin: payload.plateOrigin,
        fromWho: payload.fromWho,
        exchangeAllowed: payload.exchangeAllowed,
        damageRecord: payload.damageRecord,
        listingType: payload.listingType,
        price: payload.price,
        sellerId: authUser.id,
        status: ListingStatus.ACTIVE,
        publishedAt: new Date(),
        images: payload.imageUrls.length
          ? {
              create: payload.imageUrls.map((imageUrl, index) => ({
                imageUrl,
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    reply.code(201);
    return listing;
  });
}
