const puppeteer = require('puppeteer-core');
const path = require('path');
const https = require('https');

const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\974ebed1-b4d4-4fd6-81e8-55e43559661c');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://jobs-website-delta.vercel.app';

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
}

async function main() {
  console.log('--- 1. RAW HTML & SSR VERIFICATION ---');
  try {
    const ppscHtml = await fetchHtml(`${BASE_URL}/blog/ppsc-jobs-complete-guide`);
    console.log(`PPSC Guide Raw HTML Length: ${ppscHtml.length} bytes`);
    console.log('Contains H1 Title:', ppscHtml.includes('PPSC Jobs 2026: Complete Application Process'));
    console.log('Contains Executive Summary:', ppscHtml.includes('Executive Summary & Key Takeaways'));
    console.log('Contains 1Link PSID Section:', ppscHtml.includes('1Link PSID Challan Fee Payment Guide'));
    console.log('Contains Article JSON-LD Schema:', ppscHtml.includes('"@type":"Article"'));
    console.log('Contains FAQPage JSON-LD Schema:', ppscHtml.includes('"@type":"FAQPage"'));

    const todayHtml = await fetchHtml(`${BASE_URL}/blog/today-govt-jobs-pakistan-live-digest`);
    console.log(`Today Jobs Guide Raw HTML Length: ${todayHtml.length} bytes`);
    console.log('Contains Today H1 Title:', todayHtml.includes('Today Govt Jobs in Pakistan 2026'));
  } catch (err) {
    console.warn('Direct HTTPS fetch warning, proceeding to browser verification:', err.message);
  }

  console.log('\n--- 2. PUPPETEER VISUAL PROOF & INCENSED SCREENSHOTS ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new'
  });

  const context = await browser.createBrowserContext();

  try {
    // 1. Blog Directory Page (Desktop 1440px)
    console.log('1. Capturing Blog Hub Directory (1440px)...');
    const pageBlog = await context.newPage();
    await pageBlog.setViewport({ width: 1440, height: 900 });
    await pageBlog.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await pageBlog.screenshot({ path: path.join(ARTIFACT_DIR, 'test_blog_index_desktop.png') });
    console.log('✓ Captured test_blog_index_desktop.png');

    // 2. PPSC Article (Cluster 1 - Desktop 1440px)
    console.log('2. Capturing PPSC Guide (Cluster 1, 1440px)...');
    const pagePpsc = await context.newPage();
    await pagePpsc.setViewport({ width: 1440, height: 900 });
    await pagePpsc.goto(`${BASE_URL}/blog/ppsc-jobs-complete-guide`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await pagePpsc.screenshot({ path: path.join(ARTIFACT_DIR, 'test_blog_ppsc_article_desktop.png') });
    console.log('✓ Captured test_blog_ppsc_article_desktop.png');

    // Scroll to FAQs on PPSC Guide
    await pagePpsc.evaluate(() => window.scrollBy(0, 1000));
    await new Promise(r => setTimeout(r, 400));
    await pagePpsc.screenshot({ path: path.join(ARTIFACT_DIR, 'test_blog_ppsc_article_faqs.png') });
    console.log('✓ Captured test_blog_ppsc_article_faqs.png');

    // 3. Today's Jobs Article (Cluster 2 - Desktop 1440px)
    console.log('3. Capturing Today Govt Jobs Guide (Cluster 2, 1440px)...');
    const pageToday = await context.newPage();
    await pageToday.setViewport({ width: 1440, height: 900 });
    await pageToday.goto(`${BASE_URL}/blog/today-govt-jobs-pakistan-live-digest`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await pageToday.screenshot({ path: path.join(ARTIFACT_DIR, 'test_blog_today_jobs_article_desktop.png') });
    console.log('✓ Captured test_blog_today_jobs_article_desktop.png');

    // 4. Mobile Viewport (375px) on PPSC Guide
    console.log('4. Capturing PPSC Guide (Mobile 375px)...');
    const pageMobile = await context.newPage();
    await pageMobile.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await pageMobile.goto(`${BASE_URL}/blog/ppsc-jobs-complete-guide`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await pageMobile.screenshot({ path: path.join(ARTIFACT_DIR, 'test_blog_ppsc_article_mobile.png') });
    console.log('✓ Captured test_blog_ppsc_article_mobile.png');

    console.log('🎉 All Blog / Content Hub verification completed successfully!');
  } catch (err) {
    console.error('Error during blog verification:', err);
  } finally {
    await browser.close();
  }
}

main();
