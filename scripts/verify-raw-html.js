/**
 * RozgarPK — Raw Server-Rendered HTML Verification Script (Crawler Simulator)
 * Tests raw HTTP responses with ZERO client-side JavaScript execution.
 */

async function testCrawlerView() {
  console.log("=================================================");
  console.log("RozgarPK — Raw Server-Rendered HTML Crawler Audit");
  console.log("=================================================\n");

  const endpoints = [
    { name: "Homepage", url: "http://localhost:3000/" },
    { name: "Single Job Detail (FPSC FIA)", url: "http://localhost:3000/jobs/govt-fpsc-01" },
    { name: "Single Job Detail (Live PPSC)", url: "http://localhost:3000/jobs/govt-ppsc-02" },
    { name: "Govt Category Hub", url: "http://localhost:3000/jobs/govt" },
    { name: "City Hub (Lahore)", url: "http://localhost:3000/city/lahore" },
    { name: "Agency Hub (PPSC)", url: "http://localhost:3000/agency/ppsc" },
    { name: "Exam Calendar", url: "http://localhost:3000/exams" },
    { name: "Test Prep Hub", url: "http://localhost:3000/test-prep" },
    { name: "Dynamic Sitemap", url: "http://localhost:3000/sitemap.xml" },
    { name: "Robots.txt", url: "http://localhost:3000/robots.txt" }
  ];

  let allPassed = true;

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url);
      const text = await res.text();
      const status = res.status;
      const length = text.length;

      console.log(`🔍 [${status}] Testing: ${ep.name} (${ep.url}) — Payload Size: ${length} bytes`);

      if (ep.name === "Dynamic Sitemap") {
        const hasUrls = text.includes("<url>") && text.includes("https://rozgar.pk/jobs/");
        console.log(`   • Contains <url> and job links: ${hasUrls ? "✅ YES" : "❌ NO"}`);
        if (!hasUrls) allPassed = false;
      } else if (ep.name === "Robots.txt") {
        const hasGPTBot = text.includes("GPTBot") && text.includes("PerplexityBot");
        console.log(`   • Allows AI Crawlers (GPTBot, PerplexityBot): ${hasGPTBot ? "✅ YES" : "❌ NO"}`);
        if (!hasGPTBot) allPassed = false;
      } else {
        // Test 1: Contains semantic HTML (H1/H2)
        const hasH1 = text.includes("<h1");
        const hasH2 = text.includes("<h2");
        const hasJobTitle = text.includes("Assistant Director") || text.includes("Senior Registrar") || text.includes("Jobs in") || text.includes("Exam Calendar") || text.includes("Competitive Exam");
        
        // Test 2: Contains JSON-LD schema
        const hasJsonLd = text.includes('application/ld+json');
        const hasJobPostingSchema = text.includes('"@type":"JobPosting"') || text.includes('"@type":"ItemList"') || text.includes('"@type":"Organization"');

        // Test 3: Confirms NOT empty React SPA root
        const isClientSpaOnly = text.includes('<div id="root"></div>') && !text.includes('job-card-item') && !text.includes('job-main-article');

        console.log(`   • Pre-rendered <h1> and <h2> Headings: ${hasH1 && hasH2 ? "✅ YES" : "⚠️ Partial"}`);
        console.log(`   • Real Job/Page Text in Raw Stream: ${hasJobTitle ? "✅ YES" : "❌ NO"}`);
        console.log(`   • JSON-LD Structured Data in Raw HTML: ${hasJsonLd && hasJobPostingSchema ? "✅ YES" : "❌ NO"}`);
        console.log(`   • Pure Client-Side SPA Placeholder?: ${isClientSpaOnly ? "❌ FAILED (Client-only)" : "✅ PASSED (Full SSR/SSG HTML)"}`);

        if (!hasH1 || !hasJobTitle || !hasJsonLd || isClientSpaOnly) {
          allPassed = false;
        }
      }
      console.log("");
    } catch (err) {
      console.error(`❌ Error fetching ${ep.url}:`, err.message);
      allPassed = false;
    }
  }

  console.log("=================================================");
  console.log(allPassed ? "🎉 ALL CRAWLER AUDIT CHECKS PASSED — 100% RAW SERVER-RENDERED CONTENT" : "⚠️ SOME CHECKS FAILED");
  console.log("=================================================");
}

testCrawlerView().catch(console.error);
