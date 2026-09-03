import http from 'http';

const BASE_URL = 'http://localhost:3005';

const routes = [
  '/',
  '/saved-jobs',
  '/salary-calculator',
  '/exam-results',
  '/alerts',
  '/jobs/matric-inter-support',
  '/jobs/agriculture-livestock',
  '/jobs/ajk-gilgit-baltistan',
  '/jobs/shutdown-industrial',
  '/jobs/part-time-labor',
  '/jobs/media-journalism',
  '/sitemap.xml'
];

function fetchRoute(route) {
  return new Promise((resolve) => {
    http.get(`${BASE_URL}${route}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ route, statusCode: res.statusCode, body }));
    }).on('error', (err) => resolve({ route, statusCode: 500, error: err.message }));
  });
}

async function verify() {
  console.log('Testing live server routes on http://localhost:3005...\n');
  let errors = 0;

  for (const route of routes) {
    const res = await fetchRoute(route);
    if (res.statusCode === 200) {
      let h1Match = res.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      let h1Text = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'N/A';
      console.log(`  ✓ [200 OK] ${route.padEnd(32)} (H1: "${h1Text.slice(0, 35)}...")`);
    } else {
      console.error(`  ✗ [FAIL ${res.statusCode}] ${route}`);
      errors++;
    }
  }

  console.log('\nVerifying BPS Salary Calculator Content...');
  const calcRes = await fetchRoute('/salary-calculator');
  const hasBps17 = calcRes.body.includes('BPS-17') || calcRes.body.includes('Salary Calculator');
  const hasFinance = calcRes.body.includes('finance.gov.pk');
  console.log(`  ✓ Contains BPS Calculator: ${hasBps17}`);
  console.log(`  ✓ Links to Finance Division: ${hasFinance}`);
  if (!hasBps17 || !hasFinance) errors++;

  console.log('\nVerifying Exam Results & Roll Number Slip Hub Content...');
  const examsRes = await fetchRoute('/exam-results');
  const hasFpsc = examsRes.body.includes('FPSC') && examsRes.body.includes('PPSC');
  const hasRollSlip = examsRes.body.includes('Roll Number Slip') || examsRes.body.includes('Admission');
  console.log(`  ✓ Contains Commissions (FPSC, PPSC): ${hasFpsc}`);
  console.log(`  ✓ Contains Roll Number Slip gateway: ${hasRollSlip}`);
  if (!hasFpsc || !hasRollSlip) errors++;

  console.log('\nVerifying Saved Jobs & Application Tracker...');
  const savedRes = await fetchRoute('/saved-jobs');
  const hasTracker = savedRes.body.includes('Saved Jobs') || savedRes.body.includes('Application Tracker');
  console.log(`  ✓ Contains Application Tracker: ${hasTracker}`);
  if (!hasTracker) errors++;

  console.log('\n==================================================');
  if (errors === 0) {
    console.log('✓ ALL NEW CATEGORIES & PLATFORM FEATURES VERIFIED (0 errors)');
  } else {
    console.error(`Found ${errors} errors during verification.`);
    process.exit(1);
  }
  console.log('==================================================');
}

verify().catch(console.error);
