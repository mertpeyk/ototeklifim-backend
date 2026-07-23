import 'dotenv/config';
import { AuctionStatus, ListingStatus, ListingType } from '@prisma/client';

import { prisma } from '../db.js';
import { hashPassword } from '../lib/auth.js';

async function upsertUser(input: {
  email: string;
  fullName: string;
  accountType: 'INDIVIDUAL' | 'DEALER' | 'CORPORATE' | 'ADMIN';
  city: string;
  phone: string;
}) {
  return prisma.user.upsert({
    where: { email: input.email },
    update: {
      fullName: input.fullName,
      accountType: input.accountType,
      city: input.city,
      phone: input.phone,
    },
    create: {
      ...input,
      passwordHash: hashPassword('123456'),
    },
  });
}

async function main() {
  const admin = await upsertUser({
    email: 'admin@ototeklifim.local',
    fullName: 'OtoTeklifim Admin',
    accountType: 'ADMIN',
    city: 'Istanbul',
    phone: '05550000000',
  });

  const seller = await upsertUser({
    email: 'satici@ototeklifim.local',
    fullName: 'Ankara Premium Auto',
    accountType: 'DEALER',
    city: 'Ankara',
    phone: '05550000001',
  });

  const buyer = await upsertUser({
    email: 'alici@ototeklifim.local',
    fullName: 'Mert Demo',
    accountType: 'INDIVIDUAL',
    city: 'Istanbul',
    phone: '05550000002',
  });

  await prisma.bid.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.consignmentTimeline.deleteMany();
  await prisma.dealerAssignment.deleteMany();
  await prisma.consignmentPhoto.deleteMany();
  await prisma.consignmentRequest.deleteMany({
    where: {
      userId: {
        in: [buyer.id],
      },
    },
  });
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany({
    where: {
      sellerId: {
        in: [seller.id, buyer.id, admin.id],
      },
    },
  });

  const seededListings = await Promise.all([
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: '2023 BMW 320i M Sport',
        description:
            'Boyasiz, ekspertizli, dusuk kilometreli ve bakimlari tam BMW 320i. Takasa acik.',
        category: 'Otomobil',
        brand: 'BMW',
        model: '320i M Sport',
        packageName: 'M Sport',
        year: 2023,
        km: 18500,
        city: 'Ankara',
        district: 'Cankaya',
        fuelType: 'Benzin',
        transmission: 'Otomatik',
        bodyType: 'Sedan',
        color: 'Siyah',
        engineVolume: '1998 cc',
        enginePower: '170 hp',
        driveType: 'Arkadan Itis',
        condition: 'Ikinci El',
        plateOrigin: 'TR',
        fromWho: 'Galeriden',
        exchangeAllowed: true,
        damageRecord: 'Kayitsiz',
        price: 1975000,
        currency: 'TRY',
        listingType: ListingType.FIXED_PRICE,
        status: ListingStatus.ACTIVE,
        publishedAt: new Date(),
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: '2022 Audi A3 Sportback',
        description:
            'Audi A3 Sportback, cam tavanli, adaptif hiz sabitleyicili, temiz aile araci.',
        category: 'Otomobil',
        brand: 'Audi',
        model: 'A3 Sportback',
        packageName: 'Advanced',
        year: 2022,
        km: 32200,
        city: 'Istanbul',
        district: 'Kadikoy',
        fuelType: 'Benzin',
        transmission: 'Otomatik',
        bodyType: 'Hatchback',
        color: 'Gri',
        engineVolume: '1498 cc',
        enginePower: '150 hp',
        driveType: 'Onden Cekis',
        condition: 'Ikinci El',
        plateOrigin: 'TR',
        fromWho: 'Galeriden',
        exchangeAllowed: false,
        damageRecord: 'Kayitsiz',
        price: 1680000,
        currency: 'TRY',
        listingType: ListingType.FIXED_PRICE,
        status: ListingStatus.ACTIVE,
        publishedAt: new Date(),
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: '2024 Peugeot 3008 GT',
        description:
            'Yeni kasa 3008 GT. Hatasiz, boyasiz, garantili. Teklif toplanan vitrin ilanidir.',
        category: 'Arazi, SUV & Pickup',
        brand: 'Peugeot',
        model: '3008 GT',
        packageName: 'GT',
        year: 2024,
        km: 9400,
        city: 'Izmir',
        district: 'Bornova',
        fuelType: 'Benzin',
        transmission: 'Otomatik',
        bodyType: 'SUV',
        color: 'Beyaz',
        engineVolume: '1598 cc',
        enginePower: '180 hp',
        driveType: 'Onden Cekis',
        condition: 'Ikinci El',
        plateOrigin: 'TR',
        fromWho: 'Galeriden',
        exchangeAllowed: true,
        damageRecord: 'Kayitsiz',
        price: 2140000,
        currency: 'TRY',
        listingType: ListingType.AUCTION,
        status: ListingStatus.ACTIVE,
        publishedAt: new Date(),
      },
    }),
  ]);

  const auctionListing = seededListings[2];
  const auction = await prisma.auction.create({
    data: {
      listingId: auctionListing.id,
      startPrice: 2050000,
      minIncrement: 25000,
      reservePrice: 2125000,
      startAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 10),
      status: AuctionStatus.LIVE,
    },
  });

  await prisma.bid.create({
    data: {
      auctionId: auction.id,
      bidderId: buyer.id,
      amount: 2075000,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: buyer.id,
      listingId: seededListings[0].id,
    },
  });

  const conversation = await prisma.conversation.create({
    data: {
      listingId: seededListings[0].id,
      buyerId: buyer.id,
      sellerId: seller.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        senderId: buyer.id,
        body: 'Merhaba, aracin ekspertiz raporu mevcut mu?',
      },
      {
        conversationId: conversation.id,
        senderId: seller.id,
        body: 'Merhaba, evet mevcut. Isterseniz mesajdan da iletebilirim.',
      },
    ],
  });

  await prisma.consignmentRequest.create({
    data: {
      referenceNo: 'KS-2026-001',
      userId: buyer.id,
      status: 'DEALER_ASSIGNED',
      vehicleInfo: {
        vehicleType: 'Otomobil',
        brand: 'Fiat',
        model: 'Egea',
        packageName: 'Easy',
        year: '2020',
        mileage: '118500',
        fuel: 'Dizel',
        transmission: 'Manuel',
        engine: '1.3 Multijet 95',
        bodyType: 'Sedan',
        color: 'Inci Beyazi',
      },
      condition: {
        paintStatus: 'Sag on camurluk lokal boyali',
        changedPartsNote: 'Degisen parca yok',
        tramerInfo: '12.450 TL',
        heavyDamage: 'Yok',
        mechanicalStatus: 'Iyi',
        engineStatus: 'Iyi',
        transmissionStatus: 'Iyi',
        maintenanceHistory: 'Duzenli ozel servis bakimli',
        authorizedService: 'Hayir',
        expertiseReport: 'Var',
        damageMap: [
          { part: 'Kaput', status: 'ORIGINAL' },
          { part: 'Tavan', status: 'ORIGINAL' },
          { part: 'Bagaj', status: 'ORIGINAL' },
          { part: 'On tampon', status: 'PAINTED' },
        ],
      },
      expectations: {
        expectedPrice: '875000',
        minimumPrice: '835000',
        salePriority: 'NORMAL',
        city: 'Istanbul',
        district: 'Pendik',
        openToTrade: false,
        canLeaveAtDealer: true,
        requestOnsiteInspection: true,
        contactName: 'Mert Demo',
        contactPhone: '5550000002',
        contactEmail: 'alici@ototeklifim.local',
        notes: 'Arac hafta ici aksam gorulebilir.',
      },
      approvals: {
        termsAccepted: true,
        kvkkAccepted: true,
        dealerShareAccepted: true,
      },
      photos: {
        create: [
          {
            category: 'FRONT',
            label: 'On gorunum',
            fileName: 'fiat-egea-front.jpg',
            mimeType: 'image/jpeg',
            fileSize: 245000,
            imageUrl: '/uploads/demo-fiat-egea-front.jpg',
            isCover: true,
            sortOrder: 0,
          },
          {
            category: 'INTERIOR',
            label: 'Ic mekan',
            fileName: 'fiat-egea-interior.jpg',
            mimeType: 'image/jpeg',
            fileSize: 198000,
            imageUrl: '/uploads/demo-fiat-egea-interior.jpg',
            isCover: false,
            sortOrder: 1,
          },
        ],
      },
      timeline: {
        create: [
          {
            title: 'Basvuru olusturuldu',
            description: 'Konsinye basvurusu alindi.',
            done: true,
          },
          {
            title: 'Arac inceleniyor',
            description: 'Uzman ekip ekspertiz ve evrak kontrolunu tamamladi.',
            done: true,
          },
          {
            title: 'Galeri eslestirme',
            description: 'Ankara Premium Auto ile eslestirme yapildi.',
            done: true,
          },
          {
            title: 'Satis sureci basladi',
            description: 'Arac konsinye satis vitrini icin hazirlikta.',
            done: false,
          },
        ],
      },
      assignedDealer: {
        create: {
          dealerId: seller.id,
          dealerName: seller.fullName,
          city: seller.city ?? 'Ankara',
          district: 'Cankaya',
          contactName: 'Satis Danismani',
          contactPhone: '5550000001',
          statusNote: 'Arac ilk ekspertizden gecti.',
          status: 'ACCEPTED',
        },
      },
    },
  });

  console.log('Seed tamamlandi.');
  console.log('Demo admin: admin@ototeklifim.local / 123456');
  console.log('Demo giris: alici@ototeklifim.local / 123456');
  console.log('Demo satici: satici@ototeklifim.local / 123456');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
