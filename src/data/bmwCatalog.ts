export type BmwDrive = {
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
  from?: number;
  to?: number;
};

export type BmwModel = {
  from: number;
  to: number;
  bodyType: string;
  drives: BmwDrive[];
  packages: string[];
};

// Turkey-facing canonical BMW nameplates for model years 2010-2026. Historic
// generation-coded rows remain available under their original source names;
// these entries power the clean model selector used by valuation flows.
export const bmwCatalog: Record<string, BmwModel> = {
  '1 Serisi': { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['116i', '118i', '120i', '125i', 'M135i xDrive', '120 Mild Hybrid'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['116d', '118d', '120d', '125d'], to: 2024 },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['120 Mild Hybrid'], from: 2024 },
  ], packages: ['Joy', 'Sport Line', 'Urban Line', 'Luxury Line', 'M Sport', 'Edition M Sport'] },
  '2 Serisi': { from: 2012, to: 2026, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['216i Gran Tourer', '218i', '220i', '220 Gran Coupe', '230i', 'M235i xDrive', 'M240i xDrive'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['216d', '218d', '220d'], to: 2024 },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['220i Active Tourer Mild Hybrid', '225e xDrive Active Tourer', '230e xDrive Active Tourer'], from: 2022 },
  ], packages: ['Joy', 'Sport Line', 'Luxury Line', 'M Sport', 'Edition M Sport'] },
  '2 Serisi Gran Coupe': { from: 2020, to: 2026, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['218i Gran Coupe', '220 Gran Coupe', 'M235i xDrive'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['216d Gran Coupe', '218d Gran Coupe', '220d Gran Coupe'], to: 2024 },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['220 Gran Coupe Mild Hybrid'], from: 2025 },
  ], packages: ['Sport Line', 'Luxury Line', 'M Sport', 'Edition M Sport'] },
  '3 Serisi': { from: 2010, to: 2026, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['316i', '318i', '320i', '328i', '330i', '335i', '340i xDrive'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['316d', '318d', '320d', '325d', '330d', '335d xDrive'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['ActiveHybrid 3', '330e'], from: 2012 },
  ], packages: ['Joy', 'Sport Line', 'Modern Line', 'Luxury Line', 'M Sport', '40. Yıl', 'Edition M Sport'] },
  '4 Serisi': { from: 2013, to: 2026, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['418i', '420i', '428i', '430i xDrive', '435i', '440i xDrive'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['418d', '420d', '425d', '430d', '435d xDrive'], to: 2024 },
  ], packages: ['Sport Line', 'Luxury Line', 'M Sport', 'Edition M Sport'] },
  '5 Serisi': { from: 2010, to: 2026, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['520i', '523i', '528i', '530i', '535i', '540i xDrive', '550i xDrive'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['518d', '520d', '525d', '530d', '535d', 'M550d xDrive'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['ActiveHybrid 5', '530e', '545e xDrive', '520i Mild Hybrid', '520d Mild Hybrid'], from: 2011 },
  ], packages: ['Comfort', 'Business', 'Premium', 'Luxury Line', 'M Sport', 'Edition M Sport'] },
  '6 Serisi': { from: 2010, to: 2023, bodyType: 'Gran Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['620i Gran Turismo', '630i', '640i', '650i xDrive'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['620d Gran Turismo', '630d', '640d xDrive'] },
  ], packages: ['Comfort', 'Luxury Line', 'M Sport', 'Edition M Sport'] },
  '7 Serisi': { from: 2010, to: 2026, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['730i', '740i', '740Li', '750i xDrive', '760Li xDrive', '740 xDrive Mild Hybrid'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['730d', '740d xDrive', '750d xDrive'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['740e', '745e', '750e xDrive', 'M760e xDrive'], from: 2016 },
  ], packages: ['Pure Excellence', 'Luxury Line', 'M Sport', 'M Excellence'] },
  '8 Serisi': { from: 2018, to: 2026, bodyType: 'Gran Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['840i xDrive', 'M850i xDrive'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['840d xDrive'], to: 2024 },
  ], packages: ['Pure Excellence', 'M Sport', 'Edition M Sport'] },
  Z4: { from: 2010, to: 2026, bodyType: 'Roadster', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['sDrive18i', 'sDrive20i', 'sDrive23i', 'sDrive28i', 'sDrive30i', 'sDrive35i', 'M40i'] },
  ], packages: ['sDrive', 'Sport Line', 'M Sport', 'Edition M Sport'] },
  X1: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['sDrive16i', 'sDrive18i', 'sDrive20i', 'xDrive20i', 'xDrive23i', 'M35i xDrive'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['sDrive16d', 'sDrive18d', 'sDrive20d', 'xDrive20d', 'xDrive25d'], to: 2024 },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['xDrive25e', 'xDrive30e', 'xDrive20i Mild Hybrid'], from: 2020 },
  ], packages: ['Joy', 'Sport Line', 'xLine', 'Luxury Line', 'M Sport'] },
  X2: { from: 2018, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['sDrive18i', 'sDrive20i', 'xDrive20i', 'M35i xDrive'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['sDrive18d', 'xDrive20d', 'xDrive25d'], to: 2023 },
  ], packages: ['Advantage', 'xLine', 'M Sport', 'M Sport X'] },
  X3: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['sDrive20i', 'xDrive20i', 'xDrive28i', 'xDrive30i', 'M40i xDrive'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['sDrive18d', 'xDrive20d', 'xDrive30d', 'M40d xDrive'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['xDrive30e', '20 xDrive Mild Hybrid'], from: 2020 },
  ], packages: ['Comfort', 'xLine', 'Luxury Line', 'M Sport', 'Edition M Sport'] },
  X4: { from: 2014, to: 2026, bodyType: 'SUV Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['xDrive20i', 'xDrive28i', 'xDrive30i', 'M40i xDrive'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['xDrive20d', 'xDrive30d', 'M40d xDrive'] },
  ], packages: ['xLine', 'M Sport', 'Edition M Sport'] },
  X5: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['xDrive35i', 'xDrive40i', 'xDrive50i', 'M60i xDrive'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['xDrive25d', 'xDrive30d', 'xDrive40d', 'M50d'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['xDrive40e', 'xDrive45e', 'xDrive50e'], from: 2015 },
  ], packages: ['Premium', 'xLine', 'Exclusive', 'M Sport', 'Edition M Sport'] },
  X6: { from: 2010, to: 2026, bodyType: 'SUV Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['xDrive35i', 'xDrive40i', 'xDrive50i', 'M60i xDrive'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['xDrive30d', 'xDrive40d', 'M50d'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['ActiveHybrid X6'], from: 2010, to: 2011 },
  ], packages: ['Pure Extravagance', 'xLine', 'M Sport', 'Edition M Sport'] },
  X7: { from: 2019, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['xDrive40i', 'M60i xDrive'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['xDrive30d', 'xDrive40d', 'M50d'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['xDrive40i Mild Hybrid'], from: 2023 },
  ], packages: ['Pure Excellence', 'Design Pure Excellence', 'M Sport', 'M Excellence'] },
  i3: { from: 2013, to: 2022, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['i3 60 Ah', 'i3 94 Ah', 'i3 120 Ah', 'i3s 120 Ah'] },
  ], packages: ['Atelier', 'Loft', 'Lodge', 'Suite', 'i3s'] },
  i4: { from: 2021, to: 2026, bodyType: 'Gran Coupe', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['eDrive35', 'eDrive40', 'xDrive40', 'M50 xDrive', 'M60 xDrive'] },
  ], packages: ['eDrive', 'M Sport', 'Edition M Sport'] },
  i5: { from: 2023, to: 2026, bodyType: 'Sedan', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['eDrive40', 'xDrive40 Touring', 'M60 xDrive'] },
  ], packages: ['eDrive', 'M Sport', 'Edition M Sport'] },
  i7: { from: 2022, to: 2026, bodyType: 'Sedan', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['eDrive50', 'xDrive60', 'M70 xDrive'] },
  ], packages: ['Pure Excellence', 'M Sport', 'M Excellence'] },
  i8: { from: 2014, to: 2020, bodyType: 'Coupe', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['i8 Plug-in Hybrid', 'i8 Roadster Plug-in Hybrid'] },
  ], packages: ['Pure Impulse', 'Protonic Edition', 'Roadster'] },
  iX: { from: 2021, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['xDrive40', 'xDrive45', 'xDrive50', 'xDrive60', 'M60', 'M70 xDrive'] },
  ], packages: ['Essence', 'Sport', 'M Sport', 'First Edition'] },
  iX1: { from: 2022, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['eDrive20', 'xDrive30'] },
  ], packages: ['xLine', 'M Sport', 'Edition M Sport'] },
  iX2: { from: 2024, to: 2026, bodyType: 'SUV Coupe', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['eDrive20', 'xDrive30'] },
  ], packages: ['xLine', 'M Sport', 'Edition M Sport'] },
  iX3: { from: 2021, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['eDrive40', '50 xDrive'] },
  ], packages: ['Inspiring', 'Impressive', 'M Sport', 'Edition M Sport'] },
  M2: { from: 2016, to: 2026, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['M2', 'M2 Competition', 'M2 CS'] },
  ], packages: ['M', 'Competition', 'CS'] },
  M3: { from: 2010, to: 2026, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['M3', 'M3 Competition', 'M3 CS', 'M3 Competition xDrive'] },
  ], packages: ['M', 'Competition', 'CS'] },
  M4: { from: 2014, to: 2026, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['M4', 'M4 Competition', 'M4 CS', 'M4 Competition xDrive'] },
  ], packages: ['M', 'Competition', 'CS'] },
  M5: { from: 2010, to: 2026, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['M5', 'M5 Competition', 'M5 CS'], to: 2023 },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['M5 Plug-in Hybrid'], from: 2024 },
  ], packages: ['M', 'Competition', 'CS'] },
  M8: { from: 2019, to: 2026, bodyType: 'Gran Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['M8', 'M8 Competition'] },
  ], packages: ['M', 'Competition'] },
};
