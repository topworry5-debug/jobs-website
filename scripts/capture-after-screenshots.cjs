const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\1e48d51b-edc1-4e3f-8a3e-3d42e71b4cbf');

async function main() {
  console.log('Capturing AFTER screenshots for visual proof...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // 1. Homepage Desktop Light
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'after_homepage_desktop.png') });
  console.log('✓ Captured after_homepage_desktop.png');

  // 2. Homepage Mobile Light
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'after_homepage_mobile.png') });
  console.log('✓ Captured after_homepage_mobile.png');

  // 3. Job Detail Desktop Light
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/jobs/ppsc-live-36j2026-1', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'after_job_detail_desktop.png') });
  console.log('✓ Captured after_job_detail_desktop.png');

  // 4. Homepage Dark Mode Desktop
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'after_homepage_dark_desktop.png') });
  console.log('✓ Captured after_homepage_dark_desktop.png');

  // 5. Job Detail Dark Mode Desktop
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/jobs/ppsc-live-36j2026-1', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'after_job_detail_dark_desktop.png') });
  console.log('✓ Captured after_job_detail_dark_desktop.png');

  await browser.close();
}

main().catch(console.error);
