import { spawn } from 'node:child_process';

import { env } from './config.js';
import { buildApp } from './app.js';
import { startValuationCalibrationScheduler } from './lib/valuation-auto-calibration.js';
import { clearVehicleCatalogCache } from './lib/vehicle-catalog-db.js';

const app = buildApp();
startValuationCalibrationScheduler(app.log);

const start = async () => {
  try {
    await app.listen({
      host: '0.0.0.0',
      port: env.PORT,
    });

    const catalogRefresh = spawn(process.execPath, ['dist/scripts/vehicle-catalog-refresh.js'], {
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    catalogRefresh.stdout.on('data', (chunk) => app.log.info(String(chunk).trim()));
    catalogRefresh.stderr.on('data', (chunk) => app.log.warn(String(chunk).trim()));
    catalogRefresh.on('close', (code) => {
      if (code === 0) {
        clearVehicleCatalogCache();
        app.log.info('Vehicle catalog DB snapshot refreshed');
      } else {
        app.log.warn({ code }, 'Vehicle catalog DB snapshot refresh failed');
      }
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
