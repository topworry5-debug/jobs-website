import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

export async function runAudit(url = 'http://localhost:3000', formFactor = 'mobile') {
  const chrome = await chromeLauncher.launch({
    chromePath: CHROME_PATH,
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  });

  const flags = {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    formFactor: formFactor,
    screenEmulation: formFactor === 'mobile' ? {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      disabled: false,
    } : {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttlingMethod: 'simulate',
    throttling: formFactor === 'mobile' ? {
      rttMs: 150,
      throughputKbps: 1.6 * 1024,
      requestLatencyMs: 150 * 3.75,
      downloadThroughputKbps: 1.6 * 1024 * 0.9,
      uploadThroughputKbps: 750,
      cpuSlowdownMultiplier: 4,
    } : {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    }
  };

  const runnerResult = await lighthouse(url, flags);
  try {
    await chrome.kill();
  } catch (e) {
    // Ignore Windows temp dir file lock on exit
  }

  const report = runnerResult.lhr;
  const categories = report.categories;
  const audits = report.audits;

  return {
    formFactor,
    scores: {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100),
    },
    metrics: {
      fcp: audits['first-contentful-paint']?.displayValue,
      lcp: audits['largest-contentful-paint']?.displayValue,
      cls: audits['cumulative-layout-shift']?.displayValue,
      tti: audits['interactive']?.displayValue,
      tbt: audits['total-blocking-time']?.displayValue,
      speedIndex: audits['speed-index']?.displayValue,
    }
  };
}

async function main() {
  console.log('=== RUNNING INITIAL BASELINE LIGHTHOUSE AUDIT ===\n');

  console.log('Running Mobile Audit (4G Throttled)...');
  const mobileResult = await runAudit('http://localhost:3000', 'mobile');
  console.log('Mobile Results:', JSON.stringify(mobileResult, null, 2));

  console.log('\nRunning Desktop Audit...');
  const desktopResult = await runAudit('http://localhost:3000', 'desktop');
  console.log('Desktop Results:', JSON.stringify(desktopResult, null, 2));

  fs.writeFileSync('lighthouse-baseline.json', JSON.stringify({ mobile: mobileResult, desktop: desktopResult }, null, 2));
  console.log('\nSaved baseline to lighthouse-baseline.json');
}

main().catch(console.error);
