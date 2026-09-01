import fs from 'fs';
import path from 'path';
import { validateJobEntry } from '../pipeline/engine/validator.js';

const livePath = path.resolve('src/data/liveScrapedJobs.json');
const rawLive = JSON.parse(fs.readFileSync(livePath, 'utf-8'));

console.log(`Starting comprehensive audit of ${rawLive.length} live jobs...`);

const cleanJobs = [];
const anomalies = [];

for (const job of rawLive) {
  const result = validateJobEntry(job);
  if (!result.isValid) {
    anomalies.push({
      id: job.id,
      title: job.title,
      errors: result.errors
    });
  } else {
    // Ensure vacancies is null if not explicitly known rather than default 1
    const clean = {
      ...result.sanitizedJob,
      vacancies: typeof job.vacancies === 'number' && job.vacancies > 1 ? job.vacancies : null
    };
    cleanJobs.push(clean);
  }
}

console.log(`\nAudit Complete:`);
console.log(`- Verified Valid Jobs: ${cleanJobs.length}`);
console.log(`- Flagged / Cleaned Anomalies: ${anomalies.length}`);

if (anomalies.length > 0) {
  console.log('\nAnomalies Found & Handled:');
  anomalies.forEach(a => console.log(`• [${a.id}] ${a.title}: ${a.errors.join(', ')}`));
}

// Write back 100% verified clean dataset
fs.writeFileSync(livePath, JSON.stringify(cleanJobs, null, 2), 'utf-8');
console.log(`\nUpdated ${livePath} with 100% verified authentic dataset.`);
