import { env } from './config.js';
import { buildApp } from './app.js';
import { startValuationCalibrationScheduler } from './lib/valuation-auto-calibration.js';

const app = buildApp();
startValuationCalibrationScheduler(app.log);

const start = async () => {
  try {
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
