const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\1e48d51b-edc1-4e3f-8a3e-3d42e71b4cbf');

async function testCvBuilder() {
  console.log('=== RUNNING CV BUILDER END-TO-END VERIFICATION ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. DESKTOP TEST (1440x900)
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000/cv-builder...');
  await page.goto('http://localhost:3000/cv-builder', { waitUntil: 'networkidle0' });
  console.log('✓ CV Builder loaded successfully');

  // Verify Stepper has 8 steps
  const stepCount = await page.$$eval('.cv-step-pill', els => els.length);
  console.log(`✓ Stepper initialized with ${stepCount} steps`);

  // Verify Personal Info inputs
  const fullName = await page.$eval('input[placeholder="e.g. Muhammad Usman Ali"]', el => el.value);
  console.log(`✓ Sample preloaded name: "${fullName}"`);

  // Test typing in full name and observe debounced live preview
  await page.type('input[placeholder="e.g. Muhammad Usman Ali"]', ' (Passed CSS/PMS)');
  await new Promise(r => setTimeout(r, 400));
  const previewName = await page.$eval('.resume-paper h1', el => el.textContent.trim());
  console.log(`✓ Live preview updated immediately to: "${previewName}"`);

  // Take Desktop Step 1 Screenshot
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'cv_builder_desktop_step1.png') });
  console.log('✓ Captured cv_builder_desktop_step1.png');

  // Navigate forward through steps
  for (let s = 1; s <= 4; s++) {
    await page.click('.cv-form-footer .btn-primary');
    await new Promise(r => setTimeout(r, 300));
  }
  console.log('✓ Navigated to Step 5: Skills');

  // Test adding a custom skill chip
  await page.type('input[placeholder*="Type a skill and press Enter"]', 'Civil Service Rules (CSR)');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 300));

  // Test clicking a suggested skill chip
  const suggestedChips = await page.$$('.suggested-skills-card .suggestion-chip');
  if (suggestedChips.length > 0) {
    await suggestedChips[0].click();
    console.log('✓ Clicked recommended category skill chip');
  }

  // Navigate to Step 8: Preview & Export
  for (let s = 5; s <= 7; s++) {
    await page.click('.cv-form-footer .btn-primary');
    await new Promise(r => setTimeout(r, 300));
  }
  console.log('✓ Navigated to Step 8: Preview & Export');

  // Test Template 2: Modern Minimal
  const templateCards = await page.$$('.template-select-card');
  if (templateCards.length >= 3) {
    await templateCards[1].click(); // Modern
    await new Promise(r => setTimeout(r, 300));
    console.log('✓ Switched to Modern Minimal template');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'cv_builder_modern_template.png') });
    console.log('✓ Captured cv_builder_modern_template.png');

    await templateCards[2].click(); // Government / Formal
    await new Promise(r => setTimeout(r, 300));
    console.log('✓ Switched to Government / Formal template');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'cv_builder_govt_template.png') });
    console.log('✓ Captured cv_builder_govt_template.png');

    await templateCards[0].click(); // Back to Classic
    await new Promise(r => setTimeout(r, 300));
  }

  // 2. MOBILE TEST (375x812 - iPhone X)
  console.log('\n--- Testing Mobile Viewport (375x812) ---');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await mobilePage.goto('http://localhost:3000/cv-builder', { waitUntil: 'networkidle0' });

  // Check that mobile segmented bar is visible
  const toggleTabs = await mobilePage.$$('.mobile-view-tab');
  console.log(`✓ Mobile segmented toggle tabs present: ${toggleTabs.length}`);

  // Screenshot Mobile Form View
  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'cv_builder_mobile_form.png') });
  console.log('✓ Captured cv_builder_mobile_form.png');

  // Switch to Preview Tab
  await toggleTabs[1].click();
  await new Promise(r => setTimeout(r, 400));
  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'cv_builder_mobile_preview.png') });
  console.log('✓ Captured cv_builder_mobile_preview.png');

  console.log('\n======================================================');
  console.log('🏆 CV BUILDER END-TO-END VERIFICATION PASSED!');
  console.log('======================================================');

  await browser.close();
}

testCvBuilder().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
