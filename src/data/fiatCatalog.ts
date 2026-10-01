export type FiatDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'LPG' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type FiatModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Station Wagon' | 'MPV' | 'SUV' | 'Pick-Up' | 'Commercial Vehicle';
  drives: FiatDrive[];
  packages: string[];
};

// Fiat Türkiye / common European-import range normalized for valuation.
// Dedicated EV nameplates prevent 500e/600e/Grande Panda Electric from
// inheriting combustion fuels, gears or trims from similarly named models.
export const fiatCatalog: Record<string, FiatModel> = {
  Albea: { from: 2010, to: 2012, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 Fire 77'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 70'] },
    { fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.4 Fire LPG 77'] },
  ], packages: ['Sole', 'Active', 'Dynamic', 'Premio'] },
  Palio: { from: 2010, to: 2012, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 8V 60', '1.4 Fire 77'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 70'] },
    { fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.4 Fire LPG 77'] },
  ], packages: ['Sole', 'Active', 'Dynamic', 'Premio'] },
  'Grande Punto': { from: 2010, to: 2012, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 Fire 77', '1.4 T-Jet 120'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 Fire Dualogic 77'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 75', '1.3 Multijet 90'] },
  ], packages: ['Active', 'Dynamic', 'Emotion', 'Sport'] },
  Punto: { from: 2010, to: 2018, bodyType: 'Hatchback', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 Fire 77', '1.4 MultiAir 105'] },
    { to: 2012, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 Fire Dualogic 77'] },
    { to: 2012, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 75', '1.3 Multijet 95'] },
    { from: 2013, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 Fire 69', '1.4 Fire 77', '0.9 TwinAir 105'] },
    { from: 2013, to: 2016, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 Fire Dualogic 77'] },
    { from: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 75', '1.3 Multijet 95'] },
  ], packages: ['Pop', 'Easy', 'Lounge', 'Urban', 'Sporting', 'S&S'] },
  Bravo: { from: 2010, to: 2014, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 T-Jet 120', '1.4 MultiAir 140'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 T-Jet Dualogic 120'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 Multijet 105', '1.6 Multijet 120'] },
  ], packages: ['Active', 'Dynamic', 'Emotion', 'Sport Style'] },
  Linea: { from: 2010, to: 2018, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 Fire 77', '1.4 T-Jet 120'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 90', '1.3 Multijet 95', '1.6 Multijet 105'] },
    { fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.4 Fire LPG 77'] },
  ], packages: ['Active', 'Dynamic', 'Emotion', 'Pop', 'Easy', 'Urban', 'Lounge'] },
  Panda: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2011, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 Fire 69', '1.4 100 HP'] },
    { to: 2011, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 75'] },
    { from: 2012, to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 Fire 69', '0.9 TwinAir 85', '0.9 TwinAir 4x4 85'] },
    { from: 2012, to: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 75', '1.3 Multijet 95'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Manuel'], engines: ['1.0 FireFly Hybrid 70'] },
  ], packages: ['Active', 'Dynamic', 'Emotion', 'Pop', 'Easy', 'Lounge', 'City Cross', 'Cross', 'Pandina'] },
  '500': { from: 2010, to: 2024, bodyType: 'Hatchback', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 Fire 69', '0.9 TwinAir 85', '1.4 100 HP'] },
    { to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 Fire Dualogic 69', '0.9 TwinAir Dualogic 85'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 75', '1.3 Multijet 95'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Manuel'], engines: ['1.0 FireFly Hybrid 70'] },
  ], packages: ['Pop', 'Popstar', 'Lounge', 'Sport', 'Rockstar', 'Star', 'Dolcevita', 'Cult', 'Connect'] },
  '500C': { from: 2010, to: 2024, bodyType: 'Hatchback', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 Fire 69', '0.9 TwinAir 85'] },
    { to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 Fire Dualogic 69'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Manuel'], engines: ['1.0 FireFly Hybrid 70'] },
  ], packages: ['Pop', 'Lounge', 'Dolcevita', 'Cult', 'Connect'] },
  '500e': { from: 2021, to: 2026, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['70 kW 24 kWh', '87 kW 42 kWh'] },
  ], packages: ['Action', 'Icon', 'La Prima', 'Red', '3+1', 'Giorgio Armani'] },
  '500L': { from: 2013, to: 2022, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 Fire 95', '0.9 TwinAir 105', '1.4 T-Jet 120'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 Fire Dualogic 95'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 95', '1.6 Multijet 105', '1.6 Multijet 120'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.3 Multijet Dualogic 95'] },
  ], packages: ['Pop', 'Popstar', 'Lounge', 'Rockstar', 'Cross', 'Mirror'] },
  '500X': { from: 2015, to: 2024, bodyType: 'SUV', drives: [
    { to: 2019, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 MultiAir 140'] },
    { to: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 MultiAir DCT 140', '1.4 MultiAir AT9 170 4x4'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 95', '1.6 Multijet 120'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 Multijet DCT 120', '2.0 Multijet AT9 140 4x4'] },
    { from: 2019, to: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.3 FireFly DCT 150'] },
    { from: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 FireFly Hybrid DCT 130'] },
  ], packages: ['Pop', 'Popstar', 'Lounge', 'Cross', 'Cross Plus', 'Urban', 'City Cross', 'Sport', 'Dolcevita'] },
  Freemont: { from: 2012, to: 2015, bodyType: 'SUV', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 Multijet 140'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 Multijet 170 AWD'] },
  ], packages: ['Urban', 'Lounge', 'Black Code'] },
  'Egea Sedan': { from: 2015, to: 2026, bodyType: 'Sedan', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 Fire 95'] },
    { to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 E-Torq AT6 110'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 95', '1.6 Multijet 120'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 Multijet DCT 120'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 Fire 95', '1.0 FireFly 100'] },
    { from: 2021, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 95', '1.6 Multijet 130'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 Multijet DCT 130'] },
    { from: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 T4 Hybrid DCT 130'] },
  ], packages: ['Easy', 'Urban', 'Lounge', 'Mirror', 'S-Design', 'Street', 'Limited'] },
  'Egea Hatchback': { from: 2016, to: 2024, bodyType: 'Hatchback', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 Fire 95'] },
    { to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 E-Torq AT6 110'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 95', '1.6 Multijet 120'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 Multijet DCT 120'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 FireFly 100'] },
    { from: 2021, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 95', '1.6 Multijet 130'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 Multijet DCT 130'] },
    { from: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 T4 Hybrid DCT 130'] },
  ], packages: ['Easy', 'Urban', 'Lounge', 'Mirror', 'S-Design', 'Street'] },
  'Egea Station Wagon': { from: 2016, to: 2024, bodyType: 'Station Wagon', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 Fire 95'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 95', '1.6 Multijet 120'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 Multijet DCT 120'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 FireFly 100'] },
    { from: 2021, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 95', '1.6 Multijet 130'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 Multijet DCT 130'] },
    { from: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 T4 Hybrid DCT 130'] },
  ], packages: ['Easy', 'Urban', 'Lounge', 'Mirror', 'S-Design', 'Street'] },
  'Egea Cross': { from: 2021, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 Fire 95', '1.0 FireFly 100'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 95', '1.6 Multijet 130'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 Multijet DCT 130'] },
    { from: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 T4 Hybrid DCT 130'] },
  ], packages: ['Street', 'Urban', 'Lounge', 'Limited'] },
  '600': { from: 2024, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid eDCT 100', '1.2 Hybrid eDCT 136'] },
  ], packages: ['Pop', 'Icon', 'La Prima'] },
  '600e': { from: 2024, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['115 kW 54 kWh'] },
  ], packages: ['Red', 'La Prima'] },
  'Grande Panda': { from: 2025, to: 2026, bodyType: 'Hatchback', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid eDCT 110'] },
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['83 kW 44 kWh'] },
  ], packages: ['Pop', 'Icon', 'La Prima'] },
  Qubo: { from: 2010, to: 2020, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 Fire 77'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 75', '1.3 Multijet 95'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.3 Multijet Dualogic 80'] },
  ], packages: ['Active', 'Dynamic', 'Trekking', 'Lounge'] },
  Fiorino: { from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 Fire 77'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 75', '1.3 Multijet 80', '1.3 Multijet 95'] },
    { from: 2016, to: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.3 Multijet Dualogic 80'] },
  ], packages: ['Base', 'Pop', 'Safeline', 'Premio', 'Adventure', 'Trekking'] },
  Doblo: { from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2022, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 Fire 95', '1.4 T-Jet 120'] },
    { to: 2022, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 Multijet 90', '1.6 Multijet 105', '1.6 Multijet 120', '2.0 Multijet 135'] },
    { from: 2015, to: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 Multijet Dualogic 90'] },
    { from: 2023, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 BlueHDi 100'] },
    { from: 2023, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 BlueHDi EAT8 130'] },
    { from: 2023, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['100 kW 50 kWh'] },
  ], packages: ['Actual', 'Active', 'Dynamic', 'Elegance', 'Premio', 'Easy', 'Urban', 'Lounge', 'Combi', 'Cargo'] },
  Ducato: { from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2014, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.3 Multijet 120', '2.3 Multijet 130', '3.0 Multijet 160'] },
    { from: 2015, to: 2021, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.3 Multijet 130', '2.3 Multijet 150', '2.3 Multijet 180'] },
    { from: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 Multijet AT9 140', '2.2 Multijet AT9 180'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 Multijet 120', '2.2 Multijet 140', '2.2 Multijet 180'] },
    { from: 2022, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['200 kW e-Ducato'] },
  ], packages: ['Van', 'Kamyonet', 'Şasi Kabin', 'Minibüs', 'Combi', 'Maxi'] },
  Scudo: { from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2016, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 Multijet 90', '2.0 Multijet 130', '2.0 Multijet 160'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 BlueHDi 120', '2.0 BlueHDi 145'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 BlueHDi EAT8 180'] },
    { from: 2022, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['100 kW 50 kWh', '100 kW 75 kWh'] },
  ], packages: ['Business', 'Comfort', 'Maxi', 'Panelvan', 'Combi'] },
  Ulysse: { from: 2010, to: 2011, bodyType: 'MPV', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 Multijet 120'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 Multijet 163'] },
  ], packages: ['Dynamic', 'Emotion'] },
  'E-Ulysse': { from: 2022, to: 2026, bodyType: 'MPV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['100 kW 50 kWh', '100 kW 75 kWh'] },
  ], packages: ['Standard', 'Lounge'] },
  Fullback: { from: 2016, to: 2019, bodyType: 'Pick-Up', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.4 Multijet 150 4x4'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.4 Multijet AT5 180 4x4'] },
  ], packages: ['SX', 'LX', 'Cross'] },
};
