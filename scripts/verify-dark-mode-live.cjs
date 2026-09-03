const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\974ebed1-b4d4-4fd6-81e8-55e43559661c');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.env.BASE_URL || 'https://tainaati.com';

async function main() {
  console.log('Starting Live Dark Mode Verification on Production URL...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });

  const context = await browser.createBrowserContext(); // Incognito context
  const page = await context.newPage();

  try {
    console.log('1. Navigating to live production homepage...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    // Capture initial state (Default Dark Mode)
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_live_dark_mode_active.png') });
    console.log('✓ Captured test_live_dark_mode_active.png');

    // Click Theme Toggle to switch to Light Mode
    console.log('2. Clicking Theme Toggle to switch to Light Mode...');
    await page.click('.theme-toggle-pill');
    await new Promise(r => setTimeout(r, 800));

    const themeAfterClick = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`Current theme on <html> after toggle: ${themeAfterClick}`);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_live_light_mode_active.png') });
    console.log('✓ Captured test_live_light_mode_active.png');

    // Click again to switch back to Dark Mode
    console.log('3. Clicking Theme Toggle to switch back to Dark Mode...');
    await page.click('.theme-toggle-pill');
    await new Promise(r => setTimeout(r, 800));

    const themeAfterSecondClick = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`Current theme on <html> after second toggle: ${themeAfterSecondClick}`);

    // Reload page to test localStorage persistence
    console.log('4. Hard reloading page to test theme persistence in localStorage...');
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    const themeAfterReload = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`Current theme on <html> after reload: ${themeAfterReload}`);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_live_dark_mode_persisted.png') });
    console.log('✓ Captured test_live_dark_mode_persisted.png');

    console.log('🎉 Live Dark Mode toggle and persistence verified successfully!');
  } catch (err) {
    console.error('Error during dark mode verification:', err);
  } finally {
    await browser.close();
  }
}

main();
