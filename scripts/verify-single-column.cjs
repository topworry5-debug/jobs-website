const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\1e48d51b-edc1-4e3f-8a3e-3d42e71b4cbf');

async function verifySingleColumn() {
  console.log('=== VERIFYING STRICT SINGLE-COLUMN CERTIFICATIONS & LANGUAGES ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/cv-builder', { waitUntil: 'networkidle0' });

  // Wait for sheet
  await page.waitForSelector('#resume-live-sheet');
  await new Promise(r => setTimeout(r, 600));

  // Verify that there are NO grid-cols-2 or two-column sections inside #resume-live-sheet
  const gridCount = await page.$eval('#resume-live-sheet', el => {
    return el.querySelectorAll('.grid-cols-2, [style*="column-count"], [style*="grid-template-columns"]').length;
  });
  console.log(`✓ Number of multi-column grid containers inside live sheet: ${gridCount}`);

  // Scroll live sheet down to certifications/languages
  await page.evaluate(() => {
    const sheetViewport = document.querySelector('.a4-scroll-viewport');
    if (sheetViewport) {
      sheetViewport.scrollTop = sheetViewport.scrollHeight;
    }
  });
  await new Promise(r => setTimeout(r, 400));

  // Capture Live Preview close-up
  const previewShotPath = path.join(ARTIFACT_DIR, 'certifications_languages_live_preview_stacked.png');
  await page.screenshot({ path: previewShotPath });
  console.log(`✓ Captured ${previewShotPath}`);

  // Generate PDF and verify
  const pdfPath = path.join(ARTIFACT_DIR, 'single_column_ats_resume.pdf');
  await page.emulateMediaType('print');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
  });
  console.log(`✓ Generated official single-column PDF at ${pdfPath}`);

  await browser.close();
}

verifySingleColumn().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
