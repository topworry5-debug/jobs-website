/**
 * Tainaati — Intelligent Job Deduplication Engine
 * Identifies duplicate job postings across multiple sources (e.g. FPSC gazette vs Ministry website)
 * using string normalization, department fuzzy matching, and closing date alignment.
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
 * Deduplicates an incoming job list against an existing database
 * @param {Array} incomingJobs - Newly scraped jobs
 * @param {Array} existingJobs - Current database of jobs
 * @returns {Object} { uniqueJobs: Array, duplicateCount: number, duplicates: Array }
 */
export function deduplicateJobs(incomingJobs, existingJobs = []) {
  const uniqueJobs = [];
  const duplicates = [];
  const allKnownJobs = [...existingJobs];

  for (const newJob of incomingJobs) {
    let isDuplicate = false;
    let matchedExisting = null;

    for (const existing of allKnownJobs) {
      // 1. Direct ID match
      if (newJob.id && existing.id === newJob.id) {
        isDuplicate = true;
        matchedExisting = existing;
        break;
      }

      // 2. Exact Title + Department + LastDate match
      const titleSim = calculateSimilarity(newJob.title, existing.title);
      const deptSim = calculateSimilarity(
        newJob.department || newJob.company, 
        existing.department || existing.company
      );
      const sameLastDate = newJob.lastDate === existing.lastDate;

      // Duplicate condition: High title similarity (>0.75) and same department (>0.7) and matching last date
      if (titleSim >= 0.75 && deptSim >= 0.65 && sameLastDate) {
        isDuplicate = true;
        matchedExisting = existing;
        break;
      }
    }

    if (isDuplicate) {
      duplicates.push({
        incoming: newJob,
        matchedWith: matchedExisting,
        reason: `Matched with "${matchedExisting.title}" in ${matchedExisting.department} (Deadline: ${matchedExisting.lastDate})`
      });
    } else {
      uniqueJobs.push({
        ...newJob,
        lastVerifiedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        deduplicated: true
      });
      allKnownJobs.push(newJob);
    }
  }

  return {
    uniqueJobs,
    duplicateCount: duplicates.length,
    duplicates
  };
}
