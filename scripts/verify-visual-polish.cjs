const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\974ebed1-b4d4-4fd6-81e8-55e43559661c');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.env.BASE_URL || 'https://tainaati.com';

async function main() {
  console.log('Starting Visual Polish & Dark Mode Live Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });

  const context = await browser.createBrowserContext(); // Incognito context
  const page = await context.newPage();

  try {
    // 1. Homepage & Commissions Grid (Desktop Dark Mode Default)
    console.log('1. Verifying Homepage & Commissions Grid (Desktop Dark)...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_visual_commissions_grid_desktop_dark.png') });
    console.log('✓ Captured test_visual_commissions_grid_desktop_dark.png');

    // 2. Toggle to Light Mode via Navbar Button
    console.log('2. Clicking theme toggle pill to switch to Light Mode...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 300));
    await page.click('.theme-toggle-pill');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_visual_homepage_light_mode.png') });
    console.log('✓ Captured test_visual_homepage_light_mode.png');

    // 3. Scroll to Commissions Grid & Footer in Light Mode
    await page.evaluate(() => window.scrollBy(0, 600));
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_visual_commissions_grid_light_mode.png') });
    console.log('✓ Captured test_visual_commissions_grid_light_mode.png');

    // 4. Toggle back to Dark Mode
    console.log('4. Clicking theme toggle pill to return to Dark Mode...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 300));
    await page.click('.theme-toggle-pill');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_visual_homepage_dark_mode.png') });
    console.log('✓ Captured test_visual_homepage_dark_mode.png');

    // 5. Test Exam Calendar Page
    console.log('5. Verifying /exams page...');
    await page.goto(`${BASE_URL}/exams`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_visual_exams_page_desktop.png') });
    console.log('✓ Captured test_visual_exams_page_desktop.png');

    // 6. Test Mobile 375px Viewport
    console.log('6. Verifying Mobile 375px Layout...');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_visual_mobile_375px_hero.png') });

    await page.evaluate(() => window.scrollBy(0, 450));
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_visual_mobile_375px_commissions_grid.png') });
    console.log('✓ Captured test_visual_mobile_375px_commissions_grid.png');

    console.log('🎉 All Visual Polish and Dark Mode verification steps completed successfully!');
  } catch (err) {
    console.error('Error during visual polish verification:', err);
  } finally {
    await browser.close();
  }
}

main();
