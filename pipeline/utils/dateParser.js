/**
 * RozgarPK Date Parser
 * Parses natural Pakistani date strings into strict ISO YYYY-MM-DD.
 */
export function parseDateToISO(str) {
  if (!str) return null;
  const clean = str.replace(/(\d+)(st|nd|rd|th)/gi, '$1').replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Try direct ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean;
  }

  // Try standard Date.parse
  const timestamp = Date.parse(clean);
  if (!isNaN(timestamp)) {
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Try DD-MM-YYYY
  const dmyMatch = clean.match(/^(\d{1,2})[-/\s](\d{1,2})[-/\s](\d{4})$/);
  if (dmyMatch) {
    const day = String(dmyMatch[1]).padStart(2, '0');
    const month = String(dmyMatch[2]).padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  return null;
}
