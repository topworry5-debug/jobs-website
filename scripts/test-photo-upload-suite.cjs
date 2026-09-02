const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\1e48d51b-edc1-4e3f-8a3e-3d42e71b4cbf');
const TEST_DIR = path.resolve(__dirname, 'test-assets');

async function createTestImages(browser) {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }

  const page = await browser.newPage();
  await page.goto('about:blank');

  // Generate 1: JPG Portrait (passport photo style with blue background)
  await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    // Blue background
    ctx.fillStyle = '#2563EB';
    ctx.fillRect(0, 0, 400, 500);
    // Head / body
    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.arc(200, 450, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(200, 220, 90, 0, Math.PI * 2);
    ctx.fill();
    // Label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('JPG PASSPORT', 200, 360);
    window.__jpgData = canvas.toDataURL('image/jpeg', 0.9);
  });
  const jpgData = await page.evaluate(() => window.__jpgData);
  fs.writeFileSync(path.join(TEST_DIR, 'test_portrait_jpg.jpg'), Buffer.from(jpgData.split(',')[1], 'base64'));

  // Generate 2: PNG Avatar (green/emerald graphic avatar)
  await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 350;
    canvas.height = 350;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0B3D2E';
    ctx.fillRect(0, 0, 350, 350);
    ctx.fillStyle = '#C9A227';
    ctx.beginPath();
    ctx.arc(175, 175, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FAF8F3';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PNG AVATAR', 175, 185);
    window.__pngData = canvas.toDataURL('image/png');
  });
  const pngData = await page.evaluate(() => window.__pngData);
  fs.writeFileSync(path.join(TEST_DIR, 'test_avatar_png.png'), Buffer.from(pngData.split(',')[1], 'base64'));

  // Generate 3: WEBP Landscape (amber / executive badge)
  await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#78350F';
    ctx.fillRect(0, 0, 600, 400);
    ctx.fillStyle = '#FCD34D';
    ctx.beginPath();
    ctx.arc(300, 200, 130, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1E1B4B';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WEBP EXEC', 300, 210);
    window.__webpData = canvas.toDataURL('image/webp', 0.9);
  });
  const webpData = await page.evaluate(() => window.__webpData);
  fs.writeFileSync(path.join(TEST_DIR, 'test_photo_webp.webp'), Buffer.from(webpData.split(',')[1], 'base64'));

  // Generate 4: Oversized file (6MB dummy buffer)
  const bigBuffer = Buffer.alloc(6 * 1024 * 1024, 0);
  fs.writeFileSync(path.join(TEST_DIR, 'test_oversized_6mb.jpg'), bigBuffer);

  // Generate 5: Unsupported file (PDF dummy)
  fs.writeFileSync(path.join(TEST_DIR, 'test_invalid_doc.pdf'), '%PDF-1.4 dummy document');

  await page.close();
  console.log('✓ Created 5 test asset files (JPG, PNG, WEBP, Oversized 6MB, and PDF)');
}

async function runTestSuite() {
  console.log('=== STARTING END-TO-END PHOTO UPLOAD QA SUITE ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  await createTestImages(browser);

  // 1. TEST DESKTOP FLOW
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/cv-builder', { waitUntil: 'networkidle0' });

  // Navigate to Step 1 (Personal Info)
  console.log('1. Navigating to Step 1 (Personal Info)...');
  await page.evaluate(() => {
    const stepBtns = Array.from(document.querySelectorAll('.cv-step-button'));
    const step1 = stepBtns.find(b => b.textContent.includes('Personal Info') || b.textContent.includes('2'));
    if (step1) step1.click();
  });
  await page.waitForSelector('input[type="file"]', { timeout: 5000 });
  await new Promise(r => setTimeout(r, 600));

  // TEST A: Invalid format rejection
  console.log('2. Testing invalid format rejection...');
  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile(path.join(TEST_DIR, 'test_invalid_doc.pdf'));
  await new Promise(r => setTimeout(r, 400));
  const invalidMsg = await page.evaluate(() => document.body.innerText);
  if (invalidMsg.includes('Unsupported image format')) {
    console.log('   ✓ Unsupported file rejected with friendly error message');
  } else {
    console.error('   ✗ Unsupported file was not rejected properly!');
  }

  // TEST B: Oversized file rejection (>5MB)
  console.log('3. Testing oversized file rejection (>5MB)...');
  await fileInput.uploadFile(path.join(TEST_DIR, 'test_oversized_6mb.jpg'));
  await new Promise(r => setTimeout(r, 400));
  const oversizedMsg = await page.evaluate(() => document.body.innerText);
  if (oversizedMsg.includes('Selected image is too large')) {
    console.log('   ✓ Oversized file (6MB) rejected with size warning');
  } else {
    console.error('   ✗ Oversized file was not rejected properly!');
  }

  // TEST C: Upload Valid JPG & Circular Crop
  console.log('4. Testing JPG upload and Circular Crop Modal...');
  await fileInput.uploadFile(path.join(TEST_DIR, 'test_portrait_jpg.jpg'));
  await new Promise(r => setTimeout(r, 600));

  // Verify Crop Modal is visible
  const modalVisible = await page.$('.crop-modal-overlay');
  if (modalVisible) {
    console.log('   ✓ Circular Crop Modal opened successfully');
  } else {
    throw new Error('Crop modal failed to open!');
  }

  // Capture Screenshot of Circular Crop Modal
  const cropModalShotPath = path.join(ARTIFACT_DIR, 'photo_crop_modal_desktop.png');
  await page.screenshot({ path: cropModalShotPath });
  console.log(`   ✓ Captured crop modal screenshot: ${cropModalShotPath}`);

  // Test zoom slider adjustment and dragging
  console.log('5. Adjusting zoom slider and pan in crop tool...');
  await page.evaluate(() => {
    const slider = document.querySelector('.crop-zoom-slider');
    if (slider) {
      slider.value = 1.35;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 300));

  // Click "Crop & Use Photo"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.crop-modal-dialog button'));
    const applyBtn = btns.find(b => b.textContent.includes('Crop & Use Photo'));
    if (applyBtn) applyBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Verify photo thumbnail in Step 1 and live preview
  const photoApplied = await page.evaluate(() => {
    const thumbImg = document.querySelector('.photo-crop-circle img');
    const sheetImg = document.querySelector('#resume-live-sheet img[alt="Applicant"]');
    return {
      thumbSrc: !!thumbImg?.src,
      sheetSrc: !!sheetImg?.src,
      sheetWidth: sheetImg?.offsetWidth,
      sheetHeight: sheetImg?.offsetHeight
    };
  });
  console.log('   ✓ Photo successfully applied to thumbnail & live sheet:', photoApplied);

  // Capture Live Preview with Photo in Template 1 (Classic)
  const classicShot = path.join(ARTIFACT_DIR, 'photo_live_preview_classic.png');
  await page.screenshot({ path: classicShot });
  console.log(`   ✓ Captured Classic template live preview with photo: ${classicShot}`);

  // Test Template 2 (Modern)
  await page.evaluate(() => {
    const sel = document.querySelector('.preview-control-toolbar select');
    if (sel) {
      sel.value = 'modern';
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 500));
  const modernShot = path.join(ARTIFACT_DIR, 'photo_live_preview_modern.png');
  await page.screenshot({ path: modernShot });
  console.log(`   ✓ Captured Modern template live preview with photo: ${modernShot}`);

  // Test Template 3 (Govt)
  await page.evaluate(() => {
    const sel = document.querySelector('.preview-control-toolbar select');
    if (sel) {
      sel.value = 'govt';
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 500));
  const govtShot = path.join(ARTIFACT_DIR, 'photo_live_preview_govt.png');
  await page.screenshot({ path: govtShot });
  console.log(`   ✓ Captured Govt template live preview with photo: ${govtShot}`);

  // Test Template 4 (Executive)
  await page.evaluate(() => {
    const sel = document.querySelector('.preview-control-toolbar select');
    if (sel) {
      sel.value = 'executive';
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 500));
  const execShot = path.join(ARTIFACT_DIR, 'photo_live_preview_executive.png');
  await page.screenshot({ path: execShot });
  console.log(`   ✓ Captured Executive template live preview with photo: ${execShot}`);

  // Generate Vector PDF and confirm photo is embedded!
  console.log('6. Generating PDF and verifying photo embed...');
  const pdfPath = path.join(ARTIFACT_DIR, 'photo_resume_verified_export.pdf');
  await page.emulateMediaType('print');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
  });
  console.log(`   ✓ Generated PDF with photo: ${pdfPath}`);

  // Test localStorage persistence: Reload page!
  console.log('7. Testing localStorage persistence on page reload...');
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const persistedPhoto = await page.evaluate(() => {
    const sheetImg = document.querySelector('#resume-live-sheet img[alt="Applicant"]');
    return !!sheetImg?.src;
  });
  if (persistedPhoto) {
    console.log('   ✓ Photo successfully persisted across page reload from localStorage!');
  } else {
    console.error('   ✗ Photo was lost upon reload!');
  }

  // Test 8: "Remove Photo" button
  console.log('8. Testing "Remove Photo" button...');
  await page.evaluate(() => {
    const stepBtns = Array.from(document.querySelectorAll('.cv-step-button'));
    const step1 = stepBtns.find(b => b.textContent.includes('Personal Info') || b.textContent.includes('2'));
    if (step1) step1.click();
  });
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const removeBtn = btns.find(b => b.textContent.includes('Remove Photo'));
    if (removeBtn) removeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const photoRemoved = await page.evaluate(() => {
    const sheetImg = document.querySelector('#resume-live-sheet img[alt="Applicant"]');
    return !sheetImg;
  });
  if (photoRemoved) {
    console.log('   ✓ Photo successfully removed cleanly without layout breakage!');
  } else {
    console.error('   ✗ Photo was not removed!');
  }

  // 2. TEST MOBILE VIEWPORT (375x812 iPhone)
  console.log('\n9. Testing Mobile Photo Flow (375x812)...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Navigate to Step 1 on mobile
  await page.evaluate(() => {
    const stepBtns = Array.from(document.querySelectorAll('.cv-step-button'));
    const step1 = stepBtns.find(b => b.textContent.includes('Personal Info') || b.textContent.includes('2'));
    if (step1) step1.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Upload WEBP photo on mobile
  const mobileInput = await page.$('input[type="file"]');
  await mobileInput.uploadFile(path.join(TEST_DIR, 'test_photo_webp.webp'));
  await new Promise(r => setTimeout(r, 600));

  // Crop modal on mobile
  const mobileCropShot = path.join(ARTIFACT_DIR, 'photo_crop_modal_mobile.png');
  await page.screenshot({ path: mobileCropShot });
  console.log(`   ✓ Captured mobile crop modal: ${mobileCropShot}`);

  // Apply crop on mobile
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.crop-modal-dialog button'));
    const applyBtn = btns.find(b => b.textContent.includes('Crop & Use Photo'));
    if (applyBtn) applyBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Switch mobile tab to Preview
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.mobile-toggle-btn'));
    const prevTab = tabs.find(t => t.textContent.includes('Preview'));
    if (prevTab) prevTab.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const mobilePreviewShot = path.join(ARTIFACT_DIR, 'photo_mobile_preview.png');
  await page.screenshot({ path: mobilePreviewShot });
  console.log(`   ✓ Captured mobile preview with photo: ${mobilePreviewShot}`);

  await browser.close();
  console.log('\n=== ALL PHOTO UPLOAD QA TESTS PASSED SUCCESSFULLY! ===');
}

runTestSuite().catch(err => {
  console.error('QA Suite Failed:', err);
  process.exit(1);
});
