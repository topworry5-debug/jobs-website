/**
 * Tainaati — Centralized Job Status, Expiry Lifecycle & Deadline Utilities
 * Single Source-of-Truth for job active/closed/closing-today statuses.
 * Automatically excludes past-deadline jobs from listings, trending sections, and stats.
 */

/**
 * Calculates calendar days remaining until the specified ISO deadline string.
 * Uses midnight normalization for exact calendar day accuracy.
 * @param {string} dateStr - Date string (e.g. "2026-09-03")
 * @param {Date} [refDate] - Reference date (defaults to current system time)
 * @returns {number|null} Days remaining (positive = future, 0 = today, negative = past)
 */
export function calculateDaysLeft(dateStr, refDate = new Date()) {
  if (!dateStr) return null;
  const todayMidnight = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());
  
  const targetDate = new Date(dateStr);
  if (isNaN(targetDate.getTime())) return null;
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  
  const diffMs = targetMidnight.getTime() - todayMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns true if a job's deadline has passed or if it is marked closed/expired.
 * @param {Object} job - Job object
 * @returns {boolean}
 */
export function isJobExpired(job) {
  if (!job) return false;
  if (job.status === 'expired' || job.status === 'closed') return true;
  if (!job.lastDate) return false;
  const days = calculateDaysLeft(job.lastDate);
  return days !== null && days < 0;
}

/**
 * Returns true if a job has already expired OR is closing today (0d left).
 * Used to strictly exclude jobs with 0d or negative days from Trending Opportunities.
 * @param {Object} job - Job object
 * @returns {boolean}
 */
export function isJobClosedOrClosingToday(job) {
  if (!job) return false;
  if (isJobExpired(job)) return true;
  const days = calculateDaysLeft(job.lastDate);
  return days !== null && days <= 0;
}

/**
 * Returns true if a job is open and has an active future deadline (or closing today for regular search).
 * @param {Object} job - Job object
 * @returns {boolean}
 */
export function isJobActive(job) {
  return !isJobExpired(job);
}

/**
 * Computes structured deadline & urgency metadata for display on cards and detail pages.
 * @param {string} dateStr - Deadline date string
 * @param {string} [jobStatus] - Optional status field on job
 * @returns {Object}
 */
export function getJobDeadlineInfo(dateStr, jobStatus) {
  if (jobStatus === 'expired' || jobStatus === 'closed') {
    return {
      daysLeft: -1,
      isExpired: true,
      isClosingToday: false,
      isUrgent: false,
      isClosingSoon: false,
      statusLabel: 'Applications Closed',
      badgeClass: 'badge-expired',
      colorTone: 'gray'
    };
  }

  const daysLeft = calculateDaysLeft(dateStr);

  if (daysLeft === null) {
    return {
      daysLeft: null,
      isExpired: false,
      isClosingToday: false,
      isUrgent: false,
      isClosingSoon: false,
      statusLabel: 'Ongoing',
      badgeClass: 'badge-normal',
      colorTone: 'green'
    };
  }

  if (daysLeft < 0) {
    return {
      daysLeft,
      isExpired: true,
      isClosingToday: false,
      isUrgent: false,
      isClosingSoon: false,
      statusLabel: 'Applications Closed',
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
 * Filters a list of jobs to only include active listings (excluding expired/closed).
 * @param {Array} jobsList - List of jobs
 * @returns {Array}
 */
export function filterActiveJobs(jobsList = []) {
  if (!Array.isArray(jobsList)) return [];
  return jobsList.filter(job => !isJobExpired(job));
}

/**
 * Filters a list of jobs eligible for "Trending Opportunities".
 * Excludes any job that has expired OR is closing today (0d left).
 * @param {Array} jobsList - List of jobs
 * @param {number} [limit=6] - Max jobs to return
 * @returns {Array}
 */
export function filterTrendingOpportunities(jobsList = [], limit = 6) {
  if (!Array.isArray(jobsList)) return [];
  return jobsList
    .filter(job => !isJobClosedOrClosingToday(job))
    .sort((a, b) => {
      // Prioritize featured, then vacancy count, then urgency (closing in 1-7 days)
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.vacancies || 1) - (a.vacancies || 1);
    })
    .slice(0, limit);
}
