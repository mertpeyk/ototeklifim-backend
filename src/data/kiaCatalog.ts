export type KiaDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type KiaModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Station Wagon' | 'Coupe' | 'SUV' | 'MPV' | 'Pickup';
  drives: KiaDrive[];
  packages: string[];
};

// Türkiye-facing Kia catalog for valuation flows. Year-bounded drive rows
// prevent discontinued engines and nameplates from leaking into later years.
export const kiaCatalog: Record<string, KiaModel> = {
  Picanto: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2011, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 MPI 62', '1.1 MPI 65'] },
    { to: 2011, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.1 MPI AT4 65'] },
    { from: 2012, to: 2017, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 MPI 69', '1.25 MPI 85'] },
    { from: 2012, to: 2017, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.25 MPI AT4 85'] },
    { from: 2018, to: 2023, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 MPI 67'] },
    { from: 2018, to: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 MPI AMT 67', '1.25 MPI AT4 84'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 DPI AMT 63', '1.2 DPI AMT 79'] },
  ], packages: ['Comfort', 'Cool', 'Trendy', 'Feel', 'Live', 'Prestige', 'GT-Line'] },

  'Rio Hatchback': { from: 2010, to: 2023, bodyType: 'Hatchback', drives: [
    { to: 2011, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 CVVT 97'] },
    { to: 2011, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 CVVT AT4 97'] },
    { to: 2011, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 CRDi 110'] },
    { from: 2012, to: 2017, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.25 CVVT 85', '1.4 CVVT 109'] },
    { from: 2012, to: 2017, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 CVVT AT4 109'] },
    { from: 2012, to: 2017, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.1 CRDi 75', '1.4 CRDi 90'] },
    { from: 2018, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.25 MPI 84', '1.0 T-GDI 100'] },
    { from: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 MPI AT6 100', '1.0 T-GDI DCT 100', '1.0 T-GDI DCT 120'] },
    { from: 2018, to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 CRDi 90'] },
    { from: 2018, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.4 CRDi DCT 90'] },
  ], packages: ['Comfort', 'Concept', 'Concept Plus', 'Cool', 'Fancy', 'Elegance', 'Prestige'] },

  'Rio Sedan': { from: 2010, to: 2017, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 CVVT 97', '1.4 CVVT 109'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 CVVT AT4 97', '1.4 CVVT AT4 109'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 CRDi 110', '1.4 CRDi 90'] },
  ], packages: ['Comfort', 'Concept', 'Concept Plus', 'Fancy'] },

  'Ceed Hatchback': { from: 2010, to: 2025, bodyType: 'Hatchback', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 CVVT 126'] },
    { to: 2012, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 CVVT AT4 126'] },
    { to: 2012, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 CRDi 90', '1.6 CRDi 115'] },
    { to: 2012, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 CRDi AT4 115'] },
    { from: 2013, to: 2018, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 GDI 135'] },
    { from: 2013, to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 GDI DCT 135'] },
    { from: 2013, to: 2021, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 CRDi 128', '1.6 CRDi 136'] },
    { from: 2013, to: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 CRDi DCT 128', '1.6 CRDi DCT 136'] },
    { from: 2019, to: 2021, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 T-GDI 120'] },
    { from: 2019, to: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 T-GDI DCT 140'] },
    { from: 2022, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 T-GDI DCT 160'] },
    { from: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 CRDi MHEV DCT 136'] },
  ], packages: ['Cool', 'Concept', 'Concept Plus', 'Elegance', 'Prestige', 'Premium', 'GT-Line'] },

  'Ceed SW': { from: 2010, to: 2025, bodyType: 'Station Wagon', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 CVVT 126'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 CRDi 115', '1.6 CRDi 128', '1.6 CRDi 136'] },
    { to: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 CRDi DCT 128', '1.6 CRDi DCT 136'] },
    { from: 2013, to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 GDI DCT 135'] },
    { from: 2019, to: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 T-GDI DCT 140'] },
    { from: 2022, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 T-GDI DCT 160'] },
    { from: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 CRDi MHEV DCT 136'] },
  ], packages: ['Concept', 'Concept Plus', 'Elegance', 'Prestige', 'Premium', 'GT-Line'] },

  ProCeed: { from: 2019, to: 2024, bodyType: 'Station Wagon', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 T-GDI DCT 140', '1.5 T-GDI DCT 160', '1.6 T-GDI DCT 204'] },
    { to: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 CRDi DCT 136'] },
  ], packages: ['GT-Line', 'GT'] },

  XCeed: { from: 2020, to: 2025, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 T-GDI DCT 120', '1.4 T-GDI DCT 140', '1.5 T-GDI DCT 160'] },
    { to: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 CRDi DCT 136'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 GDI PHEV DCT 141'] },
  ], packages: ['Cool', 'Elegance', 'Prestige', 'GT-Line'] },

  Cerato: { from: 2010, to: 2022, bodyType: 'Sedan', drives: [
    { to: 2013, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 CVVT 126'] },
    { to: 2013, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 CVVT AT4 126'] },
    { from: 2014, to: 2018, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 GDI 130'] },
    { from: 2014, to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 GDI AT6 130'] },
    { from: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 MPI AT6 128'] },
  ], packages: ['Comfort', 'Concept', 'Concept Plus', 'Elegance', 'Prestige'] },

  Venga: { from: 2010, to: 2018, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 CVVT 90', '1.6 CVVT 125'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 CVVT AT4 125'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 CRDi 90', '1.6 CRDi 115'] },
  ], packages: ['Comfort', 'Concept', 'Concept Plus', 'Premium'] },

  Carens: { from: 2010, to: 2018, bodyType: 'MPV', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.0 CVVT 145'] },
    { to: 2012, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 CRDi 140'] },
    { from: 2013, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 GDI 135'] },
    { from: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.7 CRDi 115'] },
    { from: 2013, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.7 CRDi DCT 141'] },
  ], packages: ['Comfort', 'Concept', 'Concept Plus', 'Premium'] },

  Soul: { from: 2010, to: 2019, bodyType: 'SUV', drives: [
    { to: 2013, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 CVVT 124'] },
    { to: 2013, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 CVVT AT6 124'] },
    { to: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 CRDi 128'] },
    { from: 2014, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 GDI DCT 132'] },
    { from: 2014, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 CRDi DCT 136'] },
  ], packages: ['Cool', 'Concept', 'Concept Plus', 'Premium', 'X-Line'] },

  'Soul EV': { from: 2015, to: 2019, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['81 kW 27 kWh', '81 kW 30 kWh'] },
  ], packages: ['EV', 'Premium'] },

  Optima: { from: 2012, to: 2020, bodyType: 'Sedan', drives: [
    { to: 2015, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 CVVL AT6 165'] },
    { from: 2016, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.7 CRDi DCT 141'] },
    { from: 2017, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.0 GDI HEV AT6 205', '2.0 GDI PHEV AT6 205'] },
  ], packages: ['Prestige', 'Premium', 'Executive', 'GT-Line'] },

  Stinger: { from: 2018, to: 2023, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 T-GDI AT8 255', '3.3 T-GDI V6 AWD AT8 370'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 CRDi AT8 200'] },
  ], packages: ['GT-Line', 'GT', 'GT AWD'] },

  Stonic: { from: 2018, to: 2026, bodyType: 'SUV', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.25 MPI 84', '1.0 T-GDI 120'] },
    { to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 T-GDI DCT 120'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 CRDi 110', '1.6 CRDi 115'] },
    { to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 CRDi DCT 115'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 DPI 84'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 T-GDI DCT 100'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.0 T-GDI MHEV DCT 100', '1.0 T-GDI MHEV DCT 120'] },
  ], packages: ['Cool', 'Elegance', 'Prestige', 'GT-Line'] },

  Sportage: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2015, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 GDI 135'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.7 CRDi 115', '2.0 CRDi 136'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 CRDi AT6 136', '2.0 CRDi AWD AT6 184'] },
    { from: 2016, to: 2021, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 GDI 132'] },
    { from: 2016, to: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 T-GDI DCT 177'] },
    { from: 2016, to: 2021, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 CRDi 115', '1.6 CRDi 136'] },
    { from: 2016, to: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 CRDi DCT 136', '2.0 CRDi AT8 185'] },
    { from: 2022, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 T-GDI DCT 150', '1.6 T-GDI DCT 180'] },
    { from: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 T-GDI HEV AT6 230', '1.6 T-GDI PHEV AT6 265'] },
  ], packages: ['Cool', 'Concept', 'Concept Plus', 'Elegance', 'Prestige', 'Premium', 'GT-Line'] },

  Sorento: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2014, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 CRDi 150', '2.2 CRDi 197'] },
    { to: 2014, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 CRDi AWD AT6 197'] },
    { from: 2015, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 CRDi AT6 185', '2.2 CRDi AWD AT8 200'] },
    { from: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 CRDi AWD DCT 202'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 T-GDI HEV AT6 230', '1.6 T-GDI PHEV AWD AT6 265'] },
  ], packages: ['Concept', 'Concept Plus', 'Prestige', 'Premium', 'Executive', 'GT-Line'] },

  'Niro Hybrid': { from: 2017, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 GDI HEV DCT 141'] },
  ], packages: ['Elegance', 'Prestige'] },
  'Niro PHEV': { from: 2018, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 GDI PHEV DCT 141', '1.6 GDI PHEV DCT 183'] },
  ], packages: ['Elegance', 'Prestige'] },
  'Niro EV': { from: 2019, to: 2026, bodyType: 'SUV', drives: [
    { to: 2022, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['100 kW 39.2 kWh', '150 kW 64 kWh'] },
    { from: 2023, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['150 kW 64.8 kWh 2WD'] },
  ], packages: ['Elegance', 'Prestige'] },

  EV6: { from: 2022, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['125 kW 58 kWh RWD', '168 kW 77.4 kWh RWD', '239 kW 77.4 kWh AWD', '430 kW 77.4 kWh GT AWD'] },
  ], packages: ['Elegance', 'Prestige', 'GT-Line', 'GT'] },
  EV9: { from: 2024, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['149.5 kW 99.8 kWh 2WD', '283 kW 99.8 kWh AWD'] },
  ], packages: ['Prestige 2WD', 'GT-Line AWD'] },
  EV3: { from: 2025, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['150 kW 58.3 kWh Standard Range', '150 kW 81.4 kWh Long Range'] },
  ], packages: ['Elegance Standard Range', 'Elegance Long Range', 'GT-Line Long Range'] },

  Carnival: { from: 2010, to: 2026, bodyType: 'MPV', drives: [
    { to: 2015, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 CRDi AT6 197'] },
    { from: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 CRDi AT8 202'] },
    { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 T-GDI HEV AT6 245'] },
  ], packages: ['Comfort', 'Prestige', 'Premium', 'Executive'] },

  Bongo: { from: 2010, to: 2026, bodyType: 'Pickup', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.5 CRDi 130', '2.5 CRDi 133'] },
  ], packages: ['K2500 Tek Kabin', 'K2500 Çift Kabin', 'K2700', 'K2900'] },
};
