import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { prisma } from '../db.js';
import { vehicleCatalog } from '../data/vehicleCatalog.js';

// Bump the snapshot whenever catalog metadata changes. This forces existing
// deployments to refresh the DB copy instead of serving the old incomplete
// colour/package map forever.
const SETTING_KEY = 'vehicle_catalog_snapshot_v24';
const ALLOWED_CATEGORY_KEYS = new Set(['otomobil', 'arazi-suv-pickup', 'minivan-panelvan']);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type CatalogSnapshot = Record<string, unknown> & {
  valuationMetadata?: Record<string, unknown>;
  vehicleReferenceIndex?: Record<string, unknown>;
};

let memorySnapshot: CatalogSnapshot | null = null;

async function readStaticSnapshot(): Promise<CatalogSnapshot> {
  const candidates = [
    path.resolve(__dirname, '../assets'),
    path.resolve(__dirname, '../../src/assets'),
    path.resolve(process.cwd(), 'src/assets'),
    path.resolve(process.cwd(), 'dist/assets'),
    path.resolve(process.cwd(), '../ototeklifim-landing-web/assets'),
    path.resolve('/Users/mertpeyk/Projects/OtoTeklifim/ototeklifim-landing-web/assets'),
  ];

  for (const root of candidates) {
    try {
      const [catalog, metadata, referenceIndex, webPackageIndex] = await Promise.all([
        readFile(path.join(root, 'valuation-catalog.json'), 'utf8'),
        readFile(path.join(root, 'valuation-metadata.json'), 'utf8'),
        readFile(path.join(root, 'vehicle-reference-index.json'), 'utf8').catch(() => '{"version":2,"models":{}}'),
        readFile(path.join(root, 'web-package-index.json'), 'utf8').catch(() => '{"models":{}}'),
      ]);
      const valuation = JSON.parse(catalog) as Record<string, any>;
      const years = (valuation.years || []).map(String);
      const makesByYear = { ...(valuation.makesByYear || {}) } as Record<string, string[]>;
      const modelsByYearMake = { ...(valuation.modelsByYearMake || {}) } as Record<string, string[]>;
      // These maps are the complete engine source. Copy and normalize them
      // into the DB snapshot explicitly so an older/incomplete snapshot can
      // never silently drop model engine combinations.
      const enginesByKey = Object.fromEntries(
        Object.entries(valuation.enginesByKey || {}).map(([key, engines]) => [
          key,
          Array.from(new Set((Array.isArray(engines) ? engines : []).map(String))),
        ]),
      );
      const fuelTypesByKey = Object.fromEntries(
        Object.entries(valuation.fuelTypesByKey || {}).map(([key, fuels]) => [
          key,
          Array.from(new Set((Array.isArray(fuels) ? fuels : []).map(String))),
        ]),
      );
      const transmissionsByKey = Object.fromEntries(
        Object.entries(valuation.transmissionsByKey || {}).map(([key, transmissions]) => [
          key,
          Array.from(new Set((Array.isArray(transmissions) ? transmissions : []).map(String))),
        ]),
      );

      // Keep the admin/static catalogue additions (for example Mercedes E250)
      // in the same API tree even when the external valuation source has no row.
      for (const brand of (vehicleCatalog.brands || []) as Array<{ label: string; models: string[] }>) {
        for (const year of years) {
          makesByYear[year] = Array.from(new Set([...(makesByYear[year] || []), brand.label]));
          const key = `${year}|${brand.label}`;
          modelsByYearMake[key] = Array.from(new Set([...(modelsByYearMake[key] || []), ...(brand.models || [])]));
        }
      }

      const valuationMetadata = JSON.parse(metadata) as Record<string, any>;
      // Preserve the legacy UI seed in the DB snapshot as a catalog seed. It
      // is only used when a model has no engine row at all; model-specific
      // engines continue to come from enginesByKey/referenceIndex.
      valuationMetadata.genericEngineOptions = Array.from(new Set([
        ...(valuationMetadata.genericEngineOptions || []),
        '0.9 TwinAir', '1.0 TSI', '1.0 EcoBoost', '1.2 PureTech',
        '1.3 TCe', '1.4 TSI', '1.5 BlueHDi', '1.5 dCi', '1.5 EcoBoost',
        '1.6', '1.6 CRDi', '1.6 dCi', '1.6 HDi', '1.6 Multijet', '1.6 TDI',
        '1.6 T-GDI', '1.8 Hybrid', '2.0 TDI', '2.0 BlueHDi', '2.0 dCi',
        '2.0 TFSI', '2.2 CRDi', '2.5 Hybrid', '3.0 TDI', '3.0 TFSI',
        'Elektrik', 'Çift Motor Elektrik',
      ]));
      const vehicleReferenceIndex = JSON.parse(referenceIndex) as Record<string, unknown>;
      const webPackages = JSON.parse(webPackageIndex) as { models?: Record<string, unknown> };

      // Promote reference engines into the normal DB lookup maps as well.
      // This is important for EVs such as Tesla where the source has no
      // conventional displacement/fuel row but the UI still needs a usable
      // year -> fuel -> transmission -> engine path.
      const inferReferenceFuel = (engine: string) => {
        const value = engine.toLocaleLowerCase('tr-TR');
        if (/(electric|elektrik|ev\b)/.test(value) || brandIsElectric(vehicleReferenceIndex, engine)) return 'Elektrik';
        if (/(hybrid|hibrit|hev|phev|mhev)/.test(value)) return 'Hibrit';
        if (/(diesel|dizel|tdi|tdci|dci|hdi|crdi|cdti|jtd|mjet)/.test(value)) return 'Dizel';
        return 'Benzin';
      };
      const brandIsElectric = (_index: Record<string, unknown>, _engine: string) => false;
      for (const [referenceKey, enginePackages] of Object.entries(vehicleReferenceIndex.models || {})) {
        const [vehicleType, brand, model] = referenceKey.split('|');
        if (!brand || !model || !enginePackages || typeof enginePackages !== 'object') continue;
        const engines = Object.keys(enginePackages as Record<string, unknown>);
        if (!engines.length) continue;
        const fuel = engines.map(inferReferenceFuel).find(Boolean) || 'Benzin';
        const bodyTypes = vehicleType.toLocaleLowerCase('tr-TR').includes('elektrik') ? ['SUV', 'Sedan'] : ['Sedan'];
        for (const year of years) for (const bodyType of bodyTypes) {
          const key = `${year}|${brand}|${model}|${bodyType}|${fuel}|Otomatik`;
          enginesByKey[key] = Array.from(new Set([...(enginesByKey[key] || []), ...engines]));
          const fuelKey = `${year}|${brand}|${model}|${bodyType}`;
          fuelTypesByKey[fuelKey] = Array.from(new Set([...(fuelTypesByKey[fuelKey] || []), fuel]));
          transmissionsByKey[`${fuelKey}|${fuel}`] = Array.from(new Set([...(transmissionsByKey[`${fuelKey}|${fuel}`] || []), 'Otomatik']));
        }
      }
      // Keep the four Tesla nameplates usable even when an upstream reference
      // file only publishes a subset of their historical powertrain labels.
      const teslaEngines: Record<string, string[]> = {
        'Model 3': ['Long Range', 'Standart Plus'],
        'Model Y': ['Long Range (Juniper)', 'Long Range AWD', 'Performance (Legacy)', 'Premium (Juniper)', 'RWD (Juniper)', 'RWD (Legacy)', 'Standart (Juniper)'],
        'Model X': ['P100D'],
        'Model S': ['Elektrik'],
      };
      for (const [model, engines] of Object.entries(teslaEngines)) {
        for (const year of years) {
          const key = `${year}|Tesla|${model}|Sedan|Elektrik|Otomatik`;
          enginesByKey[key] = Array.from(new Set([...(enginesByKey[key] || []), ...engines]));
          const fuelKey = `${year}|Tesla|${model}|Sedan`;
          fuelTypesByKey[fuelKey] = ['Elektrik'];
          transmissionsByKey[`${fuelKey}|Elektrik`] = ['Otomatik'];
        }
      }

      // Store the EV rule in the DB snapshot itself. Clients should not infer
      // this from a brand name or fall back to the generic fuel list.
      for (const [fuelKey, fuels] of Object.entries(fuelTypesByKey)) {
        if (!fuels.length || !fuels.every((fuel) => fuel === 'Elektrik')) continue;
        fuelTypesByKey[fuelKey] = ['Elektrik'];
        const prefix = `${fuelKey}|Elektrik`;
        const engineValues = Object.entries(enginesByKey)
          .filter(([key]) => key.startsWith(`${prefix}|`))
          .flatMap(([, engines]) => engines);
        const electricEngineKey = `${prefix}|Otomatik`;
        if (engineValues.length) enginesByKey[electricEngineKey] = Array.from(new Set(engineValues));
        for (const key of Object.keys(transmissionsByKey)) {
          if (key.startsWith(prefix)) delete transmissionsByKey[key];
        }
        transmissionsByKey[prefix] = ['Otomatik'];
      }

      const modelPackages = { ...(valuationMetadata.modelPackages || {}) } as Record<string, string[]>;
      const brandPackages = { ...(valuationMetadata.brandPackages || {}) } as Record<string, string[]>;

      // TOGG Turkey powertrain/package data. Remove the legacy gasoline rows
      // first; TOGG's T10X and T10F are fully electric and use automatic drive.
      const toggCatalog: Record<string, { bodyType: string; engines: string[]; packages: string[] }> = {
        T10X: {
          bodyType: 'SUV',
          engines: ['V1 RWD', 'V2 RWD', 'V2 4More AWD'],
          packages: ['V1 RWD Standart Menzil', 'V1 RWD Uzun Menzil', 'V2 RWD Uzun Menzil', 'V2 4More Obsidiyen'],
        },
        T10F: {
          bodyType: 'Sedan',
          engines: ['V1 RWD', 'V2 RWD', 'V2 4More AWD'],
          packages: ['V1 RWD Standart Menzil', 'V2 RWD Uzun Menzil', 'V2 4More Obsidiyen'],
        },
      };
      for (const key of Object.keys(enginesByKey)) {
        if (key.includes('|TOGG|')) delete enginesByKey[key];
      }
      for (const key of Object.keys(fuelTypesByKey)) {
        if (key.includes('|TOGG|')) delete fuelTypesByKey[key];
      }
      for (const key of Object.keys(transmissionsByKey)) {
        if (key.includes('|TOGG|')) delete transmissionsByKey[key];
      }
      brandPackages.TOGG = Array.from(new Set(Object.values(toggCatalog).flatMap((details) => details.packages)));
      for (const [model, details] of Object.entries(toggCatalog)) {
        modelPackages[`TOGG|${model}`] = [...details.packages];
        for (const year of years) {
          const fuelKey = `${year}|TOGG|${model}|${details.bodyType}`;
          const driveKey = `${fuelKey}|Elektrik`;
          enginesByKey[driveKey] = [...details.engines];
          fuelTypesByKey[fuelKey] = ['Elektrik'];
          transmissionsByKey[driveKey] = ['Otomatik'];
        }
      }

      // Re-assert the TOGG motor rows after all catalog merges. This prevents
      // a later reference/import pass from hiding them behind an old key.
      const toggMotorRows: Record<string, string[]> = {
        T10X: ['V1 RWD', 'V2 RWD', 'V2 4More AWD'],
        T10F: ['V1 RWD', 'V2 RWD', 'V2 4More AWD'],
      };
      for (const [model, motors] of Object.entries(toggMotorRows)) {
        const bodyType = model === 'T10X' ? 'SUV' : 'Sedan';
        for (const year of years) {
          const fuelKey = `${year}|TOGG|${model}|${bodyType}`;
          const driveKey = `${fuelKey}|Elektrik`;
          enginesByKey[`${driveKey}|Otomatik`] = [...motors];
          fuelTypesByKey[fuelKey] = ['Elektrik'];
          transmissionsByKey[driveKey] = ['Otomatik'];
        }
      }

      // Complete the Chery, Jaguar and Volvo branches in the same DB maps.
      // These entries deliberately use the model names exposed by the public
      // catalog so fuel/transmission/engine/package selections stay aligned.
      const brandPowertrains: Record<string, Record<string, { bodyType: string; fuel: string; engines: string[]; packages: string[] }>> = {
        Chery: {
          'Tiggo 4 Pro': { bodyType: 'SUV', fuel: 'Benzin', engines: ['1.5 Turbo'], packages: ['Comfort', 'Luxury'] },
          'Tiggo 7 Pro': { bodyType: 'SUV', fuel: 'Benzin', engines: ['1.6 TGDI'], packages: ['Luxury', 'Excellent'] },
          'Tiggo 7 Pro Max': { bodyType: 'SUV', fuel: 'Benzin', engines: ['1.6 TGDI'], packages: ['Intelligent', 'Exceptional'] },
          'Tiggo 8 Pro': { bodyType: 'SUV', fuel: 'Benzin', engines: ['1.6 TGDI'], packages: ['Luxury', 'Excellent'] },
          'Tiggo 8 Pro Max': { bodyType: 'SUV', fuel: 'Benzin', engines: ['1.6 TGDI'], packages: ['Intelligent', 'Exceptional'] },
          'Omoda 5': { bodyType: 'SUV', fuel: 'Benzin', engines: ['1.6 TGDI'], packages: ['Comfort', 'Luxury'] },
          'Omoda E5': { bodyType: 'SUV', fuel: 'Elektrik', engines: ['61 kWh Elektrik'], packages: ['Comfort', 'Luxury'] },
          'Jaecoo 7': { bodyType: 'SUV', fuel: 'Benzin', engines: ['1.6 TGDI'], packages: ['Luxury', 'Excellence'] },
          'Jaecoo 8': { bodyType: 'SUV', fuel: 'Benzin', engines: ['1.6 TGDI'], packages: ['Luxury', 'Excellence'] },
        },
        Jaguar: {
          'E-Pace': { bodyType: 'SUV', fuel: 'Benzin', engines: ['1.5 PHEV', '2.0 Turbo'], packages: ['S', 'SE', 'R-Dynamic'] },
          'F-Pace': { bodyType: 'SUV', fuel: 'Benzin', engines: ['2.0 Turbo', '3.0 P400'], packages: ['R-Dynamic S', 'R-Dynamic SE', 'R-Dynamic HSE'] },
          'I-Pace': { bodyType: 'SUV', fuel: 'Elektrik', engines: ['400 PS Elektrik'], packages: ['S', 'SE', 'HSE'] },
          XE: { bodyType: 'Sedan', fuel: 'Benzin', engines: ['2.0 Turbo'], packages: ['S', 'SE', 'R-Dynamic'] },
          XF: { bodyType: 'Sedan', fuel: 'Benzin', engines: ['2.0 Turbo', '2.0 D'], packages: ['R-Dynamic S', 'R-Dynamic SE', 'R-Dynamic HSE'] },
          XJ: { bodyType: 'Sedan', fuel: 'Benzin', engines: ['3.0 V6'], packages: ['Luxury', 'Premium Luxury', 'Portfolio'] },
          'F-Type': { bodyType: 'Coupe', fuel: 'Benzin', engines: ['2.0 Turbo', '5.0 V8'], packages: ['R-Dynamic', 'R', 'First Edition'] },
        },
        Volvo: {
          EX30: { bodyType: 'SUV', fuel: 'Elektrik', engines: ['Single Motor', 'Twin Motor Performance'], packages: ['Core', 'Plus', 'Ultra'] },
          EX40: { bodyType: 'SUV', fuel: 'Elektrik', engines: ['Single Motor Extended Range', 'Twin Motor Performance'], packages: ['Plus', 'Ultra', 'Black Edition'] },
          EC40: { bodyType: 'SUV', fuel: 'Elektrik', engines: ['Single Motor Extended Range', 'Twin Motor Performance'], packages: ['Plus', 'Ultimate'] },
          XC40: { bodyType: 'SUV', fuel: 'Hibrit', engines: ['B3 Mild Hybrid', 'B4 Mild Hybrid'], packages: ['Core', 'Plus', 'Ultimate'] },
          XC60: { bodyType: 'SUV', fuel: 'Hibrit', engines: ['B5 Mild Hybrid', 'T6 Recharge', 'T8 Recharge'], packages: ['Core', 'Plus', 'Ultimate'] },
          XC90: { bodyType: 'SUV', fuel: 'Hibrit', engines: ['B5 Mild Hybrid', 'T8 Recharge'], packages: ['Core', 'Plus', 'Ultimate'] },
          S60: { bodyType: 'Sedan', fuel: 'Hibrit', engines: ['B3 Mild Hybrid', 'T8 Recharge'], packages: ['Core', 'Plus', 'Ultimate'] },
          S90: { bodyType: 'Sedan', fuel: 'Hibrit', engines: ['B5 Mild Hybrid', 'T8 Recharge'], packages: ['Plus', 'Ultimate'] },
          V60: { bodyType: 'Station Wagon', fuel: 'Hibrit', engines: ['B4 Mild Hybrid', 'T6 Recharge'], packages: ['Core', 'Plus', 'Ultimate'] },
          'V90 Cross Country': { bodyType: 'Station Wagon', fuel: 'Hibrit', engines: ['B5 Mild Hybrid'], packages: ['Plus', 'Ultimate'] },
        },
      };
      for (const [brand, models] of Object.entries(brandPowertrains)) {
        brandPackages[brand] = Array.from(new Set([...(brandPackages[brand] || []), ...Object.values(models).flatMap((details) => details.packages)]));
        for (const [model, details] of Object.entries(models)) {
          const modelKey = `${brand}|${model}`;
          modelPackages[modelKey] = Array.from(new Set([...(modelPackages[modelKey] || []), ...details.packages]));
          for (const year of years) {
            const fuelKey = `${year}|${brand}|${model}|${details.bodyType}`;
            const driveKey = `${fuelKey}|${details.fuel}`;
            enginesByKey[`${driveKey}|Otomatik`] = Array.from(new Set([...(enginesByKey[`${driveKey}|Otomatik`] || []), ...details.engines]));
            fuelTypesByKey[fuelKey] = Array.from(new Set([...(fuelTypesByKey[fuelKey] || []), details.fuel]));
            transmissionsByKey[driveKey] = ['Otomatik'];
          }
        }
      }

      const defaultPackages = Array.isArray(valuationMetadata.defaultPackages) && valuationMetadata.defaultPackages.length
        ? valuationMetadata.defaultPackages
        : ['Standart', 'Comfort', 'Prestige', 'Premium'];

      // BYD Turkey's current nameplates and powertrains. Keep these in the
      // DB maps so EV/DM-i combinations do not depend on a loose model alias.
      const bydCatalog: Record<string, { fuel: string; engines: string[]; packages: string[] }> = {
        'Atto 3': { fuel: 'Elektrik', engines: ['150 kW Elektrik'], packages: ['Comfort', 'Design'] },
        Dolphin: { fuel: 'Elektrik', engines: ['150 kW Elektrik'], packages: ['Comfort', 'Design', 'Premium'] },
        Seal: { fuel: 'Elektrik', engines: ['160 kW Design', '390 kW AWD Excellence'], packages: ['Design', 'Excellence AWD'] },
        Han: { fuel: 'Elektrik', engines: ['380 kW AWD'], packages: ['Executive AWD'] },
        'Seal U': { fuel: 'Hibrit', engines: ['1.5L DM-i 160 kW'], packages: ['Design', 'DM-i Design'] },
      };
      for (const [model, details] of Object.entries(bydCatalog)) {
        const modelKey = `BYD|${model}`;
        modelPackages[modelKey] = Array.from(new Set([...(modelPackages[modelKey] || []), ...details.packages]));
        brandPackages.BYD = Array.from(new Set([...(brandPackages.BYD || []), ...details.packages]));
        for (const year of years) {
          const bodyType = model === 'Seal' || model === 'Han' ? 'Sedan' : 'SUV';
          const mapKey = `${year}|BYD|${model}|${bodyType}|${details.fuel}|Otomatik`;
          enginesByKey[mapKey] = Array.from(new Set([...(enginesByKey[mapKey] || []), ...details.engines]));
          const fuelKey = `${year}|BYD|${model}|${bodyType}`;
          fuelTypesByKey[fuelKey] = Array.from(new Set([...(fuelTypesByKey[fuelKey] || []), details.fuel]));
          transmissionsByKey[`${fuelKey}|${details.fuel}`] = ['Otomatik'];
        }
      }

      // MG4 is an EV-only nameplate. Keep it separate from MG's petrol and
      // hybrid models so the brand-level fuel list cannot leak into MG4.
      for (const key of Object.keys(enginesByKey)) if (key.includes('|MG|MG4|')) delete enginesByKey[key];
      for (const key of Object.keys(fuelTypesByKey)) if (key.includes('|MG|MG4|')) delete fuelTypesByKey[key];
      for (const key of Object.keys(transmissionsByKey)) if (key.includes('|MG|MG4|')) delete transmissionsByKey[key];
      const mg4Packages = ['Comfort', 'Luxury', 'XPower'];
      const mg4Engines = ['51 kWh Elektrik', '64 kWh Elektrik', '77 kWh Elektrik', 'XPower Çift Motor Elektrik'];
      modelPackages['MG|MG4'] = mg4Packages;
      brandPackages.MG = Array.from(new Set([...(brandPackages.MG || []), ...mg4Packages]));
      for (const year of years) {
        const fuelKey = `${year}|MG|MG4|Hatchback`;
        fuelTypesByKey[fuelKey] = ['Elektrik'];
        transmissionsByKey[`${fuelKey}|Elektrik`] = ['Otomatik'];
        enginesByKey[`${fuelKey}|Elektrik|Otomatik`] = mg4Engines;
      }

      // MG Turkey has mixed powertrains across the brand. Keep every
      // nameplate/submodel isolated so petrol, hybrid and EV options never
      // leak into one another through the brand-level maps.
      const mgPowertrains: Record<string, { bodyType: string; fuel: string; engines: string[]; packages: string[] }> = {
        ZS: { bodyType: 'SUV', fuel: 'Benzin', engines: ['1.0 T-GDI', '1.5 VTi-tech'], packages: ['Comfort', 'Luxury'] },
        'ZS EV': { bodyType: 'SUV', fuel: 'Elektrik', engines: ['44.5 kWh Elektrik', '72 kWh Elektrik'], packages: ['Comfort', 'Luxury'] },
        'ZS Hybrid+': { bodyType: 'SUV', fuel: 'Hibrit', engines: ['1.5 Hybrid+'], packages: ['Comfort', 'Luxury'] },
        HS: { bodyType: 'SUV', fuel: 'Benzin', engines: ['1.5 T-GDI'], packages: ['Comfort', 'Luxury'] },
        'HS Hybrid+': { bodyType: 'SUV', fuel: 'Hibrit', engines: ['1.5 Turbo Hybrid+'], packages: ['Comfort', 'Luxury'] },
        'HS PHEV': { bodyType: 'SUV', fuel: 'Hibrit', engines: ['1.5 T-GDI eHS PHEV'], packages: ['Comfort', 'Luxury'] },
        EHS: { bodyType: 'SUV', fuel: 'Hibrit', engines: ['1.5 T-GDI eHS PHEV'], packages: ['Comfort', 'Luxury'] },
        MG5: { bodyType: 'Sedan', fuel: 'Elektrik', engines: ['50.3 kWh Elektrik', '61.1 kWh Elektrik'], packages: ['Comfort', 'Luxury'] },
        'Marvel R': { bodyType: 'SUV', fuel: 'Elektrik', engines: ['70 kWh Elektrik', '70 kWh Çift Motor Elektrik'], packages: ['Comfort', 'Luxury', 'Performance'] },
        MG7: { bodyType: 'Sedan', fuel: 'Benzin', engines: ['1.5 T-GDI'], packages: ['Luxury', 'Trophy'] },
      };
      for (const [model, details] of Object.entries(mgPowertrains)) {
        for (const key of Object.keys(enginesByKey)) if (key.includes(`|MG|${model}|`)) delete enginesByKey[key];
        for (const key of Object.keys(fuelTypesByKey)) if (key.includes(`|MG|${model}|`)) delete fuelTypesByKey[key];
        for (const key of Object.keys(transmissionsByKey)) if (key.includes(`|MG|${model}|`)) delete transmissionsByKey[key];
        const modelKey = `MG|${model}`;
        modelPackages[modelKey] = details.packages;
        brandPackages.MG = Array.from(new Set([...(brandPackages.MG || []), ...details.packages]));
        for (const year of years) {
          const fuelKey = `${year}|MG|${model}|${details.bodyType}`;
          const driveKey = `${fuelKey}|${details.fuel}`;
          fuelTypesByKey[fuelKey] = [details.fuel];
          const transmissions = model === 'ZS' ? ['Manuel', 'Otomatik'] : ['Otomatik'];
          transmissionsByKey[driveKey] = transmissions;
          for (const transmission of transmissions) {
            enginesByKey[`${driveKey}|${transmission}`] = details.engines;
          }
        }
      }

      // Opel Turkey trim names. Some historical engine keys use a different
      // spelling than the current catalog model key, so keep a normalized
      // model-level fallback in the DB snapshot as well.
      const opelPackages: Record<string, string[]> = {
        Corsa: ['Edition', 'GS', 'Ultimate'],
        'Corsa-e': ['GS', 'Ultimate'],
        Astra: ['Edition', 'Elegance', 'GS Line', 'Ultimate'],
        'Astra-e': ['GS', 'Ultimate'],
        Mokka: ['Edition', 'GS', 'Ultimate'],
        'Mokka-e': ['Edition', 'GS', 'Ultimate'],
        Grandland: ['Edition', 'GS', 'Ultimate'],
        Crossland: ['Edition', 'Elegance', 'Ultimate'],
        Combo: ['Edition', 'Elegance'],
        'Combo Life': ['Edition', 'Elegance'],
        Frontera: ['Edition', 'GS'],
        Zafira: ['Edition', 'Elegance', 'Ultimate'],
      };
      for (const [model, packages] of Object.entries(opelPackages)) {
        const modelKey = `Opel|${model}`;
        modelPackages[modelKey] = Array.from(new Set([...(modelPackages[modelKey] || []), ...packages]));
        brandPackages.Opel = Array.from(new Set([...(brandPackages.Opel || []), ...packages]));
      }

      // Hyundai Türkiye trim names. Keep these model-specific because the
      // same brand contains petrol, hybrid and EV nameplates with different
      // equipment families.
      const hyundaiPackages: Record<string, string[]> = {
        i10: ['Jump', 'Style', 'Style Plus', 'Elite'],
        i20: ['Jump', 'Style', 'Style Plus', 'Elite', 'Elite Plus', 'Prime', 'N Line'],
        i30: ['Comfort', 'Prime'],
        Elantra: ['Style', 'Elite'],
        Bayon: ['Jump', 'Style', 'Elite', 'Prime', 'N Line'],
        Kona: ['Prime'],
        'Kona EV': ['Advance'],
        Tucson: ['Comfort', 'Prime', 'Elite', 'Elite Plus', 'N Line'],
        'Santa Fe': ['Progressive', 'Elite', 'Prestige', 'Prime Plus'],
        'IONIQ 5': ['Dynamic Vision Roof', 'Advance'],
        'IONIQ 6': ['Advance'],
        'IONIQ 9': ['Progressive', 'Calligraphy'],
        INSTER: ['Dynamic', 'Advance', 'Cross Advance'],
        'STARIA HEV': ['Elite'],
      };
      for (const [model, packages] of Object.entries(hyundaiPackages)) {
        const modelKey = `Hyundai|${model}`;
        modelPackages[modelKey] = Array.from(new Set([...(modelPackages[modelKey] || []), ...packages]));
        brandPackages.Hyundai = Array.from(new Set([...(brandPackages.Hyundai || []), ...packages]));
      }

      // The reference index is the broadest trim source. Its values are
      // engine -> package arrays; fold them into the API's brand/model maps
      // so every referenced make/model gets its real package list in DB.
      for (const [referenceKey, enginePackages] of Object.entries(vehicleReferenceIndex.models || {})) {
        const [, brand, model] = referenceKey.split('|');
        if (!brand || !model || !enginePackages || typeof enginePackages !== 'object') continue;
        const packages = Object.values(enginePackages as Record<string, unknown>)
          .flatMap((value) => Array.isArray(value) ? value.map(String) : [])
          .map((value) => value.trim())
          .filter(Boolean);
        if (!packages.length) continue;
        const modelKey = `${brand}|${model}`;
        modelPackages[modelKey] = Array.from(new Set([...(modelPackages[modelKey] || []), ...packages]));
        brandPackages[brand] = Array.from(new Set([...(brandPackages[brand] || []), ...packages]));
      }

      // Merge externally researched Turkey-market trim names as a second,
      // clearly separated source. Existing curated/reference packages win by
      // retaining their values; web entries only add missing verified names.
      for (const [modelKey, packageList] of Object.entries(webPackages.models || {})) {
        const packages = Array.isArray(packageList) ? packageList.map(String).map((value) => value.trim()).filter(Boolean) : [];
        if (!packages.length) continue;
        const [, brand] = modelKey.split('|');
        modelPackages[modelKey] = Array.from(new Set([...(modelPackages[modelKey] || []), ...packages]));
        if (brand) brandPackages[brand] = Array.from(new Set([...(brandPackages[brand] || []), ...packages]));
      }

      // Cover every model exposed by the DB vehicle catalog, not only the
      // curated brand list. This closes the gap for older/less popular models
      // while keeping package names sourced from the corresponding brand.
      for (const [yearMakeKey, models] of Object.entries(modelsByYearMake)) {
        const [, brand] = yearMakeKey.split('|');
        const brandOptions = Array.isArray(brandPackages[brand]) && brandPackages[brand].length
          ? brandPackages[brand]
          : defaultPackages;
        for (const model of models || []) {
          const modelKey = `${brand}|${model}`;
          if (!Array.isArray(modelPackages[modelKey]) || !modelPackages[modelKey].length) {
            modelPackages[modelKey] = [...brandOptions];
          }
        }
      }

      // Every DB vehicle node must have a usable package list. The external
      // metadata only contains popular models, so fill missing model entries
      // from the brand list (or the global defaults) during the DB seed.
      for (const brand of (vehicleCatalog.brands || []) as Array<{ label: string; models: string[] }>) {
        const brandOptions = Array.isArray(brandPackages[brand.label]) && brandPackages[brand.label].length
          ? brandPackages[brand.label]
          : defaultPackages;
        for (const model of brand.models || []) {
          const key = `${brand.label}|${model}`;
          if (!Array.isArray(modelPackages[key]) || !modelPackages[key].length) {
            modelPackages[key] = [...brandOptions];
          }
        }
      }

      // Final authoritative TOGG package rows. Keep these after every merge so
      // imports cannot replace the exact model keys used by the forms.
      const toggPackages = {
        T10X: ['V1 RWD Standart Menzil', 'V1 RWD Uzun Menzil', 'V2 RWD Uzun Menzil', 'V2 4More Obsidiyen'],
        T10F: ['V1 RWD Standart Menzil', 'V2 RWD Uzun Menzil', 'V2 4More Obsidiyen'],
      };
      for (const [model, packages] of Object.entries(toggPackages)) {
        modelPackages[`TOGG|${model}`] = [...packages];
      }
      brandPackages.TOGG = Array.from(new Set(Object.values(toggPackages).flat()));

      const commonColors = Array.isArray(valuationMetadata.commonColors) && valuationMetadata.commonColors.length
        ? valuationMetadata.commonColors
        : vehicleCatalog.colorOptions;

      const allowedCategories = (vehicleCatalog.categories || []).filter((category: any) =>
        ALLOWED_CATEGORY_KEYS.has(category.key),
      );
      const allowedBrands = (vehicleCatalog.brands || [])
        .map((brand: any) => ({
          ...brand,
          categoryKeys: (brand.categoryKeys || []).filter((key: string) => ALLOWED_CATEGORY_KEYS.has(key)),
        }))
        .filter((brand: any) => brand.categoryKeys.length);

      return {
        ...vehicleCatalog,
        categories: allowedCategories,
        brands: allowedBrands,
        ...valuation,
        makesByYear,
        modelsByYearMake,
        enginesByKey,
        fuelTypesByKey,
        transmissionsByKey,
        vehicleReferenceIndex,
        valuationMetadata: {
          ...valuationMetadata,
          defaultPackages,
          modelPackages,
          commonColors,
        },
      };
    } catch {
      // Try the next deployment layout.
    }
  }

  return { ...vehicleCatalog };
}

export async function getVehicleCatalogSnapshot() {
  if (memorySnapshot) return memorySnapshot;

  try {
    const setting = await prisma.appSetting.findUnique({ where: { key: SETTING_KEY } });
    if (setting) {
      try {
        memorySnapshot = JSON.parse(setting.value) as CatalogSnapshot;
        return memorySnapshot;
      } catch {
        // Rebuild a corrupt/old snapshot below.
      }
    }

    const snapshot = await readStaticSnapshot();
    await prisma.appSetting.upsert({
      where: { key: SETTING_KEY },
      create: { key: SETTING_KEY, value: JSON.stringify(snapshot) },
      update: { value: JSON.stringify(snapshot) },
    });
    memorySnapshot = snapshot;
    return snapshot;
  } catch {
    // Catalog loading must never prevent the API from passing healthcheck.
    // The static catalog is still a valid source until the DB is available.
    memorySnapshot = await readStaticSnapshot();
    return memorySnapshot;
  }
}

export function clearVehicleCatalogCache() {
  memorySnapshot = null;
}
