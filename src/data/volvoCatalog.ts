export type VolvoDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type VolvoModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Station Wagon' | 'Coupe' | 'SUV';
  drives: VolvoDrive[];
  packages: string[];
};

const classic = ['Kinetic', 'Momentum', 'R-Design', 'Summum'];
const modern = ['Momentum', 'R-Design', 'Inscription', 'Plus', 'Ultimate'];

// Türkiye-facing production catalogue. Model renames (Recharge -> EX/EC) and
// powertrain eras are intentionally separate so old diesel/petrol records do
// not leak into current mild-hybrid, plug-in hybrid or electric cars.
export const volvoCatalog: Record<string, VolvoModel> = {
  C30: { from: 2010, to: 2013, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 100 HP', '2.0 145 HP', 'T5 230 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6D 109 HP', 'D2 115 HP', 'D3 150 HP', 'D4 177 HP'] },
  ], packages: classic },
  C70: { from: 2010, to: 2013, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['T5 230 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['D3 150 HP', 'D4 177 HP'] },
  ], packages: ['Kinetic', 'Momentum', 'Summum', 'Inscription'] },
  S40: { from: 2010, to: 2012, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 100 HP', '2.0 145 HP', 'T5 230 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6D 109 HP', 'D2 115 HP', 'D3 150 HP', 'D4 177 HP'] },
  ], packages: classic },
  V50: { from: 2010, to: 2012, bodyType: 'Station Wagon', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 100 HP', '2.0 145 HP', 'T5 230 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6D 109 HP', 'D2 115 HP', 'D3 150 HP', 'D4 177 HP'] },
  ], packages: classic },
  S60: { from: 2010, to: 2024, bodyType: 'Sedan', drives: [
    { from: 2010, to: 2013, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['T3 150 HP', 'T4 180 HP', 'T5 240 HP', 'T6 AWD 304 HP'] },
    { from: 2010, to: 2013, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['D3 163 HP', 'D5 205 HP'] },
    { from: 2014, to: 2018, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['T3 152 HP', 'T4 190 HP', 'T5 245 HP', 'T6 AWD 306 HP'] },
    { from: 2014, to: 2018, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['D2 120 HP', 'D3 150 HP', 'D4 190 HP', 'D5 AWD 225 HP'] },
    { from: 2019, to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['T4 190 HP', 'T5 250 HP', 'T6 AWD 310 HP'] },
    { from: 2019, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['D3 150 HP', 'D4 190 HP'] },
    { from: 2019, to: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['T8 Twin Engine AWD 390 HP', 'T8 Recharge AWD 455 HP', 'B4 Mild Hybrid 197 HP', 'B5 Mild Hybrid 250 HP'] },
  ], packages: ['Kinetic', 'Momentum', 'Premium', 'Advance', 'R-Design', 'Inscription', 'Polestar Engineered', 'Plus', 'Ultimate'] },
  S80: { from: 2010, to: 2016, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6T 180 HP', 'T4 180 HP', 'T5 245 HP', 'T6 AWD 304 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['D2 115 HP', 'D3 163 HP', 'D4 181 HP', 'D5 AWD 215 HP'] },
  ], packages: ['Kinetic', 'Momentum', 'Summum', 'Executive', 'Inscription'] },
  S90: { from: 2017, to: 2025, bodyType: 'Sedan', drives: [
    { from: 2017, to: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['T5 254 HP', 'T6 AWD 320 HP'] },
    { from: 2017, to: 2019, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['D4 190 HP', 'D5 AWD 235 HP'] },
    { from: 2017, to: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['T8 Twin Engine AWD 390 HP', 'B5 Mild Hybrid 250 HP', 'B6 Mild Hybrid AWD 300 HP', 'T8 Recharge AWD 455 HP'] },
  ], packages: ['Momentum', 'R-Design', 'Inscription', 'Plus', 'Ultimate'] },
  V40: { from: 2012, to: 2019, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['T2 122 HP', 'T3 152 HP', 'T4 190 HP', 'T5 245 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['D2 120 HP', 'D3 150 HP', 'D4 190 HP'] },
  ], packages: ['Kinetic', 'Momentum', 'R-Design', 'Inscription'] },
  'V40 Cross Country': { from: 2013, to: 2019, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['T3 152 HP', 'T4 190 HP', 'T5 AWD 245 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['D2 120 HP', 'D3 150 HP', 'D4 190 HP'] },
  ], packages: ['Kinetic', 'Momentum', 'R-Design', 'Summum'] },
  V60: { from: 2010, to: 2026, bodyType: 'Station Wagon', drives: [
    { from: 2010, to: 2018, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['T3 150 HP', 'T4 180 HP', 'T5 245 HP', 'T6 AWD 304 HP'] },
    { from: 2010, to: 2018, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['D2 115 HP', 'D3 150 HP', 'D4 190 HP', 'D5 AWD 215 HP'] },
    { from: 2019, to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['T4 190 HP', 'T5 250 HP', 'T6 AWD 310 HP'] },
    { from: 2019, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['D3 150 HP', 'D4 190 HP'] },
    { from: 2019, to: 2026, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['B3 Mild Hybrid 163 HP', 'B4 Mild Hybrid 197 HP', 'B5 Mild Hybrid 250 HP', 'T6 Recharge AWD 350 HP', 'T8 Recharge AWD 455 HP'] },
  ], packages: modern },
  'V60 Cross Country': { from: 2015, to: 2025, bodyType: 'Station Wagon', drives: [
    { from: 2015, to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['T5 AWD 245 HP'] },
    { from: 2015, to: 2020, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['D3 150 HP', 'D4 AWD 190 HP'] },
    { from: 2019, to: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['B4 AWD Mild Hybrid 197 HP', 'B5 AWD Mild Hybrid 250 HP'] },
  ], packages: ['Momentum', 'Pro', 'Plus', 'Ultimate'] },
  V70: { from: 2010, to: 2016, bodyType: 'Station Wagon', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['T4 180 HP', 'T5 245 HP', 'T6 AWD 304 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['D2 115 HP', 'D3 163 HP', 'D4 181 HP', 'D5 AWD 215 HP'] },
  ], packages: ['Kinetic', 'Momentum', 'Summum', 'Ocean Race'] },
  XC70: { from: 2010, to: 2016, bodyType: 'Station Wagon', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['T5 AWD 245 HP', 'T6 AWD 304 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['D3 163 HP', 'D4 AWD 181 HP', 'D5 AWD 215 HP'] },
  ], packages: ['Kinetic', 'Momentum', 'Summum', 'Ocean Race'] },
  V90: { from: 2017, to: 2024, bodyType: 'Station Wagon', drives: [
    { from: 2017, to: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['T5 254 HP', 'T6 AWD 320 HP'] },
    { from: 2017, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['D4 190 HP', 'D5 AWD 235 HP'] },
    { from: 2018, to: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['B4 Mild Hybrid 197 HP', 'B5 Mild Hybrid 250 HP', 'T6 Recharge AWD 350 HP', 'T8 Recharge AWD 455 HP'] },
  ], packages: modern },
  'V90 Cross Country': { from: 2017, to: 2025, bodyType: 'Station Wagon', drives: [
    { from: 2017, to: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['T5 AWD 254 HP', 'T6 AWD 320 HP'] },
    { from: 2017, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['D4 AWD 190 HP', 'D5 AWD 235 HP'] },
    { from: 2020, to: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['B4 AWD Mild Hybrid 197 HP', 'B5 AWD Mild Hybrid 250 HP'] },
  ], packages: ['Momentum', 'Pro', 'Plus', 'Ultimate'] },
  XC40: { from: 2018, to: 2026, bodyType: 'SUV', drives: [
    { from: 2018, to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['T3 163 HP', 'T4 AWD 190 HP', 'T5 AWD 247 HP'] },
    { from: 2018, to: 2020, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['D3 150 HP', 'D4 AWD 190 HP'] },
    { from: 2020, to: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['T4 Recharge 211 HP', 'T5 Recharge 262 HP'] },
    { from: 2021, to: 2026, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['B3 Mild Hybrid 163 HP', 'B4 Mild Hybrid 197 HP'] },
  ], packages: modern },
  'XC40 Recharge Pure Electric': { from: 2021, to: 2023, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Single Motor 231 HP', 'Twin Motor AWD 408 HP'] },
  ], packages: ['Core', 'Plus', 'Ultimate'] },
  'C40 Recharge': { from: 2022, to: 2023, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Single Motor 231 HP', 'Twin Motor AWD 408 HP'] },
  ], packages: ['Core', 'Plus', 'Ultimate'] },
  EX40: { from: 2024, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Single Motor 238 HP', 'Single Motor Extended Range 252 HP', 'Twin Motor Performance AWD 442 HP'] },
  ], packages: ['Core', 'Plus', 'Ultra', 'Black Edition'] },
  EC40: { from: 2024, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Single Motor Extended Range 252 HP', 'Twin Motor Performance AWD 442 HP'] },
  ], packages: ['Plus', 'Ultra', 'Black Edition'] },
  EX30: { from: 2024, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Single Motor 272 HP', 'Single Motor Extended Range 272 HP', 'Twin Motor Performance AWD 428 HP'] },
  ], packages: ['Core', 'Plus', 'Ultra', 'Cross Country'] },
  EX90: { from: 2025, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Twin Motor AWD 408 HP', 'Twin Motor Performance AWD 517 HP'] },
  ], packages: ['Plus', 'Ultra'] },
  XC60: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { from: 2010, to: 2013, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0T 203 HP', 'T5 240 HP', 'T6 AWD 304 HP'] },
    { from: 2010, to: 2013, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['D3 163 HP', 'D5 AWD 205 HP'] },
    { from: 2014, to: 2017, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['T5 245 HP', 'T6 AWD 306 HP'] },
    { from: 2014, to: 2020, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['D3 150 HP', 'D4 190 HP', 'D5 AWD 235 HP'] },
    { from: 2018, to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['T5 250 HP', 'T6 AWD 310 HP'] },
    { from: 2018, to: 2026, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['B4 Diesel Mild Hybrid 197 HP', 'B5 Petrol Mild Hybrid 250 HP', 'T6 Recharge AWD 350 HP', 'T8 Recharge AWD 455 HP'] },
  ], packages: modern },
  XC90: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { from: 2010, to: 2014, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.5T 210 HP', '3.2 243 HP', 'V8 AWD 315 HP'] },
    { from: 2010, to: 2014, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['D5 AWD 200 HP'] },
    { from: 2015, to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['T5 AWD 254 HP', 'T6 AWD 320 HP'] },
    { from: 2015, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['D5 AWD 225 HP', 'D5 PowerPulse AWD 235 HP'] },
    { from: 2015, to: 2026, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['B5 AWD Mild Hybrid 250 HP', 'B6 AWD Mild Hybrid 300 HP', 'T8 Twin Engine AWD 390 HP', 'T8 Recharge AWD 455 HP'] },
  ], packages: ['Momentum', 'R-Design', 'Inscription', 'Excellence', 'Core', 'Plus', 'Ultimate', 'Ultra'] },
};
