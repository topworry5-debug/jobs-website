import { readFileSync, existsSync } from 'fs';
import path from 'path';
import http from 'http';

async function checkServer(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function verifyFonts() {
  console.log('--- Verifying Typography: Single Source of Truth (Inter) ---');

  // 1. Static CSS / HTML AST Verification
  const indexCssPath = path.resolve('src/styles/index.css');
  const layoutPath = path.resolve('src/app/layout.jsx');

  if (!existsSync(indexCssPath) || !existsSync(layoutPath)) {
    console.error('FAIL: Missing critical source files for font verification.');
    process.exit(1);
  }

  const indexCss = readFileSync(indexCssPath, 'utf8');
  const layoutJsx = readFileSync(layoutPath, 'utf8');

  // Verify Next.js font configuration in layout.jsx
  if (!layoutJsx.includes('Inter({') || !layoutJsx.includes("variable: '--font-sans'")) {
    console.error('FAIL: Inter font not configured via next/font/google with --font-sans variable in layout.jsx.');
    process.exit(1);
  }

  // Verify NO serif fallback in general Latin rules
  const serifLatinMatches = indexCss.match(/font-family:[^;]*serif[^;]*;/gi) || [];
  const illegalSerifs = serifLatinMatches.filter(m => !m.includes('Noto Nastaliq Urdu') && !m.includes('sans-serif'));
  if (illegalSerifs.length > 0) {
    console.error('FAIL: Found illegal serif font declarations in index.css:', illegalSerifs);
    process.exit(1);
  }

  // 2. Browser Computed Style Verification (if Chrome / Puppeteer available)
  let puppeteer;
  try {
    puppeteer = await import('puppeteer-core');
  } catch (e) {
    console.log('puppeteer-core not loaded, static verification passed.');
    return;
  }

  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    process.env.CHROME_BIN
  ].filter(Boolean);

  let chromeExecutable = chromePaths.find(p => existsSync(p));

  if (!chromeExecutable) {
    console.log('Chrome executable not found on host. Static font verification passed.');
    return;
  }

  const isServerRunning = await checkServer('http://localhost:3000');
  if (!isServerRunning) {
    console.log('Local server on http://localhost:3000 not active. Static verification passed.');
    return;
  }

  console.log('Running browser computed font-family assertions via Puppeteer...');
  const browser = await puppeteer.default.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    const computed = await page.evaluate(() => {
      const body = document.body;
      const h1 = document.querySelector('h1');
      const footerLink = document.querySelector('.footer-link, footer a');
      const docEl = document.documentElement;

      return {
        fontSansVar: getComputedStyle(docEl).getPropertyValue('--font-sans'),
        bodyFont: getComputedStyle(body).fontFamily,
        h1Font: h1 ? getComputedStyle(h1).fontFamily : null,
        footerLinkFont: footerLink ? getComputedStyle(footerLink).fontFamily : null
      };
    });

    console.log('Computed Font Properties:', computed);

    const isInter = (fontStr) => {
      if (!fontStr) return false;
      const normalized = fontStr.toLowerCase();
      return normalized.includes('inter') || normalized.startsWith('__inter');
    };

    const hasSerif = (fontStr) => {
      if (!fontStr) return false;
      const normalized = fontStr.toLowerCase();
      return (normalized.includes('times') || normalized.includes('georgia') || (normalized.includes('serif') && !normalized.includes('sans-serif')));
    };

    let failures = [];

    if (!isInter(computed.bodyFont)) {
      failures.push(`body font-family does not start with/contain Inter: "${computed.bodyFont}"`);
    }
    if (hasSerif(computed.bodyFont)) {
      failures.push(`body font-family contains serif fallback: "${computed.bodyFont}"`);
    }

    if (!computed.h1Font || !isInter(computed.h1Font)) {
      failures.push(`h1 font-family does not start with/contain Inter: "${computed.h1Font}"`);
    }
    if (hasSerif(computed.h1Font)) {
      failures.push(`h1 font-family contains serif fallback: "${computed.h1Font}"`);
    }

    if (!computed.footerLinkFont || !isInter(computed.footerLinkFont)) {
      failures.push(`footer link font-family does not start with/contain Inter: "${computed.footerLinkFont}"`);
    }
    if (hasSerif(computed.footerLinkFont)) {
      failures.push(`footer link font-family contains serif fallback: "${computed.footerLinkFont}"`);
    }

    if (failures.length > 0) {
      console.error('FAIL: Automated font assertions failed:');
      failures.forEach(f => console.error('  - ' + f));
      await browser.close();
      process.exit(1);
    }

    console.log('SUCCESS: All elements (body, h1, footer link) compute to Inter with zero serif fallbacks.');
  } finally {
    await browser.close();
  }
}

verifyFonts().catch(err => {
  console.error('Error during font verification:', err);
  process.exit(1);
});
