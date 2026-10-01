export type CitroenDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type CitroenModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'MPV' | 'SUV' | 'Commercial Vehicle';
  drives: CitroenDrive[];
  packages: string[];
};

// Citroën Türkiye catalog normalized for the valuation flow. Legacy and
// current generations are limited to their real model years; electric
// nameplates remain separate so combustion fuels/gears cannot leak into them.
export const citroenCatalog: Record<string, CitroenModel> = {
  C1: {
    from: 2010, to: 2022, bodyType: 'Hatchback', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 VTi', '1.2 PureTech'] },
      { to: 2014, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 HDi'] },
    ], packages: ['Attraction', 'Confort', 'Feel', 'Shine', 'Airscape'],
  },
  C2: {
    from: 2010, to: 2010, bodyType: 'Hatchback', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4', '1.6 VTR'] },
      { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 HDi'] },
    ], packages: ['SX', 'X Pack', 'VTR'],
  },
  C3: {
    from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
      { to: 2016, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 VTi', '1.6 VTi'] },
      { to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 HDi', '1.6 e-HDi', '1.6 BlueHDi'] },
      { from: 2017, to: 2024, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 PureTech 82', '1.2 PureTech 110'] },
      { from: 2025, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 Turbo 100'] },
      { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid 110 eDCS6'] },
    ], packages: ['Attraction', 'Confort', 'Exclusive', 'Live', 'Feel', 'Feel Bold', 'Shine', 'Shine Bold', 'Plus', 'Max', 'You'],
  },
  'e-C3': {
    from: 2024, to: 2026, bodyType: 'Hatchback', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['83 kW Elektrik 44 kWh'] },
    ], packages: ['You', 'Plus', 'Max'],
  },
  'C3 Picasso': {
    from: 2010, to: 2017, bodyType: 'MPV', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 VTi', '1.6 VTi'] },
      { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 HDi', '1.6 e-HDi', '1.6 BlueHDi'] },
    ], packages: ['SX', 'Confort', 'Exclusive', 'Attraction'],
  },
  'C3 Aircross': {
    from: 2017, to: 2026, bodyType: 'SUV', drives: [
      { to: 2024, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 PureTech 110', '1.2 PureTech 130'] },
      { to: 2024, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 BlueHDi 100', '1.5 BlueHDi 120'] },
      { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid 145 eDCS6'] },
    ], packages: ['Live', 'Feel', 'Feel Bold', 'Shine', 'Shine Bold', 'Plus', 'Max', 'Collection'],
  },
  'e-C3 Aircross': {
    from: 2025, to: 2026, bodyType: 'SUV', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['83 kW Standart Menzil', '82 kW Uzun Menzil'] },
    ], packages: ['Plus', 'Max', 'Collection'],
  },
  C4: {
    from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
      { to: 2018, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 VTi', '1.6 VTi', '1.6 THP'] },
      { to: 2018, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 HDi', '1.6 e-HDi', '1.6 BlueHDi'] },
      { from: 2021, to: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 PureTech 130 EAT8'] },
      { from: 2021, to: 2024, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 BlueHDi 130 EAT8'] },
      { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid 145 eDCS6'] },
    ], packages: ['Attraction', 'Confort', 'Exclusive', 'Feel', 'Feel Bold', 'Shine', 'Shine Bold', 'You', 'Max'],
  },
  'e-C4': {
    from: 2021, to: 2026, bodyType: 'Hatchback', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['100 kW Elektrik', '115 kW Elektrik'] },
    ], packages: ['Feel', 'Feel Bold', 'Shine', 'Shine Bold', 'You', 'Max'],
  },
  'C4 Cactus': {
    from: 2014, to: 2020, bodyType: 'Hatchback', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 PureTech 82', '1.2 PureTech 110'] },
      { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 e-HDi 92', '1.6 BlueHDi 100'] },
    ], packages: ['Live', 'Feel', 'Shine', 'Rip Curl'],
  },
  'C4 Picasso': {
    from: 2010, to: 2018, bodyType: 'MPV', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 VTi', '1.6 THP'] },
      { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 HDi', '1.6 e-HDi', '1.6 BlueHDi'] },
    ], packages: ['Dynamic', 'Intensive', 'Exclusive', 'Feel', 'Shine'],
  },
  'Grand C4 Picasso': {
    from: 2010, to: 2018, bodyType: 'MPV', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 VTi', '1.6 THP'] },
      { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 HDi', '1.6 e-HDi', '1.6 BlueHDi', '2.0 BlueHDi'] },
    ], packages: ['Dynamic', 'Intensive', 'Exclusive', 'Feel', 'Shine'],
  },
  'C4 SpaceTourer': {
    from: 2018, to: 2022, bodyType: 'MPV', drives: [
      { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 PureTech 130 EAT8'] },
      { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 BlueHDi 130 EAT8'] },
    ], packages: ['Feel', 'Shine'],
  },
  'C4 X': {
    from: 2023, to: 2026, bodyType: 'Sedan', drives: [
      { to: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 PureTech 130 EAT8'] },
      { to: 2024, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 BlueHDi 130 EAT8'] },
      { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid 145 eDCS6'] },
    ], packages: ['Feel', 'Feel Bold', 'Shine', 'Shine Bold', 'You', 'Max'],
  },
  'e-C4 X': {
    from: 2023, to: 2026, bodyType: 'Sedan', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['100 kW Elektrik', '115 kW Elektrik'] },
    ], packages: ['Feel', 'Feel Bold', 'Shine', 'Shine Bold', 'You', 'Max'],
  },
  C5: {
    from: 2010, to: 2017, bodyType: 'Sedan', drives: [
      { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 THP'] },
      { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 HDi', '2.0 HDi', '2.2 HDi'] },
    ], packages: ['Confort', 'Dynamique', 'Exclusive', 'Executive'],
  },
  'C5 Aircross': {
    from: 2019, to: 2026, bodyType: 'SUV', drives: [
      { to: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 PureTech 180 EAT8', '1.2 PureTech 130 EAT8'] },
      { to: 2024, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 BlueHDi 130 EAT8'] },
      { from: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 Plug-in Hybrid 225 e-EAT8', '1.2 Hybrid 145 eDCS6'] },
    ], packages: ['Live', 'Feel', 'Feel Adventure', 'Shine', 'Shine Bold', 'Shine Pack', 'E-Series', 'Plus', 'Max'],
  },
  'e-C5 Aircross': {
    from: 2026, to: 2026, bodyType: 'SUV', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['157 kW Elektrik'] },
    ], packages: ['Plus', 'Max'],
  },
  'C5 X': {
    from: 2022, to: 2025, bodyType: 'Hatchback', drives: [
      { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 PureTech 180 EAT8'] },
      { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 Plug-in Hybrid 225 e-EAT8'] },
    ], packages: ['Feel Bold', 'Shine', 'Shine Bold'],
  },
  C6: {
    from: 2010, to: 2012, bodyType: 'Sedan', drives: [
      { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 HDi', '2.7 HDi V6', '3.0 HDi V6'] },
    ], packages: ['Confort', 'Exclusive'],
  },
  C8: {
    from: 2010, to: 2014, bodyType: 'MPV', drives: [
      { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 HDi', '2.2 HDi'] },
    ], packages: ['SX', 'Exclusive'],
  },
  'C-Elysée': {
    from: 2012, to: 2024, bodyType: 'Sedan', drives: [
      { to: 2018, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 VTi', '1.6 VTi'] },
      { to: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 HDi', '1.6 BlueHDi'] },
      { from: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 BlueHDi 100'] },
    ], packages: ['Attraction', 'Confort', 'Exclusive', 'Feel', 'Feel Bold', 'Shine', 'Live'],
  },
  Berlingo: {
    from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
      { to: 2018, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 VTi'] },
      { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 HDi', '1.6 BlueHDi', '1.5 BlueHDi 100', '1.5 BlueHDi 130 EAT8'] },
    ], packages: ['Multispace', 'Combi', 'XTR', 'Feel', 'Feel Bold', 'Shine', 'Shine Bold', 'Plus', 'Max'],
  },
  'e-Berlingo': {
    from: 2022, to: 2026, bodyType: 'Commercial Vehicle', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['100 kW Elektrik'] },
    ], packages: ['Feel', 'Shine', 'Plus', 'Max'],
  },
  Nemo: {
    from: 2010, to: 2018, bodyType: 'Commercial Vehicle', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4'] },
      { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 HDi', '1.3 HDi'] },
    ], packages: ['Combi', 'SX', 'SX Plus', 'XTR Plus'],
  },
  Jumpy: {
    from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
      { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 HDi', '2.0 HDi', '1.5 BlueHDi', '2.0 BlueHDi'] },
    ], packages: ['Van', 'Combi', 'Business', 'Comfort', 'Plus'],
  },
  'e-Jumpy': {
    from: 2021, to: 2026, bodyType: 'Commercial Vehicle', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['100 kW Elektrik 50 kWh', '100 kW Elektrik 75 kWh'] },
    ], packages: ['Van', 'Combi', 'Business'],
  },
  Jumper: {
    from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
      { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.2 HDi', '2.0 BlueHDi', '2.2 BlueHDi'] },
    ], packages: ['Van', 'Chassis', 'L2H2', 'L3H2', 'L4H2'],
  },
  'e-Jumper': {
    from: 2024, to: 2026, bodyType: 'Commercial Vehicle', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['200 kW Elektrik 110 kWh'] },
    ], packages: ['Van', 'Chassis'],
  },
  SpaceTourer: {
    from: 2016, to: 2026, bodyType: 'MPV', drives: [
      { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 BlueHDi', '2.0 BlueHDi 180 EAT8'] },
    ], packages: ['Feel', 'Business', 'Shine'],
  },
  'e-SpaceTourer': {
    from: 2021, to: 2026, bodyType: 'MPV', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['100 kW Elektrik 50 kWh', '100 kW Elektrik 75 kWh'] },
    ], packages: ['Business', 'Feel', 'Shine'],
  },
  Ami: {
    from: 2022, to: 2026, bodyType: 'Hatchback', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['6 kW Elektrik 5.5 kWh'] },
    ], packages: ['Ami', 'Ami Buggy', 'Ami Dark Side'],
  },
};
