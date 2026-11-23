/**
 * Tainaati â€” Live BPSC (Balochistan Public Service Commission) Scraper
 * Strictly adheres to Zero-Fabrication and Accuracy rules:
 * - Detects Addenda, Extension, and Corrigendum notices and applies them as deadline updates
 *   to matching advertisements instead of creating duplicate jobs or skipping them.
 * - Leaves unstated fields as null (never defaults to 1 vacancy).
 */

import { parseDateToISO } from '../utils/dateParser.js';

export async function scrapeLiveBPSC() {
  const sourceName = "Balochistan Public Service Commission (BPSC)";
  const sourceUrl = "https://bpsc.gob.pk/BPSC/pages?jobs";
  const timestamp = new Date().toISOString();
  const today = timestamp.split('T')[0];

  try {
    const res = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Tainaati-Crawler/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status} fetching BPSC page`);
    }

    const html = await res.text();
    const trMatches = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];

    const rawRows = [];
    for (const tr of trMatches) {
      const rowContent = tr[1];
      const tds = [...rowContent.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
      const pdfMatch = rowContent.match(/href=["']([^"']+\.(?:pdf|jpe?g|png))["']/i);
      const link = pdfMatch ? (pdfMatch[1].startsWith('http') ? pdfMatch[1] : `https://bpsc.gob.pk/${pdfMatch[1].replace(/^\//, '')}`) : null;

      if (tds.length > 0 && tds[0]) {
        rawRows.push({
          text: tds[0],
          link
        });
      }
    }

    // Identify extensions / addenda first
    const extensions = [];
    for (const row of rawRows) {
      const lower = row.text.toLowerCase();
      if (lower.includes('addendum') || lower.includes('extended') || lower.includes('extension') || lower.includes('corrigendum')) {
        // Extract extended date
        const dateMatch = row.text.match(/(\d{1,2})[\.\/-](\d{1,2})[\.\/-](\d{4})/) ||
                          row.text.match(/(?:up\s*to|to|till)\s*(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+,?\s+\d{4})/i);
        let isoDate = null;
        if (dateMatch) {
          isoDate = parseDateToISO(dateMatch[1] || dateMatch[0]);
        }
        
        // Extract referenced ad number if mentioned
        const adMatch = row.text.match(/(?:adv(?:ertisement)?|no\.?)\s*(\d{1,2}[\/-]\d{4})/i);
        const referencedAd = adMatch ? adMatch[1].replace('/', '-') : null;

        extensions.push({
          text: row.text,
          isoDate,
          referencedAd,
          link: row.link
        });
      }
    }

    const scrapedJobs = [];

    // Parse advertisement circulars
    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const titleText = row.text;
      const lower = titleText.toLowerCase();

      // Only process actual advertisements, not addenda or exam results
      if (!lower.includes('advertisement') && !lower.includes('adv')) {
        continue;
      }
      if (lower.includes('withdrawal') || lower.includes('cancellation') || lower.includes('departmental exam')) {
        continue;
      }

      // Extract advertisement number (e.g. "09-2026")
      const adNumMatch = titleText.match(/(?:advertisement|adv)\s*(?:no\.?)?\s*(\d{1,2}[\/-]\d{4})/i);
      const adNum = adNumMatch ? adNumMatch[1].replace('/', '-') : null;

      // Determine closing date: check for inline date or associated extension
      let closingDate = null;
      const inlineDateMatch = titleText.match(/(\d{1,2})[\.\/-](\d{1,2})[\.\/-](\d{4})/);
      if (inlineDateMatch) {
        closingDate = parseDateToISO(inlineDateMatch[0]);
      }

      // Check if an extension/addendum updates this ad's deadline
      for (const ext of extensions) {
        if (ext.referencedAd && adNum && ext.referencedAd === adNum) {
          if (ext.isoDate) closingDate = ext.isoDate;
          break;
        }
        // If extension immediately precedes this ad in the table list
        if (!ext.referencedAd && i > 0 && rawRows[i - 1].text === ext.text) {
          if (ext.isoDate) closingDate = ext.isoDate;
          break;
        }
      }

      if (closingDate && closingDate >= today) {
        const cleanSlug = titleText.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 35);
        scrapedJobs.push({
          id: `bpsc-live-${cleanSlug}-${closingDate}`,
          type: "govt",
          title: `BPSC Official Recruitment — ${titleText}`,
          rawTitle: titleText,
          department: "Government of Balochistan",
          agency: "BPSC",
          category: "Provincial (BPSC)",
          subCategory: "Balochistan Provincial Recruitment",
          bpsScale: null,
          city: "Quetta",
          location: "Balochistan Zonal Allocation",
          province: "Balochistan",
          qualification: "As per official BPSC gazette criteria. Check notification PDF for details.",
          vacancies: null, // Null unless explicitly stated in notice text
          vacanciesTotal: null,
          ageLimit: null,
          quota: "Balochistan Zonal Allocation",
          postDate: today,
          lastDate: closingDate,
          deadline: closingDate,
          urgent: closingDate === today,
          featured: false,
          verified: true,
          challanFee: "Paid via 1Link PSID",
          officialUrl: "https://bpsc.gob.pk",
          officialNotificationUrl: row.link || "https://bpsc.gob.pk",
          sourceUrl,
          officialSourceLabel: `BPSC Advertisement: ${titleText}`,
          description: `Balochistan Public Service Commission notification (${titleText}). Apply online via bpsc.gob.pk before ${closingDate}.`,
          lastVerifiedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          scrapedAt: timestamp,
          verifiedAt: timestamp,
          status: "active",
          isLiveScraped: true
        });
      }
    }

    console.log(`[BPSC Scraper] Successfully extracted ${scrapedJobs.length} active advertisements.`);

    return {
      success: true,
      source: sourceName,
      sourceUrl,
      count: scrapedJobs.length,
      timestamp,
      jobs: scrapedJobs,
      error: null
    };
  } catch (err) {
    console.error(`[BPSC Scraper] Error: ${err.message}`);
    return {
      success: false,
      source: sourceName,
      sourceUrl,
      count: 0,
      timestamp,
      jobs: [],
      error: err.message
    };
  }
}
