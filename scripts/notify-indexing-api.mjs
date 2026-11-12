#!/usr/bin/env node

/**
 * CLI runner for Google Indexing API
 * Usage:
 *   node scripts/notify-indexing-api.mjs <url> [URL_UPDATED|URL_DELETED]
 * Example:
 *   node scripts/notify-indexing-api.mjs https://www.tainaati.com/jobs/fpsc-live-api-101 URL_UPDATED
 */

import { publishUrlNotification } from '../src/lib/indexingApi.js';

const targetUrl = process.argv[2];
const actionType = process.argv[3] || 'URL_UPDATED';

if (!targetUrl) {
  console.error('Usage: node scripts/notify-indexing-api.mjs <url> [URL_UPDATED|URL_DELETED]');
  process.exit(1);
}

console.log(`[CLI] Submitting ${actionType} for: ${targetUrl}`);

try {
  const result = await publishUrlNotification(targetUrl, actionType);
  console.log('\n--- RESULT ---');
  console.log(JSON.stringify(result, null, 2));
  
  if (result.success) {
    console.log('\n✅ Successfully published notification to Google Indexing API.');
    process.exit(0);
  } else {
    console.error(`\n❌ Failed with status ${result.status}: ${result.error}`);
    process.exit(1);
  }
} catch (error) {
  console.error('\n❌ Execution Exception:', error.message);
  process.exit(1);
}
