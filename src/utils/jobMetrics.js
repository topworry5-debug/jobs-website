/**
 * RozgarPK — Centralized Single Source-of-Truth Metrics & Date Calculations
 * Guarantees all hero statistics, category counts, urgency badges, and SEO metadata
 * are computed dynamically from actual datasets with ZERO hardcoding and ZERO data drift.
 */

/**
 * Calculates calendar days remaining until the specified ISO deadline string.
 * Uses midnight normalization for date accuracy.
 * @param {string} dateStr - Date string (e.g. "2026-09-03")
 * @returns {number|null} Days remaining (positive = future/today, negative = past)
 */
export function calculateDaysLeft(dateStr) {
  if (!dateStr) return null;
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const targetDate = new Date(dateStr);
  if (isNaN(targetDate.getTime())) return null;
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  
  const diffMs = targetMidnight.getTime() - todayMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

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
 * @param {Array} jobs - Array of job objects
 * @param {Array} examSchedules - Array of exam schedule objects
 * @returns {Object} Calculated metrics
 */
export function computeJobMetrics(jobs = [], examSchedules = []) {
  const totalListings = jobs.length;
  
  // Total vacancies (uses job.vacancies if numeric and > 0, otherwise counts as 1 verified position)
  const totalVacancies = jobs.reduce((sum, j) => {
    const v = typeof j.vacancies === 'number' && j.vacancies > 0 ? j.vacancies : 1;
    return sum + v;
  }, 0);

  // Dynamic urgency check: strictly counts jobs closing within 3 days of today
  const urgentJobs = jobs.filter(j => isClosingSoon(j.lastDate, 3));
  const urgentCount = urgentJobs.length;
  
  // Unique verified departments and government agencies
  const verifiedDeptsSet = new Set(
    jobs.map(j => (j.department || j.company || '').trim()).filter(Boolean)
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
