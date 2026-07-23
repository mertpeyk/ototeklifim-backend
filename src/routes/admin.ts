import type { FastifyInstance } from 'fastify';
import {
  FastSaleStatus,
  ListingStatus,
  OfferStatus,
  type AdminNotification,
  type AuctionStatus,
  type FastSaleOffer,
  type FastSaleRequest,
  type User,
} from '@prisma/client';
import { z } from 'zod';

import { prisma } from '../db.js';
import { createSession, createSession as createAuthSession, requireAdmin, requireAuth, verifyPassword } from '../lib/auth.js';

const adminPermissions = [
  'listings.view',
  'listings.create',
  'listings.update',
  'listings.delete',
  'listings.publish',
  'consignment.view',
  'consignment.accept',
  'consignment.reject',
  'consignment.feedback',
  'consignment.assignDealer',
  'fastSale.view',
  'fastSale.approve',
  'fastSale.offer',
  'fastSale.reject',
  'fastSale.requestInfo',
  'users.view',
  'users.update',
  'users.suspend',
  'dealers.view',
  'dealers.update',
  'messages.view',
  'messages.send',
  'notifications.send',
  'reports.view',
  'settings.update',
  'activityLogs.view',
] as const;

const listingStatusMap = {
  DRAFT: ListingStatus.DRAFT,
  UNDER_REVIEW: ListingStatus.PENDING_REVIEW,
  PUBLISHED: ListingStatus.ACTIVE,
  UNPUBLISHED: ListingStatus.EXPIRED,
  SOLD: ListingStatus.SOLD,
  ARCHIVED: ListingStatus.REJECTED,
} as const;

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const listingPayloadSchema = z.object({
  id: z.string().min(1).optional(),
  listingNo: z.string().min(1),
  title: z.string().min(1),
  price: z.number().nonnegative(),
  galleryId: z.string().min(1),
  city: z.string().min(1),
  status: z.enum(['DRAFT', 'UNDER_REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'SOLD', 'ARCHIVED']),
  year: z.number().int(),
  mileage: z.number().int().nonnegative(),
  description: z.string().min(1),
  vehicle: z.object({
    vehicleType: z.string(),
    brand: z.string(),
    model: z.string(),
    packageName: z.string(),
    year: z.number().int(),
    mileage: z.number().int(),
    fuelType: z.string(),
    transmission: z.string(),
    bodyType: z.string(),
    engineVolume: z.string(),
    enginePower: z.string(),
    color: z.string(),
    city: z.string(),
    district: z.string(),
  }),
  condition: z.object({
    tramerAmount: z.number().nonnegative(),
    severeDamage: z.boolean(),
    paintedParts: z.array(z.string()),
    changedParts: z.array(z.string()),
    mechanicalStatus: z.string(),
    maintenanceHistory: z.string(),
    appraisalReport: z.string(),
    damageParts: z.array(
      z.object({
        key: z.string(),
        label: z.string(),
        status: z.enum(['Orijinal', 'Lokal Boyalı', 'Boyalı', 'Onarımlı', 'Değişen']),
      }),
    ),
  }),
  equipment: z.array(z.string()).optional().default([]),
  photos: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      url: z.string(),
      cover: z.boolean().optional(),
    }),
  ),
});

const listingStatusUpdateSchema = z.object({
  status: z.enum(['DRAFT', 'UNDER_REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'SOLD', 'ARCHIVED']),
});

const consignmentStatusSchema = z.object({
  status: z.enum(['NEW', 'UNDER_REVIEW', 'INFO_REQUESTED', 'ACCEPTED', 'REJECTED', 'DEALER_ASSIGNED', 'IN_SALE', 'COMPLETED', 'CANCELLED']),
  note: z.string().optional(),
});

const consignmentFeedbackSchema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
  channels: z.array(z.enum(['SMS', 'EMAIL', 'IN_APP'])).min(1),
});

const assignDealerSchema = z.object({
  dealerId: z.string().min(1),
  estimatedSalePrice: z.number().nonnegative().optional(),
  commissionRate: z.number().nonnegative().optional(),
  estimatedSaleTime: z.string().optional(),
  adminNote: z.string().optional(),
  message: z.string().optional(),
});

const fastSaleStatusSchema = z.object({
  status: z.enum(['NEW', 'UNDER_REVIEW', 'APPROVED', 'OFFER_SENT', 'COUNTER_OFFER_RECEIVED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED']),
});

const fastSaleOfferSchema = z.object({
  amount: z.number().nonnegative(),
  validHours: z.number().int().positive(),
  appraisalRequired: z.boolean(),
  pickupOption: z.string().min(1),
  paymentMethod: z.string().min(1),
  adminNote: z.string().optional(),
  message: z.string().min(1),
});

const userStatusSchema = z.object({
  status: z.enum(['Aktif', 'Askıda']),
});

const userNoteSchema = z.object({
  note: z.string().min(1),
});

const dealerStatusSchema = z.object({
  status: z.enum(['Aktif', 'Askıda']),
});

const messageAppendSchema = z.object({
  content: z.string().min(1),
});

const notificationSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  target: z.string().min(1),
  channels: z.array(z.enum(['SMS', 'EMAIL', 'IN_APP'])).min(1),
});

function toNumber(value: unknown, fallback = 0) {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function parseObject<T>(value: unknown, fallback: T): T {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as T;
  }
  return fallback;
}

function parseArray<T>(value: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function mapListingStatus(status: ListingStatus) {
  switch (status) {
    case ListingStatus.DRAFT:
      return 'DRAFT';
    case ListingStatus.PENDING_REVIEW:
      return 'UNDER_REVIEW';
    case ListingStatus.ACTIVE:
      return 'PUBLISHED';
    case ListingStatus.SOLD:
      return 'SOLD';
    case ListingStatus.EXPIRED:
      return 'UNPUBLISHED';
    case ListingStatus.REJECTED:
      return 'ARCHIVED';
    default:
      return 'DRAFT';
  }
}

function mapConsignmentStatus(status: string) {
  switch (status) {
    case 'PENDING':
      return 'NEW';
    case 'UNDER_REVIEW':
      return 'UNDER_REVIEW';
    case 'MATCHING_DEALER':
      return 'INFO_REQUESTED';
    case 'DEALER_ASSIGNED':
      return 'DEALER_ASSIGNED';
    case 'VEHICLE_IN_SALE':
      return 'IN_SALE';
    case 'NEGOTIATION':
      return 'ACCEPTED';
    case 'COMPLETED':
      return 'COMPLETED';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      return 'NEW';
  }
}

function mapFastSaleStatus(status: FastSaleStatus) {
  return status;
}

function mapOfferStatus(status: OfferStatus) {
  return status;
}

function mapUserRole() {
  return 'ADMIN';
}

function buildPermissions() {
  return [...adminPermissions];
}

function buildAdminSession(user: User, token: string) {
  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone ?? '',
      city: user.city ?? '',
      district: user.district ?? '',
      role: mapUserRole(),
      lastLoginAt: new Date().toISOString(),
      createdAt: user.createdAt.toISOString(),
      verificationStatus: user.documentConfirmed ? 'Doğrulanmış' : 'İnceleniyor',
      status: 'Aktif',
    },
    permissions: buildPermissions(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

async function appendActivityLog(input: {
  adminId: string;
  adminName: string;
  action: string;
  module: string;
  recordId: string;
  previousValue: string;
  newValue: string;
  description: string;
}) {
  await prisma.adminActivityLog.create({
    data: {
      adminId: input.adminId,
      adminName: input.adminName,
      role: mapUserRole(),
      action: input.action,
      module: input.module,
      recordId: input.recordId,
      previousValue: input.previousValue,
      newValue: input.newValue,
      ipAddress: '10.24.18.42',
      description: input.description,
    },
  });
}

async function buildAdminRepository() {
  const [listings, consignments, fastSales, users, dealers, conversations, notifications, activityLogs, userNotes] =
    await Promise.all([
      prisma.listing.findMany({ include: { images: true, seller: true }, orderBy: { createdAt: 'desc' } }),
      prisma.consignmentRequest.findMany({
        include: { user: true, photos: true, timeline: true, assignedDealer: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.fastSaleRequest.findMany({
        include: { user: true, offers: { orderBy: { createdAt: 'desc' } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.findMany({
        where: { accountType: { in: ['INDIVIDUAL', 'CORPORATE'] } },
        include: {
          consignmentRequests: true,
          fastSaleRequests: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.findMany({
        where: { accountType: 'DEALER' },
        include: {
          listings: true,
          dealerAssignments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.conversation.findMany({
        include: {
          buyer: true,
          seller: true,
          messages: {
            include: {
              sender: true,
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.adminNotification.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.adminActivityLog.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.adminUserNote.findMany({ orderBy: { createdAt: 'desc' } }),
    ]);

  const notesByUser = new Map<string, string[]>();
  for (const note of userNotes) {
    const list = notesByUser.get(note.userId) ?? [];
    list.push(note.body);
    notesByUser.set(note.userId, list);
  }

  const mappedUsers = users.map((user) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone ?? '',
    city: user.city ?? '',
    district: user.district ?? '',
    verificationStatus: user.documentConfirmed ? 'Doğrulanmış' : 'Eksik',
    membershipDate: user.createdAt.toISOString(),
    lastLoginAt: user.updatedAt.toISOString(),
    consignmentCount: user.consignmentRequests.length,
    fastSaleCount: user.fastSaleRequests.length,
    acceptedOffers: 0,
    rejectedOffers: 0,
    status: 'Aktif',
    adminNotes: notesByUser.get(user.id) ?? [],
  }));

  const mappedDealers = dealers.map((dealer) => ({
    id: dealer.id,
    name: dealer.fullName,
    city: dealer.city ?? '',
    district: dealer.district ?? '',
    contactName: dealer.fullName,
    contactPhone: dealer.phone ?? '',
    contactEmail: dealer.email,
    verificationStatus: dealer.documentConfirmed ? 'Doğrulanmış' : 'Beklemede',
    assignedConsignments: dealer.dealerAssignments.length,
    offersSent: 0,
    offersAccepted: 0,
    status: 'Aktif',
  }));

  return {
    listings: listings.map((listing) => ({
      id: listing.id,
      listingNo: `OTI-${listing.id.toUpperCase()}`,
      title: listing.title,
      price: toNumber(listing.price),
      galleryId: listing.sellerId,
      galleryName: listing.seller.fullName,
      city: listing.city,
      status: mapListingStatus(listing.status),
      year: listing.year,
      mileage: listing.km,
      views: 0,
      createdAt: listing.createdAt.toISOString(),
      description: listing.description,
      photos: listing.images.map((image, index) => ({
        id: image.id,
        title: index === 0 ? 'Kapak Fotoğrafı' : `Fotoğraf ${index + 1}`,
        url: image.imageUrl,
        cover: index === 0,
      })),
      vehicle: {
        vehicleType: listing.category,
        brand: listing.brand,
        model: listing.model,
        packageName: listing.packageName ?? '',
        year: listing.year,
        mileage: listing.km,
        fuelType: listing.fuelType,
        transmission: listing.transmission,
        bodyType: listing.bodyType,
        engineVolume: listing.engineVolume ?? '',
        enginePower: listing.enginePower ?? '',
        color: listing.color,
        city: listing.city,
        district: listing.district ?? '',
      },
      condition: {
        tramerAmount: toNumber(listing.tramerAmount ?? listing.damageRecord),
        severeDamage: listing.severeDamage,
        paintedParts: parseArray<string>(listing.paintedParts),
        changedParts: parseArray<string>(listing.changedParts),
        mechanicalStatus: listing.mechanicalStatus ?? 'Bilgi girilmedi',
        maintenanceHistory: listing.maintenanceHistory ?? 'Bilgi girilmedi',
        appraisalReport: listing.appraisalReport ?? 'Bekleniyor',
        damageParts: parseArray<{ key: string; label: string; status: string }>(listing.damageParts),
      },
      equipment: parseArray<string>(listing.equipment),
    })),
    consignments: consignments.map((request) => {
      const vehicle = parseObject<Record<string, unknown>>(request.vehicleInfo, {});
      const condition = parseObject<Record<string, unknown>>(request.condition, {});
      const expectations = parseObject<Record<string, unknown>>(request.expectations, {});
      return {
        id: request.id,
        requestNo: request.referenceNo,
        status: mapConsignmentStatus(request.status),
        applicant: mappedUsers.find((user) => user.id === request.userId) ?? {
          id: request.user.id,
          fullName: request.user.fullName,
          email: request.user.email,
          phone: request.user.phone ?? '',
          city: request.user.city ?? '',
          district: request.user.district ?? '',
          verificationStatus: request.user.documentConfirmed ? 'Doğrulanmış' : 'Eksik',
          membershipDate: request.user.createdAt.toISOString(),
          lastLoginAt: request.user.updatedAt.toISOString(),
          consignmentCount: 0,
          fastSaleCount: 0,
          acceptedOffers: 0,
          rejectedOffers: 0,
          status: 'Aktif',
          adminNotes: [],
        },
        vehicle: {
          vehicleType: String(vehicle.vehicleType ?? ''),
          brand: String(vehicle.brand ?? ''),
          model: String(vehicle.model ?? ''),
          packageName: String(vehicle.packageName ?? ''),
          year: toNumber(vehicle.year),
          mileage: toNumber(vehicle.mileage),
          fuelType: String(vehicle.fuel ?? vehicle.fuelType ?? ''),
          transmission: String(vehicle.transmission ?? ''),
          bodyType: String(vehicle.bodyType ?? ''),
          engineVolume: String(vehicle.engine ?? vehicle.engineVolume ?? ''),
          enginePower: String(vehicle.enginePower ?? ''),
          color: String(vehicle.color ?? ''),
          city: String(vehicle.city ?? expectations.city ?? ''),
          district: String(vehicle.district ?? expectations.district ?? ''),
        },
        condition: {
          tramerAmount: toNumber(condition.tramerInfo ?? condition.tramerAmount),
          severeDamage: String(condition.heavyDamage ?? '').toLowerCase() === 'evet',
          paintedParts: typeof condition.paintStatus === 'string' ? [condition.paintStatus] : [],
          changedParts: typeof condition.changedPartsNote === 'string' ? [condition.changedPartsNote] : [],
          mechanicalStatus: String(condition.mechanicalStatus ?? ''),
          maintenanceHistory: String(condition.maintenanceHistory ?? ''),
          appraisalReport: String(condition.expertiseReport ?? ''),
          damageParts: parseArray<Record<string, unknown>>(condition.damageMap).map((item, index) => ({
            key: `${request.id}-damage-${index}`,
            label: String(item.part ?? ''),
            status:
              item.status === 'PAINTED'
                ? 'Boyalı'
                : item.status === 'CHANGED'
                  ? 'Değişen'
                  : item.status === 'LOCAL_PAINT'
                    ? 'Lokal Boyalı'
                    : item.status === 'REPAIRED'
                      ? 'Onarımlı'
                      : 'Orijinal',
          })),
        },
        photos: request.photos.map((photo) => ({
          id: photo.id,
          title: photo.label,
          url: photo.imageUrl,
          cover: photo.isCover,
        })),
        expectedPrice: toNumber(expectations.expectedPrice),
        minimumPrice: toNumber(expectations.minimumPrice),
        salePriority:
          expectations.salePriority === 'NORMAL'
            ? 'Normal satış'
            : expectations.salePriority === 'FAST'
              ? 'Hızlı satış'
              : 'Maksimum fiyat hedefi',
        location: [expectations.city, expectations.district].filter(Boolean).join(' / '),
        exchangePreference: expectations.openToTrade ? 'Takas düşünüyor' : 'Takas düşünmüyor',
        vehicleDeliveryAvailability: expectations.canLeaveAtDealer ? 'Galeride bırakabilir' : 'Yerinde kalacak',
        onsiteInspectionPreference: expectations.requestOnsiteInspection ? 'Yerinde inceleme istiyor' : 'Yerinde inceleme istemiyor',
        assignedDealerId: request.assignedDealer?.dealerId ?? undefined,
        assignedDealerName: request.assignedDealer?.dealerName ?? undefined,
        commissionRate: undefined,
        estimatedSalePrice: undefined,
        estimatedSaleTime: undefined,
        createdAt: request.createdAt.toISOString(),
        feedback: [],
        adminNotes: request.reviewNote ? [request.reviewNote] : [],
      };
    }),
    fastSales: fastSales.map((request) => {
      const vehicle = parseObject<Record<string, unknown>>(request.vehicleInfo, {});
      const condition = parseObject<Record<string, unknown>>(request.condition, {});
      const photos = parseArray<Record<string, unknown>>(request.photos);
      return {
        id: request.id,
        requestNo: request.requestNo,
        status: mapFastSaleStatus(request.status),
        user: mappedUsers.find((user) => user.id === request.userId)!,
        vehicle: {
          vehicleType: String(vehicle.vehicleType ?? ''),
          brand: String(vehicle.brand ?? ''),
          model: String(vehicle.model ?? ''),
          packageName: String(vehicle.packageName ?? ''),
          year: toNumber(vehicle.year),
          mileage: toNumber(vehicle.mileage),
          fuelType: String(vehicle.fuelType ?? ''),
          transmission: String(vehicle.transmission ?? ''),
          bodyType: String(vehicle.bodyType ?? ''),
          engineVolume: String(vehicle.engineVolume ?? ''),
          enginePower: String(vehicle.enginePower ?? ''),
          color: String(vehicle.color ?? ''),
          city: String(vehicle.city ?? ''),
          district: String(vehicle.district ?? ''),
        },
        condition: {
          tramerAmount: toNumber(condition.tramerAmount),
          severeDamage: Boolean(condition.severeDamage),
          paintedParts: parseArray<string>(condition.paintedParts),
          changedParts: parseArray<string>(condition.changedParts),
          mechanicalStatus: String(condition.mechanicalStatus ?? ''),
          maintenanceHistory: String(condition.maintenanceHistory ?? ''),
          appraisalReport: String(condition.appraisalReport ?? ''),
          damageParts: parseArray<Record<string, unknown>>(condition.damageParts).map((item) => ({
            key: String(item.key ?? crypto.randomUUID()),
            label: String(item.label ?? ''),
            status: String(item.status ?? 'Orijinal'),
          })),
        },
        photos: photos.map((photo, index) => ({
          id: String(photo.id ?? `${request.id}-photo-${index}`),
          title: String(photo.title ?? `Fotoğraf ${index + 1}`),
          url: String(photo.url ?? ''),
          cover: Boolean(photo.cover),
        })),
        estimatedMarketValue: toNumber(request.estimatedMarketValue),
        quickSaleValue: toNumber(request.quickSaleValue),
        dealerBuyValue: toNumber(request.dealerBuyValue),
        expectedPrice: toNumber(request.expectedPrice),
        currentOffer: request.offers[0] ? toNumber(request.offers[0].amount) : undefined,
        city: String(vehicle.city ?? ''),
        createdAt: request.createdAt.toISOString(),
        valuationSummary: request.valuationSummary,
        previousOffers: request.offers.map((offer) => ({
          id: offer.id,
          amount: toNumber(offer.amount),
          status: mapOfferStatus(offer.status),
          validUntil: offer.validUntil.toISOString(),
          appraisalRequired: offer.appraisalRequired,
          pickupOption: offer.pickupOption,
          paymentMethod: offer.paymentMethod,
          adminNote: offer.adminNote,
          message: offer.message,
          createdAt: offer.createdAt.toISOString(),
        })),
        messageHistory: [],
        activityHistory: activityLogs
          .filter((item) => item.recordId === request.id)
          .map((item) => ({
            id: item.id,
            adminId: item.adminId,
            adminName: item.adminName,
            role: item.role,
            action: item.action,
            module: item.module,
            recordId: item.recordId,
            previousValue: item.previousValue,
            newValue: item.newValue,
            ipAddress: item.ipAddress,
            createdAt: item.createdAt.toISOString(),
            description: item.description,
          })),
      };
    }),
    users: mappedUsers,
    dealerships: mappedDealers,
    conversations: conversations.map((conversation) => ({
      id: conversation.id,
      subject: conversation.listingId ? `İlan görüşmesi • ${conversation.listingId}` : 'Genel görüşme',
      requestType: 'Genel',
      participantName: conversation.buyer.fullName,
      participantType: 'Kullanıcı',
      unreadCount: 0,
      resolved: false,
      updatedAt: conversation.updatedAt.toISOString(),
      messages: conversation.messages.map((message) => ({
        id: message.id,
        sender: message.sender.fullName,
        senderType: message.sender.accountType === 'DEALER' ? 'dealer' : message.sender.accountType === 'ADMIN' ? 'admin' : 'user',
        content: message.body,
        createdAt: message.createdAt.toISOString(),
      })),
    })),
    notifications: notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      target: notification.target,
      delivery: notification.delivery,
      channels: parseArray<string>(notification.channels),
      createdAt: notification.createdAt.toISOString(),
    })),
    activityLogs: activityLogs.map((item) => ({
      id: item.id,
      adminId: item.adminId,
      adminName: item.adminName,
      role: item.role,
      action: item.action,
      module: item.module,
      recordId: item.recordId,
      previousValue: item.previousValue,
      newValue: item.newValue,
      ipAddress: item.ipAddress,
      createdAt: item.createdAt.toISOString(),
      description: item.description,
    })),
  };
}

export async function adminRoutes(app: FastifyInstance) {
  app.post('/admin/auth/login', async (request, reply) => {
    const payload = loginSchema.parse(request.body);
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email.trim().toLowerCase(),
      },
    });

    if (!user || user.accountType !== 'ADMIN' || !verifyPassword(payload.password, user.passwordHash)) {
      reply.code(401);
      return { message: 'Admin e-posta veya şifre hatalı.' };
    }

    const token = await createAuthSession(user.id);
    return buildAdminSession(user, token);
  });

  app.get('/admin/me', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const user = await prisma.user.findUniqueOrThrow({ where: { id: admin.id } });
    return buildAdminSession(user, '');
  });

  app.get('/admin/bootstrap', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    return buildAdminRepository();
  });

  app.get('/admin/dashboard', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    return buildAdminRepository();
  });

  app.post('/admin/listings', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const payload = listingPayloadSchema.parse(request.body);
    const listing = await prisma.listing.create({
      data: {
        id: payload.id,
        sellerId: payload.galleryId,
        title: payload.title,
        description: payload.description,
        category: payload.vehicle.vehicleType,
        brand: payload.vehicle.brand,
        model: payload.vehicle.model,
        packageName: payload.vehicle.packageName,
        year: payload.vehicle.year,
        km: payload.vehicle.mileage,
        city: payload.vehicle.city,
        district: payload.vehicle.district,
        fuelType: payload.vehicle.fuelType,
        transmission: payload.vehicle.transmission,
        bodyType: payload.vehicle.bodyType,
        color: payload.vehicle.color,
        engineVolume: payload.vehicle.engineVolume,
        enginePower: payload.vehicle.enginePower,
        price: payload.price,
        currency: 'TRY',
        listingType: 'FIXED_PRICE',
        status: listingStatusMap[payload.status],
        damageRecord: String(payload.condition.tramerAmount),
        tramerAmount: payload.condition.tramerAmount,
        severeDamage: payload.condition.severeDamage,
        paintedParts: payload.condition.paintedParts,
        changedParts: payload.condition.changedParts,
        mechanicalStatus: payload.condition.mechanicalStatus,
        maintenanceHistory: payload.condition.maintenanceHistory,
        appraisalReport: payload.condition.appraisalReport,
        damageParts: payload.condition.damageParts,
        equipment: payload.equipment,
        moderationNote: '',
        images: {
          create: payload.photos.map((photo, index) => ({
            imageUrl: photo.url,
            sortOrder: index,
          })),
        },
      },
    });
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'LISTING_CREATE',
      module: 'İlan',
      recordId: listing.id,
      previousValue: '',
      newValue: payload.status,
      description: `${payload.title} ilanı oluşturuldu.`,
    });
    reply.code(201);
    return listing;
  });

  app.patch('/admin/listings/:id', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    const payload = listingPayloadSchema.parse(request.body);
    await prisma.listingImage.deleteMany({ where: { listingId: params.id } });
    const listing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        sellerId: payload.galleryId,
        title: payload.title,
        description: payload.description,
        category: payload.vehicle.vehicleType,
        brand: payload.vehicle.brand,
        model: payload.vehicle.model,
        packageName: payload.vehicle.packageName,
        year: payload.vehicle.year,
        km: payload.vehicle.mileage,
        city: payload.vehicle.city,
        district: payload.vehicle.district,
        fuelType: payload.vehicle.fuelType,
        transmission: payload.vehicle.transmission,
        bodyType: payload.vehicle.bodyType,
        color: payload.vehicle.color,
        engineVolume: payload.vehicle.engineVolume,
        enginePower: payload.vehicle.enginePower,
        price: payload.price,
        status: listingStatusMap[payload.status],
        damageRecord: String(payload.condition.tramerAmount),
        tramerAmount: payload.condition.tramerAmount,
        severeDamage: payload.condition.severeDamage,
        paintedParts: payload.condition.paintedParts,
        changedParts: payload.condition.changedParts,
        mechanicalStatus: payload.condition.mechanicalStatus,
        maintenanceHistory: payload.condition.maintenanceHistory,
        appraisalReport: payload.condition.appraisalReport,
        damageParts: payload.condition.damageParts,
        equipment: payload.equipment,
        images: {
          create: payload.photos.map((photo, index) => ({
            imageUrl: photo.url,
            sortOrder: index,
          })),
        },
      },
    });
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'LISTING_UPDATE',
      module: 'İlan',
      recordId: listing.id,
      previousValue: '',
      newValue: payload.status,
      description: `${payload.title} ilanı güncellendi.`,
    });
    return listing;
  });

  app.delete('/admin/listings/:id', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    await prisma.listing.delete({ where: { id: params.id } });
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'LISTING_DELETE',
      module: 'İlan',
      recordId: params.id,
      previousValue: '',
      newValue: 'DELETED',
      description: `${params.id} ilanı silindi.`,
    });
    return { ok: true };
  });

  app.post('/admin/listings/:id/clone', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    const source = await prisma.listing.findUniqueOrThrow({
      where: { id: params.id },
      include: { images: true },
    });
    const cloned = await prisma.listing.create({
      data: {
        sellerId: source.sellerId,
        title: `${source.title} Kopya`,
        description: source.description,
        category: source.category,
        brand: source.brand,
        model: source.model,
        packageName: source.packageName,
        year: source.year,
        km: source.km,
        city: source.city,
        district: source.district,
        fuelType: source.fuelType,
        transmission: source.transmission,
        bodyType: source.bodyType,
        color: source.color,
        engineVolume: source.engineVolume,
        enginePower: source.enginePower,
        driveType: source.driveType,
        condition: source.condition,
        plateOrigin: source.plateOrigin,
        fromWho: source.fromWho,
        exchangeAllowed: source.exchangeAllowed,
        damageRecord: source.damageRecord,
        price: source.price,
        currency: source.currency,
        listingType: source.listingType,
        status: ListingStatus.DRAFT,
        images: {
          create: source.images.map((image) => ({
            imageUrl: image.imageUrl,
            sortOrder: image.sortOrder,
          })),
        },
      },
    });
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'LISTING_CLONE',
      module: 'İlan',
      recordId: cloned.id,
      previousValue: source.id,
      newValue: cloned.id,
      description: `${source.title} ilanı kopyalandı.`,
    });
    return cloned;
  });

  app.post('/admin/listings/:id/status', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    const payload = listingStatusUpdateSchema.parse(request.body);
    const listing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        status: listingStatusMap[payload.status],
        publishedAt: payload.status === 'PUBLISHED' ? new Date() : undefined,
      },
    });
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'LISTING_STATUS',
      module: 'İlan',
      recordId: listing.id,
      previousValue: '',
      newValue: payload.status,
      description: `${listing.title} ilan durumu ${payload.status} olarak güncellendi.`,
    });
    return listing;
  });

  app.post('/admin/consignments/:id/status', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    const payload = consignmentStatusSchema.parse(request.body);
    const statusMap = {
      NEW: 'PENDING',
      UNDER_REVIEW: 'UNDER_REVIEW',
      INFO_REQUESTED: 'MATCHING_DEALER',
      ACCEPTED: 'NEGOTIATION',
      REJECTED: 'CANCELLED',
      DEALER_ASSIGNED: 'DEALER_ASSIGNED',
      IN_SALE: 'VEHICLE_IN_SALE',
      COMPLETED: 'COMPLETED',
      CANCELLED: 'CANCELLED',
    } as const;
    const updated = await prisma.consignmentRequest.update({
      where: { id: params.id },
      data: {
        status: statusMap[payload.status],
        reviewNote: payload.note ?? '',
      },
    });
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'CONSIGNMENT_STATUS',
      module: 'Konsinye',
      recordId: updated.id,
      previousValue: '',
      newValue: payload.status,
      description: `${updated.referenceNo} talep durumu güncellendi.`,
    });
    return updated;
  });

  app.post('/admin/consignments/:id/feedback', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    const payload = consignmentFeedbackSchema.parse(request.body);
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'CONSIGNMENT_FEEDBACK',
      module: 'Konsinye',
      recordId: params.id,
      previousValue: '',
      newValue: payload.subject,
      description: payload.message,
    });
    return { ok: true };
  });

  app.post('/admin/consignments/:id/assign-dealer', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    const payload = assignDealerSchema.parse(request.body);
    const dealer = await prisma.user.findUniqueOrThrow({ where: { id: payload.dealerId } });
    const assignment = await prisma.dealerAssignment.upsert({
      where: { requestId: params.id },
      update: {
        dealerId: dealer.id,
        dealerName: dealer.fullName,
        city: dealer.city ?? '',
        district: dealer.district ?? '',
        contactName: dealer.fullName,
        contactPhone: dealer.phone ?? '',
        statusNote: payload.adminNote ?? '',
        status: 'ACCEPTED',
      },
      create: {
        requestId: params.id,
        dealerId: dealer.id,
        dealerName: dealer.fullName,
        city: dealer.city ?? '',
        district: dealer.district ?? '',
        contactName: dealer.fullName,
        contactPhone: dealer.phone ?? '',
        statusNote: payload.adminNote ?? '',
        status: 'ACCEPTED',
      },
    });
    await prisma.consignmentRequest.update({
      where: { id: params.id },
      data: { status: 'DEALER_ASSIGNED' },
    });
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'CONSIGNMENT_ASSIGN',
      module: 'Konsinye',
      recordId: params.id,
      previousValue: '',
      newValue: dealer.fullName,
      description: `${params.id} talebi ${dealer.fullName} galerisine atandı.`,
    });
    return assignment;
  });

  app.post('/admin/fast-sales/:id/status', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    const payload = fastSaleStatusSchema.parse(request.body);
    const requestModel = await prisma.fastSaleRequest.update({
      where: { id: params.id },
      data: { status: payload.status },
    });
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'FAST_SALE_STATUS',
      module: 'Hızlı Sat',
      recordId: params.id,
      previousValue: '',
      newValue: payload.status,
      description: `${requestModel.requestNo} hızlı sat durumu güncellendi.`,
    });
    return requestModel;
  });

  app.post('/admin/fast-sales/:id/offers', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    const payload = fastSaleOfferSchema.parse(request.body);
    const offer = await prisma.fastSaleOffer.create({
      data: {
        requestId: params.id,
        amount: payload.amount,
        status: OfferStatus.SENT,
        validUntil: new Date(Date.now() + payload.validHours * 60 * 60 * 1000),
        appraisalRequired: payload.appraisalRequired,
        pickupOption: payload.pickupOption,
        paymentMethod: payload.paymentMethod,
        adminNote: payload.adminNote ?? '',
        message: payload.message,
      },
    });
    await prisma.fastSaleRequest.update({
      where: { id: params.id },
      data: { status: 'OFFER_SENT' },
    });
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'FAST_SALE_OFFER',
      module: 'Hızlı Sat',
      recordId: params.id,
      previousValue: '',
      newValue: String(payload.amount),
      description: `${params.id} için fiyat teklifi gönderildi.`,
    });
    return offer;
  });

  app.post('/admin/users/:id/status', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    const payload = userStatusSchema.parse(request.body);
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'USER_STATUS',
      module: 'Kullanıcı',
      recordId: params.id,
      previousValue: '',
      newValue: payload.status,
      description: `${params.id} kullanıcısı ${payload.status} durumuna alındı.`,
    });
    return { ok: true };
  });

  app.post('/admin/users/:id/notes', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    const payload = userNoteSchema.parse(request.body);
    const note = await prisma.adminUserNote.create({
      data: {
        userId: params.id,
        body: payload.note,
        createdBy: admin.fullName,
      },
    });
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'USER_NOTE',
      module: 'Kullanıcı',
      recordId: params.id,
      previousValue: '',
      newValue: payload.note,
      description: 'Kullanıcı notu eklendi.',
    });
    return note;
  });

  app.post('/admin/dealers/:id/status', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    const payload = dealerStatusSchema.parse(request.body);
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'DEALER_STATUS',
      module: 'Galeri',
      recordId: params.id,
      previousValue: '',
      newValue: payload.status,
      description: `${params.id} galerisi ${payload.status} durumuna alındı.`,
    });
    return { ok: true };
  });

  app.post('/admin/messages/:id', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    const payload = messageAppendSchema.parse(request.body);
    const conversation = await prisma.conversation.findUniqueOrThrow({ where: { id: params.id } });
    const created = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: admin.id,
        body: payload.content,
      },
    });
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'MESSAGE_SEND',
      module: 'Mesaj',
      recordId: params.id,
      previousValue: '',
      newValue: payload.content,
      description: 'Admin mesajı gönderildi.',
    });
    return created;
  });

  app.post('/admin/messages/:id/resolve', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'MESSAGE_RESOLVE',
      module: 'Mesaj',
      recordId: params.id,
      previousValue: '',
      newValue: 'RESOLVED',
      description: 'Görüşme çözüldü olarak işaretlendi.',
    });
    return { ok: true };
  });

  app.post('/admin/notifications', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    const payload = notificationSchema.parse(request.body);
    const notification = await prisma.adminNotification.create({
      data: {
        title: payload.title,
        body: payload.body,
        target: payload.target,
        delivery: 'Gönderildi',
        channels: payload.channels,
      },
    });
    await appendActivityLog({
      adminId: admin.id,
      adminName: admin.fullName,
      action: 'NOTIFICATION_SEND',
      module: 'Bildirim',
      recordId: notification.id,
      previousValue: '',
      newValue: payload.title,
      description: 'Yeni admin bildirimi oluşturuldu.',
    });
    reply.code(201);
    return notification;
  });

  app.get('/admin/listings/pending', async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) {
      return;
    }
    return prisma.listing.findMany({
      where: {
        status: ListingStatus.PENDING_REVIEW,
      },
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        images: true,
        auction: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  });
}
