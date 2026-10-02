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

// Jaguar stopped the outgoing product range during 2024. Keep I-PACE purely
// electric and prevent manual/automatic engine contamination in representative
// XF/F-TYPE rows.
if ((modelsByYearMake['2025|Jaguar'] || []).length || (modelsByYearMake['2026|Jaguar'] || []).length) {
  issues.push({ type: 'jaguar_post_2024_legacy_model', key: '2025-2026|Jaguar' });
}
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand !== 'Jaguar' || model !== 'I-PACE') continue;
  if (values.length !== 1 || values[0] !== 'Elektrik') {
    issues.push({ type: 'jaguar_ipace_non_electric', key: fuelKey });
  }
  const gearValues = transmissions[`${fuelKey}|Elektrik`] || [];
  if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
    issues.push({ type: 'jaguar_ipace_non_automatic', key: `${fuelKey}|Elektrik` });
  }
}
for (const model of ['XJ', 'XK']) {
  if ((modelsByYearMake['2024|Jaguar'] || []).includes(model)) {
    issues.push({ type: 'jaguar_discontinued_model_leak', key: `2024|Jaguar|${model}` });
  }
}
const jaguarXf2019Diesel = '2019|Jaguar|XF|Sedan|Dizel';
if ((engines[`${jaguarXf2019Diesel}|Manuel`] || []).some((value) => /AT8/.test(value))) {
  issues.push({ type: 'jaguar_engine_transmission_leak', key: `${jaguarXf2019Diesel}|Manuel` });
}
if ((engines[`${jaguarXf2019Diesel}|Otomatik`] || []).some((value) => !/AT8/.test(value))) {
  issues.push({ type: 'jaguar_engine_transmission_leak', key: `${jaguarXf2019Diesel}|Otomatik` });
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
const audiA4LegacyDieselPackages = referenceModels['Otomobil|Audi|A4']?.['2.0 TDI'] || [];
if (!['Attraction', 'Ambition', 'Ambiente'].every((trim) => audiA4LegacyDieselPackages.includes(trim))) {
  issues.push({ type: 'audi_missing_2013_a4_2_0_tdi_packages', key: 'Otomobil|Audi|A4|2.0 TDI' });
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

for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand !== 'Dacia') continue;
  if (model === 'Spring' && (values.length !== 1 || values[0] !== 'Elektrik')) {
    issues.push({ type: 'dacia_spring_non_electric', key: fuelKey });
  }
  if (model === 'Spring') {
    const gearValues = transmissions[`${fuelKey}|Elektrik`] || [];
    if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
      issues.push({ type: 'dacia_spring_non_automatic', key: `${fuelKey}|Elektrik` });
    }
  }
}
for (const model of ['Duster', 'Lodgy', 'Dokker', 'Dokker Van']) {
  if ((modelsByYearMake['2026|Dacia'] || []).includes(model)) {
    issues.push({ type: 'dacia_invalid_model_year', key: `2026|Dacia|${model}` });
  }
}
if ((modelsByYearMake['2021|Dacia'] || []).includes('Jogger')) {
  issues.push({ type: 'dacia_invalid_model_year', key: '2021|Dacia|Jogger' });
}
if ((modelsByYearMake['2025|Dacia'] || []).includes('Spring')) {
  issues.push({ type: 'dacia_invalid_model_year', key: '2025|Dacia|Spring' });
}
for (const year of ['2021', '2022', '2023', '2024', '2025']) {
  if ((modelsByYearMake[`${year}|Dacia`] || []).includes('Logan')) {
    issues.push({ type: 'dacia_logan_generation_gap', key: `${year}|Dacia|Logan` });
  }
}
const daciaDuster2023Base = '2023|Dacia|Duster|SUV';
if ((engines[`${daciaDuster2023Base}|Benzin|Manuel`] || []).some((value) => value.includes('EDC'))) {
  issues.push({ type: 'dacia_engine_transmission_leak', key: `${daciaDuster2023Base}|Benzin|Manuel` });
}
if ((engines[`${daciaDuster2023Base}|Benzin|Otomatik`] || []).some((value) => value.includes('4x4'))) {
  issues.push({ type: 'dacia_engine_transmission_leak', key: `${daciaDuster2023Base}|Benzin|Otomatik` });
}
const daciaJogger2026Base = '2026|Dacia|Jogger|MPV|LPG';
if ((engines[`${daciaJogger2026Base}|Manuel`] || []).some((value) => value.includes('EDC'))) {
  issues.push({ type: 'dacia_engine_transmission_leak', key: `${daciaJogger2026Base}|Manuel` });
}
if ((engines[`${daciaJogger2026Base}|Otomatik`] || []).some((value) => !value.includes('EDC'))) {
  issues.push({ type: 'dacia_engine_transmission_leak', key: `${daciaJogger2026Base}|Otomatik` });
}

const fiatEvModels = ['500e', '600e', 'E-Ulysse'];
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand !== 'Fiat') continue;
  if (fiatEvModels.includes(model) && (values.length !== 1 || values[0] !== 'Elektrik')) {
    issues.push({ type: 'fiat_ev_non_electric', key: fuelKey });
  }
  if (fiatEvModels.includes(model)) {
    const gearValues = transmissions[`${fuelKey}|Elektrik`] || [];
    if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
      issues.push({ type: 'fiat_ev_non_automatic', key: `${fuelKey}|Elektrik` });
    }
  }
}
for (const model of ['Albea', 'Palio', 'Grande Punto']) {
  if ((modelsByYearMake['2013|Fiat'] || []).includes(model)) {
    issues.push({ type: 'fiat_invalid_model_year', key: `2013|Fiat|${model}` });
  }
}
for (const model of ['Punto', 'Linea', 'Bravo', '500L', '500X']) {
  if ((modelsByYearMake['2026|Fiat'] || []).includes(model)) {
    issues.push({ type: 'fiat_invalid_model_year', key: `2026|Fiat|${model}` });
  }
}
if ((modelsByYearMake['2020|Fiat'] || []).includes('500e')) {
  issues.push({ type: 'fiat_invalid_model_year', key: '2020|Fiat|500e' });
}
const fiatEgea2023Base = '2023|Fiat|Egea Sedan|Sedan|Dizel';
if ((engines[`${fiatEgea2023Base}|Manuel`] || []).some((value) => value.includes('DCT'))) {
  issues.push({ type: 'fiat_engine_transmission_leak', key: `${fiatEgea2023Base}|Manuel` });
}
if ((engines[`${fiatEgea2023Base}|Otomatik`] || []).some((value) => !value.includes('DCT'))) {
  issues.push({ type: 'fiat_engine_transmission_leak', key: `${fiatEgea2023Base}|Otomatik` });
}

const fordEvModels = ['Puma Gen-E', 'Explorer EV', 'Capri EV', 'Mustang Mach-E', 'E-Tourneo Courier', 'E-Tourneo Custom', 'E-Transit Courier', 'E-Transit Custom', 'E-Transit'];
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand !== 'Ford' || !fordEvModels.includes(model)) continue;
  if (values.length !== 1 || values[0] !== 'Elektrik') {
    issues.push({ type: 'ford_ev_non_electric', key: fuelKey });
  }
  const gearValues = transmissions[`${fuelKey}|Elektrik`] || [];
  if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
    issues.push({ type: 'ford_ev_non_automatic', key: `${fuelKey}|Elektrik` });
  }
}
for (const model of ['Fiesta', 'B-Max', 'Mondeo', 'C-Max', 'Grand C-Max', 'EcoSport']) {
  if ((modelsByYearMake['2026|Ford'] || []).includes(model)) {
    issues.push({ type: 'ford_invalid_model_year', key: `2026|Ford|${model}` });
  }
}
if ((modelsByYearMake['2020|Ford'] || []).includes('Mustang Mach-E')) {
  issues.push({ type: 'ford_invalid_model_year', key: '2020|Ford|Mustang Mach-E' });
}
if ((modelsByYearMake['2023|Ford'] || []).includes('Explorer EV')) {
  issues.push({ type: 'ford_invalid_model_year', key: '2023|Ford|Explorer EV' });
}
const fordFocus2023Diesel = '2023|Ford|Focus|Hatchback|Dizel';
if ((engines[`${fordFocus2023Diesel}|Manuel`] || []).some((value) => /AT8|PowerShift|DCT/.test(value))) {
  issues.push({ type: 'ford_engine_transmission_leak', key: `${fordFocus2023Diesel}|Manuel` });
}
if ((engines[`${fordFocus2023Diesel}|Otomatik`] || []).some((value) => !/AT8|PowerShift|DCT/.test(value))) {
  issues.push({ type: 'ford_engine_transmission_leak', key: `${fordFocus2023Diesel}|Otomatik` });
}

const hondaElectrifiedModels = ['Jazz e:HEV', 'HR-V e:HEV', 'CR-V e:HEV', 'ZR-V e:HEV', 'e:Ny1', 'Prelude e:HEV'];
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand !== 'Honda' || !hondaElectrifiedModels.includes(model)) continue;
  const expectedFuel = model === 'e:Ny1' ? 'Elektrik' : 'Hibrit';
  if (values.length !== 1 || values[0] !== expectedFuel) {
    issues.push({ type: 'honda_electrified_invalid_fuel', key: fuelKey });
  }
  const gearValues = transmissions[`${fuelKey}|${expectedFuel}`] || [];
  if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
    issues.push({ type: 'honda_electrified_non_automatic', key: `${fuelKey}|${expectedFuel}` });
  }
}
for (const model of ['Accord', 'Insight', 'CR-Z']) {
  if ((modelsByYearMake['2026|Honda'] || []).includes(model)) {
    issues.push({ type: 'honda_invalid_model_year', key: `2026|Honda|${model}` });
  }
}
for (const year of ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']) {
  if ((modelsByYearMake[`${year}|Honda`] || []).includes('City')) {
    issues.push({ type: 'honda_city_generation_gap', key: `${year}|Honda|City` });
  }
}
if ((modelsByYearMake['2022|Honda'] || []).includes('Civic Type R')) {
  issues.push({ type: 'honda_type_r_generation_gap', key: '2022|Honda|Civic Type R' });
}
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [year, brand, model] = fuelKey.split('|');
  if (brand !== 'Honda' || model !== 'Civic Sedan') continue;
  if (values.includes('Dizel') && (Number(year) < 2018 || Number(year) > 2020)) {
    issues.push({ type: 'honda_civic_diesel_invalid_year', key: fuelKey });
  }
}
const hondaCivic2019Diesel = '2019|Honda|Civic Sedan|Sedan|Dizel';
if ((engines[`${hondaCivic2019Diesel}|Manuel`] || []).some((value) => /AT9|CVT/.test(value))) {
  issues.push({ type: 'honda_engine_transmission_leak', key: `${hondaCivic2019Diesel}|Manuel` });
}
if ((engines[`${hondaCivic2019Diesel}|Otomatik`] || []).some((value) => !/AT9|CVT/.test(value))) {
  issues.push({ type: 'honda_engine_transmission_leak', key: `${hondaCivic2019Diesel}|Otomatik` });
}

const hyundaiEvModels = ['Kona EV', 'IONIQ Electric', 'IONIQ 5', 'IONIQ 5 N', 'IONIQ 6', 'IONIQ 9', 'INSTER'];
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand !== 'Hyundai' || !hyundaiEvModels.includes(model)) continue;
  if (values.length !== 1 || values[0] !== 'Elektrik') {
    issues.push({ type: 'hyundai_ev_non_electric', key: fuelKey });
  }
  const gearValues = transmissions[`${fuelKey}|Elektrik`] || [];
  if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
    issues.push({ type: 'hyundai_ev_non_automatic', key: `${fuelKey}|Elektrik` });
  }
}
for (const model of ['Getz', 'Matrix', 'Accent Era', 'Sonata', 'Veloster', 'Genesis Coupe', 'ix35']) {
  if ((modelsByYearMake['2026|Hyundai'] || []).includes(model)) {
    issues.push({ type: 'hyundai_invalid_model_year', key: `2026|Hyundai|${model}` });
  }
}
for (const year of ['2021', '2022', '2023']) {
  if ((modelsByYearMake[`${year}|Hyundai`] || []).includes('i30')) {
    issues.push({ type: 'hyundai_i30_sales_gap', key: `${year}|Hyundai|i30` });
  }
}
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand === 'Hyundai' && model === 'STARIA HEV' && (values.length !== 1 || values[0] !== 'Hibrit')) {
    issues.push({ type: 'hyundai_staria_hev_invalid_fuel', key: fuelKey });
  }
}

const toyotaEvModels = ['bZ4X'];
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand !== 'Toyota') continue;
  if (toyotaEvModels.includes(model) && (values.length !== 1 || values[0] !== 'Elektrik')) {
    issues.push({ type: 'toyota_ev_non_electric', key: fuelKey });
  }
  if (toyotaEvModels.includes(model)) {
    const gearValues = transmissions[`${fuelKey}|Elektrik`] || [];
    if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
      issues.push({ type: 'toyota_ev_non_automatic', key: `${fuelKey}|Elektrik` });
    }
  }
}
for (const model of ['Auris', 'Avensis', 'Verso', 'Prius', 'GT86', 'GR86', 'GR Supra']) {
  if ((modelsByYearMake['2026|Toyota'] || []).includes(model)) {
    issues.push({ type: 'toyota_invalid_model_year', key: `2026|Toyota|${model}` });
  }
}
if ((modelsByYearMake['2021|Toyota'] || []).includes('Corolla Cross')) {
  issues.push({ type: 'toyota_invalid_model_year', key: '2021|Toyota|Corolla Cross' });
}
if ((modelsByYearMake['2026|Toyota'] || []).includes('bZ4X')) {
  issues.push({ type: 'toyota_invalid_model_year', key: '2026|Toyota|bZ4X' });
}
const toyotaCorolla2021Petrol = '2021|Toyota|Corolla|Sedan|Benzin';
if ((engines[`${toyotaCorolla2021Petrol}|Manuel`] || []).some((value) => /Multidrive|CVT|e-CVT/.test(value))) {
  issues.push({ type: 'toyota_engine_transmission_leak', key: `${toyotaCorolla2021Petrol}|Manuel` });
}
if ((engines[`${toyotaCorolla2021Petrol}|Otomatik`] || []).some((value) => !/Multidrive|CVT/.test(value))) {
  issues.push({ type: 'toyota_engine_transmission_leak', key: `${toyotaCorolla2021Petrol}|Otomatik` });
}
const toyotaHilux2026Hybrid = '2026|Toyota|Hilux|Pickup|Hibrit';
if ((transmissions[toyotaHilux2026Hybrid] || []).some((value) => value !== 'Otomatik')) {
  issues.push({ type: 'toyota_hilux_hybrid_non_automatic', key: toyotaHilux2026Hybrid });
}

// Volkswagen generations must keep discontinued passenger cars out of 2026,
// battery-electric models isolated, and representative manual/DSG engines
// separated in the catalogue maps.
for (const model of ['Jetta', 'CC', 'Arteon', 'Scirocco', 'Beetle', 'Eos', 'Phaeton', 'Golf Plus', 'Golf Sportsvan', 'Tiguan Allspace', 'e-Golf', 'ID.5']) {
  if ((modelsByYearMake['2026|Volkswagen'] || []).includes(model)) {
    issues.push({ type: 'volkswagen_discontinued_model_leak', key: `2026|Volkswagen|${model}` });
  }
}
for (const [fuelKey, values] of Object.entries(fuels)) {
  const [, brand, model] = fuelKey.split('|');
  if (brand !== 'Volkswagen' || !['e-Golf', 'ID.3', 'ID.4', 'ID.5', 'ID.7', 'ID. Buzz'].includes(model)) continue;
  if (values.length !== 1 || values[0] !== 'Elektrik') {
    issues.push({ type: 'volkswagen_ev_non_electric', key: fuelKey });
  }
  const gearValues = transmissions[`${fuelKey}|Elektrik`] || [];
  if (gearValues.length !== 1 || gearValues[0] !== 'Otomatik') {
    issues.push({ type: 'volkswagen_ev_non_automatic', key: `${fuelKey}|Elektrik` });
  }
}
if ((modelsByYearMake['2021|Volkswagen'] || []).includes('ID.7')) {
  issues.push({ type: 'volkswagen_invalid_model_year', key: '2021|Volkswagen|ID.7' });
}
if ((modelsByYearMake['2022|Volkswagen'] || []).includes('Tayron')) {
  issues.push({ type: 'volkswagen_invalid_model_year', key: '2022|Volkswagen|Tayron' });
}
const volkswagenPolo2018Petrol = '2018|Volkswagen|Polo|Hatchback|Benzin';
if ((engines[`${volkswagenPolo2018Petrol}|Manuel`] || []).some((value) => /DSG/i.test(value))) {
  issues.push({ type: 'volkswagen_engine_transmission_leak', key: `${volkswagenPolo2018Petrol}|Manuel` });
}
if ((engines[`${volkswagenPolo2018Petrol}|Otomatik`] || []).some((value) => /\bMT\d\b/i.test(value))) {
  issues.push({ type: 'volkswagen_engine_transmission_leak', key: `${volkswagenPolo2018Petrol}|Otomatik` });
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
