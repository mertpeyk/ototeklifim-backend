import type { FastifyBaseLogger } from 'fastify';

import { prisma } from '../db.js';
import { estimateVehicleValue, valuationEstimateInputSchema, type ValuationEstimateInput } from './valuation.js';
import {
  buildValuationModelKey,
  getValuationModelMultipliers,
  upsertValuationModelMultiplier,
} from './valuation-calibration.js';

const VALUATION_AUTO_CALIBRATION_LAST_RUN_KEY = 'valuation.auto_calibration.last_run_at';
const VALUATION_AUTO_CALIBRATION_LAST_REPORT_KEY = 'valuation.auto_calibration.last_report';
const VALUATION_AUTO_CALIBRATION_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;
const VALUATION_AUTO_CALIBRATION_POLL_MS = 60 * 60 * 1000;
const RECENT_SAMPLE_DAYS = 45;
const MIN_MODEL_SAMPLE_SIZE = 3;
const MAX_REQUESTS = 250;

type CalibrationSample = {
  key: string;
  brand: string;
  model: string;
  deltaPercent: number;
};

function isAutoCalibrationEnabled() {
  return process.env.VALUATION_AUTO_CALIBRATION_ENABLED !== '0';
}

function hasUsableDatabaseUrl() {
  return String(process.env.DATABASE_URL || '').startsWith('mysql://');
}

function clampPercent(value: number) {
  return Math.max(-15, Math.min(15, Number(value.toFixed(1))));
}

function parseFastSaleInput(record: { vehicleInfo: unknown; condition: unknown }) {
  try {
    return valuationEstimateInputSchema.parse({
      vehicleInfo: record.vehicleInfo,
      condition: record.condition,
      extraKey: false,
      serviceHistory: true,
    });
  } catch {
    return null;
  }
}

async function getLastAutoCalibrationRunAt() {
  const stored = await prisma.appSetting.findUnique({
    where: { key: VALUATION_AUTO_CALIBRATION_LAST_RUN_KEY },
  });

  if (!stored?.value) {
    return null;
  }

  const parsed = new Date(stored.value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function setAutoCalibrationSnapshot(report: Record<string, unknown>) {
  const nowIso = new Date().toISOString();

  await prisma.appSetting.upsert({
    where: { key: VALUATION_AUTO_CALIBRATION_LAST_RUN_KEY },
    update: { value: nowIso },
    create: {
      key: VALUATION_AUTO_CALIBRATION_LAST_RUN_KEY,
      value: nowIso,
    },
  });

  await prisma.appSetting.upsert({
    where: { key: VALUATION_AUTO_CALIBRATION_LAST_REPORT_KEY },
    update: { value: JSON.stringify(report) },
    create: {
      key: VALUATION_AUTO_CALIBRATION_LAST_REPORT_KEY,
      value: JSON.stringify(report),
    },
  });
}

async function collectCalibrationSamples() {
  const cutoff = new Date(Date.now() - (RECENT_SAMPLE_DAYS * 24 * 60 * 60 * 1000));
  const requests = await prisma.fastSaleRequest.findMany({
    where: {
      createdAt: {
        gte: cutoff,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: MAX_REQUESTS,
    select: {
      id: true,
      vehicleInfo: true,
      condition: true,
      createdAt: true,
    },
  });

  const samples: CalibrationSample[] = [];

  for (const request of requests) {
    const parsedInput = parseFastSaleInput(request);
    if (!parsedInput) {
      continue;
    }

    const heuristic = await estimateVehicleValue(parsedInput as ValuationEstimateInput, {
      skipMarketComps: true,
      skipModelCalibration: true,
    });
    const marketAware = await estimateVehicleValue(parsedInput as ValuationEstimateInput, {
      skipModelCalibration: true,
    });

    if (!marketAware.marketComps?.sampleSize || marketAware.marketComps.sampleSize < 3) {
      continue;
    }

    if (!heuristic.estimate) {
      continue;
    }

    const deltaPercent = ((marketAware.estimate - heuristic.estimate) / heuristic.estimate) * 100;
    samples.push({
      key: buildValuationModelKey(marketAware.normalizedVehicleInfo.brand, marketAware.normalizedVehicleInfo.model),
      brand: marketAware.normalizedVehicleInfo.brand,
      model: marketAware.normalizedVehicleInfo.model,
      deltaPercent,
    });
  }

  return samples;
}

export async function runWeeklyValuationCalibration(logger?: FastifyBaseLogger | Console) {
  if (!hasUsableDatabaseUrl()) {
    const report = {
      ranAt: new Date().toISOString(),
      skipped: true,
      reason: 'DATABASE_URL is missing or not a mysql:// connection string.',
      sampleCount: 0,
      updatedModels: 0,
      updates: [],
    };
    logger?.warn?.(report, 'valuation auto calibration skipped');
    return report;
  }

  const samples = await collectCalibrationSamples();
  const currentMultipliers = await getValuationModelMultipliers(true);
  const grouped = new Map<string, CalibrationSample[]>();

  for (const sample of samples) {
    const bucket = grouped.get(sample.key) || [];
    bucket.push(sample);
    grouped.set(sample.key, bucket);
  }

  const applied: Array<{ key: string; brand: string; model: string; previous: number; next: number; sampleSize: number }> = [];

  for (const [key, entries] of grouped.entries()) {
    if (entries.length < MIN_MODEL_SAMPLE_SIZE) {
      continue;
    }

    const averageDelta = entries.reduce((sum, item) => sum + item.deltaPercent, 0) / entries.length;
    const current = currentMultipliers[key] ?? 0;
    const smoothed = clampPercent((current * 0.35) + (averageDelta * 0.65));
    const [first] = entries;
    if (!first) {
      continue;
    }

    const result = await upsertValuationModelMultiplier(first.brand, first.model, smoothed);
    applied.push({
      key,
      brand: first.brand,
      model: first.model,
      previous: result.previousValue,
      next: result.nextValue,
      sampleSize: entries.length,
    });
  }

  const report = {
    ranAt: new Date().toISOString(),
    sampleCount: samples.length,
    updatedModels: applied.length,
    updates: applied,
  };

  await setAutoCalibrationSnapshot(report);
  logger?.info?.(report, 'valuation auto calibration completed');
  return report;
}

export async function maybeRunWeeklyValuationCalibration(logger?: FastifyBaseLogger | Console) {
  if (!isAutoCalibrationEnabled()) {
    return null;
  }

  if (!hasUsableDatabaseUrl()) {
    logger?.warn?.('valuation auto calibration skipped because DATABASE_URL is unavailable');
    return null;
  }

  const lastRunAt = await getLastAutoCalibrationRunAt();
  if (lastRunAt && (Date.now() - lastRunAt.getTime()) < VALUATION_AUTO_CALIBRATION_INTERVAL_MS) {
    return null;
  }

  return runWeeklyValuationCalibration(logger);
}

export function startValuationCalibrationScheduler(logger?: FastifyBaseLogger | Console) {
  if (!isAutoCalibrationEnabled()) {
    logger?.info?.('valuation auto calibration scheduler disabled');
    return;
  }

  void maybeRunWeeklyValuationCalibration(logger).catch((error) => {
    logger?.error?.(error, 'valuation auto calibration initial run failed');
  });

  setInterval(() => {
    void maybeRunWeeklyValuationCalibration(logger).catch((error) => {
      logger?.error?.(error, 'valuation auto calibration scheduled run failed');
    });
  }, VALUATION_AUTO_CALIBRATION_POLL_MS).unref();
}
