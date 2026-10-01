export type NissanDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type NissanModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Coupe' | 'SUV' | 'Pickup' | 'MPV' | 'Panelvan';
  drives: NissanDrive[];
  packages: string[];
};

// Türkiye-facing Nissan catalog. Discontinued generations are deliberately
// bounded and electrified nameplates are kept separate from combustion cars.
export const nissanCatalog: Record<string, NissanModel> = {
  Micra: { from: 2010, to: 2024, bodyType: 'Hatchback', drives: [
    { to: 2016, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 80', '1.2 DIG-S 98'] },
    { to: 2016, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 CVT 80', '1.2 DIG-S CVT 98'] },
    { from: 2017, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['0.9 IG-T 90', '1.0 IG-T 92', '1.0 IG-T 100'] },
    { from: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 IG-T X-Tronic 92', '1.0 IG-T X-Tronic 100'] },
    { from: 2017, to: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 90'] },
  ], packages: ['Visia', 'Street', 'Match', 'Tekna', 'Platinum', 'N-Sport'] },

  Note: { from: 2010, to: 2017, bodyType: 'MPV', drives: [
    { to: 2013, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 88', '1.6 110'] },
    { to: 2013, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 AT 110'] },
    { from: 2013, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 80', '1.2 DIG-S 98'] },
    { from: 2013, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 DIG-S CVT 98'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 90'] },
  ], packages: ['Visia', 'Tekna', 'Platinum'] },

  Tiida: { from: 2010, to: 2012, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 110'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 AT 110'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 106'] },
  ], packages: ['Visia', 'Tekna', 'Platinum'] },

  Pulsar: { from: 2015, to: 2018, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 DIG-T 115', '1.6 DIG-T 190'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 DIG-T X-Tronic 115'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 110'] },
  ], packages: ['Visia', 'Tekna', 'N-Connecta', 'Platinum'] },

  Juke: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2014, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 117', '1.6 DIG-T 190'] },
    { to: 2014, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 CVT 117', '1.6 DIG-T CVT 190'] },
    { to: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 110'] },
    { from: 2015, to: 2019, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 DIG-T 115', '1.6 117'] },
    { from: 2015, to: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 X-Tronic 117'] },
    { from: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 DIG-T 114'] },
    { from: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 DIG-T DCT 114'] },
    { from: 2022, to: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 Full Hybrid 143'] },
  ], packages: ['Visia', 'Tekna', 'Sky Pack', 'Platinum', 'N-Connecta', 'N-Design', 'Plus'] },

  Qashqai: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2013, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 117', '2.0 140'] },
    { to: 2013, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 CVT 117', '2.0 CVT 140'] },
    { to: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 110', '2.0 dCi 150'] },
    { to: 2013, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 dCi AT 150'] },
    { from: 2014, to: 2017, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 DIG-T 115', '1.6 DIG-T 163'] },
    { from: 2014, to: 2017, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 DIG-T X-Tronic 115'] },
    { from: 2014, to: 2017, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 110', '1.6 dCi 130'] },
    { from: 2014, to: 2017, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 dCi X-Tronic 130'] },
    { from: 2018, to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.3 DIG-T 140'] },
    { from: 2018, to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.3 DIG-T DCT 160'] },
    { from: 2018, to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 115', '1.7 dCi 150'] },
    { from: 2018, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 dCi DCT 115', '1.7 dCi X-Tronic 150'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Manuel'], engines: ['1.3 DIG-T MHEV 140'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.3 DIG-T MHEV X-Tronic 158'] },
    { from: 2022, to: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 e-POWER 190'] },
    { from: 2026, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 e-POWER 205'] },
  ], packages: ['Visia', 'Tekna', 'Designpack', 'Sky Pack', 'N-Connecta', 'N-Design', 'Platinum', 'Platinum Premium'] },

  'Qashqai+2': { from: 2010, to: 2013, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 117', '2.0 140'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 CVT 140'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 110', '2.0 dCi 150'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 dCi AT 150'] },
  ], packages: ['Visia', 'Tekna', 'Platinum'] },

  'X-Trail': { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2013, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.0 140'] },
    { to: 2013, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 CVT 140'] },
    { to: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 dCi 150'] },
    { to: 2013, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 dCi AT 150'] },
    { from: 2014, to: 2017, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 DIG-T 163'] },
    { from: 2014, to: 2017, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 dCi 130'] },
    { from: 2014, to: 2017, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 dCi X-Tronic 130'] },
    { from: 2018, to: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.3 DIG-T DCT 160'] },
    { from: 2018, to: 2021, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 dCi 130', '1.7 dCi 150'] },
    { from: 2018, to: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 dCi X-Tronic 130', '1.7 dCi X-Tronic 150'] },
    { from: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 VC-T MHEV 163', '1.5 e-POWER 204', '1.5 e-4ORCE 213'] },
  ], packages: ['Visia', 'Tekna', 'Sky Pack', 'N-Connecta', 'Platinum', 'Platinum Premium'] },

  Murano: { from: 2010, to: 2014, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.5 V6 CVT 256'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.5 dCi AT 190'] },
  ], packages: ['Tekna', 'Platinum'] },

  Pathfinder: { from: 2010, to: 2014, bodyType: 'SUV', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.5 dCi 190'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.5 dCi AT 190', '3.0 dCi V6 AT 231'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['4.0 V6 AT 269'] },
  ], packages: ['SE', 'LE', 'Platinum'] },

  Navara: { from: 2010, to: 2021, bodyType: 'Pickup', drives: [
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.5 dCi 144', '2.5 dCi 190'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.5 dCi AT 190', '3.0 dCi V6 AT 231'] },
    { from: 2016, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.3 dCi 160', '2.3 dCi 190'] },
    { from: 2016, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.3 dCi AT7 190'] },
  ], packages: ['Visia', 'Tekna', 'Platinum', 'N-Guard', '4x2', '4x4'] },

  '370Z': { from: 2010, to: 2020, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['3.7 V6 328', '3.7 V6 Nismo 344'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.7 V6 AT7 328'] },
  ], packages: ['GT', 'Pack', 'Nismo'] },

  'GT-R': { from: 2010, to: 2022, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.8 V6 Twin Turbo DCT 485', '3.8 V6 Twin Turbo DCT 530', '3.8 V6 Twin Turbo DCT 550', '3.8 V6 Twin Turbo DCT 570', '3.8 V6 Nismo DCT 600'] },
  ], packages: ['Premium Edition', 'Black Edition', 'Track Edition', 'Nismo'] },

  Leaf: { from: 2011, to: 2024, bodyType: 'Hatchback', drives: [
    { to: 2015, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['24 kWh 80 kW 109'] },
    { from: 2016, to: 2017, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['30 kWh 80 kW 109'] },
    { from: 2018, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['40 kWh 110 kW 150'] },
    { from: 2019, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['62 kWh e+ 160 kW 217'] },
  ], packages: ['Visia', 'Acenta', 'N-Connecta', 'Tekna'] },

  Ariya: { from: 2022, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['63 kWh 160 kW 218 FWD', '87 kWh 178 kW 242 FWD', '87 kWh e-4ORCE 225 kW 306', '87 kWh e-4ORCE Performance 290 kW 394'] },
  ], packages: ['Engage', 'Advance', 'Evolve', 'Nismo'] },

  NV200: { from: 2010, to: 2021, bodyType: 'Panelvan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 110'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 90', '1.5 dCi 110'] },
  ], packages: ['Visia', 'Tekna', 'Panelvan', 'Camlı Van'] },

  'e-NV200': { from: 2014, to: 2021, bodyType: 'Panelvan', drives: [
    { to: 2017, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['24 kWh 80 kW 109'] },
    { from: 2018, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['40 kWh 80 kW 109'] },
  ], packages: ['Visia', 'Tekna', 'Evalia'] },

  Evalia: { from: 2011, to: 2021, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 110'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 90', '1.5 dCi 110'] },
  ], packages: ['Visia', 'Tekna', 'Premium'] },

  'Townstar Van': { from: 2022, to: 2026, bodyType: 'Panelvan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.3 DIG-T 130'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.3 DIG-T DCT 130'] },
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['45 kWh 90 kW 122'] },
  ], packages: ['Business', 'Tekna', 'Platinum'] },

  'Townstar Combi': { from: 2022, to: 2026, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.3 DIG-T 130'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.3 DIG-T DCT 130'] },
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['45 kWh 90 kW 122'] },
  ], packages: ['Tekna', 'Platinum', 'N-Connecta'] },

  Primastar: { from: 2016, to: 2026, bodyType: 'Panelvan', drives: [
    { to: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 dCi 95', '1.6 dCi 120', '1.6 dCi 125', '1.6 dCi 145'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 dCi 120', '2.0 dCi 145', '2.0 dCi 170'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 dCi DCT 150', '2.0 dCi DCT 170'] },
  ], packages: ['L1H1', 'L2H1', 'Visia', 'Tekna'] },

  Interstar: { from: 2010, to: 2026, bodyType: 'Panelvan', drives: [
    { to: 2021, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.3 dCi 100', '2.3 dCi 125', '2.3 dCi 135', '2.3 dCi 150', '2.3 dCi 165'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.3 dCi 135', '2.3 dCi 150'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.3 dCi AT 150'] },
  ], packages: ['L2H2', 'L3H2', 'L3H3', 'Panelvan', 'Şasi Kabin'] },
};
