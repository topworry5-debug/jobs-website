/**
 * Tainaati — Job Status & Expiry Utilities
 * Re-exports everything from the centralized single source-of-truth helper module (src/lib/jobStatus.js).
 */

export * from '../lib/jobStatus.js';

import { 
  filterOpenJobs, 
  isJobClosedOrClosingToday 
} from '../lib/jobStatus.js';

/**
 * Filters a list of jobs eligible for "Trending Opportunities".
 * Excludes any job that has expired OR is closing today (0d left).
 * Strictly operates on verified OPEN jobs.
 * @param {Array} jobsList - List of jobs
 * @param {number} [limit=6] - Max jobs to return
 * @returns {Array}
 */
export function filterTrendingOpportunities(jobsList = [], limit = 6) {
  if (!Array.isArray(jobsList)) return [];
  const openJobs = filterOpenJobs(jobsList);
  return openJobs
    .filter(job => !isJobClosedOrClosingToday(job))
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.vacancies || 1) - (a.vacancies || 1);
    })
    .slice(0, limit);
}
