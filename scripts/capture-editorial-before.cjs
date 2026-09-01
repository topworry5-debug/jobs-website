const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\1e48d51b-edc1-4e3f-8a3e-3d42e71b4cbf');

async function main() {
  console.log('Capturing BEFORE section screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await new Promise(r => setTimeout(r, 600));

  // 1. Hero Section
  const heroEl = await page.$('.hero-container');
  if (heroEl) {
    await heroEl.screenshot({ path: path.join(ARTIFACT_DIR, 'before_hero_section.png') });
    console.log('✓ Captured before_hero_section.png');
  }

  // 2. Job Card Grid
  const gridEl = await page.$('.jobs-cards-grid');
  if (gridEl) {
    await gridEl.screenshot({ path: path.join(ARTIFACT_DIR, 'before_job_cards_grid.png') });
    console.log('✓ Captured before_job_cards_grid.png');
  }

  // 3. Footer
  const footerEl = await page.$('.portal-footer');
  if (footerEl) {
    await footerEl.screenshot({ path: path.join(ARTIFACT_DIR, 'before_footer_section.png') });
    console.log('✓ Captured before_footer_section.png');
  }

  await browser.close();
}

main().catch(console.error);
