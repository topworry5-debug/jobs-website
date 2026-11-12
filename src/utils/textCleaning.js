/**
 * Utility functions for data cleaning, Title Case formatting,
 * HTML entity decoding, location formatting, and deadline presentation.
 */

export const ACRONYM_ALLOWLIST = new Set([
  'FPSC', 'PPSC', 'SPSC', 'KPPSC', 'BPSC', 'NTS', 'CSS', 'PMS', 'CCE',
  'BPS', 'BS', 'SBP', 'FESCO', 'GEPCO', 'LESCO', 'IESCO', 'MEPCO', 'PESCO',
  'WAPDA', 'PTCL', 'MCQ', 'MCQS', 'HEC', 'ECP', 'NADRA', 'FIA', 'NAB',
  'ASF', 'MOD', 'PAF', 'OG', 'OG-1', 'OG-2', 'OG-3', 'MS', 'MPHIL', 'PHD',
  'IT', 'AI', 'HR', 'CSD', 'CAA', 'POF', 'PTS', 'CTS', 'OTS', 'KPK',
  'AJK', 'GB', 'ICT', 'PSID', 'CNIC', 'ATS', 'RYK', 'DSC', 'NAT', 'GAT',
  'HAT', 'FBR', 'OGRA', 'NEPRA', 'SNGPL', 'SSGC', 'PARCO', 'PSO',
  'HBL', 'UBL', 'MCB', 'NBP', 'BOP', 'BOK', 'ZTBL', 'SECP', 'PEF'
]);

const ROMAN_NUMERALS = new Set([
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII'
]);

const MINOR_WORDS = new Set([
  'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'near', 'nor',
  'of', 'off', 'on', 'onto', 'or', 'per', 'to', 'with', 'via', 'vs',
  'a', 'an', 'the'
]);

/**
 * Decodes all HTML entities into their actual character representations.
 */
export function decodeHtmlEntities(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x2F;/gi, '/')
    .replace(/&#x27;/gi, "'")
    .replace(/&#38;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
}

/**
 * Converts text to Title Case, preserving acronyms and Roman numerals.
 */
export function toTitleCase(str) {
  if (!str || typeof str !== 'string') return '';
  const decoded = decodeHtmlEntities(str).trim();

  // If text is not ALL-CAPS, return decoded string directly
  const isAllCaps = decoded.length > 3 && decoded === decoded.toUpperCase() && /[A-Z]/.test(decoded);
  if (!isAllCaps) {
    return decoded;
  }

  // Convert ALL-CAPS string to Title Case while respecting allowlist and hyphenated words
  return decoded.toLowerCase().replace(/[A-Za-z0-9]+/g, (word, index) => {
    const upperWord = word.toUpperCase();
    if (ACRONYM_ALLOWLIST.has(upperWord)) {
      return upperWord;
    }
    if (ROMAN_NUMERALS.has(upperWord)) {
      return upperWord;
    }
    if (index > 0 && MINOR_WORDS.has(word.toLowerCase())) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
}

/**
 * Formats locations: returns first 2 cities and "+N more" if more than 2.
 */
export function formatLocations(cityStr) {
  if (!cityStr || typeof cityStr !== 'string') return { display: 'All Pakistan', count: 1, full: 'All Pakistan' };
  const clean = decodeHtmlEntities(cityStr).trim();
  
  // Split by comma or slash
  const cities = clean.split(/[,/]/).map(c => c.trim()).filter(Boolean);
  if (cities.length <= 2) {
    return {
      display: clean,
      count: cities.length,
      full: clean
    };
  }

  const firstTwo = cities.slice(0, 2).join(', ');
  const remaining = cities.length - 2;
  return {
    display: `${firstTwo} +${remaining} more`,
    count: cities.length,
    full: clean
  };
}

/**
 * Builds display title ONLY from stored fields.
 * E.g. "{Agency}: {title}"
 * Generic notices: "{Agency} Consolidated Advertisement No. 4/2026 - {vacancies} posts"
 * Preserves original title as secondary text if it differs.
 */
export function getDisplayTitle(job) {
  if (!job) return { displayTitle: '', originalTitle: null };
  const agency = (job.agency || '').toUpperCase().trim();
  const rawTitle = decodeHtmlEntities(job.title || '').trim();
  let cleanedTitle = toTitleCase(rawTitle);

  // Normalize generic notices like "GR - Consolidated Advertisement No. 4/2026"
  if (/^GR\s*[-–—]\s*/i.test(cleanedTitle)) {
    cleanedTitle = cleanedTitle.replace(/^GR\s*[-–—]\s*/i, '');
  }

  let displayTitle = cleanedTitle;
  // If agency exists and title doesn't already start with agency, prefix it
  if (agency && !cleanedTitle.toUpperCase().startsWith(agency)) {
    displayTitle = `${agency}: ${cleanedTitle}`;
  }

  // If generic notice with vacancies and vacancies not in title
  if (/Consolidated Advertisement/i.test(displayTitle) && job.vacancies && job.vacancies > 1 && !displayTitle.toLowerCase().includes('post')) {
    displayTitle = `${displayTitle} - ${job.vacancies} posts`;
  }

  const differs = displayTitle.trim().toLowerCase() !== rawTitle.trim().toLowerCase();

  return {
    displayTitle,
    originalTitle: differs ? rawTitle : null
  };
}

/**
 * Formats lastDate as real date ("15 Dec 2026") with relative status info.
 */
export function formatJobDeadline(lastDate, status) {
  if (!lastDate) {
    return {
      dateFormatted: 'Refer to ad',
      relativeLabel: 'Ongoing',
      isClosed: false,
      isUrgent: false,
      daysLeft: null
    };
  }

  // Format real date e.g. "15 Dec 2026"
  let dateFormatted = lastDate;
  try {
    const parts = lastDate.split('-');
    if (parts.length === 3) {
      const d = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
      dateFormatted = d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC'
      });
    }
  } catch (e) {}

  // Compare to current time (Pakistan Time)
  const now = new Date();
  const target = new Date(`${lastDate}T23:59:59+05:00`);
  const diffMs = target - now;
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (status === 'closed' || daysLeft < 0) {
    return {
      dateFormatted,
      relativeLabel: 'Closed',
      isClosed: true,
      isUrgent: false,
      daysLeft: 0
    };
  }

  if (daysLeft === 0) {
    return {
      dateFormatted,
      relativeLabel: 'Closes today',
      isClosed: false,
      isUrgent: true,
      daysLeft: 0
    };
  }

  if (daysLeft <= 3) {
    return {
      dateFormatted,
      relativeLabel: `${daysLeft} days left`,
      isClosed: false,
      isUrgent: true,
      daysLeft
    };
  }

  return {
    dateFormatted,
    relativeLabel: `${daysLeft} days left`,
    isClosed: false,
    isUrgent: false,
    daysLeft
  };
}
