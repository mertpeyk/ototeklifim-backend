export type HondaDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'LPG' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type HondaModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'SUV' | 'Coupe';
  drives: HondaDrive[];
  packages: string[];
};

// Honda Türkiye passenger-car range normalized for valuation. Dedicated
// hybrid/electric nameplates prevent current e:HEV/EV powertrains from
// inheriting the petrol, LPG, diesel or manual rows of legacy models.
export const hondaCatalog: Record<string, HondaModel> = {
  Accord: { from: 2010, to: 2011, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.0 i-VTEC 156'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 i-VTEC AT5 156', '2.4 i-VTEC AT5 201'] },
    { to: 2011, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 i-DTEC 150'] },
    { to: 2011, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 i-DTEC AT5 150'] },
  ], packages: ['Elegance', 'Executive', 'Executive Plus'] },

  City: { from: 2010, to: 2024, bodyType: 'Sedan', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 i-VTEC 100'] },
    { to: 2012, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 i-VTEC i-SHIFT 100'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 i-VTEC CVT 121'] },
  ], packages: ['Comfort', 'Elegance', 'Executive'] },

  'Civic Sedan': { from: 2010, to: 2026, bodyType: 'Sedan', drives: [
    { to: 2016, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 i-VTEC 125', '1.8 i-VTEC 140'] },
    { to: 2016, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 i-VTEC AT5 125', '1.8 i-VTEC AT5 140'] },
    { to: 2016, fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.6 i-VTEC ECO 125'] },
    { to: 2016, fuel: 'LPG', transmissions: ['Otomatik'], engines: ['1.6 i-VTEC ECO AT5 125'] },
    { from: 2017, to: 2021, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 i-VTEC 125'] },
    { from: 2017, to: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 i-VTEC CVT 125', '1.5 VTEC Turbo CVT 182'] },
    { from: 2017, to: 2021, fuel: 'LPG', transmissions: ['Otomatik'], engines: ['1.6 i-VTEC ECO CVT 125'] },
    { from: 2018, to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 i-DTEC 120'] },
    { from: 2018, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 i-DTEC AT9 120'] },
    { from: 2022, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 VTEC Turbo CVT 182'] },
    { from: 2022, fuel: 'LPG', transmissions: ['Otomatik'], engines: ['1.5 VTEC Turbo ECO CVT 182'] },
  ], packages: ['Dream', 'Premium', 'Elegance', 'Elegance+', 'Executive', 'Executive+', 'Eco Elegance', 'Eco Executive+'] },

  'Civic Hatchback': { from: 2010, to: 2021, bodyType: 'Hatchback', drives: [
    { to: 2016, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 i-VTEC 100', '1.8 i-VTEC 142'] },
    { to: 2016, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.8 i-VTEC AT5 142'] },
    { from: 2013, to: 2016, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 i-DTEC 120'] },
    { from: 2017, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 VTEC Turbo 129', '1.5 VTEC Turbo 182'] },
    { from: 2017, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 VTEC Turbo CVT 129', '1.5 VTEC Turbo CVT 182'] },
    { from: 2018, to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 i-DTEC 120'] },
    { from: 2018, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 i-DTEC AT9 120'] },
  ], packages: ['Comfort', 'Sport', 'Sport Plus', 'Elegance', 'Executive', 'Executive Premium'] },

  'Civic Type R': { from: 2015, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2016, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.0 VTEC Turbo 310'] },
    { from: 2017, to: 2021, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.0 VTEC Turbo 320'] },
    { from: 2023, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.0 VTEC Turbo 329'] },
  ], packages: ['Type R', 'Type R GT', 'Type R Limited Edition'] },

  Jazz: { from: 2010, to: 2020, bodyType: 'Hatchback', drives: [
    { to: 2015, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 i-VTEC 90', '1.4 i-VTEC 100'] },
    { to: 2015, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.4 i-VTEC i-SHIFT 100', '1.4 i-VTEC CVT 100'] },
    { from: 2016, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.3 i-VTEC 102'] },
    { from: 2016, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.3 i-VTEC CVT 102'] },
    { to: 2015, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.3 IMA CVT 98'] },
  ], packages: ['Joy', 'Cool', 'Fun', 'Elegance', 'Executive'] },

  'Jazz e:HEV': { from: 2021, to: 2026, bodyType: 'Hatchback', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 e:HEV e-CVT 109', '1.5 e:HEV e-CVT 122'] },
  ], packages: ['Elegance', 'Advance', 'Crosstar'] },

  Insight: { from: 2010, to: 2014, bodyType: 'Hatchback', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.3 IMA CVT 98'] },
  ], packages: ['Comfort', 'Elegance', 'Executive'] },

  'CR-Z': { from: 2010, to: 2014, bodyType: 'Coupe', drives: [
    { fuel: 'Hibrit', transmissions: ['Manuel'], engines: ['1.5 IMA 124', '1.5 IMA 137'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 IMA CVT 124'] },
  ], packages: ['Sport', 'GT', 'GT Plus'] },

  'HR-V': { from: 2015, to: 2021, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.5 i-VTEC 130'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 i-VTEC CVT 130', '1.5 VTEC Turbo CVT 182'] },
    { from: 2016, to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 i-DTEC 120'] },
  ], packages: ['Elegance', 'Executive', 'Executive Plus', 'Sport'] },

  'HR-V e:HEV': { from: 2022, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.5 e:HEV e-CVT 131'] },
  ], packages: ['Elegance', 'Advance', 'Style+'] },

  'CR-V': { from: 2010, to: 2022, bodyType: 'SUV', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.0 i-VTEC 150'] },
    { to: 2012, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 i-VTEC AT5 150'] },
    { from: 2013, to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 i-VTEC AT5 155'] },
    { from: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 VTEC Turbo CVT 193 AWD'] },
    { to: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 i-DTEC 150'] },
    { from: 2014, to: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 i-DTEC 120', '1.6 i-DTEC 160 AWD'] },
    { from: 2015, to: 2018, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 i-DTEC AT9 160 AWD'] },
    { from: 2019, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.0 i-MMD Hybrid e-CVT 184'] },
  ], packages: ['Comfort', 'Elegance', 'Executive', 'Executive+', 'Lifestyle'] },

  'CR-V e:HEV': { from: 2023, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.0 e:HEV e-CVT 184'] },
  ], packages: ['Advance'] },

  'ZR-V e:HEV': { from: 2023, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.0 e:HEV e-CVT 184'] },
  ], packages: ['Advance'] },

  'e:Ny1': { from: 2024, to: 2025, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['150 kW 68.8 kWh'] },
  ], packages: ['Elegance', 'Advance'] },

  NSX: { from: 2017, to: 2021, bodyType: 'Coupe', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['3.5 V6 Twin Turbo Hybrid DCT 581'] },
  ], packages: ['NSX', 'NSX Carbon'] },

  'Prelude e:HEV': { from: 2026, to: 2026, bodyType: 'Coupe', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.0 e:HEV 184'] },
  ], packages: ['Advance'] },
};
