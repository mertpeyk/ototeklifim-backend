import 'dotenv/config';
import { AuctionStatus, ListingStatus, ListingType, OfferStatus } from '@prisma/client';

import { prisma } from '../db.js';
import { hashPassword } from '../lib/auth.js';

async function upsertUser(input: {
  id: string;
  email: string;
  fullName: string;
  accountType: 'INDIVIDUAL' | 'DEALER' | 'CORPORATE' | 'ADMIN';
  city: string;
  district: string;
  phone: string;
  password: string;
}) {
  return prisma.user.upsert({
    where: { email: input.email },
    update: {
      fullName: input.fullName,
      accountType: input.accountType,
      city: input.city,
      district: input.district,
      phone: input.phone,
      passwordHash: hashPassword(input.password),
    },
    create: {
      id: input.id,
      email: input.email,
      fullName: input.fullName,
      accountType: input.accountType,
      city: input.city,
      district: input.district,
      phone: input.phone,
      passwordHash: hashPassword(input.password),
    },
  });
}

async function main() {
  const admin = await upsertUser({
    id: 'admin-1',
    email: 'admin@ototeklifim.com',
    fullName: 'Mert Yönetim',
    accountType: 'ADMIN',
    city: 'Istanbul',
    district: 'Kadikoy',
    phone: '05550000010',
    password: 'Hakki576.',
  });

  const dealerOne = await upsertUser({
    id: 'dealer-1',
    email: 'ankara@ototeklifimgaleri.com',
    fullName: 'Ankara Premium Auto',
    accountType: 'DEALER',
    city: 'Ankara',
    district: 'Cankaya',
    phone: '05550000001',
    password: '123456',
  });

  const dealerTwo = await upsertUser({
    id: 'dealer-2',
    email: 'izmir@ototeklifimgaleri.com',
    fullName: 'Ege Oto Port',
    accountType: 'DEALER',
    city: 'Izmir',
    district: 'Bornova',
    phone: '05550000003',
    password: '123456',
  });

  const dealerThree = await upsertUser({
    id: 'dealer-3',
    email: 'bursa@ototeklifimgaleri.com',
    fullName: 'Bursa Vitrin Motorlu',
    accountType: 'DEALER',
    city: 'Bursa',
    district: 'Nilufer',
    phone: '05550000004',
    password: '123456',
  });

  const userOne = await upsertUser({
    id: 'user-1',
    email: 'mert.demo@ototeklifim.com',
    fullName: 'Mert Demo',
    accountType: 'INDIVIDUAL',
    city: 'Istanbul',
    district: 'Pendik',
    phone: '05550000002',
    password: '123456',
  });

  const userTwo = await upsertUser({
    id: 'user-2',
    email: 'ayse.kaya@ototeklifim.com',
    fullName: 'Ayse Kaya',
    accountType: 'INDIVIDUAL',
    city: 'Ankara',
    district: 'Yenimahalle',
    phone: '05550000005',
    password: '123456',
  });

  const userThree = await upsertUser({
    id: 'user-3',
    email: 'emre.yildiz@ototeklifim.com',
    fullName: 'Emre Yildiz',
    accountType: 'INDIVIDUAL',
    city: 'Izmir',
    district: 'Karsiyaka',
    phone: '05550000006',
    password: '123456',
  });

  await prisma.bid.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.consignmentTimeline.deleteMany();
  await prisma.dealerAssignment.deleteMany();
  await prisma.consignmentPhoto.deleteMany();
  await prisma.consignmentRequest.deleteMany();
  await prisma.fastSaleOffer.deleteMany();
  await prisma.fastSaleRequest.deleteMany();
  await prisma.adminNotification.deleteMany();
  await prisma.adminActivityLog.deleteMany();
  await prisma.adminUserNote.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany({
    where: {
      sellerId: {
        in: [dealerOne.id, dealerTwo.id, dealerThree.id, admin.id],
      },
    },
  });

  const listings = await Promise.all([
    prisma.listing.create({
      data: {
        id: 'listing-1',
        sellerId: dealerOne.id,
        title: '2023 BMW 320i M Sport',
        description: 'Boyasiz, ekspertizli, dusuk kilometreli ve bakimlari tam BMW 320i.',
        category: 'Otomobil',
        brand: 'BMW',
        model: '320i',
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
        tramerAmount: 0,
        severeDamage: false,
        paintedParts: [],
        changedParts: [],
        mechanicalStatus: 'Ekspertiz onayli',
        maintenanceHistory: 'Yetkili servis bakimli',
        appraisalReport: 'Hazir',
        damageParts: [],
        equipment: ['Harman Kardon', 'Cam Tavan', 'Isitmali Koltuk'],
        price: 1975000,
        currency: 'TRY',
        listingType: ListingType.FIXED_PRICE,
        status: ListingStatus.ACTIVE,
        publishedAt: new Date(),
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', sortOrder: 0 },
          ],
        },
      },
    }),
    prisma.listing.create({
      data: {
        id: 'listing-2',
        sellerId: dealerTwo.id,
        title: '2022 Audi A3 Sportback',
        description: 'Cam tavanli, adaptif hiz sabitleyicili temiz aile araci.',
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
        tramerAmount: 0,
        severeDamage: false,
        paintedParts: [],
        changedParts: [],
        mechanicalStatus: 'Iyi',
        maintenanceHistory: 'Duzenli bakimli',
        appraisalReport: 'Hazir',
        damageParts: [],
        equipment: ['Adaptif Hız Sabitleyici', 'Cam Tavan'],
        price: 1680000,
        currency: 'TRY',
        listingType: ListingType.FIXED_PRICE,
        status: ListingStatus.ACTIVE,
        publishedAt: new Date(),
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80', sortOrder: 0 },
          ],
        },
      },
    }),
    prisma.listing.create({
      data: {
        id: 'listing-3',
        sellerId: dealerThree.id,
        title: '2024 Peugeot 3008 GT',
        description: 'Yeni kasa, hatasiz, garantili vitrin SUV.',
        category: 'Arazi, SUV & Pickup',
        brand: 'Peugeot',
        model: '3008',
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
        tramerAmount: 0,
        severeDamage: false,
        paintedParts: ['Sol ön çamurluk'],
        changedParts: [],
        mechanicalStatus: 'Iyi',
        maintenanceHistory: 'Servis kayitli',
        appraisalReport: 'Hazir',
        damageParts: [{ key: 'left-front-fender', label: 'Sol Ön Çamurluk', status: 'Boyalı' }],
        equipment: ['Panoramik Cam Tavan', '360 Kamera'],
        price: 2140000,
        currency: 'TRY',
        listingType: ListingType.AUCTION,
        status: ListingStatus.ACTIVE,
        publishedAt: new Date(),
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80', sortOrder: 0 },
          ],
        },
      },
    }),
  ]);

  const auction = await prisma.auction.create({
    data: {
      listingId: 'listing-3',
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
      bidderId: userOne.id,
      amount: 2075000,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: userOne.id,
      listingId: 'listing-1',
    },
  });

  const conversation = await prisma.conversation.create({
    data: {
      id: 'conv-1',
      listingId: 'listing-1',
      buyerId: userOne.id,
      sellerId: dealerOne.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        id: 'msg-1',
        conversationId: conversation.id,
        senderId: userOne.id,
        body: 'Merhaba, arac eksper raporu mevcut mu?',
      },
      {
        id: 'msg-2',
        conversationId: conversation.id,
        senderId: dealerOne.id,
        body: 'Merhaba, evet mevcut. Dilerseniz PDF olarak iletebiliriz.',
      },
    ],
  });

  await prisma.consignmentRequest.create({
    data: {
      id: 'cons-1',
      referenceNo: 'KS-2026-001',
      userId: userOne.id,
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
        city: 'Istanbul',
        district: 'Pendik',
      },
      condition: {
        paintStatus: 'Sag on camurluk lokal boyali',
        changedPartsNote: 'Degisen parca yok',
        tramerInfo: '12450',
        heavyDamage: 'Yok',
        mechanicalStatus: 'Iyi',
        engineStatus: 'Iyi',
        transmissionStatus: 'Iyi',
        maintenanceHistory: 'Duzenli ozel servis bakimli',
        authorizedService: 'Hayir',
        expertiseReport: 'Var',
        damageMap: [
          { part: 'Kaput', status: 'ORIGINAL' },
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
        contactPhone: '05550000002',
        contactEmail: 'mert.demo@ototeklifim.com',
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
            id: 'cons-photo-1',
            category: 'FRONT',
            label: 'On gorunum',
            fileName: 'fiat-egea-front.jpg',
            mimeType: 'image/jpeg',
            fileSize: 245000,
            imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
            isCover: true,
            sortOrder: 0,
          },
        ],
      },
      timeline: {
        create: [
          { id: 'cons-tl-1', title: 'Basvuru olusturuldu', description: 'Konsinye basvurusu alindi.', done: true },
          { id: 'cons-tl-2', title: 'Arac inceleniyor', description: 'Ekspertiz ve evrak kontrolu tamamlandi.', done: true },
          { id: 'cons-tl-3', title: 'Galeri eslestirme', description: 'Ankara Premium Auto ile eslestirme yapildi.', done: true },
          { id: 'cons-tl-4', title: 'Satis sureci basladi', description: 'Arac vitrinde yayina hazirlaniyor.', done: false },
        ],
      },
      assignedDealer: {
        create: {
          id: 'assign-1',
          dealerId: dealerOne.id,
          dealerName: dealerOne.fullName,
          city: dealerOne.city ?? 'Ankara',
          district: dealerOne.district ?? 'Cankaya',
          contactName: 'Satis Danismani',
          contactPhone: dealerOne.phone ?? '05550000001',
          statusNote: 'Arac ilk ekspertizden gecti.',
          status: 'ACCEPTED',
        },
      },
    },
  });

  await prisma.consignmentRequest.create({
    data: {
      id: 'cons-2',
      referenceNo: 'KS-2026-002',
      userId: userTwo.id,
      status: 'UNDER_REVIEW',
      vehicleInfo: {
        vehicleType: 'SUV',
        brand: 'Nissan',
        model: 'Qashqai',
        packageName: 'Skypack',
        year: '2021',
        mileage: '64200',
        fuel: 'Benzin',
        transmission: 'Otomatik',
        engine: '1.3 DIG-T',
        bodyType: 'SUV',
        color: 'Fume',
        city: 'Ankara',
        district: 'Yenimahalle',
      },
      condition: {
        paintStatus: 'Kaputta lokal boya',
        changedPartsNote: 'Sol arka kapi degisen',
        tramerInfo: '38200',
        heavyDamage: 'Yok',
        mechanicalStatus: 'Iyi',
        engineStatus: 'Iyi',
        transmissionStatus: 'Iyi',
        maintenanceHistory: 'Yetkili servis',
        authorizedService: 'Evet',
        expertiseReport: 'Yok',
        damageMap: [{ part: 'Sol arka kapi', status: 'CHANGED' }],
      },
      expectations: {
        expectedPrice: '1385000',
        minimumPrice: '1320000',
        salePriority: 'MAXIMUM',
        city: 'Ankara',
        district: 'Yenimahalle',
        openToTrade: true,
        canLeaveAtDealer: false,
        requestOnsiteInspection: true,
        contactName: 'Ayse Kaya',
        contactPhone: '05550000005',
        contactEmail: 'ayse.kaya@ototeklifim.com',
      },
      approvals: {
        termsAccepted: true,
        kvkkAccepted: true,
        dealerShareAccepted: true,
      },
    },
  });

  await prisma.fastSaleRequest.create({
    data: {
      id: 'fast-1',
      requestNo: 'HS-2026-001',
      userId: userThree.id,
      status: 'OFFER_SENT',
      vehicleInfo: {
        vehicleType: 'Otomobil',
        brand: 'Toyota',
        model: 'Corolla',
        packageName: 'Flame X-Pack',
        year: 2021,
        mileage: 54000,
        fuelType: 'Benzin',
        transmission: 'Otomatik',
        bodyType: 'Sedan',
        engineVolume: '1598 cc',
        enginePower: '132 hp',
        color: 'Beyaz',
        city: 'Izmir',
        district: 'Karsiyaka',
      },
      condition: {
        tramerAmount: 0,
        severeDamage: false,
        paintedParts: ['Sag arka camurluk'],
        changedParts: [],
        mechanicalStatus: 'Iyi',
        maintenanceHistory: 'Periyodik bakim kayitli',
        appraisalReport: 'Var',
        damageParts: [{ key: 'sag-arka-camurluk', label: 'Sag arka camurluk', status: 'Lokal Boyalı' }],
      },
      photos: [
        {
          id: 'fast-photo-1',
          title: 'On gorunum',
          url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
          cover: true,
        },
      ],
      expectedPrice: 1245000,
      estimatedMarketValue: 1210000,
      quickSaleValue: 1165000,
      dealerBuyValue: 1130000,
      valuationSummary: 'Piyasa hareketleri ve benzer ilanlar dikkate alinarak hizli satis degeri hesaplandi.',
      offers: {
        create: [
          {
            id: 'offer-1',
            amount: 1165000,
            status: OfferStatus.SENT,
            validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
            appraisalRequired: true,
            pickupOption: 'Alicidan teslim alma',
            paymentMethod: 'Havale / EFT',
            adminNote: 'Ekspertiz sonrasi netlesecek.',
            message: 'Araciniz icin ilk teklifimiz hazirdir.',
          },
        ],
      },
    },
  });

  await prisma.fastSaleRequest.create({
    data: {
      id: 'fast-2',
      requestNo: 'HS-2026-002',
      userId: userOne.id,
      status: 'UNDER_REVIEW',
      vehicleInfo: {
        vehicleType: 'SUV',
        brand: 'Hyundai',
        model: 'Tucson',
        packageName: 'Elite',
        year: 2022,
        mileage: 41000,
        fuelType: 'Dizel',
        transmission: 'Otomatik',
        bodyType: 'SUV',
        engineVolume: '1598 cc',
        enginePower: '136 hp',
        color: 'Siyah',
        city: 'Istanbul',
        district: 'Pendik',
      },
      condition: {
        tramerAmount: 18200,
        severeDamage: false,
        paintedParts: ['On tampon'],
        changedParts: [],
        mechanicalStatus: 'Iyi',
        maintenanceHistory: 'Yetkili servis',
        appraisalReport: 'Bekleniyor',
        damageParts: [{ key: 'on-tampon', label: 'On tampon', status: 'Boyalı' }],
      },
      photos: [],
      expectedPrice: 1860000,
      estimatedMarketValue: 1795000,
      quickSaleValue: 1715000,
      dealerBuyValue: 1680000,
      valuationSummary: 'Ekspertiz ve detayli foto onayi bekleniyor.',
    },
  });

  await prisma.adminNotification.createMany({
    data: [
      {
        id: 'notif-1',
        title: 'Yeni konsinye talebi',
        body: 'Ayse Kaya icin yeni konsinye talebi olustu.',
        target: 'Konsinye Yetkilileri',
        delivery: 'Gönderildi',
        channels: JSON.stringify(['IN_APP']),
      },
      {
        id: 'notif-2',
        title: 'Teklif suresi yaklasiyor',
        body: 'HS-2026-001 teklifinin bitmesine 6 saat kaldi.',
        target: 'Hızlı Sat Ekibi',
        delivery: 'Beklemede',
        channels: JSON.stringify(['IN_APP', 'EMAIL']),
      },
    ],
  });

  await prisma.adminActivityLog.createMany({
    data: [
      {
        id: 'act-1',
        adminId: admin.id,
        adminName: admin.fullName,
        role: 'ADMIN',
        action: 'CONSINGMENT_ASSIGN',
        module: 'Konsinye',
        recordId: 'cons-1',
        previousValue: 'UNDER_REVIEW',
        newValue: 'DEALER_ASSIGNED',
        ipAddress: '10.24.18.42',
        description: 'Talep Ankara Premium Auto galerisine atandi.',
      },
      {
        id: 'act-2',
        adminId: admin.id,
        adminName: admin.fullName,
        role: 'ADMIN',
        action: 'FAST_SALE_OFFER',
        module: 'Hızlı Sat',
        recordId: 'fast-1',
        previousValue: 'UNDER_REVIEW',
        newValue: 'OFFER_SENT',
        ipAddress: '10.24.18.42',
        description: 'Kullanicıya ilk fiyat teklifi gonderildi.',
      },
    ],
  });

  await prisma.adminUserNote.createMany({
    data: [
      {
        id: 'note-1',
        userId: userOne.id,
        body: 'Aracini hafta ici 19:00 sonrasi gosterebiliyor.',
        createdBy: admin.fullName,
      },
      {
        id: 'note-2',
        userId: userThree.id,
        body: 'Hizli sat surecinde ekspertiz raporu talep edildi.',
        createdBy: admin.fullName,
      },
    ],
  });

  console.log('Seed tamamlandi.');
  console.log('Admin giris: admin@ototeklifim.com / Hakki576.');
  console.log('Demo kullanici: mert.demo@ototeklifim.com / 123456');
  console.log('Demo galeri: ankara@ototeklifimgaleri.com / 123456');
  console.log(`Olusan kayitlar: ${listings.length} ilan, 2 konsinye, 2 hizli sat talebi.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
