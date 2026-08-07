import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { z } from 'zod';

const execFileAsync = promisify(execFile);
const CACHE_TTL_MS = 30 * 60 * 1000;
const PUBLIC_HTML_TIMEOUT_MS = 12000;

export const marketCompsQuerySchema = z.object({
  brand: z.string().trim().min(1),
  model: z.string().trim().min(1),
  year: z.coerce.number().int().min(1950).max(2100).optional(),
  km: z.coerce.number().int().min(0).max(999999).optional(),
  vehicleType: z.string().trim().optional().default(''),
  bodyType: z.string().trim().optional().default(''),
  fuelType: z.string().trim().optional().default(''),
  transmission: z.string().trim().optional().default(''),
  engine: z.string().trim().optional().default(''),
  packageName: z.string().trim().optional().default(''),
});

export type MarketCompsQuery = z.infer<typeof marketCompsQuerySchema>;
export type MarketCompSource = 'arabam' | 'sahibinden' | 'blend';

type MarketCompStats = {
  min: number;
  max: number;
  median: number;
  average: number;
  trimmedAverage: number;
  lowerBand: number;
  upperBand: number;
};

type ParsedListing = {
  source: 'arabam' | 'sahibinden';
  id: number | null;
  title: string;
  price: number;
  formattedPrice: string;
  categoryName: string;
  variant: string;
  url?: string;
  year?: number | null;
  approxKm?: number | null;
  relevanceScore?: number;
  comparisonWeight?: number;
  adjustedPrice?: number;
};

export type MarketCompsResponse = {
  ok: boolean;
  source: MarketCompSource;
  sourceUrl: string | null;
  sampleSize: number;
  fallbackUsed: boolean;
  stats: MarketCompStats | null;
  listings: Array<{
    source: 'arabam' | 'sahibinden';
    id: number | null;
    title: string;
    price: number;
    formattedPrice: string;
    categoryName: string;
    variant: string;
    url?: string;
    year?: number | null;
    approxKm?: number | null;
    relevanceScore?: number;
    comparisonWeight?: number;
    adjustedPrice?: number;
  }>;
  sources: Array<{
    source: 'arabam' | 'sahibinden';
    sourceUrl: string | null;
    sampleSize: number;
    fallbackUsed: boolean;
    challengeDetected: boolean;
  }>;
  computedAt: string;
};

type SourceResponse = {
  source: 'arabam' | 'sahibinden';
  sourceUrl: string | null;
  sampleSize: number;
  fallbackUsed: boolean;
  challengeDetected: boolean;
  listings: ParsedListing[];
};

const marketCompCache = new Map<string, { expiresAt: number; payload: MarketCompsResponse }>();

function normalizeTurkish(input: string) {
  return input
    .replace(/İ/g, 'I')
    .replace(/I/g, 'I')
    .replace(/ı/g, 'i')
    .replace(/Ç/g, 'C')
    .replace(/ç/g, 'c')
    .replace(/Ğ/g, 'G')
    .replace(/ğ/g, 'g')
    .replace(/Ö/g, 'O')
    .replace(/ö/g, 'o')
    .replace(/Ş/g, 'S')
    .replace(/ş/g, 's')
    .replace(/Ü/g, 'U')
    .replace(/ü/g, 'u');
}

function normalizeText(value: string) {
  return normalizeTurkish(String(value || ''))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slugify(input: string) {
  return normalizeTurkish(String(input || ''))
    .toLowerCase()
    .replace(/&/g, ' ve ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function buildCacheKey(query: MarketCompsQuery) {
  return JSON.stringify({
    brand: query.brand,
    model: query.model,
    year: query.year || 0,
    km: query.km || 0,
    vehicleType: query.vehicleType || '',
    bodyType: query.bodyType || '',
    fuelType: query.fuelType || '',
    transmission: query.transmission || '',
    engine: query.engine || '',
    packageName: query.packageName || '',
  });
}

function getCategoryCandidates(query: MarketCompsQuery) {
  const normalized = `${query.vehicleType} ${query.bodyType}`.toLocaleLowerCase('tr-TR');
  const candidates = new Set<string>();

  if (normalized.includes('panel') || normalized.includes('camli') || normalized.includes('van')) {
    candidates.add('minivan-panelvan');
  }

  if (normalized.includes('suv') || normalized.includes('pick') || normalized.includes('roadster')) {
    candidates.add('arazi-suv-pick-up');
  }

  candidates.add('otomobil');
  candidates.add('arazi-suv-pick-up');
  candidates.add('minivan-panelvan');
  return Array.from(candidates);
}

function buildArabamPathCandidates(query: MarketCompsQuery) {
  const brandSlug = slugify(query.brand);
  const modelSlug = slugify(query.model);
  const engineSlug = slugify(query.engine || '');
  const packageSlug = slugify(query.packageName || '');
  const combos = new Set<string>();

  const engineVariants = new Set<string>();
  if (engineSlug) {
    engineVariants.add(engineSlug);
    const engineTokens = engineSlug.split('-').filter(Boolean);
    const filteredTokens = engineTokens.filter((token) => !['dsg', 'cvt', 'edc', 'tam', 'otomatik', 'manuel'].includes(token));
    if (filteredTokens.length) {
      engineVariants.add(filteredTokens.join('-'));
    }

    const trimmedPowerTokens = filteredTokens.filter((token, index) => {
      const isLast = index === filteredTokens.length - 1;
      return !(isLast && /^\d{2,3}$/.test(token));
    });
    if (trimmedPowerTokens.length) {
      engineVariants.add(trimmedPowerTokens.join('-'));
    }
  }

  for (const engineVariant of engineVariants) {
    if (engineVariant && packageSlug) combos.add(`${brandSlug}-${modelSlug}-${engineVariant}-${packageSlug}`);
    if (engineVariant) combos.add(`${brandSlug}-${modelSlug}-${engineVariant}`);
  }
  if (packageSlug) combos.add(`${brandSlug}-${modelSlug}-${packageSlug}`);
  combos.add(`${brandSlug}-${modelSlug}`);

  return Array.from(combos).filter(Boolean);
}

function buildSahibindenPathCandidates(query: MarketCompsQuery) {
  const categoryCandidates = getCategoryCandidates(query);
  const sourceCategoryMap: Record<string, string> = {
    otomobil: 'otomobil',
    'arazi-suv-pick-up': 'arazi-suv-pickup',
    'minivan-panelvan': 'minivan-panelvan',
  };
  const modelSlug = slugify(query.model);
  const engineSlug = slugify(query.engine || '');
  const fuelSlug = slugify(query.fuelType || '');
  const transmissionSlug = slugify(query.transmission || '');
  const packageSlug = slugify(query.packageName || '');

  return categoryCandidates.flatMap((category) => {
    const mappedCategory = sourceCategoryMap[category] || 'otomobil';
    const combos = new Set<string>();

    if (engineSlug) combos.add(`${mappedCategory}-${slugify(query.brand)}-${modelSlug}-${engineSlug}`);
    if (fuelSlug) combos.add(`${mappedCategory}-${slugify(query.brand)}-${modelSlug}-${fuelSlug}`);
    if (engineSlug && packageSlug) combos.add(`${mappedCategory}-${slugify(query.brand)}-${modelSlug}-${engineSlug}-${packageSlug}`);
    if (transmissionSlug) combos.add(`${mappedCategory}-${slugify(query.brand)}-${modelSlug}/${transmissionSlug}`);
    combos.add(`${mappedCategory}-${slugify(query.brand)}-${modelSlug}`);

    return Array.from(combos).map((path) => `https://www.sahibinden.com/${path}`);
  });
}

function isCloudflareChallenge(html: string) {
  const normalized = String(html || '').toLowerCase();
  return (
    normalized.includes('just a moment')
    || normalized.includes('cf_chl_opt')
    || normalized.includes('attention required')
    || normalized.includes('captcha')
    || normalized.includes('cloudflare')
  );
}

async function fetchViaCurl(url: string) {
  const { stdout } = await execFileAsync(
    'curl',
    [
      '-sS',
      '-L',
      url,
      '-H',
      'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      '-H',
      'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      '-H',
      'Accept-Language: tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      '-H',
      'Cache-Control: no-cache',
      '--max-time',
      '15',
    ],
    { maxBuffer: 8 * 1024 * 1024 },
  );

  return stdout;
}

async function fetchPublicHtml(url: string) {
  let lastHtml = '';

  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'upgrade-insecure-requests': '1',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'sec-ch-ua': '"Chromium";v="138", "Google Chrome";v="138", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      },
      signal: AbortSignal.timeout(PUBLIC_HTML_TIMEOUT_MS),
    });

    const html = await response.text();
    lastHtml = html;
    if (response.ok) {
      return html;
    }
  } catch {
    // Curl fallback below.
  }

  try {
    return await fetchViaCurl(url);
  } catch {
    return lastHtml;
  }
}

function parsePrice(value: unknown) {
  const digits = String(value || '').replace(/[^\d]/g, '');
  const numeric = Number(digits);
  return Number.isFinite(numeric) ? numeric : 0;
}

function extractNumericEngineToken(value: string) {
  const match = normalizeText(value).match(/(\d+(?:\s*\d+)?)/);
  return match ? match[1]!.replace(/\s+/g, '') : '';
}

function extractYearFromText(value: string) {
  const match = String(value || '').match(/\b(20\d{2})\b/);
  if (!match) return null;
  const year = Number(match[1]);
  return Number.isFinite(year) ? year : null;
}

function extractKmFromText(value: string) {
  const input = normalizeText(value);
  const compactPatterns = [
    /(\d{2,3})\s*bin\s*km/,
    /(\d{2,3})binkm/,
    /km\s*(\d{2,3})\s*(\d{3})/,
    /(\d{2,3})\s*(\d{3})\s*km/,
    /(\d{2,3})\s*ooo\s*km/,
  ];

  for (const pattern of compactPatterns) {
    const match = input.match(pattern);
    if (!match) continue;

    if (match[2]) {
      const km = Number(`${match[1]}${match[2]}`);
      if (Number.isFinite(km)) return km;
      continue;
    }

    const km = Number(match[1]) * 1000;
    if (Number.isFinite(km)) return km;
  }

  return null;
}

function hasAnyToken(haystack: string, tokens: string[]) {
  return tokens.some((token) => token && haystack.includes(token));
}

function isAdvertStrictMatch(
  advert: { title: string; variant: string; categoryName: string },
  query: MarketCompsQuery,
) {
  const haystack = normalizeText(`${advert.title} ${advert.variant} ${advert.categoryName}`);
  const packageNormalized = normalizeText(query.packageName || '');
  const engineNormalized = normalizeText(query.engine || '');
  const engineNumericToken = extractNumericEngineToken(query.engine || '');
  const fuelNormalized = normalizeText(query.fuelType || '');

  if (packageNormalized && packageNormalized !== 'standart' && !haystack.includes(packageNormalized)) {
    return false;
  }

  if (engineNumericToken) {
    const advertNumericToken = extractNumericEngineToken(haystack);
    if (!advertNumericToken || advertNumericToken !== engineNumericToken) {
      return false;
    }
  }

  if (engineNormalized.includes('tsi') && !haystack.includes('tsi')) return false;
  if (engineNormalized.includes('tdi') && !haystack.includes('tdi')) return false;

  if ((fuelNormalized.includes('benzin') || engineNormalized.includes('tsi')) && hasAnyToken(haystack, ['tdi', 'dizel', 'diesel'])) {
    return false;
  }

  if (fuelNormalized.includes('dizel') && !hasAnyToken(haystack, ['tdi', 'dizel', 'diesel'])) return false;
  if (fuelNormalized.includes('hibrit') && !hasAnyToken(haystack, ['hibrit', 'hybrid'])) return false;
  if (engineNormalized.includes('e tech') && !hasAnyToken(haystack, ['e tech', 'hibrit', 'hybrid'])) return false;
  if (engineNormalized.includes('hybrid') && !hasAnyToken(haystack, ['hybrid', 'hibrit', 'e tech'])) return false;

  return true;
}

function scoreAdvertRelevance(advert: ParsedListing, query: MarketCompsQuery) {
  const haystack = normalizeText(`${advert.title} ${advert.variant} ${advert.categoryName}`);
  let score = advert.source === 'arabam' ? 1.6 : 1.1;

  const packageNormalized = normalizeText(query.packageName || '');
  if (packageNormalized && packageNormalized !== 'standart') {
    if (haystack.includes(packageNormalized)) {
      score += 6;
    } else {
      const packageTokens = packageNormalized.split(' ').filter((token) => token.length >= 3);
      score += packageTokens.filter((token) => haystack.includes(token)).length * 1.4;
    }
  }

  const engineNumericToken = extractNumericEngineToken(query.engine || '');
  if (engineNumericToken && haystack.includes(engineNumericToken)) score += 3.2;

  const fuelNormalized = normalizeText(query.fuelType || '');
  if (fuelNormalized && haystack.includes(fuelNormalized.split(' ')[0] || fuelNormalized)) score += 2.2;

  const engineNormalized = normalizeText(query.engine || '');
  if (engineNormalized.includes('e tech') && hasAnyToken(haystack, ['e tech', 'hibrit', 'hybrid'])) score += 2.7;
  if (engineNormalized.includes('hybrid') && hasAnyToken(haystack, ['hybrid', 'hibrit', 'e tech'])) score += 2.7;

  const transmissionNormalized = normalizeText(query.transmission || '');
  if (transmissionNormalized && haystack.includes(transmissionNormalized)) score += 1.7;

  const bodyTypeNormalized = normalizeText(query.bodyType || query.vehicleType || '');
  if (bodyTypeNormalized && haystack.includes(bodyTypeNormalized.split(' ')[0] || bodyTypeNormalized)) score += 1.1;

  if (advert.year && query.year) {
    const yearDiff = Math.abs(advert.year - query.year);
    if (yearDiff === 0) score += 4.6;
    else if (yearDiff === 1) score += 2.4;
    else if (yearDiff === 2) score -= 2;
    else score -= 8;
  }

  if (advert.approxKm && query.km) {
    const kmDiff = Math.abs(advert.approxKm - query.km);
    if (kmDiff <= 10000) score += 3.2;
    else if (kmDiff <= 25000) score += 1.8;
    else if (kmDiff >= 90000) score -= 6;
  }

  return score;
}

function isYearKmCompatible(advert: ParsedListing, query: MarketCompsQuery) {
  if (advert.year && query.year && Math.abs(advert.year - query.year) > 2) {
    return false;
  }

  if (advert.approxKm && query.km && Math.abs(advert.approxKm - query.km) > 80000) {
    return false;
  }

  return true;
}

function isSuspiciousCommercialListing(advert: ParsedListing) {
  const haystack = normalizeText(`${advert.title} ${advert.variant} ${advert.url || ''}`);
  return [
    'senet',
    'pesinat',
    'kredi',
    'aylik odeme',
    'aylik taksit',
    'devirli',
    'kiralama',
    'rent a car',
  ].some((token) => haystack.includes(token));
}

function calculateYearNormalization(advertYear: number | null | undefined, queryYear: number | undefined) {
  if (!advertYear || !queryYear) return 0;
  const diff = queryYear - advertYear;
  if (diff === 0) return 0;
  const perYear = queryYear >= 2022 ? 55000 : 42000;
  return diff * perYear;
}

function calculateKmNormalization(advertKm: number | null | undefined, queryKm: number | undefined) {
  if (!advertKm || !queryKm) return 0;
  const diff = queryKm - advertKm;
  const ratePerKm =
    queryKm <= 60000 ? 1.2
      : queryKm <= 100000 ? 0.95
        : 0.75;
  return Math.round(diff * ratePerKm);
}

function buildComparableListing(advert: ParsedListing, query: MarketCompsQuery) {
  const relevanceScore = scoreAdvertRelevance(advert, query);
  const adjustedPrice = Math.max(
    0,
    advert.price + calculateYearNormalization(advert.year, query.year) + calculateKmNormalization(advert.approxKm, query.km),
  );

  let comparisonWeight = Math.max(0.35, 1 + (relevanceScore / 8));
  if (advert.year) comparisonWeight += 0.2;
  if (advert.approxKm) comparisonWeight += 0.25;
  if (advert.source === 'arabam') comparisonWeight += 0.12;

  if (query.year && advert.year) {
    const yearDiff = Math.abs(query.year - advert.year);
    if (yearDiff === 0) comparisonWeight += 0.35;
    else if (yearDiff === 1) comparisonWeight += 0.12;
    else if (yearDiff >= 3) comparisonWeight -= 0.25;
  }

  if (query.km && advert.approxKm) {
    const kmDiff = Math.abs(query.km - advert.approxKm);
    if (kmDiff <= 15000) comparisonWeight += 0.25;
    else if (kmDiff >= 70000) comparisonWeight -= 0.2;
  }

  return {
    ...advert,
    relevanceScore: Number(relevanceScore.toFixed(2)),
    comparisonWeight: Number(Math.max(0.25, comparisonWeight).toFixed(3)),
    adjustedPrice: Math.round(adjustedPrice),
  };
}

function weightedAverage(values: Array<{ value: number; weight: number }>) {
  const totalWeight = values.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return 0;
  return values.reduce((sum, item) => sum + (item.value * item.weight), 0) / totalWeight;
}

function weightedQuantile(values: Array<{ value: number; weight: number }>, ratio: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left.value - right.value);
  const totalWeight = sorted.reduce((sum, item) => sum + item.weight, 0);
  const target = totalWeight * Math.max(0, Math.min(1, ratio));
  let running = 0;

  for (const item of sorted) {
    running += item.weight;
    if (running >= target) {
      return item.value;
    }
  }

  return sorted[sorted.length - 1]!.value;
}

function buildStats(listings: ParsedListing[]) {
  if (!listings.length) return null;

  const weightedValues = listings.map((item) => ({
    value: item.adjustedPrice || item.price,
    weight: item.comparisonWeight || 1,
  }));
  const sorted = [...weightedValues].sort((left, right) => left.value - right.value);
  const weightedMedianValue = weightedQuantile(sorted, 0.5);
  const lowerFence = weightedMedianValue * 0.84;
  const upperFence = weightedMedianValue * 1.16;
  const trimmed = sorted.filter((item) => item.value >= lowerFence && item.value <= upperFence);
  const trimmedValues = trimmed.length >= 3 ? trimmed : sorted;

  return {
    min: Math.round(sorted[0]!.value),
    max: Math.round(sorted[sorted.length - 1]!.value),
    median: Math.round(weightedMedianValue),
    average: Math.round(weightedAverage(sorted)),
    trimmedAverage: Math.round(weightedAverage(trimmedValues)),
    lowerBand: Math.round(weightedQuantile(trimmedValues, 0.18)),
    upperBand: Math.round(weightedQuantile(trimmedValues, 0.82)),
  };
}

function parseArabamAdverts(html: string) {
  const match = html.match(/var adverts = (\[[\s\S]*?\]);/);
  if (!match) return [];

  try {
    return JSON.parse(match[1]) as Array<Record<string, unknown>>;
  } catch {
    return [];
  }
}

function parseArabamInsiderListings(html: string): ParsedListing[] {
  const regex = /insiderArray\.push\(\{\s*"id":\s*"([^"]+)"[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"unit_price":\s*parseFloat\(\("([^"]+)"\)[\s\S]*?"url":\s*window\.location\.origin \+\s*"([^"]+)"/g;
  const listings: ParsedListing[] = [];

  for (const match of html.matchAll(regex)) {
    const [, idRaw, nameRaw, formattedPriceRaw, relativeUrlRaw] = match;
    const formattedPrice = `${formattedPriceRaw}`.trim();
    const price = parsePrice(formattedPrice);
    const relativeUrl = String(relativeUrlRaw || '').trim();
    const title = String(nameRaw || '').trim();

    if (!price || !relativeUrl || !title) continue;

    const decodedUrl = decodeURIComponent(relativeUrl);
    listings.push({
      source: 'arabam',
      id: Number.isFinite(Number(idRaw)) ? Number(idRaw) : null,
      title,
      price,
      formattedPrice,
      categoryName: '',
      variant: title,
      url: decodedUrl,
      year: extractYearFromText(decodedUrl),
      approxKm: extractKmFromText(decodedUrl),
    });
  }

  return listings;
}

function parseSahibindenListings(html: string): ParsedListing[] {
  const listings: ParsedListing[] = [];
  const seen = new Set<string>();
  const itemListRegex = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;

  for (const match of html.matchAll(itemListRegex)) {
    const raw = match[1]?.trim();
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw) as Record<string, unknown> | Array<Record<string, unknown>>;
      const records = Array.isArray(parsed) ? parsed : [parsed];

      for (const record of records) {
        const items = Array.isArray(record.itemListElement) ? record.itemListElement : [];
        for (const item of items) {
          const listing = typeof item === 'object' && item ? (item as Record<string, unknown>) : null;
          const payload = listing && typeof listing.item === 'object' ? (listing.item as Record<string, unknown>) : listing;
          if (!payload) continue;

          const title = String(payload.name || '').trim();
          const url = String(payload.url || '').trim();
          const formattedPrice = String((payload.offers as Record<string, unknown> | undefined)?.price || payload.price || '').trim();
          const price = parsePrice(formattedPrice);
          if (!title || !url || !price) continue;

          const dedupeKey = `${title}|${price}|${url}`;
          if (seen.has(dedupeKey)) continue;
          seen.add(dedupeKey);

          listings.push({
            source: 'sahibinden',
            id: null,
            title,
            price,
            formattedPrice: formattedPrice || `${price}`,
            categoryName: String(payload.category || '').trim(),
            variant: String(payload.description || title).trim(),
            url,
            year: extractYearFromText(`${title} ${payload.description || ''} ${url}`),
            approxKm: extractKmFromText(`${title} ${payload.description || ''} ${url}`),
          });
        }
      }
    } catch {
      continue;
    }
  }

  return listings;
}

function selectComparableListings(
  source: 'arabam' | 'sahibinden',
  adverts: ParsedListing[],
  query: MarketCompsQuery,
  requiresHighSpecificity: boolean,
) {
  const scoredAdverts = adverts.map((item) => buildComparableListing(item, query));
  const strictAdverts = scoredAdverts.filter((item) => (
    isAdvertStrictMatch(item, query)
    && isYearKmCompatible(item, query)
    && !isSuspiciousCommercialListing(item)
  ));
  const relevantAdverts = scoredAdverts
    .filter((item) => item.relevanceScore && item.relevanceScore >= (source === 'arabam' ? 2 : 1.4))
    .filter((item) => !isSuspiciousCommercialListing(item))
    .sort((left, right) => (
      (right.comparisonWeight || 0) - (left.comparisonWeight || 0)
      || (right.relevanceScore || 0) - (left.relevanceScore || 0)
      || left.price - right.price
    ));

  if (strictAdverts.length >= 2) {
    return strictAdverts.sort((left, right) => (
      (right.comparisonWeight || 0) - (left.comparisonWeight || 0)
      || (right.relevanceScore || 0) - (left.relevanceScore || 0)
      || left.price - right.price
    ));
  }

  if (!requiresHighSpecificity && relevantAdverts.length >= 3) {
    return relevantAdverts;
  }

  return requiresHighSpecificity ? [] : scoredAdverts.slice(0, 8);
}

async function resolveArabamComps(query: MarketCompsQuery): Promise<SourceResponse> {
  const categories = getCategoryCandidates(query);
  const paths = buildArabamPathCandidates(query);
  const requiresHighSpecificity = Boolean(
    String(query.packageName || '').trim()
    || String(query.engine || '').trim()
    || String(query.fuelType || '').trim(),
  );

  for (const category of categories) {
    for (const path of paths) {
      const url = `https://www.arabam.com/ikinci-el/${category}/${path}`;
      const html = await fetchPublicHtml(url);
      if (isCloudflareChallenge(html)) {
        continue;
      }

      const insiderListings = parseArabamInsiderListings(html);
      const parsedAdverts = (insiderListings.length ? insiderListings : parseArabamAdverts(html)
        .map((item) => {
          const price = parsePrice(item.FormattedPrice);
          return {
            source: 'arabam' as const,
            id: typeof item.Id === 'number' ? item.Id : null,
            title: String(item.ModelName || item.Title || '').trim(),
            price,
            formattedPrice: String(item.FormattedPrice || '').trim(),
            categoryName: String(item.CategoryName || '').trim(),
            variant: String(item.Variant || '').trim(),
          };
        }))
        .filter((item) => item.price > 0);

      if (parsedAdverts.length < 3) continue;

      const listings = selectComparableListings('arabam', parsedAdverts, query, requiresHighSpecificity);
      if (!listings.length) continue;

      return {
        source: 'arabam',
        sourceUrl: url,
        sampleSize: listings.length,
        fallbackUsed: listings.length < 3,
        challengeDetected: false,
        listings: listings.slice(0, 14),
      };
    }
  }

  if (requiresHighSpecificity) {
    return resolveArabamComps({
      ...query,
      fuelType: '',
      transmission: '',
      engine: '',
      packageName: '',
    });
  }

  return {
    source: 'arabam',
    sourceUrl: null,
    sampleSize: 0,
    fallbackUsed: true,
    challengeDetected: false,
    listings: [],
  };
}

async function resolveSahibindenComps(query: MarketCompsQuery): Promise<SourceResponse> {
  const paths = buildSahibindenPathCandidates(query);
  const requiresHighSpecificity = Boolean(
    String(query.packageName || '').trim()
    || String(query.engine || '').trim()
    || String(query.fuelType || '').trim(),
  );
  let challengeDetected = false;

  for (const url of paths) {
    const html = await fetchPublicHtml(url);
    if (isCloudflareChallenge(html)) {
      challengeDetected = true;
      continue;
    }

    const parsedListings = parseSahibindenListings(html).filter((item) => item.price > 0);
    if (parsedListings.length < 2) continue;

    const listings = selectComparableListings('sahibinden', parsedListings, query, requiresHighSpecificity);
    if (!listings.length) continue;

    return {
      source: 'sahibinden',
      sourceUrl: url,
      sampleSize: listings.length,
      fallbackUsed: listings.length < 3,
      challengeDetected,
      listings: listings.slice(0, 10),
    };
  }

  return {
    source: 'sahibinden',
    sourceUrl: null,
    sampleSize: 0,
    fallbackUsed: true,
    challengeDetected,
    listings: [],
  };
}

function dedupeListings(listings: ParsedListing[]) {
  const seen = new Set<string>();
  const deduped: ParsedListing[] = [];

  for (const item of listings) {
    const key = `${normalizeText(item.title)}|${item.price}|${normalizeText(item.url || '')}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped;
}

function buildMergedResponse(query: MarketCompsQuery, sources: SourceResponse[]): MarketCompsResponse {
  const mergedListings = dedupeListings(
    sources.flatMap((source) => source.listings)
      .sort((left, right) => (
        (right.comparisonWeight || 0) - (left.comparisonWeight || 0)
        || (right.relevanceScore || 0) - (left.relevanceScore || 0)
        || (left.adjustedPrice || left.price) - (right.adjustedPrice || right.price)
      )),
  ).slice(0, 16);

  const stats = buildStats(mergedListings);
  const activeSources = sources.filter((source) => source.sampleSize > 0);
  const fallbackUsed = activeSources.length === 0 || activeSources.every((source) => source.fallbackUsed);
  const primarySourceUrl = activeSources.find((source) => source.source === 'arabam')?.sourceUrl
    || activeSources[0]?.sourceUrl
    || null;
  const sourceName: MarketCompSource = activeSources.length >= 2
    ? 'blend'
    : (activeSources[0]?.source || (sources.some((source) => source.source === 'arabam') ? 'arabam' : 'sahibinden'));

  return {
    ok: true,
    source: sourceName,
    sourceUrl: primarySourceUrl,
    sampleSize: mergedListings.length,
    fallbackUsed,
    stats,
    listings: mergedListings.map((item) => ({
      source: item.source,
      id: item.id,
      title: item.title,
      price: item.price,
      formattedPrice: item.formattedPrice,
      categoryName: item.categoryName,
      variant: item.variant,
      url: item.url,
      year: item.year ?? null,
      approxKm: item.approxKm ?? null,
      relevanceScore: item.relevanceScore,
      comparisonWeight: item.comparisonWeight,
      adjustedPrice: item.adjustedPrice,
    })),
    sources: sources.map((source) => ({
      source: source.source,
      sourceUrl: source.sourceUrl,
      sampleSize: source.sampleSize,
      fallbackUsed: source.fallbackUsed,
      challengeDetected: source.challengeDetected,
    })),
    computedAt: new Date().toISOString(),
  };
}

export async function getMarketComps(query: MarketCompsQuery) {
  const parsed = marketCompsQuerySchema.parse(query);
  const cacheKey = buildCacheKey(parsed);
  const cached = marketCompCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.payload;
  }

  const sourceResponses = await Promise.all([
    resolveArabamComps(parsed),
    resolveSahibindenComps(parsed),
  ]);
  const payload = buildMergedResponse(parsed, sourceResponses);

  marketCompCache.set(cacheKey, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    payload,
  });

  return payload;
}
