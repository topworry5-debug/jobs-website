async function verifyVercel() {
  const baseUrl = process.env.BASE_URL || "https://tainaati.com";
  console.log("=================================================");
  console.log("Checking Live Production Deployment");
  console.log(`URL: ${baseUrl}`);
  console.log("=================================================\n");

  const endpoints = [
    { name: "Homepage", path: "/" },
    { name: "Govt Jobs", path: "/jobs/govt" },
    { name: "Job Detail", path: "/jobs/govt-fpsc-01" },
    { name: "Exam Calendar", path: "/exams" },
    { name: "Test Prep", path: "/test-prep" },
    { name: "CV Builder", path: "/cv-builder" },
    { name: "Alerts", path: "/alerts" }
  ];

  for (const ep of endpoints) {
    const url = baseUrl + ep.path;
    const res = await fetch(url);
    const html = await res.text();
    console.log(`[${res.status}] ${ep.name} (${url}) — Payload: ${html.length} bytes`);
    
    // Check CSS link tags
    const cssMatches = [...html.matchAll(/href="(\/_next\/static\/css\/[^"]+)"/g)].map(m => m[1]);
    console.log(`   • Stylesheet tags found: ${cssMatches.length} (${cssMatches.join(', ')})`);
    
    // Check if HTML has rendered classes
    const hasCards = html.includes('job-card-item') || html.includes('portal-footer') || html.includes('page-category-hero') || html.includes('cv-builder-container') || html.includes('test-prep-hub');
    console.log(`   • Semantic styled structure: ${hasCards ? '✅ PRESENT' : '❌ MISSING'}`);
  }

  // Fetch actual CSS stylesheets
  const homeRes = await fetch(baseUrl + "/");
  const homeHtml = await homeRes.text();
  const cssMatches = [...homeHtml.matchAll(/href="(\/_next\/static\/css\/[^"]+)"/g)].map(m => m[1]);
  
  console.log("\n=== Checking Live CSS Bundles ===");
  for (const cssPath of cssMatches) {
    const cssRes = await fetch(baseUrl + cssPath);
    const cssText = await cssRes.text();
    console.log(`✅ [${cssRes.status}] ${cssPath} — Size: ${cssText.length} bytes`);
  }
}

verifyVercel().catch(console.error);
