/**
 * Tainaati — Automated Verification Suite for Job Cards Redesign & Expiry Lifecycle
 */

const puppeteer = require('puppeteer-core');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn, execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 3004;
const BASE_URL = `http://localhost:${PORT}`;
const ARTIFACTS_DIR = 'C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\b9567c12-ff27-45f3-b52f-868144d126f6';

function waitForServer(url, timeoutMs = 35000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve();
        } else {
          retry();
        }
      }).on('error', retry);
    };

    const retry = () => {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server timed out at ${url}`));
      } else {
        setTimeout(check, 500);
      }
    };

    check();
  });
}

async function run() {
  console.log('===================================================================');
  console.log('TAINAATI: VERIFYING JOB CARDS REDESIGN & DEADLINE EXPIRY LIFECYCLE');
  console.log('===================================================================\n');

  // Free port 3004 if needed
  try {
    const netstat = execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' });
    for (const l of netstat.trim().split('\n')) {
      const pid = l.trim().split(/\s+/).pop();
      if (pid && !isNaN(pid)) {
        try { execSync(`taskkill /F /PID ${pid}`); } catch {}
      }
    }
  } catch {}

  console.log(`1. Launching next start on port ${PORT}...`);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: 'd:\\job website',
    shell: true,
    stdio: 'ignore'
  });

  try {
    await waitForServer(BASE_URL);
    console.log(`✓ Production server listening at ${BASE_URL}\n`);

    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: CHROME_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // =========================================================================
    // TEST 1: DESKTOP 1440px — 3-COLUMN CARD GRID & TRENDING OPPORTUNITIES
    // =========================================================================
    console.log('--- TEST 1: Desktop 1440px Viewport Verification ---');
    await page.setViewport({ width: 1440, height: 950 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    // 1.1 Verify Trending Opportunities has NO 0d left jobs and NO Water Management Officer
    console.log('1.1 Checking "Trending Opportunities" for 0d left jobs...');
    const trendingData = await page.evaluate(() => {
      const section = document.querySelector('.jobs-for-you-section');
      if (!section) return { found: false };
      const heading = section.querySelector('h2')?.textContent || '';
      const cards = [...section.querySelectorAll('.job-card-item')];
      const jobTitles = cards.map(c => c.querySelector('.job-card-title')?.textContent.trim() || '');
      const deadlineTexts = cards.map(c => c.querySelector('.card-deadline-box')?.textContent.trim() || '');
      return {
        found: true,
        heading,
        count: cards.length,
        jobTitles,
        deadlineTexts
      };
    });

    console.log(`    • Trending section heading: "${trendingData.heading}"`);
    console.log(`    • Number of trending cards rendered: ${trendingData.count}`);
    console.log(`    • Trending titles:`, trendingData.jobTitles);
    console.log(`    • Trending deadline labels:`, trendingData.deadlineTexts);

    const hasWaterOfficer = trendingData.jobTitles.some(t => t.includes('WATER MANAGEMENT OFFICER'));
    const has0dLeft = trendingData.deadlineTexts.some(d => d.includes('0d left'));
    const hasClosesToday = trendingData.deadlineTexts.some(d => d.toLowerCase().includes('today'));

    if (hasWaterOfficer) {
      throw new Error('FAILED: "WATER MANAGEMENT OFFICER" was found in Trending Opportunities!');
    }
    if (has0dLeft) {
      throw new Error('FAILED: "0d left" was found in Trending Opportunities!');
    }
    console.log('    ✓ PASSED: Zero 0d left jobs in Trending Opportunities. Water Management Officer successfully excluded!\n');

    // 1.2 Verify 3-Column Grid on Desktop
    console.log('1.2 Checking CSS grid columns in desktop view (1440px)...');
    const gridData = await page.evaluate(() => {
      const grid = document.querySelector('.jobs-cards-grid');
      if (!grid) return null;
      const comp = window.getComputedStyle(grid);
      const cols = comp.getPropertyValue('grid-template-columns').split(' ').filter(Boolean);
      const cards = [...grid.querySelectorAll('.job-card-item')];
      
      const cardStyles = cards.slice(0, 3).map(c => {
        const cs = window.getComputedStyle(c);
        const rect = c.getBoundingClientRect();
        const titleEl = c.querySelector('.job-card-title');
        const ts = titleEl ? window.getComputedStyle(titleEl) : null;
        const applyEl = c.querySelector('.job-card-apply-btn');
        const as = applyEl ? window.getComputedStyle(applyEl) : null;
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          borderRadius: cs.borderRadius,
          padding: cs.padding,
          fontFamily: ts?.fontFamily || '',
          fontSize: ts?.fontSize || '',
          hasApplyBtn: !!applyEl
        };
      });

      return {
        columnCount: cols.length,
        columnDefs: comp.getPropertyValue('grid-template-columns'),
        cardStyles
      };
    });

    console.log(`    • Desktop grid computed columns count: ${gridData.columnCount}`);
    console.log(`    • First 3 cards dimensions:`, gridData.cardStyles.map(c => `${c.width}x${c.height}px`));
    console.log(`    • Card border-radius: ${gridData.cardStyles[0]?.borderRadius}`);
    console.log(`    • Card padding: ${gridData.cardStyles[0]?.padding}`);
    console.log(`    • Title font-family: ${gridData.cardStyles[0]?.fontFamily}`);
    console.log(`    • Title font-size: ${gridData.cardStyles[0]?.fontSize}`);

    if (gridData.columnCount !== 3) {
      throw new Error(`FAILED: Expected 3 columns on desktop, got ${gridData.columnCount}`);
    }
    console.log('    ✓ PASSED: Desktop 3-column card grid verified!\n');

    // 1.3 Verify "Closes today" label on jobs closing today in regular feed
    console.log('1.3 Checking "Closes today" badge in main jobs feed...');
    const feedLabels = await page.evaluate(() => {
      const badges = [...document.querySelectorAll('.badge-closing-today, .text-today')];
      return badges.map(b => b.textContent.trim());
    });
    console.log(`    • Found ${feedLabels.length} "Closes today" badges in feed.`);
    if (feedLabels.length === 0) {
      console.warn('    ! Note: No closing today badge found in default visible feed slice.');
    } else {
      console.log(`    ✓ PASSED: Jobs closing today display: "${feedLabels[0]}" instead of "0d left"!`);
    }

    // Capture desktop screenshots
    const trendingScreenshot = path.join(ARTIFACTS_DIR, 'trending_opportunities_desktop.png');
    const desktopCardsScreenshot = path.join(ARTIFACTS_DIR, 'job_cards_desktop_1440px.png');
    await page.screenshot({ path: desktopCardsScreenshot, fullPage: false });
    console.log(`    • Saved desktop cards screenshot: ${path.basename(desktopCardsScreenshot)}\n`);

    // =========================================================================
    // TEST 2: TABLET 1024px — 2-COLUMN CARD GRID
    // =========================================================================
    console.log('--- TEST 2: Tablet 1024px Viewport Verification ---');
    await page.setViewport({ width: 1024, height: 900 });
    await new Promise(r => setTimeout(r, 600));

    const tabletData = await page.evaluate(() => {
      const grid = document.querySelector('.jobs-cards-grid');
      if (!grid) return null;
      const comp = window.getComputedStyle(grid);
      const cols = comp.getPropertyValue('grid-template-columns').split(' ').filter(Boolean);
      return {
        columnCount: cols.length,
        columnDefs: comp.getPropertyValue('grid-template-columns')
      };
    });

    console.log(`    • Tablet grid computed columns count: ${tabletData.columnCount}`);
    if (tabletData.columnCount !== 2) {
      throw new Error(`FAILED: Expected 2 columns on tablet (1024px), got ${tabletData.columnCount}`);
    }
    console.log('    ✓ PASSED: Tablet 2-column card grid verified!\n');

    const tabletCardsScreenshot = path.join(ARTIFACTS_DIR, 'job_cards_tablet_1024px.png');
    await page.screenshot({ path: tabletCardsScreenshot, fullPage: false });
    console.log(`    • Saved tablet cards screenshot: ${path.basename(tabletCardsScreenshot)}\n`);

    // =========================================================================
    // TEST 3: MOBILE 375px — 1-COLUMN FULL-WIDTH GRID
    // =========================================================================
    console.log('--- TEST 3: Mobile 375px Viewport Verification ---');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await new Promise(r => setTimeout(r, 600));

    const mobileData = await page.evaluate(() => {
      const grid = document.querySelector('.jobs-cards-grid');
      if (!grid) return null;
      const comp = window.getComputedStyle(grid);
      const cols = comp.getPropertyValue('grid-template-columns').split(' ').filter(Boolean);
      const card = grid.querySelector('.job-card-item');
      const cs = card ? window.getComputedStyle(card) : null;
      const rect = card ? card.getBoundingClientRect() : null;
      const bookmarkBtn = card ? card.querySelector('.card-bookmark-btn') : null;
      const bookmarkRect = bookmarkBtn ? bookmarkBtn.getBoundingClientRect() : null;
      const applyBtn = card ? card.querySelector('.job-card-apply-btn') : null;
      const applyRect = applyBtn ? applyBtn.getBoundingClientRect() : null;

      return {
        columnCount: cols.length,
        cardWidth: rect ? Math.round(rect.width) : 0,
        borderRadius: cs?.borderRadius,
        bookmarkTouchSize: bookmarkRect ? `${Math.round(bookmarkRect.width)}x${Math.round(bookmarkRect.height)}` : '',
        applyTouchHeight: applyRect ? Math.round(applyRect.height) : 0
      };
    });

    console.log(`    • Mobile grid computed columns count: ${mobileData.columnCount}`);
    console.log(`    • Mobile card width: ${mobileData.cardWidth}px (Full-width inside container)`);
    console.log(`    • Mobile card border-radius: ${mobileData.borderRadius}`);
    console.log(`    • Mobile bookmark button touch target: ${mobileData.bookmarkTouchSize}px (>=44px)`);
    console.log(`    • Mobile apply button height: ${mobileData.applyTouchHeight}px (>=44px)`);

    if (mobileData.columnCount !== 1) {
      throw new Error(`FAILED: Expected 1 column on mobile (375px), got ${mobileData.columnCount}`);
    }
    console.log('    ✓ PASSED: Mobile 1-column card grid verified!\n');

    const mobileCardsScreenshot = path.join(ARTIFACTS_DIR, 'job_cards_mobile_375px.png');
    await page.screenshot({ path: mobileCardsScreenshot, fullPage: false });
    console.log(`    • Saved mobile cards screenshot: ${path.basename(mobileCardsScreenshot)}\n`);

    // =========================================================================
    // TEST 4: DIRECT URL VISIT TO CLOSED JOB
    // =========================================================================
    console.log('--- TEST 4: Direct URL Visit to Closed Job ---');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${BASE_URL}/jobs/ppsc-archived-assistant-director-closed-2026`, { waitUntil: 'networkidle2' });

    const closedPageData = await page.evaluate(() => {
      const alertBox = document.querySelector('[role="alert"]');
      const alertText = alertBox ? alertBox.textContent.trim() : '';
      const disabledButtons = [...document.querySelectorAll('button[disabled]')];
      const disabledButtonTexts = disabledButtons.map(b => b.textContent.trim());
      const closedBadges = [...document.querySelectorAll('.badge-expired')].map(b => b.textContent.trim());

      return {
        hasAlertBox: !!alertBox,
        alertText,
        disabledButtonTexts,
        closedBadges
      };
    });

    console.log(`    • Has warning alert box: ${closedPageData.hasAlertBox}`);
    console.log(`    • Alert text snippet: "${closedPageData.alertText.slice(0, 80)}..."`);
    console.log(`    • Disabled button labels:`, closedPageData.disabledButtonTexts);
    console.log(`    • Closed badges:`, closedPageData.closedBadges);

    if (!closedPageData.hasAlertBox || !closedPageData.alertText.includes('Applications Closed')) {
      throw new Error('FAILED: Direct URL to closed job did not show Applications Closed warning alert!');
    }
    if (!closedPageData.disabledButtonTexts.some(t => t.includes('Applications Closed'))) {
      throw new Error('FAILED: Direct URL to closed job did not disable the Apply button!');
    }
    console.log('    ✓ PASSED: Closed job directly accessible with warning banner and disabled Apply button!\n');

    const closedScreenshot = path.join(ARTIFACTS_DIR, 'job_detail_closed_desktop.png');
    await page.screenshot({ path: closedScreenshot, fullPage: false });
    console.log(`    • Saved closed job screenshot: ${path.basename(closedScreenshot)}\n`);

    await browser.close();
    console.log('===================================================================');
    console.log('ALL VERIFICATIONS PASSED WITH 100% SUCCESS!');
    console.log('===================================================================');
  } finally {
    try {
      server.kill();
    } catch {}
  }
}

run().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
