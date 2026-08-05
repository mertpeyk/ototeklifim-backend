import { buildEstimatedFastSaleNumbers, type ValuationEstimateInput } from '../lib/valuation.js';

process.env.VALUATION_SKIP_CALIBRATION_DB = '1';

const scenarios: Array<{ name: string; input: ValuationEstimateInput }> = [
  {
    name: '2021 Volkswagen Polo 1.0 TSI Comfortline DSG',
    input: {
      vehicleInfo: {
        vehicleType: 'Otomobil',
        brand: 'Volkswagen',
        model: 'Polo',
        packageName: 'Comfortline',
        year: 2021,
        mileage: 43000,
        fuelType: 'Benzin',
        transmission: 'Otomatik',
        bodyType: 'Hatchback',
        engineVolume: '1.0 TSI DSG 95',
        enginePower: '',
        color: 'Gri',
        city: 'Istanbul',
        district: '',
      },
      condition: {
        tramerAmount: 0,
        severeDamage: false,
        paintedParts: [],
        changedParts: [],
        mechanicalStatus: 'Periyodik bakim gecmisi mevcut',
        maintenanceHistory: 'Tum bakimlar yetkili servis',
        appraisalReport: '',
        airbagCondition: 'clean',
        chassisPodyeCondition: 'clean',
        pillarCondition: 'clean',
        criticalChecks: [],
        damageParts: [],
      },
      extraKey: false,
      serviceHistory: true,
    },
  },
  {
    name: '2020 Renault Clio 1.0 TCe Icon X-Tronic',
    input: {
      vehicleInfo: {
        vehicleType: 'Otomobil',
        brand: 'Renault',
        model: 'Clio',
        packageName: 'Icon',
        year: 2020,
        mileage: 58000,
        fuelType: 'Benzin',
        transmission: 'Otomatik',
        bodyType: 'Hatchback',
        engineVolume: '1.0 TCe',
        enginePower: '',
        color: 'Beyaz',
        city: 'Istanbul',
        district: '',
      },
      condition: {
        tramerAmount: 0,
        severeDamage: false,
        paintedParts: [],
        changedParts: [],
        mechanicalStatus: 'Bakimli',
        maintenanceHistory: 'Servis kayitli',
        appraisalReport: '',
        airbagCondition: 'clean',
        chassisPodyeCondition: 'clean',
        pillarCondition: 'clean',
        criticalChecks: [],
        damageParts: [],
      },
      extraKey: false,
      serviceHistory: true,
    },
  },
  {
    name: '2021 Toyota Corolla 1.5 Vision Multidrive S',
    input: {
      vehicleInfo: {
        vehicleType: 'Otomobil',
        brand: 'Toyota',
        model: 'Corolla',
        packageName: 'Vision',
        year: 2021,
        mileage: 52000,
        fuelType: 'Benzin',
        transmission: 'Otomatik',
        bodyType: 'Sedan',
        engineVolume: '1.5',
        enginePower: '',
        color: 'Gri',
        city: 'Ankara',
        district: '',
      },
      condition: {
        tramerAmount: 0,
        severeDamage: false,
        paintedParts: [],
        changedParts: [],
        mechanicalStatus: 'Bakimli',
        maintenanceHistory: 'Servis kayitli',
        appraisalReport: '',
        airbagCondition: 'clean',
        chassisPodyeCondition: 'clean',
        pillarCondition: 'clean',
        criticalChecks: [],
        damageParts: [],
      },
      extraKey: false,
      serviceHistory: true,
    },
  },
];

for (const scenario of scenarios) {
  const result = await buildEstimatedFastSaleNumbers(scenario.input);
  const comp = result.result.marketComps;

  console.log(`\n=== ${scenario.name} ===`);
  console.log(`estimate=${result.estimatedMarketValue} quick=${result.quickSaleValue} dealer=${result.dealerBuyValue}`);
  console.log(
    `comps=${comp?.sampleSize || 0} median=${comp?.median || 0} trimmed=${comp?.trimmedAverage || 0} source=${comp?.source || 'none'}`,
  );
  console.log(result.valuationSummary);
}
