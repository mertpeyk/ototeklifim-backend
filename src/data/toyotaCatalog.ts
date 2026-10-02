export type ToyotaDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type ToyotaModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Station Wagon' | 'SUV' | 'MPV' | 'Pickup' | 'Panelvan';
  drives: ToyotaDrive[];
  packages: string[];
};

// Türkiye-facing Toyota catalogue. Historic combustion engines, successive
// hybrid generations and dedicated EV nameplates are explicitly year-bounded
// so they cannot leak into one another through generic brand data.
export const toyotaCatalog: Record<string, ToyotaModel> = {
  Aygo: { from: 2010, to: 2021, bodyType: 'Hatchback', drives: [
    { to: 2014, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 VVT-i 68'] },
    { to: 2014, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 VVT-i MultiMode 68'] },
    { from: 2015, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 VVT-i 69', '1.0 VVT-i 72'] },
    { from: 2015, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 VVT-i x-shift 69', '1.0 VVT-i x-shift 72'] },
  ], packages: ['Cool', 'Comfort', 'X-Play', 'X-Cite', 'X-Clusiv'] },
  'Urban Cruiser': { from: 2010, to: 2014, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.33 Dual VVT-i 100'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 D-4D 90', '1.4 D-4D AWD 90'] },
  ], packages: ['Comfort', 'Elegant'] },
  'Verso-S': { from: 2011, to: 2015, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.33 Dual VVT-i 99'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.33 Dual VVT-i Multidrive S 99'] },
  ], packages: ['Comfort', 'Elegant'] },
  Verso: { from: 2010, to: 2018, bodyType: 'MPV', drives: [
    { to: 2015, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 Valvematic 132', '1.8 Valvematic 147'] },
    { to: 2015, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.8 Valvematic Multidrive S 147'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 D-4D 112', '2.0 D-4D 126'] },
  ], packages: ['Comfort', 'Elegant', 'Premium'] },
  Yaris: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2011, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 VVT-i 69', '1.33 Dual VVT-i 100'] },
    { to: 2011, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.33 Dual VVT-i MultiMode 100'] },
    { from: 2012, to: 2016, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 VVT-i 69', '1.33 Dual VVT-i 99'] },
    { from: 2012, to: 2016, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.33 Dual VVT-i Multidrive S 99'] },
    { from: 2012, to: 2020, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 Hybrid e-CVT 100'] },
    { from: 2017, to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 VVT-i 69', '1.5 Dual VVT-iE 111'] },
    { from: 2017, to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 Dual VVT-iE Multidrive S 111'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 Hybrid e-CVT 116', '1.5 Hybrid e-CVT 130'] },
  ], packages: ['Terra', 'Luna', 'Sol', 'Fun', 'Cool', 'Style', 'Active', 'Touch', 'Spirit', 'Dream', 'Flame', 'Passion', 'Passion X-Pack'] },
  'GR Yaris': { from: 2021, to: 2024, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 Turbo GR 261 AWD'] },
  ], packages: ['GR', 'Circuit Pack'] },
  Auris: { from: 2010, to: 2018, bodyType: 'Hatchback', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.33 Dual VVT-i 101', '1.6 Valvematic 132'] },
    { to: 2012, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 Valvematic Multidrive S 132'] },
    { from: 2013, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.33 Dual VVT-i 99', '1.6 Valvematic 132'] },
    { from: 2013, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 Valvematic Multidrive S 132'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 D-4D 90', '1.6 D-4D 112'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Hybrid e-CVT 136'] },
  ], packages: ['Comfort', 'Elegant', 'Active', 'Advance', 'Premium', 'Touring Sports'] },
  'Corolla Hatchback': { from: 2019, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2022, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 Turbo Multidrive S 116'] },
    { to: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Hybrid e-CVT 122', '2.0 Hybrid e-CVT 180'] },
    { from: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Hybrid e-CVT 140', '2.0 Hybrid e-CVT 196'] },
  ], packages: ['Dream', 'Flame', 'Passion', 'Passion X-Pack', 'GR Sport'] },
  Corolla: { from: 2010, to: 2026, bodyType: 'Sedan', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.33 Dual VVT-i 101', '1.6 Valvematic 132'] },
    { to: 2012, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 Valvematic Multidrive S 132'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 D-4D 90'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.4 D-4D MultiMode 90'] },
    { from: 2013, to: 2018, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.33 Dual VVT-i 99', '1.6 Valvematic 132'] },
    { from: 2013, to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 Valvematic Multidrive S 132'] },
    { from: 2019, to: 2022, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 Valvematic 132'] },
    { from: 2019, to: 2022, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 Valvematic Multidrive S 132'] },
    { from: 2019, to: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Hybrid e-CVT 122'] },
    { from: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 Dynamic Force Multidrive S 125'] },
    { from: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Hybrid e-CVT 140'] },
  ], packages: ['Terra', 'Comfort', 'Elegant', 'Active', 'Touch', 'Advance', 'Premium', 'Life', 'Vision', 'Vision Plus', 'Dream', 'Dream X-Pack', 'Flame X-Pack', 'Passion X-Pack', 'Hybrid Dream', 'Hybrid Dream X-Pack', 'Hybrid Flame X-Pack', 'Hybrid Passion X-Pack'] },
  Avensis: { from: 2010, to: 2018, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 Valvematic 132', '1.8 Valvematic 147'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.8 Valvematic Multidrive S 147'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 D-4D 112', '2.0 D-4D 124', '2.0 D-4D 126'] },
  ], packages: ['Comfort', 'Elegant', 'Premium', 'Advance'] },
  Camry: { from: 2019, to: 2024, bodyType: 'Sedan', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.5 Hybrid e-CVT 218'] },
  ], packages: ['Passion', 'Passion X-Pack'] },
  Prius: { from: 2010, to: 2022, bodyType: 'Hatchback', drives: [
    { to: 2015, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Hybrid e-CVT 136'] },
    { from: 2016, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Hybrid e-CVT 122', '1.8 Plug-in Hybrid e-CVT 122'] },
  ], packages: ['Comfort', 'Elegant', 'Premium', 'Advance'] },
  'Prius+': { from: 2012, to: 2020, bodyType: 'MPV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Hybrid e-CVT 136'] },
  ], packages: ['Comfort', 'Elegant', 'Premium'] },
  GT86: { from: 2012, to: 2021, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.0 Boxer 200'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Boxer AT6 200'] },
  ], packages: ['GT86', 'Sport'] },
  GR86: { from: 2022, to: 2024, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.4 Boxer 234'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.4 Boxer AT6 234'] },
  ], packages: ['GR86', 'Premium'] },
  'GR Supra': { from: 2019, to: 2024, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Turbo AT8 258', '3.0 Turbo AT8 340'] },
  ], packages: ['Dynamic', 'Premium', 'A90 Edition'] },
  'Yaris Cross': { from: 2021, to: 2026, bodyType: 'SUV', drives: [
    { to: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 Hybrid e-CVT 116'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 Hybrid e-CVT 116', '1.5 Hybrid e-CVT 130'] },
  ], packages: ['Dream', 'Flame', 'Flame X-Pack', 'Passion', 'Passion X-Pack', 'GR Sport'] },
  'C-HR': { from: 2017, to: 2026, bodyType: 'SUV', drives: [
    { to: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 Turbo Multidrive S 116'] },
    { to: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Hybrid e-CVT 122'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Hybrid e-CVT 140', '2.0 Hybrid e-CVT 197', '2.0 Plug-in Hybrid e-CVT 223'] },
  ], packages: ['Flame', 'Flame X-Pack', 'Passion', 'Passion X-Pack', 'Passion X-Sport', 'GR Sport'] },
  'Corolla Cross': { from: 2022, to: 2026, bodyType: 'SUV', drives: [
    { to: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Hybrid e-CVT 122'] },
    { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Hybrid e-CVT 140'] },
  ], packages: ['Hybrid Flame', 'Hybrid Flame X-Pack', 'Hybrid Passion', 'Hybrid Passion X-Pack'] },
  RAV4: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.0 Valvematic 158', '2.0 Valvematic AWD 158'] },
    { to: 2012, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Valvematic Multidrive S AWD 158'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 D-4D 124', '2.2 D-CAT AWD 150'] },
    { from: 2013, to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Valvematic Multidrive S AWD 151'] },
    { from: 2016, to: 2018, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.5 Hybrid e-CVT AWD-i 197'] },
    { from: 2019, to: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.5 Hybrid e-CVT 218', '2.5 Hybrid AWD-i e-CVT 222', '2.5 Plug-in Hybrid AWD-i 306'] },
    { from: 2026, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.5 Hybrid e-CVT', '2.5 Plug-in Hybrid AWD-i'] },
  ], packages: ['Elegant', 'Premium', 'Advance', 'Dream', 'Flame', 'Passion', 'Passion X-Pack', 'Adventure', 'GR Sport'] },
  'Land Cruiser': { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['3.0 D-4D 4x4 173'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['3.0 D-4D AT5 4x4 173'] },
    { from: 2016, to: 2023, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.8 D-4D AT6 4x4 177', '2.8 D-4D AT6 4x4 204'] },
    { from: 2024, to: 2025, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.8 D-4D AT8 4x4 204'] },
    { from: 2026, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.8 D-4D 48V Mild Hybrid AT8 4x4 204'] },
  ], packages: ['Prado', 'Premium', 'Executive', 'First Edition', 'Invincible'] },
  Hilux: { from: 2010, to: 2026, bodyType: 'Pickup', drives: [
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.5 D-4D 4x2 120', '2.5 D-4D 4x4 144', '3.0 D-4D 4x4 171'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['3.0 D-4D AT5 4x4 171'] },
    { from: 2016, to: 2025, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.4 D-4D 4x2 150', '2.4 D-4D 4x4 150'] },
    { from: 2016, to: 2025, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.4 D-4D AT6 4x2 150', '2.4 D-4D AT6 4x4 150', '2.8 D-4D AT6 4x4 204'] },
    { from: 2026, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.8 D-4D 48V Mild Hybrid AT6 4x4 204'] },
  ], packages: ['4x2', '4x4', 'Active', 'Adventure', 'Hi-Cruiser', 'Invincible', 'GR Sport'] },
  bZ4X: { from: 2022, to: 2025, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['71.4 kWh FWD 150 kW (204 PS)', '71.4 kWh AWD 160 kW (218 PS)'] },
  ], packages: ['Vision', 'Elegant', 'Executive', 'X-Mode'] },
  'Proace City': { from: 2020, to: 2026, bodyType: 'MPV', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 D-4D 100', '1.5 D-4D 130'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 D-4D AT8 130'] },
  ], packages: ['Dream', 'Passion', 'Passion X-Pack'] },
  'Proace City Cargo': { from: 2020, to: 2026, bodyType: 'Panelvan', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 D-4D 100', '1.5 D-4D 130'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 D-4D AT8 130'] },
  ], packages: ['Dream', 'Comfort', 'Flame'] },
  'Proace Verso': { from: 2017, to: 2026, bodyType: 'MPV', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 D-4D 120', '2.0 D-4D 145'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 D-4D AT8 145', '2.0 D-4D AT8 180'] },
  ], packages: ['Shuttle', 'Family', 'VIP'] },
  'Proace Cargo': { from: 2013, to: 2026, bodyType: 'Panelvan', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 D-4D 90', '1.6 D-4D 115', '1.5 D-4D 120', '2.0 D-4D 145'] },
    { from: 2017, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 D-4D AT8 145', '2.0 D-4D AT8 180'] },
  ], packages: ['Comfort', 'Professional'] },
  'Proace Max': { from: 2025, to: 2026, bodyType: 'Panelvan', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 D-4D 140'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 D-4D AT8 180'] },
  ], packages: ['Professional', 'Comfort'] },
};
