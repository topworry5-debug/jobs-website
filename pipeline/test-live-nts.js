/**
 * Test script for Live NTS Scraper
 * Run via: node pipeline/test-live-nts.js
 */

import { scrapeLiveNTS } from './scrapers/ntsLiveScraper.js';

async function testNTS() {
  console.log("==========================================================");
  console.log("Testing Live NTS HTML Scraper against https://www.nts.org.pk/new/projectsnew.php");
  console.log("==========================================================");

  const result = await scrapeLiveNTS();

  console.log(`Success: ${result.success}`);
  console.log(`Source: ${result.source}`);
  console.log(`Source URL: ${result.sourceUrl}`);
  console.log(`Total Live Jobs Parsed: ${result.count}`);

  if (result.success && result.jobs.length > 0) {
    console.log("\n--- LIVE RECRUITMENT PROJECTS EXTRACTED FROM NTS RIGHT NOW ---");
    result.jobs.forEach((job, index) => {
      console.log(`[#${index + 1}] Title: ${job.title}`);
      console.log(`    Dept: ${job.department}`);
      console.log(`    Closing Date: ${job.lastDate}`);
      console.log(`    Apply URL: ${job.officialUrl}`);
      console.log("----------------------------------------------------------");
    });
  } else {
    console.error("Scraper Error:", result.error);
  }
}

testNTS().catch(console.error);
