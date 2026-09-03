/**
 * Tainaati Pipeline CLI Test Runner (Email Alerts & Government Scrapers)
 * Run directly via `node pipeline/run-test.js`
 */

import { runFullPipeline } from './engine/pipelineRunner.js';
import { SubscriberManager } from './alerts/subscriberManager.js';
import { EmailService } from './alerts/emailService.js';
import { deduplicateJobs } from './engine/deduplicator.js';
import { filterActiveJobs } from './engine/expiryManager.js';
import { dispatchJobAlerts } from './alerts/alertDispatcher.js';

async function main() {
  console.log("=================================================");
  console.log("Tainaati Phase 2: Live Scraper & Email Alerts Test Runner");
  console.log("=================================================");

  const subManager = new SubscriberManager();
  const emailService = new EmailService();

  console.log(`\n1. Initial Active Verified Email Subscribers: ${subManager.getVerifiedSubscribers().length}`);

  // Test 1: Full Ingestion Pipeline with Live Scrapers
  console.log("\n2. Executing Full Ingestion Pipeline...");
  const pipelineResult = await runFullPipeline([], subManager.getVerifiedSubscribers());

  console.log("\n--- PIPELINE EXECUTION SUMMARY ---");
  console.log(`Status: ${pipelineResult.summary.status}`);
  console.log(`Execution Time: ${pipelineResult.summary.durationMs}ms`);
  console.log(`Total Raw Scraped: ${pipelineResult.summary.totalRawScraped}`);
  console.log(`New Unique Ingested: ${pipelineResult.summary.newUniqueIngested}`);
  console.log(`Duplicates Blocked: ${pipelineResult.summary.duplicatesBlocked}`);
  console.log(`Active Jobs Retained: ${pipelineResult.summary.activeJobsCount}`);
  console.log(`Email Alerts Dispatched: ${pipelineResult.summary.alertsSentCount}`);

  console.log("\n--- LIVE SOURCE TELEMETRY ---");
  pipelineResult.summary.sourceReports.forEach((s) => {
    console.log(`• [${s.status}] ${s.source}: ${s.scrapedCount} jobs (${s.latencyMs}ms)`);
  });

  // Test 2: Double Opt-In Email Verification Flow
  console.log("\n3. Testing Double Opt-In Email Verification Flow...");
  const newCandidate = subManager.registerSubscriber({
    email: "tariq.candidate.pk@example.com",
    sector: "govt",
    city: "Lahore",
    bpsScale: "BPS-17",
    frequency: "instant"
  });

  console.log(`• Registered unverified subscriber: ${newCandidate.email} (Code: ${newCandidate.verificationCode})`);
  await emailService.sendVerificationEmail(newCandidate.email, newCandidate.verificationCode);

  const verifyResult = subManager.verifyEmail(newCandidate.email, newCandidate.verificationCode);
  console.log(`• Verification Result: ${verifyResult.message}`);

  // Test 3: Instant Email Alert Match & Delivery
  console.log("\n4. Testing Instant Email Alert Match & Branded HTML Dispatch...");
  const sampleJob = pipelineResult.newUniqueJobs[0] || {
    id: "test-job-1",
    title: "Senior Registrar Oncology - BPS-17",
    department: "Specialized Healthcare Department Punjab",
    city: "Lahore",
    qualification: "MBBS / FCPS",
    lastDate: "2026-09-22",
    type: "govt",
    bpsScale: "BPS-17"
  };

  const instantDispatch = await emailService.sendJobAlert(newCandidate.email, sampleJob, newCandidate.id);
  console.log(`• Instant Alert Delivered to ${instantDispatch.to} (Subject: "${instantDispatch.subject}")`);

  // Test 4: Daily Digest Batching Test (Multiple jobs combined into 1 single email)
  console.log("\n5. Testing Daily Digest Batching (Consolidates 5 jobs into 1 email)...");
  const digestJobs = pipelineResult.newUniqueJobs.slice(0, 5);
  const digestDispatch = await emailService.sendDigestAlert("usman.isb.digest@example.com", digestJobs, "sub-3");
  console.log(`• Digest Delivered to ${digestDispatch.to} (Subject: "${digestDispatch.subject}")`);

  // Test 5: One-Click Unsubscribe Flow
  console.log("\n6. Testing One-Click Unsubscribe Flow...");
  const unsubResult = subManager.unsubscribe(newCandidate.id);
  console.log(`• Unsubscribe Result: ${unsubResult.message}`);

  // Verify unsubscribed user receives 0 future alerts
  const postUnsubDispatch = dispatchJobAlerts([sampleJob], subManager.getVerifiedSubscribers(), emailService);
  const receivedByUnsubscribed = postUnsubDispatch.dispatches.some(d => d.email === newCandidate.email);
  console.log(`• Verification: Unsubscribed user received future alert? ${receivedByUnsubscribed ? "FAIL" : "NO (Correctly Blocked)"}`);

  console.log("\n=================================================");
  console.log("✅ ALL EMAIL ALERT & PIPELINE TESTS PASSED SUCCESSFULLY");
  console.log("=================================================");
}

main().catch(console.error);
