const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\974ebed1-b4d4-4fd6-81e8-55e43559661c');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://jobs-website-delta.vercel.app';

async function main() {
  console.log('Testing Desktop Horizontal Navigation & Mobile Drawer on Live Production...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new'
  });

  const context = await browser.createBrowserContext();

  try {
    // 1. Desktop 1440px Viewport
    console.log('1. Testing Desktop 1440px Viewport...');
    const pageDesktop = await context.newPage();
    await pageDesktop.setViewport({ width: 1440, height: 900 });
    await pageDesktop.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const desktopState = await pageDesktop.evaluate(() => {
      const links = document.querySelector('.desktop-nav-links');
      const hamburger = document.querySelector('.mobile-menu-toggle');
      const pill = document.querySelector('.theme-toggle-pill');
      return {
        linksVisible: links ? window.getComputedStyle(links).display !== 'none' : false,
        hamburgerVisible: hamburger ? window.getComputedStyle(hamburger).display !== 'none' : false,
        pillVisible: pill ? window.getComputedStyle(pill).display !== 'none' : false
      };
    });
    console.log('Desktop 1440px state:', desktopState);
    await pageDesktop.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_1440px_full_horizontal_nav.png') });
    console.log('✓ Captured test_desktop_1440px_full_horizontal_nav.png');

    // 2. Desktop 1024px Viewport
    console.log('2. Testing Desktop 1024px Viewport...');
    const page1024 = await context.newPage();
    await page1024.setViewport({ width: 1024, height: 800 });
    await page1024.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const state1024 = await page1024.evaluate(() => {
      const links = document.querySelector('.desktop-nav-links');
      const hamburger = document.querySelector('.mobile-menu-toggle');
      const pill = document.querySelector('.theme-toggle-pill');
      return {
        linksVisible: links ? window.getComputedStyle(links).display !== 'none' : false,
        hamburgerVisible: hamburger ? window.getComputedStyle(hamburger).display !== 'none' : false,
        pillVisible: pill ? window.getComputedStyle(pill).display !== 'none' : false
      };
    });
    console.log('Desktop 1024px state:', state1024);
    await page1024.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_1024px_full_horizontal_nav.png') });
    console.log('✓ Captured test_desktop_1024px_full_horizontal_nav.png');

    // 3. Mobile 375px Viewport
    console.log('3. Testing Mobile 375px Viewport...');
    const pageMobile = await context.newPage();
    await pageMobile.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await pageMobile.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const mobileState = await pageMobile.evaluate(() => {
      const links = document.querySelector('.desktop-nav-links');
      const hamburger = document.querySelector('.mobile-menu-toggle');
      const pill = document.querySelector('.theme-toggle-pill');
      return {
        linksVisible: links ? window.getComputedStyle(links).display !== 'none' : false,
        hamburgerVisible: hamburger ? window.getComputedStyle(hamburger).display !== 'none' : false,
        pillVisible: pill ? window.getComputedStyle(pill).display !== 'none' : false
      };
    });
    console.log('Mobile 375px state:', mobileState);
    await pageMobile.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_375px_hamburger_nav.png') });
    console.log('✓ Captured test_mobile_375px_hamburger_nav.png');

    console.log('🎉 Verification completed successfully!');
  } catch (err) {
    console.error('Error during nav test:', err);
  } finally {
    await browser.close();
  }
}

main();
