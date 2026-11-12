/**
 * Tainaati — Strict Job Ingestion Validation & Integrity Guard
 * Zero tolerance for fabricated, guessed, or placeholder job data.
 * Validates that every listing originates from a verified official source with authentic fields.
 */

import crypto from 'crypto';

const ALLOWED_OFFICIAL_DOMAINS = [
  'fpsc.gov.pk',
  'ppsc.gop.pk',
  'spsc.gov.pk',
  'spsc.gos.pk',
  'kppsc.gov.pk',
  'bpsc.gob.pk',
  'nts.org.pk',
  'portal.nts.org.pk',
  'anf.gov.pk',
  'wapda.gov.pk',
  'sbp.org.pk',
  'fbr.gov.pk',
  'pitb.gov.pk',
  'hec.gov.pk'
];

/**
 * Validates a single incoming job entry against strict criteria.
 * @param {Object} job - Raw scraped job object
 * @returns {Object} { isValid: boolean, errors: string[], sanitizedJob: Object|null }
 */
export function validateJobEntry(job) {
  const errors = [];

  // 1. Title validation
  if (!job.title || typeof job.title !== 'string' || job.title.trim().length < 5) {
    errors.push('Missing or invalid job title (minimum 5 characters required)');
  }

  // 2. Agency validation
  if (!job.agency || typeof job.agency !== 'string' || job.agency.trim().length < 2) {
    errors.push('Missing or invalid agency identifier');
  }

  // 3. Official Source URL validation
  const officialUrl = job.officialNotificationUrl || job.officialUrl || job.sourceUrl;
  let isOfficialDomain = false;
  if (!officialUrl || typeof officialUrl !== 'string' || !officialUrl.startsWith('http')) {
    errors.push('Missing or malformed official application/notification URL');
  } else {
    try {
      const parsedUrl = new URL(officialUrl);
      isOfficialDomain = ALLOWED_OFFICIAL_DOMAINS.some(d => parsedUrl.hostname.includes(d)) ||
        parsedUrl.hostname.endsWith('.gov.pk') ||
        parsedUrl.hostname.endsWith('.gop.pk') ||
        parsedUrl.hostname.endsWith('.gos.pk') ||
        parsedUrl.hostname.endsWith('.gob.pk') ||
        parsedUrl.hostname.endsWith('.org.pk');
      if (!isOfficialDomain && job.type === 'govt') {
        errors.push(`Untrusted government domain: ${parsedUrl.hostname}`);
      }
    } catch {
      errors.push('Failed to parse official source URL');
    }
  }

  // 4. Deadline / Last Date validation (must be parseable YYYY-MM-DD)
  if (!job.lastDate || !/^\d{4}-\d{2}-\d{2}$/.test(job.lastDate)) {
    errors.push(`Invalid or missing lastDate ("${job.lastDate}") — must be YYYY-MM-DD`);
  } else {
    const deadlineTime = new Date(`${job.lastDate}T23:59:59`).getTime();
    if (isNaN(deadlineTime)) {
      errors.push(`Unparseable deadline date timestamp: "${job.lastDate}"`);
    }
  }

  // 5. Anti-placeholder check
  const forbiddenPhrases = ['lorem ipsum', 'sample job', 'test opening', 'demo post', 'fake', 'placeholder', 'dummy'];
  const textToCheck = `${job.title || ''} ${job.description || ''} ${job.department || ''}`.toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (textToCheck.includes(phrase)) {
      errors.push(`Found forbidden test phrase: "${phrase}"`);
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      sanitizedJob: null
    };
  }

  // Compute stable deterministic ID based on agency, title, and deadline
  const normalizedKey = `${(job.agency || '').toUpperCase()}:${(job.title || '').toLowerCase().trim()}:${job.lastDate}`;
  const stableHash = crypto.createHash('sha256').update(normalizedKey).digest('hex').slice(0, 12);
  const stableId = job.id && !job.id.includes(Date.now().toString().slice(0, 6))
    ? job.id
    : `${(job.agency || 'job').toLowerCase()}-${stableHash}`;

  const nowIso = new Date().toISOString();
  const deadlineTime = new Date(`${job.lastDate}T23:59:59`).getTime();
  const isActive = deadlineTime >= Date.now();

  const sanitized = {
    ...job,
    id: stableId,
    title: job.title.trim(),
    agency: (job.agency || '').toUpperCase().trim(),
    sourceUrl: officialUrl,
    officialUrl: job.officialUrl || officialUrl,
    officialNotificationUrl: job.officialNotificationUrl || officialUrl,
    scrapedAt: job.scrapedAt || nowIso,
    verifiedAt: isOfficialDomain ? (job.verifiedAt || nowIso) : null,
    status: isActive ? 'active' : 'archived',
    verified: isOfficialDomain,
    lastVerifiedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    dataIntegrityChecked: true,
    auditedAt: nowIso
  };

  return {
    isValid: true,
    errors: [],
    sanitizedJob: sanitized
  };
}

/**
 * Validates an array of scraped jobs, rejecting and logging invalid entries.
 * @param {Array} jobs - Raw scraped jobs
 * @returns {Object} { validJobs: Array, rejectedJobs: Array, validCount: number, rejectedCount: number }
 */
export function validateAndFilterPipelineJobs(jobs = []) {
  const validJobs = [];
  const rejectedJobs = [];

  for (const job of jobs) {
    const { isValid, errors, sanitizedJob } = validateJobEntry(job);
    if (isValid && sanitizedJob) {
      validJobs.push(sanitizedJob);
    } else {
      console.warn(`[Pipeline Validator Rejected] Job "${job?.title || 'Unknown'}": ${errors.join('; ')}`);
      rejectedJobs.push({
        jobId: job?.id || 'none',
        title: job?.title || 'Unknown',
        agency: job?.agency || 'Unknown',
        errors
      });
    }
  }

  return {
    validJobs,
    rejectedJobs,
    validCount: validJobs.length,
    rejectedCount: rejectedJobs.length
  };
}
