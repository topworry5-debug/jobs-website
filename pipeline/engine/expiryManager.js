/**
 * Tainaati — Job Expiry & Lifecycle Manager
 * Automatically detects and archives listings whose application deadline has passed.
 * Moves expired jobs to "archived" status with `archived_at` timestamp.
 * Preserves historical URLs for 301/SEO preservation while removing them from active listings.
 * 
 * NOTE: This module is isomorphic (runs in browser, edge, and Node.js without 'fs' dependencies).
 */

/**
 * Normalizes date to midnight comparison
 */
export function getDaysRemaining(dateStr, refDate = new Date()) {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const todayMidnight = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());
  const targetDate = new Date(dateStr);
  if (isNaN(targetDate.getTime())) return null;
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const diffMs = targetMidnight.getTime() - todayMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Filters a jobs list into active and archived lists based on deadline and status.
 * @param {Array} jobsList 
 * @param {Date} referenceDate 
 * @returns {Object} { activeJobs, archivedJobs, totalActive, totalArchived }
 */
export function filterActiveJobs(jobsList = [], referenceDate = new Date()) {
  const activeJobs = [];
  const archivedJobs = [];

  for (const job of jobsList) {
    if (job.status === 'archived' || job.status === 'closed' || job.status === 'expired') {
      archivedJobs.push(job);
      continue;
    }

    const daysLeft = getDaysRemaining(job.lastDate, referenceDate);
    
    // If deadline has passed (< 0 days), move to archived
    if (daysLeft !== null && daysLeft < 0) {
      archivedJobs.push({
        ...job,
        status: 'archived',
        archived_at: job.archived_at || new Date().toISOString()
      });
    } else {
      activeJobs.push(job);
    }
  }

  return {
    activeJobs,
    archivedJobs,
    totalActive: activeJobs.length,
    totalArchived: archivedJobs.length
  };
}

/**
 * Performs an in-place audit of an array of jobs, marking expired jobs as archived.
 * @param {Array} jobs 
 * @param {Date} referenceDate 
 * @returns {Object} { updatedJobs, newlyArchivedCount }
 */
export function processJobsExpiry(jobs = [], referenceDate = new Date()) {
  let newlyArchivedCount = 0;
  const nowIso = new Date().toISOString();

  const updatedJobs = jobs.map(job => {
    if (job.status === 'archived' || job.status === 'closed') {
      if (!job.archived_at) {
        return { ...job, status: 'archived', archived_at: nowIso };
      }
      return job;
    }

    const daysLeft = getDaysRemaining(job.lastDate, referenceDate);
    if (daysLeft !== null && daysLeft < 0) {
      newlyArchivedCount++;
      return {
        ...job,
        status: 'archived',
        archived_at: job.archived_at || nowIso
      };
    }

    return job;
  });

  return {
    updatedJobs,
    newlyArchivedCount
  };
}
