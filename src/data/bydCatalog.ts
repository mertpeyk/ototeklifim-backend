export type BydModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'SUV';
  fuel: 'Elektrik' | 'Hibrit';
  engines: string[];
  packages: string[];
};

// Official BYD Türkiye nameplates. BYD passenger-car sales in Türkiye start
// in this catalog at model year 2024; the upstream global feed's artificial
// 2010-era gasoline rows must never be exposed by the valuation UI.
export const bydCatalog: Record<string, BydModel> = {
  'ATTO 2': {
    from: 2025, to: 2026, bodyType: 'SUV', fuel: 'Elektrik',
    engines: ['130 kW Elektrik (177 PS)'], packages: ['Boost', 'Comfort'],
  },
  DOLPHIN: {
    from: 2024, to: 2026, bodyType: 'Hatchback', fuel: 'Elektrik',
    engines: ['150 kW Elektrik (204 PS)'], packages: ['Comfort', 'Design'],
  },
  'ATTO 3': {
    from: 2024, to: 2026, bodyType: 'SUV', fuel: 'Elektrik',
    engines: ['150 kW Elektrik (204 PS)'], packages: ['Design'],
  },
  'SEAL U EV': {
    from: 2024, to: 2026, bodyType: 'SUV', fuel: 'Elektrik',
    engines: ['160 kW Elektrik (218 PS)'], packages: ['Design'],
  },
  'SEAL U DM-i': {
    from: 2024, to: 2026, bodyType: 'SUV', fuel: 'Hibrit',
    engines: ['1.5 DM-i Comfort', '1.5 DM-i Design AWD'], packages: ['Comfort', 'Design'],
  },
  SEAL: {
    from: 2024, to: 2026, bodyType: 'Sedan', fuel: 'Elektrik',
    engines: ['230 kW RWD', '390 kW AWD'], packages: ['Design', 'Excellence AWD'],
  },
  'SEALION 7': {
    from: 2025, to: 2026, bodyType: 'SUV', fuel: 'Elektrik',
    engines: ['230 kW RWD', '390 kW AWD'], packages: ['Design', 'Excellence AWD'],
  },
  HAN: {
    from: 2024, to: 2026, bodyType: 'Sedan', fuel: 'Elektrik',
    engines: ['380 kW AWD'], packages: ['Executive AWD'],
  },
  TANG: {
    from: 2024, to: 2026, bodyType: 'SUV', fuel: 'Elektrik',
    engines: ['380 kW AWD'], packages: ['Flagship AWD'],
  },
};
