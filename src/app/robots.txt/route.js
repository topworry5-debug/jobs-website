export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin

# AI Search Engines & LLM Answer Engines
User-agent: GPTBot
Allow: /
Disallow: /admin

User-agent: ChatGPT-User
Allow: /
Disallow: /admin

User-agent: ClaudeBot
Allow: /
Disallow: /admin

User-agent: PerplexityBot
Allow: /
Disallow: /admin

User-agent: Google-Extended
Allow: /
Disallow: /admin

# Sitemaps
Sitemap: https://rozgar.pk/sitemap.xml
Host: https://rozgar.pk
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
