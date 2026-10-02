export type ToggDrive = {
  from?: number;
  to?: number;
  fuel: 'Elektrik';
  transmissions: Array<'Otomatik'>;
  engines: string[];
};

export type ToggModel = {
  from: number;
  to: number;
  bodyType: 'Sedan' | 'SUV';
  drives: ToggDrive[];
  packages: string[];
};

// Türkiye-facing Togg catalogue. T10X deliveries started in 2023 and T10F
// deliveries started in 2025; no synthetic pre-launch rows are generated.
export const toggCatalog: Record<string, ToggModel> = {
  T10X: {
    from: 2023,
    to: 2026,
    bodyType: 'SUV',
    drives: [
      { from: 2023, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: [
        '52.4 kWh RWD 160 kW (218 PS)',
        '88.5 kWh RWD 160 kW (218 PS)',
      ] },
      { from: 2025, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: [
        '88.5 kWh AWD 320 kW (435 PS) 4More',
      ] },
    ],
    packages: ['V1 RWD Standart Menzil', 'V1 RWD Uzun Menzil', 'V2 RWD Uzun Menzil', 'V2 4More Obsidiyen'],
  },
  T10F: {
    from: 2025,
    to: 2026,
    bodyType: 'Sedan',
    drives: [{ fuel: 'Elektrik', transmissions: ['Otomatik'], engines: [
      '52.4 kWh RWD 160 kW (218 PS)',
      '88.5 kWh RWD 160 kW (218 PS)',
      '88.5 kWh AWD 320 kW (435 PS) 4More',
    ] }],
    packages: ['V1 RWD Standart Menzil', 'V1 RWD Uzun Menzil', 'V2 RWD Uzun Menzil', 'V2 4More'],
  },
};
