export type SuzukiDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type SuzukiModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Station Wagon' | 'SUV';
  drives: SuzukiDrive[];
  packages: string[];
};

// Türkiye-facing Suzuki catalogue. Year-bounded drives prevent legacy engines
// and discontinued models from leaking into the current hybrid range.
export const suzukiCatalog: Record<string, SuzukiModel> = {
  Alto: { from: 2010, to: 2014, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 VVT 68'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 VVT AT4 68'] },
  ], packages: ['GA', 'GL', 'GLX'] },
  Splash: { from: 2010, to: 2014, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 VVT 65', '1.2 VVT 86', '1.2 VVT 94'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 VVT AT4 86', '1.2 VVT AT4 94'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 DDiS 75'] },
  ], packages: ['GL', 'GLX'] },
  Swift: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2016, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 VVT 94', '1.6 Sport 136'] },
    { to: 2016, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 VVT AT4 94'] },
    { from: 2017, to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 Dualjet 90', '1.0 Boosterjet 111', '1.4 Boosterjet Sport 140'] },
    { from: 2017, to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 Dualjet CVT 90', '1.0 Boosterjet AT6 111'] },
    { from: 2017, to: 2020, fuel: 'Hibrit', transmissions: ['Manuel'], engines: ['1.2 Dualjet SHVS 90'] },
    { from: 2021, to: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Dualjet 12V SHVS CVT 83'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Z12E 12V SHVS CVT 83'] },
  ], packages: ['GL', 'GLX', 'GL Techno', 'GLX Premium', 'Sport', 'Life', 'Pulse'] },
  Kizashi: { from: 2010, to: 2014, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.4 VVT 178'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.4 VVT CVT 178', '2.4 VVT CVT 4x4 178'] },
  ], packages: ['Sport', 'Sport SLS'] },
  SX4: { from: 2010, to: 2014, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 VVT 120', '1.6 VVT 4x4 120'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 VVT AT4 120', '1.6 VVT AT4 4x4 120'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 DDiS 90', '2.0 DDiS 135'] },
  ], packages: ['GL', 'GLX', 'GLX 4x4'] },
  'Grand Vitara': { from: 2010, to: 2014, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 VVT 106', '2.0 VVT 140'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 VVT AT4 140', '2.4 VVT AT4 169'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.9 DDiS 129'] },
  ], packages: ['JLX', 'JLX-AL', 'Premium'] },
  Jimny: { from: 2010, to: 2024, bodyType: 'SUV', drives: [
    { to: 2018, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.3 VVT 85'] },
    { to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.3 VVT AT4 85'] },
    { from: 2019, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.5 VVT 102'] },
    { from: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 VVT AT4 102'] },
  ], packages: ['JLX', 'GLX', 'GLX Adventure'] },
  'SX4 S-Cross': { from: 2013, to: 2021, bodyType: 'SUV', drives: [
    { to: 2016, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 VVT 120', '1.6 VVT AllGrip 120'] },
    { to: 2016, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 VVT CVT 120', '1.6 VVT CVT AllGrip 120'] },
    { to: 2016, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 DDiS 120', '1.6 DDiS AllGrip 120'] },
    { from: 2017, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 Boosterjet 112', '1.4 Boosterjet 140', '1.4 Boosterjet AllGrip 140'] },
    { from: 2017, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 Boosterjet AT6 112', '1.4 Boosterjet AT6 140', '1.4 Boosterjet AT6 AllGrip 140'] },
    { from: 2017, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 DDiS 120', '1.6 DDiS TCSS 120'] },
  ], packages: ['GL', 'GL+', 'GLX'] },
  Celerio: { from: 2015, to: 2018, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 Dualjet 68'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 Dualjet AGS 68'] },
  ], packages: ['GL', 'GLX'] },
  Vitara: { from: 2015, to: 2026, bodyType: 'SUV', drives: [
    { to: 2018, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 VVT 120', '1.6 VVT AllGrip 120'] },
    { to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 VVT AT6 120', '1.6 VVT AT6 AllGrip 120'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 DDiS 120', '1.6 DDiS TCSS 120'] },
    { from: 2019, to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 Boosterjet AT6 112', '1.4 Boosterjet AT6 140', '1.4 Boosterjet AT6 AllGrip 140'] },
    { from: 2021, to: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 Boosterjet 48V SHVS AT6 129', '1.4 Boosterjet 48V SHVS AT6 AllGrip 129', '1.5 Dualjet Strong Hybrid AGS 116'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 Boosterjet 48V SHVS AT6 109', '1.4 Boosterjet 48V SHVS AT6 AllGrip 109'] },
  ], packages: ['GL', 'GL+', 'GLX', 'GL Elegance', 'GLX Premium', 'GLX Black Edition'] },
  Baleno: { from: 2016, to: 2019, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 Dualjet 90', '1.0 Boosterjet 111'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 Dualjet CVT 90', '1.0 Boosterjet AT6 111'] },
  ], packages: ['GL', 'GLX'] },
  Ignis: { from: 2017, to: 2022, bodyType: 'Hatchback', drives: [
    { to: 2019, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 Dualjet 90', '1.2 Dualjet AGS 90'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 Dualjet SHVS 83', '1.2 Dualjet SHVS CVT 83'] },
  ], packages: ['GL', 'GLX', 'GLX AllGrip'] },
  'S-Cross': { from: 2022, to: 2026, bodyType: 'SUV', drives: [
    { to: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 Boosterjet 48V SHVS AT6 129', '1.4 Boosterjet 48V SHVS AT6 AllGrip 129'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 Boosterjet 48V SHVS AT6 109', '1.4 Boosterjet 48V SHVS AT6 AllGrip 109'] },
  ], packages: ['GL Elegance', 'GLX Premium', 'GLX Black Edition'] },
  Across: { from: 2020, to: 2024, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.5 Plug-in Hybrid E-Four 306'] },
  ], packages: ['GLX'] },
  Swace: { from: 2021, to: 2024, bodyType: 'Station Wagon', drives: [
    { to: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Hybrid e-CVT 122'] },
    { from: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Hybrid e-CVT 140'] },
  ], packages: ['SZ-T', 'SZ5'] },
};
