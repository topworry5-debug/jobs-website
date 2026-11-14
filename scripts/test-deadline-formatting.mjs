/**
 * Unit Test: Tainaati Calendar-Based Deadline & Date Formatting in Asia/Karachi
 */
import assert from 'node:assert/strict';
import { getJobDeadlineInfo, formatDate, calculateDaysRemaining } from '../src/lib/jobStatus.js';

console.log('--- Running Deadline and Date Formatting Unit Tests ---');

// Fixed reference time: Saturday, 14 Nov 2026, 10:00:00 AM PKT (UTC+5)
const fixedNow = new Date('2026-11-14T10:00:00+05:00');

// 1. Date Formatting
assert.equal(formatDate('2026-11-15', 'en'), '15 Nov 2026', 'Date should be 15 Nov 2026 in English');
assert.equal(formatDate('2026-11-15', 'ur'), '15 نومبر 2026', 'Date should be 15 نومبر 2026 in Urdu');
assert.equal(formatDate('2026-11-15T00:00:00Z', 'en'), '15 Nov 2026', 'ISO timestamp formats to 15 Nov 2026');
console.log('✓ Test 1 Passed: formatDate produces "15 Nov 2026" and "15 نومبر 2026" (never reversed)');

// 2. Deadline Closes Today (14 Nov)
const todayInfo = getJobDeadlineInfo('2026-11-14', 'open', fixedNow);
assert.equal(todayInfo.daysLeft, 0, 'Days left should be 0');
assert.equal(todayInfo.relativeLabel, 'Closes today', 'Label should be Closes today');
assert.equal(todayInfo.isUrgent, true, 'Closes today must have isUrgent=true (red styling)');
assert.equal(todayInfo.isClosed, false, 'Closes today is not closed');
console.log('✓ Test 2 Passed: 14 Nov (today) -> "Closes today" (urgent/red)');

// 3. Deadline Closes Tomorrow (15 Nov)
const tomorrowInfo = getJobDeadlineInfo('2026-11-15', 'open', fixedNow);
assert.equal(tomorrowInfo.daysLeft, 1, 'Days left should be 1');
assert.equal(tomorrowInfo.relativeLabel, 'Closes tomorrow', 'Label should be Closes tomorrow');
assert.equal(tomorrowInfo.isUrgent, true, 'Closes tomorrow must have isUrgent=true (red styling)');
assert.equal(tomorrowInfo.isClosed, false, 'Closes tomorrow is not closed');
console.log('✓ Test 3 Passed: 15 Nov (tomorrow) -> "Closes tomorrow" (urgent/red)');

// 4. Deadline 2 Days Left (16 Nov)
const twoDaysInfo = getJobDeadlineInfo('2026-11-16', 'open', fixedNow);
assert.equal(twoDaysInfo.daysLeft, 2, 'Days left should be 2');
assert.equal(twoDaysInfo.relativeLabel, '2 days left', 'Label should put number first: "2 days left"');
assert.equal(twoDaysInfo.isUrgent, true, '2 days left must have isUrgent=true (red styling)');
console.log('✓ Test 4 Passed: 16 Nov -> "2 days left" (urgent/red)');

// 5. Deadline 3 Days Left (17 Nov)
const threeDaysInfo = getJobDeadlineInfo('2026-11-17', 'open', fixedNow);
assert.equal(threeDaysInfo.daysLeft, 3, 'Days left should be 3');
assert.equal(threeDaysInfo.relativeLabel, '3 days left', 'Label should be "3 days left"');
assert.equal(threeDaysInfo.isUrgent, true, '3 days left must have isUrgent=true (red styling)');
console.log('✓ Test 5 Passed: 17 Nov -> "3 days left" (urgent/red)');

// 6. Deadline 9 Days Left (23 Nov) - non-urgent (> 3 days)
const nineDaysInfo = getJobDeadlineInfo('2026-11-23', 'open', fixedNow);
assert.equal(nineDaysInfo.daysLeft, 9, 'Days left should be 9');
assert.equal(nineDaysInfo.relativeLabel, '9 days left', 'Label should be "9 days left"');
assert.equal(nineDaysInfo.isUrgent, false, '9 days left must have isUrgent=false (normal styling)');
console.log('✓ Test 6 Passed: 23 Nov -> "9 days left" (normal styling, not red)');

// 7. Deadline Past (13 Nov) -> Closed
const pastInfo = getJobDeadlineInfo('2026-11-13', 'open', fixedNow);
assert.equal(pastInfo.isClosed, true, 'Past deadline should be isClosed=true');
assert.equal(pastInfo.relativeLabel, 'Closed', 'Label should be Closed');
assert.equal(pastInfo.isUrgent, false, 'Closed must not be urgent/red');
console.log('✓ Test 7 Passed: 13 Nov -> "Closed" (closed/muted)');

// 8. Explicitly marked closed/archived/expired job
const explicitClosed = getJobDeadlineInfo('2026-11-25', 'closed', fixedNow);
assert.equal(explicitClosed.isClosed, true, 'Explicit closed status must be isClosed=true');
assert.equal(explicitClosed.relativeLabel, 'Closed', 'Label must be Closed');
assert.equal(explicitClosed.isUrgent, false, 'Closed must not be urgent');
console.log('✓ Test 8 Passed: Explicit status "closed" -> "Closed"');

// 9. Deadline > 30 Days (20 Dec 2026) -> Only show date, empty relativeLabel
const distantInfo = getJobDeadlineInfo('2026-12-20', 'open', fixedNow);
assert.equal(distantInfo.daysLeft, 36, 'Days left should be 36');
assert.equal(distantInfo.relativeLabel, '', 'Relative label should be empty for > 30 days');
assert.equal(distantInfo.dateFormatted, '20 Dec 2026', 'Date formatted must be present');
console.log('✓ Test 9 Passed: 20 Dec (> 30 days) -> only date shown, relativeLabel is empty');

console.log('\n========================================');
console.log('ALL 9 DEADLINE & DATE FORMATTING TESTS PASSED!');
console.log('========================================');
