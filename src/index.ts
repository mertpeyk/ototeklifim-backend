import { env } from './config.js';
import { buildApp } from './app.js';
import { startValuationCalibrationScheduler } from './lib/valuation-auto-calibration.js';
import { getVehicleCatalogSnapshot } from './lib/vehicle-catalog-db.js';

const app = buildApp();
startValuationCalibrationScheduler(app.log);

const start = async () => {
  try {
    void getVehicleCatalogSnapshot().catch((error) => {
      app.log.warn({ error }, 'Vehicle catalog DB unavailable; using static catalog fallback');
    });
    await app.listen({
      host: '0.0.0.0',
      port: env.PORT,
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
