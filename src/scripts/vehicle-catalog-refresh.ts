import { prisma } from '../db.js';
import { refreshVehicleCatalogSnapshot } from '../lib/vehicle-catalog-db.js';

async function main() {
  const snapshot = await refreshVehicleCatalogSnapshot();
  const modelCount = Object.values(snapshot.modelsByYearMake || {})
    .reduce((total, models) => total + (Array.isArray(models) ? models.length : 0), 0);

  console.log(JSON.stringify({
    refreshed: true,
    years: Array.isArray(snapshot.years) ? snapshot.years.length : 0,
    brands: Array.isArray(snapshot.brands) ? snapshot.brands.length : 0,
    modelEntries: modelCount,
    engineKeys: Object.keys(snapshot.enginesByKey || {}).length,
    packageKeys: Object.keys(snapshot.valuationMetadata?.modelPackages || {}).length,
  }));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
