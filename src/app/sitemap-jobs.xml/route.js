import { JOBS_DATA } from '../../data/jobsData';
import { getSiteUrl } from '../../utils/siteUrl';
import { isJobOpen, isRecentlyClosed } from '../../lib/jobStatus';

export async function GET() {
  const baseUrl = getSiteUrl();
  const now = new Date().toISOString();
  // Include open jobs and recently closed jobs (last 30 days)
  const eligibleJobs = JOBS_DATA.filter(j => isJobOpen(j) || isRecentlyClosed(j, 30));

  const xmlUrls = eligibleJobs
    .map((job) => {
      let lastmod = now;
      if (job.postDate && /^\d{4}-\d{2}-\d{2}/.test(job.postDate)) {
        lastmod = `${job.postDate.slice(0, 10)}T00:00:00.000Z`;
      } else if (job.scrapedAt) {
        try {
          lastmod = new Date(job.scrapedAt).toISOString();
        } catch {
          lastmod = now;
        }
      }

      const isOpen = isJobOpen(job);
      const priority = isOpen ? (job.featured ? '0.95' : '0.85') : '0.6';
      const changefreq = isOpen ? 'daily' : 'weekly';
      const slug = job.slug || job.id;

      return `  <url>
    <loc>${baseUrl}/jobs/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
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
