import { runWeeklyValuationCalibration } from '../lib/valuation-auto-calibration.js';

const report = await runWeeklyValuationCalibration(console);
console.log(JSON.stringify(report, null, 2));
