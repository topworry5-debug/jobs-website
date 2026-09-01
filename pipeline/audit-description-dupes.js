import fs from 'fs';

// Load live scraped jobs
const jobs = JSON.parse(fs.readFileSync('src/data/liveScrapedJobs.json', 'utf8'));

console.log('=== AUDITING CURRENT DATASET FOR DUPLICATE / PLACEHOLDER STRINGS ===');
console.log(`Total jobs in store: ${jobs.length}`);

const descCounts = {};
const qualCounts = {};
const flaggedPlaceholders = [];

jobs.forEach((j, index) => {
  // Check descriptions
  const d = j.description || '';
  descCounts[d] = (descCounts[d] || 0) + 1;

  // Check qualifications
  const q = j.qualification || '';
  qualCounts[q] = (qualCounts[q] || 0) + 1;

  if (q.includes('As per PPSC Service Rules') || d.includes('Deposit fee of PKR') || j.ageLimit === 'As per PPSC Service Rules') {
    flaggedPlaceholders.push({
      index: index + 1,
      id: j.id,
      title: j.title,
      department: j.department,
      caseNo: j.caseNo,
      qualification: j.qualification,
      ageLimit: j.ageLimit
    });
  }
});

console.log(`\nFound ${flaggedPlaceholders.length} flagged jobs with templated/placeholder strings:`);
flaggedPlaceholders.slice(0, 10).forEach(f => {
  console.log(`  [#${f.index}] ${f.title} (Case: ${f.caseNo}) | Dept: ${f.department}`);
});

console.log('\nTop Duplicate Qualifications:');
Object.entries(qualCounts).filter(([_, c]) => c > 1).forEach(([k, c]) => {
  console.log(`  "${k.substring(0, 60)}..." -> ${c} occurrences`);
});
