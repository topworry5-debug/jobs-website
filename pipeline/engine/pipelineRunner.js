/**
 * Tainaati — Master Automation Pipeline Runner
 * Runs all official government scrapers (FPSC, PPSC, NTS, SPSC, KPPSC, BPSC),
 * handles deduplication, applies auto-expiry, generates pipeline health telemetry.
 */

// Allow connection to Pakistani government portals with incomplete intermediate CAs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { scrapeFPSC } from '../scrapers/fpscScraper.js';
import { scrapePPSC } from '../scrapers/ppscScraper.js';
import { scrapeNTS } from '../scrapers/ntsScraper.js';
import { scrapeSPSC } from '../scrapers/spscScraper.js';
import { scrapeKPPSC } from '../scrapers/spscScraper.js';
import { scrapeBPSC } from '../scrapers/bpscScraper.js';
import { deduplicateJobs } from './deduplicator.js';
import { filterActiveJobs } from './expiryManager.js';
import { validateAndFilterPipelineJobs } from './validator.js';
import { cleanScrapedJob } from '../utils/textCleaner.js';

export async function runFullPipeline(existingJobs = []) {
  const startTime = Date.now();
  const runTimestamp = new Date().toISOString();
  const sourceReports = [];

  console.log(`[Tainaati Pipeline] Starting official government ingestion cycle at ${runTimestamp}...`);

  // Run all 6 commission scrapers independently
  const [fpscResult, ppscResult, ntsResult, spscResult, kppscResult, bpscResult] = await Promise.allSettled([
    scrapeFPSC(),
    scrapePPSC(),
    scrapeNTS(),
    scrapeSPSC(),
    scrapeKPPSC(),
    scrapeBPSC()
  ]);

  const rawScrapedJobs = [];

  const handleResult = (res, defaultSource, defaultUrl) => {
    if (res.status === 'fulfilled' && res.value && res.value.success) {
      sourceReports.push({
        source: res.value.source || defaultSource,
        status: 'SUCCESS',
        scrapedCount: res.value.count || 0,
        url: res.value.sourceUrl || defaultUrl,
        jobs: res.value.jobs || [],
        error: null
      });
      if (Array.isArray(res.value.jobs)) {
        rawScrapedJobs.push(...res.value.jobs);
      }
    } else {
      const err = res.reason?.message || res.value?.error || 'Source temporarily unreachable';
      console.warn(`[Tainaati Pipeline] Source error on ${defaultSource}: ${err}`);
      sourceReports.push({
        source: res.value?.source || defaultSource,
        status: 'ERROR',
        scrapedCount: 0,
        url: res.value?.sourceUrl || defaultUrl,
        jobs: [],
        error: err
      });
    }
  };

  handleResult(fpscResult, "Federal Public Service Commission (FPSC)", "https://www.fpsc.gov.pk");
  handleResult(ppscResult, "Punjab Public Service Commission (PPSC)", "https://www.ppsc.gop.pk/Jobs.aspx");
  handleResult(ntsResult, "National Testing Service (NTS)", "https://www.nts.org.pk/new/projectsnew.php");
  handleResult(spscResult, "Sindh Public Service Commission (SPSC)", "https://spsc.gov.pk/advertisements");
  handleResult(kppscResult, "Khyber Pakhtunkhwa Public Service Commission (KPPSC)", "https://www.kppsc.gov.pk/advertisement");
  handleResult(bpscResult, "Balochistan Public Service Commission (BPSC)", "https://bpsc.gob.pk/BPSC/pages?jobs");

  // 0. Decode HTML Entities & Clean Text on all scraped records
  const cleanedScrapedJobs = rawScrapedJobs.map(cleanScrapedJob);

  // 1. Strict Validation & Anti-Fabrication Filter
  const validationResult = validateAndFilterPipelineJobs(cleanedScrapedJobs);
  if (validationResult.rejectedCount > 0) {
    console.warn(`[Tainaati Pipeline] Flagged & Blocked ${validationResult.rejectedCount} unverified/malformed jobs.`);
  }

  // 2. Deduplication & Merging with Existing Records
  const deduplicationResult = deduplicateJobs(validationResult.validJobs, existingJobs);

  // 3. Auto-Expiry Check
  const expiryResult = filterActiveJobs(deduplicationResult.mergedJobs);

  const durationMs = Date.now() - startTime;

  const pipelineSummary = {
    pipelineId: `pipe-${Date.now()}`,
    timestamp: runTimestamp,
    durationMs,
    totalRawScraped: rawScrapedJobs.length,
    validScraped: validationResult.validCount,
    rejectedScraped: validationResult.rejectedCount,
    newUniqueIngested: deduplicationResult.newJobs.length,
    duplicatesBlockedOrMerged: deduplicationResult.duplicateCount,
    activeJobsCount: expiryResult.totalActive,
    expiredJobsArchived: expiryResult.totalArchived,
    sourceReports,
    status: sourceReports.some(s => s.status === 'SUCCESS') ? 'HEALTHY' : 'ALL_FAILED'
  };

  console.log(`[Tainaati Pipeline] Ingestion completed in ${durationMs}ms. Valid Scraped: ${validationResult.validCount}, Total Active: ${expiryResult.totalActive}, Total Archived: ${expiryResult.totalArchived}.`);

  return {
    summary: pipelineSummary,
    updatedActiveJobs: expiryResult.activeJobs,
    archivedJobs: expiryResult.archivedJobs,
    newUniqueJobs: deduplicationResult.newJobs,
    allJobs: [...expiryResult.activeJobs, ...expiryResult.archivedJobs]
  };
}
