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
 * @param {Date} [now=new Date()]
 * @returns {{ year: number, month: number, day: number, todayMidnight: Date }}
 */
export function getPakistanToday(now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.format(now).split('-');
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
 * @param {Date} [now=new Date()] - Reference time
 * @returns {number|null} Days remaining (positive = future, 0 = today, negative = past, null = invalid)
 */
export function calculateDaysRemaining(dateStr, now = new Date()) {
  if (!dateStr) return null;
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  const { todayMidnight } = getPakistanToday(now);
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
 * Determines a job's single source-of-truth status:
 * - "closing-soon": open and closes in 0 to 3 days
 * - "open": open and closes in more than 3 days
 * - "closed": deadline has passed or job is marked closed/archived/expired
 * 
 * @param {Object} job - Job object
 * @returns {"open" | "closing-soon" | "closed"}
 */
export function getJobStatus(job) {
  if (!job) return 'closed';

  const rawStatus = (job.status || '').toLowerCase().trim();
  if (rawStatus === 'closed' || rawStatus === 'archived' || rawStatus === 'expired') {
    return 'closed';
  }

  const days = calculateDaysRemaining(job.lastDate);
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
 * @returns {boolean}
 */
export function isJobOpen(job) {
  const status = getJobStatus(job);
  return status === 'open' || status === 'closing-soon';
}

// Backward-compatible aliases
export const isJobActive = isJobOpen;
export function isJobExpired(job) {
  return !isJobOpen(job);
}
export function isJobClosed(job) {
  return !isJobOpen(job);
}

/**
 * Returns true if a job is closed or closing today (0d left).
 * Used for sections like "Jobs Recommended For You" / "Trending" that avoid same-day expirations.
 * @param {Object} job - Job object
 * @returns {boolean}
 */
export function isJobClosedOrClosingToday(job) {
  if (!isJobOpen(job)) return true;
  const days = calculateDaysRemaining(job.lastDate);
  return days !== null && days <= 0;
}

/**
 * Returns true if a job is open and closing within the threshold (default 3 days).
 * @param {Object|string} jobOrDate - Job object or lastDate string
 * @param {number} [threshold=3]
 * @returns {boolean}
 */
export function isClosingSoon(jobOrDate, threshold = 3) {
  const dateStr = typeof jobOrDate === 'string' ? jobOrDate : jobOrDate?.lastDate;
  const days = calculateDaysRemaining(dateStr);
  return days !== null && days >= 0 && days <= threshold;
}

/**
 * Returns true if a job closed within the last maxDaysAgo days (default 30 days).
 * Older closed jobs (> 30 days) are not shown in recent closed lists.
 * @param {Object} job - Job object
 * @param {number} [maxDaysAgo=30]
 * @returns {boolean}
 */
export function isRecentlyClosed(job, maxDaysAgo = 30) {
  if (isJobOpen(job)) return false;
  const days = calculateDaysRemaining(job?.lastDate);
  if (days === null) return false;
  const daysAgo = -days;
  return daysAgo > 0 && daysAgo <= maxDaysAgo;
}

/**
 * Filters a list of jobs to strictly include OPEN positions.
 * @param {Array} jobsList - List of jobs
 * @returns {Array}
 */
export function filterOpenJobs(jobsList = []) {
  if (!Array.isArray(jobsList)) return [];
  return jobsList.filter(isJobOpen);
}

// Backward-compatible alias
export const filterActiveJobs = filterOpenJobs;

/**
 * Filters a list of jobs to strictly include positions that closed within the last 30 days.
 * @param {Array} jobsList - List of jobs
 * @param {number} [maxDaysAgo=30]
 * @returns {Array}
 */
export function filterRecentlyClosedJobs(jobsList = [], maxDaysAgo = 30) {
  if (!Array.isArray(jobsList)) return [];
  return jobsList
    .filter(job => isRecentlyClosed(job, maxDaysAgo))
    .sort((a, b) => {
      // Show most recently closed first
      const daysA = calculateDaysRemaining(a.lastDate) ?? -999;
      const daysB = calculateDaysRemaining(b.lastDate) ?? -999;
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
 * @returns {{ openJobs: Array, recentlyClosedJobs: Array, archivedOlderJobs: Array }}
 */
export function partitionJobs(jobsList = [], maxDaysAgo = 30) {
  if (!Array.isArray(jobsList)) {
    return { openJobs: [], recentlyClosedJobs: [], archivedOlderJobs: [] };
  }

  const openJobs = [];
  const recentlyClosedJobs = [];
  const archivedOlderJobs = [];

  for (const job of jobsList) {
    if (isJobOpen(job)) {
      openJobs.push(job);
    } else if (isRecentlyClosed(job, maxDaysAgo)) {
      recentlyClosedJobs.push(job);
    } else {
      archivedOlderJobs.push(job);
    }
  }

  // Sort recently closed: newest closure first
  recentlyClosedJobs.sort((a, b) => {
    const daysA = calculateDaysRemaining(a.lastDate) ?? -999;
    const daysB = calculateDaysRemaining(b.lastDate) ?? -999;
    return daysB - daysA;
  });

  return { openJobs, recentlyClosedJobs, archivedOlderJobs };
}

const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const UR_MONTHS = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];

/**
 * Shared date formatter for Tainaati:
 * Formats dates strictly as "15 Nov 2026" in Asia/Karachi timezone.
 * In Urdu mode: "15 نومبر 2026" (numeric day, Urdu month, numeric year - never reversed).
 * 
 * @param {string|Date} dateInput - ISO string, YYYY-MM-DD, or Date object
 * @param {string} [locale='en'] - 'en' | 'ur' | 'ro'
 * @returns {string} Formatted date, e.g. "15 Nov 2026"
 */
export function formatDate(dateInput, locale = 'en') {
  if (!dateInput) return '';

  let day, monthIdx, year;

  if (typeof dateInput === 'string') {
    const match = dateInput.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      year = match[1];
      monthIdx = parseInt(match[2], 10) - 1;
      day = parseInt(match[3], 10);
    }
  }

  if (day === undefined) {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = formatter.format(d).split('-');
    year = parts[0];
    monthIdx = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  }

  if (monthIdx < 0 || monthIdx > 11) return String(dateInput);

  if (locale === 'ur') {
    return `${day} ${UR_MONTHS[monthIdx]} ${year}`;
  }
  return `${day} ${EN_MONTHS[monthIdx]} ${year}`;
}

/**
 * Computes structured deadline & urgency metadata for cards and detail views.
 * Rules:
 * - closes today -> "Closes today" (urgent/red)
 * - 1 day -> "Closes tomorrow" (urgent/red)
 * - 2 to 3 days -> "N days left" (urgent/red)
 * - 4 to 30 days -> "N days left" (normal/not red)
 * - > 30 days -> show only date (relativeLabel = '')
 * - passed / closed -> "Closed" (closed/muted)
 * 
 * @param {string} dateStr - Deadline date string
 * @param {string} [jobStatus] - Optional status field on job
 * @param {Date} [now=new Date()] - Reference timestamp
 * @param {string} [locale='en'] - Locale for date formatting
 * @returns {Object}
 */
export function getJobDeadlineInfo(dateStr, jobStatus, now = new Date(), locale = 'en') {
  const rawStatus = (jobStatus || '').toLowerCase().trim();
  const dateFormatted = dateStr ? formatDate(dateStr, locale) : 'Refer to ad';

  if (!dateStr) {
    return {
      daysLeft: null,
      isExpired: false,
      isClosed: false,
      isClosingToday: false,
      isUrgent: false,
      isClosingSoon: false,
      statusLabel: 'Ongoing',
      relativeLabel: 'Ongoing',
      badgeClass: 'badge-normal',
      colorTone: 'gray',
      dateFormatted
    };
  }

  const daysLeft = calculateDaysRemaining(dateStr, now);

  if (rawStatus === 'closed' || rawStatus === 'archived' || rawStatus === 'expired' || daysLeft === null || daysLeft < 0) {
    return {
      daysLeft: daysLeft ?? -1,
      isExpired: true,
      isClosed: true,
      isClosingToday: false,
      isUrgent: false,
      isClosingSoon: false,
      statusLabel: 'Closed',
      relativeLabel: 'Closed',
      badgeClass: 'badge-expired',
      colorTone: 'gray',
      dateFormatted
    };
  }

  if (daysLeft === 0) {
    return {
      daysLeft: 0,
      isExpired: false,
      isClosed: false,
      isClosingToday: true,
      isUrgent: true,
      isClosingSoon: true,
      statusLabel: 'Closes today',
      relativeLabel: 'Closes today',
      badgeClass: 'badge-closing-today',
      colorTone: 'red',
      dateFormatted
    };
  }

  if (daysLeft === 1) {
    return {
      daysLeft: 1,
      isExpired: false,
      isClosed: false,
      isClosingToday: false,
      isUrgent: true,
      isClosingSoon: true,
      statusLabel: 'Closes tomorrow',
      relativeLabel: 'Closes tomorrow',
      badgeClass: 'badge-urgent',
      colorTone: 'red',
      dateFormatted
    };
  }

  if (daysLeft <= 3) {
    return {
      daysLeft,
      isExpired: false,
      isClosed: false,
      isClosingToday: false,
      isUrgent: true,
      isClosingSoon: true,
      statusLabel: `${daysLeft} days left`,
      relativeLabel: `${daysLeft} days left`,
      badgeClass: 'badge-urgent',
      colorTone: 'red',
      dateFormatted
    };
  }

  if (daysLeft <= 30) {
    return {
      daysLeft,
      isExpired: false,
      isClosed: false,
      isClosingToday: false,
      isUrgent: false,
      isClosingSoon: false,
      statusLabel: `${daysLeft} days left`,
      relativeLabel: `${daysLeft} days left`,
      badgeClass: 'badge-normal',
      colorTone: 'green',
      dateFormatted
    };
  }

  // More than 30 days: show only the date (no relative label)
  return {
    daysLeft,
    isExpired: false,
    isClosed: false,
    isClosingToday: false,
    isUrgent: false,
    isClosingSoon: false,
    statusLabel: '',
    relativeLabel: '',
    badgeClass: 'badge-normal',
    colorTone: 'gray',
    dateFormatted
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

