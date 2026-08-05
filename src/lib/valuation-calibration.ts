import { prisma } from '../db.js';

export const VALUATION_MODEL_MULTIPLIERS_SETTING_KEY = 'valuation.model_multipliers';
const CALIBRATION_CACHE_TTL_MS = 30 * 1000;

type ValuationModelMultiplierMap = Record<string, number>;

let cachedSnapshot: { expiresAt: number; data: ValuationModelMultiplierMap } | null = null;

function clampPercent(value: number) {
  return Math.max(-15, Math.min(15, Number(value.toFixed(1))));
}

function parseCalibrationMap(rawValue: string | null | undefined) {
  if (!rawValue) {
    return {} as ValuationModelMultiplierMap;
  }

  try {
    const parsed = JSON.parse(rawValue) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).flatMap(([key, value]) => {
        const numeric = typeof value === 'number' ? value : Number(value);
        if (!Number.isFinite(numeric)) {
          return [];
        }
        return [[key, clampPercent(numeric)]];
      }),
    );
  } catch {
    return {} as ValuationModelMultiplierMap;
  }
}

export function buildValuationModelKey(brand: string, model: string) {
  return `${String(brand || '').trim()}|${String(model || '').trim()}`;
}

export async function getValuationModelMultipliers(forceRefresh = false) {
  if (!forceRefresh && cachedSnapshot && cachedSnapshot.expiresAt > Date.now()) {
    return cachedSnapshot.data;
  }

  const stored = await prisma.appSetting.findUnique({
    where: { key: VALUATION_MODEL_MULTIPLIERS_SETTING_KEY },
  });

  const data = parseCalibrationMap(stored?.value);
  cachedSnapshot = {
    expiresAt: Date.now() + CALIBRATION_CACHE_TTL_MS,
    data,
  };

  return data;
}

export async function getValuationModelMultiplier(brand: string, model: string) {
  const key = buildValuationModelKey(brand, model);
  const multipliers = await getValuationModelMultipliers();
  return multipliers[key] ?? 0;
}

export async function upsertValuationModelMultiplier(brand: string, model: string, adjustmentPercent: number) {
  const key = buildValuationModelKey(brand, model);
  const multipliers = await getValuationModelMultipliers(true);
  const nextValue = clampPercent(adjustmentPercent);
  const nextMap = { ...multipliers };

  if (Math.abs(nextValue) < 0.1) {
    delete nextMap[key];
  } else {
    nextMap[key] = nextValue;
  }

  await prisma.appSetting.upsert({
    where: { key: VALUATION_MODEL_MULTIPLIERS_SETTING_KEY },
    update: { value: JSON.stringify(nextMap) },
    create: {
      key: VALUATION_MODEL_MULTIPLIERS_SETTING_KEY,
      value: JSON.stringify(nextMap),
    },
  });

  cachedSnapshot = {
    expiresAt: Date.now() + CALIBRATION_CACHE_TTL_MS,
    data: nextMap,
  };

  return {
    key,
    previousValue: multipliers[key] ?? 0,
    nextValue,
    multipliers: nextMap,
  };
}

export async function removeValuationModelMultiplier(brand: string, model: string) {
  const key = buildValuationModelKey(brand, model);
  const multipliers = await getValuationModelMultipliers(true);
  const previousValue = multipliers[key] ?? 0;
  const nextMap = { ...multipliers };
  delete nextMap[key];

  await prisma.appSetting.upsert({
    where: { key: VALUATION_MODEL_MULTIPLIERS_SETTING_KEY },
    update: { value: JSON.stringify(nextMap) },
    create: {
      key: VALUATION_MODEL_MULTIPLIERS_SETTING_KEY,
      value: JSON.stringify(nextMap),
    },
  });

  cachedSnapshot = {
    expiresAt: Date.now() + CALIBRATION_CACHE_TTL_MS,
    data: nextMap,
  };

  return {
    key,
    previousValue,
    multipliers: nextMap,
  };
}
