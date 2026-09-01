const http = require('http');

const BASE_URL = 'http://localhost:3000';

function fetchUrl(urlPath) {
  return new Promise((resolve) => {
    const fullUrl = `${BASE_URL}${urlPath}`;
    http.get(fullUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path: urlPath,
          statusCode: res.statusCode,
          body: data
        });
      });
    }).on('error', (err) => {
      resolve({
        path: urlPath,
        statusCode: 500,
        error: err.message
      });
    });
  });
}

async function main() {
  console.log('=== PHASE 1: ROUTE & LINK CRAWLER ===\n');

  // Core Static & Functional Routes
  const coreRoutes = [
    '/',
    '/jobs/govt',
    '/jobs/private',
    '/exams',
    '/test-prep',
    '/cv-builder',
    '/alerts',
    '/blog',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/sitemap.xml',
    '/robots.txt',
    '/agency/ppsc',
    '/agency/fpsc',
    '/agency/spsc',
    '/agency/kppsc',
    '/agency/bpsc',
    '/agency/nts',
    '/city/lahore',
    '/city/karachi',
    '/city/islamabad',
    '/city/peshawar',
    '/city/quetta',
    '/city/rawalpindi',
    '/blog/ppsc-jobs-complete-guide',
    '/blog/fpsc-jobs-complete-guide',
    '/blog/today-govt-jobs-pakistan-live-digest',
    '/blog/nts-application-process-guide',
    '/blog/ppsc-vs-fpsc-key-differences'
  ];

  console.log(`Checking ${coreRoutes.length} core and landing routes...`);
  let errors = 0;

  for (const route of coreRoutes) {
    const res = await fetchUrl(route);
    if (res.statusCode === 200) {
      console.log(`  ✓ [${res.statusCode}] ${route}`);
    } else {
      console.error(`  ✗ [${res.statusCode}] ${route}`);
      errors++;
    }
  }

  // Crawl Homepage HTML to find all Job links and external links
  console.log('\nExtracting and testing all links from Homepage...');
  const homeRes = await fetchUrl('/');
  const linkRegex = /href="([^"]+)"/g;
  let match;
  const internalLinks = new Set();
  const externalLinks = new Set();

  while ((match = linkRegex.exec(homeRes.body)) !== null) {
    const href = match[1];
    if (href.startsWith('http://') || href.startsWith('https://')) {
      externalLinks.add(href);
    } else if (href.startsWith('/') && !href.startsWith('/_next') && !href.startsWith('/api')) {
      internalLinks.add(href);
    }
  }

  console.log(`Found ${internalLinks.size} internal links and ${externalLinks.size} external links on homepage.`);

  console.log('\nValidating all extracted internal routes...');
  for (const link of internalLinks) {
    const res = await fetchUrl(link);
    if (res.statusCode === 200) {
      console.log(`  ✓ [200] ${link}`);
    } else {
      console.error(`  ✗ [${res.statusCode}] ${link}`);
      errors++;
    }
  }

  console.log('\n=== PHASE 3: EXTERNAL LINK VALIDATION ===');
  const targetBlankRegex = /<a[^>]+href="(http[^"]+)"[^>]*>/g;
  let linkTagMatch;
  let missingSecurityAttributes = 0;

  while ((linkTagMatch = targetBlankRegex.exec(homeRes.body)) !== null) {
    const fullTag = linkTagMatch[0];
    const url = linkTagMatch[1];
    if (!fullTag.includes('rel="noopener') && !fullTag.includes('rel="noreferrer')) {
      if (fullTag.includes('target="_blank"')) {
        console.warn(`  ⚠ Missing rel="noopener noreferrer" on external link: ${url}`);
        missingSecurityAttributes++;
      }
    } else {
      console.log(`  ✓ Secure external link: ${url}`);
    }
  }

  console.log('\n==================================================');
  if (errors === 0 && missingSecurityAttributes === 0) {
    console.log('✓ ALL ROUTES AND LINKS PASSED VERIFICATION (0 errors)');
  } else {
    console.log(`Found ${errors} route errors, ${missingSecurityAttributes} link security warnings.`);
  }
  console.log('==================================================');
}

main().catch(console.error);
