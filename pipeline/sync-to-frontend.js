/**
 * Tainaati — Live Pipeline Sync to Frontend Store
 * Executes all 6 live commission scrapers (FPSC, PPSC, SPSC, KPPSC, BPSC, NTS),
 * validates against strict official source criteria, deduplicates using stable IDs,
 * preserves archived entries for URL retention, enforces integrity safeguards,
 * and writes updated jobs atomically into `src/data/liveScrapedJobs.json`.
 */

import fs from 'fs';
import path from 'path';
import { runFullPipeline } from './engine/pipelineRunner.js';
import { cleanScrapedJob } from './utils/textCleaner.js';

async function sync() {
  const isDryRun = process.argv.includes('--dry-run') || process.env.DRY_RUN === 'true';
  const modeLabel = isDryRun ? '[DRY RUN]' : '[LIVE SYNC]';

  console.log(`${modeLabel} Running Tainaati government scrapers (FPSC, PPSC, NTS, SPSC, KPPSC, BPSC)...`);

  const outputPath = path.resolve('src/data/liveScrapedJobs.json');
  let existingJobs = [];
  if (fs.existsSync(outputPath)) {
    try {
      existingJobs = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    } catch {
      existingJobs = [];
    }
  }

  const previousCount = existingJobs.length;
  console.log(`${modeLabel} Loaded ${previousCount} existing records from ${outputPath}`);

  const result = await runFullPipeline(existingJobs);
  const jobsToSave = (result.allJobs || []).map(cleanScrapedJob);
  const activeCount = result.updatedActiveJobs ? result.updatedActiveJobs.length : 0;
  const archivedCount = result.archivedJobs ? result.archivedJobs.length : 0;

  console.log(`\n========================================`);
  console.log(`${modeLabel} SCRAPER PIPELINE EXECUTION REPORT`);
  console.log(`========================================`);
  console.log(`Total Scraped Sources Evaluated: ${result.summary.sourceReports.length}`);
  console.log(`Raw Scraped Records: ${result.summary.totalRawScraped}`);
  console.log(`Valid Scraped Records: ${result.summary.validScraped}`);
  console.log(`Rejected Malformed Records: ${result.summary.rejectedScraped}`);
  console.log(`New Unique Records Ingested: ${result.summary.newUniqueIngested}`);
  console.log(`Total Dataset After Merge: ${jobsToSave.length} (${activeCount} active, ${archivedCount} archived)`);
  console.log(`----------------------------------------`);
  console.log(`Per-Source Breakdown:`);

  result.summary.sourceReports.forEach((report, i) => {
    const reportJobs = report.jobs || [];
    const activeInSource = reportJobs.filter(j => j.status === 'active' || (j.lastDate && j.lastDate >= new Date().toISOString().split('T')[0])).length;
    console.log(`  [${i + 1}] ${report.source.padEnd(52)} | Status: ${report.status.padEnd(7)} | Scraped: ${String(report.scrapedCount).padEnd(2)} | Active: ${activeInSource}`);
  });

  // Safeguard 1: Total count must not be 0
  if (jobsToSave.length === 0) {
    throw new Error(`[CRITICAL SAFEGUARD] Pipeline produced 0 total jobs! Refusing to overwrite and wipe data store.`);
  }

  // Safeguard 2: Total count must not drop below 50% of previous count
  if (previousCount > 0 && jobsToSave.length < previousCount * 0.5) {
    throw new Error(`[CRITICAL SAFEGUARD] Total job count dropped from ${previousCount} to ${jobsToSave.length} (< 50%). Refusing to overwrite!`);
  }

  if (isDryRun) {
    console.log(`\n${modeLabel} Safeguards PASSED. No disk modifications performed (dry-run mode).`);
    return;
  }

  // Atomic write via temporary file
  const tempPath = `${outputPath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(jobsToSave, null, 2), 'utf-8');
  fs.renameSync(tempPath, outputPath);

  console.log(`\n${modeLabel} Atomically saved ${jobsToSave.length} jobs (${activeCount} active, ${archivedCount} archived) to ${outputPath}`);
}

sync().catch(err => {
  console.error(`[Pipeline Error] ${err.message}`);
  process.exit(1);
});
