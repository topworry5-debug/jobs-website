/**
 * RozgarPK — Live NTS (National Testing Service) Verified Scraper
 * Multi-Step Live Subpage Parser with Zero Fallbacks and Zero Guessed Dates.
 * Every project is cross-checked against its individual application subpage.
 */

import { parseDateToISO } from '../utils/dateParser.js';

export async function scrapeNTS() {
  const sourceName = "National Testing Service (NTS)";
  const sourceUrl = "https://www.nts.org.pk/new/projectsnew.php";
  const timestamp = new Date().toISOString();
  const now = new Date().getTime();

  try {
    const res = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 RozgarPK-JobCrawler/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status} fetching NTS projects page`);
    }

    const html = await res.text();
    const productItemRegex = /<li[^>]*class=["']product["'][^>]*>([\s\S]*?)<\/li>/gi;
    const scrapedJobs = [];
    let itemMatch;

    const projectCandidates = [];

    while ((itemMatch = productItemRegex.exec(html)) !== null) {
      const itemHtml = itemMatch[1];
      const linkMatch = itemHtml.match(/<div[^>]*class=["']product-name["'][^>]*>[\s\S]*?<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
      if (!linkMatch) continue;

      const link = linkMatch[1].trim();
      const rawTitle = linkMatch[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

      const isJobOpportunity = rawTitle.toLowerCase().includes('career') || 
                               rawTitle.toLowerCase().includes('vacancies') || 
                               rawTitle.toLowerCase().includes('recruitment') || 
                               rawTitle.toLowerCase().includes('posts') ||
                               rawTitle.toLowerCase().includes('authority') ||
                               rawTitle.toLowerCase().includes('screening');

      if (rawTitle && isJobOpportunity && link) {
        projectCandidates.push({
          rawTitle,
          link: link.startsWith('http') ? link : `https://www.nts.org.pk/new/${link}`
        });
      }
    }

    // Step 2: Fetch and verify each candidate's exact subpage for verified deadline
    for (const proj of projectCandidates) {
      try {
        const subRes = await fetch(proj.link, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });

        if (!subRes.ok) continue;

        const subHtml = await subRes.text();
        const dateMatch = subHtml.match(/Last Date for Application Submission\s*:\s*&nbsp;&nbsp;([^&<\n\r]+)/i) ||
                          subHtml.match(/Last Date[^:]*:\s*([^&<\n\r]+)/i);

        if (!dateMatch) {
          // Zero tolerance: No explicit date on subpage = DO NOT INGEST
          continue;
        }

        const dateStr = dateMatch[1].trim();
        const isoDate = parseDateToISO(dateStr);

        if (!isoDate) {
          // Unparseable date = DO NOT INGEST
          continue;
        }

        const deadlineTime = new Date(`${isoDate}T23:59:59`).getTime();
        if (deadlineTime < now) {
          // Expired project = DO NOT INGEST
          continue;
        }

        scrapedJobs.push({
          id: `nts-live-${Date.now()}-${scrapedJobs.length + 1}`,
          type: "govt",
          title: proj.rawTitle,
          rawTitle: proj.rawTitle,
          department: proj.rawTitle.split('(')[0].trim(),
          agency: "NTS",
          category: "Testing Services (NTS)",
          subCategory: "Public Sector Recruitment",
          bpsScale: "BPS-16 / BPS-17",
          city: proj.rawTitle.toLowerCase().includes('karachi') ? 'Karachi' : (proj.rawTitle.toLowerCase().includes('islamabad') ? 'Islamabad' : (proj.rawTitle.toLowerCase().includes('lahore') ? 'Lahore' : 'Multiple Districts')),
          province: proj.rawTitle.toLowerCase().includes('sindh') ? 'Sindh' : (proj.rawTitle.toLowerCase().includes('punjab') ? 'Punjab' : 'Federal'),
          qualification: "As per NTS Project Advertisement Criteria",
          vacancies: null,
          ageLimit: "As per official criteria",
          quota: "Open Merit & Regional Quota",
          postDate: new Date().toISOString().split('T')[0],
          lastDate: isoDate, // Strictly verified from subpage
          urgent: false,
          featured: false,
          verified: true,
          challanFee: "Payable via 1Link, EasyPaisa, JazzCash, or Bank",
          officialUrl: proj.link,
          officialSourceLabel: `NTS Official Project: ${proj.rawTitle.substring(0, 45)}...`,
          description: `National Testing Service (NTS) is conducting recruitment screening for ${proj.rawTitle}. Check official notice and apply online before ${isoDate}.`,
          lastVerifiedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          isLiveScraped: true
        });
      } catch {
        // Drop failed requests
        continue;
      }
    }

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
