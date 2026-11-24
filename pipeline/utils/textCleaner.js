/**
 * Pipeline Text Cleaning and HTML Entity Decoding
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
    .replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\s+/g, ' ')
    .trim();
}

export function cleanJobTitle(title = '') {
  if (!title || typeof title !== 'string') return '';
  let clean = decodeHtmlEntities(title).trim();

  // Strip "Official Recruitment — " or "Official Recruitment -"
  clean = clean.replace(/\b(?:Official\s+Recruitment|Official\s+Job\s+Notice)\s*[-—–]\s*/gi, '');

  // Strip "Closing dt: ...", "Last date: ...", "Closing date: ..."
  clean = clean.replace(/[-—–\s]*(?:Closing\s*dt|Closing\s*date|Last\s*date)\s*[:\-–]?\s*\d{1,2}[\.\/-]\d{1,2}[\.\/-]\d{2,4}\.?/gi, '');

  // Convert "Advertisement (\d+)/(\d{2})" to "Advertisement No. $1/20$2"
  clean = clean.replace(/\bAdvertisement\s*(\d{1,2})\/(\d{2})\b/gi, (m, num, yr) => `Advertisement No. ${num.padStart(2, '0')}/20${yr}`);
  clean = clean.replace(/\bAdvertisement\s*(\d{1,2})\/(\d{4})\b/gi, (m, num, yr) => `Advertisement No. ${num.padStart(2, '0')}/${yr}`);

  // Trim trailing dashes, dots, spaces
  clean = clean.replace(/[-—–\s\.]+$/g, '').trim();
  return clean;
}

export function cleanScrapedJob(job) {
  if (!job || typeof job !== 'object') return job;
  const fields = ['title', 'rawTitle', 'department', 'company', 'city', 'location', 'province', 'officialSourceLabel', 'category', 'quota', 'qualification', 'description'];
  for (const field of fields) {
    if (typeof job[field] === 'string') {
      job[field] = decodeHtmlEntities(job[field]);
    }
  }
  if (job.title) {
    job.title = cleanJobTitle(job.title);
  }
  return job;
}

