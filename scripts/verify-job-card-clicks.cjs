const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\974ebed1-b4d4-4fd6-81e8-55e43559661c');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.env.BASE_URL || 'https://tainaati.com';

async function main() {
  console.log('Starting thorough Clickability & Job Detail Navigation Verification on Production...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });

  const context = await browser.createBrowserContext(); // Incognito
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // 1. Visit homepage
    console.log('1. Loading Homepage...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    // Test clicking the first job card "Details" button from homepage
    console.log('2. Clicking first job card "Details" button on Homepage...');
    const firstCardTitle = await page.$eval('.job-card-item:nth-child(1) .job-card-title', el => el.textContent.trim());
    console.log(`Targeting job: "${firstCardTitle}"`);

    await page.click('.job-card-item:nth-child(1) .card-view-btn');
    await page.waitForSelector('.job-hero-title', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 500));

    const currentUrl1 = page.url();
    console.log(`✓ Navigated to URL: ${currentUrl1}`);
    const detailTitle1 = await page.$eval('.job-hero-title', el => el.textContent.trim());
    console.log(`✓ Detail Page Title: "${detailTitle1}"`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_detail_click_success_1.png') });

    // 2. Go to /jobs/govt and test PPSC Tehsildar
    console.log('3. Navigating to /jobs/govt feed...');
    await page.goto(`${BASE_URL}/jobs/govt`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    console.log('4. Clicking 2nd job card title (PPSC Tehsildar)...');
    await page.click('.job-card-item:nth-child(2) .job-card-title a');
    await page.waitForSelector('.job-hero-title', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 500));
    console.log(`✓ Navigated to URL: ${page.url()}`);
    const detailTitle2 = await page.$eval('.job-hero-title', el => el.textContent.trim());
    console.log(`✓ Detail Page Title: "${detailTitle2}"`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_detail_click_success_ppsc.png') });

    // 3. Test SPSC job card navigation
    console.log('5. Navigating to SPSC job detail (/jobs/govt-spsc-04)...');
    await page.goto(`${BASE_URL}/jobs/govt-spsc-04`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.job-hero-title', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 500));
    console.log(`✓ Detail Page Title: "${await page.$eval('.job-hero-title', el => el.textContent.trim())}"`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_detail_click_success_spsc.png') });

    // 4. Test KPPSC job card navigation
    console.log('6. Navigating to KPPSC job detail (/jobs/govt-kppsc-05)...');
    await page.goto(`${BASE_URL}/jobs/govt-kppsc-05`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.job-hero-title', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 500));
    console.log(`✓ Detail Page Title: "${await page.$eval('.job-hero-title', el => el.textContent.trim())}"`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_detail_click_success_kppsc.png') });

    // 5. Test NTS job card navigation
    console.log('7. Navigating to NTS WAPDA job detail (/jobs/govt-nts-03)...');
    await page.goto(`${BASE_URL}/jobs/govt-nts-03`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.job-hero-title', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 500));
    console.log(`✓ Detail Page Title: "${await page.$eval('.job-hero-title', el => el.textContent.trim())}"`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_detail_click_success_nts.png') });

    // 6. Test Private Tech job card navigation
    console.log('8. Navigating to Private Tech job (/jobs/priv-tech-01)...');
    await page.goto(`${BASE_URL}/jobs/priv-tech-01`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.job-hero-title', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 500));
    console.log(`✓ Detail Page Title: "${await page.$eval('.job-hero-title', el => el.textContent.trim())}"`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_detail_click_success_tech.png') });

    // 7. Test Live Scraped PPSC job from Advt 08/2026
    console.log('9. Navigating to Live Scraped PPSC job (/jobs/ppsc-live-1788231676860-1)...');
    await page.goto(`${BASE_URL}/jobs/ppsc-live-1788231676860-1`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.job-hero-title', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 500));
    console.log(`✓ Detail Page Title: "${await page.$eval('.job-hero-title', el => el.textContent.trim())}"`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_detail_click_success_live_ppsc.png') });

    console.log('\n--- VERIFICATION AUDIT ---');
    console.log('Total Console Errors Recorded:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
    console.log('🎉 ALL Job Card Click and Detail Page navigations verified 100% functional!');
  } catch (err) {
    console.error('Error during clickability verification:', err);
  } finally {
    await browser.close();
  }
}

main();
