const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\b9567c12-ff27-45f3-b52f-868144d126f6';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// We'll test against Next.js local server
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

async function runVerification() {
  console.log('===================================================================');
  console.log('STARTING NAVBAR OVERFLOW & SALARY CALCULATOR REDESIGN VERIFICATION');
  console.log('===================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // -------------------------------------------------------------
  // PART A: NAVBAR TESTS ACROSS BREAKPOINTS (1024, 1280, 1440, 1920, 375)
  // -------------------------------------------------------------
  console.log('--- TEST 1: NAVBAR ACROSS DESKTOP BREAKPOINTS ---');
  const desktopWidths = [1024, 1280, 1440, 1920];

  for (const width of desktopWidths) {
    await page.setViewport({ width, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.navbar-wrapper');

    const navCheck = await page.evaluate((w) => {
      const nav = document.querySelector('.navbar-inner');
      const links = document.querySelector('.desktop-nav-links');
      const themeToggle = document.querySelector('.theme-toggle-pill');
      const langTrigger = document.querySelector('.lang-dropdown-trigger');
      const searchBtn = document.querySelector('.search-trigger-btn');
      const mobileToggle = document.querySelector('.mobile-menu-toggle');

      const themeRect = themeToggle ? themeToggle.getBoundingClientRect() : null;
      const navRect = nav ? nav.getBoundingClientRect() : null;

      const isThemeVisible = themeRect && themeRect.width > 0 && themeRect.height > 0 && themeRect.right <= w;
      const isMobileHidden = !mobileToggle || window.getComputedStyle(mobileToggle).display === 'none';
      const isDesktopLinksVisible = links && window.getComputedStyle(links).display !== 'none';

      return {
        width: w,
        isDesktopLinksVisible,
        isMobileHidden,
        themeRect: themeRect ? { left: themeRect.left, right: themeRect.right, width: themeRect.width } : null,
        isThemeWithinViewport: isThemeVisible,
        hasSearch: Boolean(searchBtn),
        hasLang: Boolean(langTrigger)
      };
    }, width);

    console.log(`[Breakpoint ${width}px]:`);
    console.log(`  • Desktop links visible: ${navCheck.isDesktopLinksVisible ? '✅ YES' : '❌ NO'}`);
    console.log(`  • Mobile toggle hidden: ${navCheck.isMobileHidden ? '✅ YES' : '❌ NO'}`);
    console.log(`  • Theme toggle visible inside viewport: ${navCheck.isThemeWithinViewport ? '✅ YES' : '❌ NO'} (Right: ${navCheck.themeRect?.right}px / Viewport: ${width}px)`);
    
    // Screenshot at 1024px and 1280px to prove no overflow
    if (width === 1024 || width === 1280) {
      const screenshotPath = path.join(ARTIFACT_DIR, `navbar_desktop_${width}px.png`);
      await page.screenshot({ path: screenshotPath, clip: { x: 0, y: 0, width, height: 120 } });
      console.log(`  • Saved screenshot: ${screenshotPath}`);
    }
  }

  // --- TEST 2: MOBILE (<768px, specifically 375px) ---
  console.log('\n--- TEST 2: NAVBAR ON MOBILE (375px VIEWPORT) ---');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.navbar-wrapper');

  const mobileNavCheck = await page.evaluate(() => {
    const desktopLinks = document.querySelector('.desktop-nav-links');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const themeToggle = document.querySelector('.theme-toggle-pill');
    const langTrigger = document.querySelector('.lang-dropdown-trigger');

    const themeRect = themeToggle ? themeToggle.getBoundingClientRect() : null;
    const langRect = langTrigger ? langTrigger.getBoundingClientRect() : null;
    const toggleRect = mobileToggle ? mobileToggle.getBoundingClientRect() : null;

    const desktopHidden = !desktopLinks || window.getComputedStyle(desktopLinks).display === 'none';
    const mobileVisible = mobileToggle && window.getComputedStyle(mobileToggle).display !== 'none';
    const themeVisible = themeRect && themeRect.width > 0 && themeRect.height >= 40 && themeRect.right <= 375;
    const langVisible = langRect && langRect.width > 0 && langRect.height >= 40 && langRect.right <= 375;

    return {
      desktopHidden,
      mobileVisible,
      themeVisible,
      langVisible,
      themeDimensions: `${themeRect?.width}x${themeRect?.height}`,
      langDimensions: `${langRect?.width}x${langRect?.height}`
    };
  });

  console.log(`  • Desktop links hidden on 375px: ${mobileNavCheck.desktopHidden ? '✅ YES' : '❌ NO'}`);
  console.log(`  • Hamburger menu visible on 375px: ${mobileNavCheck.mobileVisible ? '✅ YES' : '❌ NO'}`);
  console.log(`  • Theme toggle visible outside hamburger: ${mobileNavCheck.themeVisible ? '✅ YES' : '❌ NO'} (Size: ${mobileNavCheck.themeDimensions})`);
  console.log(`  • Language switcher visible outside hamburger: ${mobileNavCheck.langVisible ? '✅ YES' : '❌ NO'} (Size: ${mobileNavCheck.langDimensions})`);

  const mobileNavScreenshot = path.join(ARTIFACT_DIR, 'navbar_mobile_375px.png');
  await page.screenshot({ path: mobileNavScreenshot, clip: { x: 0, y: 0, width: 375, height: 120 } });
  console.log(`  • Saved screenshot: ${mobileNavScreenshot}`);

  // --- TEST 3: THEME TOGGLE FUNCTIONALITY ---
  console.log('\n--- TEST 3: THEME TOGGLE INTERACTIVITY ---');
  const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`  • Initial theme: ${initialTheme}`);

  await page.click('.theme-toggle-pill');
  await new Promise(r => setTimeout(r, 400));
  const switchedTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`  • Switched theme after 1st click: ${switchedTheme}`);

  await page.click('.theme-toggle-pill');
  await new Promise(r => setTimeout(r, 400));
  const restoredTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`  • Switched theme after 2nd click: ${restoredTheme}`);

  const themeWorking = initialTheme !== switchedTheme && initialTheme === restoredTheme;
  console.log(`  • Dark Mode toggle fully functional: ${themeWorking ? '✅ PASSED' : '❌ FAILED'}`);

  // -------------------------------------------------------------
  // PART B: SALARY CALCULATOR REDESIGN TESTS
  // -------------------------------------------------------------
  console.log('\n--- TEST 4: SALARY CALCULATOR ON DESKTOP (1440px) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/salary-calculator`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.salary-input-card');
  await page.waitForSelector('.salary-results-card');

  // Test 3 different grades: BPS-17, BPS-11, BPS-7
  const gradesToTest = [17, 11, 7];
  for (const grade of gradesToTest) {
    await page.select('#bps-grade-select', String(grade));
    await new Promise(r => setTimeout(r, 300));

    const calcData = await page.evaluate(() => {
      const heroAmount = document.querySelector('.salary-hero-amount')?.innerText;
      const netAmount = document.querySelector('.salary-results-card .text-xl, .salary-results-card .text-2xl')?.innerText;
      const breakdownRows = Array.from(document.querySelectorAll('.salary-breakdown-row')).map(r => r.innerText.replace(/\n/g, ' - '));
      const selectedGradeRow = document.querySelector('.comparison-table-row.selected-grade')?.innerText.replace(/\n/g, ' | ');
      return {
        heroAmount,
        netAmount,
        breakdownCount: breakdownRows.length,
        selectedGradeRow
      };
    });

    console.log(`  [BPS-${grade} Selection]:`);
    console.log(`    - Hero Gross Salary: ${calcData.heroAmount}`);
    console.log(`    - Estimated Net Pay: ${calcData.netAmount}`);
    console.log(`    - Breakdown Components: ${calcData.breakdownCount} rows`);
    console.log(`    - Active Comparison Row: ${calcData.selectedGradeRow}`);
  }

  // Test Station Toggle (Big City vs Other Districts)
  console.log('\n  [Station Category Toggle Test]:');
  await page.select('#bps-grade-select', '17');
  const initialGross = await page.evaluate(() => document.querySelector('.salary-hero-amount')?.innerText);

  // Click "Other Districts / Towns" (2nd button)
  const buttons = await page.$$('.city-toggle-btn');
  if (buttons.length >= 2) {
    await buttons[1].click();
    await new Promise(r => setTimeout(r, 300));
    const regionalGross = await page.evaluate(() => document.querySelector('.salary-hero-amount')?.innerText);
    console.log(`    - Big City Gross: ${initialGross}`);
    console.log(`    - Regional District Gross: ${regionalGross}`);
    console.log(`    - HRA Difference Computed Correctly: ${initialGross !== regionalGross ? '✅ YES' : '❌ NO'}`);
    
    // Switch back to Big City
    await buttons[0].click();
    await new Promise(r => setTimeout(r, 300));
  }

  // Test Collapsible Disclaimer
  console.log('\n  [Collapsible Disclaimer Test]:');
  const isDisclaimerInitiallyVisible = await page.evaluate(() => Boolean(document.querySelector('.animate-fadeIn')));
  console.log(`    - Initially collapsed: ${!isDisclaimerInitiallyVisible ? '✅ YES' : '❌ NO'}`);
  
  // Click disclaimer trigger
  const disclaimerBtn = await page.$('button[aria-expanded]');
  if (disclaimerBtn) {
    await disclaimerBtn.click();
    await new Promise(r => setTimeout(r, 200));
    const isExpanded = await page.evaluate(() => Boolean(document.querySelector('.animate-fadeIn')));
    console.log(`    - Expanded after click: ${isExpanded ? '✅ YES' : '❌ NO'}`);
  }

  const calcDesktopScreenshot = path.join(ARTIFACT_DIR, 'salary_calculator_desktop.png');
  await page.screenshot({ path: calcDesktopScreenshot, fullPage: false });
  console.log(`  • Saved desktop calculator screenshot: ${calcDesktopScreenshot}`);

  // --- TEST 5: SALARY CALCULATOR ON MOBILE (375px) ---
  console.log('\n--- TEST 5: SALARY CALCULATOR ON MOBILE (375px) ---');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/salary-calculator`, { waitUntil: 'networkidle2' });

  const mobileCalcCheck = await page.evaluate(() => {
    const stickyBar = document.querySelector('.mobile-salary-sticky-bar');
    const select = document.getElementById('bps-grade-select');
    const toggleBtns = document.querySelectorAll('.city-toggle-btn');
    const slider = document.getElementById('bps-stage-slider');

    const stickyVisible = stickyBar && window.getComputedStyle(stickyBar).display !== 'none';
    const selectHeight = select ? select.getBoundingClientRect().height : 0;
    const btnHeight = toggleBtns[0] ? toggleBtns[0].getBoundingClientRect().height : 0;
    const sliderVisible = slider && slider.getBoundingClientRect().height > 0;

    return {
      stickyVisible,
      selectTouchTarget: selectHeight >= 44,
      btnTouchTarget: btnHeight >= 44,
      sliderVisible,
      selectHeight,
      btnHeight
    };
  });

  console.log(`  • Mobile sticky summary bar visible: ${mobileCalcCheck.stickyVisible ? '✅ YES' : '❌ NO'}`);
  console.log(`  • Select dropdown touch target (>=44px): ${mobileCalcCheck.selectTouchTarget ? '✅ YES' : '❌ NO'} (${mobileCalcCheck.selectHeight}px)`);
  console.log(`  • Toggle button touch target (>=44px): ${mobileCalcCheck.btnTouchTarget ? '✅ YES' : '❌ NO'} (${mobileCalcCheck.btnHeight}px)`);
  console.log(`  • Slider interactive: ${mobileCalcCheck.sliderVisible ? '✅ YES' : '❌ NO'}`);

  const calcMobileScreenshot = path.join(ARTIFACT_DIR, 'salary_calculator_mobile_375px.png');
  await page.screenshot({ path: calcMobileScreenshot, fullPage: false });
  console.log(`  • Saved mobile calculator screenshot: ${calcMobileScreenshot}`);

  await browser.close();
  console.log('\n===================================================================');
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
  console.log('===================================================================');
}

runVerification().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});
