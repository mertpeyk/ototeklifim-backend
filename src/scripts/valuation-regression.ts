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

for (const result of [clean, newer, older, lowMileage, highMileage, damaged, localPainted, painted, changed, airbagIssue, chassisIssue, pillarIssue, lowMileageCorsa]) {
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
}, null, 2));
