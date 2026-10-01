import { buildVehicleCatalogSnapshot } from '../lib/vehicle-catalog-db.js';

type StringMap = Record<string, string[]>;

const snapshot = await buildVehicleCatalogSnapshot() as Record<string, any>;
const modelsByYearMake = (snapshot.modelsByYearMake || {}) as StringMap;
const fuels = (snapshot.fuelTypesByKey || {}) as StringMap;
const transmissions = (snapshot.transmissionsByKey || {}) as StringMap;
const engines = (snapshot.enginesByKey || {}) as StringMap;
const metadata = (snapshot.valuationMetadata || {}) as Record<string, any>;
const packages = (metadata.modelPackages || {}) as StringMap;

const issues: Array<{ type: string; key: string }> = [];
const modelKeys = new Set<string>();
const fuelRowsByModelYear = new Map<string, Array<[string, string[]]>>();

for (const [fuelKey, values] of Object.entries(fuels)) {
  const [year, brand, model] = fuelKey.split('|');
  const indexKey = `${year}|${brand}|${model}`;
  const rows = fuelRowsByModelYear.get(indexKey) || [];
  rows.push([fuelKey, values]);
  fuelRowsByModelYear.set(indexKey, rows);
}

for (const [yearMake, models] of Object.entries(modelsByYearMake)) {
  const [year, brand] = yearMake.split('|');
  for (const model of models) {
    modelKeys.add(`${brand}|${model}`);
    const bodyFuelRows = fuelRowsByModelYear.get(`${year}|${brand}|${model}`) || [];
    if (!bodyFuelRows.length) {
      issues.push({ type: 'missing_fuel', key: `${year}|${brand}|${model}` });
      continue;
    }
    for (const [fuelKey, fuelValues] of bodyFuelRows) {
      if (!fuelValues.length) issues.push({ type: 'empty_fuel', key: fuelKey });
      for (const fuel of fuelValues) {
        const driveKey = `${fuelKey}|${fuel}`;
        const gearValues = transmissions[driveKey] || [];
        if (!gearValues.length) {
          issues.push({ type: 'missing_transmission', key: driveKey });
          continue;
        }
        if (fuel === 'Elektrik' && gearValues.some((gear) => gear !== 'Otomatik')) {
          issues.push({ type: 'electric_non_automatic', key: driveKey });
        }
        for (const gear of gearValues) {
          const engineKey = `${driveKey}|${gear}`;
          if (!(engines[engineKey] || []).length) issues.push({ type: 'missing_engine', key: engineKey });
        }
      }
    }
    if (!(packages[`${brand}|${model}`] || []).length) {
      issues.push({ type: 'missing_package', key: `${brand}|${model}` });
    }
  }
}

const counts = issues.reduce<Record<string, number>>((result, issue) => {
  result[issue.type] = (result[issue.type] || 0) + 1;
  return result;
}, {});

console.log(JSON.stringify({
  brands: new Set([...modelKeys].map((key) => key.split('|')[0])).size,
  models: modelKeys.size,
  yearMakeRows: Object.keys(modelsByYearMake).length,
  fuelRows: Object.keys(fuels).length,
  transmissionRows: Object.keys(transmissions).length,
  engineRows: Object.keys(engines).length,
  packageRows: Object.keys(packages).length,
  issueCounts: counts,
  issueSamples: issues.slice(0, 100),
}, null, 2));

if (issues.length) process.exitCode = 1;
