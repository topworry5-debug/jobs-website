import { getJobDeadlineInfo, formatDate } from '../lib/jobStatus';

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
 * Recursively decodes HTML entities across all string properties of a job record.
 */
export function cleanJobRecord(job) {
  if (!job || typeof job !== 'object') return job;
  const cleaned = { ...job };
  const fields = ['title', 'rawTitle', 'department', 'company', 'city', 'location', 'province', 'officialSourceLabel', 'category', 'quota', 'qualification', 'description'];
  for (const field of fields) {
    if (typeof cleaned[field] === 'string') {
      cleaned[field] = decodeHtmlEntities(cleaned[field]);
    }
  }
  return cleaned;
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
 * Builds clean display title from stored title.
 * Strips artificial agency prefixes like "NTS:" and cleans up formatting.
 */
export function getDisplayTitle(job) {
  if (!job) return { displayTitle: '', originalTitle: null };
  const rawTitle = decodeHtmlEntities(job.title || '').trim();
  let cleanedTitle = toTitleCase(rawTitle);

  // Normalize generic notices like "GR - Consolidated Advertisement No. 4/2026"
  if (/^GR\s*[-–—]\s*/i.test(cleanedTitle)) {
    cleanedTitle = cleanedTitle.replace(/^GR\s*[-–—]\s*/i, '');
  }

  // Remove any legacy "NTS:" prefix if present
  cleanedTitle = cleanedTitle.replace(/^NTS:\s*/i, '').trim();

  let displayTitle = cleanedTitle;

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
 * Formats lastDate as real date ("15 Nov 2026") with relative status info,
 * powered by single source-of-truth getJobDeadlineInfo in Pakistan Time (Asia/Karachi).
 */
export function formatJobDeadline(lastDate, status, now, locale) {
  return getJobDeadlineInfo(lastDate, status, now, locale);
}
