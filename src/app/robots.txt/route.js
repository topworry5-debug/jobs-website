import { getSiteUrl } from '../../utils/siteUrl';

export async function GET() {
  const baseUrl = getSiteUrl();

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /saved-jobs
Disallow: /alerts
Disallow: /*?*

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Host: ${baseUrl}
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
