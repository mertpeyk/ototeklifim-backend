import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { prisma } from '../db.js';
import { vehicleCatalog } from '../data/vehicleCatalog.js';

const SETTING_KEY = 'vehicle_catalog_snapshot_v1';
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
      return {
        ...vehicleCatalog,
        ...(JSON.parse(catalog) as Record<string, unknown>),
        valuationMetadata: JSON.parse(metadata) as Record<string, unknown>,
      };
    } catch {
      // Try the next deployment layout.
    }
  }

  return { ...vehicleCatalog };
}

export async function getVehicleCatalogSnapshot() {
  if (memorySnapshot) return memorySnapshot;

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
}

export function clearVehicleCatalogCache() {
  memorySnapshot = null;
}

