/**
 * Tainaati — Job Expiry & Lifecycle Manager
 * Automatically hides/archives listings whose application deadline has passed.
 */

export function filterActiveJobs(jobsList, referenceDate = new Date()) {
  const activeJobs = [];
  const expiredJobs = [];
  const refTime = new Date(referenceDate).setHours(23, 59, 59, 999);

  for (const job of jobsList) {
    if (!job.lastDate) {
      activeJobs.push(job);
      continue;
    }

    const jobDeadline = new Date(job.lastDate).setHours(23, 59, 59, 999);
    
    if (jobDeadline >= refTime) {
      activeJobs.push({
        ...job,
        status: 'active'
      });
    } else {
      expiredJobs.push({
        ...job,
        status: 'expired',
        archivedAt: new Date().toISOString()
      });
    }
  }

  return {
    activeJobs,
    expiredJobs,
    totalActive: activeJobs.length,
    totalExpired: expiredJobs.length
  };
}
