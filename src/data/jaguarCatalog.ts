export type JaguarDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type JaguarModel = {
  from: number;
  to: number;
  bodyType: 'Sedan' | 'Coupe' | 'Station Wagon' | 'SUV';
  drives: JaguarDrive[];
  packages: string[];
};

// Jaguar's Türkiye-facing 2010-2026 valuation catalog. Jaguar ended the
// production run of its legacy range during 2024; no speculative Type 00/new
// GT entries are exposed for 2025-2026 before a retail production model exists.
export const jaguarCatalog: Record<string, JaguarModel> = {
  XF: { from: 2010, to: 2024, bodyType: 'Sedan', drives: [
    { to: 2015, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2D 190', '2.2D 200', '2.7D V6 207', '3.0D V6 240', '3.0D V6 S 275'] },
    { to: 2015, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Turbo 240', '3.0 V6 Supercharged 340', '5.0 V8 385', '5.0 V8 Supercharged 510', '5.0 V8 Supercharged 550'] },
    { from: 2016, to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0D 163', '2.0D 180'] },
    { from: 2016, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0D AT8 163', '2.0D AT8 180', '2.0D AT8 240', '3.0D V6 AT8 300'] },
    { from: 2016, to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Turbo AT8 240', '2.0 Turbo AT8 250', '2.0 Turbo AT8 300', '3.0 V6 Supercharged AT8 380'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 P250 AT8 250', '2.0 P300 AWD AT8 300'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.0 D200 MHEV AT8 204'] },
  ], packages: ['Luxury', 'Premium Luxury', 'Portfolio', 'Pure', 'Prestige', 'R-Sport', 'S', 'Chequered Flag', 'R-Dynamic S', 'R-Dynamic SE', 'R-Dynamic HSE', '300 Sport'] },

  'XF Sportbrake': { from: 2013, to: 2020, bodyType: 'Station Wagon', drives: [
    { to: 2015, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2D 200', '3.0D V6 240', '3.0D V6 S 275'] },
    { to: 2015, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.0 V6 Supercharged 340', '5.0 V8 Supercharged 550'] },
    { from: 2018, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0D AT8 180', '2.0D AT8 240', '3.0D V6 AT8 300'] },
    { from: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Turbo AT8 250', '2.0 Turbo AT8 300'] },
  ], packages: ['Luxury', 'Premium Luxury', 'Portfolio', 'Prestige', 'R-Sport', 'S'] },

  XJ: { from: 2010, to: 2019, bodyType: 'Sedan', drives: [
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['3.0D V6 275', '3.0D V6 300'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Turbo 240', '3.0 V6 Supercharged 340', '5.0 V8 385', '5.0 V8 Supercharged 510', '5.0 V8 Supercharged 550', '5.0 V8 Supercharged 575'] },
  ], packages: ['Luxury', 'Premium Luxury', 'Portfolio', 'Supersport', 'XJR', 'XJR575', 'XJ50'] },

  XK: { from: 2010, to: 2014, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['5.0 V8 385', '5.0 V8 Supercharged 510', '5.0 V8 Supercharged 550'] },
  ], packages: ['XK', 'Portfolio', 'XKR', 'XKR-S'] },

  'F-TYPE': { from: 2013, to: 2024, bodyType: 'Coupe', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['3.0 V6 Supercharged 340', '3.0 V6 Supercharged 380'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Turbo 300', '3.0 V6 Supercharged 340', '3.0 V6 Supercharged 380', '5.0 V8 Supercharged 450', '5.0 V8 Supercharged 495', '5.0 V8 Supercharged 550', '5.0 V8 Supercharged 575'] },
  ], packages: ['F-TYPE', 'S', 'R-Dynamic', 'R', 'SVR', 'First Edition', '75', 'R 75'] },

  XE: { from: 2015, to: 2024, bodyType: 'Sedan', drives: [
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0D 163', '2.0D 180'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0D AT8 163', '2.0D AT8 180', '2.0D AT8 240'] },
    { to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Turbo AT8 200', '2.0 Turbo AT8 240', '2.0 Turbo AT8 250', '2.0 Turbo AT8 300', '3.0 V6 Supercharged AT8 340', '3.0 V6 Supercharged AT8 380'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 P250 AT8 250', '2.0 P300 AWD AT8 300'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.0 D200 MHEV AT8 204'] },
  ], packages: ['Pure', 'Prestige', 'Portfolio', 'R-Sport', 'S', 'R-Dynamic S', 'R-Dynamic SE', 'R-Dynamic HSE', '300 Sport'] },

  'F-PACE': { from: 2016, to: 2024, bodyType: 'SUV', drives: [
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0D 180'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0D AT8 180', '2.0D AT8 240', '3.0D V6 AT8 300'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 P250 AT8 250', '2.0 P300 AWD AT8 300', '3.0 V6 Supercharged AT8 380', '5.0 V8 Supercharged AT8 550'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.0 D200 MHEV AT8 204', '3.0 D300 MHEV AT8 300', '3.0 P400 MHEV AT8 400', '2.0 P400e PHEV AT8 404'] },
  ], packages: ['Pure', 'Prestige', 'Portfolio', 'R-Sport', 'S', 'R-Dynamic S', 'R-Dynamic SE', 'R-Dynamic HSE', 'SVR'] },

  'E-PACE': { from: 2018, to: 2024, bodyType: 'SUV', drives: [
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 D150', '2.0 D180'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 D150 AT9', '2.0 D180 AT9', '2.0 D240 AT9'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 P200 AT9', '2.0 P250 AT9', '2.0 P300 AT9'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.0 D165 MHEV AT9 163', '2.0 D200 MHEV AT9 204', '1.5 P160 MHEV DCT 160', '1.5 P300e PHEV DCT 309'] },
  ], packages: ['S', 'SE', 'HSE', 'R-Dynamic S', 'R-Dynamic SE', 'R-Dynamic HSE', 'Chequered Flag', '300 Sport'] },

  'I-PACE': { from: 2019, to: 2024, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['EV400 AWD 294 kW 90 kWh'] },
  ], packages: ['S', 'SE', 'HSE', 'Black', 'R-Dynamic HSE'] },
};
