/**
 * Tainaati — Live Pipeline Sync to Frontend Store
 * Executes all 5 live government scrapers (PPSC, NTS, SPSC, KPPSC, FPSC),
 * deduplicates against base data, and writes the updated live jobs into `src/data/liveScrapedJobs.json`.
 */

import fs from 'fs';
import path from 'path';
import { runFullPipeline } from './engine/pipelineRunner.js';

async function sync() {
  console.log("[Tainaati Sync] Running live government scrapers to generate frontend store...");
  const result = await runFullPipeline();

  const outputPath = path.resolve('src/data/liveScrapedJobs.json');
  fs.writeFileSync(outputPath, JSON.stringify(result.updatedActiveJobs, null, 2), 'utf-8');

  console.log(`[Tainaati Sync] Successfully saved ${result.updatedActiveJobs.length} live verified jobs to ${outputPath}`);
}

sync().catch(console.error);
