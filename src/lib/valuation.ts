import { z } from 'zod';

import { getMarketComps } from './market-comps.js';

export const valuationVehicleInfoSchema = z.object({
  vehicleType: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  packageName: z.string().min(1).default('Standart'),
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

const structuralConditionSchema = z.enum(['Belirtilmedi', 'clean', 'issue', 'Temiz', 'İşlemli', 'Sorun yok', 'İşlem / sorun var']);

export const valuationConditionSchema = z.object({
  tramerAmount: z.number().min(0).default(0),
  severeDamage: z.boolean().default(false),
  paintedParts: z.array(z.string()).default([]),
  changedParts: z.array(z.string()).default([]),
  mechanicalStatus: z.string().min(1).default('Bilgi paylasilmadi'),
  maintenanceHistory: z.string().min(1).default('Bilgi paylasilmadi'),
  appraisalReport: z.string().optional().default(''),
  airbagCondition: structuralConditionSchema.optional().default('Belirtilmedi'),
  chassisPodyeCondition: structuralConditionSchema.optional().default('Belirtilmedi'),
  pillarCondition: structuralConditionSchema.optional().default('Belirtilmedi'),
  criticalChecks: z.array(z.object({
    key: z.string().min(1),
    label: z.string().min(1),
    status: structuralConditionSchema,
  })).default([]),
  damageParts: z.array(z.object({
    key: z.string().min(1),
    label: z.string().min(1),
    status: z.enum(['Orijinal', 'Lokal Boyali', 'Boyali', 'Onarimli', 'Degisen']),
  })).default([]),
});

export const valuationEstimateInputSchema = z.object({
  vehicleInfo: valuationVehicleInfoSchema,
  condition: valuationConditionSchema,
  extraKey: z.boolean().optional().default(false),
  serviceHistory: z.boolean().optional().default(false),
});

export type ValuationEstimateInput = z.infer<typeof valuationEstimateInputSchema>;

type StructuralState = 'clean' | 'issue' | 'Belirtilmedi';

function normalizeStructuralState(value: string | undefined): StructuralState {
  if (value === 'clean' || value === 'Temiz' || value === 'Sorun yok') return 'clean';
  if (value === 'issue' || value === 'İşlemli' || value === 'İşlem / sorun var') return 'issue';
  return 'Belirtilmedi';
}

function parseEngineScore(engineValue: string, enginePower: string) {
  const normalized = `${engineValue || ''} ${enginePower || ''}`
    .replace(',', '.')
    .toLocaleLowerCase('tr-TR');
  if (!normalized.trim()) return 0;

  const literMatch = normalized.match(/(\d+(?:\.\d+)?)/);
  const powerMatch = normalized.match(/(\d{2,3})\s*(hp|bg|ps|kw)/);
  const literBoost = literMatch ? Math.max(-45000, (Number(literMatch[1]) - 1.2) * 90000) : 0;
  const powerBoost = powerMatch ? Math.max(-25000, (Number(powerMatch[1]) - 100) * 900) : 0;

  if (normalized.includes('electric') || normalized.includes('elektrik') || normalized.includes('ev')) {
    return literBoost + powerBoost + 120000;
  }

  return literBoost + powerBoost;
}

function getYearAdjustment(year: number) {
  const currentYear = new Date().getFullYear();
  const age = year ? currentYear - Number(year) : 0;
  if (!age || age <= 0) return 120000;
  if (age === 1) return 80000;
  if (age === 2) return 40000;
  if (age === 3) return 0;
  if (age <= 5) return -(age - 3) * 25000;
  return -50000 - ((age - 5) * 40000);
}

function getKmPenalty(km: number) {
  if (!km) return 0;
  if (km <= 50000) return km * 0.55;
  if (km <= 100000) return 27500 + ((km - 50000) * 0.95);
  if (km <= 180000) return 75000 + ((km - 100000) * 1.25);
  return 175000 + ((Math.min(km, 260000) - 180000) * 1.55);
}

function getPackageTierBoost(packageName: string) {
  const normalized = String(packageName || '').toLocaleLowerCase('tr-TR');
  if (!normalized) return 0;

  const premiumKeywords = ['premium', 'prestige', 'executive', 'exclusive', 'elite', 'design', 'excellence', 'flagship', 'autobiography', 'platinum', 'quattro'];
  const sportKeywords = ['m sport', 'amg', 's line', 'gt line', 'fr', 'r-line', 'black edition', 'veloce', 'f sport'];
  const entryKeywords = ['base', 'easy', 'essential', 'vision', 'jump', 'prime', 'standart'];

  if (sportKeywords.some((keyword) => normalized.includes(keyword))) return 120000;
  if (premiumKeywords.some((keyword) => normalized.includes(keyword))) return 80000;
  if (entryKeywords.some((keyword) => normalized.includes(keyword))) return -25000;
  return 15000;
}

function toRoundedCurrency(value: number) {
  return Math.max(0, Math.round(value));
}

function buildValuationSummary(
  input: ValuationEstimateInput,
  result: Awaited<ReturnType<typeof estimateVehicleValue>>,
) {
  return [
    `${input.vehicleInfo.year} ${input.vehicleInfo.brand} ${input.vehicleInfo.model}`,
    `${new Intl.NumberFormat('tr-TR').format(input.vehicleInfo.mileage)} KM`,
    `${result.demand} talep`,
    `${result.saleWindow} satis penceresi`,
    result.marketComps?.sampleSize ? `${result.marketComps.sampleSize} emsal ilan dogrulamasi` : '',
    result.positives.length ? `Artilar: ${result.positives.join(', ')}` : '',
    result.negatives.length ? `Dikkat: ${result.negatives.join(', ')}` : '',
  ].filter(Boolean).join(' | ');
}

export async function estimateVehicleValue(rawInput: ValuationEstimateInput) {
  const input = valuationEstimateInputSchema.parse(rawInput);

  const baseByBrand: Record<string, number> = {
    BMW: 2140000,
    'Mercedes-Benz': 2360000,
    Volkswagen: 1360000,
    Audi: 2050000,
    Tesla: 2540000,
    Dacia: 1020000,
    Renault: 1140000,
    Fiat: 960000,
    Toyota: 1320000,
    Peugeot: 1290000,
    Ford: 1220000,
    Skoda: 1240000,
    Hyundai: 1200000,
    Kia: 1230000,
    Opel: 1170000,
    Nissan: 1280000,
    'Citroën': 1210000,
    'Land Rover': 2980000,
    Volvo: 2320000,
    Porsche: 4380000,
  };

  const bodyTypeAdjustments: Record<string, number> = {
    SUV: 180000,
    Sedan: 60000,
    Hatchback: -45000,
    MPV: 85000,
    'Pick up': 320000,
    StationWagon: 70000,
    'Panel van': 120000,
    Roadster: 420000,
    'Camlı van': 110000,
    'SUV Coupe': 220000,
    Crossover: 145000,
  };

  const modelAdjustments: Record<string, number> = {
    'Volkswagen|Passat': 140000,
    'Volkswagen|Tiguan': 240000,
    'Volkswagen|Touareg': 980000,
    'Volkswagen|Amarok': 700000,
    'Volkswagen|Transporter': 360000,
    'Volkswagen|Caravelle': 460000,
    'Volkswagen|Caddy': 170000,
    'Volkswagen|Golf': 90000,
    'Volkswagen|Polo': -240000,
    'Volkswagen|Jetta': 50000,
    'Volkswagen|T-Roc': 180000,
    'Volkswagen|Taigo': 110000,
    'Volkswagen|Arteon': 460000,
    'Renault|Megane': 70000,
    'Renault|Clio': -80000,
    'Renault|Captur': 110000,
    'Renault|Austral': 280000,
    'Toyota|Corolla': 120000,
    'Toyota|Corolla Cross': 210000,
    'Toyota|C-HR': 190000,
    'Toyota|Hilux': 620000,
    'Dacia|Duster': 150000,
    'Dacia|Jogger': 90000,
    'Peugeot|3008': 260000,
    'Peugeot|5008': 340000,
    'Ford|Focus': 80000,
    'Ford|Ranger': 740000,
    'Land Rover|Range Rover Evoque': 420000,
    'Land Rover|Range Rover Velar': 760000,
    'Land Rover|Discovery Sport': 360000,
    'Land Rover|Defender': 1180000,
  };

  const brandBase = baseByBrand[input.vehicleInfo.brand] || 1520000;
  const modelBase = modelAdjustments[`${input.vehicleInfo.brand}|${input.vehicleInfo.model}`] || 0;
  const bodyTypeBase = bodyTypeAdjustments[input.vehicleInfo.bodyType] || bodyTypeAdjustments[input.vehicleInfo.vehicleType] || 0;
  const yearAdjustment = getYearAdjustment(input.vehicleInfo.year);
  const kmPenalty = getKmPenalty(input.vehicleInfo.mileage);
  const engineBoost = parseEngineScore(input.vehicleInfo.engineVolume, input.vehicleInfo.enginePower || '');
  const normalizedFuel = input.vehicleInfo.fuelType.toLocaleLowerCase('tr-TR');
  const fuelBoost =
    normalizedFuel.includes('elektrik') ? 120000
      : normalizedFuel.includes('hibrit') || normalizedFuel.includes('hybrit') ? 60000
        : normalizedFuel.includes('lpg') ? 10000
          : normalizedFuel.includes('dizel') ? 25000
            : 0;
  const transmissionBoost =
    input.vehicleInfo.transmission === 'Otomatik' ? 30000
      : input.vehicleInfo.transmission === 'Manuel' ? -15000
        : 0;

  const packageBoost = getPackageTierBoost(input.vehicleInfo.packageName);
  const maintenanceBoost = input.serviceHistory ? 25000 : input.condition.maintenanceHistory.toLocaleLowerCase('tr-TR').includes('mevcut') ? 18000 : -20000;
  const extraKeyBoost = input.extraKey ? 10000 : -8000;

  const damageParts = input.condition.damageParts || [];
  const paintedCount = damageParts.filter((part) => part.status === 'Boyali' || part.status === 'Onarimli').length || input.condition.paintedParts.length;
  const localCount = damageParts.filter((part) => part.status === 'Lokal Boyali').length;
  const changedCount = damageParts.filter((part) => part.status === 'Degisen').length || input.condition.changedParts.length;
  const conditionPenalty = (paintedCount * 9000) + (localCount * 6000) + (changedCount * 32000);

  const airbagState = normalizeStructuralState(input.condition.airbagCondition);
  const chassisState = normalizeStructuralState(input.condition.chassisPodyeCondition);
  const pillarState = normalizeStructuralState(input.condition.pillarCondition);
  const structuralPenalty =
    (airbagState === 'issue' ? 90000 : 0)
    + (chassisState === 'issue' ? 180000 : 0)
    + (pillarState === 'issue' ? 140000 : 0);

  const tramerRatio = brandBase > 0 ? Math.min(0.22, input.condition.tramerAmount / brandBase) : 0;
  const tramerPenalty = Math.min(brandBase * 0.22, (input.condition.tramerAmount * 0.55) + (brandBase * tramerRatio * 0.12));
  const severeDamagePenalty = input.condition.severeDamage ? Math.max(85000, brandBase * 0.055) : 0;

  const heuristicEstimate = Math.max(
    520000,
    brandBase
      + modelBase
      + bodyTypeBase
      + yearAdjustment
      + engineBoost
      + fuelBoost
      + transmissionBoost
      + packageBoost
      + maintenanceBoost
      + extraKeyBoost
      - kmPenalty
      - tramerPenalty
      - conditionPenalty
      - structuralPenalty
      - severeDamagePenalty,
  );

  const severityScore =
    (input.vehicleInfo.mileage > 120000 ? 1 : 0)
    + (input.condition.tramerAmount > 0 ? 1 : 0)
    + changedCount
    + Math.floor(paintedCount / 2)
    + (airbagState === 'issue' ? 1 : 0)
    + (chassisState === 'issue' ? 2 : 0)
    + (pillarState === 'issue' ? 2 : 0);

  const highDemandBrands = ['Tesla', 'BMW', 'Mercedes-Benz', 'Toyota', 'Volkswagen', 'Land Rover'];
  const demand = highDemandBrands.includes(input.vehicleInfo.brand) ? 'Yüksek' : 'Dengeli';

  const marketComps = await getMarketComps({
    brand: input.vehicleInfo.brand,
    model: input.vehicleInfo.model,
    year: input.vehicleInfo.year,
    km: input.vehicleInfo.mileage,
    vehicleType: input.vehicleInfo.vehicleType,
    bodyType: input.vehicleInfo.bodyType,
    fuelType: input.vehicleInfo.fuelType,
    transmission: input.vehicleInfo.transmission,
    engine: input.vehicleInfo.engineVolume,
    packageName: input.vehicleInfo.packageName,
  }).catch(() => null);

  let estimate = heuristicEstimate;
  let minimum = heuristicEstimate * (demand === 'Yüksek' ? 0.965 : 0.955);
  let maximum = heuristicEstimate * (demand === 'Yüksek' ? 1.055 : 1.045);

  if (marketComps?.stats) {
    const sampleSize = Number(marketComps.sampleSize || 0);
    const confidence = Math.min(0.78, 0.22 + ((sampleSize / 12) * 0.56));
    const marketAnchor = Math.round(
      (Number(marketComps.stats.trimmedAverage || 0) * 0.7)
      + (Number(marketComps.stats.median || 0) * 0.3),
    );
    estimate = Math.round((marketAnchor * confidence) + (heuristicEstimate * (1 - confidence)));
    minimum = Math.round((Number(marketComps.stats.lowerBand || estimate * 0.97) * 0.85) + (estimate * 0.15));
    maximum = Math.round((Number(marketComps.stats.upperBand || estimate * 1.03) * 0.85) + (estimate * 0.15));
  }

  const galleryMultiplier = severityScore >= 4 ? 0.905 : demand === 'Yüksek' ? 0.945 : 0.932;
  const quickMultiplier = severityScore >= 4 ? 0.875 : demand === 'Yüksek' ? 0.918 : 0.902;
  const galleryValue = estimate * galleryMultiplier;
  const quickValue = estimate * quickMultiplier;
  const privateBand = estimate * 1.028;
  const saleWindow = severityScore >= 4 ? '28 - 45 Gün' : demand === 'Yüksek' ? '14 - 28 Gün' : '18 - 34 Gün';

  const positives = [
    input.vehicleInfo.mileage && input.vehicleInfo.mileage < 50000 ? `Düşük kilometre (${new Intl.NumberFormat('tr-TR').format(input.vehicleInfo.mileage)} KM)` : null,
    input.vehicleInfo.packageName ? `${input.vehicleInfo.packageName} donanım seviyesi` : null,
    input.serviceHistory ? 'Yetkili/Belgeli bakım geçmişi' : null,
    input.vehicleInfo.transmission === 'Otomatik' ? 'Otomatik vites talebi destekliyor' : null,
    marketComps?.sampleSize ? `${marketComps.sampleSize} emsal ilan ile piyasa doğrulaması yapıldı` : null,
  ].filter(Boolean) as string[];

  const negatives = [
    input.vehicleInfo.transmission === 'Manuel' ? 'Manuel vites talebi sınırlıyor' : null,
    input.condition.tramerAmount > 0 ? `Tramer kaydı (${new Intl.NumberFormat('tr-TR').format(input.condition.tramerAmount)} TL) fiyatı aşağı çekiyor` : null,
    changedCount ? `${changedCount} parça değişen kaydı var` : null,
    input.vehicleInfo.mileage > 140000 ? 'Yüksek kilometre pazarlığı artırabilir' : null,
    airbagState === 'issue' ? 'Airbag kaydı teklif seviyesini aşağı çeker' : null,
    chassisState === 'issue' ? 'Şase/Podye kaydı ciddi değer baskısı oluşturur' : null,
    pillarState === 'issue' ? 'Direk işlemi alıcı güvenini düşürür' : null,
  ].filter(Boolean) as string[];

  return {
    estimate: toRoundedCurrency(estimate),
    minimum: toRoundedCurrency(minimum),
    maximum: toRoundedCurrency(maximum),
    galleryValue: toRoundedCurrency(galleryValue),
    quickValue: toRoundedCurrency(quickValue),
    privateBand: toRoundedCurrency(privateBand),
    demand,
    saleWindow,
    paintedCount,
    localCount,
    changedCount,
    positives: positives.length ? positives : ['Bakımlı görünüm ve güncel piyasa ilgisi'],
    negatives: negatives.length ? negatives : ['Ek ekspertiz raporu ile fiyat daha da netleşebilir'],
    confidenceScore: marketComps?.sampleSize
      ? Math.min(92, 54 + (marketComps.sampleSize * 3) - (severityScore * 2))
      : Math.max(46, 62 - (severityScore * 3)),
    marketComps: marketComps?.stats
      ? {
        source: marketComps.source || 'arabam',
        sourceUrl: marketComps.sourceUrl || '',
        sampleSize: Number(marketComps.sampleSize || 0),
        average: Number(marketComps.stats.average || 0),
        median: Number(marketComps.stats.median || 0),
        trimmedAverage: Number(marketComps.stats.trimmedAverage || 0),
        fallbackUsed: Boolean(marketComps.fallbackUsed),
      }
      : null,
  };
}

export function buildEstimatedFastSaleNumbers(input: ValuationEstimateInput) {
  return estimateVehicleValue(input).then((result) => ({
    result,
    estimatedMarketValue: result.estimate,
    quickSaleValue: result.quickValue,
    dealerBuyValue: result.galleryValue,
    expectedPrice: result.estimate,
    valuationSummary: buildValuationSummary(input, result),
  }));
}
