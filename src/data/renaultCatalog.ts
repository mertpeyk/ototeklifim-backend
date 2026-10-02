export type RenaultDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'LPG' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type RenaultModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Station Wagon' | 'Coupe' | 'MPV' | 'SUV' | 'Commercial Vehicle';
  drives: RenaultDrive[];
  packages: string[];
};

// Türkiye-facing Renault catalogue. Generations and renamed electric families
// are bounded so legacy dCi/EDC rows cannot leak into current E-Tech models.
export const renaultCatalog: Record<string, RenaultModel> = {
  Clio: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 75 HP', '1.2 Turbo TCe 100 HP', '1.6 110 HP', '2.0 RS 200 HP'] },
    { to: 2012, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 65 HP', '1.5 dCi 85 HP', '1.5 dCi 105 HP'] },
    { from: 2013, to: 2019, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['0.9 TCe 90 HP MT5', '1.2 75 HP MT5', '1.2 TCe EDC 120 HP', '1.6 RS EDC 200 HP', '1.6 RS Trophy EDC 220 HP'] },
    { from: 2013, to: 2019, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi 75 HP MT5', '1.5 dCi 90 HP MT5', '1.5 dCi EDC 90 HP'] },
    { from: 2020, to: 2025, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 SCe 65 HP MT5', '1.0 TCe 90 HP MT6', '1.0 TCe X-Tronic 90 HP', '1.3 TCe EDC 130 HP'] },
    { from: 2020, to: 2023, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 Blue dCi 85 HP MT6', '1.5 Blue dCi 115 HP MT6'] },
    { from: 2020, to: 2025, fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.0 TCe ECO-G 100 HP MT6'] },
    { from: 2020, to: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 E-Tech Full Hybrid 140 HP', '1.6 E-Tech Full Hybrid 145 HP'] },
    { from: 2026, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TCe 115 HP MT6', '1.2 TCe EDC 115 HP'] },
  ], packages: ['Authentique', 'Expression', 'Dynamique', 'Extreme', 'Joy', 'Touch', 'Icon', 'Iconic', 'Sport Tourer', 'RS', 'RS Trophy', 'Life', 'Zen', 'Intens', 'Equilibre', 'Evolution', 'Techno', 'Esprit Alpine'] },
  'Clio Sport Tourer': { from: 2010, to: 2019, bodyType: 'Station Wagon', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 75 HP', '0.9 TCe 90 HP', '1.2 TCe EDC 120 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi 75 HP', '1.5 dCi 90 HP', '1.5 dCi EDC 90 HP'] },
  ], packages: ['Authentique', 'Expression', 'Dynamique', 'Joy', 'Touch', 'Icon'] },
  Symbol: { from: 2010, to: 2020, bodyType: 'Sedan', drives: [
    { to: 2012, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 75 HP', '1.4 75 HP', '1.6 105 HP'] },
    { to: 2012, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 65 HP', '1.5 dCi 85 HP'] },
    { from: 2013, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['0.9 TCe 90 HP', '1.0 SCe 75 HP'] },
    { from: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 75 HP', '1.5 dCi 90 HP'] },
  ], packages: ['Authentique', 'Expression', 'Dynamique', 'Joy', 'Touch'] },
  Taliant: { from: 2021, to: 2025, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 SCe 65 HP MT5', '1.0 TCe 90 HP MT6', '1.0 TCe X-Tronic 90 HP'] },
    { fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.0 TCe ECO-G 100 HP MT6'] },
  ], packages: ['Joy', 'Touch', 'Icon'] },
  Fluence: { from: 2010, to: 2016, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 110 HP MT5', '1.6 CVT 115 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi 85 HP MT5', '1.5 dCi 90 HP MT5', '1.5 dCi EDC 110 HP'] },
  ], packages: ['Authentique', 'Business', 'Expression', 'Dynamique', 'Privilege', 'Touch', 'Icon'] },
  'Fluence Z.E.': { from: 2011, to: 2014, bodyType: 'Sedan', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['22 kWh 95 HP'] },
  ], packages: ['Expression', 'Dynamique'] },
  'Megane Hatchback': { from: 2010, to: 2022, bodyType: 'Hatchback', drives: [
    { to: 2015, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TCe 130 HP', '1.6 110 HP CVT', '2.0 RS 250 HP', '2.0 RS Trophy 265 HP'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi 90 HP', '1.5 dCi EDC 110 HP', '1.6 dCi 130 HP'] },
    { from: 2016, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TCe EDC 130 HP', '1.3 TCe 140 HP MT6', '1.3 TCe EDC 140 HP', '1.8 RS EDC 280 HP'] },
    { from: 2016, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi 110 HP MT6', '1.5 dCi EDC 110 HP', '1.5 Blue dCi EDC 115 HP', '1.6 dCi EDC 130 HP'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 E-Tech Plug-in Hybrid 160 HP'] },
  ], packages: ['Authentique', 'Expression', 'Dynamique', 'Privilege', 'GT Line', 'RS', 'RS Trophy', 'Joy', 'Touch', 'Icon', 'Iconic', 'Intens', 'Bose'] },
  'Megane Sedan': { from: 2016, to: 2026, bodyType: 'Sedan', drives: [
    { to: 2020, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TCe EDC 130 HP', '1.3 TCe 140 HP MT6', '1.3 TCe EDC 140 HP'] },
    { to: 2023, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi 110 HP MT6', '1.5 dCi EDC 110 HP', '1.5 Blue dCi EDC 115 HP'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.3 TCe EDC 140 HP', '1.3 TCe EDC 160 HP'] },
  ], packages: ['Joy', 'Touch', 'Icon', 'Iconic', 'Business', 'Limited', 'Bose', 'Executive', 'Techno'] },
  'Megane Sport Tourer': { from: 2010, to: 2022, bodyType: 'Station Wagon', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TCe 130 HP', '1.2 TCe EDC 130 HP', '1.3 TCe EDC 140 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi 110 HP', '1.5 dCi EDC 110 HP', '1.6 dCi 130 HP'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 E-Tech Plug-in Hybrid 160 HP'] },
  ], packages: ['Expression', 'Dynamique', 'Privilege', 'GT Line', 'Touch', 'Icon', 'Iconic', 'Intens'] },
  'Megane Coupe': { from: 2010, to: 2016, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TCe 130 HP', '2.0 RS 250 HP', '2.0 RS Trophy 265 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 110 HP', '1.6 dCi 130 HP'] },
  ], packages: ['Dynamique', 'Privilege', 'GT Line', 'RS', 'RS Trophy'] },
  'Megane CC': { from: 2010, to: 2015, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TCe 130 HP', '2.0 CVT 140 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi EDC 110 HP', '1.6 dCi 130 HP'] },
  ], packages: ['Dynamique', 'Privilege', 'GT Line'] },
  'Megane E-Tech Electric': { from: 2022, to: 2026, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['40 kWh 130 HP', '60 kWh 220 HP'] },
  ], packages: ['Equilibre', 'Techno', 'Iconic', 'Esprit Alpine'] },
  Laguna: { from: 2010, to: 2015, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Turbo 170 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi 110 HP', '2.0 dCi 150 HP', '2.0 dCi 175 HP'] },
  ], packages: ['Expression', 'Dynamique', 'Privilege', 'Initiale'] },
  Latitude: { from: 2010, to: 2015, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 CVT 140 HP'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 dCi EDC 110 HP', '2.0 dCi 175 HP'] },
  ], packages: ['Expression', 'Privilege', 'Initiale'] },
  Talisman: { from: 2016, to: 2022, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.3 TCe EDC 160 HP', '1.6 TCe EDC 200 HP'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 dCi EDC 110 HP', '1.6 dCi EDC 130 HP', '1.6 dCi EDC 160 HP', '2.0 Blue dCi EDC 160 HP'] },
  ], packages: ['Touch', 'Icon', 'Iconic', 'Initiale Paris', 'S-Edition'] },
  'Talisman Sport Tourer': { from: 2016, to: 2022, bodyType: 'Station Wagon', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 TCe EDC 200 HP'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 dCi EDC 110 HP', '1.6 dCi EDC 130 HP', '1.6 dCi EDC 160 HP'] },
  ], packages: ['Touch', 'Icon', 'Iconic', 'Initiale Paris'] },
  Modus: { from: 2010, to: 2012, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 75 HP', '1.6 110 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 85 HP'] },
  ], packages: ['Authentique', 'Expression', 'Dynamique'] },
  Scenic: { from: 2010, to: 2022, bodyType: 'MPV', drives: [
    { to: 2016, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TCe 130 HP', '1.6 110 HP CVT'] },
    { to: 2016, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi 110 HP', '1.5 dCi EDC 110 HP', '1.6 dCi 130 HP'] },
    { from: 2017, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TCe 130 HP', '1.3 TCe EDC 140 HP'] },
    { from: 2017, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi 110 HP', '1.5 Blue dCi EDC 120 HP'] },
  ], packages: ['Authentique', 'Expression', 'Dynamique', 'Privilege', 'Touch', 'Icon', 'Iconic', 'Bose'] },
  'Grand Scenic': { from: 2010, to: 2022, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 TCe 130 HP', '1.2 TCe 130 HP', '1.3 TCe EDC 140 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi EDC 110 HP', '1.6 dCi 130 HP', '1.5 Blue dCi EDC 120 HP'] },
  ], packages: ['Expression', 'Dynamique', 'Privilege', 'Touch', 'Icon', 'Iconic', 'Bose'] },
  'Scenic E-Tech Electric': { from: 2024, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['60 kWh 170 HP', '87 kWh 220 HP'] },
  ], packages: ['Techno', 'Esprit Alpine', 'Iconic'] },
  Espace: { from: 2010, to: 2026, bodyType: 'MPV', drives: [
    { to: 2014, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 dCi 150 HP', '2.0 dCi 175 HP'] },
    { from: 2015, to: 2022, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 TCe EDC 200 HP', '1.8 TCe EDC 225 HP'] },
    { from: 2015, to: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 dCi EDC 160 HP', '2.0 Blue dCi EDC 190 HP'] },
    { from: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 E-Tech Full Hybrid 200 HP'] },
  ], packages: ['Expression', 'Privilege', 'Initiale Paris', 'Iconic', 'Techno', 'Esprit Alpine'] },
  Captur: { from: 2013, to: 2026, bodyType: 'SUV', drives: [
    { to: 2019, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['0.9 TCe 90 HP MT5', '1.2 TCe EDC 120 HP'] },
    { to: 2019, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi 90 HP MT5', '1.5 dCi EDC 90 HP'] },
    { from: 2020, to: 2024, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 TCe 100 HP MT5', '1.3 TCe EDC 130 HP', '1.3 TCe EDC 155 HP'] },
    { from: 2020, to: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 E-Tech Full Hybrid 145 HP', '1.6 E-Tech Plug-in Hybrid 160 HP'] },
    { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.3 Mild Hybrid EDC 140 HP', '1.8 E-Tech Full Hybrid 160 HP'] },
  ], packages: ['Joy', 'Touch', 'Icon', 'Iconic', 'Life', 'Zen', 'Intens', 'Equilibre', 'Evolution', 'Techno', 'Esprit Alpine'] },
  Kadjar: { from: 2015, to: 2022, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 TCe EDC 130 HP', '1.3 TCe 140 HP MT6', '1.3 TCe EDC 160 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi EDC 110 HP', '1.6 dCi 130 HP', '1.5 Blue dCi EDC 115 HP'] },
  ], packages: ['Touch', 'Icon', 'Iconic', 'Bose', 'Black Edition'] },
  Koleos: { from: 2010, to: 2023, bodyType: 'SUV', drives: [
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 dCi 150 HP 4x4', '2.0 dCi 175 HP 4x4'] },
    { from: 2017, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 dCi X-Tronic 130 HP', '2.0 dCi X-Tronic 175 HP 4x4', '2.0 Blue dCi X-Tronic 190 HP 4x4'] },
  ], packages: ['Expression', 'Dynamique', 'Privilege', 'Icon', 'Iconic', 'Initiale Paris'] },
  Austral: { from: 2022, to: 2026, bodyType: 'SUV', drives: [
    { to: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.3 Mild Hybrid X-Tronic 160 HP'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 E-Tech Full Hybrid 200 HP', '1.3 Mild Hybrid X-Tronic 160 HP'] },
  ], packages: ['Techno', 'Techno Esprit Alpine', 'Iconic', 'Iconic Esprit Alpine'] },
  Rafale: { from: 2024, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 E-Tech Full Hybrid 200 HP', 'E-Tech 4x4 Plug-in Hybrid 300 HP'] },
  ], packages: ['Techno', 'Esprit Alpine', 'Atelier Alpine'] },
  Arkana: { from: 2021, to: 2024, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.3 TCe EDC 140 HP', '1.3 TCe EDC 160 HP'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 E-Tech Full Hybrid 145 HP'] },
  ], packages: ['Zen', 'Intens', 'RS Line', 'Techno', 'Esprit Alpine'] },
  Duster: { from: 2024, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 TCe 100 HP MT6'] },
    { fuel: 'LPG', transmissions: ['Manuel'], engines: ['1.0 ECO-G 100 HP MT6'] },
    { fuel: 'Hibrit', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 Mild Hybrid 130 HP MT6 4x2', '1.2 Mild Hybrid 130 HP MT6 4x4', '1.6 E-Tech Full Hybrid 145 HP'] },
  ], packages: ['Evolution', 'Techno', 'Esprit Alpine', 'Extreme'] },
  Boreal: { from: 2026, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.3 Turbo EDC 160 HP'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.8 E-Tech Full Hybrid 160 HP'] },
  ], packages: ['Evolution', 'Techno', 'Esprit Alpine'] },
  Zoe: { from: 2013, to: 2024, bodyType: 'Hatchback', drives: [
    { to: 2016, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['22 kWh 88 HP'] },
    { from: 2017, to: 2019, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['41 kWh R90 92 HP', '41 kWh Q90 88 HP'] },
    { from: 2020, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['52 kWh R110 108 HP', '52 kWh R135 135 HP'] },
  ], packages: ['Life', 'Zen', 'Intens', 'Iconic'] },
  Twizy: { from: 2012, to: 2019, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['6.1 kWh 5 HP', '6.1 kWh 17 HP'] },
  ], packages: ['Urban', 'Technic', 'Cargo'] },
  'Renault 5 E-Tech Electric': { from: 2025, to: 2026, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['40 kWh 120 HP', '52 kWh 150 HP'] },
  ], packages: ['Evolution', 'Techno', 'Iconic Cinq', 'Roland-Garros'] },
  'Kangoo Multix': { from: 2010, to: 2026, bodyType: 'MPV', drives: [
    { to: 2021, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 105 HP', '1.2 TCe 115 HP'] },
    { to: 2021, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 dCi 75 HP', '1.5 dCi 90 HP', '1.5 dCi EDC 110 HP'] },
    { from: 2022, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.3 TCe EDC 130 HP'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 Blue dCi 95 HP MT6', '1.5 Blue dCi EDC 115 HP'] },
  ], packages: ['Authentique', 'Expression', 'Dynamique', 'Touch', 'Icon', 'Equilibre', 'Techno'] },
  'Kangoo Van': { from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2021, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 dCi 75 HP', '1.5 dCi 90 HP', '1.5 dCi 110 HP'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 Blue dCi 95 HP MT6', '1.5 Blue dCi EDC 115 HP'] },
    { from: 2022, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['45 kWh E-Tech Electric 120 HP'] },
  ], packages: ['Express', 'Business', 'Joy', 'Touch', 'Equilibre', 'Techno'] },
  'Express Van': { from: 2021, to: 2024, bodyType: 'Commercial Vehicle', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.3 TCe 100 HP MT6'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 Blue dCi 75 HP MT6', '1.5 Blue dCi 95 HP MT6'] },
  ], packages: ['Joy', 'Touch'] },
  'Trafic Panelvan': { from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2014, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 dCi 90 HP', '2.0 dCi 115 HP Quickshift'] },
    { from: 2015, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 dCi 95 HP', '1.6 dCi 120 HP', '1.6 dCi 145 HP', '2.0 Blue dCi 130 HP MT6', '2.0 Blue dCi EDC 150 HP', '2.0 Blue dCi EDC 170 HP'] },
  ], packages: ['Business', 'Joy', 'Touch', 'L1H1', 'L2H1'] },
  'Trafic Combi': { from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2014, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 dCi 115 HP', '2.0 dCi Quickshift 150 HP'] },
    { from: 2015, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 dCi 125 HP', '1.6 dCi 145 HP', '2.0 Blue dCi EDC 150 HP', '2.0 Blue dCi EDC 170 HP'] },
  ], packages: ['Passenger', 'Business', 'SpaceClass', 'L1H1', 'L2H1'] },
  'Master Panelvan': { from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2024, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.3 dCi 125 HP', '2.3 dCi 135 HP', '2.3 dCi 150 HP', '2.3 dCi 165 HP', '2.3 dCi Quickshift 150 HP'] },
    { from: 2025, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 Blue dCi 130 HP MT6', '2.0 Blue dCi 150 HP MT6', '2.0 Blue dCi EAG9 170 HP'] },
    { from: 2025, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['40 kWh E-Tech Electric 130 HP', '87 kWh E-Tech Electric 143 HP'] },
  ], packages: ['Business', 'Joy', 'Touch', 'L2H2', 'L3H2', 'L4H3'] },
  'Master Kamyonet': { from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2024, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.3 dCi 125 HP', '2.3 dCi 135 HP', '2.3 dCi 165 HP'] },
    { from: 2025, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 Blue dCi 130 HP MT6', '2.0 Blue dCi 150 HP MT6'] },
  ], packages: ['Tek Kabin', 'Çift Kabin', 'Şasi Kabin', 'L2', 'L3', 'L4'] },
};
