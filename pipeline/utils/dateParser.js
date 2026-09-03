/**
 * Tainaati Date Parser
 * Parses natural Pakistani date strings into strict ISO YYYY-MM-DD.
 * Note: In Pakistan, numeric dates are ALWAYS Day-Month-Year (DD-MM-YYYY).
 */
export function parseDateToISO(str) {
  if (!str) return null;
  const clean = str.replace(/(\d+)(st|nd|rd|th)/gi, '$1').replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  
  // 1. Direct ISO: YYYY-MM-DD
  const isoMatch = clean.match(/^(\d{4})[-/\s](\d{1,2})[-/\s](\d{1,2})$/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = String(isoMatch[2]).padStart(2, '0');
    const day = String(isoMatch[3]).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 2. Pakistani Official Standard: DD-MM-YYYY (e.g. 03-09-2026 or 18/08/2026)
  const dmyMatch = clean.match(/^(\d{1,2})[-/\s](\d{1,2})[-/\s](\d{4})$/);
  if (dmyMatch) {
    const day = String(dmyMatch[1]).padStart(2, '0');
    const month = String(dmyMatch[2]).padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // 3. Named month natural string: e.g. "20 June 2026" or "Saturday 20th June 2026" or "June 20, 2026"
  const timestamp = Date.parse(clean);
  if (!isNaN(timestamp)) {
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return null;
}
