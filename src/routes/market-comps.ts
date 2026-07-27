import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

const execFileAsync = promisify(execFile);
const CACHE_TTL_MS = 30 * 60 * 1000;
const PUBLIC_HTML_TIMEOUT_MS = 12000;

const marketCompsQuerySchema = z.object({
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

type MarketCompsQuery = z.infer<typeof marketCompsQuerySchema>;

type MarketCompsResponse = {
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

  if (engineSlug && packageSlug) combos.add(`${brandSlug}-${modelSlug}-${engineSlug}-${packageSlug}`);
  if (engineSlug) combos.add(`${brandSlug}-${modelSlug}-${engineSlug}`);
  if (packageSlug) combos.add(`${brandSlug}-${modelSlug}-${packageSlug}`);
  combos.add(`${brandSlug}-${modelSlug}`);

  return Array.from(combos).filter(Boolean);
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
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'no-cache',
      },
      signal: AbortSignal.timeout(PUBLIC_HTML_TIMEOUT_MS),
    });

    const html = await response.text();
    if (response.ok && html.includes('var adverts = [')) {
      return html;
    }
  } catch {
    // Curl fallback below.
  }

  return fetchViaCurl(url);
}

function parseArabamAdverts(html: string) {
  const match = html.match(/var adverts = (\[[\s\S]*?\]);/);
  if (!match) return [];

  try {
    const parsed = JSON.parse(match[1]) as Array<Record<string, unknown>>;
    return parsed;
  } catch {
    return [];
  }
}

function parsePrice(value: unknown) {
  const digits = String(value || '').replace(/[^\d]/g, '');
  const numeric = Number(digits);
  return Number.isFinite(numeric) ? numeric : 0;
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

  for (const category of categories) {
    for (const path of paths) {
      const url = `https://www.arabam.com/ikinci-el/${category}/${path}`;
      const html = await fetchPublicHtml(url);
      const adverts = parseArabamAdverts(html)
        .map((item) => {
          const price = parsePrice(item.FormattedPrice);
          return {
            id: typeof item.Id === 'number' ? item.Id : null,
            title: String(item.ModelName || item.Title || '').trim(),
            price,
            formattedPrice: String(item.FormattedPrice || '').trim(),
            categoryName: String(item.CategoryName || '').trim(),
            variant: String(item.Variant || '').trim(),
          };
        })
        .filter((item) => item.price > 0);

      if (adverts.length >= 3) {
        const prices = adverts.map((item) => item.price);
        return {
          ok: true,
          source: 'arabam',
          sourceUrl: url,
          sampleSize: adverts.length,
          fallbackUsed: false,
          stats: buildStats(prices),
          listings: adverts.slice(0, 12),
          computedAt: new Date().toISOString(),
        };
      }
    }
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

export async function marketCompsRoutes(app: FastifyInstance) {
  app.get('/market-comps', async (request) => {
    const query = marketCompsQuerySchema.parse(request.query);
    const cacheKey = buildCacheKey(query);
    const cached = marketCompCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.payload;
    }

    const payload = await resolveArabamComps(query);
    marketCompCache.set(cacheKey, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      payload,
    });

    return payload;
  });
}
