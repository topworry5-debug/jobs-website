import { 
  calculateDaysLeft, 
  isJobExpired, 
  isJobClosedOrClosingToday, 
  isJobActive, 
  filterActiveJobs, 
  filterTrendingOpportunities, 
  getJobDeadlineInfo 
} from './jobStatus.js';

export { 
  calculateDaysLeft, 
  isJobExpired, 
  isJobClosedOrClosingToday, 
  isJobActive, 
  filterActiveJobs, 
  filterTrendingOpportunities, 
  getJobDeadlineInfo 
};

/**
 * Determines whether a job posting is closing within the specified threshold days.
 * @param {string} dateStr - Deadline date string
 * @param {number} thresholdDays - Days threshold (default: 3)
 * @returns {boolean} True if deadline is today or within thresholdDays
 */
export function isClosingSoon(dateStr, thresholdDays = 3) {
  const days = calculateDaysLeft(dateStr);
  return days !== null && days >= 0 && days <= thresholdDays;
}

/**
 * Computes live, dynamic dataset metrics for the entire platform.
 * Strictly operates on active, non-expired listings so closed jobs do not inflate stats.
 * @param {Array} jobs - Array of job objects
 * @param {Array} examSchedules - Array of exam schedule objects
 * @returns {Object} Calculated metrics
 */
export function computeJobMetrics(jobs = [], examSchedules = []) {
  // Filter out any past-deadline/expired jobs
  const activeJobs = filterActiveJobs(jobs);
  const totalListings = activeJobs.length;
  
  // Total vacancies (uses job.vacancies if numeric and > 0, otherwise counts as 1 verified position)
  const totalVacancies = activeJobs.reduce((sum, j) => {
    const v = typeof j.vacancies === 'number' && j.vacancies > 0 ? j.vacancies : 1;
    return sum + v;
  }, 0);

  // Dynamic urgency check: strictly counts jobs closing within 3 days of today
  const urgentJobs = activeJobs.filter(j => isClosingSoon(j.lastDate, 3));
  const urgentCount = urgentJobs.length;
  
  // Unique verified departments and government agencies
  const verifiedDeptsSet = new Set(
    activeJobs.map(j => (j.department || j.company || '').trim()).filter(Boolean)
  );
  const verifiedDeptsCount = verifiedDeptsSet.size;

  const upcomingExamsCount = Array.isArray(examSchedules) ? examSchedules.length : 0;

  const govtCount = jobs.filter(j => j.type === 'govt').length;
  const privateCount = jobs.filter(j => j.type === 'private').length;

  const agencyCounts = {
    FPSC: jobs.filter(j => j.agency === 'FPSC').length,
    PPSC: jobs.filter(j => j.agency === 'PPSC').length,
    SPSC: jobs.filter(j => j.agency === 'SPSC').length,
    KPPSC: jobs.filter(j => j.agency === 'KPPSC').length,
    NTS: jobs.filter(j => j.agency === 'NTS').length,
  };

  return {
    totalListings,
    totalVacancies,
    urgentCount,
    verifiedDeptsCount,
    upcomingExamsCount,
    govtCount,
    privateCount,
    agencyCounts
  };
}
