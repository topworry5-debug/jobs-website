import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

async function main() {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
    chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const options = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['accessibility'],
    port: chrome.port
  };

  const runnerResult = await lighthouse('http://localhost:3000', options);
  const lhr = runnerResult.lhr;

  console.log('=== ACCESSIBILITY DIAGNOSIS ===\n');
  console.log(`Overall Accessibility Score: ${Math.round(lhr.categories.accessibility.score * 100)} / 100\n`);

  for (const auditRef of lhr.categories.accessibility.auditRefs) {
    const audit = lhr.audits[auditRef.id];
    if (audit && audit.score !== null && audit.score < 1) {
      console.log(`❌ Audit: [${audit.id}] (Weight: ${auditRef.weight})`);
      console.log(`   Title: ${audit.title}`);
      console.log(`   Description: ${audit.description}`);
      if (audit.details && audit.details.items) {
        console.log(`   Failing Items (${audit.details.items.length}):`);
        audit.details.items.slice(0, 5).forEach(item => {
          console.log(`     - Selector: ${item.node?.selector || 'N/A'}`);
          console.log(`       Snippet: ${item.node?.snippet || 'N/A'}`);
          console.log(`       Explanation: ${item.node?.explanation || ''}`);
        });
      }
      console.log('');
    }
  }

  try { await chrome.kill(); } catch (e) {}
}

main().catch(console.error);
