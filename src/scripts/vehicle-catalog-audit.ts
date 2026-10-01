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

// Brand-by-brand regression checks. Audi is the first fully reconciled
// nameplate catalog: current EVs must not inherit combustion fuels/gears and
// discontinued canonical models must not appear outside their valid years.
const audiEvModels = ['e-tron', 'Q4 e-tron', 'Q6 e-tron', 'Q8 e-tron', 'A6 e-tron', 'e-tron GT'];
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand !== 'Audi' || !audiEvModels.includes(model)) continue;
  if (values.some((fuel) => fuel !== 'Elektrik')) issues.push({ type: 'audi_ev_non_electric', key: fuelKey });
  const gearValues = transmissions[`${fuelKey}|Elektrik`] || [];
  if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
    issues.push({ type: 'audi_ev_non_automatic', key: `${fuelKey}|Elektrik` });
  }
}
if ((modelsByYearMake['2025|Audi'] || []).includes('A4')) issues.push({ type: 'audi_invalid_model_year', key: '2025|Audi|A4' });
if ((modelsByYearMake['2026|Audi'] || []).includes('Q8 e-tron')) issues.push({ type: 'audi_invalid_model_year', key: '2026|Audi|Q8 e-tron' });

const bmwEvModels = ['i3', 'i4', 'i5', 'i7', 'iX', 'iX1', 'iX2', 'iX3'];
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand !== 'BMW' || !bmwEvModels.includes(model)) continue;
  if (values.length !== 1 || values[0] !== 'Elektrik') issues.push({ type: 'bmw_ev_non_electric', key: fuelKey });
  const gearValues = transmissions[`${fuelKey}|Elektrik`] || [];
  if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
    issues.push({ type: 'bmw_ev_non_automatic', key: `${fuelKey}|Elektrik` });
  }
}
if ((modelsByYearMake['2012|BMW'] || []).includes('i3')) issues.push({ type: 'bmw_invalid_model_year', key: '2012|BMW|i3' });
if ((modelsByYearMake['2023|BMW'] || []).includes('iX2')) issues.push({ type: 'bmw_invalid_model_year', key: '2023|BMW|iX2' });
if ((modelsByYearMake['2023|BMW'] || []).includes('i3')) issues.push({ type: 'bmw_invalid_model_year', key: '2023|BMW|i3' });

const bydEvModels = ['ATTO 2', 'DOLPHIN', 'ATTO 3', 'SEAL U EV', 'SEAL', 'SEALION 7', 'HAN', 'TANG'];
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand !== 'BYD') continue;
  if (bydEvModels.includes(model) && (values.length !== 1 || values[0] !== 'Elektrik')) {
    issues.push({ type: 'byd_ev_non_electric', key: fuelKey });
  }
  if (model === 'SEAL U DM-i' && (values.length !== 1 || values[0] !== 'Hibrit')) {
    issues.push({ type: 'byd_dmi_non_hybrid', key: fuelKey });
  }
  for (const fuel of values) {
    const gearValues = transmissions[`${fuelKey}|${fuel}`] || [];
    if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
      issues.push({ type: 'byd_non_automatic', key: `${fuelKey}|${fuel}` });
    }
  }
}
for (const year of ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']) {
  if ((modelsByYearMake[`${year}|BYD`] || []).length) issues.push({ type: 'byd_invalid_model_year', key: `${year}|BYD` });
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
