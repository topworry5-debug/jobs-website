import { JOBS_DATA } from '../../data/jobsData';
import { getSiteUrl } from '../../utils/siteUrl';
import { isJobExpired } from '../../utils/jobStatus';

export async function GET() {
  const baseUrl = getSiteUrl();
  const now = new Date().toISOString();
  const activeJobs = JOBS_DATA.filter((j) => !isJobExpired(j));

  const xmlUrls = activeJobs
    .map((job) => {
      const lastmod = job.postDate ? `${job.postDate}T00:00:00.000Z` : now;
      const priority = job.featured ? '0.95' : '0.85';
      return `  <url>
    <loc>${baseUrl}/jobs/${job.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
