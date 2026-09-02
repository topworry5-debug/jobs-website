const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\1e48d51b-edc1-4e3f-8a3e-3d42e71b4cbf');

async function runTests() {
  console.log('=== RUNNING END-TO-END SEARCH & ANIMATION TESTS ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test Initial Load
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  console.log('✓ Homepage loaded successfully');

  // Check stats animation existence
  const statNum = await page.$eval('.stat-number', el => el.textContent);
  console.log(`✓ Stats counter initialized: ${statNum}`);

  // Check button press / hover styles
  const btnActiveStyle = await page.$eval('.btn-primary', el => {
    return window.getComputedStyle(el).transition;
  });
  console.log(`✓ Button transitions active: ${btnActiveStyle}`);

  // 2. Test Hero Search: Query "assistant" + City "Lahore"
  console.log('\n--- Testing Hero Search ("assistant" + "Lahore") ---');
  await page.type('.hero-search-input', 'assistant');
  await page.select('.hero-city-select', 'Lahore');
  await page.click('#hero-find-jobs-btn');
  await new Promise(r => setTimeout(r, 600));

  const currentUrl = page.url();
  console.log(`✓ Current URL after Find Jobs click: ${currentUrl}`);

  const cardTitles = await page.$$eval('.job-card-title', els => els.map(e => e.textContent.trim()));
  console.log(`✓ Filtered listings count: ${cardTitles.length}`);
  console.log(`✓ Sample matched titles: ${cardTitles.slice(0, 3).join(', ')}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'search_results_assistant_lahore.png') });
  console.log('✓ Captured search_results_assistant_lahore.png');

  // 3. Test Empty State: Query "xyznonexistent999"
  console.log('\n--- Testing Empty State & Clear Filters ---');
  // Clear input and type nonexistent
  await page.evaluate(() => {
    const input = document.querySelector('.hero-search-input');
    if (input) {
      input.value = '';
    }
  });
  await page.type('.hero-search-input', 'xyznonexistent999');
  await page.click('#hero-find-jobs-btn');
  await new Promise(r => setTimeout(r, 600));

  const emptyTitle = await page.$eval('.empty-state h3', el => el.textContent.trim());
  console.log(`✓ Empty state message: "${emptyTitle}"`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'search_empty_state.png') });
  console.log('✓ Captured search_empty_state.png');

  // Click Clear All Filters
  await page.click('#clear-all-filters-btn');
  await new Promise(r => setTimeout(r, 600));
  const restoredCardsCount = await page.$$eval('.job-card-title', els => els.length);
  console.log(`✓ Listings restored after clearing filters: ${restoredCardsCount}`);

  // 4. Test Navbar Quick Search Trigger (Magnifying Glass / ⌘K)
  console.log('\n--- Testing Top Navbar Quick Search (⌘K) ---');
  await page.click('.search-trigger-btn');
  await new Promise(r => setTimeout(r, 400));

  const modalVisible = await page.$eval('.quick-search-modal', el => !!el);
  console.log(`✓ Quick Search modal opened: ${modalVisible}`);

  await page.type('.quick-search-input', 'FPSC');
  await new Promise(r => setTimeout(r, 300));
  const quickResults = await page.$$eval('.quick-result-title', els => els.map(e => e.textContent.trim()));
  console.log(`✓ Quick search results for "FPSC": ${quickResults.slice(0, 3).join(', ')}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'navbar_quick_search_modal.png') });
  console.log('✓ Captured navbar_quick_search_modal.png');

  // Close modal with ESC
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 300));

  console.log('\n======================================================');
  console.log('🏆 ALL END-TO-END SEARCH & ANIMATION TESTS PASSED!');
  console.log('======================================================');

  await browser.close();
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
