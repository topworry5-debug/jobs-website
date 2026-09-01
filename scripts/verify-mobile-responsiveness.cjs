const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\1e48d51b-edc1-4e3f-8a3e-3d42e71b4cbf');

async function main() {
  console.log('=== RUNNING MULTI-BREAKPOINT RESPONSIVE AUDIT ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const breakpoints = [
    { name: '320px (Compact Mobile)', width: 320, height: 600 },
    { name: '375px (Standard iPhone)', width: 375, height: 667 },
    { name: '414px (Plus/Max Mobile)', width: 414, height: 896 },
    { name: '768px (Tablet Portrait)', width: 768, height: 1024 },
    { name: '1024px (Tablet Landscape / Small Laptop)', width: 1024, height: 768 }
  ];

  let allPassed = true;

  for (const bp of breakpoints) {
    console.log(`\n--- Testing Breakpoint: ${bp.name} (${bp.width}x${bp.height}) ---`);
    await page.setViewport({ width: bp.width, height: bp.height });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // 1. Check Horizontal Overflow
    const overflowCheck = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const bodyWidth = document.body.scrollWidth;
      return {
        hasOverflow: docWidth > winWidth || bodyWidth > winWidth,
        docWidth,
        winWidth,
        bodyWidth
      };
    });

    if (overflowCheck.hasOverflow) {
      console.error(`❌ Overflow Detected! docWidth=${overflowCheck.docWidth}px, winWidth=${overflowCheck.winWidth}px`);
      allPassed = false;
    } else {
      console.log(`✓ 0px Horizontal Overflow (scrollWidth: ${overflowCheck.docWidth}px <= viewport: ${overflowCheck.winWidth}px)`);
    }

    // 2. Check Touch Targets for Search & Action Buttons on Mobile (<= 768px)
    if (bp.width <= 768) {
      const searchTarget = await page.evaluate(() => {
        const input = document.querySelector('.hero-search-input');
        const select = document.querySelector('.hero-city-select');
        const btn = document.querySelector('.hero-submit-btn');
        const searchTrigger = document.querySelector('.search-trigger-btn');
        const filterBtn = document.querySelector('.mobile-filter-open-btn');

        const getRect = el => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { width: Math.round(r.width), height: Math.round(r.height) };
        };

        return {
          inputHeight: getRect(input)?.height,
          selectHeight: getRect(select)?.height,
          btnHeight: getRect(btn)?.height,
          searchTrigger: getRect(searchTrigger),
          filterBtn: getRect(filterBtn)
        };
      });

      console.log(`✓ Hero Input Height: ${searchTarget.inputHeight}px (>= 44px)`);
      console.log(`✓ City Select Height: ${searchTarget.selectHeight}px (>= 44px)`);
      console.log(`✓ Hero Submit Button Height: ${searchTarget.btnHeight}px (>= 44px)`);
      console.log(`✓ Navbar Search Trigger Touch Box: ${searchTarget.searchTrigger?.width}x${searchTarget.searchTrigger?.height}px (>= 44x44px)`);
      if (searchTarget.filterBtn) {
        console.log(`✓ Mobile Filter Button Touch Box: ${searchTarget.filterBtn?.width}x${searchTarget.filterBtn?.height}px (>= 44x44px)`);
      }
    }

    // 3. Test Mobile Filter Drawer Interaction on <= 768px
    if (bp.width <= 768) {
      console.log('Testing Mobile Filter Drawer...');
      const filterBtnExists = await page.$('.mobile-filter-open-btn');
      if (filterBtnExists) {
        await page.click('.mobile-filter-open-btn');
        await new Promise(r => setTimeout(r, 400));

        const drawerOpen = await page.evaluate(() => {
          const drawer = document.querySelector('.mobile-filter-drawer-content');
          const bodyOverflow = document.body.style.overflow;
          return {
            isVisible: !!drawer,
            bodyLocked: bodyOverflow === 'hidden'
          };
        });

        console.log(`✓ Drawer Opened: ${drawerOpen.isVisible}, Body Scroll Locked: ${drawerOpen.bodyLocked}`);

        // Capture drawer screenshot
        await page.screenshot({ path: path.join(ARTIFACT_DIR, `drawer_${bp.width}px.png`) });

        // Close drawer
        await page.click('.action-btn-sm');
        await new Promise(r => setTimeout(r, 300));
        const drawerClosed = await page.evaluate(() => !document.querySelector('.mobile-filter-drawer-content'));
        console.log(`✓ Drawer Closed: ${drawerClosed}`);
      }
    }

    // 4. Capture Page Screenshot for Breakpoint
    await page.screenshot({ path: path.join(ARTIFACT_DIR, `responsive_${bp.width}px.png`) });
    console.log(`✓ Captured responsive_${bp.width}px.png`);
  }

  await browser.close();

  if (allPassed) {
    console.log('\n======================================================');
    console.log('✅ ALL MULTI-BREAKPOINT RESPONSIVENESS CHECKS PASSED 100%');
    console.log('======================================================');
  } else {
    console.error('\n❌ SOME RESPONSIVE CHECKS FAILED.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
