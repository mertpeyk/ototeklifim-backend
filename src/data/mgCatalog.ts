export type MGDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type MGModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Station Wagon' | 'SUV' | 'Coupe' | 'Cabrio';
  drives: MGDrive[];
  packages: string[];
};

// Türkiye-facing MG valuation catalog. Year bounds intentionally prevent
// discontinued combustion models and early EV batteries from leaking into
// current model years.
export const mgCatalog: Record<string, MGModel> = {
  MG3: { from: 2011, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2018, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.3 68', '1.5 VTi-Tech 106'] },
    { to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 VTi-Tech AMT 106'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 Hybrid+ 195'] },
  ], packages: ['Base', 'Comfort', 'Luxury'] },

  MG6: { from: 2010, to: 2019, bodyType: 'Sedan', drives: [
    { to: 2015, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.8 133', '1.8 Turbo 160'] },
    { from: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.9 DTi-Tech 150'] },
  ], packages: ['S', 'SE', 'TSE'] },

  'MG TF': { from: 2010, to: 2011, bodyType: 'Cabrio', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.8 135', '1.8 VVC 160'] },
  ], packages: ['TF', 'LE 500'] },

  ZS: { from: 2021, to: 2025, bodyType: 'SUV', drives: [
    { to: 2022, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.5 VTi-Tech 106'] },
    { to: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 T-GDI AT6 111', '1.5 VTi-Tech CVT 106'] },
  ], packages: ['Comfort', 'Luxury', 'Luxury Plus'] },

  'ZS EV': { from: 2021, to: 2025, bodyType: 'SUV', drives: [
    { to: 2021, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['44.5 kWh 105 kW 143'] },
    { from: 2022, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['51 kWh 130 kW 177', '72.6 kWh 115 kW 156'] },
  ], packages: ['Comfort', 'Luxury'] },

  'ZS Hybrid+': { from: 2026, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 Hybrid+ 197'] },
  ], packages: ['Luxury'] },

  HS: { from: 2021, to: 2026, bodyType: 'SUV', drives: [
    { to: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 T-GDI DCT 162'] },
    { from: 2025, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 Turbo DCT 170'] },
  ], packages: ['Comfort', 'Luxury', 'Luxury Plus'] },

  EHS: { from: 2021, to: 2023, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 T-GDI PHEV 258'] },
  ], packages: ['Luxury'] },

  'HS PHEV': { from: 2024, to: 2025, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 T-GDI PHEV 339'] },
  ], packages: ['Luxury'] },

  'HS Hybrid+': { from: 2026, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 Turbo Hybrid+ 224'] },
  ], packages: ['Luxury'] },

  MG4: { from: 2023, to: 2026, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['51 kWh 125 kW 170', '64 kWh 150 kW 204', '77 kWh 180 kW 245', 'XPower 64 kWh 320 kW 435'] },
  ], packages: ['Comfort', 'Luxury', 'XPower'] },

  MG5: { from: 2022, to: 2025, bodyType: 'Station Wagon', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['50.3 kWh 130 kW 177', '61.1 kWh 115 kW 156'] },
  ], packages: ['Comfort', 'Luxury'] },

  'Marvel R': { from: 2023, to: 2025, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['70 kWh RWD 132 kW 180', '70 kWh AWD 212 kW 288'] },
  ], packages: ['Luxury', 'Performance'] },

  Cyberster: { from: 2024, to: 2026, bodyType: 'Cabrio', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Trophy RWD 250 kW 340', 'GT AWD 375 kW 510'] },
  ], packages: ['Trophy', 'GT'] },

  MG7: { from: 2025, to: 2026, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 T-GDI DCT 188', '2.0 T-GDI AT9 261'] },
  ], packages: ['Luxury', 'Trophy'] },
};
