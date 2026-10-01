export type HyundaiDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'LPG' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type HyundaiModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'SUV' | 'Coupe' | 'MPV' | 'Pickup';
  drives: HyundaiDrive[];
  packages: string[];
};

// Hyundai Türkiye passenger/light-commercial range normalized by model year.
// Dedicated EV/HEV nameplates prevent electric and hybrid powertrains from
// leaking into combustion models with a similar marketing name.
export const hyundaiCatalog: Record<string, HyundaiModel> = {
  Getz: { from: 2010, to: 2011, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 DOHC 97'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 CRDi VGT 88', '1.5 CRDi VGT 110'] },
  ], packages: ['Start', 'Select', 'Style'] },
  Matrix: { from: 2010, to: 2010, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 DOHC 103'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 CRDi VGT 110'] },
  ], packages: ['Team', 'Style'] },
  'Accent Era': { from: 2010, to: 2012, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 DOHC 97', '1.6 CVVT 112'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 CRDi VGT 110'] },
    { fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.4 DOHC LPG 97'] },
  ], packages: ['Team', 'Select', 'Style', 'Mode'] },
  'Accent Blue': { from: 2011, to: 2020, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 CVVT 100', '1.6 GDI 135'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 CRDi 128', '1.6 CRDi DCT 136'] },
    { fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.4 CVVT LPG 100'] },
  ], packages: ['Mode', 'Prime', 'Style', 'Biz', 'Team'] },
  i10: { from: 2010, to: 2024, bodyType: 'Hatchback', drives: [
    { to: 2013, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.1 MPI 66', '1.2 MPI 78'] },
    { to: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.1 CRDi 75'] },
    { from: 2014, to: 2019, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 MPI 66', '1.2 MPI 87'] },
    { from: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 MPI 67'] },
    { from: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 MPI AMT 67', '1.2 MPI AMT 84'] },
  ], packages: ['Team', 'Mode', 'Jump', 'Style', 'Style Plus', 'Elite'] },
  i20: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2014, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 MPI 78', '1.4 MPI 100'] },
    { to: 2014, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 MPI AT4 100'] },
    { to: 2014, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 CRDi 90'] },
    { from: 2015, to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 MPI 84', '1.0 T-GDI 100', '1.0 T-GDI 120'] },
    { from: 2015, to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 MPI AT6 100', '1.0 T-GDI DCT 100', '1.0 T-GDI DCT 120'] },
    { from: 2015, to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 CRDi 90'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 MPI 84'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 MPI AT6 100', '1.0 T-GDI DCT 100', '1.0 T-GDI DCT 120'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.0 T-GDI 48V DCT 100', '1.0 T-GDI 48V DCT 120'] },
  ], packages: ['Team', 'Mode', 'Jump', 'Style', 'Style Plus', 'Elite', 'Elite Plus', 'Prime', 'N Line'] },
  'i20 Active': { from: 2016, to: 2020, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 T-GDI 100', '1.0 T-GDI 120'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 MPI AT6 100', '1.0 T-GDI DCT 120'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 CRDi 90'] },
  ], packages: ['Style', 'Elite'] },
  'i20 N': { from: 2022, to: 2024, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 T-GDI 204'] },
  ], packages: ['N'] },
  i30: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 CVVT 109', '1.6 CVVT 126'] },
    { to: 2012, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 CRDi 90', '1.6 CRDi 115'] },
    { from: 2013, to: 2017, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 GDI 135'] },
    { from: 2013, to: 2017, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 CRDi 128', '1.6 CRDi DCT 136'] },
    { from: 2018, to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 T-GDI 120'] },
    { from: 2018, to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 T-GDI DCT 140'] },
    { from: 2018, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 CRDi DCT 136'] },
    { from: 2024, to: 2025, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 T-GDI DCT 160'] },
    { from: 2026, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 T-GDI DCT 150'] },
  ], packages: ['Mode', 'Style', 'Elite', 'Elite Plus', 'N Line', 'Comfort', 'Prime'] },
  Elantra: { from: 2011, to: 2023, bodyType: 'Sedan', drives: [
    { to: 2015, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 MPI 132', '1.6 GDI 132'] },
    { from: 2016, to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 MPI 127'] },
    { from: 2016, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 CRDi DCT 136'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 MPI CVT 123'] },
  ], packages: ['Mode', 'Style', 'Elite', 'Elite Plus', 'Smart'] },
  Sonata: { from: 2010, to: 2011, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 CVVT AT 165', '2.4 CVVT AT 174'] },
  ], packages: ['Style', 'Elite'] },
  i40: { from: 2012, to: 2019, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 GDI 135', '2.0 GDI AT 177'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.7 CRDi 136', '1.7 CRDi DCT 141'] },
  ], packages: ['Style', 'Elite', 'Elite Plus'] },
  ix20: { from: 2011, to: 2019, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 MPI 90', '1.6 MPI 125'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 CRDi 90', '1.6 CRDi 115'] },
  ], packages: ['Prime', 'Style', 'Elite'] },
  Veloster: { from: 2012, to: 2015, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 GDI 140', '1.6 T-GDI DCT 186'] },
  ], packages: ['Style', 'Elite', 'Turbo'] },
  'Genesis Coupe': { from: 2010, to: 2015, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 T-GDI 210', '2.0 T-GDI 275', '3.8 V6 303'] },
  ], packages: ['Turbo', 'Grand Touring'] },
  ix35: { from: 2010, to: 2015, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 GDI 135', '2.0 MPI 163'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.7 CRDi 115', '2.0 CRDi 184 4x4'] },
  ], packages: ['Style', 'Elite', 'Elite Plus'] },
  Tucson: { from: 2015, to: 2026, bodyType: 'SUV', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 GDI 132'] },
    { to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 T-GDI DCT 177'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 CRDi 136', '2.0 CRDi 185 4x4'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 CRDi DCT 136', '2.0 CRDi AT 185 4x4'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 T-GDI DCT 160', '1.6 T-GDI DCT 180'] },
    { from: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 CRDi DCT 136', '1.6 CRDi DCT 136 4x4'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 T-GDI HEV AT 215', '1.6 T-GDI HEV AT 230'] },
  ], packages: ['Style', 'Elite', 'Elite Plus', 'Comfort', 'Prime', 'N Line'] },
  'Santa Fe': { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 CRDi 197 4x4'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 CRDi AT 197 4x4', '2.2 CRDi AT 200 4x4'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 T-GDI HEV AT 215 4x4', '1.6 T-GDI HEV AT 230 4x4'] },
  ], packages: ['Style', 'Elite', 'Elite Plus', 'Progressive', 'Prestige', 'Prime Plus'] },
  Kona: { from: 2018, to: 2026, bodyType: 'SUV', drives: [
    { to: 2023, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 T-GDI 120'] },
    { to: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 T-GDI DCT 120', '1.6 T-GDI DCT 177'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 CRDi DCT 136'] },
    { from: 2020, to: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 GDI HEV DCT 141'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 T-GDI DCT 170', '1.6 T-GDI DCT 198'] },
  ], packages: ['Style', 'Elite', 'Elite Smart', 'Prime', 'N Line'] },
  'Kona EV': { from: 2019, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['100 kW 39.2 kWh', '150 kW 64 kWh', '115 kW 48.4 kWh', '160 kW 65.4 kWh'] },
  ], packages: ['Progressive', 'Elite', 'Advance'] },
  Bayon: { from: 2021, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 T-GDI 100', '1.2 MPI 84'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 MPI AT6 100', '1.0 T-GDI DCT 100', '1.0 T-GDI DCT 120'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.0 T-GDI 48V DCT 100'] },
  ], packages: ['Jump', 'Style', 'Elite', 'Prime', 'N Line'] },
  'IONIQ Hybrid': { from: 2017, to: 2022, bodyType: 'Hatchback', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 GDI HEV DCT 141'] },
  ], packages: ['Style', 'Elite', 'Elite Plus'] },
  'IONIQ Electric': { from: 2017, to: 2022, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['88 kW 28 kWh', '100 kW 38.3 kWh'] },
  ], packages: ['Style', 'Elite', 'Elite Plus'] },
  'IONIQ 5': { from: 2021, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['125 kW RWD 58 kWh', '168 kW RWD 77.4 kWh', '168 kW RWD 84 kWh', '239 kW AWD 77.4 kWh'] },
  ], packages: ['Progressive', 'Advance', 'Dynamic Vision Roof'] },
  'IONIQ 5 N': { from: 2024, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['448 kW AWD 84 kWh'] },
  ], packages: ['N'] },
  'IONIQ 6': { from: 2023, to: 2026, bodyType: 'Sedan', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['111 kW RWD 53 kWh', '168 kW RWD 77.4 kWh', '239 kW AWD 77.4 kWh'] },
  ], packages: ['Progressive', 'Advance'] },
  'IONIQ 9': { from: 2025, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['160 kW RWD 110.3 kWh', '226 kW AWD 110.3 kWh', '315 kW Performance AWD 110.3 kWh'] },
  ], packages: ['Progressive', 'Calligraphy'] },
  INSTER: { from: 2025, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['71.1 kW 42 kWh', '84.5 kW 49 kWh'] },
  ], packages: ['Dynamic', 'Advance', 'Cross Advance'] },
  'H-1': { from: 2010, to: 2021, bodyType: 'MPV', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.5 CRDi 136'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.5 CRDi AT 170'] },
  ], packages: ['Team', 'Style', 'Elite'] },
  STARIA: { from: 2022, to: 2024, bodyType: 'MPV', drives: [
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 CRDi AT 177 4x2', '2.2 CRDi AT 177 4x4'] },
  ], packages: ['Elite', 'Elite Plus'] },
  'STARIA HEV': { from: 2025, to: 2026, bodyType: 'MPV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 T-GDI HEV AT 225 4x2'] },
  ], packages: ['Elite'] },
  H100: { from: 2010, to: 2026, bodyType: 'Pickup', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.5 CRDi 130'] },
  ], packages: ['Standart', 'Deluxe', 'Kasali', 'Panelvan'] },
};
