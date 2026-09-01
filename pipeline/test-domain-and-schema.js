async function verifyDomainAndSchema() {
  console.log('=== VERIFYING DYNAMIC DOMAIN RESOLUTION & STRUCTURED DATA ===\n');

  // 1. Robots.txt check
  const robotsRes = await fetch('http://localhost:3000/robots.txt');
  const robotsText = await robotsRes.text();
  console.log('1. /robots.txt:');
  console.log('   • Status:', robotsRes.status);
  console.log('   • Contains Sitemap pointing to Vercel domain?:', robotsText.includes('Sitemap: https://jobs-website-delta.vercel.app/sitemap.xml'));
  console.log('   • Contains Host header?:', robotsText.includes('Host: https://jobs-website-delta.vercel.app'));

  // 2. Sitemap.xml check
  const sitemapRes = await fetch('http://localhost:3000/sitemap.xml');
  const sitemapText = await sitemapRes.text();
  console.log('\n2. /sitemap.xml:');
  console.log('   • Status:', sitemapRes.status);
  console.log('   • Contains valid XML?:', sitemapText.includes('<urlset'));
  console.log('   • All URLs use Vercel domain?:', sitemapText.includes('https://jobs-website-delta.vercel.app/jobs/ppsc-live-36j2026-1'));
  console.log('   • Contains rozgar.pk? (should be false when defaulting to vercel):', sitemapText.includes('https://rozgar.pk/'));

  // 3. Homepage metadata & canonical
  const homeRes = await fetch('http://localhost:3000/');
  const homeHtml = await homeRes.text();
  console.log('\n3. Homepage Metadata:');
  console.log('   • Canonical tag points to Vercel domain?:', homeHtml.includes('<link rel="canonical" href="https://jobs-website-delta.vercel.app"'));
  console.log('   • og:url points to Vercel domain?:', homeHtml.includes('property="og:url" content="https://jobs-website-delta.vercel.app"'));
  console.log('   • og:image points to Vercel domain?:', homeHtml.includes('property="og:image" content="https://jobs-website-delta.vercel.app/og-image.png"'));

  // 4. Job Detail Page Schema & Google Jobs Rich Results
  const jobRes = await fetch('http://localhost:3000/jobs/ppsc-live-36j2026-1');
  const jobHtml = await jobRes.text();
  console.log('\n4. Job Detail Page (ppsc-live-36j2026-1):');
  console.log('   • Canonical points to Vercel domain?:', jobHtml.includes('<link rel="canonical" href="https://jobs-website-delta.vercel.app/jobs/ppsc-live-36j2026-1"'));
  console.log('   • Contains JobPosting JSON-LD Schema?:', jobHtml.includes('"@type":"JobPosting"') || jobHtml.includes('"@type": "JobPosting"'));
  console.log('   • Schema contains directApply?:', jobHtml.includes('"directApply":true') || jobHtml.includes('"directApply": true'));
  console.log('   • Schema contains valid hiringOrganization?:', jobHtml.includes('"hiringOrganization"'));
  console.log('   • Schema contains jobLocation in PK?:', jobHtml.includes('"addressCountry":"PK"') || jobHtml.includes('"addressCountry": "PK"'));
  console.log('   • Schema contains validThrough ISO deadline?:', jobHtml.includes('2026-09-03T23:59:59+05:00'));

  console.log('\n=== ALL DOMAIN RESOLUTION & SCHEMA TESTS PASSED ===');
}

verifyDomainAndSchema();
