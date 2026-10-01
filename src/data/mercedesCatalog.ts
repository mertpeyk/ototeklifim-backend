export type MercedesDrive = { from?: number; to?: number; fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik'; transmissions: Array<'Manuel' | 'Otomatik'>; engines: string[] };
export type MercedesModel = { from: number; to: number; bodyType: 'Hatchback' | 'Sedan' | 'Coupe' | 'Cabrio' | 'Station Wagon' | 'SUV' | 'MPV' | 'Panelvan'; drives: MercedesDrive[]; packages: string[] };

const compact = ['Style', 'Urban', 'AMG', 'AMG Line', 'Progressive', 'Edition 1', 'Night Edition'];
const executive = ['Classic', 'Elegance', 'Avantgarde', 'Exclusive', 'AMG', 'AMG Line', 'Edition 1', 'Business', 'Night Edition'];
const luxury = ['Luxury', 'Long', '4MATIC', 'AMG Line', 'Exclusive', 'Maybach'];
const suv = ['Style', 'Urban', 'Exclusive', 'AMG', 'AMG Line', 'Progressive', 'Premium', 'Night Edition'];
const amg = ['AMG', 'AMG S', 'Edition 1', 'Night Edition'];
const van = ['Base', 'Pro', 'Select', 'Comfort', 'Premium'];
const m = (from: number, to: number, bodyType: MercedesModel['bodyType'], drives: MercedesDrive[], packages: string[]): MercedesModel => ({ from, to, bodyType, drives, packages });
const d = (fuel: MercedesDrive['fuel'], engines: string[], from?: number, to?: number, transmissions: MercedesDrive['transmissions'] = ['Otomatik']): MercedesDrive => ({ fuel, engines, from, to, transmissions });

// Mercedes-Benz Türkiye-facing valuation catalog. Designations are exposed as
// models because Turkish used-car listings identify the vehicle primarily by
// A180/C200/E220d etc.; the actual powertrain remains a separate engine field.
export const mercedesCatalog: Record<string, MercedesModel> = {
  A160: m(2010, 2026, 'Hatchback', [d('Benzin', ['1.5 95', '1.6 Turbo 102'], 2010, 2018, ['Manuel', 'Otomatik']), d('Benzin', ['1.3 Turbo MHEV DCT 109'], 2023)], compact),
  A180: m(2010, 2026, 'Hatchback', [d('Benzin', ['1.6 116', '1.6 Turbo 122'], 2010, 2018, ['Manuel', 'Otomatik']), d('Dizel', ['1.5 CDI 109', '1.5 d DCT 116'], 2013, 2022, ['Manuel', 'Otomatik']), d('Benzin', ['1.3 Turbo MHEV DCT 136'], 2019)], compact),
  A200: m(2010, 2026, 'Hatchback', [d('Benzin', ['1.6 Turbo 156'], 2012, 2018, ['Manuel', 'Otomatik']), d('Dizel', ['1.8 CDI 136', '2.1 d DCT 136'], 2010, 2018, ['Manuel', 'Otomatik']), d('Benzin', ['1.3 Turbo MHEV DCT 163'], 2019)], compact),
  A250: m(2012, 2026, 'Hatchback', [d('Benzin', ['2.0 Turbo DCT 211'], 2012, 2018), d('Benzin', ['2.0 Turbo 4MATIC DCT 224'], 2019, 2022), d('Hibrit', ['1.3 A250e PHEV DCT 218'], 2020)], compact),
  'Mercedes-AMG A35': m(2019, 2026, 'Hatchback', [d('Benzin', ['2.0 Turbo 4MATIC DCT 306', '2.0 Turbo MHEV 4MATIC DCT 320'])], amg),
  'Mercedes-AMG A45': m(2013, 2026, 'Hatchback', [d('Benzin', ['2.0 Turbo 4MATIC DCT 360'], 2013, 2018), d('Benzin', ['2.0 Turbo 4MATIC+ DCT 421'], 2019)], amg),

  B160: m(2010, 2018, 'MPV', [d('Benzin', ['1.5 95', '1.6 Turbo 102'], undefined, undefined, ['Manuel', 'Otomatik'])], compact),
  B180: m(2010, 2022, 'MPV', [d('Benzin', ['1.7 116', '1.6 Turbo 122'], 2010, 2018, ['Manuel', 'Otomatik']), d('Dizel', ['1.5 CDI 109', '1.5 d DCT 116'], 2012, 2022, ['Manuel', 'Otomatik']), d('Benzin', ['1.3 Turbo DCT 136'], 2019, 2022)], compact),
  B200: m(2010, 2022, 'MPV', [d('Benzin', ['2.0 136', '1.6 Turbo 156'], 2010, 2018, ['Manuel', 'Otomatik']), d('Dizel', ['2.0 CDI 140', '2.1 d DCT 136'], 2010, 2018, ['Manuel', 'Otomatik']), d('Benzin', ['1.3 Turbo DCT 163'], 2019, 2022)], compact),

  C180: m(2010, 2026, 'Sedan', [d('Benzin', ['1.6 Kompressor 156', '1.6 Turbo 156'], 2010, 2014, ['Manuel', 'Otomatik']), d('Benzin', ['1.6 Turbo 156', '1.6 Turbo 9G 156'], 2015, 2021), d('Benzin', ['1.5 Turbo MHEV 9G 170'], 2022)], executive),
  C200: m(2010, 2026, 'Sedan', [d('Benzin', ['1.8 CGI 184'], 2010, 2014, ['Manuel', 'Otomatik']), d('Dizel', ['1.6 d 136', '1.6 BlueTEC 136'], 2014, 2020), d('Benzin', ['1.5 EQ Boost 9G 184'], 2018, 2021), d('Benzin', ['1.5 MHEV 4MATIC 9G 204'], 2022)], executive),
  C220d: m(2010, 2026, 'Sedan', [d('Dizel', ['2.1 CDI 170'], 2010, 2014, ['Manuel', 'Otomatik']), d('Dizel', ['2.1 BlueTEC 170', '2.0 d 9G 194'], 2015, 2021), d('Hibrit', ['2.0 d MHEV 9G 200'], 2022)], executive),
  C250: m(2010, 2018, 'Sedan', [d('Benzin', ['1.8 CGI 204', '2.0 Turbo 211']), d('Dizel', ['2.1 CDI 204'])], executive),
  C300: m(2015, 2026, 'Sedan', [d('Benzin', ['2.0 Turbo 9G 245', '2.0 MHEV 4MATIC 9G 258']), d('Hibrit', ['2.0 C300e PHEV 9G 313'], 2019)], executive),
  'Mercedes-AMG C43': m(2016, 2026, 'Sedan', [d('Benzin', ['3.0 V6 4MATIC 9G 390'], 2016, 2021), d('Benzin', ['2.0 MHEV 4MATIC 9G 421'], 2022)], amg),
  'Mercedes-AMG C63': m(2010, 2026, 'Sedan', [d('Benzin', ['6.2 V8 457', '4.0 V8 Biturbo 510'], 2010, 2021), d('Hibrit', ['2.0 C63 S E PERFORMANCE 4MATIC+ 680'], 2023)], amg),

  E180: m(2013, 2023, 'Sedan', [d('Benzin', ['1.6 Turbo 156', '1.6 Turbo 9G 156'])], executive),
  E200: m(2010, 2026, 'Sedan', [d('Benzin', ['1.8 CGI 184'], 2010, 2015), d('Benzin', ['2.0 Turbo 9G 184', '2.0 EQ Boost 9G 197'], 2016, 2023), d('Benzin', ['2.0 MHEV 9G 204'], 2024)], executive),
  E220d: m(2010, 2026, 'Sedan', [d('Dizel', ['2.1 CDI 170'], 2010, 2015), d('Dizel', ['2.0 d 9G 194'], 2016, 2023), d('Hibrit', ['2.0 d MHEV 9G 197'], 2024)], executive),
  E250: m(2010, 2020, 'Sedan', [d('Benzin', ['1.8 CGI 204', '2.0 Turbo 211']), d('Dizel', ['2.1 CDI 204'])], executive),
  E300: m(2010, 2026, 'Sedan', [d('Benzin', ['3.0 V6 231', '2.0 Turbo 245'], 2010, 2018), d('Hibrit', ['2.0 E300e PHEV 9G 320', '2.0 E300de PHEV 9G 306'], 2019, 2023), d('Hibrit', ['2.0 E300e PHEV 9G 313'], 2024)], executive),
  E350: m(2010, 2023, 'Sedan', [d('Benzin', ['3.5 V6 272', '3.5 V6 CGI 306'], 2010, 2016), d('Dizel', ['3.0 CDI 231', '3.0 BlueTEC 252', '3.0 d 9G 286'], 2010, 2020), d('Benzin', ['2.0 EQ Boost 4MATIC 9G 299'], 2019, 2023)], executive),
  'Mercedes-AMG E53': m(2018, 2026, 'Sedan', [d('Benzin', ['3.0 MHEV 4MATIC+ 9G 435'], 2018, 2023), d('Hibrit', ['3.0 E53 HYBRID 4MATIC+ 585'], 2024)], amg),
  'Mercedes-AMG E63': m(2010, 2023, 'Sedan', [d('Benzin', ['6.2 V8 525', '5.5 V8 Biturbo 557', '4.0 V8 Biturbo 4MATIC+ 612'])], amg),

  S350d: m(2010, 2026, 'Sedan', [d('Dizel', ['3.0 CDI 258', '3.0 d 9G 286'], 2010, 2020), d('Hibrit', ['3.0 d MHEV 4MATIC 9G 313'], 2021)], luxury),
  S400d: m(2018, 2026, 'Sedan', [d('Dizel', ['3.0 d 4MATIC 9G 340'], 2018, 2020), d('Hibrit', ['3.0 d MHEV 4MATIC 9G 330'], 2021)], luxury),
  S450: m(2018, 2026, 'Sedan', [d('Benzin', ['3.0 MHEV 4MATIC 9G 367'])], luxury),
  S500: m(2010, 2026, 'Sedan', [d('Benzin', ['4.7 V8 Biturbo 455'], 2010, 2020), d('Benzin', ['3.0 MHEV 4MATIC 9G 435'], 2021)], luxury),
  'Mercedes-Maybach S': m(2015, 2026, 'Sedan', [d('Benzin', ['S500 4MATIC 455', 'S580 4MATIC 503', 'S680 V12 4MATIC 612'])], ['Maybach', 'Maybach First Class', 'Night Series']),

  'CLA 180': m(2013, 2026, 'Coupe', [d('Benzin', ['1.6 Turbo 122'], 2013, 2018), d('Dizel', ['1.5 d DCT 116'], 2019, 2022), d('Benzin', ['1.3 MHEV DCT 136'], 2019)], compact),
  'CLA 200': m(2013, 2026, 'Coupe', [d('Benzin', ['1.6 Turbo DCT 156'], 2013, 2018), d('Benzin', ['1.3 MHEV DCT 163'], 2019)], compact),
  'CLA 220d': m(2013, 2026, 'Coupe', [d('Dizel', ['2.1 d DCT 170'], 2013, 2018), d('Dizel', ['2.0 d DCT 190'], 2019)], compact),
  'CLA 250': m(2013, 2026, 'Coupe', [d('Benzin', ['2.0 Turbo 4MATIC DCT 211'], 2013, 2018), d('Benzin', ['2.0 Turbo 4MATIC DCT 224'], 2019), d('Hibrit', ['1.3 CLA250e PHEV DCT 218'], 2020)], compact),
  'Mercedes-AMG CLA35': m(2019, 2026, 'Coupe', [d('Benzin', ['2.0 Turbo 4MATIC DCT 306'])], amg),
  'Mercedes-AMG CLA45': m(2014, 2026, 'Coupe', [d('Benzin', ['2.0 Turbo 4MATIC DCT 360'], 2014, 2018), d('Benzin', ['2.0 Turbo 4MATIC+ DCT 421'], 2019)], amg),

  CLS250d: m(2012, 2018, 'Coupe', [d('Dizel', ['2.1 CDI 204 7G', '2.1 BlueTEC 204 9G'])], executive),
  CLS350d: m(2010, 2023, 'Coupe', [d('Dizel', ['3.0 CDI 265 7G', '3.0 d 4MATIC 9G 286'])], executive),
  CLS450: m(2018, 2023, 'Coupe', [d('Benzin', ['3.0 MHEV 4MATIC 9G 367'])], executive),
  'Mercedes-AMG CLS53': m(2018, 2023, 'Coupe', [d('Benzin', ['3.0 MHEV 4MATIC+ 9G 435'])], amg),

  'GLA 180': m(2014, 2026, 'SUV', [d('Benzin', ['1.6 Turbo 122'], 2014, 2019), d('Dizel', ['1.5 d DCT 116'], 2020, 2022), d('Benzin', ['1.3 MHEV DCT 136'], 2020)], suv),
  'GLA 200': m(2014, 2026, 'SUV', [d('Benzin', ['1.6 Turbo DCT 156'], 2014, 2019), d('Benzin', ['1.3 MHEV DCT 163'], 2020)], suv),
  'GLA 220d': m(2014, 2026, 'SUV', [d('Dizel', ['2.1 d 4MATIC DCT 170'], 2014, 2019), d('Dizel', ['2.0 d 4MATIC DCT 190'], 2020)], suv),
  'Mercedes-AMG GLA45': m(2014, 2026, 'SUV', [d('Benzin', ['2.0 Turbo 4MATIC DCT 381'], 2014, 2019), d('Benzin', ['2.0 Turbo 4MATIC+ DCT 421'], 2020)], amg),
  'GLB 200': m(2020, 2026, 'SUV', [d('Benzin', ['1.3 MHEV DCT 163'])], suv),
  'GLB 220d': m(2020, 2026, 'SUV', [d('Dizel', ['2.0 d 4MATIC DCT 190'])], suv),
  'Mercedes-AMG GLB35': m(2020, 2026, 'SUV', [d('Benzin', ['2.0 Turbo 4MATIC DCT 306'])], amg),

  ML250d: m(2012, 2015, 'SUV', [d('Dizel', ['2.1 BlueTEC 4MATIC 7G 204'])], suv),
  ML350d: m(2010, 2015, 'SUV', [d('Dizel', ['3.0 CDI 4MATIC 7G 231', '3.0 BlueTEC 4MATIC 7G 258'])], suv),
  GLC200: m(2016, 2026, 'SUV', [d('Benzin', ['2.0 Turbo 4MATIC 9G 184'], 2016, 2021), d('Benzin', ['2.0 MHEV 4MATIC 9G 204'], 2022)], suv),
  GLC220d: m(2016, 2026, 'SUV', [d('Dizel', ['2.1 d 4MATIC 9G 170'], 2016, 2018), d('Dizel', ['2.0 d 4MATIC 9G 194'], 2019, 2021), d('Hibrit', ['2.0 d MHEV 4MATIC 9G 197'], 2022)], suv),
  GLC250d: m(2016, 2019, 'SUV', [d('Dizel', ['2.1 d 4MATIC 9G 204'])], suv),
  GLC300: m(2016, 2026, 'SUV', [d('Benzin', ['2.0 Turbo 4MATIC 9G 245'], 2016, 2021), d('Hibrit', ['2.0 GLC300e PHEV 4MATIC 9G 313', '2.0 GLC300de PHEV 4MATIC 9G 333'], 2020)], suv),
  'Mercedes-AMG GLC43': m(2017, 2026, 'SUV', [d('Benzin', ['3.0 V6 4MATIC 9G 390'], 2017, 2022), d('Benzin', ['2.0 MHEV 4MATIC 9G 421'], 2023)], amg),
  GLE300d: m(2015, 2026, 'SUV', [d('Dizel', ['2.0 d 4MATIC 9G 245'], 2015, 2022), d('Hibrit', ['2.0 d MHEV 4MATIC 9G 269'], 2023)], suv),
  GLE350d: m(2015, 2022, 'SUV', [d('Dizel', ['3.0 d 4MATIC 9G 258', '3.0 d 4MATIC 9G 272'])], suv),
  GLE400d: m(2019, 2026, 'SUV', [d('Dizel', ['3.0 d 4MATIC 9G 330'], 2019, 2022), d('Hibrit', ['3.0 d MHEV 4MATIC 9G 367'], 2023)], suv),
  GLE450: m(2019, 2026, 'SUV', [d('Benzin', ['3.0 MHEV 4MATIC 9G 367'])], suv),
  'Mercedes-AMG GLE53': m(2020, 2026, 'SUV', [d('Benzin', ['3.0 MHEV 4MATIC+ 9G 435'])], amg),
  GL350d: m(2010, 2015, 'SUV', [d('Dizel', ['3.0 CDI 4MATIC 7G 258'])], suv),
  GLS350d: m(2016, 2020, 'SUV', [d('Dizel', ['3.0 d 4MATIC 9G 258'])], suv),
  GLS400d: m(2020, 2026, 'SUV', [d('Dizel', ['3.0 d 4MATIC 9G 330'], 2020, 2022), d('Hibrit', ['3.0 d MHEV 4MATIC 9G 367'], 2023)], suv),
  GLS450: m(2020, 2026, 'SUV', [d('Benzin', ['3.0 MHEV 4MATIC 9G 367', '3.0 MHEV 4MATIC 9G 381'])], suv),
  'Mercedes-AMG GLS63': m(2016, 2026, 'SUV', [d('Benzin', ['5.5 V8 Biturbo 4MATIC 585'], 2016, 2019), d('Benzin', ['4.0 V8 MHEV 4MATIC+ 612'], 2020)], amg),
  'G-Serisi': m(2010, 2026, 'SUV', [d('Dizel', ['G350d 3.0 4MATIC 286', 'G400d 3.0 4MATIC 330']), d('Benzin', ['G500 4.0 V8 4MATIC 422', 'AMG G63 4.0 V8 4MATIC 585'])], ['Professional', 'AMG Line', 'Exclusive', 'Manufaktur', 'AMG']),

  EQA: m(2021, 2026, 'SUV', [d('Elektrik', ['EQA 250 140 kW 66.5 kWh', 'EQA 250+ 140 kW 70.5 kWh', 'EQA 350 4MATIC 215 kW'])], ['Progressive', 'AMG Line', 'Edition 1', 'Night Edition']),
  EQB: m(2022, 2026, 'SUV', [d('Elektrik', ['EQB 250+ 140 kW 70.5 kWh', 'EQB 300 4MATIC 168 kW', 'EQB 350 4MATIC 215 kW'])], ['Progressive', 'AMG Line', 'Edition 1']),
  EQC: m(2019, 2023, 'SUV', [d('Elektrik', ['EQC 400 4MATIC 300 kW 80 kWh'])], ['Electric Art', 'AMG Line', 'Edition 1886']),
  'EQE Sedan': m(2022, 2026, 'Sedan', [d('Elektrik', ['EQE 300 180 kW', 'EQE 350+ 215 kW', 'EQE 350 4MATIC 215 kW', 'AMG EQE 53 4MATIC+ 460 kW'])], ['Electric Art', 'AMG Line', 'Edition 1', 'AMG']),
  'EQE SUV': m(2023, 2026, 'SUV', [d('Elektrik', ['EQE 300 180 kW', 'EQE 350+ 215 kW', 'EQE 350 4MATIC 215 kW', 'AMG EQE 53 4MATIC+ 460 kW'])], ['Electric Art', 'AMG Line', 'Edition 1', 'AMG']),
  'EQS Sedan': m(2022, 2026, 'Sedan', [d('Elektrik', ['EQS 350 215 kW', 'EQS 450+ 265 kW', 'EQS 580 4MATIC 400 kW', 'AMG EQS 53 4MATIC+ 484 kW'])], ['Electric Art', 'AMG Line', 'Edition 1', 'Luxury', 'AMG']),
  'EQS SUV': m(2023, 2026, 'SUV', [d('Elektrik', ['EQS 450+ 265 kW', 'EQS 450 4MATIC 265 kW', 'EQS 580 4MATIC 400 kW'])], ['Electric Art', 'AMG Line', 'Luxury']),

  SLK: m(2010, 2016, 'Cabrio', [d('Benzin', ['SLK 200 1.8 CGI 184', 'SLK 250 1.8 CGI 204', 'SLK 350 3.5 V6 306'])], ['Base', 'AMG Sport', 'Edition 1']),
  SLC: m(2016, 2020, 'Cabrio', [d('Benzin', ['SLC 180 1.6 Turbo 156', 'SLC 200 2.0 Turbo 184', 'AMG SLC43 3.0 V6 390'])], ['Base', 'AMG Line', 'Final Edition']),
  SL: m(2010, 2026, 'Cabrio', [d('Benzin', ['SL 350 V6 306', 'SL 500 V8 455'], 2010, 2020), d('Benzin', ['AMG SL43 2.0 381', 'AMG SL55 4MATIC+ V8 476', 'AMG SL63 4MATIC+ V8 585'], 2022)], ['Base', 'AMG Line', 'AMG', 'Edition 1']),
  'AMG GT': m(2015, 2026, 'Coupe', [d('Benzin', ['GT 4.0 V8 476', 'GT S 4.0 V8 522', 'GT C 4.0 V8 557', 'GT R 4.0 V8 585', 'GT 63 4MATIC+ V8 585'])], amg),

  'V-Serisi': m(2014, 2026, 'MPV', [d('Dizel', ['V220 d 9G 163', 'V250 d 9G 190', 'V300 d 9G 237'])], ['Style', 'Avantgarde', 'Exclusive', 'AMG Line']),
  EQV: m(2020, 2026, 'MPV', [d('Elektrik', ['EQV 300 150 kW 90 kWh'])], ['Avantgarde', 'Exclusive']),
  Citan: m(2012, 2026, 'Panelvan', [d('Dizel', ['108 CDI 75', '109 CDI 90', '110 CDI 95', '111 CDI 110', '112 CDI 116'], undefined, undefined, ['Manuel', 'Otomatik'])], van),
  Vito: m(2010, 2026, 'Panelvan', [d('Dizel', ['109 CDI 95', '111 CDI 114', '114 CDI 136', '116 CDI 163', '119 CDI 190', '124 CDI 237'], undefined, undefined, ['Manuel', 'Otomatik'])], van),
  eVito: m(2020, 2026, 'Panelvan', [d('Elektrik', ['eVito 85 kW 60 kWh', 'eVito Tourer 150 kW 90 kWh'])], van),
  Sprinter: m(2010, 2026, 'Panelvan', [d('Dizel', ['311 CDI', '313 CDI', '314 CDI', '315 CDI', '316 CDI', '317 CDI', '319 CDI', '419 CDI'], undefined, undefined, ['Manuel', 'Otomatik'])], ['Base', 'Pro', 'Select', 'Panelvan', 'Minibüs', 'Şasi']),
  eSprinter: m(2020, 2026, 'Panelvan', [d('Elektrik', ['eSprinter 85 kW 56 kWh', 'eSprinter 100 kW 81 kWh', 'eSprinter 150 kW 113 kWh'])], ['Base', 'Pro', 'Select', 'Panelvan', 'Minibüs']),
};
