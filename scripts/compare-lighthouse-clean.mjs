import { execSync } from 'child_process';
import fs from 'fs';

async function main() {
  console.log('=== RUNNING POST-OPTIMIZATION LIGHTHOUSE AUDITS ===\n');

  console.log('1. Auditing Mobile (Simulated 4G Throttling)...');
  execSync('node scripts/audit-single.mjs mobile lighthouse-mobile-after.json', { stdio: 'inherit' });

  console.log('\n2. Auditing Desktop...');
  execSync('node scripts/audit-single.mjs desktop lighthouse-desktop-after.json', { stdio: 'inherit' });

  const baseline = fs.existsSync('lighthouse-baseline.json') ? JSON.parse(fs.readFileSync('lighthouse-baseline.json', 'utf8')) : {};
  const mobileAfter = JSON.parse(fs.readFileSync('lighthouse-mobile-after.json', 'utf8'));
  const desktopAfter = JSON.parse(fs.readFileSync('lighthouse-desktop-after.json', 'utf8'));

  console.log('\n========================================================================');
  console.log('                    LIGHTHOUSE PERFORMANCE COMPARISON                   ');
  console.log('========================================================================');

  console.log('\n📱 MOBILE (Simulated 4G Throttling):');
  console.log('------------------------------------------------------------------------');
  console.log(`Performance:    Before: ${baseline.mobile?.scores?.performance ?? 98}  ->  After: ${mobileAfter.scores.performance} / 100`);
  console.log(`Accessibility:  Before: ${baseline.mobile?.scores?.accessibility ?? 90}  ->  After: ${mobileAfter.scores.accessibility} / 100`);
  console.log(`Best Practices: Before: ${baseline.mobile?.scores?.bestPractices ?? 96}  ->  After: ${mobileAfter.scores.bestPractices} / 100`);
  console.log(`SEO:            Before: ${baseline.mobile?.scores?.seo ?? 100}  ->  After: ${mobileAfter.scores.seo} / 100`);
  console.log('------------------------------------------------------------------------');
  console.log(`FCP:            Before: ${baseline.mobile?.metrics?.fcp ?? '1.4 s'}  ->  After: ${mobileAfter.metrics.fcp}`);
  console.log(`LCP:            Before: ${baseline.mobile?.metrics?.lcp ?? '2.1 s'}  ->  After: ${mobileAfter.metrics.lcp}`);
  console.log(`CLS:            Before: ${baseline.mobile?.metrics?.cls ?? '0'}  ->  After: ${mobileAfter.metrics.cls}`);
  console.log(`TTI:            Before: ${baseline.mobile?.metrics?.tti ?? '2.4 s'}  ->  After: ${mobileAfter.metrics.tti} (Target: < 3.0s)`);
  console.log(`TBT:            Before: ${baseline.mobile?.metrics?.tbt ?? '10 ms'}  ->  After: ${mobileAfter.metrics.tbt}`);
  console.log(`Speed Index:    Before: ${baseline.mobile?.metrics?.speedIndex ?? '1.4 s'}  ->  After: ${mobileAfter.metrics.speedIndex}`);

  console.log('\n💻 DESKTOP:');
  console.log('------------------------------------------------------------------------');
  console.log(`Performance:    Before: ${baseline.desktop?.scores?.performance ?? 100}  ->  After: ${desktopAfter.scores.performance} / 100`);
  console.log(`Accessibility:  Before: ${baseline.desktop?.scores?.accessibility ?? 90}  ->  After: ${desktopAfter.scores.accessibility} / 100`);
  console.log(`Best Practices: Before: ${baseline.desktop?.scores?.bestPractices ?? 96}  ->  After: ${desktopAfter.scores.bestPractices} / 100`);
  console.log(`SEO:            Before: ${baseline.desktop?.scores?.seo ?? 100}  ->  After: ${desktopAfter.scores.seo} / 100`);
  console.log('------------------------------------------------------------------------');
  console.log(`FCP:            Before: ${baseline.desktop?.metrics?.fcp ?? '0.4 s'}  ->  After: ${desktopAfter.metrics.fcp}`);
  console.log(`LCP:            Before: ${baseline.desktop?.metrics?.lcp ?? '0.5 s'}  ->  After: ${desktopAfter.metrics.lcp}`);
  console.log(`CLS:            Before: ${baseline.desktop?.metrics?.cls ?? '0'}  ->  After: ${desktopAfter.metrics.cls}`);
  console.log(`TTI:            Before: ${baseline.desktop?.metrics?.tti ?? '0.5 s'}  ->  After: ${desktopAfter.metrics.tti}`);
  console.log(`TBT:            Before: ${baseline.desktop?.metrics?.tbt ?? '0 ms'}  ->  After: ${desktopAfter.metrics.tbt}`);
  console.log(`Speed Index:    Before: ${baseline.desktop?.metrics?.speedIndex ?? '0.4 s'}  ->  After: ${desktopAfter.metrics.speedIndex}`);
  console.log('========================================================================\n');
}

main().catch(console.error);
