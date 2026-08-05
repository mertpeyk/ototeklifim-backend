import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type ValuationCatalog = {
  years: string[];
  makesByYear: Record<string, string[]>;
  modelsByYearMake: Record<string, string[]>;
  bodyTypesByYearMakeModel: Record<string, string[]>;
  fuelTypesByKey: Record<string, string[]>;
  transmissionsByKey: Record<string, string[]>;
  enginesByKey: Record<string, string[]>;
};

type ValuationMetadata = {
  defaultPackages: string[];
  brandPackages: Record<string, string[]>;
  modelPackages: Record<string, string[]>;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const landingAssetsRoot = path.resolve(__dirname, '../../../ototeklifim-landing-web/assets');
const catalogPath = path.join(landingAssetsRoot, 'valuation-catalog.json');
const metadataPath = path.join(landingAssetsRoot, 'valuation-metadata.json');
const CACHE_TTL_MS = 60 * 1000;

let cachedCatalog: { expiresAt: number; catalog: ValuationCatalog; metadata: ValuationMetadata } | null = null;

function normalizeText(value: string | undefined) {
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function scoreOption(expected: string, option: string) {
  const normalizedExpected = normalizeText(expected);
  const normalizedOption = normalizeText(option);

  if (!normalizedExpected || !normalizedOption) {
    return -1;
  }

  if (normalizedExpected === normalizedOption) {
    return 100;
  }

  let score = 0;
  if (normalizedOption.includes(normalizedExpected) || normalizedExpected.includes(normalizedOption)) {
    score += 40;
  }

  const expectedTokens = normalizedExpected.split(' ').filter(Boolean);
  const optionTokens = new Set(normalizedOption.split(' ').filter(Boolean));
  score += expectedTokens.filter((token) => optionTokens.has(token)).length * 12;

  const expectedNumeric: string[] = normalizedExpected.match(/\d+(?:\s*\d+)*/g) ?? [];
  const optionNumeric: string[] = normalizedOption.match(/\d+(?:\s*\d+)*/g) ?? [];
  score += expectedNumeric.filter((token) => optionNumeric.includes(token)).length * 14;

  return score;
}

function pickBestOption(expected: string, options: string[], fallback = expected) {
  if (!options.length) {
    return fallback;
  }

  const scored = options
    .map((option) => ({ option, score: scoreOption(expected, option) }))
    .sort((left, right) => right.score - left.score);

  if (scored[0] && scored[0].score >= 18) {
    return scored[0].option;
  }

  return fallback || options[0]!;
}

async function loadCatalogSnapshot() {
  if (cachedCatalog && cachedCatalog.expiresAt > Date.now()) {
    return cachedCatalog;
  }

  const [catalogRaw, metadataRaw] = await Promise.all([
    readFile(catalogPath, 'utf8'),
    readFile(metadataPath, 'utf8'),
  ]);

  const snapshot = {
    expiresAt: Date.now() + CACHE_TTL_MS,
    catalog: JSON.parse(catalogRaw) as ValuationCatalog,
    metadata: JSON.parse(metadataRaw) as ValuationMetadata,
  };

  cachedCatalog = snapshot;
  return snapshot;
}

function getAllBrands(catalog: ValuationCatalog) {
  return Array.from(new Set(Object.values(catalog.makesByYear || {}).flat())).sort((left, right) => left.localeCompare(right, 'tr'));
}

export async function normalizeVehicleInfoWithCatalog(input: {
  vehicleType: string;
  brand: string;
  model: string;
  packageName: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  engineVolume: string;
  enginePower?: string;
  color: string;
  city: string;
  district?: string;
}) {
  const { catalog, metadata } = await loadCatalogSnapshot();
  const yearKey = String(input.year);
  const yearBrands = catalog.makesByYear?.[yearKey] || getAllBrands(catalog);
  const brand = pickBestOption(input.brand, yearBrands, input.brand);

  const modelOptions = catalog.modelsByYearMake?.[`${yearKey}|${brand}`] || [];
  const model = pickBestOption(input.model, modelOptions, input.model);

  const bodyTypeOptions = catalog.bodyTypesByYearMakeModel?.[`${yearKey}|${brand}|${model}`] || [];
  const bodyType = pickBestOption(input.bodyType, bodyTypeOptions, input.bodyType);

  const fuelTypeOptions = catalog.fuelTypesByKey?.[`${yearKey}|${brand}|${model}|${bodyType}`] || [];
  const fuelType = pickBestOption(input.fuelType, fuelTypeOptions, input.fuelType);

  const transmissionOptions = catalog.transmissionsByKey?.[`${yearKey}|${brand}|${model}|${bodyType}|${fuelType}`] || [];
  const transmission = pickBestOption(input.transmission, transmissionOptions, input.transmission);

  const engineOptions = catalog.enginesByKey?.[`${yearKey}|${brand}|${model}|${bodyType}|${fuelType}|${transmission}`] || [];
  const engineVolume = pickBestOption(input.engineVolume, engineOptions, input.engineVolume);

  const modelPackageOptions = metadata.modelPackages?.[`${brand}|${model}`] || [];
  const brandPackageOptions = metadata.brandPackages?.[brand] || [];
  const packagePool = modelPackageOptions.length
    ? modelPackageOptions
    : brandPackageOptions.length
      ? brandPackageOptions
      : metadata.defaultPackages || [];
  const packageName = pickBestOption(input.packageName, packagePool, input.packageName);

  return {
    ...input,
    brand,
    model,
    bodyType,
    fuelType,
    transmission,
    engineVolume,
    packageName,
    enginePower: input.enginePower || '',
    district: input.district || '',
  };
}
