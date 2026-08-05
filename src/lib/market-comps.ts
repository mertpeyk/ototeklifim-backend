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

export type MarketCompsResponse = {
  ok: boolean;
  source: 'arabam';
  sourceUrl: string | null;
  sampleSize: number;
  fallbackUsed: boolean;
  stats: {
    min: number;
    max: number;
    median: number;
    average: number;
    trimmedAverage: number;
    lowerBand: number;
    upperBand: number;
  } | null;
  listings: Array<{
    id: number | null;
    title: string;
    price: number;
    formattedPrice: string;
    categoryName: string;
    variant: string;
  }>;
  computedAt: string;
};

type ParsedArabamListing = {
  id: number | null;
  title: string;
  price: number;
  formattedPrice: string;
  categoryName: string;
  variant: string;
  url?: string;
  year?: number | null;
  approxKm?: number | null;
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

function slugifyArabam(input: string) {
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

function buildPathCandidates(query: MarketCompsQuery) {
  const brandSlug = slugifyArabam(query.brand);
  const modelSlug = slugifyArabam(query.model);
  const engineSlug = slugifyArabam(query.engine || '');
  const packageSlug = slugifyArabam(query.packageName || '');
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

function isCloudflareChallenge(html: string) {
  const normalized = String(html || '').toLowerCase();
  return normalized.includes('just a moment') && normalized.includes('cf_chl_opt');
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
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
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
    if (response.ok && html.includes('var adverts = [')) {
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

function parseArabamAdverts(html: string) {
  const match = html.match(/var adverts = (\[[\s\S]*?\]);/);
  if (!match) return [];

  try {
    return JSON.parse(match[1]) as Array<Record<string, unknown>>;
  } catch {
    return [];
  }
}

function parseArabamInsiderListings(html: string): ParsedArabamListing[] {
  const regex = /insiderArray\.push\(\{\s*"id":\s*"([^"]+)"[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"unit_price":\s*parseFloat\(\("([^"]+)"\)[\s\S]*?"url":\s*window\.location\.origin \+\s*"([^"]+)"/g;
  const listings: ParsedArabamListing[] = [];

  for (const match of html.matchAll(regex)) {
    const [, idRaw, nameRaw, formattedPriceRaw, relativeUrlRaw] = match;
    const formattedPrice = `${formattedPriceRaw}`.trim();
    const price = parsePrice(formattedPrice);
    const relativeUrl = String(relativeUrlRaw || '').trim();
    const title = String(nameRaw || '').trim();

    if (!price || !relativeUrl || !title) {
      continue;
    }

    const decodedUrl = decodeURIComponent(relativeUrl);
    listings.push({
      id: Number.isFinite(Number(idRaw)) ? Number(idRaw) : null,
      title,
      price,
      formattedPrice,
      categoryName: '',
      variant: title,
      url: decodedUrl,
      year: extractYearFromUrl(decodedUrl),
      approxKm: extractKmFromUrl(decodedUrl),
    });
  }

  return listings;
}

function parsePrice(value: unknown) {
  const digits = String(value || '').replace(/[^\d]/g, '');
  const numeric = Number(digits);
  return Number.isFinite(numeric) ? numeric : 0;
}

function normalizeText(value: string) {
  return normalizeTurkish(String(value || ''))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function extractNumericEngineToken(value: string) {
  const match = normalizeText(value).match(/(\d+(?:\s*\d+)?)/);
  return match ? match[1]!.replace(/\s+/g, '') : '';
}

function extractPowerToken(value: string) {
  const matches = normalizeText(value).match(/\b(\d{2,3})\b/g) || [];
  const numeric = matches
    .map((item) => Number(item))
    .filter((item) => item >= 60 && item <= 400);
  return numeric.length ? String(numeric[0]) : '';
}

function extractYearFromUrl(value: string) {
  const match = String(value || '').match(/\b(20\d{2})\b/);
  if (!match) return null;
  const year = Number(match[1]);
  return Number.isFinite(year) ? year : null;
}

function extractKmFromUrl(value: string) {
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

  if (engineNormalized.includes('tsi') && !haystack.includes('tsi')) {
    return false;
  }

  if (engineNormalized.includes('tdi') && !haystack.includes('tdi')) {
    return false;
  }

  if ((fuelNormalized.includes('benzin') || engineNormalized.includes('tsi')) && hasAnyToken(haystack, ['tdi', 'dizel', 'diesel'])) {
    return false;
  }

  if (fuelNormalized.includes('dizel') && !hasAnyToken(haystack, ['tdi', 'dizel', 'diesel'])) {
    return false;
  }

  if (fuelNormalized.includes('hibrit') && !hasAnyToken(haystack, ['hibrit', 'hybrid'])) {
    return false;
  }

  if (engineNormalized.includes('e tech') && !hasAnyToken(haystack, ['e tech', 'hibrit', 'hybrid'])) {
    return false;
  }

  if (engineNormalized.includes('hybrid') && !hasAnyToken(haystack, ['hybrid', 'hibrit', 'e tech'])) {
    return false;
  }

  return true;
}

function scoreAdvertRelevance(
  advert: ParsedArabamListing,
  query: MarketCompsQuery,
) {
  const haystack = normalizeText(`${advert.title} ${advert.variant} ${advert.categoryName}`);
  let score = 0;

  const packageNormalized = normalizeText(query.packageName || '');
  if (packageNormalized && packageNormalized !== 'standart') {
    if (haystack.includes(packageNormalized)) {
      score += 6;
    } else {
      const packageTokens = packageNormalized.split(' ').filter((token) => token.length >= 3);
      score += packageTokens.filter((token) => haystack.includes(token)).length * 1.5;
    }
  }

  const engineNumericToken = extractNumericEngineToken(query.engine || '');
  if (engineNumericToken && haystack.includes(engineNumericToken)) {
    score += 3;
  }

  const fuelNormalized = normalizeText(query.fuelType || '');
  if (fuelNormalized && haystack.includes(fuelNormalized.split(' ')[0] || fuelNormalized)) {
    score += 2;
  }

  const engineNormalized = normalizeText(query.engine || '');
  if (engineNormalized.includes('e tech') && hasAnyToken(haystack, ['e tech', 'hibrit', 'hybrid'])) {
    score += 2.5;
  }

  if (engineNormalized.includes('hybrid') && hasAnyToken(haystack, ['hybrid', 'hibrit', 'e tech'])) {
    score += 2.5;
  }

  const transmissionNormalized = normalizeText(query.transmission || '');
  if (transmissionNormalized && haystack.includes(transmissionNormalized)) {
    score += 1.5;
  }

  const bodyTypeNormalized = normalizeText(query.bodyType || query.vehicleType || '');
  if (bodyTypeNormalized && haystack.includes(bodyTypeNormalized.split(' ')[0] || bodyTypeNormalized)) {
    score += 1;
  }

  if (advert.year && query.year) {
    const yearDiff = Math.abs(advert.year - query.year);
    if (yearDiff === 0) score += 4;
    else if (yearDiff === 1) score += 2;
    else if (yearDiff >= 3) score -= 8;
  }

  if (advert.approxKm && query.km) {
    const kmDiff = Math.abs(advert.approxKm - query.km);
    if (kmDiff <= 15000) score += 3;
    else if (kmDiff <= 35000) score += 1.5;
    else if (kmDiff >= 90000) score -= 6;
  }

  return score;
}

function isYearKmCompatible(advert: ParsedArabamListing, query: MarketCompsQuery) {
  if (advert.year && query.year) {
    if (Math.abs(advert.year - query.year) > 1) {
      return false;
    }
  }

  if (advert.approxKm && query.km) {
    if (Math.abs(advert.approxKm - query.km) > 65000) {
      return false;
    }
  }

  return true;
}

function isSuspiciousCommercialListing(advert: ParsedArabamListing) {
  const haystack = normalizeText(`${advert.title} ${advert.variant} ${advert.url || ''}`);
  return ['senet', 'pesinat', 'kredi', 'aylik odeme', 'aylik taksit'].some((token) => haystack.includes(token));
}

function median(values: number[]) {
  if (!values.length) return 0;
  const middle = Math.floor(values.length / 2);
  return values.length % 2 === 0
    ? (values[middle - 1]! + values[middle]!) / 2
    : values[middle]!;
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildStats(prices: number[]) {
  if (!prices.length) return null;

  const sorted = [...prices].sort((a, b) => a - b);
  const trimCount = sorted.length >= 6 ? Math.max(1, Math.floor(sorted.length * 0.15)) : 0;
  const trimmed = trimCount > 0 ? sorted.slice(trimCount, sorted.length - trimCount) : sorted;
  const trimmedValues = trimmed.length ? trimmed : sorted;
  const center = median(trimmedValues);

  return {
    min: sorted[0]!,
    max: sorted[sorted.length - 1]!,
    median: Math.round(median(sorted)),
    average: Math.round(average(sorted)),
    trimmedAverage: Math.round(average(trimmedValues)),
    lowerBand: Math.round(center * 0.97),
    upperBand: Math.round(center * 1.03),
  };
}

async function resolveArabamComps(query: MarketCompsQuery): Promise<MarketCompsResponse> {
  const categories = getCategoryCandidates(query);
  const paths = buildPathCandidates(query);
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

      const adverts = (insiderListings.length ? insiderListings : parseArabamAdverts(html)
        .map((item) => {
          const price = parsePrice(item.FormattedPrice);
          return {
            id: typeof item.Id === 'number' ? item.Id : null,
            title: String(item.ModelName || item.Title || '').trim(),
            price,
            formattedPrice: String(item.FormattedPrice || '').trim(),
            categoryName: String(item.CategoryName || '').trim(),
            variant: String(item.Variant || '').trim(),
          } as ParsedArabamListing;
        }))
        .filter((item) => item.price > 0);

      if (adverts.length >= 3) {
        const scoredAdverts = adverts.map((item) => ({
          ...item,
          relevanceScore: scoreAdvertRelevance(item, query),
        }));
        const strictAdverts = scoredAdverts.filter((item) => (
          isAdvertStrictMatch(item, query)
          && isYearKmCompatible(item, query)
          && !isSuspiciousCommercialListing(item)
        ));
        const strictDatedAdverts = strictAdverts.filter((item) => item.year);
        const relevantAdverts = scoredAdverts
          .filter((item) => item.relevanceScore >= 2 && !isSuspiciousCommercialListing(item))
          .sort((left, right) => right.relevanceScore - left.relevanceScore || left.price - right.price);
        const selectedAdverts = strictAdverts.length >= 2
          ? (strictDatedAdverts.length >= 3 ? strictDatedAdverts : strictAdverts)
            .sort((left, right) => right.relevanceScore - left.relevanceScore || left.price - right.price)
          : relevantAdverts.length >= 3 && !requiresHighSpecificity
            ? relevantAdverts
            : !requiresHighSpecificity
              ? scoredAdverts
              : [];

        if (!selectedAdverts.length) {
          continue;
        }

        const prices = selectedAdverts.map((item) => item.price);
        return {
          ok: true,
          source: 'arabam',
          sourceUrl: url,
          sampleSize: selectedAdverts.length,
          fallbackUsed: relevantAdverts.length < 3,
          stats: buildStats(prices),
          listings: selectedAdverts.slice(0, 12).map(({ relevanceScore: _score, ...item }) => item),
          computedAt: new Date().toISOString(),
        };
      }
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
    ok: true,
    source: 'arabam',
    sourceUrl: null,
    sampleSize: 0,
    fallbackUsed: true,
    stats: null,
    listings: [],
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

  const payload = await resolveArabamComps(parsed);
  marketCompCache.set(cacheKey, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    payload,
  });

  return payload;
}
