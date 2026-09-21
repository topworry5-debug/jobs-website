/**
 * Tainaati — Automated Daily Job Expiry Cron Script
 * Run on a scheduled basis (daily at midnight or via cron)
 * Can be run manually with: `npm run cron:expiry` or `node scripts/daily-job-expiry-cron.mjs`
 */

import fs from 'fs';
import path from 'path';
import { processJobsExpiry } from '../pipeline/engine/expiryManager.js';

export async function executeExpiryCron(referenceDate = new Date()) {
  const liveScrapedPath = path.resolve('src/data/liveScrapedJobs.json');
  console.log(`[Expiry Cron] Running automated daily expiry check at ${referenceDate.toISOString()}...`);

  if (!fs.existsSync(liveScrapedPath)) {
    console.warn(`[Expiry Cron] File not found: ${liveScrapedPath}`);
    return { success: false, reason: 'File not found' };
  }

  const rawJobs = JSON.parse(fs.readFileSync(liveScrapedPath, 'utf8'));
  const { updatedJobs, newlyArchivedCount } = processJobsExpiry(rawJobs, referenceDate);

  fs.writeFileSync(liveScrapedPath, JSON.stringify(updatedJobs, null, 2), 'utf8');

  const totalArchived = updatedJobs.filter(j => j.status === 'archived' || j.status === 'closed').length;
  const totalActive = updatedJobs.length - totalArchived;

  console.log(`[Expiry Cron] Expiry check complete.`);
  console.log(`  - Newly archived in this run: ${newlyArchivedCount}`);
  console.log(`  - Total active in store: ${totalActive}`);
  console.log(`  - Total archived in store: ${totalArchived}`);

  return {
    success: true,
    timestamp: new Date().toISOString(),
    newlyArchivedCount,
    totalActive,
    totalArchived
  };
}

// Standalone CLI execution
if (process.argv[1] && process.argv[1].includes('daily-job-expiry-cron.mjs')) {
  executeExpiryCron()
    .then(result => {
      if (result.success) {
        console.log(`\n✅ Expiry audit successfully executed.`);
        process.exit(0);
      } else {
        console.error(`\n❌ Expiry audit failed: ${result.reason}`);
        process.exit(1);
      }
    })
    .catch(err => {
      console.error("Fatal error executing daily expiry cron:", err);
      process.exit(1);
    });
}
