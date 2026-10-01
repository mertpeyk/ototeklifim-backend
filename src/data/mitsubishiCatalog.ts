export type MitsubishiDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type MitsubishiModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Coupe' | 'SUV' | 'Pickup' | 'MPV' | 'Panelvan';
  drives: MitsubishiDrive[];
  packages: string[];
};

// Türkiye-facing Mitsubishi valuation catalog. European current-generation
// models are retained for imported vehicles, while discontinued Turkish-market
// powertrains are deliberately bounded so they cannot leak into recent years.
export const mitsubishiCatalog: Record<string, MitsubishiModel> = {
  Colt: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2013, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.1 MPI 75', '1.3 MPI 95', '1.5 MPI 109', '1.5 Turbo CZT 150'] },
    { to: 2013, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.3 AMT 95', '1.5 AMT 109'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 MPI 65', '1.0 Turbo 90'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 Full Hybrid 145'] },
  ], packages: ['Inform', 'Invite', 'Intense', 'Instyle', 'CZ3', 'CZT'] },

  Lancer: { from: 2010, to: 2017, bodyType: 'Sedan', drives: [
    { to: 2011, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 MIVEC 109', '1.8 MIVEC 143'] },
    { from: 2011, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 MIVEC 117', '1.8 MIVEC 143'] },
    { from: 2011, to: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.8 DI-D 150'] },
  ], packages: ['Inform', 'Invite', 'Intense', 'Instyle'] },

  'Lancer Evolution': { from: 2010, to: 2015, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.0 Turbo 4WD 295'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Turbo SST 4WD 295'] },
  ], packages: ['GSR', 'MR'] },

  'Space Star': { from: 2013, to: 2024, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 MIVEC 71', '1.2 MIVEC 80'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 MIVEC CVT 80'] },
  ], packages: ['Inform', 'Invite', 'Intense'] },

  Attrage: { from: 2014, to: 2020, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 MIVEC 80'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 MIVEC CVT 80'] },
  ], packages: ['Inform', 'Invite', 'Intense'] },

  ASX: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 MIVEC 117'] },
    { to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 MIVEC CVT 150'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.8 DI-D 116', '1.8 DI-D 150'] },
    { from: 2013, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 DI-D AT6 150'] },
    { from: 2023, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 Turbo 91'] },
    { from: 2023, fuel: 'Hibrit', transmissions: ['Manuel'], engines: ['1.3 DI-T MHEV 140'] },
    { from: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.3 DI-T MHEV DCT 158', '1.6 Full Hybrid 145', '1.6 Plug-in Hybrid 160'] },
  ], packages: ['Inform', 'Invite', 'Intense', 'Instyle', 'Diamond'] },

  'Eclipse Cross': { from: 2018, to: 2024, bodyType: 'SUV', drives: [
    { to: 2021, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.5 Turbo 163'] },
    { to: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 Turbo CVT 163', '1.5 Turbo CVT 4WD 163'] },
    { from: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.4 Plug-in Hybrid 4WD 188'] },
  ], packages: ['Inform', 'Invite', 'Intense', 'Instyle', 'Diamond'] },

  Outlander: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 MIVEC 147', '2.4 MIVEC CVT 170'] },
    { to: 2012, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 DI-D 140', '2.2 DI-D 156'] },
    { from: 2013, to: 2020, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 MIVEC CVT 150'] },
    { from: 2013, to: 2020, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 DI-D AT6 150'] },
    { from: 2014, to: 2018, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.0 Plug-in Hybrid 4WD 203'] },
    { from: 2019, to: 2021, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.4 Plug-in Hybrid 4WD 224'] },
    { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.4 Plug-in Hybrid 4WD 306'] },
  ], packages: ['Inform', 'Invite', 'Intense', 'Instyle', 'Diamond'] },

  Pajero: { from: 2010, to: 2018, bodyType: 'SUV', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['3.2 DI-D 170', '3.2 DI-D 200'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['3.2 DI-D AT5 170', '3.2 DI-D AT5 200'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.8 V6 250'] },
  ], packages: ['Invite', 'Intense', 'Instyle'] },

  'Pajero Sport': { from: 2010, to: 2021, bodyType: 'SUV', drives: [
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.5 DI-D 136', '2.5 DI-D 178'] },
    { from: 2016, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.4 DI-D 181'] },
    { from: 2016, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.4 DI-D AT8 181'] },
  ], packages: ['Invite', 'Intense', 'Instyle'] },

  L200: { from: 2010, to: 2026, bodyType: 'Pickup', drives: [
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.5 DI-D 136', '2.5 DI-D 178'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.5 DI-D AT5 178'] },
    { from: 2016, to: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.4 DI-D 154', '2.4 DI-D 181'] },
    { from: 2016, to: 2019, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.4 DI-D AT5 181'] },
    { from: 2020, to: 2023, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 DI-D 150'] },
    { from: 2020, to: 2023, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 DI-D AT6 150'] },
    { from: 2024, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.4 DI-D 150', '2.4 DI-D 184'] },
    { from: 2024, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.4 DI-D AT6 150', '2.4 DI-D AT6 184', '2.4 DI-D AT6 204'] },
  ], packages: ['Inform', 'Invite', 'Intense', 'Instyle', '4x2 Tornado', '4x4 Storm', '4x4 Tornado', '4x4 Blizzard', '4x4 Premium'] },

  Grandis: { from: 2010, to: 2026, bodyType: 'MPV', drives: [
    { to: 2011, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 DI-D 140'] },
    { to: 2011, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.4 MIVEC 165'] },
    { from: 2026, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 Full Hybrid 160'] },
  ], packages: ['Inform', 'Invite', 'Intense', 'Instyle'] },

  L300: { from: 2010, to: 2014, bodyType: 'Panelvan', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.5 D 75', '2.5 D 87'] },
  ], packages: ['Panelvan', 'Camlı Van', 'City Van'] },

  'i-MiEV': { from: 2010, to: 2015, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['16 kWh 49 kW 67'] },
  ], packages: ['Standard'] },

  Eclipse: { from: 2010, to: 2011, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['2.4 MIVEC 162', '3.8 V6 265'] },
  ], packages: ['GS', 'GT'] },
};
