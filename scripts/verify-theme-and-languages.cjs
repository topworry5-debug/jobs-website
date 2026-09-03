const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\974ebed1-b4d4-4fd6-81e8-55e43559661c');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.env.BASE_URL || 'https://tainaati.com';

async function main() {
  console.log('Starting comprehensive Visual Verification of Theme & 3-Language Modes...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();

  try {
    // 1. Dark Mode Homepage
    console.log('1. Capturing Dark Mode Homepage...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('tainaati_theme', 'dark');
      localStorage.setItem('tainaati_lang', 'en');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_dark_homepage.png'), fullPage: false });

    // 2. Dark Mode Govt Jobs
    console.log('2. Capturing Dark Mode Govt Jobs (/jobs/govt)...');
    await page.goto(`${BASE_URL}/jobs/govt`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_dark_govt_jobs.png'), fullPage: false });

    // 3. Dark Mode CV Builder
    console.log('3. Capturing Dark Mode CV Builder (/cv-builder)...');
    await page.goto(`${BASE_URL}/cv-builder`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_dark_cv_builder.png'), fullPage: false });

    // 4. Light Mode Homepage
    console.log('4. Testing Light Mode Toggle on Homepage...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    // Click theme toggle button
    await page.click('.theme-toggle-btn');
    await new Promise(r => setTimeout(r, 1000));
    const currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log('Theme after toggle click:', currentTheme);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_light_homepage.png'), fullPage: false });

    // 5. Urdu Language Mode
    console.log('5. Testing Urdu (اردو) Language Switcher...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('tainaati_lang', 'ur');
      localStorage.setItem('tainaati_theme', 'dark');
      document.documentElement.setAttribute('lang', 'ur');
      document.documentElement.setAttribute('dir', 'rtl');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_urdu_homepage.png'), fullPage: false });

    // 6. Urdu Govt Jobs
    console.log('6. Capturing Urdu Govt Jobs (/jobs/govt)...');
    await page.goto(`${BASE_URL}/jobs/govt`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_urdu_govt_jobs.png'), fullPage: false });

    // 7. Roman Urdu Homepage
    console.log('7. Testing Roman Urdu Language Switcher...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('tainaati_lang', 'roman');
      localStorage.setItem('tainaati_theme', 'dark');
      document.documentElement.setAttribute('lang', 'roman');
      document.documentElement.setAttribute('dir', 'ltr');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_roman_homepage.png'), fullPage: false });

    // 8. Roman Urdu Govt Jobs
    console.log('8. Capturing Roman Urdu Govt Jobs (/jobs/govt)...');
    await page.goto(`${BASE_URL}/jobs/govt`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_roman_govt_jobs.png'), fullPage: false });

    console.log('🎉 All verification screenshots successfully captured!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
  }
}

main();
