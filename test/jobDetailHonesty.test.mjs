import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  formatDisplayDate, 
  getJobRelativeTime, 
  calculateDaysRemaining,
  getJobDeadlineInfo 
} from '../src/lib/jobStatus.js';
import { formatJobDeadline } from '../src/utils/textCleaning.js';
import { 
  formatJobPageTitle, 
  formatJobPageDescription, 
  generateJobPostingSchema 
} from '../src/utils/seoHelpers.js';
import { deduplicateJobs } from '../pipeline/engine/deduplicator.js';

test('TASK Q — Requirement C: Shared date formatter produces "25 Nov 2026" in Asia/Karachi', () => {
  assert.equal(formatDisplayDate('2026-11-25'), '25 Nov 2026');
  assert.equal(formatDisplayDate('2026-11-08'), '8 Nov 2026');
  assert.equal(formatDisplayDate('2026-12-04'), '4 Dec 2026');
  assert.equal(formatDisplayDate('2026-11-14T08:00:00.000Z'), '14 Nov 2026');
  assert.equal(formatDisplayDate(null), null);
});

test('TASK Q — Requirement C: Fixed clock relative time (now = 2026-11-24 13:00 PKT)', () => {
  const fixedNow = new Date('2026-11-24T13:00:00+05:00');

  // Deadline 25 Nov 2026 -> Exactly "Closes tomorrow"
  const relTomorrow = getJobRelativeTime('2026-11-25', fixedNow);
  assert.equal(relTomorrow.label, 'Closes tomorrow');
  assert.equal(relTomorrow.daysLeft, 1);
  assert.equal(relTomorrow.isClosingTomorrow, true);
  assert.equal(relTomorrow.isClosed, false);

  // List helper formatJobDeadline must return the exact same "Closes tomorrow" and "25 Nov 2026"
  const listDeadline = formatJobDeadline('2026-11-25', 'active', fixedNow);
  assert.equal(listDeadline.relativeLabel, 'Closes tomorrow');
  assert.equal(listDeadline.dateFormatted, '25 Nov 2026');
  assert.equal(listDeadline.daysLeft, 1);

  // Deadline 24 Nov 2026 -> "Closes today"
  const relToday = getJobRelativeTime('2026-11-24', fixedNow);
  assert.equal(relToday.label, 'Closes today');
  assert.equal(relToday.daysLeft, 0);
  assert.equal(relToday.isClosingToday, true);

  // Deadline 26 Nov 2026 -> "2 days left"
  const rel2Days = getJobRelativeTime('2026-11-26', fixedNow);
  assert.equal(rel2Days.label, '2 days left');
  assert.equal(rel2Days.daysLeft, 2);

  // Deadline 30 Nov 2026 -> "6 days left"
  const rel6Days = getJobRelativeTime('2026-11-30', fixedNow);
  assert.equal(rel6Days.label, '6 days left');
  assert.equal(rel6Days.daysLeft, 6);

  // Deadline 23 Nov 2026 -> "Closed"
  const relClosed = getJobRelativeTime('2026-11-23', fixedNow);
  assert.equal(relClosed.label, 'Closed');
  assert.equal(relClosed.daysLeft, -1);
  assert.equal(relClosed.isClosed, true);
});

test('TASK Q — Requirement F: Page title is <= 60 chars and never leaves unclosed parentheses', () => {
  const cssJob = {
    title: 'CSS Competitive Examination-2027 (Written Exam)',
    agency: 'FPSC'
  };

  const title = formatJobPageTitle(cssJob);
  assert.ok(title.length <= 60, `Title exceeds 60 chars: "${title}" (${title.length})`);
  assert.ok(!title.includes('(Written'), `Title contains cut-off open parenthesis: "${title}"`);
  assert.ok(!title.includes('(') || title.includes(')'), `Unmatched parenthesis in title: "${title}"`);
  assert.match(title, /Tainaati$/);
});

test('TASK Q — Requirement F: Meta description has no fake claims and formats date properly', () => {
  const cssJob = {
    title: 'CSS Competitive Examination-2027 (Written Exam)',
    department: 'Federal Public Service Commission (CSS Cadres)',
    agency: 'FPSC',
    lastDate: '2026-11-25',
    vacancies: null
  };

  const desc = formatJobPageDescription(cssJob);
  assert.ok(desc.length <= 155, `Description exceeds 155 chars: "${desc}" (${desc.length})`);
  assert.ok(!desc.includes('Official vacancy notice'), 'Contains "Official vacancy notice" claim');
  assert.ok(!desc.includes('Official notification details'), 'Contains "Official notification details" claim');
  assert.ok(!desc.includes('2026-11-25'), 'Contains raw unformatted date');
  assert.ok(desc.includes('Last date: 25 Nov 2026.'), 'Does not format deadline as "25 Nov 2026"');
});

test('TASK Q — Requirement A: Schema.org JobPosting uses postDate falling back to firstSeenAt', () => {
  const jobWithPostDate = {
    id: 'test-job-1',
    slug: 'test-job-1',
    title: 'Inspector Customs',
    agency: 'FPSC',
    postDate: '2026-11-08',
    firstSeenAt: '2026-11-10T12:00:00.000Z',
    lastDate: '2026-11-25'
  };

  const schema1 = generateJobPostingSchema(jobWithPostDate);
  assert.equal(schema1.datePosted, '2026-11-08T00:00:00+05:00');
  assert.equal(schema1.validThrough, '2026-11-25T23:59:59+05:00');

  const jobWithoutPostDate = {
    id: 'test-job-2',
    slug: 'test-job-2',
    title: 'Assistant Director',
    agency: 'FPSC',
    postDate: null,
    firstSeenAt: '2026-11-10T12:00:00.000Z',
    lastDate: '2026-11-25'
  };

  const schema2 = generateJobPostingSchema(jobWithoutPostDate);
  assert.equal(schema2.datePosted, '2026-11-10T12:00:00.000Z');
});

test('TASK Q — Requirement A: Deduplication never overwrites existing postDate on later runs', () => {
  const existingJob = {
    id: 'fpsc-live-api-101',
    title: 'CSS Competitive Examination-2027 (Written Exam)',
    agency: 'FPSC',
    postDate: '2026-11-08',
    firstSeenAt: '2026-11-08T10:00:00.000Z',
    lastDate: '2026-11-25'
  };

  const rescrapedJob = {
    id: 'fpsc-live-api-101',
    title: 'CSS Competitive Examination-2027 (Written Exam)',
    agency: 'FPSC',
    postDate: '2026-11-24', // Scraper saw it today
    lastDate: '2026-11-25'
  };

  const result = deduplicateJobs([rescrapedJob], [existingJob]);
  const merged = result.mergedJobs.find(j => j.id === 'fpsc-live-api-101');
  assert.equal(merged.postDate, '2026-11-08', 'postDate was improperly overwritten by new scrape date!');
  assert.equal(merged.firstSeenAt, '2026-11-08T10:00:00.000Z', 'firstSeenAt was improperly overwritten!');
});
