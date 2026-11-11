import { 
  calculateDaysLeft, 
  calculateDaysRemaining,
  isJobExpired, 
  isJobClosed,
  isJobClosedOrClosingToday, 
  isJobActive, 
  isJobOpen,
  filterActiveJobs, 
  filterOpenJobs,
  filterTrendingOpportunities, 
  filterRecentlyClosedJobs,
  partitionJobs,
  getJobDeadlineInfo,
  getJobStatus,
  isClosingSoon,
  getLastUpdatedTimestamp
} from './jobStatus.js';

export { 
  calculateDaysLeft, 
  calculateDaysRemaining,
  isJobExpired, 
  isJobClosed,
  isJobClosedOrClosingToday, 
  isJobActive, 
  isJobOpen,
  filterActiveJobs, 
  filterOpenJobs,
  filterTrendingOpportunities, 
  filterRecentlyClosedJobs,
  partitionJobs,
  getJobDeadlineInfo,
  getJobStatus,
  isClosingSoon,
  getLastUpdatedTimestamp
};

/**
 * Computes live, dynamic dataset metrics for the entire platform.
 * STRICT POLICY: Operates strictly on OPEN listings.
 * Closed or expired jobs NEVER inflate vacancy counts, category counts, or agency counters.
 * 
 * @param {Array} jobs - Array of all job objects (including archived)
 * @param {Array} examSchedules - Array of exam schedule objects
 * @returns {Object} Calculated metrics
 */
export function computeJobMetrics(jobs = [], examSchedules = []) {
  // Filter out any past-deadline/expired/archived jobs
  const openJobs = filterOpenJobs(jobs);
  const totalListings = openJobs.length;
  
  // Total vacancies in open positions
  const totalVacancies = openJobs.reduce((sum, j) => {
    const v = typeof j.vacancies === 'number' && j.vacancies > 0 ? j.vacancies : 1;
    return sum + v;
  }, 0);

  // Dynamic urgency check: strictly counts open jobs closing within 3 days of today
  const urgentJobs = openJobs.filter(j => isClosingSoon(j.lastDate, 3));
  const urgentCount = urgentJobs.length;
  
  // Unique verified departments and government agencies with open jobs
  const verifiedDeptsSet = new Set(
    openJobs.map(j => (j.department || j.company || '').trim()).filter(Boolean)
  );
  const verifiedDeptsCount = verifiedDeptsSet.size;

  const upcomingExamsCount = Array.isArray(examSchedules) ? examSchedules.length : 0;

  // STRICTLY COUNT OPEN JOBS ONLY (Never raw array lengths!)
  const govtCount = openJobs.filter(j => j.type === 'govt').length;
  const privateCount = openJobs.filter(j => j.type === 'private').length;

  const agencyCounts = {
    FPSC: openJobs.filter(j => (j.agency || '').toUpperCase() === 'FPSC').length,
    PPSC: openJobs.filter(j => (j.agency || '').toUpperCase() === 'PPSC').length,
    SPSC: openJobs.filter(j => (j.agency || '').toUpperCase() === 'SPSC').length,
    KPPSC: openJobs.filter(j => (j.agency || '').toUpperCase() === 'KPPSC').length,
    BPSC: openJobs.filter(j => (j.agency || '').toUpperCase() === 'BPSC').length,
    NTS: openJobs.filter(j => (j.agency || '').toUpperCase() === 'NTS').length,
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
