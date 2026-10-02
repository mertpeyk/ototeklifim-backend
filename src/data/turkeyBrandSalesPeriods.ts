export type TurkeyBrandSalesPeriod = Readonly<{ from: number; to: number }>;

const continuous = (from = 2010, to = 2026): readonly TurkeyBrandSalesPeriod[] => [{ from, to }];

// Official new-vehicle sales/distributor presence in Turkey. This is stricter
// than the global reference index: grey imports and one-off imports must not
// appear in the year -> make selector. Multiple ranges preserve re-entries.
export const turkeyBrandSalesPeriods: Readonly<Record<string, readonly TurkeyBrandSalesPeriod[]>> = {
  Abarth: continuous(2010, 2018),
  'Alfa Romeo': continuous(), Alpine: continuous(2024), 'Aston Martin': continuous(), Audi: continuous(),
  BAIC: continuous(2024), BMC: continuous(), BMW: continuous(), BYD: continuous(2023), Bentley: continuous(),
  Cadillac: continuous(2026),
  Chery: [{ from: 2010, to: 2012 }, { from: 2023, to: 2026 }],
  Chevrolet: [{ from: 2010, to: 2015 }, { from: 2026, to: 2026 }],
  Chrysler: continuous(2010, 2012), 'Citroën': continuous(), Cupra: continuous(2018),
  DFM: continuous(2010, 2014), DFSK: continuous(2020), 'DS Automobiles': continuous(2015),
  Dacia: continuous(), Daihatsu: continuous(2010, 2015), Dodge: continuous(2010, 2012),
  Ferrari: continuous(), Fiat: continuous(), Ford: continuous(), Foton: continuous(),
  Geely: continuous(2010, 2012), 'Great Wall': continuous(2010, 2012), Honda: continuous(),
  Hongqi: continuous(2023), Hyundai: continuous(), Ineos: continuous(2024), Infiniti: continuous(2010, 2019),
  Isuzu: continuous(), 'Iveco - Otoyol': continuous(), Jaecoo: continuous(2024), Jaguar: continuous(),
  Jeep: continuous(), 'KGM SsangYong': continuous(2024), Kia: continuous(), Lada: continuous(2010, 2018),
  Lamborghini: continuous(), Lancia: continuous(2010, 2015), 'Land Rover': continuous(),
  Leapmotor: continuous(2024), Lexus: continuous(2016), Lotus: continuous(2024), MG: continuous(2021),
  MAN: continuous(), Maserati: continuous(), Maxus: continuous(2023), Mazda: continuous(2010, 2023),
  McLaren: continuous(2014), 'Mercedes-Benz': continuous(), Mini: continuous(), Mitsubishi: continuous(),
  Nissan: continuous(), Opel: continuous(), Peugeot: continuous(), Piaggio: continuous(), Porsche: continuous(),
  Proton: continuous(2010, 2012), Renault: continuous(), 'Rolls-Royce': continuous(),
  Saab: continuous(2010, 2012), Seat: continuous(), Skoda: continuous(), Skywell: continuous(2021),
  Smart: [{ from: 2010, to: 2020 }, { from: 2024, to: 2026 }],
  Subaru: continuous(), Suzuki: continuous(), SWM: continuous(2024), TOGG: continuous(2023),
  Tata: continuous(2010, 2015), Temsa: continuous(), Tesla: continuous(2023), 'Tofaş': continuous(2010, 2012),
  Toyota: continuous(), Volkswagen: continuous(), Volvo: continuous(),
};

export function hasOfficialTurkeySales(brand: string, year: number): boolean {
  return (turkeyBrandSalesPeriods[brand] || []).some((period) => year >= period.from && year <= period.to);
}
