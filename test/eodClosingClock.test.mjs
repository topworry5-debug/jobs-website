import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  getPakistanToday,
  calculateDaysRemaining,
  getJobStatus,
  isJobOpen,
  getJobDeadlineInfo,
  filterOpenJobs,
  partitionJobs,
  shouldHidePrivateJob
} from '../src/lib/jobStatus.js';
import { generateJobPostingSchema } from '../src/utils/seoHelpers.js';

test('End-of-day closing clock: at 2026-11-23 23:59 PKT job is open and shows "Closes today"', () => {
  // 2026-11-23 23:59:00 PKT is 2026-11-23T18:59:00.000Z in UTC
  const clock2359 = new Date('2026-11-23T18:59:00.000Z');
  
  const testJob = {
    id: "fpsc-live-api-100",
    title: "GR – Consolidated Advertisement No. 4/2026",
    lastDate: "2026-11-23",
    type: "govt",
    employerType: "government"
  };

  const daysLeft = calculateDaysRemaining(testJob.lastDate, clock2359);
  assert.equal(daysLeft, 0, 'At 23:59 PKT on 23 Nov, daysLeft should be 0');

  const isOpen = isJobOpen(testJob, clock2359);
  assert.equal(isOpen, true, 'At 23:59 PKT on 23 Nov, job should still be open');

  const status = getJobStatus(testJob, clock2359);
  assert.equal(status, 'closing-soon');

  const deadlineInfo = getJobDeadlineInfo(testJob.lastDate, testJob.status, clock2359);
  assert.equal(deadlineInfo.isExpired, false);
  assert.equal(deadlineInfo.isClosingToday, true);
  assert.equal(deadlineInfo.statusLabel, 'Closes today');
  assert.equal(deadlineInfo.badgeClass, 'badge-closing-today');

  const openList = filterOpenJobs([testJob], { referenceDate: clock2359 });
  assert.equal(openList.length, 1, 'Job must be included in openJobs list');

  const { openJobs, recentlyClosedJobs } = partitionJobs([testJob], 30, { referenceDate: clock2359 });
  assert.equal(openJobs.length, 1, 'Job must be in openJobs partition');
  assert.equal(recentlyClosedJobs.length, 0);
});

test('End-of-day closing clock: at 2026-11-24 00:00 PKT job is closed and leaves open list and counters', () => {
  // 2026-11-24 00:00:00 PKT is 2026-11-23T19:00:00.000Z in UTC
  const clock0000 = new Date('2026-11-23T19:00:00.000Z');
  
  const testJob = {
    id: "fpsc-live-api-100",
    title: "GR – Consolidated Advertisement No. 4/2026",
    lastDate: "2026-11-23",
    type: "govt",
    employerType: "government"
  };

  const daysLeft = calculateDaysRemaining(testJob.lastDate, clock0000);
  assert.equal(daysLeft, -1, 'At 00:00 PKT on 24 Nov, daysLeft should be -1');

  const isOpen = isJobOpen(testJob, clock0000);
  assert.equal(isOpen, false, 'At 00:00 PKT on 24 Nov, job must be closed');

  const status = getJobStatus(testJob, clock0000);
  assert.equal(status, 'closed');

  const deadlineInfo = getJobDeadlineInfo(testJob.lastDate, testJob.status, clock0000);
  assert.equal(deadlineInfo.isExpired, true);
  assert.equal(deadlineInfo.isClosingToday, false);
  assert.equal(deadlineInfo.statusLabel, 'Closed');
  assert.equal(deadlineInfo.badgeClass, 'badge-expired');

  const openList = filterOpenJobs([testJob], { referenceDate: clock0000 });
  assert.equal(openList.length, 0, 'Job must NOT be in openJobs list');

  const { openJobs, recentlyClosedJobs } = partitionJobs([testJob], 30, { referenceDate: clock0000 });
  assert.equal(openJobs.length, 0, 'Job must leave openJobs partition');
  assert.equal(recentlyClosedJobs.length, 1, 'Job moves into recentlyClosedJobs (remains reachable at URL)');
});

test('JobPosting Schema validThrough adheres to 23:59:59+05:00 end-of-day rule', () => {
  const job = {
    id: "css-2027",
    title: "CSS Competitive Examination-2027",
    lastDate: "2026-11-25",
    type: "govt",
    employerType: "government"
  };
  const schema = generateJobPostingSchema(job);
  assert.equal(schema.validThrough, "2026-11-25T23:59:59+05:00", 'Schema validThrough must specify 23:59:59+05:00 end of day PKT');
});

test('Private job threshold rule: Multinational Oil & Gas is hidden when active private jobs < 20', () => {
  const privateJob = {
    id: "nts-live-multinational-oil-and-gas-company-induct-2026-11-27",
    title: "Multinational Oil and Gas Company — Field Production Trainees",
    lastDate: "2026-11-27",
    type: "private",
    employerType: "private"
  };

  // Only 1 private job in the system
  const allJobs = [privateJob];

  const shouldHide = shouldHidePrivateJob(privateJob, allJobs);
  assert.equal(shouldHide, true, 'Should hide private job when private jobs count < 20');

  const publicOpenJobs = filterOpenJobs(allJobs);
  assert.equal(publicOpenJobs.length, 0, 'Hidden private job should not appear in public openJobs');
});

