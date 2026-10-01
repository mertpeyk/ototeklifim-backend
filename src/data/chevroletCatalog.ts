export type ChevroletDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type ChevroletModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Coupe' | 'MPV' | 'SUV' | 'Pick-Up';
  drives: ChevroletDrive[];
  packages: string[];
};

// Chevrolet catalog used by the Turkish valuation flow. The former official
// Turkey/Europe range is kept only in its real sales years; later global/import
// vehicles are separate nameplates with their own production years.
export const chevroletCatalog: Record<string, ChevroletModel> = {
  Spark: {
    from: 2010, to: 2015, bodyType: 'Hatchback', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0', '1.2'] },
    ], packages: ['Base', 'LS', 'LT', 'LTZ'],
  },
  Aveo: {
    from: 2010, to: 2015, bodyType: 'Hatchback', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2', '1.4'] },
      { from: 2011, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 D 75 PS', '1.3 D 95 PS'] },
    ], packages: ['LS', 'LT', 'LTZ', 'SE', 'SX'],
  },
  Cruze: {
    from: 2010, to: 2015, bodyType: 'Sedan', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 16V', '1.4 Turbo'] },
      { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 VCDi'] },
    ], packages: ['LS', 'LS Plus', 'LT', 'LT Plus', 'LTZ', 'Sport', 'Sport Plus', 'Design Edition', 'WTCC Edition'],
  },
  Orlando: {
    from: 2011, to: 2015, bodyType: 'MPV', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.8'] },
      { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 VCDi'] },
    ], packages: ['LS', 'LT', 'LTZ'],
  },
  Captiva: {
    from: 2010, to: 2015, bodyType: 'SUV', drives: [
      { to: 2011, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 VCDi'] },
      { from: 2011, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 VCDi 163 PS', '2.2 VCDi 184 PS AWD'] },
      { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.4 Ecotec'] },
    ], packages: ['LS', 'LT', 'LTZ', 'High'],
  },
  Trax: {
    from: 2013, to: 2026, bodyType: 'SUV', drives: [
      { to: 2015, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 Turbo'] },
      { to: 2015, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.7 VCDi'] },
      { from: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 Turbo 137 hp'] },
    ], packages: ['LS', 'LT', 'LTZ', '1RS', '2RS', 'ACTIV'],
  },
  Camaro: {
    from: 2010, to: 2024, bodyType: 'Coupe', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['3.6 V6', '6.2 V8'] },
      { from: 2016, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 Turbo'] },
    ], packages: ['LS', '1LT', '2LT', '1SS', '2SS', 'ZL1'],
  },
  Corvette: {
    from: 2010, to: 2026, bodyType: 'Coupe', drives: [
      { to: 2019, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['6.2 V8'] },
      { from: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['6.2 V8 Stingray', '5.5 V8 Z06', '5.5 V8 ZR1'] },
      { from: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['6.2 V8 E-Ray AWD'] },
    ], packages: ['Stingray', 'Grand Sport', 'Z06', 'ZR1', 'E-Ray', '1LT', '2LT', '3LT'],
  },
  'Bolt EV': {
    from: 2017, to: 2023, bodyType: 'Hatchback', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['150 kW Elektrik (200 hp)'] },
    ], packages: ['LT', 'Premier', '1LT', '2LT'],
  },
  'Bolt EUV': {
    from: 2022, to: 2023, bodyType: 'SUV', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['150 kW Elektrik (200 hp)'] },
    ], packages: ['LT', 'Premier'],
  },
  'Equinox EV': {
    from: 2024, to: 2026, bodyType: 'SUV', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['FWD 213 hp', 'eAWD 288 hp'] },
    ], packages: ['1LT', '2LT', '3LT', '2RS', '3RS'],
  },
  'Blazer EV': {
    from: 2024, to: 2026, bodyType: 'SUV', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['RWD Elektrik', 'eAWD Elektrik', 'SS AWD Elektrik'] },
    ], packages: ['LT', 'RS', 'SS'],
  },
  Equinox: {
    from: 2010, to: 2026, bodyType: 'SUV', drives: [
      { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 Turbo', '2.0 Turbo', '2.4 Ecotec'] },
      { from: 2018, to: 2019, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 Turbo Diesel'] },
    ], packages: ['L', 'LS', 'LT', 'Premier', 'RS', 'ACTIV'],
  },
  Trailblazer: {
    from: 2012, to: 2026, bodyType: 'SUV', drives: [
      { to: 2020, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.5 Duramax', '2.8 Duramax'] },
      { from: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 Turbo', '1.3 Turbo'] },
    ], packages: ['LS', 'LT', 'LTZ', 'Premier', 'ACTIV', 'RS'],
  },
  Traverse: {
    from: 2010, to: 2026, bodyType: 'SUV', drives: [
      { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.6 V6', '2.5 Turbo'] },
    ], packages: ['LS', 'LT', 'LTZ', 'Premier', 'High Country', 'RS', 'Z71'],
  },
  Tahoe: {
    from: 2010, to: 2026, bodyType: 'SUV', drives: [
      { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['5.3 V8', '6.2 V8'] },
      { from: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['3.0 Duramax'] },
    ], packages: ['LS', 'LT', 'RST', 'Z71', 'Premier', 'High Country'],
  },
  Suburban: {
    from: 2010, to: 2026, bodyType: 'SUV', drives: [
      { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['5.3 V8', '6.2 V8'] },
      { from: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['3.0 Duramax'] },
    ], packages: ['LS', 'LT', 'RST', 'Z71', 'Premier', 'High Country'],
  },
  Colorado: {
    from: 2012, to: 2026, bodyType: 'Pick-Up', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['2.5', '3.6 V6', '2.7 Turbo'] },
      { to: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.8 Duramax'] },
    ], packages: ['WT', 'LT', 'Z71', 'Z85', 'Z71 Trail Boss', 'ZR2'],
  },
};
