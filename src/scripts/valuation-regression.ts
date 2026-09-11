import assert from 'node:assert/strict';

import { normalizeComparablePriceForTarget } from '../lib/market-comps.js';
import { estimateVehicleValue, type ValuationEstimateInput } from '../lib/valuation.js';

process.env.OPENAI_API_KEY = '';
process.env.VALUATION_SKIP_CALIBRATION_DB = '1';

const baseInput: ValuationEstimateInput = {
  vehicleInfo: {
    vehicleType: 'Otomobil',
    brand: 'Toyota',
    model: 'Corolla',
    packageName: 'Vision',
    year: 2021,
    mileage: 65000,
    fuelType: 'Benzin',
    transmission: 'Otomatik',
    bodyType: 'Sedan',
    engineVolume: '1.5',
    enginePower: '',
    color: 'Beyaz',
    city: 'Ankara',
    district: '',
  },
  condition: {
    tramerAmount: 0,
    severeDamage: false,
    paintedParts: [],
    changedParts: [],
    mechanicalStatus: 'Bakımlı',
    maintenanceHistory: 'Servis kayıtlı',
    appraisalReport: '',
    airbagCondition: 'clean',
    chassisPodyeCondition: 'clean',
    pillarCondition: 'clean',
    criticalChecks: [],
    damageParts: [],
  },
  extraKey: true,
  serviceHistory: true,
};

function withVehicle(overrides: Partial<ValuationEstimateInput['vehicleInfo']>): ValuationEstimateInput {
  return {
    ...baseInput,
    vehicleInfo: { ...baseInput.vehicleInfo, ...overrides },
    condition: { ...baseInput.condition },
  };
}

const clean = await estimateVehicleValue(baseInput, { skipMarketComps: true, skipModelCalibration: true });
const newer = await estimateVehicleValue(withVehicle({ year: 2024 }), { skipMarketComps: true, skipModelCalibration: true });
const older = await estimateVehicleValue(withVehicle({ year: 2016 }), { skipMarketComps: true, skipModelCalibration: true });
const lowMileage = await estimateVehicleValue(withVehicle({ mileage: 25000 }), { skipMarketComps: true, skipModelCalibration: true });
const highMileage = await estimateVehicleValue(withVehicle({ mileage: 190000 }), { skipMarketComps: true, skipModelCalibration: true });
const damaged = await estimateVehicleValue({
  ...baseInput,
  condition: {
    ...baseInput.condition,
    tramerAmount: 180000,
    severeDamage: true,
    airbagCondition: 'issue',
    chassisPodyeCondition: 'issue',
    pillarCondition: 'issue',
    damageParts: [
      { key: 'front-left-door', label: 'Sol ön kapı', status: 'Degisen' },
      { key: 'rear-left-door', label: 'Sol arka kapı', status: 'Boyali' },
    ],
  },
}, { skipMarketComps: true, skipModelCalibration: true });

async function estimateCondition(overrides: Partial<ValuationEstimateInput['condition']>) {
  return estimateVehicleValue({
    ...baseInput,
    condition: { ...baseInput.condition, ...overrides },
  }, { skipMarketComps: true, skipModelCalibration: true, skipOpenAi: true });
}

const localPainted = await estimateCondition({
  damageParts: [{ key: 'front-left-fender', label: 'Sol ön çamurluk', status: 'Lokal Boyali' }],
});
const painted = await estimateCondition({
  damageParts: [{ key: 'front-left-fender', label: 'Sol ön çamurluk', status: 'Boyali' }],
});
const changed = await estimateCondition({
  damageParts: [{ key: 'front-left-fender', label: 'Sol ön çamurluk', status: 'Degisen' }],
});
const airbagIssue = await estimateCondition({ airbagCondition: 'issue' });
const chassisIssue = await estimateCondition({ chassisPodyeCondition: 'issue' });
const pillarIssue = await estimateCondition({ pillarCondition: 'issue' });
const lowTramer = await estimateCondition({ tramerAmount: 20000 });
const mediumTramer = await estimateCondition({ tramerAmount: 100000 });
const highTramer = await estimateCondition({ tramerAmount: 300000 });

const lowMileageCorsa = await estimateVehicleValue({
  ...baseInput,
  vehicleInfo: {
    vehicleType: 'Otomobil',
    brand: 'Opel',
    model: 'Corsa',
    packageName: 'Enjoy',
    year: 2013,
    mileage: 68000,
    fuelType: 'Benzin',
    transmission: 'Otomatik',
    bodyType: 'Hatchback',
    engineVolume: '1.4 Twinport',
    enginePower: '100 hp',
    color: 'Gri',
    city: 'İstanbul',
    district: '',
  },
  condition: {
    ...baseInput.condition,
    mechanicalStatus: 'Periyodik bakım geçmişi mevcut',
    maintenanceHistory: 'Karışık servis geçmişi',
  },
  extraKey: false,
  serviceHistory: true,
}, { skipMarketComps: true, skipModelCalibration: true, skipOpenAi: true });

async function estimateBmwEngine(engineVolume: string) {
  return estimateVehicleValue({
    ...baseInput,
    vehicleInfo: {
      ...baseInput.vehicleInfo,
      brand: 'BMW',
      model: '3 Serisi',
      packageName: 'M Sport',
      year: 2020,
      mileage: 70000,
      engineVolume,
      enginePower: '',
    },
  }, { skipMarketComps: true, skipModelCalibration: true, skipOpenAi: true });
}

const bmwModelCodeEngine = await estimateBmwEngine('320i 170');
const bmwLiteralEngine = await estimateBmwEngine('2.0 170 hp');
const bmwLowerPower = await estimateBmwEngine('2.0 136 hp');
const bmwHigherPower = await estimateBmwEngine('2.0 245 hp');

const unknownPackage = await estimateVehicleValue({
  ...baseInput,
  vehicleInfo: { ...baseInput.vehicleInfo, packageName: 'Diğer / Listede Yok' },
}, { skipMarketComps: true, skipModelCalibration: true, skipOpenAi: true });
const neutralNamedPackage = await estimateVehicleValue({
  ...baseInput,
  vehicleInfo: { ...baseInput.vehicleInfo, packageName: 'Orta Paket' },
}, { skipMarketComps: true, skipModelCalibration: true, skipOpenAi: true });

assert.ok(newer.estimate > clean.estimate, 'Newer model year must increase the estimate');
assert.ok(clean.estimate > older.estimate, 'Older model year must decrease the estimate');
assert.ok(lowMileage.estimate > highMileage.estimate, 'Lower mileage must increase the estimate');
assert.ok(damaged.estimate < clean.estimate * 0.8, 'Structural damage must materially reduce the estimate');
assert.ok(localPainted.estimate < clean.estimate, 'Local paint must reduce the estimate');
assert.ok(painted.estimate < localPainted.estimate, 'Full paint must reduce value more than local paint');
assert.ok(changed.estimate < painted.estimate, 'A replaced part must reduce value more than paint');
assert.ok(airbagIssue.estimate <= clean.estimate * 0.91, 'Airbag work must materially reduce value');
assert.ok(chassisIssue.estimate <= clean.estimate * 0.83, 'Chassis/podye work must strongly reduce value');
assert.ok(pillarIssue.estimate <= clean.estimate * 0.87, 'Pillar work must strongly reduce value');
assert.ok(lowMileageCorsa.estimate >= 850000 && lowMileageCorsa.estimate <= 900000, 'Low-mileage 2013 Opel Corsa benchmark must stay near the observed retail market');
assert.ok(lowTramer.estimate > mediumTramer.estimate, 'A larger tramer record must reduce value more');
assert.ok(mediumTramer.estimate > highTramer.estimate, 'A high tramer record must reduce value more than a medium record');
assert.ok(bmwModelCodeEngine.estimate < 4000000, 'BMW model code must never be parsed as a 320-liter engine');
assert.ok(
  Math.abs(bmwModelCodeEngine.estimate - bmwLiteralEngine.estimate) / bmwLiteralEngine.estimate < 0.08,
  'BMW 320i model-code pricing must stay close to the equivalent 2.0-liter engine',
);
assert.ok(bmwLowerPower.estimate < bmwLiteralEngine.estimate, 'Lower engine power must not increase the estimate');
assert.ok(bmwHigherPower.estimate > bmwLiteralEngine.estimate, 'Higher engine power must increase the estimate');
assert.ok(unknownPackage.estimate < neutralNamedPackage.estimate, 'Unknown package must not receive a generic trim premium');
assert.ok(unknownPackage.confidenceScore < neutralNamedPackage.confidenceScore, 'Unknown package must lower valuation confidence');

for (const result of [clean, newer, older, lowMileage, highMileage, damaged, localPainted, painted, changed, airbagIssue, chassisIssue, pillarIssue, lowTramer, mediumTramer, highTramer, lowMileageCorsa, bmwModelCodeEngine, bmwLiteralEngine, bmwLowerPower, bmwHigherPower, unknownPackage, neutralNamedPackage]) {
  assert.ok(result.minimum <= result.estimate, 'Minimum must not exceed the estimate');
  assert.ok(result.maximum >= result.estimate, 'Maximum must not be below the estimate');
  assert.equal(result.estimate % 1000, 0, 'Displayed estimates must be rounded to 1,000 TL');
}

const advertPrice = 1500000;
const lowerForHigherTargetKm = normalizeComparablePriceForTarget({
  advertPrice,
  advertYear: 2021,
  advertKm: 60000,
  targetYear: 2021,
  targetKm: 120000,
});
const higherForLowerTargetKm = normalizeComparablePriceForTarget({
  advertPrice,
  advertYear: 2021,
  advertKm: 60000,
  targetYear: 2021,
  targetKm: 30000,
});
const higherForNewerTargetYear = normalizeComparablePriceForTarget({
  advertPrice,
  advertYear: 2021,
  advertKm: 60000,
  targetYear: 2023,
  targetKm: 60000,
});

assert.ok(lowerForHigherTargetKm < advertPrice, 'A higher-mileage target must lower the comparable price');
assert.ok(higherForLowerTargetKm > advertPrice, 'A lower-mileage target must raise the comparable price');
assert.ok(higherForNewerTargetYear > advertPrice, 'A newer target year must raise the comparable price');

console.log(JSON.stringify({
  clean: clean.estimate,
  newer: newer.estimate,
  older: older.estimate,
  lowMileage: lowMileage.estimate,
  highMileage: highMileage.estimate,
  damaged: damaged.estimate,
  lowMileageCorsa: lowMileageCorsa.estimate,
  bmw320i: bmwModelCodeEngine.estimate,
  bmw2Liter170Hp: bmwLiteralEngine.estimate,
  tramerCurve: [lowTramer.estimate, mediumTramer.estimate, highTramer.estimate],
}, null, 2));
