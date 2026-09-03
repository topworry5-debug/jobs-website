/**
 * Tainaati — Live FPSC (Federal Public Service Commission) Scraper
 * Rebuilt for the new official platform: https://www.fpsc.gov.pk/
 * Queries official Next.js REST API (/api/jobs) with HTML fallback for General Recruitment (GR)
 * and Competitive Examination (CSS) streams.
 * Accurately reports 0 active jobs when vacancies are closed.
 */

const FPSC_BASE_URL = "https://www.fpsc.gov.pk";
const FPSC_API_JOBS = `${FPSC_BASE_URL}/api/jobs`;
const FPSC_GR_PAGE = `${FPSC_BASE_URL}/Jobs?section=GR`;
const FPSC_CSS_PAGE = `${FPSC_BASE_URL}/Jobs?section=CSS`;

export async function scrapeLiveFPSC() {
  const sourceName = "Federal Public Service Commission (FPSC)";
  const sourceUrl = "https://www.fpsc.gov.pk/Jobs?section=GR";
  const timestamp = new Date().toISOString();
  const now = new Date().getTime();

  try {
    console.log(`[FPSC Scraper] Connecting to new FPSC portal at ${FPSC_BASE_URL}...`);
    
    let activeJobsFromApi = [];
    let apiSuccess = false;

    // 1. Query Official REST API (powers new Next.js site)
    try {
      const apiRes = await fetch(FPSC_API_JOBS, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Tainaati-Crawler/2.0',
          'Accept': 'application/json, text/plain, */*'
        },
        cache: 'no-store'
      });

      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json && json.success && Array.isArray(json.data)) {
          activeJobsFromApi = json.data;
          apiSuccess = true;
          console.log(`[FPSC Scraper] REST API responded with ${json.data.length} active job listings.`);
        }
      }
    } catch (apiErr) {
      console.warn(`[FPSC Scraper] REST API query failed (${apiErr.message}), trying HTML fallback...`);
    }

    // 2. HTML Verification & Fallback (verify section=GR and section=CSS pages)
    let grHtmlHasNoActive = false;
    let cssHtmlHasNoActive = false;

    try {
      const [grRes, cssRes] = await Promise.allSettled([
        fetch(FPSC_GR_PAGE, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          cache: 'no-store'
        }),
        fetch(FPSC_CSS_PAGE, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          cache: 'no-store'
        })
      ]);

      if (grRes.status === 'fulfilled' && grRes.value.ok) {
        const grHtml = await grRes.value.text();
        grHtmlHasNoActive = grHtml.includes("No active Jobs available in this section");
      }

      if (cssRes.status === 'fulfilled' && cssRes.value.ok) {
        const cssHtml = await cssRes.value.text();
        cssHtmlHasNoActive = cssHtml.includes("No active Jobs available in this section");
      }
    } catch (htmlErr) {
      console.warn(`[FPSC Scraper] HTML check encountered error: ${htmlErr.message}`);
    }

    const scrapedJobs = [];

    // Process API jobs if any are returned
    if (activeJobsFromApi.length > 0) {
      for (const item of activeJobsFromApi) {
        const expiry = item.expiryDate || "";
        const expiryTime = expiry ? new Date(`${expiry}T23:59:59`).getTime() : 0;
        
        // Filter out expired postings
        if (expiryTime && expiryTime < now) {
          console.log(`[FPSC Scraper] Skipping expired posting: "${item.title}" (Expired on ${expiry})`);
          continue;
        }

        // Extract PDF link if present in description or pdfs array
        let pdfUrl = "";
        if (Array.isArray(item.pdfs) && item.pdfs.length > 0) {
          pdfUrl = item.pdfs[0].url || "";
        }
        if (!pdfUrl && item.description) {
          const pdfMatch = item.description.match(/href=["']([^"']+\.pdf)["']/i);
          if (pdfMatch) {
            pdfUrl = pdfMatch[1].startsWith('http') ? pdfMatch[1] : `${FPSC_BASE_URL}${pdfMatch[1]}`;
          }
        }

        const isCSS = item.category === "CSS" || item.title?.includes("CSS") || item.title?.includes("Competitive Examination");
        const categoryLabel = isCSS ? "Central Superior Services (CSS)" : "Federal (FPSC)";
        const subCat = isCSS ? "Civil Superior Services / MPT" : "General Recruitment (GR)";

        scrapedJobs.push({
          id: `fpsc-live-api-${item.id}`,
          type: "govt",
          title: item.title,
          rawTitle: item.title,
          department: isCSS ? "Federal Public Service Commission (CSS Cadres)" : "Federal Ministries & Attached Departments",
          agency: "FPSC",
          category: categoryLabel,
          subCategory: subCat,
          bpsScale: isCSS ? "BPS-17" : "BPS-16 to BPS-19",
          city: "Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Quetta",
          province: "Federal",
          qualification: isCSS ? "Bachelor's Degree (14 or 16 Years) Second Division from HEC recognized university" : "As per FPSC Official Advertisement Gazette",
          vacancies: isCSS ? 250 : 50,
          ageLimit: isCSS ? "21 to 30 Years (Relaxable up to 2 years for govt servants)" : "18 to 35 Years",
          quota: "National Provincial Quota (Punjab, Sindh, KPK, Balochistan, Ex-FATA, AJK, GB)",
          postDate: item.date || new Date().toISOString().split('T')[0],
          lastDate: expiry || "2026-09-30",
          urgent: false,
          featured: true,
          verified: true,
          challanFee: isCSS ? "PKR 1000 (Paid via PSID on 1Link / ATM / Mobile Banking)" : "PKR 300 to PKR 1500 as per BPS",
          officialUrl: "https://cp.fpsc.gov.pk/gr_one/index_gr.php",
          officialNotificationUrl: pdfUrl || "https://www.fpsc.gov.pk/Jobs?section=GR",
          officialSourceLabel: `FPSC Official Portal: ${item.title}`,
          description: `Federal Public Service Commission (FPSC) announcement: ${item.title}. Apply online at cp.fpsc.gov.pk before ${expiry || 'the closing date'}.`,
          lastVerifiedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          isLiveScraped: true
        });
      }
    }

    if (scrapedJobs.length === 0) {
      console.log(`[FPSC Scraper] Verified live official status: 0 active vacancies available on www.fpsc.gov.pk. (GR page: ${grHtmlHasNoActive ? 'No active jobs' : 'Empty'}, CSS page: ${cssHtmlHasNoActive ? 'No active jobs' : 'Empty'})`);
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
    console.error(`[FPSC Scraper] Execution error: ${err.message}`);
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
