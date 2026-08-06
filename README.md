# OtoTeklifim Backend

Fastify + Prisma + MySQL tabanli API.

## Yerel calisan kurulum

1. MySQL 8 kur ve baslat:

```bash
brew install mysql
brew services start mysql
```

2. Veritabanini olustur:

```bash
mysql -uroot -e "CREATE DATABASE IF NOT EXISTS ototeklifim CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

3. `.env.example` dosyasini `.env` olarak kullan:

```bash
DATABASE_URL="mysql://root:password@127.0.0.1:3306/ototeklifim"
PORT=3001
ADMIN_EMAIL=admin@ototeklifim.com
ADMIN_PASSWORD=Hakki576.
ADMIN_FULL_NAME="Mert Yönetim"
ADMIN_PHONE=05550000010
ADMIN_CITY=Istanbul
ADMIN_DISTRICT=Kadikoy
```

4. Prisma + seed:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Sunucuyu baslat:

```bash
npm run build
npm start
```

## Railway yayinlama

Backend Railway uzerinde MySQL ile calisacak sekilde hazirlandi.

Gerekli environment variable'lar:

```bash
DATABASE_URL=mysql://...
PORT=3001
ADMIN_EMAIL=admin@ototeklifim.com
ADMIN_PASSWORD=Hakki576.
ADMIN_FULL_NAME="Mert Yönetim"
ADMIN_PHONE=05550000010
ADMIN_CITY=Istanbul
ADMIN_DISTRICT=Kadikoy
VALUATION_AUTO_CALIBRATION_ENABLED=1
```

Railway start komutu `npm start` ile acilir; bu komut uygulama kalkmadan once otomatik `prisma db push` calistirir.

## Admin seed

Admin hesabi `ADMIN_*` env degiskenlerinden okunur. Env verilmezse varsayilan olarak su bilgiler kullanilir:

- Admin: `admin@ototeklifim.com` / `Hakki576.`

## Demo hesaplar

- Alici: `alici@ototeklifim.local` / `123456`
- Satici: `satici@ototeklifim.local` / `123456`

## Mobil baglanti

Flutter app icin `API_BASE_URL` su olmali:

```bash
http://127.0.0.1:3001/api
```

Android emulator kullanirsan:

```bash
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3001/api
```

## Ilk endpointler

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/listings`
- `GET /api/listings/:id`
- `POST /api/listings`
- `GET /api/me/listings`
- `POST /api/consignments`
- `GET /api/me/consignments`
- `GET /api/consignments/:id`
- `GET /api/consignments/reference/:referenceNo`
- `GET /api/auctions`
- `POST /api/auctions`
- `POST /api/auctions/:id/bids`
- `GET /api/admin/dashboard`
- `GET /api/admin/listings/pending`
- `POST /api/admin/listings/:id/status`
- `GET /api/admin/consignments`
- `POST /api/admin/consignments/:id/status`
- `GET /api/admin/dealers`

## Degerleme motoru notlari

- Market comps katmani artik cok kaynakli calisir: `arabam` ana kaynak, `sahibinden` ise challenge-aware ikinci kaynak olarak weighted blend akisina baglidir.
- Emsal istatistikleri artik yil ve kilometre farkini comp katmaninda normalize ederek hesaplar; listing'ler relevance ve comparison weight ile agirliklandirilir.
- Haftalik otomatik model kalibrasyonu acilis sonrasi arka planda kontrol edilir. Son 45 gundeki hizli sat taleplerinden yeterli ornek bulunan marka/model'lerde model multiplier otomatik guncellenir.
- Elle kalibrasyon calistirmak icin:

```bash
npm run calibrate:valuation
```

## Konsinye veri modeli

Konsinye akisinda ilan sisteminden ayri su veri yapisi tutulur:

- `ConsignmentRequest`: basvuru sahibi, durum, arac/hasar/beklenti onay snapshot'i
- `ConsignmentPhoto`: kategori, siralama, kapak bilgisi ve upload URL'i
- `DealerAssignment`: dogrulanmis galeri atamasi ve durum notu
- `ConsignmentTimeline`: operasyonel surec adimlari

Bu yapi public listeleme uretmez; araclar yalnizca basvuru sahibi, admin ve atanmis galeri tarafindan gorulur.
