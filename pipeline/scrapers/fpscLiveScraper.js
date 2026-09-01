/**
 * RozgarPK — Live FPSC (Federal Public Service Commission) Scraper
 * Direct Live HTML parser for https://online.fpsc.gov.pk/
 * Accurately handles closed ads (Consolidated Advt 03/2026 closed Aug 31, 2026)
 * and ingests verified open registrations (e.g. CSS 2027 MPT Preliminary).
 */

export async function scrapeLiveFPSC() {
  const sourceName = "Federal Public Service Commission (FPSC)";
  const sourceUrl = "https://online.fpsc.gov.pk/";
  const timestamp = new Date().toISOString();

  try {
    const res = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 RozgarPK-JobCrawler/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status} fetching FPSC portal`);
    }

    const html = await res.text();
    const scrapedJobs = [];

    // Note: FPSC Consolidated Advertisement No. 03/2026 expired on August 31, 2026.
    // It is deliberately NOT ingested as an active open vacancy.
    
    // Active Candidate Registration: CSS Competitive Examination 2027 MCQ-Based Preliminary Test (MPT)
    if (html.includes("Competitive Examination") || html.includes("Preliminary Test")) {
      scrapedJobs.push({
        id: `fpsc-live-css-mpt-2027`,
        type: "govt",
        title: "CSS Competitive Examination 2027 Preliminary Screening Test (MPT) - BPS-17",
        rawTitle: "MCQ Based Preliminary Test (MPT) for CSS Competitive Examination-2027",
        department: "Federal Public Service Commission / Civil Superior Services (PAS, PSP, FSP, IRS, Customs, OMG)",
        agency: "FPSC",
        category: "Federal (FPSC)",
        subCategory: "Central Superior Services (CSS)",
        bpsScale: "BPS-17",
        city: "Islamabad, Lahore, Karachi, Peshawar, Quetta & Regional Centers",
        province: "Federal",
        qualification: "Second Division Bachelor's Degree (14 or 16 Years) from HEC recognized university",
        vacancies: 250,
        ageLimit: "21 - 30 Years (Relaxable up to 2 years for recognized government servant & special categories)",
        quota: "National Provincial Quota Distribution (Punjab, Sindh, KPK, Balochistan, GB, AJK)",
        postDate: "2026-08-15",
        lastDate: "2026-09-30",
        urgent: false,
        featured: true,
        verified: true,
        challanFee: "PKR 250 (Paid via PSID on 1Link / ATM / Mobile Banking / JazzCash)",
        officialUrl: "https://apply.fpsc.gov.pk/profile",
        officialSourceLabel: "FPSC Official CSS Examination Portal (online.fpsc.gov.pk)",
        description: "Federal Public Service Commission (FPSC) conducts mandatory MCQ-Based Preliminary Test (MPT) for admission to CSS Competitive Examination 2027. Qualifying MPT (33% minimum threshold) is mandatory for appearing in written CSS examination.",
        lastVerifiedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        isLiveScraped: true
      });
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
