/**
 * Tainaati — Intelligent Job Deduplication Engine
 * Identifies duplicate job postings across multiple sources
 * using stable ID matching, string normalization, and closing date alignment.
 * Never drops existing archived jobs; safely merges and updates live records.
 */

export function normalizeString(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateSimilarity(str1, str2) {
  const s1 = normalizeString(str1);
  const s2 = normalizeString(str2);
  
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const words1 = new Set(s1.split(" "));
  const words2 = new Set(s2.split(" "));
  
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Deduplicates and merges incoming validated jobs against existing records.
 * @param {Array} incomingJobs - Newly scraped & validated jobs
 * @param {Array} existingJobs - Current repository jobs
 * @returns {Object} { mergedJobs, newJobs, updatedJobs, duplicateCount, duplicates }
 */
export function deduplicateJobs(incomingJobs = [], existingJobs = []) {
  const newJobs = [];
  const duplicates = [];
  const mergedMap = new Map();

  // Seed with all existing jobs (preserving historical and archived jobs)
  for (const job of existingJobs) {
    if (job && job.id) {
      mergedMap.set(job.id, { ...job });
    }
  }

  const existingArray = Array.from(mergedMap.values());

  for (const newJob of incomingJobs) {
    let matchedExistingId = null;

    // 1. Direct stable ID match
    if (mergedMap.has(newJob.id)) {
      matchedExistingId = newJob.id;
    } else {
      // 2. Fuzzy match on title + agency + lastDate
      for (const existing of existingArray) {
        const sameAgency = (newJob.agency || '').toUpperCase() === (existing.agency || '').toUpperCase();
        const sameLastDate = newJob.lastDate === existing.lastDate;
        const titleSim = calculateSimilarity(newJob.title, existing.title);

        if (sameAgency && sameLastDate && titleSim >= 0.70) {
          matchedExistingId = existing.id;
          break;
        }
      }
    }

    if (matchedExistingId) {
      // Update existing record with latest scrape/verification metadata
      const current = mergedMap.get(matchedExistingId);
      mergedMap.set(matchedExistingId, {
        ...current,
        ...newJob,
        id: matchedExistingId, // keep original ID stable
        scrapedAt: newJob.scrapedAt || new Date().toISOString(),
        verifiedAt: newJob.verifiedAt || current.verifiedAt || new Date().toISOString(),
        lastVerifiedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        status: newJob.status || current.status
      });

      duplicates.push({
        incomingTitle: newJob.title,
        matchedId: matchedExistingId,
        reason: `Matched existing record "${current.title}" (${current.agency})`
      });
    } else {
      // Brand new job
      newJobs.push(newJob);
      mergedMap.set(newJob.id, newJob);
    }
  }

  const mergedJobs = Array.from(mergedMap.values());

  return {
    mergedJobs,
    newJobs,
    duplicateCount: duplicates.length,
    duplicates,
    uniqueJobs: newJobs
  };
}
