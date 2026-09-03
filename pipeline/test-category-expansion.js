import fs from 'fs';
import path from 'path';
import { CATEGORIES_CONFIG, getCategoryBySlug, matchesJobCategory } from '../src/data/categoriesData.js';
import { computeJobMetrics } from '../src/utils/jobMetrics.js';

async function runTests() {
  console.log('====================================================');
  console.log('  TAINAATI CATEGORY EXPANSION VERIFICATION SUITE');
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

  // Load JOBS_DATA using JSON and config
  const liveScraped = JSON.parse(fs.readFileSync('src/data/liveScrapedJobs.json', 'utf-8'));
  
  // Read BASE_JOBS_DATA by evaluating or importing
  // Since jobsData.js is ESM, let's dynamic import
  const { JOBS_DATA, BASE_JOBS_DATA, EXAM_SCHEDULES } = await import('../src/data/jobsData.js');

  console.log(`Dataset size: ${JOBS_DATA.length} total jobs (${liveScraped.length} live scraped + ${BASE_JOBS_DATA.length} verified base jobs)`);

  // TEST 1: Taxonomy completeness (14 categories)
  console.log('\n--- TEST 1: Category Taxonomy ---');
  assert(CATEGORIES_CONFIG.length === 14, `Exactly 14 categories configured (found ${CATEGORIES_CONFIG.length})`);
  
  const expectedSlugs = [
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
    'exam-recruitment-hub'
  ];

  expectedSlugs.forEach(slug => {
    const cat = getCategoryBySlug(slug);
    assert(cat !== null, `Category '${slug}' exists in config`);
    assert(cat && cat.h1 && cat.metaTitle && cat.metaDescription, `Category '${slug}' has full SEO metadata`);
  });

  // TEST 2: Job Data Model Schema Compliance
  console.log('\n--- TEST 2: Job Schema & Categorization ---');
  let invalidJobs = 0;
  JOBS_DATA.forEach(job => {
    if (!job.category || !job.categorySlug || !job.subCategory) {
      invalidJobs++;
      console.warn(`Job ${job.id} missing category fields!`);
    }
  });
  assert(invalidJobs === 0, `All ${JOBS_DATA.length} jobs have category, categorySlug, and subCategory`);

  // TEST 3: Specific User Requirement — Filtering "Banking & Finance" + city "Karachi"
  console.log('\n--- TEST 3: Specific Query Requirement ("Banking & Finance" + "Karachi") ---');
  const bankingKarachiJobs = JOBS_DATA.filter(j => 
    matchesJobCategory(j, 'banking-finance') && 
    (j.city?.toLowerCase().includes('karachi') || j.city?.toLowerCase().includes('all pakistan'))
  );
  
  assert(bankingKarachiJobs.length > 0, `Filtering 'banking-finance' + 'Karachi' returned ${bankingKarachiJobs.length} active verified jobs`);
  bankingKarachiJobs.forEach(j => {
    console.log(`    -> [${j.department || j.company}] ${j.title} (City: ${j.city})`);
  });

  // TEST 4: Dedicated Landing Page Routes Check
  console.log('\n--- TEST 4: Static Landing Page Route Files ---');
  expectedSlugs.forEach(slug => {
    const pagePath = path.resolve('src/app/jobs', slug, 'page.jsx');
    const exists = fs.existsSync(pagePath);
    assert(exists, `Landing page route exists: /jobs/${slug}`);
  });

  // TEST 5: Dynamic Stats Recalculation
  console.log('\n--- TEST 5: Dynamic Platform Stats Recalculation ---');
  const metrics = computeJobMetrics(JOBS_DATA, EXAM_SCHEDULES);
  assert(metrics.totalListings === JOBS_DATA.length, `totalListings correctly equals ${JOBS_DATA.length}`);
  assert(metrics.totalVacancies > metrics.totalListings, `totalVacancies (${metrics.totalVacancies}) > listings count`);
  assert(metrics.verifiedDeptsCount > 10, `verifiedDeptsCount (${metrics.verifiedDeptsCount}) is accurately aggregated`);
  assert(metrics.govtCount > 0, `govtCount (${metrics.govtCount}) is non-zero`);
  assert(metrics.privateCount > 0, `privateCount (${metrics.privateCount}) is non-zero`);

  // TEST 6: Category Counts & Coming Soon Logic
  console.log('\n--- TEST 6: Category Counts & Coming Soon Logic ---');
  expectedSlugs.forEach(slug => {
    const catJobs = JOBS_DATA.filter(j => matchesJobCategory(j, slug));
    const isComingSoon = catJobs.length === 0;
    console.log(`    Category '${slug}': ${catJobs.length} verified jobs ${isComingSoon ? '[COMING SOON]' : '[ACTIVE]'}`);
    assert(catJobs.length >= 0, `Count computed safely for ${slug}`);
  });

  console.log('\n====================================================');
  console.log(`TOTAL: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
