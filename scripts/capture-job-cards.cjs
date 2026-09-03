const puppeteer = require('puppeteer-core');
const path = require('path');
const { spawn, execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 3005;
const BASE_URL = `http://localhost:${PORT}`;
const ARTIFACTS_DIR = 'C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\b9567c12-ff27-45f3-b52f-868144d126f6';

async function main() {
  try {
    const netstat = execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' });
    for (const l of netstat.trim().split('\n')) {
      const pid = l.trim().split(/\s+/).pop();
      if (pid && !isNaN(pid)) {
        try { execSync(`taskkill /F /PID ${pid}`); } catch {}
      }
    }
  } catch {}

  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: 'd:\\job website',
    shell: true,
    stdio: 'ignore'
  });

  await new Promise(r => setTimeout(r, 4000));

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });

  // Scroll to Trending Opportunities
  await page.evaluate(() => {
    const el = document.querySelector('.jobs-for-you-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 800));

  const trendingShot = path.join(ARTIFACTS_DIR, 'trending_opportunities_grid_1440px.png');
  await page.screenshot({ path: trendingShot });
  console.log('Saved trending_opportunities_grid_1440px.png');

  // Scroll to main jobs feed
  await page.evaluate(() => {
    const el = document.querySelector('.jobs-feed-col');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 800));

  const feedShot = path.join(ARTIFACTS_DIR, 'main_feed_cards_grid_1440px.png');
  await page.screenshot({ path: feedShot });
  console.log('Saved main_feed_cards_grid_1440px.png');

  // Hover test on the first card
  const firstCard = await page.$('.job-card-item');
  if (firstCard) {
    await firstCard.hover();
    await new Promise(r => setTimeout(r, 300));
    const hoverShot = path.join(ARTIFACTS_DIR, 'job_card_hover_effect.png');
    await page.screenshot({ path: hoverShot });
    console.log('Saved job_card_hover_effect.png');
  }

  await browser.close();
  try { server.kill(); } catch {}
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
