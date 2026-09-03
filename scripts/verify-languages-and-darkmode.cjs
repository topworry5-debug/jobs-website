const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\974ebed1-b4d4-4fd6-81e8-55e43559661c');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.env.BASE_URL || 'https://tainaati.com';

async function main() {
  console.log('Starting Language Independence & Urdu Typography Live Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });

  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  try {
    // 1. English (Default)
    console.log('1. Loading site in English (Default)...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_lang_en_dark_mode.png') });
    console.log('✓ Captured test_lang_en_dark_mode.png');

    // Click theme toggle to Light Mode in English
    await page.click('.theme-toggle-pill');
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_lang_en_light_mode.png') });
    console.log('✓ Captured test_lang_en_light_mode.png');

    // Return to Dark Mode
    await page.click('.theme-toggle-pill');
    await new Promise(r => setTimeout(r, 400));

    // 2. Switch Language to Urdu (اردو)
    console.log('2. Switching language to Urdu (اردو)...');
    await page.click('.lang-dropdown-trigger');
    await new Promise(r => setTimeout(r, 300));
    // Click Urdu option
    const urduOption = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('.lang-option-btn'));
      return btns.find(b => b.textContent.includes('اردو'));
    });
    if (urduOption) {
      await urduOption.click();
    }
    await new Promise(r => setTimeout(r, 600));

    // Screenshot top hero in Urdu (verify theme toggle is visible in Urdu)
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_lang_ur_hero.png') });
    console.log('✓ Captured test_lang_ur_hero.png');

    // Scroll to Commissions Bar in Urdu
    await page.evaluate(() => window.scrollBy(0, 520));
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_lang_ur_commissions.png') });
    console.log('✓ Captured test_lang_ur_commissions.png');

    // Scroll to Footer in Urdu
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_lang_ur_footer.png') });
    console.log('✓ Captured test_lang_ur_footer.png');

    // 3. Switch Language to Roman Urdu
    console.log('3. Switching language to Roman Urdu...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 300));
    await page.click('.lang-dropdown-trigger');
    await new Promise(r => setTimeout(r, 300));
    const romanOption = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('.lang-option-btn'));
      return btns.find(b => b.textContent.includes('Roman'));
    });
    if (romanOption) {
      await romanOption.click();
    }
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_lang_roman_hero.png') });
    console.log('✓ Captured test_lang_roman_hero.png');

    // 4. Mobile 375px in Urdu
    console.log('4. Testing Mobile (375px) in Urdu...');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    // Switch back to Urdu
    await page.evaluate(() => {
      localStorage.setItem('tainaati_lang', 'ur');
    });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_lang_ur_mobile_375px_hero.png') });
    console.log('✓ Captured test_lang_ur_mobile_375px_hero.png');

    await page.evaluate(() => window.scrollBy(0, 1400));
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_lang_ur_mobile_375px_commissions.png') });
    console.log('✓ Captured test_lang_ur_mobile_375px_commissions.png');

    console.log('🎉 Verification finished successfully!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
  }
}

main();
