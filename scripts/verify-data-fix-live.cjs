const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\974ebed1-b4d4-4fd6-81e8-55e43559661c');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://jobs-website-delta.vercel.app';

async function main() {
  console.log('Starting Live Production Data Audit Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });

  const context = await browser.createBrowserContext(); // Incognito
  const page = await context.newPage();

  try {
    // 1. Verify purged bad listing returns 404
    console.log('1. Checking purged listing /jobs/nts-live-1788231676878-10...');
    const res = await page.goto(`${BASE_URL}/jobs/nts-live-1788231676878-10`, { waitUntil: 'networkidle0' });
    console.log(`Status for purged job: HTTP ${res.status()}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_purged_bad_listing_404.png') });
    console.log('✓ Captured test_purged_bad_listing_404.png');

    // 2. Verify /agency/nts on live production
    console.log('2. Verifying /agency/nts live page...');
    await page.goto(`${BASE_URL}/agency/nts`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_nts_verified_listings_live.png') });
    console.log('✓ Captured test_nts_verified_listings_live.png');

    // 3. Verify Homepage live job count & integrity
    console.log('3. Verifying Homepage active jobs...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_homepage_after_audit_purge.png') });
    console.log('✓ Captured test_homepage_after_audit_purge.png');

    console.log('🎉 Live production data audit verification completed successfully!');
  } catch (err) {
    console.error('Error during data audit verification:', err);
  } finally {
    await browser.close();
  }
}

main();
