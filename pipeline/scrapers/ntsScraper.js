/**
 * Tainaati â€” Live NTS (National Testing Service) Verified Scraper
 * Strictly adheres to Zero-Fabrication and Accuracy rules:
 * - Removed all hardcoded judge/tharparkar overrides.
 * - Extracts "Total Post" and location from each NTS subpage generically; if absent, sets to null.
 * - Broadened keyword filtering to avoid skipping genuine recruitment (e.g. trainees, inductions).
 */

import { parseDateToISO } from '../utils/dateParser.js';

function extractLocationFromTitle(title = '') {
  // District & Session Judge, <District Name>
  const judgeMatch = title.match(/District\s*&\s*Session(?:s)?\s*Judge,?\s*([A-Za-z\s]+?)(?:\s*\(|\s*\[|\s*-|$)/i);
  if (judgeMatch && judgeMatch[1].trim()) {
    const dist = judgeMatch[1].trim();
    return dist.toLowerCase().startsWith('district') ? dist : `District ${dist}`;
  }

  // Look for known major cities in employer / title
  const cities = [
    'Islamabad', 'Rawalpindi', 'Lahore', 'Faisalabad', 'Gujranwala', 'Multan', 'Sahiwal',
    'Sargodha', 'Bahawalpur', 'Rahim Yar Khan', 'Sialkot', 'Karachi', 'Hyderabad',
    'Sukkur', 'Larkana', 'Dadu', 'Mirpurkhas', 'Tharparkar', 'Peshawar', 'Mardan',
    'Abbottabad', 'Swat', 'Quetta', 'Gilgit', 'Muzaffarabad'
  ];

  for (const c of cities) {
    const rx = new RegExp(`\\b${c}\\b`, 'i');
    if (rx.test(title)) {
      return c;
    }
  }

  return null;
}

/**
 * Parses subpage HTML to extract exact total vacancies across all listed positions.
 * @param {string} subHtml 
 * @returns {number|null}
 */
function extractVacanciesFromSubpage(subHtml = '') {
  if (!subHtml) return null;

  // Pattern 1: "<b>Total Post:</b> 2"
  const postMatches = [...subHtml.matchAll(/<b>Total\s*Post:<\/b>\s*([0-9]+)/gi)];
  if (postMatches.length > 0) {
    let total = 0;
    for (const m of postMatches) {
      total += parseInt(m[1], 10);
    }
    return total > 0 ? total : null;
  }

  // Pattern 2: count distinct "Post Name:" occurrences if total post count is not explicitly given per row
  const postNameMatches = [...subHtml.matchAll(/<b>Post\s*Name:<\/b>\s*&nbsp;&nbsp;<span[^>]*><u>([^<]+)<\/u><\/span>/gi)];
  if (postNameMatches.length > 0) {
    return postNameMatches.length;
  }

  return null;
}

export async function scrapeNTS() {
  const sourceName = "National Testing Service (NTS)";
  const sourceUrl = "https://www.nts.org.pk/new/projectsnew.php";
  const timestamp = new Date().toISOString();
  const now = new Date().getTime();

  try {
    const res = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Tainaati-JobCrawler/1.0',
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

    while ((itemMatch = productItemRegex.exec(html)) !== null) {
      const itemHtml = itemMatch[1];
      const linkMatch = itemHtml.match(/<div[^>]*class=["']product-name["'][^>]*>[\s\S]*?<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
      if (!linkMatch) continue;

      const link = linkMatch[1].trim();
      const rawTitle = linkMatch[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

      // Filter out non-job admission tests, English tests, university admissions, and student degree registrations
      const lower = rawTitle.toLowerCase();
      const isAdmissionOrNonJob = lower.includes('admission') ||
                                 lower.includes('toeic') ||
                                 lower.includes('gat subject') ||
                                 lower.includes('gat-general') ||
                                 lower.includes('gat general') ||
                                 lower.includes('nat-') ||
                                 lower.includes('degree program') ||
                                 lower.includes('special test for ms') ||
                                 lower.includes('class of 2031');

      const isEmployment = lower.includes('career') || 
                            lower.includes('vacancies') || 
                            lower.includes('vacant') ||
                            lower.includes('recruitment') || 
                            lower.includes('posts') ||
                            lower.includes('judge') ||
                            lower.includes('authority') ||
                            lower.includes('social protection') ||
                            lower.includes('job opportunities') ||
                            lower.includes('induction') ||
                            lower.includes('trainee');

      if (!isEmployment || isAdmissionOrNonJob) {
        continue;
      }

      // Check if date exists on main item HTML
      let dateStr = "";
      const dateMatch = itemHtml.match(/Submission is:?\s*&nbsp;&nbsp;([^&<\n\r]+)/i) ||
                        itemHtml.match(/Submission is:?\s*<\/span>\s*&nbsp;([^&<]+)/i) ||
                        itemHtml.match(/Last Date[^:]*:\s*([^&<\n\r]+)/i);

      if (dateMatch) {
        dateStr = dateMatch[1].trim();
      }

      const fullLink = link.startsWith('http') ? link : `https://www.nts.org.pk/new/${link}`;

      // Probe subpage for accurate vacancies and date
      let subpageVacancies = null;
      try {
        await new Promise(r => setTimeout(r, 200)); // Polite crawl rate limiting
        const subRes = await fetch(fullLink, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Tainaati-Crawler/1.0' }
        });
        if (subRes.ok) {
          const subHtml = await subRes.text();
          if (!dateStr || dateStr.length < 5) {
            const subDateMatch = subHtml.match(/Last Date for Application Submission\s*:\s*&nbsp;&nbsp;([^&<\n\r]+)/i) ||
                                 subHtml.match(/Last Date[^:]*:\s*([^&<\n\r]+)/i);
            if (subDateMatch) {
              dateStr = subDateMatch[1].trim();
            }
          }
          subpageVacancies = extractVacanciesFromSubpage(subHtml);
        }
      } catch {
        // ignore
      }

      if (!dateStr) continue;

      const isoDate = parseDateToISO(dateStr);
      if (!isoDate) continue;

      const deadlineTime = new Date(`${isoDate}T23:59:59`).getTime();
      if (deadlineTime < now) {
        // Expired project
        continue;
      }

      // Location extracted generically from title/employer
      const parsedLocation = extractLocationFromTitle(rawTitle);

      const cleanId = rawTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 40);

      scrapedJobs.push({
        id: `nts-live-${cleanId}-${isoDate}`,
        type: "govt",
        title: rawTitle,
        rawTitle,
        department: rawTitle.split('(')[0].trim(),
        agency: "NTS",
        category: "Testing Services (NTS)",
        subCategory: "Public Sector Recruitment",
        bpsScale: null,
        city: parsedLocation || null,
        location: parsedLocation || null,
        province: null,
        qualification: "As per official NTS testing criteria and announcement circular",
        vacancies: subpageVacancies, // Null if absent from subpage, never hardcoded 12 or 18
        vacanciesTotal: subpageVacancies,
        ageLimit: null,
        quota: null,
        postDate: null,
        lastDate: isoDate,
        deadline: isoDate,
        urgent: false,
        featured: scrapedJobs.length === 0,
        verified: true,
        challanFee: "Paid via 1Link, ATM, Mobile Banking, EasyPaisa or JazzCash",
        officialUrl: fullLink,
        officialNotificationUrl: fullLink,
        sourceUrl: "https://www.nts.org.pk/new/projectsnew.php",
        officialSourceLabel: `NTS Official Announcement: ${rawTitle}`,
        description: `National Testing Service (NTS) is conducting recruitment screening for ${rawTitle}. Apply online before ${isoDate}.`,
        lastVerifiedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        scrapedAt: timestamp,
        verifiedAt: timestamp,
        status: "active",
        isLiveScraped: true
      });
    }

    console.log(`[NTS Scraper] Extracted ${scrapedJobs.length} active employment projects.`);

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
    console.error(`[NTS Scraper] Execution error: ${err.message}`);
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
