import { getSiteUrl } from '../../utils/siteUrl';

export async function GET() {
  const baseUrl = getSiteUrl();

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin

# AI Search Engines & LLM Answer Engines
User-agent: GPTBot
Allow: /
Disallow: /admin
Disallow: /api/admin

User-agent: ChatGPT-User
Allow: /
Disallow: /admin
Disallow: /api/admin

User-agent: ClaudeBot
Allow: /
Disallow: /admin
Disallow: /api/admin

User-agent: PerplexityBot
Allow: /
Disallow: /admin
Disallow: /api/admin

User-agent: Google-Extended
Allow: /
Disallow: /admin
Disallow: /api/admin

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
