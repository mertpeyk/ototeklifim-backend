export type CupraDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type CupraModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Station Wagon' | 'SUV' | 'SUV Coupe';
  drives: CupraDrive[];
  packages: string[];
};

// CUPRA became an independent marque in 2018. The Türkiye catalog therefore
// starts with Ateca and adds each later nameplate only in its real model years.
export const cupraCatalog: Record<string, CupraModel> = {
  Ateca: {
    from: 2018, to: 2025, bodyType: 'SUV', drives: [
      { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 TSI 150 PS DSG', '2.0 TSI 300 PS DSG 4Drive'] },
    ], packages: ['CUPRA', 'VZ', 'VZ-Line', 'Limited Edition'],
  },
  Leon: {
    from: 2021, to: 2026, bodyType: 'Hatchback', drives: [
      { to: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 TSI 150 PS DSG', '2.0 TSI 300 PS DSG'] },
      { to: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 e-HYBRID 204 PS DSG', '1.4 e-HYBRID 245 PS DSG'] },
      { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 eTSI 150 PS DSG mHEV', '1.5 e-HYBRID 204 PS DSG', '1.5 e-HYBRID 272 PS DSG'] },
      { from: 2025, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 TSI 300 PS DSG'] },
    ], packages: ['CUPRA', 'Impulse', 'VZ', 'VZ-Line'],
  },
  'Leon Sportstourer': {
    from: 2021, to: 2026, bodyType: 'Station Wagon', drives: [
      { to: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 TSI 310 PS DSG 4Drive'] },
      { to: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 e-HYBRID 204 PS DSG', '1.4 e-HYBRID 245 PS DSG'] },
      { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 eTSI 150 PS DSG mHEV', '1.5 e-HYBRID 204 PS DSG', '1.5 e-HYBRID 272 PS DSG'] },
      { from: 2025, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 TSI 333 PS DSG 4Drive'] },
    ], packages: ['CUPRA', 'VZ', 'VZ-Line'],
  },
  Formentor: {
    from: 2021, to: 2026, bodyType: 'SUV Coupe', drives: [
      { to: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 TSI 150 PS DSG', '2.0 TSI 310 PS DSG 4Drive'] },
      { to: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 e-HYBRID 204 PS DSG', '1.4 e-HYBRID 245 PS DSG'] },
      { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 eTSI 150 PS DSG mHEV', '1.5 e-HYBRID 204 PS DSG', '1.5 e-HYBRID 272 PS DSG'] },
      { from: 2025, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 TSI 333 PS DSG 4Drive'] },
    ], packages: ['CUPRA', 'Impulse', 'Supreme', 'VZ', 'VZ-Line'],
  },
  Born: {
    from: 2022, to: 2026, bodyType: 'Hatchback', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['150 kW 58 kWh', '170 kW e-Boost 58 kWh', '170 kW e-Boost 77 kWh', '240 kW VZ 79 kWh'] },
    ], packages: ['CUPRA Born', 'e-Boost', 'VZ'],
  },
  Tavascan: {
    from: 2025, to: 2026, bodyType: 'SUV Coupe', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['210 kW Endurance 77 kWh', '250 kW VZ 4Drive 77 kWh'] },
    ], packages: ['Endurance', 'VZ'],
  },
  Terramar: {
    from: 2025, to: 2026, bodyType: 'SUV', drives: [
      { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 eTSI 150 PS DSG mHEV', '1.5 e-HYBRID 204 PS DSG', '1.5 e-HYBRID 272 PS DSG'] },
      { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 TSI 265 PS DSG 4Drive'] },
    ], packages: ['Impulse', 'Supreme', 'VZ', 'VZ-Line'],
  },
};
