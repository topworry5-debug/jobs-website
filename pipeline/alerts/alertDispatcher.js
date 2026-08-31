/**
 * RozgarPK — Email Job Alerts Dispatcher
 * Matches newly scraped jobs against verified subscriber criteria (Sector, City, Scale, Qualification)
 * and delivers branded HTML notifications or batched Daily Digests via Email Service.
 */

import { EmailService } from './emailService.js';

export function matchJobToSubscriber(job, sub) {
  // 1. Sector match
  if (sub.sector && sub.sector !== 'all') {
    if (sub.sector === 'govt' && job.type !== 'govt') return false;
    if (sub.sector === 'private' && job.type !== 'private') return false;
  }

  // 2. City match
  if (sub.city && sub.city !== 'All Cities' && sub.city !== 'All Pakistan') {
    const jobCity = (job.city || '').toLowerCase();
    const subCity = sub.city.toLowerCase();
    if (!jobCity.includes(subCity) && !jobCity.includes('all pakistan')) return false;
  }

  // 3. BPS Scale match (for Govt jobs)
  if (sub.bpsScale && sub.bpsScale !== 'All BPS Scales' && job.bpsScale) {
    if (job.bpsScale !== sub.bpsScale) return false;
  }

  // 4. Qualification match
  if (sub.qualification && sub.qualification !== 'All Qualifications' && job.qualification) {
    const jobQual = job.qualification.toLowerCase();
    const subQual = sub.qualification.toLowerCase();
    if (!jobQual.includes(subQual)) return false;
  }

  return true;
}

/**
 * Dispatches matched alerts to verified email subscribers
 */
export function dispatchJobAlerts(newJobs = [], subscribers = [], emailService = new EmailService()) {
  const dispatches = [];
  const digestMap = new Map(); // subscriberEmail -> [jobs]

  // Filter only verified subscribers
  const verifiedSubscribers = subscribers.filter(s => s.verified !== false);

  for (const job of newJobs) {
    for (const sub of verifiedSubscribers) {
      if (matchJobToSubscriber(job, sub)) {
        if (sub.frequency === 'daily_digest') {
          if (!digestMap.has(sub.email)) {
            digestMap.set(sub.email, { sub, jobs: [] });
          }
          digestMap.get(sub.email).jobs.push(job);
        } else {
          // Instant Alert
          emailService.sendJobAlert(sub.email, job, sub.id);
          dispatches.push({
            alertId: `alert-email-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            email: sub.email,
            jobTitle: job.title,
            department: job.department || job.company,
            type: 'INSTANT_EMAIL',
            status: 'SENT',
            sentAt: new Date().toISOString()
          });
        }
      }
    }
  }

  // Process Daily Digest batches (1 single email per subscriber with all matching jobs)
  for (const [email, { sub, jobs }] of digestMap.entries()) {
    if (jobs.length > 0) {
      emailService.sendDigestAlert(email, jobs, sub.id);
      dispatches.push({
        alertId: `alert-digest-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        email: sub.email,
        jobTitle: `Daily Digest (${jobs.length} jobs)`,
        department: "Multiple Agencies",
        type: 'DAILY_DIGEST_EMAIL',
        jobsCount: jobs.length,
        status: 'SENT',
        sentAt: new Date().toISOString()
      });
    }
  }

  return {
    totalDispatched: dispatches.length,
    dispatches,
    emailLog: emailService.getSentLog()
  };
}
