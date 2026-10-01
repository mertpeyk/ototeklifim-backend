export type PeugeotDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type PeugeotModel = {
  from: number;
  to: number;
  bodyType: 'Hatchback' | 'Sedan' | 'Station Wagon' | 'Coupe' | 'SUV' | 'MPV' | 'Panelvan';
  drives: PeugeotDrive[];
  packages: string[];
};

// Türkiye-facing Peugeot catalog. Dedicated electric nameplates and bounded
// generations keep legacy HDi/VTi combinations out of current Hybrid/EV cars.
export const peugeotCatalog: Record<string, PeugeotModel> = {
  '107': { from: 2010, to: 2014, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 VTi 68'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 VTi 2-Tronic 68'] },
  ], packages: ['Urban', 'Trendy', 'Envy'] },
  '108': { from: 2014, to: 2021, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 VTi 68', '1.0 VTi 72', '1.2 PureTech 82'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.0 VTi ETG5 68', '1.0 VTi ETG5 72'] },
  ], packages: ['Access', 'Active', 'Allure', 'Top!'] },
  '206+': { from: 2010, to: 2012, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 75'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 HDi 70'] },
  ], packages: ['Comfort', 'Trendy', 'Feline'] },
  '207': { from: 2010, to: 2012, bodyType: 'Hatchback', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 VTi 95', '1.6 VTi 120', '1.6 THP 156'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 VTi AT4 120'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 HDi 70', '1.6 HDi 90', '1.6 HDi 112'] },
  ], packages: ['Comfort', 'Trendy', 'Premium', 'Feline', 'GT'] },
  '208': { from: 2012, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2015, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.0 VTi 68', '1.2 VTi 82', '1.6 VTi 120', '1.6 THP 156', '1.6 THP GTi 200'] },
    { to: 2015, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 VTi ETG5 82', '1.6 VTi AT4 120'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.4 HDi 68', '1.6 e-HDi 92', '1.6 e-HDi 115'] },
    { from: 2015, to: 2019, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 PureTech 82', '1.2 PureTech 110', '1.6 THP GTi 208'] },
    { from: 2015, to: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 PureTech EAT6 110'] },
    { from: 2015, to: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 BlueHDi 75', '1.6 BlueHDi 100', '1.6 BlueHDi 120'] },
    { from: 2020, to: 2024, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 PureTech 75', '1.2 PureTech 100'] },
    { from: 2020, to: 2025, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 PureTech EAT8 100', '1.2 PureTech EAT8 130'] },
    { from: 2020, to: 2023, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 BlueHDi EAT8 130'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid e-DCS6 100', '1.2 Hybrid e-DCS6 136'] },
  ], packages: ['Access', 'Active', 'Active Prime', 'Prime', 'Allure', 'Allure Selection', 'GT Line', 'GT', 'GTi'] },
  'E-208': { from: 2020, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2023, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['50 kWh 100 kW 136'] },
    { from: 2023, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['51 kWh 115 kW 156'] },
  ], packages: ['Active', 'Allure', 'GT'] },
  '301': { from: 2012, to: 2022, bodyType: 'Sedan', drives: [
    { to: 2016, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 VTi 72', '1.6 VTi 115'] },
    { to: 2016, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 VTi AT4 115'] },
    { to: 2016, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 HDi 92'] },
    { from: 2017, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 PureTech 82'] },
    { from: 2017, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 BlueHDi 100', '1.5 BlueHDi 100'] },
  ], packages: ['Access', 'Active', 'Allure'] },
  '308': { from: 2010, to: 2026, bodyType: 'Hatchback', drives: [
    { to: 2013, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 VTi 98', '1.6 VTi 120', '1.6 THP 156'] },
    { to: 2013, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 VTi AT4 120', '1.6 THP AT6 156'] },
    { to: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 HDi 92', '1.6 e-HDi 112'] },
    { from: 2014, to: 2021, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 PureTech 110', '1.2 PureTech 130', '1.6 THP 156', '1.6 THP GTi 270'] },
    { from: 2014, to: 2021, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 PureTech EAT6 130', '1.2 PureTech EAT8 130', '1.6 THP EAT6 156'] },
    { from: 2014, to: 2021, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 BlueHDi 100', '1.6 BlueHDi 120'] },
    { from: 2014, to: 2021, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 BlueHDi EAT6 120', '1.5 BlueHDi EAT8 130'] },
    { from: 2022, to: 2025, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 PureTech EAT8 130'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 BlueHDi EAT8 130'] },
    { from: 2022, to: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 Plug-in Hybrid e-EAT8 180', '1.6 Plug-in Hybrid e-EAT8 225'] },
    { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid e-DCS6 145'] },
  ], packages: ['Comfort', 'Premium', 'Active', 'Active Prime', 'Allure', 'Allure Selection', 'GT Line', 'GT', 'GTi'] },
  '308 SW': { from: 2010, to: 2025, bodyType: 'Station Wagon', drives: [
    { to: 2013, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 VTi 120', '1.6 THP 156'] },
    { to: 2013, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 HDi 92', '1.6 e-HDi 112'] },
    { from: 2014, to: 2021, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.2 PureTech 130'] },
    { from: 2014, to: 2021, fuel: 'Dizel', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 BlueHDi 120', '1.5 BlueHDi 130'] },
    { from: 2022, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 PureTech EAT8 130'] },
    { from: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 BlueHDi EAT8 130'] },
    { from: 2022, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 Plug-in Hybrid e-EAT8 180', '1.6 Plug-in Hybrid e-EAT8 225'] },
  ], packages: ['Access', 'Active', 'Allure', 'GT Line', 'GT'] },
  'E-308': { from: 2023, to: 2026, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['54 kWh 115 kW 156'] },
  ], packages: ['Allure', 'GT'] },
  '408': { from: 2011, to: 2026, bodyType: 'Sedan', drives: [
    { to: 2015, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 VTi 120', '1.6 THP 156'] },
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 HDi 112'] },
    { from: 2023, to: 2025, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 PureTech EAT8 130'] },
    { from: 2023, to: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 Plug-in Hybrid e-EAT8 225'] },
    { from: 2025, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid e-DCS6 145'] },
  ], packages: ['Comfort', 'Premium', 'Active Prime', 'Allure', 'GT'] },
  '407': { from: 2010, to: 2011, bodyType: 'Sedan', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 140', '2.2 163'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 HDi 110', '2.0 HDi 136'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 HDi AT6 136', '2.7 HDi V6 AT6 204'] },
  ], packages: ['Comfort', 'Executive', 'Premium'] },
  '508': { from: 2011, to: 2024, bodyType: 'Sedan', drives: [
    { to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 THP AT6 156', '1.6 THP EAT6 165'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 e-HDi 115', '1.6 BlueHDi 120'] },
    { to: 2018, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 e-HDi EGS6 115', '1.6 BlueHDi EAT6 120', '2.0 BlueHDi EAT6 180'] },
    { from: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 PureTech EAT8 180', '1.6 PureTech EAT8 225'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 BlueHDi EAT8 130'] },
    { from: 2020, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 Plug-in Hybrid e-EAT8 225', '1.6 PSE Plug-in Hybrid e-EAT8 360'] },
  ], packages: ['Access', 'Active', 'Active Prime', 'Allure', 'GT Line', 'GT', 'GT Selection', 'PSE'] },
  RCZ: { from: 2010, to: 2015, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 THP 156', '1.6 THP 200', '1.6 THP R 270'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 THP AT6 156'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.0 HDi 163'] },
  ], packages: ['Sport', 'GT Line', 'R'] },
  '2008': { from: 2013, to: 2026, bodyType: 'SUV', drives: [
    { to: 2019, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.2 VTi 82', '1.2 PureTech 110', '1.2 PureTech 130'] },
    { to: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 PureTech EAT6 110', '1.2 PureTech EAT6 130'] },
    { to: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 e-HDi 92', '1.6 BlueHDi 100', '1.6 BlueHDi 120'] },
    { from: 2020, to: 2025, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 PureTech EAT8 130'] },
    { from: 2020, to: 2022, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 BlueHDi EAT8 130'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid e-DCS6 136', '1.2 Hybrid e-DCS6 145'] },
  ], packages: ['Access', 'Active', 'Active Prime', 'Allure', 'Allure Selection', 'GT Line', 'GT'] },
  'E-2008': { from: 2020, to: 2026, bodyType: 'SUV', drives: [
    { to: 2023, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['50 kWh 100 kW 136'] },
    { from: 2024, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['54 kWh 115 kW 156'] },
  ], packages: ['Active', 'Allure', 'GT'] },
  '3008': { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2016, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 VTi 120', '1.6 THP 156'] },
    { to: 2016, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.6 THP AT6 156'] },
    { to: 2016, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 HDi 112', '1.6 BlueHDi 120'] },
    { to: 2016, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 e-HDi EGS6 115', '2.0 HDi AT6 163'] },
    { from: 2017, to: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 PureTech EAT8 130', '1.6 PureTech EAT8 180'] },
    { from: 2017, to: 2023, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 BlueHDi EAT6 120', '1.5 BlueHDi EAT8 130', '2.0 BlueHDi EAT8 180'] },
    { from: 2020, to: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.6 Plug-in Hybrid e-EAT8 225', '1.6 Hybrid4 e-EAT8 300'] },
    { from: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid e-DCS6 136', '1.2 Hybrid e-DCS6 145'] },
  ], packages: ['Access', 'Active', 'Active Prime', 'Allure', 'Allure Selection', 'GT Line', 'GT'] },
  'E-3008': { from: 2024, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['73 kWh 157 kW 210', '98 kWh Long Range 170 kW 230', '73 kWh Dual Motor 240 kW 320'] },
  ], packages: ['Allure', 'GT'] },
  '4007': { from: 2010, to: 2012, bodyType: 'SUV', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 HDi 156'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.2 HDi DCS6 156'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.4 CVT 170'] },
  ], packages: ['Premium', 'Feline'] },
  '4008': { from: 2012, to: 2017, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 VTi 115', '2.0 CVT 150'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 HDi 115', '1.8 HDi 150'] },
  ], packages: ['Access', 'Active', 'Allure'] },
  '5008': { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2016, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['1.6 VTi 120', '1.6 THP 156'] },
    { to: 2016, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 HDi 112', '1.6 BlueHDi 120'] },
    { to: 2016, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 e-HDi EGS6 115', '2.0 HDi AT6 163'] },
    { from: 2017, to: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['1.2 PureTech EAT8 130', '1.6 PureTech EAT8 180'] },
    { from: 2017, to: 2023, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 BlueHDi EAT8 130', '2.0 BlueHDi EAT8 180'] },
    { from: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['1.2 Hybrid e-DCS6 136', '1.2 Hybrid e-DCS6 145'] },
  ], packages: ['Access', 'Active', 'Active Prime', 'Allure', 'Allure Selection', 'GT Line', 'GT'] },
  'E-5008': { from: 2025, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['73 kWh 157 kW 210', '98 kWh Long Range 170 kW 230', '73 kWh Dual Motor 240 kW 320'] },
  ], packages: ['Allure', 'GT'] },
  Bipper: { from: 2010, to: 2017, bodyType: 'Panelvan', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.4 75'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.3 HDi 75', '1.4 HDi 70'] },
  ], packages: ['Comfort', 'Professional', 'Premium'] },
  'Partner Tepee': { from: 2010, to: 2018, bodyType: 'MPV', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['1.6 VTi 120'] },
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 HDi 90', '1.6 HDi 115', '1.6 BlueHDi 100', '1.6 BlueHDi 120'] },
    { from: 2015, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.6 BlueHDi ETG6 100'] },
  ], packages: ['Access', 'Active', 'Outdoor', 'Allure', 'Zenith'] },
  Rifter: { from: 2018, to: 2026, bodyType: 'MPV', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 BlueHDi 100', '1.5 BlueHDi 130'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 BlueHDi EAT8 130'] },
  ], packages: ['Active', 'Active Prime', 'Allure', 'GT Line', 'GT'] },
  'E-Rifter': { from: 2021, to: 2026, bodyType: 'MPV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['50 kWh 100 kW 136'] },
  ], packages: ['Active', 'Allure', 'GT'] },
  'Partner Van': { from: 2010, to: 2026, bodyType: 'Panelvan', drives: [
    { to: 2018, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 HDi 75', '1.6 HDi 90', '1.6 BlueHDi 100', '1.6 BlueHDi 120'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 BlueHDi 100', '1.5 BlueHDi 130'] },
    { from: 2019, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['1.5 BlueHDi EAT8 130'] },
  ], packages: ['Comfort', 'Professional', 'Premium', 'Grip'] },
  'Expert Van': { from: 2010, to: 2026, bodyType: 'Panelvan', drives: [
    { to: 2015, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.6 HDi 90', '2.0 HDi 128', '2.0 HDi 163'] },
    { from: 2016, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 BlueHDi 120', '2.0 BlueHDi 145'] },
    { from: 2016, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 BlueHDi EAT8 145', '2.0 BlueHDi EAT8 180'] },
  ], packages: ['Comfort', 'Professional', 'Premium', 'L2', 'L3'] },
  'Expert Traveller': { from: 2016, to: 2026, bodyType: 'MPV', drives: [
    { fuel: 'Dizel', transmissions: ['Manuel'], engines: ['1.5 BlueHDi 120', '2.0 BlueHDi 145'] },
    { fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['2.0 BlueHDi EAT8 145', '2.0 BlueHDi EAT8 180'] },
  ], packages: ['Active', 'Business', 'Allure', 'VIP'] },
  'Boxer Van': { from: 2010, to: 2026, bodyType: 'Panelvan', drives: [
    { to: 2014, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 HDi 100', '2.2 HDi 120', '3.0 HDi 157'] },
    { from: 2015, to: 2019, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 HDi 110', '2.2 HDi 130', '2.2 HDi 150'] },
    { from: 2020, fuel: 'Dizel', transmissions: ['Manuel'], engines: ['2.2 BlueHDi 120', '2.2 BlueHDi 140', '2.2 BlueHDi 165'] },
  ], packages: ['L1H1', 'L2H2', 'L3H2', 'L3H3', 'L4H3', 'Professional'] },
  iOn: { from: 2011, to: 2020, bodyType: 'Hatchback', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['16 kWh 49 kW 67'] },
  ], packages: ['Standard', 'Active'] },
};
