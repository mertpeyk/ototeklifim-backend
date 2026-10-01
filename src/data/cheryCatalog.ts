export type CheryModel = {
  from: number;
  to: number;
  engine: string;
  packages: string[];
};

// Chery Türkiye passenger-car catalog. The brand entered the Turkish market
// with this SUV range in 2023; OMODA/Jaecoo EV-era sub-brands are not folded
// into Chery unless they were sold locally with Chery badging.
export const cheryCatalog: Record<string, CheryModel> = {
  'OMODA 5': {
    from: 2023, to: 2024,
    engine: '1.6 TGDI 183 PS - 7 İleri DCT',
    packages: ['Comfort', 'Luxury', 'Excellent'],
  },
  'TIGGO 7 PRO': {
    from: 2023, to: 2024,
    engine: '1.6 TGDI 183 PS - 7 İleri DCT',
    packages: ['Comfort', 'Luxury', 'Excellent'],
  },
  'TIGGO 8 PRO': {
    from: 2023, to: 2024,
    engine: '1.6 TGDI 183 PS - 7 İleri DCT',
    packages: ['Luxury', 'Excellent', 'Avantgarde'],
  },
  'TIGGO 7 PRO MAX': {
    from: 2024, to: 2025,
    engine: '1.6 TGDI 145 PS - 7 İleri DCT',
    packages: ['Intelligent', 'Exceptional'],
  },
  'TIGGO 8 PRO MAX': {
    from: 2024, to: 2025,
    engine: '1.6 TGDI 145 PS - 7 İleri DCT',
    packages: ['Intelligent', 'Exceptional'],
  },
  'TIGGO 7': {
    from: 2025, to: 2026,
    engine: '1.6 TGDI - 7 İleri DCT',
    packages: ['Prestige 4x2'],
  },
  'TIGGO 8': {
    from: 2025, to: 2026,
    engine: '1.6 TGDI - 7 İleri DCT',
    packages: ['Prestige 4x2'],
  },
};
