const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\974ebed1-b4d4-4fd6-81e8-55e43559661c');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://jobs-website-delta.vercel.app';

async function main() {
  console.log('Starting verification of Official Logos and Ingested Jobs...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();

  try {
    // 1. Homepage Verification (Commissions bar with official logos + Jobs feed)
    console.log('1. Verifying Homepage on Production URL...');
    const startTime = Date.now();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;
    console.log(`✓ Homepage loaded in ${loadTime}ms`);

    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_homepage_official_logos.png') });
    console.log('✓ Captured test_homepage_official_logos.png');

    // 2. Click through from Homepage to Govt Jobs feed to verify today's new jobs reachability
    console.log('2. Clicking through to Govt Jobs feed...');
    await page.click('a[href="/jobs/govt"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_govt_feed_official_logos.png') });
    console.log('✓ Captured test_govt_feed_official_logos.png');

    // 3. Open a Job Detail Modal to verify the official crest in modal view
    console.log('3. Opening Job Modal to verify official crest...');
    await page.click('.card-view-btn');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_modal_official_logo.png') });
    console.log('✓ Captured test_modal_official_logo.png');

    // Close modal
    await page.click('.modal-close-btn');
    await new Promise(r => setTimeout(r, 400));

    // 4. Standalone Job Detail Page (FIA Assistant Director)
    console.log('4. Verifying standalone Job Detail page with FIA logo...');
    await page.goto(`${BASE_URL}/jobs/govt-fpsc-01`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_detail_fia_logo.png') });
    console.log('✓ Captured test_detail_fia_logo.png');

    // 5. Private Sector Feed with Company Logos (Systems Limited, SadaPay, Arbisoft)
    console.log('5. Verifying Private Sector feed with tech company logos...');
    await page.goto(`${BASE_URL}/jobs/private`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_private_company_logos.png') });
    console.log('✓ Captured test_private_company_logos.png');

    console.log('🎉 All logo and ingestion verification screenshots successfully captured!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
  }
}

main();
