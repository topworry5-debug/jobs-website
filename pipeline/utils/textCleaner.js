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

export function cleanScrapedJob(job) {
  if (!job || typeof job !== 'object') return job;
  const fields = ['title', 'rawTitle', 'department', 'company', 'city', 'location', 'province', 'officialSourceLabel', 'category', 'quota', 'qualification', 'description'];
  for (const field of fields) {
    if (typeof job[field] === 'string') {
      job[field] = decodeHtmlEntities(job[field]);
    }
  }
  return job;
}

