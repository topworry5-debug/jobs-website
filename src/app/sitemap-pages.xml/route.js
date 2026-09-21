import { getSiteUrl } from '../../utils/siteUrl';
import { BLOG_ARTICLES } from '../../data/blogData';

export async function GET() {
  const baseUrl = getSiteUrl();
  const now = new Date().toISOString();

  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/jobs/govt', priority: '0.9', changefreq: 'daily' },
    { path: '/jobs/private', priority: '0.85', changefreq: 'daily' },
    { path: '/exams', priority: '0.85', changefreq: 'daily' },
    { path: '/test-prep', priority: '0.8', changefreq: 'weekly' },
    { path: '/cv-builder', priority: '0.8', changefreq: 'weekly' },
    { path: '/salary-calculator', priority: '0.8', changefreq: 'monthly' },
    { path: '/exam-results', priority: '0.8', changefreq: 'daily' },
    { path: '/alerts', priority: '0.75', changefreq: 'monthly' },
    { path: '/blog', priority: '0.9', changefreq: 'daily' },
    { path: '/faq', priority: '0.85', changefreq: 'weekly' },
    { path: '/about', priority: '0.6', changefreq: 'monthly' },
    { path: '/contact', priority: '0.6', changefreq: 'monthly' },
    { path: '/privacy-policy', priority: '0.5', changefreq: 'monthly' },
    { path: '/terms-of-service', priority: '0.5', changefreq: 'monthly' }
  ];

  const staticXml = staticPages
    .map((p) => `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`)
    .join('\n');

  const blogXml = BLOG_ARTICLES
    .map((b) => `  <url>
    <loc>${baseUrl}/blog/${b.slug}</loc>
    <lastmod>${b.updatedDate ? `${b.updatedDate}T00:00:00.000Z` : now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${blogXml}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
