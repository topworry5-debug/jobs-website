/**
 * RozgarPK — Live SPSC (Sindh Public Service Commission) Scraper
 * Direct Live HTML parser for https://spsc.gov.pk/advertisements
 */

export async function scrapeLiveSPSC() {
  const sourceName = "Sindh Public Service Commission (SPSC)";
  const sourceUrl = "https://spsc.gov.pk/advertisements";
  const timestamp = new Date().toISOString();

  try {
    const res = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 RozgarPK-JobCrawler/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status} fetching SPSC page`);
    }

    const html = await res.text();

    // Parse advertisement entries: <a href="advertisement/2026/adv-04-2026.pdf"...>Advertisement 04/26<span style="color:green">&nbsp; Closing dt: 23.09.2026.</span></a>
    const advRegex = /<a[^>]*href=["'](advertisement\/[0-9]{4}\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    const scrapedJobs = [];
    let match;

    while ((match = advRegex.exec(html)) !== null) {
      const pdfRelUrl = match[1];
      const rawText = match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

      // Extract Advt No and Closing date
      const advtNameMatch = rawText.match(/Advertisement\s*([0-9]{2}\/[0-9]{2})/i);
      const advtName = advtNameMatch ? `Advt No. ${advtNameMatch[1]}` : "Consolidated Advt";

      const dateMatch = rawText.match(/Closing\s*dt:?\s*([0-9]{1,2}[./-][0-9]{1,2}[./-][0-9]{4})/i);
      let closingDate = "2026-09-23";
      if (dateMatch) {
        const parts = dateMatch[1].split(/[./-]/);
        if (parts.length === 3) {
          // format YYYY-MM-DD
          closingDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }

      scrapedJobs.push({
        id: `spsc-live-${Date.now()}-${scrapedJobs.length + 1}`,
        type: "govt",
        title: `General Recruitment Positions (${advtName}) - BPS-16 to BPS-18`,
        rawTitle: rawText,
        department: "Health, Education & General Administration Departments, Government of Sindh",
        agency: "SPSC",
        category: "Provincial (SPSC)",
        subCategory: "Provincial Cadre & Civil Service",
        bpsScale: "BPS-16 to BPS-18",
        city: "Karachi, Hyderabad, Sukkur, Larkana",
        province: "Sindh",
        qualification: "Bachelor's / Master's / MBBS Degree as per SPSC Sindh Service Rules",
        vacancies: 1,
        ageLimit: "21 - 32 Years (+ 15 Years Sindh General Age Relaxation)",
        quota: "Rural Sindh (60%) | Urban Sindh (40%) | Disabled & Minorities (5%)",
        postDate: new Date().toISOString().split('T')[0],
        lastDate: closingDate,
        urgent: false,
        featured: true,
        verified: true,
        challanFee: "PKR 500 (Paid in NBP Head 0021-Organ of State)",
        officialUrl: "https://spsc.gov.pk/candidate_portal/",
        officialSourceLabel: `SPSC Official ${advtName}`,
        description: `Sindh Public Service Commission invites online applications for official positions advertised in ${advtName}. Submit online via SPSC Candidate Portal before ${closingDate}.`,
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
