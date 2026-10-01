import { buildVehicleCatalogSnapshot } from '../lib/vehicle-catalog-db.js';

type StringMap = Record<string, string[]>;

const snapshot = await buildVehicleCatalogSnapshot() as Record<string, any>;
const modelsByYearMake = (snapshot.modelsByYearMake || {}) as StringMap;
const fuels = (snapshot.fuelTypesByKey || {}) as StringMap;
const transmissions = (snapshot.transmissionsByKey || {}) as StringMap;
const engines = (snapshot.enginesByKey || {}) as StringMap;
const metadata = (snapshot.valuationMetadata || {}) as Record<string, any>;
const packages = (metadata.modelPackages || {}) as StringMap;
const referenceModels = ((snapshot.vehicleReferenceIndex || {}).models || {}) as Record<string, Record<string, string[]>>;

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
const audiA4ReferencePackages = referenceModels['Otomobil|Audi|A4']?.['45 TFSI quattro'] || [];
if (!audiA4ReferencePackages.includes('Advanced') || !audiA4ReferencePackages.includes('S line')) {
  issues.push({ type: 'audi_missing_engine_packages', key: 'Otomobil|Audi|A4|45 TFSI quattro' });
}

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

for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand] = fuelKey.split('|');
  if (brand !== 'Chery') continue;
  if (values.length !== 1 || values[0] !== 'Benzin') issues.push({ type: 'chery_invalid_fuel', key: fuelKey });
  const gearValues = transmissions[`${fuelKey}|Benzin`] || [];
  if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
    issues.push({ type: 'chery_invalid_transmission', key: `${fuelKey}|Benzin` });
  }
}
for (const year of ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022']) {
  if ((modelsByYearMake[`${year}|Chery`] || []).length) issues.push({ type: 'chery_invalid_model_year', key: `${year}|Chery` });
}

const chevroletEvModels = ['Bolt EV', 'Bolt EUV', 'Equinox EV', 'Blazer EV'];
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand !== 'Chevrolet' || !chevroletEvModels.includes(model)) continue;
  if (values.length !== 1 || values[0] !== 'Elektrik') {
    issues.push({ type: 'chevrolet_ev_non_electric', key: fuelKey });
  }
  const gearValues = transmissions[`${fuelKey}|Elektrik`] || [];
  if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
    issues.push({ type: 'chevrolet_ev_non_automatic', key: `${fuelKey}|Elektrik` });
  }
}
for (const model of ['Spark', 'Aveo', 'Cruze', 'Orlando', 'Captiva']) {
  if ((modelsByYearMake['2016|Chevrolet'] || []).includes(model)) {
    issues.push({ type: 'chevrolet_invalid_model_year', key: `2016|Chevrolet|${model}` });
  }
}
if ((modelsByYearMake['2024|Chevrolet'] || []).includes('Camaro')) {
  const yearModels = modelsByYearMake['2025|Chevrolet'] || [];
  if (yearModels.includes('Camaro')) issues.push({ type: 'chevrolet_invalid_model_year', key: '2025|Chevrolet|Camaro' });
}

const citroenEvModels = ['e-C3', 'e-C3 Aircross', 'e-C4', 'e-C4 X', 'e-C5 Aircross', 'e-Berlingo', 'e-Jumpy', 'e-Jumper', 'e-SpaceTourer', 'Ami'];
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand !== 'Citroën' || !citroenEvModels.includes(model)) continue;
  if (values.length !== 1 || values[0] !== 'Elektrik') {
    issues.push({ type: 'citroen_ev_non_electric', key: fuelKey });
  }
  const gearValues = transmissions[`${fuelKey}|Elektrik`] || [];
  if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
    issues.push({ type: 'citroen_ev_non_automatic', key: `${fuelKey}|Elektrik` });
  }
}
for (const model of ['BX', 'Saxo', 'Xantia', 'XM', 'Xsara', 'ZX', 'Evasion']) {
  for (const year of ['2010', '2015', '2020', '2026']) {
    if ((modelsByYearMake[`${year}|Citroën`] || []).includes(model)) {
      issues.push({ type: 'citroen_legacy_model_leak', key: `${year}|Citroën|${model}` });
    }
  }
}
if ((modelsByYearMake['2026|Citroën'] || []).includes('C-Elysée')) {
  issues.push({ type: 'citroen_invalid_model_year', key: '2026|Citroën|C-Elysée' });
}
if ((modelsByYearMake['2020|Citroën'] || []).includes('e-C3')) {
  issues.push({ type: 'citroen_invalid_model_year', key: '2020|Citroën|e-C3' });
}
if ((packages['Citroën|C4'] || []).some((value) => value.toLowerCase().includes('e-c4'))) {
  issues.push({ type: 'citroen_package_model_leak', key: 'Citroën|C4' });
}
if ((packages['Citroën|e-C4'] || []).some((value) => ['attraction', 'confort', 'exclusive'].includes(value.toLowerCase()))) {
  issues.push({ type: 'citroen_package_model_leak', key: 'Citroën|e-C4' });
}
if (Object.keys(modelsByYearMake).some((key) => key.endsWith('|Citroen') && (modelsByYearMake[key] || []).length)) {
  issues.push({ type: 'citroen_duplicate_unaccented_brand', key: 'Citroen' });
}

const cupraEvModels = ['Born', 'Tavascan'];
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand !== 'Cupra') continue;
  if (cupraEvModels.includes(model) && (values.length !== 1 || values[0] !== 'Elektrik')) {
    issues.push({ type: 'cupra_ev_non_electric', key: fuelKey });
  }
  for (const fuel of values) {
    const gearValues = transmissions[`${fuelKey}|${fuel}`] || [];
    if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
      issues.push({ type: 'cupra_non_automatic', key: `${fuelKey}|${fuel}` });
    }
  }
}
for (const year of ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017']) {
  if ((modelsByYearMake[`${year}|Cupra`] || []).length) {
    issues.push({ type: 'cupra_invalid_model_year', key: `${year}|Cupra` });
  }
}
if ((modelsByYearMake['2024|Cupra'] || []).includes('Tavascan') || (modelsByYearMake['2024|Cupra'] || []).includes('Terramar')) {
  issues.push({ type: 'cupra_invalid_model_year', key: '2024|Cupra|Tavascan/Terramar' });
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
