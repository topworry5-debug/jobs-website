/**
 * Tainaati â€” Official Circular / Job Classifier
 * Strictly discriminates between actual recruitment announcements (active vacancies)
 * and non-recruitment circulars (examination timetables, interview schedules, roll number slips,
 * exam results, answer keys, syllabi, and administrative guidelines).
 */

const NON_RECRUITMENT_TITLE_PATTERNS = [
  /\b(?:time\s*table|timetable)\b/i,
  /\b(?:date\s*sheet|datesheet)\b/i,
  /\b(?:roll\s*no|roll\s*number(?:\s*slip)?)\b/i,
  /\b(?:admit\s*card|admission\s*certificate)\b/i,
  /\b(?:examination\s*schedule|exam\s*schedule)\b/i,
  /\b(?:interview\s*schedule|interview\s*program(?:me)?)\b/i,
  /\b(?:result\s*of|written\s*result|final\s*result|merit\s*list|answer\s*key)\b/i,
  /\b(?:syllabus\s*(?:for|outline)|curriculum\s*only)\b/i,
  /\b(?:user\s*manual|guidelines?\s*for\s*online\s*fee)\b/i,
  /\b(?:fpo\s*exam(?:ination)?|probationers?\s*exam)\b/i,
  /\b(?:scrutiny\s*notice|rejection\s*list)\b/i,
];

/**
 * Evaluates whether a notice is a valid recruitment job notice or a non-job circular.
 * @param {string} title 
 * @param {string} content 
 * @returns {{ isRecruitment: boolean, reason?: string }}
 */
export function classifyNotice(title = '', content = '') {
  const cleanTitle = (title || '').trim();
  if (!cleanTitle) {
    return { isRecruitment: false, reason: 'Empty title' };
  }

  for (const pattern of NON_RECRUITMENT_TITLE_PATTERNS) {
    if (pattern.test(cleanTitle)) {
      return {
        isRecruitment: false,
        reason: `Matched non-recruitment pattern in title: ${pattern.toString()}`
      };
    }
  }

  return { isRecruitment: true };
}
