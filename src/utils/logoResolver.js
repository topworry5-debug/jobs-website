/**
 * Tainaati — Official Department & Company Logo Resolver
 * Maps job listings to authentic, human-curated official emblems and company logos.
 * Zero AI stock imagery — 100% verified vector emblems and brandmarks.
 */

export function getJobLogoUrl(job = {}) {
  const agency = (job.agency || '').toUpperCase();
  const dept = (job.department || '').toLowerCase();
  const company = (job.company || '').toLowerCase();
  const title = (job.title || '').toLowerCase();
  const type = (job.type || 'govt').toLowerCase();

  // 1. Specific High-Profile Departments / Sub-Agencies
  if (dept.includes('fia') || dept.includes('federal investigation') || title.includes('fia')) {
    return '/logos/fia.svg';
  }
  if (dept.includes('wapda') || dept.includes('water and power') || title.includes('wapda')) {
    return '/logos/wapda.svg';
  }
  if (dept.includes('state bank') || dept.includes('sbp') || company.includes('state bank')) {
    return '/logos/sbp.svg';
  }
  if (dept.includes('fbr') || dept.includes('revenue') || dept.includes('taxation') || dept.includes('tehsildar')) {
    return '/logos/fbr.svg';
  }
  if (dept.includes('pitb') || dept.includes('information technology board') || dept.includes('programmer') || dept.includes('software')) {
    return '/logos/pitb.svg';
  }
  if (dept.includes('health') || dept.includes('medical') || dept.includes('registrar') || dept.includes('hospital') || dept.includes('oncology') || dept.includes('anaesthesia')) {
    return '/logos/health.svg';
  }

  // 2. Official Testing & Recruitment Commissions
  if (agency === 'FPSC' || dept.includes('fpsc') || title.includes('fpsc') || title.includes('css')) {
    return '/logos/fpsc.svg';
  }
  if (agency === 'PPSC' || dept.includes('ppsc') || title.includes('ppsc')) {
    return '/logos/ppsc.svg';
  }
  if (agency === 'SPSC' || dept.includes('spsc') || title.includes('spsc')) {
    return '/logos/spsc.svg';
  }
  if (agency === 'KPPSC' || dept.includes('kppsc') || title.includes('kppsc')) {
    return '/logos/kppsc.svg';
  }
  if (agency === 'NTS' || dept.includes('nts') || title.includes('nts')) {
    return '/logos/nts.svg';
  }

  // 3. Private / Tech Companies
  if (company.includes('systems') || title.includes('systems limited')) {
    return '/logos/systems-limited.svg';
  }
  if (company.includes('sadapay') || title.includes('sadapay')) {
    return '/logos/sadapay.svg';
  }
  if (company.includes('arbisoft') || title.includes('arbisoft')) {
    return '/logos/arbisoft.svg';
  }
  if (company.includes('10pearls') || company.includes('tenpearls')) {
    return '/logos/tenpearls.svg';
  }
  if (company.includes('careem') || title.includes('careem')) {
    return '/logos/careem.svg';
  }

  // 4. Graceful Fallbacks by Sector
  if (type === 'private') {
    return '/logos/default-tech.svg';
  }
  
  return '/logos/default-govt.svg';
}

export function getJobLogoAlt(job = {}) {
  if (job.company) {
    return `${job.company} Official Logo`;
  }
  if (job.agency) {
    return `${job.agency} Official Emblem`;
  }
  return `${job.department || 'Government of Pakistan'} Official Crest`;
}
