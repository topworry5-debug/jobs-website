/**
 * Tainaati â€” Verified Job Override Manager
 * Applies human-verified and audit-verified corrections from src/data/jobOverrides.json
 * to scraped jobs, logging detailed warnings whenever scraped values deviate from verified facts.
 */

import jobOverridesData from '../../src/data/jobOverrides.json' with { type: 'json' };

export function loadJobOverrides() {
  return jobOverridesData || {};
}

const GENERIC_PORTAL_URLS = new Set([
  'https://www.ppsc.gop.pk/Jobs.aspx',
  'https://www.ppsc.gop.pk/(S(bk4bwbqxcj01qrxis0e2t4jo))/Jobs.aspx',
  'https://bpsc.gob.pk/BPSC/pages?jobs',
  'https://bpsc.gob.pk',
  'https://spsc.gov.pk/advertisements',
  'https://spsc.gov.pk',
  'https://www.kppsc.gov.pk/advertisement',
  'https://www.nts.org.pk/new/projectsnew.php',
  'https://www.fpsc.gov.pk/Jobs?section=GR',
  'https://www.fpsc.gov.pk/Jobs?section=CSS',
  'https://www.fpsc.gov.pk/Jobs',
  'https://www.fpsc.gov.pk'
]);

/**
 * Applies overrides to a single scraped job.
 * @param {Object} job 
 * @returns {Object} Updated job
 */
export function applyJobOverride(job) {
  if (!job) return job;
  const overrides = loadJobOverrides();
  
  let matchKey = null;
  let override = null;

  // 1. Direct stable ID match
  if (job.id && overrides[job.id]) {
    matchKey = job.id;
    override = overrides[job.id];
  }

  // 2. Base ID match (e.g. ppsc-live-106c2026-1 matches ppsc-live-106c2026-1)
  if (!override && job.id) {
    const baseId = job.id.replace(/-\d+$/, '');
    for (const [key, val] of Object.entries(overrides)) {
      if (key === baseId || job.id.startsWith(key) || key.startsWith(baseId)) {
        matchKey = key;
        override = val;
        break;
      }
    }
  }

  // 3. Match by specific non-generic official notification URL or source URL
  if (!override) {
    for (const [key, val] of Object.entries(overrides)) {
      if (val.officialNotificationUrl && !GENERIC_PORTAL_URLS.has(val.officialNotificationUrl)) {
        if (job.officialNotificationUrl === val.officialNotificationUrl) {
          matchKey = key;
          override = val;
          break;
        }
      }
      if (val.sourceUrl && !GENERIC_PORTAL_URLS.has(val.sourceUrl)) {
        if (job.sourceUrl === val.sourceUrl || job.officialUrl === val.sourceUrl) {
          matchKey = key;
          override = val;
          break;
        }
      }
    }
  }

  // 4. Special match for PPSC case number in title or ID (e.g. 106C2026 / Combined Competitive Exam)
  if (!override && (job.agency === 'PPSC' || job.id?.startsWith('ppsc-'))) {
    if (job.title?.includes('106C2026') || job.id?.includes('106c2026') || job.title?.includes('COMBINED COMPETITIVE EXAMINATION-2026')) {
      if (overrides['ppsc-live-106c2026-1']) {
        matchKey = 'ppsc-live-106c2026-1';
        override = overrides['ppsc-live-106c2026-1'];
      }
    }
  }

  if (!override) {
    return job;
  }

  const updated = { ...job };
  const diffs = [];

  for (const [field, newVal] of Object.entries(override.fields || {})) {
    const oldVal = job[field];
    if (oldVal !== newVal) {
      diffs.push(`${field}: [Scraped: ${oldVal}] -> [Override: ${newVal}]`);
      updated[field] = newVal;
    }
  }

  // Also attach audit metadata
  if (override.evidenceQuote) updated.evidenceQuote = override.evidenceQuote;
  if (override.evidenceType) updated.evidenceType = override.evidenceType;
  if (override.verifiedAt) updated.verifiedAt = override.verifiedAt;
  if (override.verifiedBy) updated.verifiedBy = override.verifiedBy;
  if (override.notes) updated.auditNotes = override.notes;

  if (diffs.length > 0) {
    console.warn(`[Override Applied] Job [${job.id} - ${job.title}]:\n  ` + diffs.join('\n  '));
  }

  return updated;
}

/**
 * Applies overrides to an array of jobs.
 * @param {Array<Object>} jobs 
 * @returns {Array<Object>}
 */
export function applyAllJobOverrides(jobs) {
  return (jobs || []).map(applyJobOverride);
}
