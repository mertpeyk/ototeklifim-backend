export type SeatDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'LPG' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type SeatModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Station Wagon' | 'Coupe' | 'MPV' | 'SUV';
  drives: SeatDrive[];
  packages: string[];
};

// Türkiye-facing SEAT catalogue. Model generations are bounded so legacy
// MPI/TDI/DSG combinations cannot leak into the current eTSI/e-HYBRID range.
export const seatCatalog: Record<string, SeatModel> = {
  Ibiza: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2015, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 70 HP MT5', '1.4 85 HP MT5', '1.2 TSI 105 HP MT5', '1.2 TSI DSG 105 HP', '1.4 TSI DSG Cupra 180 HP'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.2 TDI 75 HP MT5', '1.6 TDI 90 HP MT5', '1.6 TDI 105 HP MT5'] },
    { from: 2016, to: 2017, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 MPI 75 HP MT5', '1.0 EcoTSI 95 HP MT5', '1.0 EcoTSI DSG 110 HP', '1.4 EcoTSI DSG ACT 150 HP'] },
    { from: 2016, to: 2017, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 TDI 90 HP MT5', '1.4 TDI 105 HP MT5'] },
    { from: 2018, to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 MPI 80 HP MT5', '1.0 EcoTSI 95 HP MT5', '1.0 EcoTSI DSG 115 HP'] },
    { from: 2018, to: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 TDI 80 HP MT5', '1.6 TDI 95 HP MT5'] },
    { from: 2021, to: 2025, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 MPI 80 HP MT5', '1.0 EcoTSI 95 HP MT5', '1.0 EcoTSI DSG 110 HP', '1.5 EcoTSI DSG 150 HP'] },
    { from: 2026, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 TSI DSG 116 PS'] },
  ], packages: ['Reference', 'Style', 'Style Plus', 'Stylance', 'Sport', 'FR', 'FR Plus', 'Cupra', 'Xcellence', 'Xcellence Plus'] },

  'Ibiza SC': { from: 2010, to: 2017, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 70 HP MT5', '1.2 TSI 105 HP MT5', '1.2 TSI DSG 105 HP', '1.4 TSI DSG Cupra 180 HP', '1.8 TSI DSG Cupra 192 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.2 TDI 75 HP MT5', '1.6 TDI 90 HP MT5', '1.6 TDI 105 HP MT5'] },
  ], packages: ['Reference', 'Style', 'Sport', 'FR', 'Cupra'] },

  'Ibiza ST': { from: 2010, to: 2016, bodyType: 'Station Wagon', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 70 HP MT5', '1.2 TSI 105 HP MT5', '1.2 TSI DSG 105 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.2 TDI 75 HP MT5', '1.6 TDI 90 HP MT5', '1.6 TDI 105 HP MT5'] },
  ], packages: ['Reference', 'Style', 'Stylance', 'Sport'] },

  Leon: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 105 HP MT6', '1.4 TSI 125 HP MT6', '1.8 TSI DSG 160 HP', '2.0 TSI DSG FR 211 HP', '2.0 TSI DSG Cupra 240 HP'] },
    { to: 2012, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '1.6 TDI DSG 105 HP', '2.0 TDI 140 HP MT6', '2.0 TDI DSG 140 HP'] },
    { from: 2013, to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 110 HP MT6', '1.2 TSI DSG 110 HP', '1.4 EcoTSI 150 HP MT6', '1.4 EcoTSI DSG ACT 150 HP', '1.5 EcoTSI DSG 150 HP', '2.0 TSI DSG Cupra 280 HP', '2.0 TSI DSG Cupra 300 HP'] },
    { from: 2013, to: 2020, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 110 HP MT5', '1.6 TDI DSG 110 HP', '2.0 TDI 150 HP MT6', '2.0 TDI DSG 184 HP'] },
    { from: 2021, to: 2025, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 TSI 110 HP MT6', '1.5 TSI ACT 130 HP MT6'] },
    { from: 2021, to: 2026, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.0 eTSI DSG 110 HP', '1.5 eTSI ACT DSG 116 PS', '1.5 eTSI ACT DSG 150 HP', '1.4 e-HYBRID DSG 204 HP', '1.5 e-HYBRID DSG 204 PS'] },
  ], packages: ['Reference', 'Style', 'Style Plus', 'Stylance', 'Sport', 'FR', 'FR Plus', 'Cupra', 'Xcellence', 'Xcellence Plus', 'Black Edition'] },

  'Leon SC': { from: 2013, to: 2018, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 110 HP MT6', '1.4 EcoTSI DSG ACT 150 HP', '1.8 TSI DSG 180 HP', '2.0 TSI DSG Cupra 280 HP', '2.0 TSI DSG Cupra 300 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 110 HP MT5', '2.0 TDI DSG 184 HP'] },
  ], packages: ['Style', 'Sport', 'FR', 'Cupra'] },

  'Leon ST': { from: 2014, to: 2020, bodyType: 'Station Wagon', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 110 HP MT6', '1.4 EcoTSI DSG ACT 150 HP', '1.5 EcoTSI DSG 150 HP', '2.0 TSI DSG Cupra 300 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 110 HP MT5', '1.6 TDI DSG 110 HP', '2.0 TDI DSG 150 HP', '2.0 TDI DSG 184 HP'] },
  ], packages: ['Style', 'FR', 'Xcellence', 'Cupra', '4Drive'] },

  Toledo: { from: 2013, to: 2019, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 90 HP MT5', '1.2 TSI 110 HP MT6', '1.4 TSI DSG 125 HP', '1.0 EcoTSI 110 HP MT6', '1.0 EcoTSI DSG 110 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 90 HP MT5', '1.6 TDI 105 HP MT5', '1.6 TDI DSG 105 HP'] },
  ], packages: ['Reference', 'Style', 'Style Plus', 'Advanced', 'Xcellence'] },

  Exeo: { from: 2010, to: 2013, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.8 TSI 120 HP MT6', '1.8 TSI 160 HP MT6', '2.0 TSI Multitronic 200 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 TDI 120 HP MT6', '2.0 TDI 143 HP MT6', '2.0 TDI Multitronic 143 HP'] },
  ], packages: ['Reference', 'Style', 'Sport'] },

  'Exeo ST': { from: 2010, to: 2013, bodyType: 'Station Wagon', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.8 TSI 160 HP MT6', '2.0 TSI Multitronic 200 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 TDI 143 HP MT6', '2.0 TDI Multitronic 143 HP'] },
  ], packages: ['Reference', 'Style', 'Sport'] },

  Altea: { from: 2010, to: 2015, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 105 HP MT6', '1.4 TSI 125 HP MT6', '1.8 TSI DSG 160 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '1.6 TDI DSG 105 HP', '2.0 TDI 140 HP MT6'] },
  ], packages: ['Reference', 'Stylance', 'Style', 'Sport', 'I-Tech'] },

  'Altea XL': { from: 2010, to: 2015, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 105 HP MT6', '1.4 TSI 125 HP MT6', '1.8 TSI DSG 160 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '1.6 TDI DSG 105 HP', '2.0 TDI DSG 140 HP'] },
  ], packages: ['Reference', 'Stylance', 'Style', 'Sport', 'I-Tech'] },

  Mii: { from: 2012, to: 2019, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 MPI 60 HP MT5', '1.0 MPI 75 HP MT5', '1.0 MPI ASG 75 HP'] },
  ], packages: ['Reference', 'Style', 'Chic', 'Sport', 'Mii by Mango'] },

  'Mii Electric': { from: 2020, to: 2021, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['36.8 kWh 83 HP'] },
  ], packages: ['Electric', 'Plus'] },

  Alhambra: { from: 2010, to: 2020, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TSI 150 HP MT6', '1.4 TSI DSG 150 HP', '2.0 TSI DSG 200 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 TDI 140 HP MT6', '2.0 TDI DSG 140 HP', '2.0 TDI DSG 177 HP', '2.0 TDI DSG 184 HP'] },
  ], packages: ['Reference', 'Style', 'Style Plus', 'Xcellence', 'FR Line'] },

  Arona: { from: 2017, to: 2026, bodyType: 'SUV', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 EcoTSI 95 HP MT5', '1.0 EcoTSI DSG 115 HP', '1.5 EcoTSI DSG ACT 150 HP'] },
    { to: 2019, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 95 HP MT5', '1.6 TDI DSG 95 HP'] },
    { from: 2021, to: 2025, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 EcoTSI 95 HP MT5', '1.0 EcoTSI DSG 110 HP', '1.5 EcoTSI DSG 150 HP'] },
    { from: 2026, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 TSI DSG 116 PS'] },
  ], packages: ['Reference', 'Style', 'Style Plus', 'Xcellence', 'Xperience', 'FR', 'FR Plus'] },

  Ateca: { from: 2016, to: 2026, bodyType: 'SUV', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 TSI 115 HP MT6', '1.4 EcoTSI DSG ACT 150 HP', '1.5 EcoTSI DSG ACT 150 HP', '2.0 TSI DSG 4Drive 190 HP'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 115 HP MT6', '2.0 TDI DSG 150 HP', '2.0 TDI DSG 4Drive 190 HP'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 EcoTSI ACT DSG 150 HP'] },
  ], packages: ['Reference', 'Style', 'Style Plus', 'Xcellence', 'Xperience', 'FR', 'FR Plus'] },

  Tarraco: { from: 2019, to: 2023, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 EcoTSI DSG ACT 150 HP', '2.0 TSI DSG 4Drive 190 HP'] },
    { to: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 150 HP', '2.0 TDI DSG 4Drive 190 HP'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 e-HYBRID DSG 245 HP'] },
  ], packages: ['Style', 'Xcellence', 'Xperience', 'FR', 'FR Plus', '4Drive'] },
};
