const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\1e48d51b-edc1-4e3f-8a3e-3d42e71b4cbf');

async function main() {
  console.log('Capturing BEFORE screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // 1. Homepage Desktop
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'before_homepage_desktop.png') });
  console.log('✓ Captured before_homepage_desktop.png');

  // 2. Homepage Mobile
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'before_homepage_mobile.png') });
  console.log('✓ Captured before_homepage_mobile.png');

  // 3. Job Detail Desktop
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/jobs/ppsc-live-36j2026-1', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'before_job_detail_desktop.png') });
  console.log('✓ Captured before_job_detail_desktop.png');

  await browser.close();
}

main().catch(console.error);
