/**
 * Tainaati — Single Source of Truth for Job Status, Expiry, Deadlines & Counters
 * 
 * Rules:
 * 1. An open job has a deadline on/after today (end of day Pakistan time: Asia/Karachi, UTC+5).
 * 2. "closing-soon": 3 days or fewer remaining (0 <= days <= 3).
 * 3. "closed": deadline passed (< 0 days), or job explicitly marked closed/archived/expired.
 * 4. "recently-closed": closed within the last 30 days (1 <= daysAgo <= 30).
 * 5. Older closed jobs (> 30 days ago) remain accessible at their own URL only.
 * 6. Counters must show the number of OPEN jobs only. If open = 0, do not show a number; show nothing or plain text. Never show "0+".
 */

import liveScrapedJobs from '../data/liveScrapedJobs.json' with { type: 'json' };

/**
 * Returns the current date in Pakistan Time (Asia/Karachi).
 * @param {Date|string} [referenceDate=new Date()] Optional reference date for fixed-clock testing
 * @returns {{ year: number, month: number, day: number, todayMidnight: Date }}
 */
export function getPakistanToday(referenceDate = new Date()) {
  const targetDate = typeof referenceDate === 'string' ? new Date(referenceDate) : referenceDate;
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.format(targetDate).split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  
  // Local date object representing midnight in local representation of PKT day
  const todayMidnight = new Date(year, month - 1, day, 0, 0, 0, 0);
  return { year, month, day, todayMidnight };
}

/**
 * Calculates calendar days remaining until the specified deadline string,
 * normalized against Pakistan Time (Asia/Karachi) end of day.
 * 
 * @param {string} dateStr - Date string (e.g. "2026-11-20" or ISO string)
 * @param {Date|string} [referenceDate=new Date()] Optional reference date for testing
 * @returns {number|null} Days remaining (positive = future, 0 = today, negative = past, null = invalid)
 */
export function calculateDaysRemaining(dateStr, referenceDate = new Date()) {
  if (!dateStr) return null;
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  const { todayMidnight } = getPakistanToday(referenceDate);
  const y = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const d = parseInt(match[3], 10);

  const targetMidnight = new Date(y, m - 1, d, 0, 0, 0, 0);
  const diffMs = targetMidnight.getTime() - todayMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

// Backward-compatible alias
export const calculateDaysLeft = calculateDaysRemaining;

/**
 * Counts total active open private jobs.
 * @param {Array} jobsList
 * @param {Date|string} [referenceDate=new Date()]
 * @returns {number}
 */
export function countActivePrivateJobs(jobsList = [], referenceDate = new Date()) {
  if (!Array.isArray(jobsList)) return 0;
  return jobsList.filter(j => (j.employerType === 'private' || j.type === 'private') && isJobOpen(j, referenceDate)).length;
}

/**
 * Determines whether a private job should be hidden from public listings and counters.
 * Rule: Hide private jobs unless there are at least 20 current open private jobs.
 * @param {Object} job
 * @param {Array} jobsList
 * @param {Date|string} [referenceDate=new Date()]
 * @returns {boolean}
 */
export function shouldHidePrivateJob(job, jobsList = [], referenceDate = new Date()) {
  if (!job) return false;
  const isPrivate = job.employerType === 'private' || job.type === 'private';
  if (!isPrivate) return false;
  return countActivePrivateJobs(jobsList, referenceDate) < 20;
}

/**
 * Determines a job's single source-of-truth status:
 * - "closing-soon": open and closes in 0 to 3 days
 * - "open": open and closes in more than 3 days
 * - "closed": deadline has passed or job is marked closed/archived/expired
 * 
 * @param {Object} job - Job object
 * @param {Date|string} [referenceDate=new Date()] Optional reference date for testing
 * @returns {"open" | "closing-soon" | "closed"}
 */
export function getJobStatus(job, referenceDate = new Date()) {
  if (!job) return 'closed';

  const rawStatus = (job.status || '').toLowerCase().trim();
  if (rawStatus === 'closed' || rawStatus === 'archived' || rawStatus === 'expired') {
    return 'closed';
  }

  const days = calculateDaysRemaining(job.lastDate, referenceDate);
  if (days === null) {
    // If deadline cannot be parsed and job isn't verified, treat as closed
    return 'closed';
  }

  if (days < 0) {
    return 'closed';
  }

  if (days <= 3) {
    return 'closing-soon';
  }

  return 'open';
}

/**
 * Returns true if a job is open (deadline on or after today in Pakistan).
 * @param {Object} job - Job object
 * @param {Date|string} [referenceDate=new Date()] Optional reference date for testing
 * @returns {boolean}
 */
export function isJobOpen(job, referenceDate = new Date()) {
  const status = getJobStatus(job, referenceDate);
  return status === 'open' || status === 'closing-soon';
}

// Backward-compatible aliases
export const isJobActive = isJobOpen;
export function isJobExpired(job, referenceDate = new Date()) {
  return !isJobOpen(job, referenceDate);
}
export function isJobClosed(job, referenceDate = new Date()) {
  return !isJobOpen(job, referenceDate);
}

/**
 * Returns true if a job is closed or closing today (0d left).
 * Used for sections like "Jobs Recommended For You" / "Trending" that avoid same-day expirations.
 * @param {Object} job - Job object
 * @param {Date|string} [referenceDate=new Date()]
 * @returns {boolean}
 */
export function isJobClosedOrClosingToday(job, referenceDate = new Date()) {
  if (!isJobOpen(job, referenceDate)) return true;
  const days = calculateDaysRemaining(job.lastDate, referenceDate);
  return days !== null && days <= 0;
}

/**
 * Returns true if a job is open and closing within the threshold (default 3 days).
 * @param {Object|string} jobOrDate - Job object or lastDate string
 * @param {number} [threshold=3]
 * @param {Date|string} [referenceDate=new Date()]
 * @returns {boolean}
 */
export function isClosingSoon(jobOrDate, threshold = 3, referenceDate = new Date()) {
  const dateStr = typeof jobOrDate === 'string' ? jobOrDate : jobOrDate?.lastDate;
  const days = calculateDaysRemaining(dateStr, referenceDate);
  return days !== null && days >= 0 && days <= threshold;
}

/**
 * Returns true if a job closed within the last maxDaysAgo days (default 30 days).
 * Older closed jobs (> 30 days) are not shown in recent closed lists.
 * @param {Object} job - Job object
 * @param {number} [maxDaysAgo=30]
 * @param {Date|string} [referenceDate=new Date()]
 * @returns {boolean}
 */
export function isRecentlyClosed(job, maxDaysAgo = 30, referenceDate = new Date()) {
  if (isJobOpen(job, referenceDate)) return false;
  const days = calculateDaysRemaining(job?.lastDate, referenceDate);
  if (days === null) return false;
  const daysAgo = -days;
  return daysAgo > 0 && daysAgo <= maxDaysAgo;
}

/**
 * Filters a list of jobs to strictly include OPEN positions.
 * @param {Array} jobsList - List of jobs
 * @param {Object} [options={}] Options including referenceDate and includeHiddenPrivate
 * @returns {Array}
 */
export function filterOpenJobs(jobsList = [], options = {}) {
  if (!Array.isArray(jobsList)) return [];
  const referenceDate = options.referenceDate || new Date();
  const includeHiddenPrivate = options.includeHiddenPrivate ?? false;
  const activePrivateCount = countActivePrivateJobs(jobsList, referenceDate);

  return jobsList.filter(job => {
    if (!isJobOpen(job, referenceDate)) return false;
    const isPrivate = job.employerType === 'private' || job.type === 'private';
    if (isPrivate && !includeHiddenPrivate && activePrivateCount < 20) {
      return false;
    }
    return true;
  });
}

// Backward-compatible alias
export const filterActiveJobs = filterOpenJobs;

/**
 * Filters a list of jobs to strictly include positions that closed within the last 30 days.
 * @param {Array} jobsList - List of jobs
 * @param {number} [maxDaysAgo=30]
 * @param {Date|string} [referenceDate=new Date()]
 * @returns {Array}
 */
export function filterRecentlyClosedJobs(jobsList = [], maxDaysAgo = 30, referenceDate = new Date()) {
  if (!Array.isArray(jobsList)) return [];
  return jobsList
    .filter(job => isRecentlyClosed(job, maxDaysAgo, referenceDate))
    .sort((a, b) => {
      // Show most recently closed first
      const daysA = calculateDaysRemaining(a.lastDate, referenceDate) ?? -999;
      const daysB = calculateDaysRemaining(b.lastDate, referenceDate) ?? -999;
      return daysB - daysA; // e.g. -1 comes before -28
    });
}

/**
 * Partitions a job array into:
 * - openJobs (open & closing-soon)
 * - recentlyClosedJobs (closed within the last 30 days)
 * - archivedOlderJobs (closed > 30 days ago, accessible only at direct URL)
 * 
 * @param {Array} jobsList
 * @param {number} [maxDaysAgo=30]
 * @param {Object} [options={}]
 * @returns {{ openJobs: Array, recentlyClosedJobs: Array, archivedOlderJobs: Array }}
 */
export function partitionJobs(jobsList = [], maxDaysAgo = 30, options = {}) {
  if (!Array.isArray(jobsList)) {
    return { openJobs: [], recentlyClosedJobs: [], archivedOlderJobs: [] };
  }

  const referenceDate = options.referenceDate || new Date();
  const includeHiddenPrivate = options.includeHiddenPrivate ?? false;
  const activePrivateCount = countActivePrivateJobs(jobsList, referenceDate);

  const openJobs = [];
  const recentlyClosedJobs = [];
  const archivedOlderJobs = [];

  for (const job of jobsList) {
    const isPrivate = job.employerType === 'private' || job.type === 'private';
    if (isPrivate && !includeHiddenPrivate && activePrivateCount < 20) {
      // Hidden from open list, counters and recent closures until >= 20 private jobs
      archivedOlderJobs.push(job);
      continue;
    }

    if (isJobOpen(job, referenceDate)) {
      openJobs.push(job);
    } else if (isRecentlyClosed(job, maxDaysAgo, referenceDate)) {
      recentlyClosedJobs.push(job);
    } else {
      archivedOlderJobs.push(job);
    }
  }

  // Sort recently closed: newest closure first
  recentlyClosedJobs.sort((a, b) => {
    const daysA = calculateDaysRemaining(a.lastDate, referenceDate) ?? -999;
    const daysB = calculateDaysRemaining(b.lastDate, referenceDate) ?? -999;
    return daysB - daysA;
  });

  return { openJobs, recentlyClosedJobs, archivedOlderJobs };
}

/**
 * Computes structured deadline & urgency metadata for cards and detail views.
 * GUARANTEE: Closed jobs NEVER show "d left" text and always have badgeClass 'badge-expired'.
 * 
 * @param {string} dateStr - Deadline date string
 * @param {string} [jobStatus] - Optional status field on job
 * @param {Date|string} [referenceDate=new Date()] Optional reference date for testing
 * @returns {Object}
 */
export function getJobDeadlineInfo(dateStr, jobStatus, referenceDate = new Date()) {
  const rawStatus = (jobStatus || '').toLowerCase().trim();
  if (rawStatus === 'closed' || rawStatus === 'archived' || rawStatus === 'expired') {
    return {
      daysLeft: -1,
      isExpired: true,
      isClosingToday: false,
      isUrgent: false,
      isClosingSoon: false,
      statusLabel: 'Closed',
      badgeClass: 'badge-expired',
      colorTone: 'gray'
    };
  }

  const daysLeft = calculateDaysRemaining(dateStr, referenceDate);

  if (daysLeft === null || daysLeft < 0) {
    return {
      daysLeft: daysLeft ?? -1,
      isExpired: true,
      isClosingToday: false,
      isUrgent: false,
      isClosingSoon: false,
      statusLabel: 'Closed',
      badgeClass: 'badge-expired',
      colorTone: 'red'
    };
  }

  if (daysLeft === 0) {
    return {
      daysLeft: 0,
      isExpired: false,
      isClosingToday: true,
      isUrgent: true,
      isClosingSoon: true,
      statusLabel: 'Closes today',
      badgeClass: 'badge-closing-today',
      colorTone: 'red'
    };
  }

  if (daysLeft <= 3) {
    return {
      daysLeft,
      isExpired: false,
      isClosingToday: false,
      isUrgent: true,
      isClosingSoon: true,
      statusLabel: `${daysLeft}d left`,
      badgeClass: 'badge-urgent',
      colorTone: 'red'
    };
  }

  if (daysLeft <= 7) {
    return {
      daysLeft,
      isExpired: false,
      isClosingToday: false,
      isUrgent: false,
      isClosingSoon: true,
      statusLabel: `${daysLeft}d left`,
      badgeClass: 'badge-soon',
      colorTone: 'amber'
    };
  }

  return {
    daysLeft,
    isExpired: false,
    isClosingToday: false,
    isUrgent: false,
    isClosingSoon: false,
    statusLabel: `${daysLeft}d left`,
    badgeClass: 'badge-normal',
    colorTone: 'green'
  };
}

/**
 * Extracts the real latest scraped timestamp from live scraped jobs,
 * formatted cleanly in Pakistan Standard Time (PKT).
 * 
 * @param {Array} [jobs] - Optional jobs array, defaults to liveScrapedJobs
 * @returns {string} Formatted timestamp, e.g. "Nov 11, 2026, 12:02 PM PKT"
 */
export function getLastUpdatedTimestamp(jobs = liveScrapedJobs) {
  let latestDate = null;
  const targetList = Array.isArray(jobs) && jobs.length > 0 ? jobs : liveScrapedJobs;

  for (const job of targetList) {
    if (job?.scrapedAt) {
      const d = new Date(job.scrapedAt);
      if (!isNaN(d.getTime()) && (!latestDate || d > latestDate)) {
        latestDate = d;
      }
    }
  }

  if (!latestDate) {
    // If no scrapedAt is present, use today in Pakistan time
    const { year, month, day } = getPakistanToday();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${monthNames[month - 1]} ${year} PKT`;
  }

  try {
    const formatted = latestDate.toLocaleString('en-US', {
      timeZone: 'Asia/Karachi',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${formatted} PKT`;
  } catch {
    return latestDate.toISOString();
  }
}

/**
 * Converts any string into a clean, URL-safe slug.
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generates an indexable, clean URL slug for a job following:
 * /jobs/{agency}-{post-title}-{city}-{year}-{id}
 * 
 * @param {Object} job
 * @returns {string} Clean URL slug
 */
export function getJobSlug(job) {
  if (!job) return '';
  if (job.slug) return job.slug;

  // If base job ID already contains full clean slug structure (agency-title-...-year)
  if (job.id && /^[a-z0-9]+-[a-z0-9]+.*-(19|20)\d{2}$/i.test(job.id)) {
    return slugify(job.id);
  }

  const agency = slugify(job.agency || 'govt') || 'govt';
  const rawTitle = slugify(job.title || 'job-vacancy').slice(0, 45).replace(/-+$/, '');
  const rawCity = slugify(job.city ? job.city.split(',')[0].split('/')[0] : 'pakistan').slice(0, 20).replace(/-+$/, '');
  const year = job.postDate ? job.postDate.split('-')[0] : (job.lastDate ? job.lastDate.split('-')[0] : '2026');
  
  // Clean idSuffix by stripping duplicate live prefixes
  const idSuffix = slugify(job.id || 'post').replace(/^(fpsc|ppsc|spsc|kppsc|bpsc|nts)-live-/, '');

  return `${agency}-${rawTitle}-${rawCity}-${year}-${idSuffix}`.replace(/--+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Returns the canonical relative URL for a job.
 * @param {Object} job
 * @returns {string} e.g. "/jobs/fpsc-css-competitive-examination-2027-islamabad-2026-api-101"
 */
export function getJobUrl(job) {
  if (!job) return '/jobs/govt';
  const slug = job.slug || getJobSlug(job) || job.id;
  return `/jobs/${slug}`;
}

/**
 * Resolves a job object from a list by clean slug or raw ID (case-insensitive).
 * @param {string} slugOrId
 * @param {Array} jobsList
 * @returns {Object|null}
 */
export function findJobBySlugOrId(slugOrId, jobsList = []) {
  if (!slugOrId || !Array.isArray(jobsList)) return null;
  const target = String(slugOrId).toLowerCase().trim();

  return jobsList.find(j => {
    if (!j) return false;
    if (j.slug && j.slug.toLowerCase() === target) return true;
    if (j.id && j.id.toLowerCase() === target) return true;
    if (getJobSlug(j).toLowerCase() === target) return true;
    return false;
  }) || null;
}

