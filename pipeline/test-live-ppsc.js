/**
 * Test script for Live PPSC Scraper
 * Run via: node pipeline/test-live-ppsc.js
 */

import { scrapeLivePPSC } from './scrapers/ppscLiveScraper.js';

async function testPPSC() {
  console.log("==========================================================");
  console.log("Testing Live PPSC HTML Scraper against https://www.ppsc.gop.pk/Jobs.aspx");
  console.log("==========================================================");

  const result = await scrapeLivePPSC();

  console.log(`Success: ${result.success}`);
  console.log(`Source: ${result.source}`);
  console.log(`Source URL: ${result.sourceUrl}`);
  console.log(`Advertisement Extracted: Advt No. ${result.advtNo}`);
  console.log(`Total Live Jobs Parsed: ${result.count}`);

  if (result.success && result.jobs.length > 0) {
    console.log("\n--- SAMPLE LIVE JOBS EXTRACTED FROM PPSC RIGHT NOW ---");
    result.jobs.slice(0, 10).forEach((job, index) => {
      console.log(`[#${index + 1}] Title: ${job.title}`);
      console.log(`    Dept: ${job.department}`);
      console.log(`    Scale: ${job.bpsScale} | City: ${job.city}`);
      console.log(`    Source Ref: ${job.officialSourceLabel}`);
      console.log(`    Apply URL: ${job.officialUrl}`);
      console.log("----------------------------------------------------------");
    });
  } else {
    console.error("Scraper Error:", result.error);
  }
}

testPPSC().catch(console.error);
