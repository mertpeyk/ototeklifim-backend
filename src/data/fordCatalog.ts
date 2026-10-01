export type FordDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'LPG' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type FordModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Station Wagon' | 'MPV' | 'SUV' | 'Pick-Up' | 'Coupe' | 'Commercial Vehicle';
  drives: FordDrive[];
  packages: string[];
};

// Ford Türkiye and common European-import range normalized for valuation.
// Dedicated EV nameplates prevent electric powertrains from inheriting the
// petrol/diesel/manual rows of similarly named combustion models.
export const fordCatalog: Record<string, FordModel> = {
  Ka: { from: 2010, to: 2016, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 Duratec 69'] },
    { to: 2014, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 TDCi 75'] },
  ], packages: ['Trend', 'Titanium', 'Metal Ka'] },
  'Ka+': { from: 2016, to: 2019, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 Ti-VCT 70', '1.2 Ti-VCT 85'] },
    { from: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 TDCi 95'] },
  ], packages: ['Essential', 'Ultimate', 'Active'] },
  Fiesta: { from: 2010, to: 2023, bodyType: 'Hatchback', drives: [
    { to: 2017, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.25 Duratec 82', '1.0 EcoBoost 100', '1.0 EcoBoost 125', '1.6 Ti-VCT 120'] },
    { to: 2017, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 Ti-VCT PowerShift 105'] },
    { to: 2017, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 TDCi 70', '1.5 TDCi 75', '1.6 TDCi 95'] },
    { from: 2018, to: 2023, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 EcoBoost 100', '1.0 EcoBoost 125', '1.5 EcoBoost ST 200'] },
    { from: 2018, to: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 EcoBoost 100 Powershift', '1.0 EcoBoost 125 DCT'] },
    { from: 2018, to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 TDCi 85', '1.5 EcoBlue 120'] },
    { from: 2020, to: 2023, fuel: 'Hibrit', transmissions: ['Manuel'], engines: ['1.0 EcoBoost mHEV 125', '1.0 EcoBoost mHEV 155'] },
  ], packages: ['Ambiente', 'Trend', 'Trend X', 'Titanium', 'Titanium X', 'Active', 'ST-Line', 'ST-Line X', 'Vignale', 'ST'] },
  'B-Max': { from: 2012, to: 2017, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 EcoBoost 100', '1.0 EcoBoost 125', '1.4 Duratec 90'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 Ti-VCT PowerShift 105'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 TDCi 75', '1.6 TDCi 95'] },
  ], packages: ['Trend', 'Titanium', 'Titanium X'] },
  Focus: { from: 2010, to: 2025, bodyType: 'Hatchback', drives: [
    { to: 2018, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 Ti-VCT 125', '1.0 EcoBoost 125', '1.5 EcoBoost 150'] },
    { to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 Ti-VCT PowerShift 125', '1.5 EcoBoost AT6 150'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 TDCi 95', '1.6 TDCi 115', '1.5 TDCi 120'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 TDCi PowerShift 120', '2.0 TDCi PowerShift 150'] },
    { from: 2019, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 EcoBoost 125', '1.5 EcoBoost 150'] },
    { from: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 EcoBoost DCT 125', '1.5 EcoBoost AT8 150'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 EcoBlue 120'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 EcoBlue AT8 120', '2.0 EcoBlue AT8 150'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Manuel'], engines: ['1.0 EcoBoost mHEV 125', '1.0 EcoBoost mHEV 155'] },
  ], packages: ['Ambiente', 'Trend', 'Trend X', 'Style', 'Titanium', 'Titanium X', 'Active', 'Active X', 'ST-Line', 'ST-Line X', 'Vignale', 'ST'] },
  'Focus Sedan': { from: 2010, to: 2022, bodyType: 'Sedan', drives: [
    { to: 2018, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 Ti-VCT 125', '1.0 EcoBoost 125'] },
    { to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 Ti-VCT PowerShift 125'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 TDCi 95', '1.6 TDCi 115', '1.5 TDCi 120'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 TDCi PowerShift 120'] },
    { from: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 EcoBoost AT8 150'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 EcoBlue 120'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 EcoBlue AT8 120'] },
  ], packages: ['Trend', 'Trend X', 'Style', 'Titanium', 'Titanium X', 'ST-Line'] },
  'Focus Station Wagon': { from: 2010, to: 2025, bodyType: 'Station Wagon', drives: [
    { to: 2018, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 EcoBoost 125', '1.6 Ti-VCT 125'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 TDCi 115', '1.5 TDCi 120'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 TDCi PowerShift 120'] },
    { from: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 EcoBoost DCT 125', '1.5 EcoBoost AT8 150'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 EcoBlue 120'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 EcoBlue AT8 120', '2.0 EcoBlue AT8 150'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Manuel'], engines: ['1.0 EcoBoost mHEV 125', '1.0 EcoBoost mHEV 155'] },
  ], packages: ['Trend', 'Titanium', 'Active', 'ST-Line', 'Vignale'] },
  'C-Max': { from: 2010, to: 2019, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 EcoBoost 125', '1.6 Ti-VCT 125', '1.5 EcoBoost 150'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 Ti-VCT PowerShift 125'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 TDCi 115', '1.5 TDCi 120'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 TDCi PowerShift 120', '2.0 TDCi PowerShift 150'] },
  ], packages: ['Trend', 'Titanium', 'Titanium X'] },
  'Grand C-Max': { from: 2010, to: 2019, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 EcoBoost 125', '1.6 Ti-VCT 125', '1.5 EcoBoost 150'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 TDCi 115', '1.5 TDCi 120'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 TDCi PowerShift 120', '2.0 TDCi PowerShift 150'] },
  ], packages: ['Trend', 'Titanium', 'Titanium X'] },
  Mondeo: { from: 2010, to: 2022, bodyType: 'Sedan', drives: [
    { to: 2014, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 EcoBoost 160'] },
    { to: 2014, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 EcoBoost PowerShift 203', '2.0 EcoBoost PowerShift 240'] },
    { to: 2014, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 TDCi 115', '2.0 TDCi 140'] },
    { to: 2014, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDCi PowerShift 163'] },
    { from: 2015, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 EcoBoost AT6 160', '2.0 EcoBoost AT6 240'] },
    { from: 2015, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 TDCi 120', '2.0 TDCi 150'] },
    { from: 2015, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 TDCi PowerShift 120', '2.0 TDCi PowerShift 180', '2.0 EcoBlue AT8 190'] },
    { from: 2015, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.0 Hybrid eCVT 187'] },
  ], packages: ['Trend', 'Style', 'Titanium', 'Titanium X', 'Vignale', 'ST-Line'] },
  'S-Max': { from: 2010, to: 2023, bodyType: 'MPV', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 EcoBoost AT6 160', '2.0 EcoBoost PowerShift 240'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 TDCi 150', '2.0 EcoBlue 150'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDCi PowerShift 180', '2.0 EcoBlue AT8 190'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.5 Duratec Hybrid eCVT 190'] },
  ], packages: ['Trend', 'Titanium', 'ST-Line', 'Vignale'] },
  Galaxy: { from: 2010, to: 2023, bodyType: 'MPV', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 EcoBoost AT6 160', '2.0 EcoBoost PowerShift 240'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 TDCi 150', '2.0 EcoBlue 150'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDCi PowerShift 180', '2.0 EcoBlue AT8 190'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.5 Duratec Hybrid eCVT 190'] },
  ], packages: ['Trend', 'Titanium', 'Vignale'] },
  EcoSport: { from: 2014, to: 2022, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 EcoBoost 100', '1.0 EcoBoost 125', '1.5 Ti-VCT 112'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 Ti-VCT PowerShift 112', '1.0 EcoBoost AT6 125'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 TDCi 95', '1.5 TDCi 100', '1.5 EcoBlue 125'] },
  ], packages: ['Trend', 'Titanium', 'Titanium S', 'ST-Line'] },
  Puma: { from: 2020, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 EcoBoost 125', '1.5 EcoBoost ST 200'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 EcoBoost DCT 125'] },
    { fuel: 'Hibrit', transmissions: ['Manuel'], engines: ['1.0 EcoBoost mHEV 125', '1.0 EcoBoost mHEV 155'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.0 EcoBoost mHEV DCT 125', '1.0 EcoBoost mHEV DCT 155'] },
  ], packages: ['Style', 'Titanium', 'Titanium X', 'ST-Line', 'ST-Line X', 'Vignale', 'ST'] },
  'Puma Gen-E': { from: 2025, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['123 kW 43 kWh'] },
  ], packages: ['Select', 'Premium'] },
  Kuga: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2012, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 TDCi 140 AWD'] },
    { to: 2012, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDCi PowerShift 163 AWD'] },
    { from: 2013, to: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 EcoBoost AT6 182 AWD', '1.6 EcoBoost AT6 182 AWD'] },
    { from: 2013, to: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 TDCi 120', '2.0 TDCi 150 AWD'] },
    { from: 2013, to: 2019, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 TDCi PowerShift 120', '2.0 TDCi PowerShift 180 AWD'] },
    { from: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.5 EcoBoost 150'] },
    { from: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 EcoBlue AT8 120', '2.0 EcoBlue mHEV 150'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.5 Duratec FHEV eCVT 190', '2.5 Duratec PHEV eCVT 225', '2.5 Duratec PHEV eCVT 243'] },
  ], packages: ['Trend', 'Titanium', 'Titanium X', 'ST-Line', 'ST-Line X', 'Vignale', 'Active', 'Active X'] },
  Edge: { from: 2016, to: 2019, bodyType: 'SUV', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 TDCi 180 AWD'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 TDCi PowerShift 210 AWD'] },
  ], packages: ['Trend', 'Titanium', 'Sport', 'Vignale'] },
  Explorer: { from: 2020, to: 2023, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['3.0 EcoBoost PHEV AT10 457 AWD'] },
  ], packages: ['ST-Line', 'Platinum'] },
  'Explorer EV': { from: 2024, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['125 kW Standard Range', '210 kW Extended Range', '250 kW AWD'] },
  ], packages: ['Style', 'Select', 'Premium'] },
  'Capri EV': { from: 2025, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['125 kW Standard Range', '210 kW Extended Range', '250 kW AWD'] },
  ], packages: ['Select', 'Premium'] },
  Mustang: { from: 2015, to: 2026, bodyType: 'Coupe', drives: [
    { to: 2023, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.3 EcoBoost 317', '5.0 V8 GT 421', '5.0 V8 GT 450'] },
    { to: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.3 EcoBoost AT10 290', '5.0 V8 GT AT10 450'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['5.0 V8 GT 446', '5.0 V8 Dark Horse 453'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['5.0 V8 GT AT10 446', '5.0 V8 Dark Horse AT10 453'] },
  ], packages: ['Fastback', 'Convertible', 'GT', 'GT Premium', 'Mach 1', 'Dark Horse'] },
  'Mustang Mach-E': { from: 2021, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['198 kW Standard Range RWD', '216 kW Extended Range RWD', '258 kW Extended Range AWD', '358 kW GT AWD'] },
  ], packages: ['Select', 'Premium', 'GT'] },
  Ranger: { from: 2010, to: 2026, bodyType: 'Pick-Up', drives: [
    { to: 2011, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.5 TDCi 143 4x4', '3.0 TDCi 156 4x4'] },
    { from: 2012, to: 2022, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 TDCi 150 4x4', '2.2 TDCi 160 4x4'] },
    { from: 2012, to: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 TDCi AT6 160 4x4', '3.2 TDCi AT6 200 4x4', '2.0 EcoBlue Bi-Turbo AT10 213 4x4'] },
    { from: 2023, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 EcoBlue 170 4x4'] },
    { from: 2023, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 EcoBlue AT6 170 4x4', '2.0 EcoBlue Bi-Turbo AT10 205 4x4', '3.0 V6 EcoBlue AT10 240 4x4'] },
    { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.3 EcoBoost PHEV AT10 281 4x4'] },
  ], packages: ['XL', 'XLT', 'Limited', 'Wildtrak', 'Stormtrak', 'Platinum', 'Raptor'] },
  'Tourneo Courier': { from: 2014, to: 2026, bodyType: 'MPV', drives: [
    { to: 2023, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 EcoBoost 100'] },
    { to: 2023, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 TDCi 75', '1.5 TDCi 100', '1.5 EcoBlue 100'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 EcoBoost 125'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 EcoBoost DCT 125'] },
  ], packages: ['Journey', 'Deluxe', 'Titanium', 'Active', 'Sport'] },
  'E-Tourneo Courier': { from: 2025, to: 2026, bodyType: 'MPV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['100 kW 43 kWh'] },
  ], packages: ['Trend', 'Titanium', 'Active'] },
  'Tourneo Connect': { from: 2010, to: 2026, bodyType: 'MPV', drives: [
    { to: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.8 TDCi 75', '1.8 TDCi 90', '1.8 TDCi 110'] },
    { from: 2014, to: 2021, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 EcoBoost 100'] },
    { from: 2014, to: 2021, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 TDCi 100', '1.5 TDCi 120', '1.5 EcoBlue 120'] },
    { from: 2018, to: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 EcoBlue AT8 120'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 EcoBlue 102', '2.0 EcoBlue 122'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 EcoBlue DSG 122'] },
    { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 EcoBoost PHEV DSG 150'] },
  ], packages: ['Style', 'Trend', 'Titanium', 'Active', 'Grand Tourneo'] },
  'Tourneo Custom': { from: 2013, to: 2026, bodyType: 'MPV', drives: [
    { to: 2017, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 TDCi 100', '2.2 TDCi 125', '2.2 TDCi 155'] },
    { from: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 EcoBlue 130', '2.0 EcoBlue 170'] },
    { from: 2018, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 EcoBlue AT6 170', '2.0 EcoBlue AT8 170'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.0 EcoBoost PHEV eCVT 126', '2.5 Duratec PHEV eCVT 233'] },
  ], packages: ['Trend', 'Titanium', 'Titanium X', 'Active', 'Sport', 'Business'] },
  'E-Tourneo Custom': { from: 2024, to: 2026, bodyType: 'MPV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['160 kW 64 kWh'] },
  ], packages: ['Titanium', 'Titanium X', 'Active', 'Sport'] },
  'Transit Courier': { from: 2014, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2023, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 EcoBoost 100'] },
    { to: 2023, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 TDCi 75', '1.5 TDCi 100', '1.5 EcoBlue 100'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 EcoBoost 125'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 EcoBoost DCT 125'] },
    { from: 2024, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 EcoBlue 100'] },
  ], packages: ['Base', 'Trend', 'Deluxe', 'Van'] },
  'E-Transit Courier': { from: 2025, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['100 kW 43 kWh'] },
  ], packages: ['Base', 'Trend', 'Limited'] },
  'Transit Connect': { from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.8 TDCi 75', '1.8 TDCi 90', '1.8 TDCi 110'] },
    { from: 2014, to: 2021, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 EcoBoost 100'] },
    { from: 2014, to: 2021, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 TDCi 75', '1.5 TDCi 100', '1.5 EcoBlue 120'] },
    { from: 2018, to: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 EcoBlue AT8 120'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 EcoBlue 102', '2.0 EcoBlue 122'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 EcoBlue DSG 122'] },
    { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 EcoBoost PHEV DSG 150'] },
  ], packages: ['Base', 'Trend', 'Limited', 'Active', 'Van', 'Kombi'] },
  'Transit Custom': { from: 2013, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2017, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 TDCi 100', '2.2 TDCi 125', '2.2 TDCi 155'] },
    { from: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 EcoBlue 105', '2.0 EcoBlue 130', '2.0 EcoBlue 170'] },
    { from: 2018, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 EcoBlue AT6 130', '2.0 EcoBlue AT8 170'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.0 EcoBoost PHEV eCVT 126', '2.5 Duratec PHEV eCVT 233'] },
  ], packages: ['Base', 'Trend', 'Limited', 'Sport', 'Van', 'Kombi'] },
  'E-Transit Custom': { from: 2024, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['100 kW 64 kWh', '160 kW 64 kWh'] },
  ], packages: ['Base', 'Trend', 'Limited', 'Sport'] },
  Transit: { from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 TDCi 100', '2.2 TDCi 125', '2.4 TDCi 140'] },
    { from: 2014, to: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 TDCi 100', '2.2 TDCi 125', '2.2 TDCi 155'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 EcoBlue 105', '2.0 EcoBlue 130', '2.0 EcoBlue 170'] },
    { from: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 EcoBlue AT10 170'] },
  ], packages: ['Van', 'Kombi', 'Minibüs', 'Şasi Kabin', 'Kamyonet', 'Jumbo'] },
  'E-Transit': { from: 2022, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['135 kW 68 kWh', '198 kW 89 kWh'] },
  ], packages: ['Van', 'Şasi Kabin', 'Trend', 'Limited'] },
};
