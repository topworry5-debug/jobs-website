const http = require('http');

const BASE_URL = 'http://localhost:3000';

const routesToTest = [
  '/',
  '/jobs/govt',
  '/jobs/private',
  '/test-prep',
  '/exams',
  '/cv-builder',
  '/blog',
  '/alerts',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/agency/ppsc',
  '/agency/fpsc',
  '/agency/spsc',
  '/agency/kppsc',
  '/agency/bpsc',
  '/agency/nts',
  '/city/lahore',
  '/city/karachi',
  '/city/islamabad',
  '/jobs/fpsc-live-css-mpt-2027',
  '/jobs/ppsc-live-36j2026-1',
  '/blog/ppsc-jobs-complete-guide',
  '/blog/fpsc-jobs-complete-guide'
];

function fetchPage(urlPath) {
  return new Promise((resolve) => {
    http.get(`${BASE_URL}${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function main() {
  console.log('=== VERIFYING EXACTLY 1 HEADER & 1 FOOTER PER ROUTE ===\n');

  let allPassed = true;

  for (const route of routesToTest) {
    const html = await fetchPage(route);

    // Count occurrences of <header class="navbar-wrapper" and <footer class="portal-footer"
    const headerCount = (html.match(/<header\b[^>]*class="[^"]*navbar-wrapper/g) || []).length;
    const footerCount = (html.match(/<footer\b[^>]*class="[^"]*portal-footer/g) || []).length;

    const statusOk = headerCount === 1 && footerCount === 1;
    if (!statusOk) {
      allPassed = false;
      console.error(`❌ ${route} -> Headers: ${headerCount}, Footers: ${footerCount}`);
    } else {
      console.log(`✓ ${route} -> Header: 1, Footer: 1`);
    }
  }

  console.log('\n======================================================');
  if (allPassed) {
    console.log('🏆 VERIFICATION PASSED: Every route has exactly ONE header and ONE footer.');
  } else {
    console.log('❌ VERIFICATION FAILED: Duplicate header or footer found.');
  }
  console.log('======================================================');
}

main().catch(console.error);
