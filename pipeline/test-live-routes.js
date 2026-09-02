import http from 'http';

const BASE_URL = 'http://localhost:3005';

const routes = [
  '/',
  '/jobs/govt',
  '/jobs/private',
  '/jobs/armed-forces',
  '/jobs/police-law-enforcement',
  '/jobs/judiciary-legal',
  '/jobs/public-sector-enterprises',
  '/jobs/teaching-education',
  '/jobs/healthcare-medical',
  '/jobs/local-government',
  '/jobs/banking-finance',
  '/jobs/engineering',
  '/jobs/ngo-international',
  '/jobs/internships-trainee',
  '/jobs/overseas-gulf',
  '/jobs/remote-freelance',
  '/jobs/exam-recruitment-hub',
  '/sitemap.xml',
  '/robots.txt'
];

function fetchRoute(route) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${route}`;
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          route,
          statusCode: res.statusCode,
          body
        });
      });
    }).on('error', (err) => {
      resolve({
        route,
        statusCode: 500,
        error: err.message
      });
    });
  });
}

async function verify() {
  console.log('Testing live server routes at http://localhost:3005...\n');
  let errors = 0;

  for (const route of routes) {
    const res = await fetchRoute(route);
    if (res.statusCode === 200) {
      // Check H1 if it's a job category route
      let h1Match = res.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      let h1Text = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'N/A';
      console.log(`  ✓ [200 OK] ${route.padEnd(35)} (H1: "${h1Text.slice(0, 40)}...")`);
    } else {
      console.error(`  ✗ [FAIL ${res.statusCode}] ${route} - ${res.error || ''}`);
      errors++;
    }
  }

  // Specific check: Banking & Finance page content
  console.log('\nVerifying /jobs/banking-finance page content...');
  const bankingRes = await fetchRoute('/jobs/banking-finance');
  const hasSBP = bankingRes.body.includes('State Bank') || bankingRes.body.includes('SBOTS');
  const hasMeezan = bankingRes.body.includes('Meezan');
  console.log(`  ✓ Contains State Bank of Pakistan: ${hasSBP}`);
  console.log(`  ✓ Contains Meezan Bank: ${hasMeezan}`);

  if (!hasSBP || !hasMeezan) {
    console.error('  ✗ Missing SBP or Meezan on Banking & Finance page!');
    errors++;
  }

  // Check sitemap contains new category routes
  console.log('\nVerifying /sitemap.xml contains expanded category routes...');
  const sitemapRes = await fetchRoute('/sitemap.xml');
  const hasArmedForces = sitemapRes.body.includes('/jobs/armed-forces');
  const hasBanking = sitemapRes.body.includes('/jobs/banking-finance');
  const hasRemote = sitemapRes.body.includes('/jobs/remote-freelance');
  console.log(`  ✓ Sitemap includes /jobs/armed-forces: ${hasArmedForces}`);
  console.log(`  ✓ Sitemap includes /jobs/banking-finance: ${hasBanking}`);
  console.log(`  ✓ Sitemap includes /jobs/remote-freelance: ${hasRemote}`);

  if (!hasArmedForces || !hasBanking || !hasRemote) {
    console.error('  ✗ Sitemap missing new category routes!');
    errors++;
  }

  console.log('\n==================================================');
  if (errors === 0) {
    console.log('✓ ALL LIVE ROUTES & CATEGORY LANDING PAGES VERIFIED (0 errors)');
  } else {
    console.error(`Found ${errors} errors during live verification.`);
    process.exit(1);
  }
  console.log('==================================================');
}

verify().catch(console.error);
