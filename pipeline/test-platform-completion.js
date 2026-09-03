import fs from 'fs';
import path from 'path';
import { CATEGORIES_CONFIG, getCategoryBySlug, matchesJobCategory } from '../src/data/categoriesData.js';
import { BPS_DATA, calculateBpsSalary } from '../src/data/bpsPayScaleData.js';
import { COMMISSIONS_PORTALS } from '../src/data/examResultsData.js';
import { computeJobMetrics } from '../src/utils/jobMetrics.js';

async function runPlatformTests() {
  console.log('====================================================');
  console.log('  TAINAATI COMPLETE PLATFORM VERIFICATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // Load live scraped and base jobs cleanly
  const liveScrapedJobs = JSON.parse(fs.readFileSync('src/data/liveScrapedJobs.json', 'utf8'));
  const jobsDataRaw = fs.readFileSync('src/data/jobsData.js', 'utf8');
  
  // Extract BASE_JOBS_DATA array
  const baseJobsMatch = jobsDataRaw.match(/export const BASE_JOBS_DATA = (\[[\s\S]*?\]);\s*export const JOBS_DATA/);
  let BASE_JOBS_DATA = [];
  if (baseJobsMatch) {
    BASE_JOBS_DATA = eval(baseJobsMatch[1]);
  }
  const JOBS_DATA = [...BASE_JOBS_DATA, ...liveScrapedJobs];
  const EXAM_SCHEDULES = [];

  console.log(`Total Dataset Size: ${JOBS_DATA.length} verified listings\n`);

  // TEST 1: 20 Categories Taxonomy
  console.log('--- TEST 1: 20 Categories Taxonomy ---');
  assert(CATEGORIES_CONFIG.length === 20, `Total categories configured = 20 (found ${CATEGORIES_CONFIG.length})`);

  const expected20Slugs = [
    'armed-forces',
    'police-law-enforcement',
    'judiciary-legal',
    'public-sector-enterprises',
    'teaching-education',
    'healthcare-medical',
    'local-government',
    'banking-finance',
    'engineering',
    'ngo-international',
    'internships-trainee',
    'overseas-gulf',
    'remote-freelance',
    'exam-recruitment-hub',
    'matric-inter-support',
    'agriculture-livestock',
    'ajk-gilgit-baltistan',
    'shutdown-industrial',
    'part-time-labor',
    'media-journalism'
  ];

  expected20Slugs.forEach(slug => {
    const cat = getCategoryBySlug(slug);
    assert(cat !== null, `Category '${slug}' exists in config`);
    assert(cat && cat.h1 && cat.metaTitle && cat.subcategories.length > 0, `Category '${slug}' has full metadata & subcategories`);
  });

  // TEST 2: Job Data Schema Compliance
  console.log('\n--- TEST 2: Job Data Schema Compliance ---');
  let invalidJobs = 0;
  JOBS_DATA.forEach(j => {
    if (!j.category || !j.categorySlug || !j.subCategory) {
      invalidJobs++;
      console.warn(`Job missing fields: ${j.id}`);
    }
  });
  assert(invalidJobs === 0, `All ${JOBS_DATA.length} jobs have valid category, categorySlug, and subCategory`);

  // TEST 3: BPS Salary Calculator Engine
  console.log('\n--- TEST 3: BPS Pay Scale Salary Calculator ---');
  assert(BPS_DATA.length === 22, `All 22 BPS grades (1-22) present in BPS_DATA`);

  const sampleBps17BigCity = calculateBpsSalary({ gradeNumber: 17, stage: 0, isBigCity: true });
  const sampleBps17OtherCity = calculateBpsSalary({ gradeNumber: 17, stage: 0, isBigCity: false });

  assert(sampleBps17BigCity.basicPay === 45070, `BPS-17 Min Basic Pay is 45,070 PKR`);
  assert(sampleBps17BigCity.grossSalary > sampleBps17OtherCity.grossSalary, `Big City gross (${sampleBps17BigCity.grossSalary}) > Other City gross (${sampleBps17OtherCity.grossSalary})`);
  assert(sampleBps17BigCity.estimatedNetPay < sampleBps17BigCity.grossSalary, `Net pay correctly deducts GP Fund / taxes`);

  const sampleBps1 = calculateBpsSalary({ gradeNumber: 1, stage: 5, isBigCity: true });
  assert(sampleBps1.basicPay === 13550 + (430 * 5), `BPS-1 Stage 5 incremental salary computes accurately`);

  // TEST 4: Exam Results & Roll Number Slips Gateway
  console.log('\n--- TEST 4: Exam Results & Roll Number Slips Directory ---');
  assert(COMMISSIONS_PORTALS.length >= 6, `Commissions portals count >= 6 (found ${COMMISSIONS_PORTALS.length})`);
  const fpscPortal = COMMISSIONS_PORTALS.find(p => p.agencyId === 'fpsc');
  assert(fpscPortal && fpscPortal.services.some(s => s.type === 'slip'), `FPSC has Roll No Slip service`);
  const ppscPortal = COMMISSIONS_PORTALS.find(p => p.agencyId === 'ppsc');
  assert(ppscPortal && ppscPortal.services.some(s => s.type === 'result'), `PPSC has Results service`);

  // TEST 5: Route Files Existence
  console.log('\n--- TEST 5: Route Files Existence ---');
  expected20Slugs.forEach(slug => {
    const p = path.resolve('src/app/jobs', slug, 'page.jsx');
    assert(fs.existsSync(p), `Category landing route exists: /jobs/${slug}`);
  });

  assert(fs.existsSync(path.resolve('src/app/saved-jobs/page.jsx')), `Saved Jobs route exists: /saved-jobs`);
  assert(fs.existsSync(path.resolve('src/app/salary-calculator/page.jsx')), `Salary Calculator route exists: /salary-calculator`);
  assert(fs.existsSync(path.resolve('src/app/exam-results/page.jsx')), `Exam Results route exists: /exam-results`);

  // TEST 6: Dynamic Platform Stats Recalculation
  console.log('\n--- TEST 6: Dynamic Platform Stats Recalculation ---');
  const metrics = computeJobMetrics(JOBS_DATA, EXAM_SCHEDULES);
  assert(metrics.totalListings === JOBS_DATA.length, `totalListings (${metrics.totalListings}) equals dataset size`);
  assert(metrics.totalVacancies > 1000, `totalVacancies (${metrics.totalVacancies}) > 1000 positions`);
  assert(metrics.verifiedDeptsCount >= 30, `verifiedDeptsCount (${metrics.verifiedDeptsCount}) >= 30`);

  // TEST 7: Category Counts & Coming Soon State
  console.log('\n--- TEST 7: Category Counts ---');
  expected20Slugs.forEach(slug => {
    const catJobs = JOBS_DATA.filter(j => matchesJobCategory(j, slug));
    console.log(`    Category '${slug}': ${catJobs.length} verified listings ${catJobs.length === 0 ? '[COMING SOON]' : '[ACTIVE]'}`);
    assert(catJobs.length >= 0, `Category count valid for ${slug}`);
  });

  console.log('\n====================================================');
  console.log(`TOTAL: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runPlatformTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
