import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { prisma } from '../db.js';
import { vehicleCatalog } from '../data/vehicleCatalog.js';

// Bump the snapshot whenever catalog metadata changes. This forces existing
// deployments to refresh the DB copy instead of serving the old incomplete
// colour/package map forever.
const SETTING_KEY = 'vehicle_catalog_snapshot_v4';
const ALLOWED_CATEGORY_KEYS = new Set(['otomobil', 'arazi-suv-pickup', 'minivan-panelvan']);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type CatalogSnapshot = Record<string, unknown> & {
  valuationMetadata?: Record<string, unknown>;
};

let memorySnapshot: CatalogSnapshot | null = null;

async function readStaticSnapshot(): Promise<CatalogSnapshot> {
  const candidates = [
    path.resolve(__dirname, '../assets'),
    path.resolve(__dirname, '../../src/assets'),
    path.resolve(process.cwd(), 'src/assets'),
    path.resolve(process.cwd(), 'dist/assets'),
    path.resolve(process.cwd(), '../ototeklifim-landing-web/assets'),
    path.resolve('/Users/mertpeyk/Projects/OtoTeklifim/ototeklifim-landing-web/assets'),
  ];

  for (const root of candidates) {
    try {
      const [catalog, metadata] = await Promise.all([
        readFile(path.join(root, 'valuation-catalog.json'), 'utf8'),
        readFile(path.join(root, 'valuation-metadata.json'), 'utf8'),
      ]);
      const valuation = JSON.parse(catalog) as Record<string, any>;
      const years = (valuation.years || []).map(String);
      const makesByYear = { ...(valuation.makesByYear || {}) } as Record<string, string[]>;
      const modelsByYearMake = { ...(valuation.modelsByYearMake || {}) } as Record<string, string[]>;

      // Keep the admin/static catalogue additions (for example Mercedes E250)
      // in the same API tree even when the external valuation source has no row.
      for (const brand of (vehicleCatalog.brands || []) as Array<{ label: string; models: string[] }>) {
        for (const year of years) {
          makesByYear[year] = Array.from(new Set([...(makesByYear[year] || []), brand.label]));
          const key = `${year}|${brand.label}`;
          modelsByYearMake[key] = Array.from(new Set([...(modelsByYearMake[key] || []), ...(brand.models || [])]));
        }
      }

      const valuationMetadata = JSON.parse(metadata) as Record<string, any>;
      const modelPackages = { ...(valuationMetadata.modelPackages || {}) } as Record<string, string[]>;
      const brandPackages = { ...(valuationMetadata.brandPackages || {}) } as Record<string, string[]>;
      const defaultPackages = Array.isArray(valuationMetadata.defaultPackages) && valuationMetadata.defaultPackages.length
        ? valuationMetadata.defaultPackages
        : ['Standart', 'Comfort', 'Prestige', 'Premium'];

      // Every DB vehicle node must have a usable package list. The external
      // metadata only contains popular models, so fill missing model entries
      // from the brand list (or the global defaults) during the DB seed.
      for (const brand of (vehicleCatalog.brands || []) as Array<{ label: string; models: string[] }>) {
        const brandOptions = Array.isArray(brandPackages[brand.label]) && brandPackages[brand.label].length
          ? brandPackages[brand.label]
          : defaultPackages;
        for (const model of brand.models || []) {
          const key = `${brand.label}|${model}`;
          if (!Array.isArray(modelPackages[key]) || !modelPackages[key].length) {
            modelPackages[key] = [...brandOptions];
          }
        }
      }

      const commonColors = Array.isArray(valuationMetadata.commonColors) && valuationMetadata.commonColors.length
        ? valuationMetadata.commonColors
        : vehicleCatalog.colorOptions;

      const allowedCategories = (vehicleCatalog.categories || []).filter((category: any) =>
        ALLOWED_CATEGORY_KEYS.has(category.key),
      );
      const allowedBrands = (vehicleCatalog.brands || [])
        .map((brand: any) => ({
          ...brand,
          categoryKeys: (brand.categoryKeys || []).filter((key: string) => ALLOWED_CATEGORY_KEYS.has(key)),
        }))
        .filter((brand: any) => brand.categoryKeys.length);

      return {
        ...vehicleCatalog,
        categories: allowedCategories,
        brands: allowedBrands,
        ...valuation,
        makesByYear,
        modelsByYearMake,
        valuationMetadata: {
          ...valuationMetadata,
          defaultPackages,
          modelPackages,
          commonColors,
        },
      };
    } catch {
      // Try the next deployment layout.
    }
  }

  return { ...vehicleCatalog };
}

export async function getVehicleCatalogSnapshot() {
  if (memorySnapshot) return memorySnapshot;

  try {
    const setting = await prisma.appSetting.findUnique({ where: { key: SETTING_KEY } });
    if (setting) {
      try {
        memorySnapshot = JSON.parse(setting.value) as CatalogSnapshot;
        return memorySnapshot;
      } catch {
        // Rebuild a corrupt/old snapshot below.
      }
    }

    const snapshot = await readStaticSnapshot();
    await prisma.appSetting.upsert({
      where: { key: SETTING_KEY },
      create: { key: SETTING_KEY, value: JSON.stringify(snapshot) },
      update: { value: JSON.stringify(snapshot) },
    });
    memorySnapshot = snapshot;
    return snapshot;
  } catch {
    // Catalog loading must never prevent the API from passing healthcheck.
    // The static catalog is still a valid source until the DB is available.
    memorySnapshot = await readStaticSnapshot();
    return memorySnapshot;
  }
}

export function clearVehicleCatalogCache() {
  memorySnapshot = null;
}
