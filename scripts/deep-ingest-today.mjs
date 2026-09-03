import fs from 'fs';
import path from 'path';
import { runFullPipeline } from '../pipeline/engine/pipelineRunner.js';

async function main() {
  console.log("=================================================");
  console.log("Tainaati: Deep Ingest Pass for September 1, 2026");
  console.log("=================================================");

  const todayStr = "2026-09-01";
  console.log(`Target Date: ${todayStr}`);

  // Load current live jobs
  const liveJobsPath = path.resolve('src/data/liveScrapedJobs.json');
  let currentLiveJobs = [];
  if (fs.existsSync(liveJobsPath)) {
    try {
      currentLiveJobs = JSON.parse(fs.readFileSync(liveJobsPath, 'utf-8'));
    } catch (e) {
      currentLiveJobs = [];
    }
  }

  // Execute the full live scraper pipeline
  const result = await runFullPipeline(currentLiveJobs);

  console.log("\n--- INGESTION RESULTS ---");
  console.log(`Total Scraped From Live Sources: ${result.summary.totalRawScraped}`);
  console.log(`Duplicates Blocked: ${result.summary.duplicatesBlocked}`);
  console.log(`New Unique Ingested: ${result.summary.newUniqueIngested}`);
  console.log(`Total Active Ingested Store: ${result.updatedActiveJobs.length}`);

  // List all ingested jobs with today's postDate
  const todayJobs = result.updatedActiveJobs.filter(j => j.postDate === todayStr || j.isLiveScraped);
  console.log(`\nFound ${todayJobs.length} live verified jobs active/posted for ${todayStr}:`);
  todayJobs.slice(0, 15).forEach((job, idx) => {
    console.log(`${idx + 1}. [${job.agency || 'GOVT'}] ${job.title} — ${job.department} (Deadline: ${job.lastDate})`);
  });

  // Save to liveScrapedJobs.json
  fs.writeFileSync(liveJobsPath, JSON.stringify(result.updatedActiveJobs, null, 2), 'utf-8');
  console.log(`\nSuccessfully updated frontend store at ${liveJobsPath}`);
}

main().catch(console.error);
