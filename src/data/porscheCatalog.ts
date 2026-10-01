export type PorscheDrive = {
  from?: number;
  to?: number;
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
  transmissions: Array<'Manuel' | 'Otomatik'>;
  engines: string[];
};

export type PorscheModel = {
  from: number;
  to: number;
  bodyType: 'Coupe' | 'Sedan' | 'Station Wagon' | 'SUV';
  drives: PorscheDrive[];
  packages: string[];
};

// Türkiye-facing Porsche catalogue. Generations are bounded so discontinued
// combustion models and legacy diesel engines cannot leak into current EV/PHEV cars.
export const porscheCatalog: Record<string, PorscheModel> = {
  Boxster: { from: 2010, to: 2016, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.9 255', '2.7 265', '3.4 S 310', '3.4 S 315', '3.4 GTS 330', '3.8 Spyder 375'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.9 PDK 255', '2.7 PDK 265', '3.4 S PDK 310', '3.4 S PDK 315', '3.4 GTS PDK 330'] },
  ], packages: ['Boxster', 'Boxster S', 'GTS', 'Spyder', 'Black Edition'] },
  Cayman: { from: 2010, to: 2016, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.9 265', '2.7 275', '3.4 S 320', '3.4 S 325', '3.4 GTS 340', '3.8 GT4 385'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.9 PDK 265', '2.7 PDK 275', '3.4 S PDK 320', '3.4 S PDK 325', '3.4 GTS PDK 340'] },
  ], packages: ['Cayman', 'Cayman S', 'GTS', 'GT4', 'Black Edition'] },
  '718 Boxster': { from: 2016, to: 2025, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.0 Turbo 300', '2.5 Turbo S 350', '2.5 GTS 365', '4.0 GTS 400', '4.0 Spyder 420', '4.0 Spyder RS 500'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Turbo PDK 300', '2.5 Turbo S PDK 350', '2.5 GTS PDK 365', '4.0 GTS PDK 400', '4.0 Spyder PDK 420', '4.0 Spyder RS PDK 500'] },
  ], packages: ['718 Boxster', '718 Boxster Style Edition', '718 Boxster S', '718 Boxster GTS 4.0', '718 Spyder', '718 Spyder RS'] },
  '718 Cayman': { from: 2016, to: 2025, bodyType: 'Coupe', drives: [
    { fuel: 'Benzin', transmissions: ['Manuel'], engines: ['2.0 Turbo 300', '2.5 Turbo S 350', '2.5 GTS 365', '4.0 GTS 400', '4.0 GT4 420', '4.0 GT4 RS 500'] },
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Turbo PDK 300', '2.5 Turbo S PDK 350', '2.5 GTS PDK 365', '4.0 GTS PDK 400', '4.0 GT4 PDK 420', '4.0 GT4 RS PDK 500'] },
  ], packages: ['718 Cayman', '718 Cayman Style Edition', '718 Cayman S', '718 Cayman GTS 4.0', '718 Cayman GT4', '718 Cayman GT4 RS'] },
  '911 Carrera': { from: 2010, to: 2026, bodyType: 'Coupe', drives: [
    { to: 2011, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['3.6 Carrera 345', '3.8 Carrera S 385', '3.8 GTS 408'] },
    { from: 2012, to: 2015, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['3.4 Carrera 350', '3.8 Carrera S 400', '3.8 GTS 430'] },
    { from: 2016, to: 2019, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['3.0 Turbo Carrera 370', '3.0 Turbo Carrera S 420', '3.0 Turbo GTS 450'] },
    { from: 2020, to: 2023, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['3.0 Carrera 385', '3.0 Carrera S 450', '3.0 Carrera GTS 480'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['3.0 Carrera 394', '3.0 Carrera S 480'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['3.6 Carrera GTS T-Hybrid 541'] },
  ], packages: ['Carrera', 'Carrera Cabriolet', 'Carrera 4', 'Carrera 4 Cabriolet', 'Carrera S', 'Carrera S Cabriolet', 'Carrera 4S', 'Carrera 4S Cabriolet', 'Carrera T', 'Carrera GTS', 'Carrera 4 GTS'] },
  '911 Targa': { from: 2010, to: 2026, bodyType: 'Coupe', drives: [
    { to: 2011, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['3.6 Targa 4 345', '3.8 Targa 4S 385'] },
    { from: 2014, to: 2015, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['3.4 Targa 4 350', '3.8 Targa 4S 400', '3.8 Targa 4 GTS 430'] },
    { from: 2016, to: 2019, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['3.0 Targa 4 370', '3.0 Targa 4S 420', '3.0 Targa 4 GTS 450'] },
    { from: 2020, to: 2023, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['3.0 Targa 4 385', '3.0 Targa 4S 450', '3.0 Targa 4 GTS 480'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['3.0 Targa 4S 480'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['3.6 Targa 4 GTS T-Hybrid 541'] },
  ], packages: ['Targa 4', 'Targa 4S', 'Targa 4 GTS', 'Targa 4S Heritage Design Edition'] },
  '911 Turbo': { from: 2010, to: 2026, bodyType: 'Coupe', drives: [
    { to: 2013, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['3.8 Turbo 500', '3.8 Turbo S 530'] },
    { from: 2014, to: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.8 Turbo PDK 520', '3.8 Turbo S PDK 560', '3.8 Turbo PDK 540', '3.8 Turbo S PDK 580'] },
    { from: 2020, to: 2025, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.8 Turbo PDK 580', '3.8 Turbo S PDK 650'] },
    { from: 2026, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['3.6 Turbo S T-Hybrid 711'] },
  ], packages: ['Turbo', 'Turbo Cabriolet', 'Turbo S', 'Turbo S Cabriolet', '50 Years'] },
  '911 GT3': { from: 2010, to: 2026, bodyType: 'Coupe', drives: [
    { to: 2011, fuel: 'Benzin', transmissions: ['Manuel'], engines: ['3.8 GT3 435', '3.8 GT3 RS 450', '4.0 GT3 RS 500'] },
    { from: 2014, to: 2016, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.8 GT3 PDK 475', '4.0 GT3 RS PDK 500'] },
    { from: 2017, to: 2019, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['4.0 GT3 500', '4.0 GT3 RS 520'] },
    { from: 2021, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['4.0 GT3 510', '4.0 GT3 Touring 510', '4.0 GT3 RS PDK 525'] },
  ], packages: ['GT3', 'GT3 Touring', 'GT3 RS'] },
  Panamera: { from: 2010, to: 2026, bodyType: 'Sedan', drives: [
    { to: 2016, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['3.6 V6 300', '4.8 S 400', '4.8 GTS 430', '4.8 Turbo 500', '4.8 Turbo S 550'] },
    { to: 2017, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['3.0 V6 Diesel 250', '3.0 V6 Diesel 300', '4.0 V8 Diesel 422'] },
    { from: 2011, to: 2016, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['3.0 S Hybrid 380', '3.0 S E-Hybrid 416'] },
    { from: 2017, to: 2023, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.0 V6 330', '2.9 4S 440', '4.0 GTS 480', '4.0 Turbo 550', '4.0 Turbo S 630'] },
    { from: 2017, to: 2023, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.9 4 E-Hybrid 462', '2.9 4S E-Hybrid 560', '4.0 Turbo S E-Hybrid 700'] },
    { from: 2024, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.9 V6 353', '4.0 GTS 500'] },
    { from: 2024, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.9 4 E-Hybrid 470', '2.9 4S E-Hybrid 544', '4.0 Turbo E-Hybrid 680', '4.0 Turbo S E-Hybrid 782'] },
  ], packages: ['Panamera', 'Panamera 4', 'Panamera 4S', 'GTS', 'Turbo', 'Turbo S', '4 E-Hybrid', '4S E-Hybrid', 'Turbo E-Hybrid', 'Turbo S E-Hybrid', 'Executive'] },
  'Panamera Sport Turismo': { from: 2018, to: 2023, bodyType: 'Station Wagon', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.0 4 330', '2.9 4S 440', '4.0 GTS 480', '4.0 Turbo 550'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['2.9 4 E-Hybrid 462', '2.9 4S E-Hybrid 560', '4.0 Turbo S E-Hybrid 700'] },
  ], packages: ['Panamera 4', 'Panamera 4S', 'GTS', 'Turbo', '4 E-Hybrid', '4S E-Hybrid', 'Turbo S E-Hybrid'] },
  Macan: { from: 2014, to: 2025, bodyType: 'SUV', drives: [
    { to: 2018, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['3.0 V6 Diesel PDK 258'] },
    { to: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Turbo PDK 252', '3.0 S PDK 340', '3.0 GTS PDK 360', '3.6 Turbo PDK 400', '3.6 Turbo Performance PDK 440'] },
    { from: 2019, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['2.0 Turbo PDK 245', '2.0 Turbo PDK 265', '2.9 S PDK 354', '2.9 S PDK 380', '2.9 GTS PDK 380', '2.9 GTS PDK 440', '2.9 Turbo PDK 440'] },
  ], packages: ['Macan', 'Macan S', 'Macan GTS', 'Macan Turbo', 'Macan T'] },
  'Macan Electric': { from: 2024, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['100 kWh Macan 360', '100 kWh Macan 4 408', '100 kWh Macan 4S 516', '100 kWh Macan Turbo 639'] },
  ], packages: ['Macan', 'Macan 4', 'Macan 4S', 'Macan Turbo'] },
  Cayenne: { from: 2010, to: 2026, bodyType: 'SUV', drives: [
    { to: 2017, fuel: 'Dizel', transmissions: ['Otomatik'], engines: ['3.0 V6 Diesel 240', '3.0 V6 Diesel 245', '4.2 V8 Diesel S 382', '4.2 V8 Diesel S 385'] },
    { to: 2017, fuel: 'Benzin', transmissions: ['Manuel', 'Otomatik'], engines: ['3.6 V6 300', '3.6 GTS 440', '4.8 S 400', '4.8 GTS 420', '4.8 Turbo 500', '4.8 Turbo S 570'] },
    { from: 2011, to: 2017, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['3.0 S Hybrid 380', '3.0 S E-Hybrid 416'] },
    { from: 2018, fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.0 V6 340', '3.0 V6 353', '2.9 S 440', '3.0 S 474', '4.0 GTS 460', '4.0 GTS 500', '4.0 Turbo 550'] },
    { from: 2019, fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['3.0 E-Hybrid 462', '3.0 E-Hybrid 470', '4.0 Turbo E-Hybrid 680', '4.0 Turbo E-Hybrid 739'] },
  ], packages: ['Cayenne', 'Cayenne S', 'Cayenne GTS', 'Cayenne Turbo', 'Cayenne E-Hybrid', 'Cayenne Turbo E-Hybrid', 'Platinum Edition'] },
  'Cayenne Coupe': { from: 2019, to: 2026, bodyType: 'SUV', drives: [
    { fuel: 'Benzin', transmissions: ['Otomatik'], engines: ['3.0 V6 340', '3.0 V6 353', '2.9 S 440', '3.0 S 474', '4.0 GTS 460', '4.0 GTS 500', '4.0 Turbo GT 640', '4.0 Turbo GT 650'] },
    { fuel: 'Hibrit', transmissions: ['Otomatik'], engines: ['3.0 E-Hybrid 462', '3.0 E-Hybrid 470', '4.0 Turbo E-Hybrid 680', '4.0 Turbo E-Hybrid 739'] },
  ], packages: ['Cayenne Coupe', 'Cayenne S Coupe', 'Cayenne GTS Coupe', 'Cayenne Turbo Coupe', 'Cayenne Turbo GT', 'Cayenne E-Hybrid Coupe', 'Cayenne Turbo E-Hybrid Coupe'] },
  Taycan: { from: 2020, to: 2026, bodyType: 'Sedan', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['79.2 kWh Taycan 408', '93.4 kWh Taycan 476', '93.4 kWh 4S 530', '93.4 kWh 4S 571', '93.4 kWh GTS 598', '93.4 kWh Turbo 680', '93.4 kWh Turbo S 761', '105 kWh Taycan 435', '105 kWh 4S 598', '105 kWh GTS 700', '105 kWh Turbo 884', '105 kWh Turbo S 952', '105 kWh Turbo GT 1034'] },
  ], packages: ['Taycan', 'Taycan 4', 'Taycan 4S', 'Taycan GTS', 'Taycan Turbo', 'Taycan Turbo S', 'Taycan Turbo GT'] },
  'Taycan Cross Turismo': { from: 2021, to: 2026, bodyType: 'Station Wagon', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['93.4 kWh 4 476', '93.4 kWh 4S 571', '93.4 kWh Turbo 680', '93.4 kWh Turbo S 761', '105 kWh 4 435', '105 kWh 4S 598', '105 kWh Turbo 884', '105 kWh Turbo S 952'] },
  ], packages: ['Taycan 4 Cross Turismo', 'Taycan 4S Cross Turismo', 'Taycan Turbo Cross Turismo', 'Taycan Turbo S Cross Turismo'] },
  'Taycan Sport Turismo': { from: 2022, to: 2026, bodyType: 'Station Wagon', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['79.2 kWh Taycan 408', '93.4 kWh 4S 571', '93.4 kWh GTS 598', '93.4 kWh Turbo 680', '93.4 kWh Turbo S 761', '105 kWh Taycan 435', '105 kWh 4S 598', '105 kWh GTS 700', '105 kWh Turbo 884', '105 kWh Turbo S 952'] },
  ], packages: ['Taycan Sport Turismo', 'Taycan 4S Sport Turismo', 'Taycan GTS Sport Turismo', 'Taycan Turbo Sport Turismo', 'Taycan Turbo S Sport Turismo'] },
};
