export type SkodaDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type SkodaModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Station Wagon' | 'MPV' | 'SUV';
  drives: SkodaDrive[];
  packages: string[];
};

// Türkiye-facing Škoda catalogue. Generation boundaries keep legacy MPI/TDI
// combinations out of the current mHEV/PHEV and battery-electric range.
export const skodaCatalog: Record<string, SkodaModel> = {
  Fabia: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2014, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 HTP 60 HP MT5', '1.2 HTP 70 HP MT5', '1.2 TSI 105 HP MT5', '1.2 TSI DSG 105 HP', '1.4 TSI DSG RS 180 HP'] },
    { to: 2014, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.2 TDI 75 HP MT5', '1.6 TDI 90 HP MT5', '1.6 TDI 105 HP MT5'] },
    { from: 2015, to: 2021, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 MPI 60 HP MT5', '1.0 MPI 75 HP MT5', '1.0 TSI 95 HP MT5', '1.0 TSI DSG 110 HP', '1.2 TSI DSG 110 HP'] },
    { from: 2015, to: 2018, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TDI 90 HP MT5', '1.4 TDI DSG 90 HP', '1.4 TDI 105 HP MT5'] },
    { from: 2022, to: 2025, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 MPI 80 PS MT5', '1.0 TSI 95 PS MT5', '1.0 TSI DSG 110 PS', '1.5 TSI DSG 150 PS'] },
    { from: 2026, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 TSI DSG 116 PS', '1.5 TSI DSG 150 PS'] },
  ], packages: ['Classic', 'Ambiente', 'Elegance', 'Optimal', 'Dynamic', 'Style', 'Monte Carlo', 'Premium', '130 Edition'] },

  'Fabia Combi': { from: 2010, to: 2022, bodyType: 'Station Wagon', drives: [
    { to: 2014, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 HTP 70 HP MT5', '1.2 TSI 105 HP MT5', '1.2 TSI DSG 105 HP'] },
    { to: 2014, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.2 TDI 75 HP MT5', '1.6 TDI 90 HP MT5', '1.6 TDI 105 HP MT5'] },
    { from: 2015, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 MPI 75 HP MT5', '1.0 TSI 95 HP MT5', '1.0 TSI DSG 110 HP', '1.2 TSI DSG 110 HP'] },
    { from: 2015, to: 2018, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TDI 90 HP MT5', '1.4 TDI DSG 90 HP'] },
  ], packages: ['Classic', 'Ambiente', 'Elegance', 'Style', 'ScoutLine', 'Monte Carlo'] },

  Roomster: { from: 2010, to: 2015, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 HTP 70 HP MT5', '1.2 TSI 85 HP MT5', '1.2 TSI DSG 105 HP', '1.4 86 HP MT5'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.2 TDI 75 HP MT5', '1.6 TDI 90 HP MT5', '1.6 TDI 105 HP MT5'] },
  ], packages: ['Comfort', 'Ambition', 'Style', 'Scout'] },

  Citigo: { from: 2012, to: 2019, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 MPI 60 HP MT5', '1.0 MPI 75 HP MT5', '1.0 MPI ASG 75 HP'] },
  ], packages: ['Active', 'Ambition', 'Elegance', 'Style', 'Monte Carlo'] },

  'Citigo-e iV': { from: 2020, to: 2021, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['36.8 kWh 83 PS'] },
  ], packages: ['Ambition', 'Style'] },

  Rapid: { from: 2013, to: 2019, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 MPI 75 HP MT5', '1.2 TSI 90 HP MT5', '1.2 TSI 105 HP MT6', '1.4 TSI DSG 125 HP', '1.0 TSI DSG 110 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 90 HP MT5', '1.6 TDI DSG 90 HP', '1.6 TDI 105 HP MT5'] },
  ], packages: ['Active', 'Ambition', 'Elegance', 'Style', 'Prestige'] },

  'Rapid Spaceback': { from: 2014, to: 2019, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 90 HP MT5', '1.2 TSI DSG 110 HP', '1.4 TSI DSG 125 HP', '1.0 TSI DSG 110 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TDI 90 HP MT5', '1.4 TDI DSG 90 HP', '1.6 TDI 105 HP MT5'] },
  ], packages: ['Active', 'Ambition', 'Style', 'Style Plus', 'Monte Carlo'] },

  Scala: { from: 2019, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2023, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 TSI 95 PS MT5', '1.0 TSI DSG 115 PS', '1.5 TSI ACT DSG 150 PS'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 TDI DSG 115 PS'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 TSI DSG 115 PS', '1.5 TSI ACT DSG 150 PS'] },
  ], packages: ['Elite', 'Premium', 'Prestige', 'Sportline', 'Monte Carlo'] },

  Octavia: { from: 2010, to: 2026, bodyType: 'Sedan', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 105 HP MT6', '1.4 TSI 122 HP MT6', '1.4 TSI DSG 122 HP', '1.8 TSI DSG 160 HP', '2.0 TFSI DSG RS 200 HP'] },
    { to: 2012, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '1.6 TDI DSG 105 HP', '2.0 TDI 140 HP MT6', '2.0 TDI DSG 140 HP'] },
    { from: 2013, to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 110 HP MT6', '1.4 TSI DSG 150 HP', '1.5 TSI DSG ACT 150 HP', '2.0 TSI DSG RS 220 HP', '2.0 TSI DSG RS 245 HP'] },
    { from: 2013, to: 2020, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 110 HP MT5', '1.6 TDI DSG 110 HP', '2.0 TDI DSG 150 HP', '2.0 TDI DSG RS 184 HP'] },
    { from: 2021, to: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 e-TEC DSG 110 PS', '1.5 TSI ACT DSG 150 PS'] },
    { from: 2021, to: 2023, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 150 PS'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.0 e-TEC DSG 110 PS', '1.5 TSI mHEV DSG 150 PS', '1.4 iV DSG 204 PS'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 TSI DSG RS 265 PS'] },
  ], packages: ['Active', 'Ambition', 'Optimal', 'Elegance', 'Style', 'Elite', 'Premium', 'Prestige', 'Sportline', 'RS'] },

  'Octavia Combi': { from: 2010, to: 2026, bodyType: 'Station Wagon', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 105 HP MT6', '1.4 TSI DSG 150 HP', '1.5 TSI DSG ACT 150 HP', '2.0 TSI DSG RS 245 HP'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '1.6 TDI DSG 110 HP', '2.0 TDI DSG 150 HP', '2.0 TDI DSG RS 184 HP'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 TSI mHEV DSG 150 PS', '1.4 iV DSG 204 PS'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 TSI DSG RS 265 PS'] },
  ], packages: ['Ambition', 'Elegance', 'Style', 'Scout', 'Sportline', 'Combi Sportline', 'RS', 'Combi RS'] },

  Superb: { from: 2010, to: 2026, bodyType: 'Sedan', drives: [
    { to: 2015, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TSI 125 HP MT6', '1.4 TSI DSG 125 HP', '1.8 TSI DSG 160 HP', '2.0 TSI DSG 200 HP', '3.6 FSI DSG 4x4 260 HP'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '1.6 TDI DSG 105 HP', '2.0 TDI DSG 140 HP', '2.0 TDI DSG 170 HP'] },
    { from: 2016, to: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 TSI DSG ACT 150 HP', '1.5 TSI DSG ACT 150 HP', '2.0 TSI DSG 220 HP', '2.0 TSI DSG 4x4 280 HP'] },
    { from: 2016, to: 2023, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 TDI DSG 120 HP', '2.0 TDI DSG 150 HP', '2.0 TDI DSG 4x4 190 HP'] },
    { from: 2020, to: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 iV DSG PHEV 218 PS'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 TSI mHEV DSG 150 PS', '1.5 TSI iV DSG PHEV 204 PS'] },
    { from: 2024, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 150 PS', '2.0 TDI DSG 4x4 193 PS'] },
  ], packages: ['Active', 'Ambition', 'Elegance', 'Style', 'Prestige', 'Laurin & Klement', 'Sportline'] },

  'Superb Combi': { from: 2010, to: 2026, bodyType: 'Station Wagon', drives: [
    { to: 2015, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TSI 125 HP MT6', '1.8 TSI DSG 160 HP', '2.0 TSI DSG 200 HP'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '2.0 TDI DSG 140 HP', '2.0 TDI DSG 170 HP'] },
    { from: 2016, to: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 TSI DSG ACT 150 HP', '2.0 TSI DSG 4x4 280 HP'] },
    { from: 2016, to: 2023, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 150 HP', '2.0 TDI DSG 4x4 190 HP'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 iV DSG PHEV 218 PS', '1.5 TSI iV DSG PHEV 204 PS'] },
    { from: 2024, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 150 PS', '2.0 TDI DSG 4x4 193 PS'] },
  ], packages: ['Ambition', 'Elegance', 'Style', 'Prestige', 'Laurin & Klement', 'Sportline'] },

  Yeti: { from: 2010, to: 2017, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 105 HP MT6', '1.2 TSI DSG 105 HP', '1.4 TSI DSG 122 HP', '1.8 TSI DSG 4x4 160 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '2.0 TDI 110 HP MT5', '2.0 TDI DSG 4x4 140 HP', '2.0 TDI DSG 4x4 170 HP'] },
  ], packages: ['Active', 'Ambition', 'Elegance', 'Outdoor', 'Style', 'Laurin & Klement'] },

  Kamiq: { from: 2019, to: 2026, bodyType: 'SUV', drives: [
    { to: 2023, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 TSI 95 PS MT5', '1.0 TSI DSG 115 PS', '1.5 TSI ACT DSG 150 PS'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 TDI DSG 115 PS'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 TSI DSG 115 PS', '1.5 TSI ACT DSG 150 PS'] },
  ], packages: ['Elite', 'Premium', 'Prestige', 'Sportline', 'Monte Carlo'] },

  Karoq: { from: 2018, to: 2026, bodyType: 'SUV', drives: [
    { to: 2021, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 TSI 115 PS MT6', '1.5 TSI ACT DSG 150 PS'] },
    { to: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 TDI DSG 115 PS', '2.0 TDI DSG 150 PS', '2.0 TDI DSG 4x4 190 PS'] },
    { from: 2022, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 TSI ACT DSG 150 PS'] },
  ], packages: ['Ambition', 'Style', 'Elite', 'Premium', 'Prestige', 'Sportline'] },

  Kodiaq: { from: 2017, to: 2026, bodyType: 'SUV', drives: [
    { to: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 TSI DSG ACT 150 PS', '1.5 TSI ACT DSG 150 PS', '2.0 TSI DSG 4x4 180 PS', '2.0 TSI DSG 4x4 RS 245 PS'] },
    { to: 2023, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 150 PS', '2.0 TDI DSG 4x4 190 PS', '2.0 BiTDI DSG 4x4 RS 240 PS'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 TSI mHEV DSG 150 PS', '1.5 TSI iV DSG PHEV 204 PS'] },
    { from: 2024, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 193 PS 4x4'] },
    { from: 2025, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 TSI DSG RS 265 PS 4x4'] },
  ], packages: ['Ambition', 'Style', 'Prestige', 'Sportline', 'Laurin & Klement', 'RS'] },

  Enyaq: { from: 2021, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Enyaq 50 55 kWh 109 kW', 'Enyaq 60 63 kWh 150 kW (204 PS)', 'Enyaq 80 82 kWh 150 kW', 'Enyaq 80x 82 kWh AWD', 'Enyaq 85 82 kWh 210 kW', 'Enyaq RS 84 kWh 250 kW (340 PS)'] },
  ], packages: ['iV 50', 'iV 60', 'iV 80', 'iV 80x', 'e-Prestige 60', 'Sportline', 'RS'] },

  'Enyaq Coupé': { from: 2022, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Enyaq Coupé 60 63 kWh 150 kW (204 PS)', 'Enyaq Coupé 85 82 kWh 210 kW', 'Enyaq Coupé RS 84 kWh 250 kW (340 PS)'] },
  ], packages: ['e-Sportline Coupé 60', 'Sportline', 'RS', 'e-RS Coupé'] },

  Elroq: { from: 2025, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Elroq 50 52 kWh 125 kW', 'Elroq 60 61 kWh 140 kW (190 PS)', 'Elroq 85 82 kWh 210 kW', 'Elroq 85x 82 kWh AWD', 'Elroq RS 84 kWh 250 kW'] },
  ], packages: ['e-Prestige 60', 'Sportline', 'RS'] },
};
