import { scrapeLivePPSC } from '../pipeline/scrapers/ppscLiveScraper.js';

async function testPPSC() {
  console.log("==================================================================");
  console.log("FETCHING LIVE PPSC PORTAL (https://www.ppsc.gop.pk/Jobs.aspx)");
  console.log("==================================================================");

  const result = await scrapeLivePPSC();

  console.log(`Success: ${result.success}`);
  console.log(`Source: ${result.source}`);
  console.log(`Source URL: ${result.sourceUrl}`);
  console.log(`Extracted Count: ${result.count}`);
  console.log(`Timestamp: ${result.timestamp}\n`);

  console.log("==================================================================");
  console.log("RAW PPSC SCRAPED LISTINGS (BATCH 1 FOR MANUAL USER REVIEW)");
  console.log("==================================================================");

  result.jobs.forEach((job, idx) => {
    console.log(`\n[Job #${idx + 1}]`);
    console.log(`  Title:         ${job.title}`);
    console.log(`  Raw Title:     ${job.rawTitle}`);
    console.log(`  Department:    ${job.department}`);
    console.log(`  BPS Scale:     ${job.bpsScale}`);
    console.log(`  City / Domicile: ${job.city} (${job.province})`);
    console.log(`  Closing Date:  ${job.lastDate}`);
    console.log(`  Vacancies:     ${job.vacancies === null ? 'Refer to Gazette' : job.vacancies}`);
    console.log(`  Official Link: ${job.officialUrl}`);
    console.log(`  Gazette Label: ${job.officialSourceLabel}`);
  });
}

testPPSC().catch(console.error);
