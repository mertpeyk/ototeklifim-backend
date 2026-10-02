export type VolkswagenDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type VolkswagenModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Station Wagon' | 'Coupe' | 'Cabrio' | 'MPV' | 'SUV' | 'Pickup' | 'Panelvan';
  drives: VolkswagenDrive[];
  packages: string[];
};

// Türkiye-facing Volkswagen catalogue. Generation boundaries prevent legacy
// TSI/TDI engines from leaking into current eTSI/PHEV and electric ranges.
export const volkswagenCatalog: Record<string, VolkswagenModel> = {
  Fox: { from: 2010, to: 2011, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 55 HP MT5', '1.4 75 HP MT5'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 TDI 70 HP MT5'] },
  ], packages: ['Trendline', 'Comfortline'] },

  Polo: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2014, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 70 HP MT5', '1.4 85 HP MT5', '1.2 TSI 90 HP MT5', '1.2 TSI DSG 105 HP', '1.4 TSI DSG GTI 180 HP'] },
    { to: 2014, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TDI 75 HP MT5', '1.6 TDI 90 HP MT5', '1.6 TDI DSG 90 HP', '1.6 TDI 105 HP MT5'] },
    { from: 2015, to: 2017, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 MPI 75 HP MT5', '1.2 TSI 90 HP MT5', '1.2 TSI DSG 90 HP', '1.4 TSI DSG GTI 192 HP'] },
    { from: 2015, to: 2017, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TDI 75 HP MT5', '1.4 TDI 90 HP MT5', '1.4 TDI DSG 90 HP'] },
    { from: 2018, to: 2021, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 MPI 80 PS MT5', '1.0 TSI 95 PS MT5', '1.0 TSI DSG 95 PS', '1.0 TSI DSG 115 PS', '2.0 TSI DSG GTI 200 PS'] },
    { from: 2022, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 TSI 95 PS MT5', '1.0 TSI DSG 110 PS', '1.0 TSI DSG 116 PS', '2.0 TSI DSG GTI 207 PS'] },
  ], packages: ['Trendline', 'Comfortline', 'Highline', 'Allstar', 'Lounge', 'Life', 'Style', 'R-Line', 'GTI'] },

  Golf: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 105 HP MT6', '1.4 TSI 122 HP MT6', '1.4 TSI DSG 122 HP', '1.4 TSI DSG 160 HP'] },
    { to: 2012, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '1.6 TDI DSG 105 HP', '2.0 TDI 140 HP MT6', '2.0 TDI DSG 140 HP'] },
    { from: 2013, to: 2016, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 105 HP MT6', '1.2 TSI DSG 110 HP', '1.4 TSI DSG ACT 150 HP'] },
    { from: 2013, to: 2016, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '1.6 TDI DSG 110 HP', '2.0 TDI DSG 150 HP'] },
    { from: 2017, to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 TSI 110 PS MT6', '1.0 TSI DSG 110 PS', '1.4 TSI DSG 125 PS', '1.5 TSI ACT DSG 150 PS'] },
    { from: 2017, to: 2020, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 115 PS MT5', '1.6 TDI DSG 115 PS', '2.0 TDI DSG 150 PS'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.0 eTSI DSG 110 PS', '1.5 eTSI DSG 150 PS'] },
  ], packages: ['Trendline', 'Midline Plus', 'Comfortline', 'Highline', 'Allstar', 'Impression', 'Life', 'Style', 'R-Line'] },

  'Golf GTI': { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 TSI 210 HP MT6', '2.0 TSI DSG 210 HP'] },
    { from: 2013, to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 TSI 220 HP MT6', '2.0 TSI DSG 230 HP', '2.0 TSI DSG Performance 245 PS'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 TSI DSG 245 PS', '2.0 TSI DSG 265 PS', '2.0 TSI DSG Clubsport 300 PS'] },
  ], packages: ['GTI', 'GTI Performance', 'GTI Clubsport'] },

  'Golf R': { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 TSI 4Motion 270 HP MT6', '2.0 TSI DSG 4Motion 300 PS', '2.0 TSI DSG 4Motion 310 PS'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 TSI DSG 4Motion 320 PS', '2.0 TSI DSG 4Motion 333 PS'] },
  ], packages: ['R', 'R Performance', 'R Black Edition'] },

  'Golf Variant': { from: 2010, to: 2020, bodyType: 'Station Wagon', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 105 HP MT6', '1.4 TSI DSG 122 HP', '1.4 TSI DSG ACT 150 HP', '1.5 TSI DSG ACT 150 PS'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '1.6 TDI DSG 110 HP', '2.0 TDI DSG 150 PS'] },
  ], packages: ['Trendline', 'Comfortline', 'Highline', 'Alltrack', 'R-Line'] },

  'Golf Plus': { from: 2010, to: 2014, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 105 HP MT6', '1.4 TSI DSG 122 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '1.6 TDI DSG 105 HP', '2.0 TDI DSG 140 HP'] },
  ], packages: ['Trendline', 'Comfortline', 'Highline'] },

  'Golf Sportsvan': { from: 2014, to: 2020, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 110 HP MT6', '1.4 TSI DSG 125 HP', '1.5 TSI DSG ACT 150 PS'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 110 HP MT5', '1.6 TDI DSG 110 HP', '2.0 TDI DSG 150 HP'] },
  ], packages: ['Trendline', 'Comfortline', 'Highline', 'Allstar'] },

  Jetta: { from: 2010, to: 2018, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 105 HP MT6', '1.2 TSI DSG 105 HP', '1.4 TSI 122 HP MT6', '1.4 TSI DSG 122 HP', '1.4 TSI DSG 150 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '1.6 TDI DSG 105 HP', '2.0 TDI DSG 140 HP'] },
  ], packages: ['Trendline', 'Comfortline', 'Highline'] },

  Passat: { from: 2010, to: 2026, bodyType: 'Sedan', drives: [
    { to: 2014, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TSI 122 HP MT6', '1.4 TSI DSG 122 HP', '1.8 TSI DSG 160 HP'] },
    { to: 2014, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '1.6 TDI DSG 105 HP', '2.0 TDI DSG 140 HP', '2.0 TDI DSG 170 HP'] },
    { from: 2015, to: 2019, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TSI 125 HP MT6', '1.4 TSI DSG ACT 150 HP', '1.5 TSI DSG ACT 150 PS'] },
    { from: 2015, to: 2023, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 120 HP MT6', '1.6 TDI DSG 120 HP', '2.0 TDI DSG 150 PS', '2.0 TDI DSG 190 PS', '2.0 TDI DSG 4Motion 200 PS'] },
    { from: 2020, to: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 TSI DSG ACT 150 PS', '2.0 TSI DSG 190 PS'] },
    { from: 2020, to: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 TSI DSG GTE PHEV 218 PS'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 eTSI DSG 150 PS', '1.5 eHybrid DSG PHEV 204 PS', '1.5 eHybrid DSG PHEV 272 PS'] },
    { from: 2024, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 150 PS', '2.0 TDI DSG 4Motion 193 PS'] },
  ], packages: ['Trendline', 'Comfortline', 'Highline', 'Impression', 'Business', 'Elegance', 'R-Line', 'GTE'] },

  'Passat Variant': { from: 2010, to: 2026, bodyType: 'Station Wagon', drives: [
    { to: 2023, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TSI 122 HP MT6', '1.4 TSI DSG ACT 150 HP', '1.5 TSI DSG ACT 150 PS'] },
    { to: 2023, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT5', '1.6 TDI DSG 120 HP', '2.0 TDI DSG 150 PS', '2.0 TDI DSG 4Motion 190 PS'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 TSI DSG GTE PHEV 218 PS', '1.5 eTSI DSG 150 PS', '1.5 eHybrid DSG PHEV 204 PS', '1.5 eHybrid DSG PHEV 272 PS'] },
    { from: 2024, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 150 PS', '2.0 TDI DSG 4Motion 193 PS'] },
  ], packages: ['Trendline', 'Comfortline', 'Highline', 'Impression', 'Business', 'Elegance', 'R-Line', 'Alltrack', 'GTE'] },

  CC: { from: 2010, to: 2016, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.8 TSI DSG 160 HP', '2.0 TSI DSG 210 HP', '3.6 FSI DSG 4Motion 300 HP'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 140 HP', '2.0 TDI DSG 170 HP', '2.0 TDI DSG 4Motion 177 HP'] },
  ], packages: ['Sportline', 'Exclusive', 'R-Line'] },

  Arteon: { from: 2017, to: 2024, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 TSI DSG ACT 150 PS', '2.0 TSI DSG 4Motion 280 PS', '2.0 TSI DSG R 4Motion 320 PS'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 150 PS', '2.0 TDI DSG 4Motion 190 PS'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 TSI DSG eHybrid PHEV 218 PS'] },
  ], packages: ['Elegance', 'R-Line', 'R', 'eHybrid'] },

  Scirocco: { from: 2010, to: 2017, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TSI 122 HP MT6', '1.4 TSI DSG 160 HP', '2.0 TSI DSG 211 HP', '2.0 TSI DSG R 265 HP'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 140 HP', '2.0 TDI DSG 170 HP'] },
  ], packages: ['Sportline', 'GTS', 'R'] },

  Beetle: { from: 2012, to: 2019, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 105 HP MT6', '1.2 TSI DSG 105 HP', '1.4 TSI DSG 160 HP', '2.0 TSI DSG 200 HP'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 TDI DSG 105 HP', '2.0 TDI DSG 140 HP'] },
  ], packages: ['Design', 'Sport', 'R-Line', 'Dune'] },

  Eos: { from: 2010, to: 2015, bodyType: 'Cabrio', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TSI 122 HP MT6', '1.4 TSI DSG 160 HP', '2.0 TSI DSG 210 HP'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 140 HP'] },
  ], packages: ['Comfortline', 'Exclusive'] },

  Phaeton: { from: 2010, to: 2016, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.6 FSI 4Motion 280 HP', '4.2 V8 4Motion 335 HP'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['3.0 V6 TDI 4Motion 240 HP', '3.0 V6 TDI 4Motion 245 HP'] },
  ], packages: ['Premium', 'Exclusive', 'Long'] },

  'T-Cross': { from: 2019, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 TSI 95 PS MT5', '1.0 TSI DSG 110 PS', '1.0 TSI DSG 115 PS', '1.5 TSI ACT DSG 150 PS'] },
  ], packages: ['Life', 'Style', 'R-Line'] },

  Taigo: { from: 2022, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 TSI DSG 95 PS', '1.0 TSI DSG 110 PS', '1.0 TSI DSG 115 PS', '1.5 TSI ACT DSG 150 PS'] },
  ], packages: ['Life', 'Style', 'R-Line'] },

  'T-Roc': { from: 2018, to: 2026, bodyType: 'SUV', drives: [
    { to: 2025, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 TSI 115 PS MT6', '1.5 TSI ACT DSG 150 PS', '2.0 TSI DSG 4Motion R 300 PS'] },
    { to: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 TDI DSG 115 PS', '2.0 TDI DSG 150 PS'] },
    { from: 2026, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 eTSI DSG 150 PS'] },
  ], packages: ['Life', 'Style', 'R-Line', 'R'] },

  Tiguan: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2015, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TSI 122 HP MT6', '1.4 TSI DSG 150 HP', '2.0 TSI DSG 4Motion 210 HP'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 105 HP MT6', '2.0 TDI 140 HP MT6', '2.0 TDI DSG 4Motion 140 HP', '2.0 TDI DSG 4Motion 177 HP'] },
    { from: 2016, to: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 TSI DSG ACT 150 PS', '1.5 TSI ACT DSG 150 PS', '2.0 TSI DSG 4Motion 230 PS'] },
    { from: 2016, to: 2023, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 TDI DSG 115 PS', '2.0 TDI DSG 150 PS', '2.0 TDI DSG 4Motion 190 PS'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 TSI DSG eHybrid PHEV 245 PS', '1.5 eTSI DSG 150 PS', '1.5 eHybrid DSG PHEV 204 PS'] },
    { from: 2024, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 150 PS', '2.0 TDI DSG 4Motion 193 PS'] },
  ], packages: ['Trend & Fun', 'Sport & Style', 'Trendline', 'Comfortline', 'Highline', 'Life', 'Elegance', 'R-Line', 'eHybrid'] },

  'Tiguan Allspace': { from: 2017, to: 2024, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 TSI ACT DSG 150 PS', '2.0 TSI DSG 4Motion 190 PS'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 150 PS', '2.0 TDI DSG 4Motion 200 PS'] },
  ], packages: ['Comfortline', 'Highline', 'Life', 'Elegance', 'R-Line'] },

  Touareg: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.6 FSI 4Motion 280 HP'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['3.0 V6 TDI 4Motion 240 HP', '3.0 V6 TDI 4Motion 245 HP', '3.0 V6 TDI 4Motion 286 PS'] },
    { from: 2011, to: 2018, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['3.0 TSI Hybrid 4Motion 380 HP'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['3.0 TSI eHybrid 4Motion 381 PS', '3.0 TSI eHybrid R 4Motion 462 PS'] },
  ], packages: ['V6', 'Premium', 'Exclusive', 'Elegance', 'R-Line', 'R eHybrid'] },

  Tayron: { from: 2025, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 eTSI DSG 150 PS', '1.5 eHybrid DSG PHEV 204 PS', '1.5 eHybrid DSG PHEV 272 PS'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 150 PS', '2.0 TDI DSG 4Motion 193 PS'] },
  ], packages: ['Life', 'Elegance', 'R-Line'] },

  'e-Golf': { from: 2014, to: 2020, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['24.2 kWh 115 PS', '35.8 kWh 136 PS'] },
  ], packages: ['e-Golf', 'e-Golf Premium'] },

  'ID.3': { from: 2020, to: 2026, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Pure 52 kWh 125 kW', 'Pro 59 kWh 150 kW', 'Pro S 77 kWh 150 kW', 'GTX 79 kWh 240 kW'] },
  ], packages: ['Pure', 'Pro', 'Pro S', 'Life', 'Style', 'GTX'] },

  'ID.4': { from: 2021, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Pure 52 kWh 125 kW (170 PS)', 'Pro 77 kWh 150 kW', 'Pro 77 kWh 210 kW (286 PS)', 'GTX 77 kWh AWD 250 kW'] },
  ], packages: ['Pure', 'Pro', 'Pro Performance', 'GTX'] },

  'ID.5': { from: 2022, to: 2025, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Pro 77 kWh 128 kW', 'Pro Performance 77 kWh 150 kW', 'GTX 77 kWh AWD 220 kW'] },
  ], packages: ['Pro', 'Pro Performance', 'GTX'] },

  'ID.7': { from: 2024, to: 2026, bodyType: 'Sedan', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Pro S 86 kWh 210 kW (286 PS)', 'GTX 86 kWh AWD 250 kW (340 PS)'] },
  ], packages: ['Pro S', 'GTX'] },

  Caddy: { from: 2010, to: 2026, bodyType: 'MPV', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TSI 105 HP MT5', '1.4 TSI DSG 125 PS'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 102 HP MT5', '1.6 TDI DSG 102 HP', '2.0 TDI 102 PS MT5', '2.0 TDI DSG 140 PS'] },
    { from: 2021, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 TDI 102 PS MT6', '2.0 TDI DSG 122 PS'] },
  ], packages: ['Trendline', 'Comfortline', 'Highline', 'Impression', 'Life', 'Style', 'Maxi'] },

  'Caddy Cargo': { from: 2010, to: 2026, bodyType: 'Panelvan', drives: [
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 TDI 102 HP MT5', '2.0 TDI 102 PS MT5', '2.0 TDI DSG 140 PS'] },
    { from: 2021, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 TDI 102 PS MT6', '2.0 TDI DSG 122 PS'] },
  ], packages: ['Cargo', 'Cargo Maxi', 'Business'] },

  Transporter: { from: 2010, to: 2026, bodyType: 'Panelvan', drives: [
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 TDI 102 PS MT5', '2.0 TDI 140 PS MT6', '2.0 BiTDI DSG 180 PS'] },
    { from: 2016, to: 2024, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 TDI 110 PS MT5', '2.0 TDI 150 PS MT6', '2.0 TDI DSG 150 PS', '2.0 BiTDI DSG 199 PS'] },
    { from: 2025, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 TDI 110 PS MT6', '2.0 TDI DSG 150 PS', '2.0 TDI DSG 4Motion 170 PS'] },
    { from: 2025, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['64 kWh 100 kW', '64 kWh 160 kW'] },
  ], packages: ['Panelvan', 'City Van', 'L2H1', 'L2H2', 'Business'] },

  Caravelle: { from: 2010, to: 2026, bodyType: 'MPV', drives: [
    { to: 2024, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 TDI 140 PS MT6', '2.0 TDI DSG 150 PS', '2.0 BiTDI DSG 199 PS'] },
    { from: 2025, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 150 PS', '2.0 TDI DSG 4Motion 170 PS'] },
  ], packages: ['Trendline', 'Comfortline', 'Highline', 'Business', 'Long'] },

  Multivan: { from: 2010, to: 2026, bodyType: 'MPV', drives: [
    { to: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI DSG 150 PS', '2.0 BiTDI DSG 199 PS'] },
    { from: 2022, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 TSI DSG 136 PS', '2.0 TSI DSG 204 PS'] },
    { from: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 TSI eHybrid DSG PHEV 218 PS', '1.5 TSI eHybrid DSG PHEV 245 PS'] },
  ], packages: ['Comfortline', 'Highline', 'Life', 'Style', 'Energetic', 'Long'] },

  'ID. Buzz': { from: 2023, to: 2026, bodyType: 'MPV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Pro 77 kWh 150 kW', 'Pro 79 kWh 210 kW', 'GTX 79 kWh AWD 250 kW'] },
  ], packages: ['Pro', 'Pro Long', 'GTX', 'Cargo'] },

  Amarok: { from: 2011, to: 2026, bodyType: 'Pickup', drives: [
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 TDI 140 PS MT6', '2.0 BiTDI 180 PS MT6', '2.0 BiTDI AT8 180 PS', '3.0 V6 TDI AT8 224 PS', '3.0 V6 TDI AT8 258 PS'] },
    { from: 2023, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDI AT10 205 PS', '3.0 V6 TDI AT10 240 PS'] },
  ], packages: ['Trendline', 'Comfortline', 'Highline', 'Canyon', 'Aventura', 'Style', 'PanAmericana'] },

  Crafter: { from: 2010, to: 2026, bodyType: 'Panelvan', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 TDI 109 PS MT6', '2.0 TDI 136 PS MT6', '2.0 TDI 140 PS MT6', '2.0 TDI AT8 177 PS'] },
  ], packages: ['Panelvan', 'Minibüs', 'Servis', 'Kamyonet', 'L3H2', 'L4H3'] },
};
