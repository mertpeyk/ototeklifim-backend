import { randomUUID } from 'node:crypto';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  AccountType,
  ConsignmentStatus,
  DealerAssignmentStatus,
  VehiclePhotoCategory,
} from '@prisma/client';
import { z } from 'zod';

import { prisma } from '../db.js';
import { hashPassword, requireAdmin, requireAuth, resolveAuthUser } from '../lib/auth.js';

const phoneRegex = /^5\d{9}$/;

const consignmentStatusValues = [
  ConsignmentStatus.PENDING,
  ConsignmentStatus.UNDER_REVIEW,
  ConsignmentStatus.MATCHING_DEALER,
  ConsignmentStatus.DEALER_ASSIGNED,
  ConsignmentStatus.VEHICLE_IN_SALE,
  ConsignmentStatus.NEGOTIATION,
  ConsignmentStatus.COMPLETED,
  ConsignmentStatus.CANCELLED,
] as const;

const vehiclePhotoCategoryValues = [
  VehiclePhotoCategory.FRONT,
  VehiclePhotoCategory.REAR,
  VehiclePhotoCategory.RIGHT,
  VehiclePhotoCategory.LEFT,
  VehiclePhotoCategory.INTERIOR,
  VehiclePhotoCategory.ODOMETER,
  VehiclePhotoCategory.ENGINE,
  VehiclePhotoCategory.TRUNK,
  VehiclePhotoCategory.DAMAGE,
] as const;

const vehicleInfoSchema = z.object({
  vehicleType: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  packageName: z.string().min(1),
  year: z.union([z.string().min(1), z.number().int().min(1950)]),
  mileage: z.union([z.string().min(1), z.number().int().min(0)]),
  fuel: z.string().min(1),
  transmission: z.string().min(1),
  engine: z.string().min(1),
  bodyType: z.string().min(1),
  color: z.string().min(1),
});

const damageMapItemSchema = z.object({
  part: z.string().min(1),
  status: z.enum(['ORIGINAL', 'LOCAL_PAINT', 'PAINTED', 'REPAIRED', 'REPLACED']),
});

const conditionSchema = z.object({
  paintStatus: z.string().min(1),
  changedPartsNote: z.string().min(1),
  tramerInfo: z.string().min(1),
  heavyDamage: z.string().min(1),
  mechanicalStatus: z.string().min(1),
  engineStatus: z.string().min(1),
  transmissionStatus: z.string().min(1),
  maintenanceHistory: z.string().min(1),
  authorizedService: z.string().min(1),
  expertiseReport: z.string().min(1),
  damageMap: z.array(damageMapItemSchema).min(1),
});

const expectationsSchema = z.object({
  expectedPrice: z.string().min(1),
  minimumPrice: z.string().min(1),
  salePriority: z.enum(['FAST', 'NORMAL', 'MAX_PRICE']),
  city: z.string().min(1),
  district: z.string().min(1),
  openToTrade: z.boolean(),
  canLeaveAtDealer: z.boolean(),
  requestOnsiteInspection: z.boolean(),
  contactName: z.string().min(2),
  contactPhone: z.string().regex(phoneRegex),
  contactEmail: z.email(),
  notes: z.string().optional().default(''),
});

const approvalsSchema = z.object({
  termsAccepted: z.literal(true),
  kvkkAccepted: z.literal(true),
  dealerShareAccepted: z.literal(true),
});

const photoSchema = z.object({
  category: z.enum(vehiclePhotoCategoryValues),
  label: z.string().min(1),
  name: z.string().min(1),
  size: z.number().int().min(1).max(10 * 1024 * 1024),
  type: z.enum(['image/jpeg', 'image/png']),
  url: z.url(),
  isCover: z.boolean().optional().default(false),
});

const createConsignmentSchema = z.object({
  vehicleInfo: vehicleInfoSchema,
  condition: conditionSchema,
  expectations: expectationsSchema,
  approvals: approvalsSchema,
  photos: z.array(photoSchema).min(4).max(20),
});

const adminListQuerySchema = z.object({
  status: z.enum(consignmentStatusValues).optional(),
});

const idParamsSchema = z.object({
  id: z.string().min(1),
});

const referenceParamsSchema = z.object({
  referenceNo: z.string().min(1),
});

const adminStatusUpdateSchema = z.object({
  status: z.enum(consignmentStatusValues),
  reviewNote: z.string().max(500).optional(),
  assignedDealer: z
    .object({
      dealerId: z.string().min(1).optional(),
      dealerName: z.string().min(2),
      city: z.string().min(2),
      district: z.string().optional(),
      contactName: z.string().min(2),
      contactPhone: z.string().regex(phoneRegex),
      statusNote: z.string().max(500).optional(),
      status: z
        .enum([
          DealerAssignmentStatus.PENDING,
          DealerAssignmentStatus.ACCEPTED,
          DealerAssignmentStatus.REJECTED,
          DealerAssignmentStatus.WITHDRAWN,
        ])
        .optional(),
    })
    .optional(),
  timelineEntry: z
    .object({
      title: z.string().min(2).max(120),
      description: z.string().min(2).max(500),
      done: z.boolean().optional(),
    })
    .optional(),
});

async function ensureConsignmentAccess(
  request: FastifyRequest,
  reply: FastifyReply,
  consignmentId: string,
) {
  const authUser = await requireAuth(request, reply);

  if (!authUser) {
    return null;
  }

  const consignment = await prisma.consignmentRequest.findUnique({
    where: { id: consignmentId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          city: true,
          accountType: true,
        },
      },
      photos: {
        orderBy: { sortOrder: 'asc' },
      },
      timeline: {
        orderBy: { createdAt: 'asc' },
      },
      assignedDealer: true,
    },
  });

  if (!consignment) {
    reply.code(404);
    await reply.send({ message: 'Konsinye basvurusu bulunamadi' });
    return null;
  }

  const isOwner = consignment.userId === authUser.id;
  const isAdmin = authUser.accountType === AccountType.ADMIN;
  const isAssignedDealer = consignment.assignedDealer?.dealerId === authUser.id;

  if (!isOwner && !isAdmin && !isAssignedDealer) {
    reply.code(403);
    await reply.send({ message: 'Bu basvuruya erisim yetkiniz yok' });
    return null;
  }

  return consignment;
}

function buildReferenceNo() {
  const year = new Date().getFullYear();
  const randomBlock = Math.floor(100000 + Math.random() * 900000);
  return `KS-${year}-${randomBlock}`;
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

async function createUniqueReferenceNo() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const referenceNo = buildReferenceNo();
    const exists = await prisma.consignmentRequest.findUnique({
      where: { referenceNo },
      select: { id: true },
    });

    if (!exists) {
      return referenceNo;
    }
  }

  throw new Error('Unique consignment reference could not be generated');
}

function defaultTimeline() {
  return [
    {
      title: 'Basvuru olusturuldu',
      description: 'Konsinye basvurusu sisteme kaydedildi.',
      done: true,
    },
    {
      title: 'Arac inceleniyor',
      description: 'Uzman ekip arac ve evrak bilgisini degerlendiriyor.',
      done: false,
    },
    {
      title: 'Galeri eslestirme',
      description: 'Uygun dogrulanmis galeriler ile eslestirme hazirlaniyor.',
      done: false,
    },
    {
      title: 'Satis sureci basladi',
      description: 'Galeri onayi sonrasi satis sureci aktif hale gelecek.',
      done: false,
    },
  ];
}

export async function consignmentRoutes(app: FastifyInstance) {
  app.get('/me/consignments', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    return prisma.consignmentRequest.findMany({
      where: {
        userId: authUser.id,
      },
      include: {
        photos: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
        timeline: {
          orderBy: { createdAt: 'asc' },
        },
        assignedDealer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  app.get('/consignments/:id', async (request, reply) => {
    const { id } = idParamsSchema.parse(request.params);
    return ensureConsignmentAccess(request, reply, id);
  });

  app.get('/consignments/reference/:referenceNo', async (request, reply) => {
    const authUser = await requireAuth(request, reply);

    if (!authUser) {
      return;
    }

    const { referenceNo } = referenceParamsSchema.parse(request.params);
    const consignment = await prisma.consignmentRequest.findUnique({
      where: { referenceNo },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            city: true,
            accountType: true,
          },
        },
        photos: {
          orderBy: { sortOrder: 'asc' },
        },
        timeline: {
          orderBy: { createdAt: 'asc' },
        },
        assignedDealer: true,
      },
    });

    if (!consignment) {
      reply.code(404);
      return { message: 'Konsinye basvurusu bulunamadi' };
    }

    const isOwner = consignment.userId === authUser.id;
    const isAdmin = authUser.accountType === AccountType.ADMIN;
    const isAssignedDealer = consignment.assignedDealer?.dealerId === authUser.id;

    if (!isOwner && !isAdmin && !isAssignedDealer) {
      reply.code(403);
      return { message: 'Bu basvuruya erisim yetkiniz yok' };
    }

    return consignment;
  });

  app.post('/consignments', async (request, reply) => {
    const payload = createConsignmentSchema.parse(request.body);
    const authUser = await resolveAuthUser(request);
    const referenceNo = await createUniqueReferenceNo();
    const coverUrl = payload.photos.find((photo) => photo.isCover)?.url;
    const normalizedEmail = payload.expectations.contactEmail.trim().toLowerCase();
    const normalizedPhone = normalizePhone(payload.expectations.contactPhone);
    const fullName = payload.expectations.contactName.trim();

    let userId = authUser?.id;

    if (!userId) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: normalizedEmail },
            normalizedPhone ? { phone: normalizedPhone } : undefined,
          ].filter(Boolean) as Array<{ email?: string; phone?: string }>,
        },
        select: { id: true },
      });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const createdUser = await prisma.user.create({
          data: {
            fullName,
            email: normalizedEmail,
            phone: normalizedPhone,
            city: payload.expectations.city,
            district: payload.expectations.district,
            accountType: AccountType.INDIVIDUAL,
            passwordHash: hashPassword(randomUUID()),
          },
          select: { id: true },
        });

        userId = createdUser.id;
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        email: normalizedEmail,
        phone: normalizedPhone,
        city: payload.expectations.city,
        district: payload.expectations.district,
        accountType: AccountType.INDIVIDUAL,
      },
    });

    const consignment = await prisma.consignmentRequest.create({
      data: {
        referenceNo,
        userId,
        status: ConsignmentStatus.PENDING,
        vehicleInfo: payload.vehicleInfo,
        condition: payload.condition,
        expectations: payload.expectations,
        approvals: payload.approvals,
        photos: {
          create: payload.photos.map((photo, index) => ({
            category: photo.category,
            label: photo.label,
            fileName: photo.name,
            mimeType: photo.type,
            fileSize: photo.size,
            imageUrl: photo.url,
            isCover: photo.isCover ?? (coverUrl ? photo.url === coverUrl : index === 0),
            sortOrder: index,
          })),
        },
        timeline: {
          create: defaultTimeline(),
        },
      },
      include: {
        photos: {
          orderBy: { sortOrder: 'asc' },
        },
        timeline: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    reply.code(201);
    return consignment;
  });

  app.get('/admin/consignments', async (request, reply) => {
    const admin = await requireAdmin(request, reply);

    if (!admin) {
      return;
    }

    const query = adminListQuerySchema.parse(request.query);

    return prisma.consignmentRequest.findMany({
      where: {
        status: query.status,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            city: true,
            accountType: true,
          },
        },
        photos: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
        assignedDealer: true,
        timeline: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  app.get('/admin/dealers', async (request, reply) => {
    const admin = await requireAdmin(request, reply);

    if (!admin) {
      return;
    }

    return prisma.user.findMany({
      where: {
        accountType: AccountType.DEALER,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        city: true,
      },
      orderBy: {
        fullName: 'asc',
      },
    });
  });
}
