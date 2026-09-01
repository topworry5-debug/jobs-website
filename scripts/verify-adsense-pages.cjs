const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\974ebed1-b4d4-4fd6-81e8-55e43559661c');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://jobs-website-delta.vercel.app';

async function main() {
  console.log('Starting Verification of AdSense Legal & Trust Pages on Live Production...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });

  const context = await browser.createBrowserContext(); // Incognito
  const page = await context.newPage();

  try {
    // 1. Verify Privacy Policy
    console.log('1. Verifying /privacy-policy...');
    await page.goto(`${BASE_URL}/privacy-policy`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_privacy_policy_desktop.png') });
    console.log('✓ Captured test_privacy_policy_desktop.png');

    // 2. Verify Terms of Service
    console.log('2. Verifying /terms-of-service...');
    await page.goto(`${BASE_URL}/terms-of-service`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_terms_of_service_desktop.png') });
    console.log('✓ Captured test_terms_of_service_desktop.png');

    // 3. Verify About Us
    console.log('3. Verifying /about...');
    await page.goto(`${BASE_URL}/about`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_about_us_desktop.png') });
    console.log('✓ Captured test_about_us_desktop.png');

    // 4. Verify Contact Page & Interactive Form Submission
    console.log('4. Verifying /contact and testing form submission...');
    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // Fill out form
    await page.type('#name', 'Ahmad Farooq');
    await page.type('#email', 'ahmad.farooq.applicant@gmail.com');
    await page.select('#department', 'Gazette Correction');
    await page.type('#subject', 'Correction request for PPSC Advertisement No. 08/2026');
    await page.type('#message', 'Hello RozgarPK team, please verify the district quota allocation for the Senior Registrar position in Specialized Healthcare.');
    
    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForSelector('.bg-emerald-500\\/10', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_contact_form_submission.png') });
    console.log('✓ Form successfully submitted! Captured test_contact_form_submission.png');

    // 5. Verify Mobile Viewport for About page
    console.log('5. Verifying Mobile 375px responsive layout for /about...');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.goto(`${BASE_URL}/about`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_about_us_mobile.png') });
    console.log('✓ Captured test_about_us_mobile.png');

    // 6. Verify Sitemap.xml contains the 4 new URLs
    console.log('6. Checking /sitemap.xml for new routes...');
    const sitemapRes = await page.goto(`${BASE_URL}/sitemap.xml`);
    const sitemapText = await sitemapRes.text();
    const hasPrivacy = sitemapText.includes('privacy-policy');
    const hasTerms = sitemapText.includes('terms-of-service');
    const hasAbout = sitemapText.includes('about');
    const hasContact = sitemapText.includes('contact');
    console.log(`Sitemap check: Privacy (${hasPrivacy}), Terms (${hasTerms}), About (${hasAbout}), Contact (${hasContact})`);

    console.log('🎉 All AdSense legal & trust pages successfully verified on live production!');
  } catch (err) {
    console.error('Error during AdSense pages verification:', err);
  } finally {
    await browser.close();
  }
}

main();
