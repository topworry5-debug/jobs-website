import { getSiteUrl } from '../../utils/siteUrl';
import { CATEGORIES_CONFIG } from '../../data/categoriesData';
import { CITY_LANDING_CONTENT, AGENCY_LANDING_CONTENT } from '../../data/landingPagesData';

export async function GET() {
  const baseUrl = getSiteUrl();
  const now = new Date().toISOString();

  // Category pages
  const catXml = CATEGORIES_CONFIG
    .map((c) => `  <url>
    <loc>${baseUrl}/jobs/${c.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.85</priority>
  </url>`)
    .join('\n');

  // Agency hubs
  const agencyXml = Object.keys(AGENCY_LANDING_CONTENT)
    .map((a) => `  <url>
    <loc>${baseUrl}/agency/${a}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>`)
    .join('\n');

  // City hubs
  const cityXml = Object.keys(CITY_LANDING_CONTENT)
    .map((c) => `  <url>
    <loc>${baseUrl}/city/${c}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${catXml}
${agencyXml}
${cityXml}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
