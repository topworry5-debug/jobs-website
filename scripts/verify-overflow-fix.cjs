const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\b9567c12-ff27-45f3-b52f-868144d126f6';

async function main() {
  console.log('===================================================================');
  console.log('TAINAATI: VERIFYING JOB CARDS GRID HORIZONTAL OVERFLOW FIX');
  console.log('===================================================================\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const viewports = [
    { width: 1920, height: 1080, name: '1920px (Full HD Desktop)' },
    { width: 1440, height: 950,  name: '1440px (Standard Desktop)' },
    { width: 1350, height: 900,  name: '1350px (In-between Desktop)' },
    { width: 1280, height: 850,  name: '1280px (Compact Desktop)' },
    { width: 1100, height: 800,  name: '1100px (Narrow Desktop)' },
    { width: 1024, height: 800,  name: '1024px (Tablet Landscape)' },
    { width: 768,  height: 900,  name: '768px (Tablet Portrait)' },
    { width: 375,  height: 812,  name: '375px (Mobile Portrait)' }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.width < 768, hasTouch: vp.width < 768 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    // Scroll to the main job listings filter section
    await page.evaluate(() => {
      const el = document.querySelector('.main-content-layout');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 400));

    const metrics = await page.evaluate((w) => {
      const docWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const hasHScroll = scrollWidth > docWidth + 1;

      const sidebar = document.querySelector('.filters-sidebar-col');
      const feed = document.querySelector('.jobs-feed-col');
      const grid = document.querySelector('.main-content-layout .jobs-cards-grid');
      const cards = grid ? [...grid.querySelectorAll('.job-card-item')] : [];

      const sidebarRect = sidebar ? sidebar.getBoundingClientRect() : null;
      const feedRect = feed ? feed.getBoundingClientRect() : null;
      const gridRect = grid ? grid.getBoundingClientRect() : null;

      const cardData = cards.slice(0, 4).map((c, i) => {
        const r = c.getBoundingClientRect();
        return {
          index: i + 1,
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          isFullyVisible: r.right <= docWidth + 1
        };
      });

      const cols = grid ? window.getComputedStyle(grid).getPropertyValue('grid-template-columns').split(' ').filter(Boolean).length : 0;

      return {
        docWidth,
        scrollWidth,
        hasHScroll,
        columns: cols,
        sidebarWidth: sidebarRect ? Math.round(sidebarRect.width) : null,
        feedWidth: feedRect ? Math.round(feedRect.width) : null,
        gridWidth: gridRect ? Math.round(gridRect.width) : null,
        cardData
      };
    }, vp.width);

    console.log(`[Viewport ${vp.name}]`);
    console.log(`  • Client width: ${metrics.docWidth}px | Scroll width: ${metrics.scrollWidth}px`);
    console.log(`  • Horizontal scrollbar present: ${metrics.hasHScroll ? '❌ YES (BUG)' : '✅ NO (CLEAN)'}`);
    console.log(`  • Grid computed columns: ${metrics.columns}`);
    console.log(`  • Sidebar width: ${metrics.sidebarWidth}px | Feed width: ${metrics.feedWidth}px | Grid width: ${metrics.gridWidth}px`);
    console.log(`  • Visible cards:`, metrics.cardData.map(c => `Card ${c.index}: ${c.width}px (Right: ${c.right}px, fully in viewport: ${c.isFullyVisible})`).join(' | '));
    console.log('');

    if (metrics.hasHScroll) {
      throw new Error(`OVERFLOW BUG DETECTED at ${vp.width}px! scrollWidth (${metrics.scrollWidth}) > docWidth (${metrics.docWidth})`);
    }

    // Capture screenshots at 1440px and 1920px as required
    if (vp.width === 1440) {
      const shot1440 = path.join(ARTIFACTS_DIR, 'job_cards_grid_1440px_verified.png');
      await page.screenshot({ path: shot1440 });
      console.log(`  📸 Captured: job_cards_grid_1440px_verified.png\n`);
    } else if (vp.width === 1920) {
      const shot1920 = path.join(ARTIFACTS_DIR, 'job_cards_grid_1920px_verified.png');
      await page.screenshot({ path: shot1920 });
      console.log(`  📸 Captured: job_cards_grid_1920px_verified.png\n`);
    }
  }

  await browser.close();
  console.log('===================================================================');
  console.log('ALL BREAKPOINTS PASSED WITH ZERO HORIZONTAL OVERFLOW!');
  console.log('===================================================================');
}

main().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
