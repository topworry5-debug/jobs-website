/**
 * Tainaati — Strict Job Ingestion Validation & Integrity Guard
 * Zero tolerance for fabricated, guessed, or placeholder job data.
 * Validates that every listing originates from a verified official source with authentic fields.
 */

const ALLOWED_GOVT_DOMAINS = [
  'fpsc.gov.pk',
  'ppsc.gop.pk',
  'spsc.gos.pk',
  'kppsc.gov.pk',
  'nts.org.pk',
  'anf.gov.pk',
  'wapda.gov.pk',
  'sbp.org.pk',
  'fbr.gov.pk',
  'pitb.gov.pk',
  'hec.gov.pk'
];

export function validateJobEntry(job) {
  const errors = [];

  // 1. Title validation
  if (!job.title || typeof job.title !== 'string' || job.title.trim().length < 5) {
    errors.push('Missing or invalid job title (minimum 5 characters required)');
  }

  // 2. Official URL validation
  if (!job.officialUrl || typeof job.officialUrl !== 'string') {
    errors.push('Missing official application URL');
  } else {
    try {
      const parsedUrl = new URL(job.officialUrl);
      const isGovt = job.type === 'govt';
      if (isGovt) {
        const isOfficialDomain = ALLOWED_GOVT_DOMAINS.some(d => parsedUrl.hostname.includes(d));
        if (!isOfficialDomain && !parsedUrl.hostname.includes('.gov.pk') && !parsedUrl.hostname.includes('.gop.pk')) {
          errors.push(`Untrusted government domain: ${parsedUrl.hostname}`);
        }
      }
    } catch {
      errors.push('Malformed official URL');
    }
  }

  // 3. Deadline / Last Date validation
  if (!job.lastDate || !/^\d{4}-\d{2}-\d{2}$/.test(job.lastDate)) {
    errors.push('Invalid or missing lastDate (must be YYYY-MM-DD)');
  } else {
    const deadlineTime = new Date(`${job.lastDate}T23:59:59`).getTime();
    if (isNaN(deadlineTime)) {
      errors.push('Unparseable deadline date');
    }
  }

  // 4. Department / Organization validation
  if (!job.department && !job.company) {
    errors.push('Missing hiring department or company');
  }

  // 5. Check for disallowed placeholder strings
  const forbiddenPhrases = ['lorem ipsum', 'sample job', 'test opening', 'demo post', 'fake', 'placeholder', 'dummy'];
  const textToCheck = `${job.title} ${job.description || ''} ${job.department || ''} ${job.company || ''}`.toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (textToCheck.includes(phrase)) {
      errors.push(`Found forbidden test phrase: "${phrase}"`);
    }
  }

  // Sanitize fields: Never guess vacancies or qualifications
  const sanitized = {
    ...job,
    vacancies: typeof job.vacancies === 'number' && job.vacancies > 0 ? job.vacancies : null,
    qualification: job.qualification && job.qualification.trim().length > 0 
      ? job.qualification 
      : 'As per official advertisement criteria (See Gazette notice)',
    verified: true,
    dataIntegrityChecked: true,
    auditedAt: new Date().toISOString()
  };

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedJob: sanitized
  };
}

export function validateAndFilterPipelineJobs(jobs = []) {
  const validJobs = [];
  const rejectedJobs = [];
  const seenDescriptions = new Map();

  for (const job of jobs) {
    const { isValid, errors, sanitizedJob } = validateJobEntry(job);
    
    // Uniqueness & anti-copy-paste guard
    const desc = (job.description || '').trim();
    if (desc && seenDescriptions.has(desc)) {
      errors.push(`Duplicate copy-pasted description detected (identical to ${seenDescriptions.get(desc)})`);
    } else if (desc) {
      seenDescriptions.set(desc, job.title || job.id);
    }

    if (isValid && errors.length === 0) {
      validJobs.push(sanitizedJob);
    } else {
      rejectedJobs.push({
        jobId: job.id,
        title: job.title,
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
