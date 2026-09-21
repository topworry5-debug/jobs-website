/**
 * Tainaati — Live Pipeline Sync to Frontend Store
 * Executes all 6 live commission scrapers (FPSC, PPSC, SPSC, KPPSC, BPSC, NTS),
 * deduplicates against existing records, preserves archived entries for SEO URL retention,
 * and writes the updated live jobs into `src/data/liveScrapedJobs.json`.
 */

import fs from 'fs';
import path from 'path';
import { runFullPipeline } from './engine/pipelineRunner.js';

async function sync() {
  console.log("[Tainaati Sync] Running all 6 live commission scrapers (FPSC, PPSC, SPSC, KPPSC, BPSC, NTS)...");
  
  const outputPath = path.resolve('src/data/liveScrapedJobs.json');
  let existingJobs = [];
  if (fs.existsSync(outputPath)) {
    try {
      existingJobs = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    } catch {
      existingJobs = [];
    }
  }

  const result = await runFullPipeline(existingJobs);

  const jobsToSave = result.allJobs || result.updatedActiveJobs;
  fs.writeFileSync(outputPath, JSON.stringify(jobsToSave, null, 2), 'utf-8');

  console.log(`[Tainaati Sync] Successfully saved ${jobsToSave.length} total verified jobs (${result.updatedActiveJobs.length} active, ${jobsToSave.length - result.updatedActiveJobs.length} archived) to ${outputPath}`);
}

sync().catch(console.error);
