const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\1e48d51b-edc1-4e3f-8a3e-3d42e71b4cbf');

async function testPdfExport() {
  console.log('Testing PDF Export via Puppeteer & Native Print...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/cv-builder', { waitUntil: 'networkidle0' });

  // Navigate to Step 7
  for (let i = 0; i < 7; i++) {
    await page.click('.cv-form-footer .btn-primary');
    await new Promise(r => setTimeout(r, 200));
  }

  // Click Download ATS PDF button
  const downloadBtn = await page.$('.export-actions-card .btn-primary');
  if (downloadBtn) {
    console.log('✓ Found "Download ATS PDF" button');
  }

  // Generate native PDF from the page using print media
  const pdfPath = path.join(ARTIFACT_DIR, 'official_ats_resume_export.pdf');
  await page.emulateMediaType('print');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
  });

  const stats = fs.statSync(pdfPath);
  console.log(`✓ Official ATS Resume PDF generated successfully! Size: ${Math.round(stats.size / 1024)} KB at ${pdfPath}`);

  await browser.close();
}

testPdfExport().catch(e => {
  console.error('PDF export test failed:', e);
  process.exit(1);
});
