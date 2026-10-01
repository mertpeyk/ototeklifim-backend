export type DaciaDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'LPG' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type DaciaModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Station Wagon' | 'MPV' | 'SUV' | 'Commercial Vehicle';
  drives: DaciaDrive[];
  packages: string[];
};

// Dacia Türkiye / European import catalog normalized for valuation. Generation
// gaps are expressed with drive year ranges so a canonical model name can be
// reused without exposing engines in years in which it was not offered.
export const daciaCatalog: Record<string, DaciaModel> = {
  Logan: {
    from: 2010, to: 2026, bodyType: 'Sedan', drives: [
      { to: 2012, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 MPI', '1.6 MPI', '1.6 16V'] },
      { to: 2012, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 70', '1.5 dCi 85'] },
      { to: 2012, fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.4 MPI LPG', '1.6 MPI LPG'] },
      { from: 2013, to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['0.9 TCe 90', '1.0 SCe 75'] },
      { from: 2013, to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 75', '1.5 dCi 90', '1.5 Blue dCi 95'] },
      { from: 2017, to: 2020, fuel: 'LPG', transmissions: ['Manuel'], engines: ['0.9 TCe LPG 90', '1.0 ECO-G 100'] },
      { from: 2026, fuel: 'LPG', transmissions: ['Otomatik'], engines: ['Eco-G 120 EDC'] },
    ], packages: ['Ambiance', 'Laureate', 'Black Line', 'Mıknatıs', 'Silver Line', 'Comfort', 'Prestige', 'Essential', 'Expression', 'Journey'],
  },
  'Logan MCV': {
    from: 2010, to: 2020, bodyType: 'Station Wagon', drives: [
      { to: 2012, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 MPI', '1.6 MPI', '1.6 16V'] },
      { to: 2012, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 70', '1.5 dCi 85'] },
      { from: 2013, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['0.9 TCe 90', '1.0 SCe 75'] },
      { from: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 75', '1.5 dCi 90', '1.5 Blue dCi 95'] },
      { from: 2017, fuel: 'LPG', transmissions: ['Manuel'], engines: ['0.9 TCe LPG 90', '1.0 ECO-G 100'] },
    ], packages: ['Ambiance', 'Laureate', 'Black Line', 'Mıknatıs', 'Silver Line', 'Comfort', 'Prestige', 'Stepway'],
  },
  Sandero: {
    from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
      { to: 2012, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 16V 75', '1.4 MPI', '1.6 MPI'] },
      { to: 2012, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 70', '1.5 dCi 85'] },
      { to: 2012, fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.4 MPI LPG', '1.6 MPI LPG'] },
      { from: 2013, to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['0.9 TCe 90', '1.0 SCe 75'] },
      { from: 2013, to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 75', '1.5 dCi 90', '1.5 Blue dCi 95'] },
      { from: 2017, to: 2020, fuel: 'LPG', transmissions: ['Manuel'], engines: ['0.9 TCe LPG 90', '1.0 ECO-G 100'] },
      { from: 2021, to: 2025, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 SCe 65', 'TCe 90', 'TCe 90 CVT'] },
      { from: 2021, to: 2025, fuel: 'LPG', transmissions: ['Manuel'], engines: ['ECO-G 100'] },
      { from: 2026, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['TCe 100'] },
    ], packages: ['Ambiance', 'Laureate', 'Black Line', 'Mıknatıs', 'Comfort', 'Prestige', 'Essential', 'Expression'],
  },
  'Sandero Stepway': {
    from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
      { to: 2012, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 MPI 90', '1.6 16V 105'] },
      { to: 2012, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 85'] },
      { from: 2013, to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['0.9 TCe 90', '1.0 SCe 75'] },
      { from: 2013, to: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 90', '1.5 Blue dCi 95'] },
      { from: 2017, to: 2020, fuel: 'LPG', transmissions: ['Manuel'], engines: ['0.9 TCe LPG 90', '1.0 ECO-G 100'] },
      { from: 2021, to: 2025, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['TCe 90', 'TCe 90 CVT'] },
      { from: 2021, to: 2025, fuel: 'LPG', transmissions: ['Manuel'], engines: ['ECO-G 100'] },
      { from: 2026, fuel: 'LPG', transmissions: ['Otomatik'], engines: ['Eco-G 120 EDC'] },
    ], packages: ['Ambiance', 'Laureate', 'Prestige', 'Comfort', 'Essential', 'Expression', 'Extreme'],
  },
  Duster: {
    from: 2010, to: 2023, bodyType: 'SUV', drives: [
      { to: 2017, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 16V 105', '1.2 TCe 125'] },
      { to: 2017, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi 90', '1.5 dCi 110 4x2', '1.5 dCi 110 4x4'] },
      { from: 2018, to: 2021, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 TCe 100', '1.3 TCe 130', '1.3 TCe 150 EDC'] },
      { from: 2018, to: 2023, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 Blue dCi 95', '1.5 Blue dCi 115 4x2', '1.5 Blue dCi 115 4x4'] },
      { from: 2020, to: 2023, fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.0 ECO-G 100'] },
      { from: 2022, to: 2023, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.3 TCe 150 EDC', '1.3 TCe 150 4x4'] },
    ], packages: ['Ambiance', 'Laureate', 'Black Line', 'Mıknatıs', 'Adventure', 'Comfort', 'Prestige', 'Essential', 'Expression', 'Extreme', 'Journey'],
  },
  Lodgy: {
    from: 2012, to: 2022, bodyType: 'MPV', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 TCe 115', '1.6 MPI 85', '1.6 SCe 100'] },
      { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 90', '1.5 dCi 110', '1.5 Blue dCi 95'] },
      { from: 2017, fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.6 SCe LPG 100'] },
    ], packages: ['Ambiance', 'Laureate', 'Silver Line', 'Black Line', 'Stepway', 'Comfort', 'Prestige'],
  },
  Dokker: {
    from: 2013, to: 2021, bodyType: 'MPV', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 TCe 115', '1.6 MPI 85', '1.6 SCe 100'] },
      { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 75', '1.5 dCi 90', '1.5 Blue dCi 95'] },
      { from: 2017, fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.6 SCe LPG 100'] },
    ], packages: ['Ambiance', 'Laureate', 'Stepway', 'Comfort', 'Prestige'],
  },
  'Dokker Van': {
    from: 2013, to: 2021, bodyType: 'Commercial Vehicle', drives: [
      { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 MPI 85', '1.6 SCe 100'] },
      { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 75', '1.5 dCi 90', '1.5 Blue dCi 95'] },
      { from: 2017, fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.6 SCe LPG 100'] },
    ], packages: ['Ambiance', 'Laureate', 'Comfort'],
  },
  Jogger: {
    from: 2022, to: 2026, bodyType: 'MPV', drives: [
      { to: 2025, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['TCe 110'] },
      { to: 2025, fuel: 'LPG', transmissions: ['Manuel'], engines: ['ECO-G 100'] },
      { from: 2023, to: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['Hybrid 140'] },
      { from: 2026, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['TCe 110'] },
      { from: 2026, fuel: 'LPG', transmissions: ['Manuel', 'Otomatik'], engines: ['Eco-G 120', 'Eco-G 120 EDC'] },
      { from: 2026, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['Hybrid 155'] },
    ], packages: ['Essential', 'Expression', 'Extreme', 'Extreme+', 'Journey'],
  },
  Spring: {
    from: 2021, to: 2024, bodyType: 'Hatchback', drives: [
      { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['33 kW Electric 45', '48 kW Electric 65'] },
    ], packages: ['Comfort', 'Comfort Plus', 'Essential', 'Expression', 'Extreme'],
  },
  Bigster: {
    from: 2025, to: 2026, bodyType: 'SUV', drives: [
      { fuel: 'Hibrit', transmissions: ['Manuel'], engines: ['TCe 140 mild hybrid'] },
      { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['Hybrid 155', 'Hybrid-G 150 4x4'] },
      { fuel: 'LPG', transmissions: ['Manuel'], engines: ['ECO-G 140'] },
    ], packages: ['Essential', 'Expression', 'Extreme', 'Journey'],
  },
};
