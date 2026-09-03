const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\974ebed1-b4d4-4fd6-81e8-55e43559661c');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.env.BASE_URL || 'https://tainaati.com';

async function main() {
  console.log('Starting comprehensive verification of Deep Overhaul...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();

  try {
    // -------------------------------------------------------------
    // 1. QUICK SEARCH MODAL VERIFICATION
    // -------------------------------------------------------------
    console.log('1. Testing Quick Search overlay modal on desktop (1440px)...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.click('.search-trigger-btn');
    await new Promise(r => setTimeout(r, 600));
    await page.type('.quick-search-native-input', 'FPSC Assistant');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_quick_search_active.png') });
    console.log('✓ Quick search modal active screenshot captured');

    // Close modal via Escape
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));

    // -------------------------------------------------------------
    // 2. NAVBAR DESKTOP & LAPTOP OVERFLOW VERIFICATION
    // -------------------------------------------------------------
    console.log('2. Testing Navbar at 1440px desktop width...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_navbar_1440px.png') });

    console.log('3. Testing Navbar at 1280px laptop width...');
    await page.setViewport({ width: 1280, height: 800 });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_navbar_1280px.png') });

    // -------------------------------------------------------------
    // 3. MOBILE-FIRST 375PX & 390PX VIEWPORT TESTS
    // -------------------------------------------------------------
    console.log('4. Testing Mobile Homepage at 375px (iPhone SE)...');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_375px_homepage.png') });

    console.log('5. Testing Mobile Slide-Out Menu Drawer at 375px...');
    await page.evaluate(() => {
      document.querySelector('.mobile-menu-toggle')?.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_375px_drawer_open.png') });

    // Close drawer
    await page.evaluate(() => {
      document.querySelector('.mobile-menu-drawer .action-btn-sm')?.click();
    });
    await new Promise(r => setTimeout(r, 400));

    console.log('6. Testing Mobile Govt Jobs Feed at 375px...');
    await page.goto(`${BASE_URL}/jobs/govt`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_375px_govt_jobs.png') });

    console.log('7. Testing Mobile Filter Bottom Sheet at 375px...');
    await page.evaluate(() => {
      document.querySelector('.mobile-filter-open-btn')?.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_375px_filter_drawer.png') });

    // Close filter drawer
    await page.evaluate(() => {
      document.querySelector('.mobile-filter-drawer-header .action-btn-sm')?.click();
    });
    await new Promise(r => setTimeout(r, 400));

    console.log('8. Testing Mobile CV Builder at 375px...');
    await page.goto(`${BASE_URL}/cv-builder`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_375px_cv_builder.png') });

    console.log('9. Testing Mobile Exam Calendar at 375px...');
    await page.goto(`${BASE_URL}/exams`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_375px_exam_calendar.png') });

    console.log('10. Testing Mobile Test Prep Hub at 375px...');
    await page.goto(`${BASE_URL}/test-prep`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_375px_test_prep.png') });

    console.log('🎉 All 10 verification screenshots successfully captured!');
  } catch (err) {
    console.error('Error during overhaul verification:', err);
  } finally {
    await browser.close();
  }
}

main();
