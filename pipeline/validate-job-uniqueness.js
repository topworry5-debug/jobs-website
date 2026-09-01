/**
 * RozgarPK — Job Uniqueness & Data Integrity Quality Assurance Validator
 * Ensures zero duplicate descriptions, zero generic placeholder strings,
 * and 100% individual qualification & vacancy verification.
 */

import fs from 'fs';
import path from 'path';

export function validateJobUniqueness(jobs) {
  const errors = [];
  const warnings = [];
  
  const descMap = new Map();
  const placeholderPatterns = [
    /As per PPSC Service Rules/i,
    /As per NTS Project Advertisement Criteria/i,
    /As per official criteria/i,
    /Deposit fee of PKR/i,
    /Check official criteria/i
  ];

  console.log(`\n======================================================`);
  console.log(`[RozgarPK QA Validator] Auditing ${jobs.length} Verified Job Entries...`);
  console.log(`======================================================`);

  jobs.forEach((job, index) => {
    const jobRef = `[#${index + 1}] "${job.title}" (${job.agency || 'Unknown'} - Case: ${job.caseNo || job.id})`;

    // 1. Check for Duplicate Descriptions
    const desc = (job.description || '').trim();
    if (!desc) {
      errors.push(`${jobRef}: Missing job description.`);
    } else {
      if (descMap.has(desc)) {
        errors.push(`${jobRef}: Reused description identical to ${descMap.get(desc)}: "${desc.substring(0, 70)}..."`);
      } else {
        descMap.set(desc, jobRef);
      }
    }

    // 2. Check for Placeholder / Copy-Paste Strings in Qualification
    const qual = (job.qualification || '').trim();
    if (!qual) {
      errors.push(`${jobRef}: Missing qualification field.`);
    } else {
      for (const pattern of placeholderPatterns) {
        if (pattern.test(qual)) {
          errors.push(`${jobRef}: Contains generic placeholder in qualification: "${qual}"`);
        }
      }
    }

    // 3. Check for Placeholder in Age Limit
    const age = (job.ageLimit || '').trim();
    if (!age) {
      errors.push(`${jobRef}: Missing ageLimit field.`);
    } else if (age.toLowerCase().includes('as per')) {
      errors.push(`${jobRef}: Contains placeholder in ageLimit: "${age}"`);
    }

    // 4. Check Vacancies count (Must be numeric and > 0)
    if (typeof job.vacancies !== 'number' || job.vacancies <= 0) {
      warnings.push(`${jobRef}: Vacancies count is not explicitly numeric (value: ${job.vacancies}).`);
    }

    // 5. Check Deadlines
    if (!job.lastDate || !/^\d{4}-\d{2}-\d{2}$/.test(job.lastDate)) {
      errors.push(`${jobRef}: Invalid ISO lastDate format: "${job.lastDate}".`);
    }

    // 6. Check Official URLs
    if (!job.officialUrl || !job.officialUrl.startsWith('http')) {
      errors.push(`${jobRef}: Missing or invalid officialUrl.`);
    }
  });

  console.log(`• Total Unique Descriptions Verified: ${descMap.size} / ${jobs.length}`);
  console.log(`• Placeholder Violations: ${errors.filter(e => e.includes('placeholder')).length}`);
  console.log(`• Duplicate Description Violations: ${errors.filter(e => e.includes('identical')).length}`);

  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach(w => console.log(`   - ${w}`));
  }

  if (errors.length > 0) {
    console.log(`\n❌  AUDIT FAILED WITH ${errors.length} ERRORS:`);
    errors.forEach(e => console.log(`   - ${e}`));
    return { passed: false, errors, warnings };
  }

  console.log(`\n✅  ALL JOBS PASSED 100% QUALITY & UNIQUENESS AUDIT (0 generic placeholders, 0 duplicate descriptions).`);
  return { passed: true, errors: [], warnings };
}

// Standalone execution
if (process.argv[1] && process.argv[1].includes('validate-job-uniqueness.js')) {
  const filePath = path.resolve('src/data/liveScrapedJobs.json');
  if (fs.existsSync(filePath)) {
    const jobs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const result = validateJobUniqueness(jobs);
    if (!result.passed) {
      process.exit(1);
    }
  } else {
    console.error(`Target file not found: ${filePath}`);
    process.exit(1);
  }
}
