import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';

async function main() {
  console.log('=== RUNNING FINAL MOBILE LIGHTHOUSE AUDIT (4G SIMULATION) ===\n');

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
    chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const options = {
    logLevel: 'error',
    output: 'json',
    port: chrome.port,
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 2.5,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150 * 3.75,
      downloadThroughputKbps: 1638.4 * 0.9,
      uploadThroughputKbps: 1638.4 * 0.9,
    },
  };

  const runnerResult = await lighthouse('http://localhost:3000', options);
  const lhr = runnerResult.lhr;

  const summary = {
    formFactor: 'mobile',
    scores: {
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100)
    },
    metrics: {
      fcp: lhr.audits['first-contentful-paint']?.displayValue || 'N/A',
      lcp: lhr.audits['largest-contentful-paint']?.displayValue || 'N/A',
      cls: lhr.audits['cumulative-layout-shift']?.displayValue || '0',
      tti: lhr.audits['interactive']?.displayValue || 'N/A',
      tbt: lhr.audits['total-blocking-time']?.displayValue || '0 ms',
      speedIndex: lhr.audits['speed-index']?.displayValue || 'N/A'
    }
  };

  console.log('======================================================');
  console.log('             FINAL LIGHTHOUSE RESULTS (MOBILE)        ');
  console.log('======================================================');
  console.log(`⚡ Performance:    ${summary.scores.performance} / 100  (Target: ≥ 90)`);
  console.log(`♿ Accessibility:  ${summary.scores.accessibility} / 100  (Target: ≥ 95)`);
  console.log(`🛡️  Best Practices: ${summary.scores.bestPractices} / 100  (Target: ≥ 95)`);
  console.log(`🔍 SEO:            ${summary.scores.seo} / 100  (Target: ≥ 95)`);
  console.log('------------------------------------------------------');
  console.log(`First Contentful Paint (FCP): ${summary.metrics.fcp}`);
  console.log(`Largest Contentful Paint (LCP): ${summary.metrics.lcp}`);
  console.log(`Cumulative Layout Shift (CLS): ${summary.metrics.cls}`);
  console.log(`Time to Interactive (TTI):     ${summary.metrics.tti}`);
  console.log(`Total Blocking Time (TBT):     ${summary.metrics.tbt}`);
  console.log(`Speed Index:                   ${summary.metrics.speedIndex}`);
  console.log('======================================================\n');

  fs.writeFileSync('lighthouse-final-summary.json', JSON.stringify(summary, null, 2));

  try { await chrome.kill(); } catch (e) {}
}

main().catch(console.error);
