export type TeslaDrive = {
  from?: number;
  to?: number;
  fuel: 'Elektrik';
  transmissions: Array<'Otomatik'>;
  engines: string[];
};

export type TeslaModel = {
  from: number;
  to: number;
  bodyType: 'Coupe' | 'Sedan' | 'SUV' | 'Pickup';
  drives: TeslaDrive[];
  packages: string[];
};

// Production Tesla catalogue for 2010-2026. Announced but undelivered models
// (new Roadster and Semi as a passenger vehicle) are deliberately excluded.
export const teslaCatalog: Record<string, TeslaModel> = {
  Roadster: { from: 2010, to: 2012, bodyType: 'Coupe', drives: [
    { fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['53 kWh RWD 248 HP', 'Roadster Sport RWD 288 HP'] },
  ], packages: ['Roadster 2.0', 'Roadster 2.5', 'Roadster Sport'] },
  'Model S': { from: 2012, to: 2026, bodyType: 'Sedan', drives: [
    { from: 2012, to: 2015, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['40 kWh RWD', '60 kWh RWD', '85 kWh RWD', 'P85 RWD', 'P85+ RWD'] },
    { from: 2014, to: 2016, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['60D Dual Motor AWD', '70 RWD', '70D Dual Motor AWD', '85D Dual Motor AWD', '90D Dual Motor AWD', 'P85D Dual Motor AWD', 'P90D Dual Motor AWD'] },
    { from: 2016, to: 2019, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['60 RWD', '60D Dual Motor AWD', '75 RWD', '75D Dual Motor AWD', '90D Dual Motor AWD', '100D Dual Motor AWD', 'P90D Dual Motor AWD', 'P100D Dual Motor AWD'] },
    { from: 2019, to: 2020, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Standard Range Dual Motor AWD', 'Long Range Dual Motor AWD', 'Long Range Plus Dual Motor AWD', 'Performance Dual Motor AWD'] },
    { from: 2021, to: 2026, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Dual Motor AWD', 'Plaid Tri Motor AWD'] },
  ], packages: ['40', '60', '70', '75', '85', '90D', '100D', 'Performance', 'Long Range', 'Long Range Plus', 'Plaid'] },
  'Model X': { from: 2015, to: 2026, bodyType: 'SUV', drives: [
    { from: 2015, to: 2016, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['60D Dual Motor AWD', '70D Dual Motor AWD', '75D Dual Motor AWD', '90D Dual Motor AWD', 'P90D Dual Motor AWD'] },
    { from: 2016, to: 2019, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['75D Dual Motor AWD', '90D Dual Motor AWD', '100D Dual Motor AWD', 'P100D Dual Motor AWD'] },
    { from: 2019, to: 2020, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Long Range Dual Motor AWD', 'Long Range Plus Dual Motor AWD', 'Performance Dual Motor AWD'] },
    { from: 2021, to: 2026, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Dual Motor AWD', 'Plaid Tri Motor AWD'] },
  ], packages: ['60D', '70D', '75D', '90D', '100D', 'Performance', 'Long Range', 'Long Range Plus', 'Plaid'] },
  'Model 3': { from: 2017, to: 2026, bodyType: 'Sedan', drives: [
    { from: 2017, to: 2018, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Long Range RWD', 'Long Range Dual Motor AWD', 'Performance Dual Motor AWD'] },
    { from: 2018, to: 2019, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Mid Range RWD'] },
    { from: 2019, to: 2020, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Standard Range RWD', 'Standard Range Plus RWD', 'Long Range Dual Motor AWD', 'Performance Dual Motor AWD'] },
    { from: 2021, to: 2023, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['RWD', 'Long Range Dual Motor AWD', 'Performance Dual Motor AWD'] },
    { from: 2024, to: 2026, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['RWD', 'Long Range RWD', 'Long Range Dual Motor AWD', 'Performance Dual Motor AWD'] },
  ], packages: ['Standard Range', 'Standard Range Plus', 'Mid Range', 'RWD', 'Long Range RWD', 'Long Range AWD', 'Performance'] },
  'Model Y': { from: 2020, to: 2026, bodyType: 'SUV', drives: [
    { from: 2020, to: 2021, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Standard Range RWD', 'Long Range Dual Motor AWD', 'Performance Dual Motor AWD'] },
    { from: 2022, to: 2024, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['RWD', 'Long Range Dual Motor AWD', 'Performance Dual Motor AWD'] },
    { from: 2025, to: 2026, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['RWD', 'Long Range RWD', 'Long Range Dual Motor AWD', 'Performance Dual Motor AWD'] },
  ], packages: ['Standard Range', 'RWD', 'Long Range RWD', 'Long Range AWD', 'Performance', 'Launch Series'] },
  Cybertruck: { from: 2023, to: 2026, bodyType: 'Pickup', drives: [
    { from: 2023, to: 2024, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['All-Wheel Drive Dual Motor', 'Cyberbeast Tri Motor'] },
    { from: 2025, to: 2026, fuel: 'Elektrik', transmissions: ['Otomatik'], engines: ['Long Range RWD', 'All-Wheel Drive Dual Motor', 'Premium All-Wheel Drive Dual Motor', 'Cyberbeast Tri Motor'] },
  ], packages: ['Long Range', 'All-Wheel Drive', 'Premium All-Wheel Drive', 'Cyberbeast', 'Foundation Series'] },
};
