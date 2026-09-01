import { runAudit } from './run-lighthouse-audit.mjs';
import fs from 'fs';

async function main() {
  console.log('=== RUNNING POST-OPTIMIZATION LIGHTHOUSE AUDIT ===\n');

  let baseline = {};
  if (fs.existsSync('lighthouse-baseline.json')) {
    baseline = JSON.parse(fs.readFileSync('lighthouse-baseline.json', 'utf8'));
  }

  console.log('Running Post-Optimization Mobile Audit (4G Throttled)...');
  const mobileAfter = await runAudit('http://localhost:3000', 'mobile');

  console.log('\nRunning Post-Optimization Desktop Audit...');
  const desktopAfter = await runAudit('http://localhost:3000', 'desktop');

  console.log('\n========================================================================');
  console.log('                    LIGHTHOUSE PERFORMANCE COMPARISON                   ');
  console.log('========================================================================');

  console.log('\n📱 MOBILE (Simulated 4G Throttling):');
  console.log('------------------------------------------------------------------------');
  console.log(`Performance:    Before: ${baseline.mobile?.scores?.performance ?? 'N/A'}  ->  After: ${mobileAfter.scores.performance} / 100`);
  console.log(`Accessibility:  Before: ${baseline.mobile?.scores?.accessibility ?? 'N/A'}  ->  After: ${mobileAfter.scores.accessibility} / 100`);
  console.log(`Best Practices: Before: ${baseline.mobile?.scores?.bestPractices ?? 'N/A'}  ->  After: ${mobileAfter.scores.bestPractices} / 100`);
  console.log(`SEO:            Before: ${baseline.mobile?.scores?.seo ?? 'N/A'}  ->  After: ${mobileAfter.scores.seo} / 100`);
  console.log('------------------------------------------------------------------------');
  console.log(`FCP:            Before: ${baseline.mobile?.metrics?.fcp ?? 'N/A'}  ->  After: ${mobileAfter.metrics.fcp}`);
  console.log(`LCP:            Before: ${baseline.mobile?.metrics?.lcp ?? 'N/A'}  ->  After: ${mobileAfter.metrics.lcp}`);
  console.log(`CLS:            Before: ${baseline.mobile?.metrics?.cls ?? 'N/A'}  ->  After: ${mobileAfter.metrics.cls}`);
  console.log(`TTI:            Before: ${baseline.mobile?.metrics?.tti ?? 'N/A'}  ->  After: ${mobileAfter.metrics.tti} (Target: < 3.0s)`);
  console.log(`TBT:            Before: ${baseline.mobile?.metrics?.tbt ?? 'N/A'}  ->  After: ${mobileAfter.metrics.tbt}`);
  console.log(`Speed Index:    Before: ${baseline.mobile?.metrics?.speedIndex ?? 'N/A'}  ->  After: ${mobileAfter.metrics.speedIndex}`);

  console.log('\n💻 DESKTOP:');
  console.log('------------------------------------------------------------------------');
  console.log(`Performance:    Before: ${baseline.desktop?.scores?.performance ?? 'N/A'}  ->  After: ${desktopAfter.scores.performance} / 100`);
  console.log(`Accessibility:  Before: ${baseline.desktop?.scores?.accessibility ?? 'N/A'}  ->  After: ${desktopAfter.scores.accessibility} / 100`);
  console.log(`Best Practices: Before: ${baseline.desktop?.scores?.bestPractices ?? 'N/A'}  ->  After: ${desktopAfter.scores.bestPractices} / 100`);
  console.log(`SEO:            Before: ${baseline.desktop?.scores?.seo ?? 'N/A'}  ->  After: ${desktopAfter.scores.seo} / 100`);
  console.log('------------------------------------------------------------------------');
  console.log(`FCP:            Before: ${baseline.desktop?.metrics?.fcp ?? 'N/A'}  ->  After: ${desktopAfter.metrics.fcp}`);
  console.log(`LCP:            Before: ${baseline.desktop?.metrics?.lcp ?? 'N/A'}  ->  After: ${desktopAfter.metrics.lcp}`);
  console.log(`CLS:            Before: ${baseline.desktop?.metrics?.cls ?? 'N/A'}  ->  After: ${desktopAfter.metrics.cls}`);
  console.log(`TTI:            Before: ${baseline.desktop?.metrics?.tti ?? 'N/A'}  ->  After: ${desktopAfter.metrics.tti}`);
  console.log(`TBT:            Before: ${baseline.desktop?.metrics?.tbt ?? 'N/A'}  ->  After: ${desktopAfter.metrics.tbt}`);
  console.log(`Speed Index:    Before: ${baseline.desktop?.metrics?.speedIndex ?? 'N/A'}  ->  After: ${desktopAfter.metrics.speedIndex}`);

  fs.writeFileSync('lighthouse-after.json', JSON.stringify({ mobile: mobileAfter, desktop: desktopAfter }, null, 2));
}

main().catch(console.error);
