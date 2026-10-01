export type OpelDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'LPG' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type OpelModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Station Wagon' | 'Coupe' | 'MPV' | 'SUV' | 'Commercial Vehicle';
  drives: OpelDrive[];
  packages: string[];
};

const legacy = ['Essentia', 'Enjoy', 'Edition', 'Sport', 'Cosmo'];
const current = ['Edition', 'Elegance', 'GS', 'Ultimate'];

// Türkiye-facing Opel catalogue. Separate electric nameplates and bounded
// generations prevent old CDTI/Easytronic rows leaking into MY26 hybrids/EVs.
export const opelCatalog: Record<string, OpelModel> = {
  Corsa: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2014, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 85 HP', '1.4 100 HP', '1.4 Turbo OPC 192 HP'] },
    { to: 2014, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.3 CDTI 75 HP', '1.3 CDTI 95 HP'] },
    { from: 2015, to: 2019, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 70 HP', '1.4 90 HP', '1.0 Turbo 115 HP', '1.4 Turbo OPC 207 HP'] },
    { from: 2015, to: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 CDTI 75 HP', '1.3 CDTI 95 HP'] },
    { from: 2020, to: 2025, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 75 HP MT5', '1.2 Turbo 100 HP MT6', '1.2 Turbo 100 HP AT8', '1.2 Turbo 130 HP AT8'] },
    { from: 2024, to: 2026, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid e-DCT6 100 HP', '1.2 Hybrid e-DCT6 136 HP', '1.2 Hybrid e-DCT6 145 HP'] },
    { from: 2026, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 Turbo 100 HP MT6'] },
  ], packages: ['Essentia', 'Enjoy', 'Color Edition', 'Active', 'Sport', 'Cosmo', 'Black Edition', 'Edition', 'Elegance', 'GS Line', 'GS', 'Ultimate'] },
  'Corsa Electric': { from: 2020, to: 2026, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['50 kWh 136 HP', '51 kWh 156 HP', '100 kW 136 HP'] },
  ], packages: ['Edition', 'Elegance', 'GS Line', 'GS', 'Ultimate'] },
  Astra: { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2015, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 100 HP', '1.4 Turbo 140 HP', '1.6 115 HP', '1.6 Turbo 180 HP'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.3 CDTI 95 HP', '1.6 CDTI 110 HP', '1.7 CDTI 130 HP', '2.0 CDTI 165 HP'] },
    { from: 2016, to: 2021, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 Turbo 105 HP', '1.4 Turbo 150 HP', '1.2 Turbo 130 HP', '1.4 Turbo CVT 145 HP'] },
    { from: 2016, to: 2021, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 CDTI 110 HP', '1.6 CDTI 136 HP', '1.5 Diesel AT9 122 HP'] },
    { from: 2022, to: 2025, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 Turbo 130 HP MT6', '1.2 Turbo 130 HP AT8'] },
    { from: 2022, to: 2026, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 Diesel AT8 130 HP'] },
    { from: 2022, to: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 Plug-in Hybrid e-EAT8 180 HP', '1.6 GSe Plug-in Hybrid e-EAT8 225 HP'] },
    { from: 2026, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 Turbo 130 HP MT6'] },
  ], packages: ['Essentia', 'Enjoy', 'Sport', 'Cosmo', 'Design', 'Dynamic', 'Innovation', 'Edition', 'Elegance', 'GS Line', 'GS', 'Ultimate', 'GSe'] },
  'Astra Sedan': { from: 2010, to: 2020, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 Turbo 140 HP', '1.6 115 HP', '1.6 Turbo 170 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.3 CDTI 95 HP', '1.6 CDTI 110 HP', '1.6 CDTI 136 HP'] },
  ], packages: legacy },
  'Astra Sports Tourer': { from: 2010, to: 2025, bodyType: 'Station Wagon', drives: [
    { to: 2021, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 Turbo 140 HP', '1.4 Turbo 150 HP', '1.2 Turbo 130 HP'] },
    { to: 2021, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 CDTI 110 HP', '1.6 CDTI 136 HP', '1.5 Diesel AT9 122 HP'] },
    { from: 2022, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 Turbo AT8 130 HP'] },
    { from: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 Plug-in Hybrid e-EAT8 180 HP', '1.6 GSe Plug-in Hybrid e-EAT8 225 HP'] },
  ], packages: ['Edition', 'Enjoy', 'Sport', 'Cosmo', 'Dynamic', 'Innovation', 'Elegance', 'GS Line', 'GS', 'Ultimate'] },
  'Astra Electric': { from: 2023, to: 2026, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['54 kWh 156 HP'] },
  ], packages: ['Edition', 'GS', 'Ultimate'] },
  Insignia: { from: 2010, to: 2022, bodyType: 'Sedan', drives: [
    { to: 2017, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 Turbo 140 HP', '1.6 Turbo 180 HP', '2.0 Turbo 220 HP'] },
    { to: 2017, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 CDTI 136 HP', '2.0 CDTI 130 HP', '2.0 CDTI 160 HP', '2.0 CDTI 170 HP'] },
    { from: 2017, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.5 Turbo 165 HP', '2.0 Turbo 260 HP'] },
    { from: 2017, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 CDTI 136 HP', '2.0 CDTI 170 HP', '2.0 Diesel AT8 174 HP'] },
  ], packages: ['Edition', 'Edition Elegance', 'Sport', 'Cosmo', 'Design', 'Dynamic', 'Innovation', 'Exclusive', 'GSi'] },
  'Insignia Sports Tourer': { from: 2010, to: 2022, bodyType: 'Station Wagon', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 Turbo 140 HP', '1.5 Turbo 165 HP', '2.0 Turbo 260 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 CDTI 136 HP', '2.0 CDTI 170 HP', '2.0 Diesel AT8 174 HP'] },
  ], packages: ['Edition', 'Sport', 'Cosmo', 'Dynamic', 'Innovation', 'Exclusive', 'GSi'] },
  Adam: { from: 2013, to: 2019, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 70 HP', '1.4 87 HP', '1.4 100 HP', '1.0 Turbo 115 HP', '1.4 Turbo S 150 HP'] },
  ], packages: ['Jam', 'Glam', 'Slam', 'Rocks', 'S'] },
  Karl: { from: 2015, to: 2019, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.0 75 HP', '1.0 Easytronic 75 HP'] },
  ], packages: ['Essentia', 'Enjoy', 'Rocks'] },
  Ampera: { from: 2011, to: 2015, bodyType: 'Hatchback', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.4 Range Extender 150 HP'] },
  ], packages: ['Ampera', 'ePioneer'] },
  'Ampera-e': { from: 2017, to: 2020, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['60 kWh 204 HP'] },
  ], packages: ['Edition', 'Innovation'] },
  Cascada: { from: 2013, to: 2019, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 Turbo 140 HP', '1.6 Turbo 170 HP', '1.6 Turbo 200 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 CDTI 165 HP', '2.0 BiTurbo CDTI 195 HP'] },
  ], packages: ['Edition', 'Cosmo', 'Innovation'] },
  Meriva: { from: 2010, to: 2017, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 100 HP', '1.4 Turbo 120 HP', '1.4 Turbo 140 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.3 CDTI 95 HP', '1.6 CDTI 110 HP', '1.6 CDTI 136 HP'] },
  ], packages: ['Essentia', 'Enjoy', 'Active', 'Cosmo'] },
  Zafira: { from: 2010, to: 2026, bodyType: 'MPV', drives: [
    { to: 2018, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 Turbo 140 HP', '1.6 Turbo 170 HP'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 CDTI 120 HP', '1.6 CDTI 136 HP', '2.0 CDTI 165 HP'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 BlueHDi 120 HP MT6', '2.0 BlueHDi EAT8 145 HP', '2.0 BlueHDi EAT8 180 HP'] },
  ], packages: ['Essentia', 'Enjoy', 'Cosmo', 'Innovation', 'Edition', 'Elegance', 'Business', 'Ultimate'] },
  'Zafira Electric': { from: 2020, to: 2025, bodyType: 'MPV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['50 kWh 136 HP', '75 kWh 136 HP'] },
  ], packages: ['Edition', 'Elegance', 'Business'] },
  Antara: { from: 2010, to: 2015, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.4 167 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.0 CDTI 150 HP', '2.2 CDTI 163 HP', '2.2 CDTI 184 HP'] },
  ], packages: ['Enjoy', 'Cosmo'] },
  Mokka: { from: 2013, to: 2026, bodyType: 'SUV', drives: [
    { to: 2019, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.4 Turbo 140 HP', '1.6 115 HP'] },
    { to: 2019, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 CDTI 110 HP', '1.6 CDTI 136 HP'] },
    { from: 2021, to: 2025, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 Turbo 100 HP MT6', '1.2 Turbo 130 HP AT8'] },
    { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid e-DCT6 136 HP', '1.2 Hybrid e-DCT6 145 HP'] },
    { from: 2026, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 Turbo 130 HP MT6'] },
  ], packages: ['Essentia', 'Enjoy', 'Cosmo', 'X', 'Edition', 'Elegance', 'GS Line', 'GS', 'Ultimate'] },
  'Mokka Electric': { from: 2021, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['50 kWh 136 HP', '54 kWh 156 HP'] },
  ], packages: ['Edition', 'Elegance', 'GS Line', 'GS', 'Ultimate'] },
  'Mokka GSE': { from: 2026, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['54 kWh GSE 281 HP'] },
  ], packages: ['GSE'] },
  'Crossland X': { from: 2017, to: 2020, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 82 HP', '1.2 Turbo 110 HP', '1.2 Turbo 130 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 Diesel 102 HP', '1.5 Diesel AT6 120 HP'] },
  ], packages: ['Essentia', 'Enjoy', 'Innovation', 'Elite'] },
  Crossland: { from: 2021, to: 2024, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 Turbo 110 HP MT6', '1.2 Turbo 130 HP AT6'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 Diesel 110 HP MT6', '1.5 Diesel AT6 120 HP'] },
  ], packages: ['Edition', 'Elegance', 'Ultimate'] },
  'Grandland X': { from: 2017, to: 2021, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 Turbo 130 HP MT6', '1.6 Turbo AT6 180 HP'] },
    { fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 Diesel AT8 130 HP', '1.6 Diesel 120 HP'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 Plug-in Hybrid 225 HP', '1.6 Plug-in Hybrid4 AWD 300 HP'] },
  ], packages: ['Enjoy', 'Excellence', 'Innovation', 'Ultimate'] },
  Grandland: { from: 2022, to: 2026, bodyType: 'SUV', drives: [
    { to: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 Turbo AT8 130 HP'] },
    { from: 2022, to: 2024, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 Diesel AT8 130 HP'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid e-DCT6 136 HP', '1.2 Hybrid e-DCT6 145 HP', '1.6 Plug-in Hybrid 225 HP', '1.6 Plug-in Hybrid4 AWD 300 HP'] },
  ], packages: current },
  'Grandland Electric': { from: 2025, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['73 kWh 213 HP', '82 kWh 213 HP', '97 kWh 231 HP', 'Electric AWD 325 HP'] },
  ], packages: ['Edition', 'GS', 'Ultimate', 'GSE AWD'] },
  Frontera: { from: 2025, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid e-DCT6 110 HP', '1.2 Hybrid e-DCT6 145 HP'] },
  ], packages: ['Edition', 'GS'] },
  'Frontera Electric': { from: 2025, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['44 kWh 113 HP', '54 kWh 113 HP'] },
  ], packages: ['Edition', 'GS'] },
  Combo: { from: 2010, to: 2026, bodyType: 'MPV', drives: [
    { to: 2018, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 95 HP'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.3 CDTI 90 HP', '1.6 CDTI 105 HP', '1.6 CDTI 120 HP'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 Diesel 100 HP MT6', '1.5 Diesel EAT8 130 HP'] },
  ], packages: ['Essentia', 'Enjoy', 'Tour', 'Edition', 'Elegance', 'Ultimate'] },
  'Combo Electric': { from: 2021, to: 2026, bodyType: 'MPV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['50 kWh 136 HP'] },
  ], packages: ['Edition', 'Elegance', 'Ultimate'] },
  'Combo Cargo': { from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.3 CDTI 90 HP', '1.6 CDTI 105 HP'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 Diesel 100 HP MT6', '1.5 Diesel EAT8 130 HP'] },
  ], packages: ['Essentia', 'Edition', 'Enjoy', 'XL'] },
  Vivaro: { from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 CDTI 95 HP', '1.6 CDTI 120 HP', '1.6 BiTurbo CDTI 145 HP', '2.0 CDTI 115 HP'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.5 Diesel 120 HP MT6', '2.0 Diesel 145 HP MT6', '2.0 Diesel EAT8 180 HP'] },
  ], packages: ['Edition', 'Business', 'Elegance', 'City Van', 'Kamyonet'] },
  'Vivaro Electric': { from: 2020, to: 2025, bodyType: 'Commercial Vehicle', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['50 kWh 136 HP', '75 kWh 136 HP'] },
  ], packages: ['Edition', 'Business'] },
  Movano: { from: 2010, to: 2026, bodyType: 'Commercial Vehicle', drives: [
    { to: 2021, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.3 CDTI 125 HP', '2.3 CDTI 145 HP', '2.3 BiTurbo CDTI 165 HP'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['2.2 BlueHDi 120 HP', '2.2 BlueHDi 140 HP', '2.2 BlueHDi 180 HP AT8'] },
  ], packages: ['Panelvan', 'Kamyonet', 'Edition', 'L2H2', 'L3H2', 'L4H3'] },
};
