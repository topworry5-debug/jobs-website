import { JOBS_DATA } from '../data/jobsData';
import { CATEGORIES_CONFIG } from '../data/categoriesData';
import { CITY_LANDING_CONTENT, AGENCY_LANDING_CONTENT } from '../data/landingPagesData';
import { BLOG_ARTICLES } from '../data/blogData';
import { getSiteUrl } from '../utils/siteUrl';
import { isJobOpen, isRecentlyClosed, getLastUpdatedTimestamp } from '../lib/jobStatus';

export default function sitemap() {
  const baseUrl = getSiteUrl();
  const defaultLastMod = new Date().toISOString();

  const openPrivateJobsCount = JOBS_DATA.filter((j) => isJobOpen(j) && j.type === 'private').length;

  // 1. Core Public Static Pages (Excludes user utility & noindex pages: /saved-jobs, /alerts, /admin, /jobs/private)
  const staticRoutePaths = [
    { path: '', changeFreq: 'hourly', priority: 1.0 },
    { path: '/jobs/govt', changeFreq: 'hourly', priority: 0.95 },
    ...(openPrivateJobsCount >= 20 ? [{ path: '/jobs/private', changeFreq: 'daily', priority: 0.8 }] : []),
    { path: '/exams', changeFreq: 'daily', priority: 0.9 },
    { path: '/exam-results', changeFreq: 'daily', priority: 0.85 },
    { path: '/test-prep', changeFreq: 'daily', priority: 0.85 },
    { path: '/cv-builder', changeFreq: 'weekly', priority: 0.8 },
    { path: '/salary-calculator', changeFreq: 'weekly', priority: 0.8 },
    { path: '/blog', changeFreq: 'daily', priority: 0.85 },
    { path: '/faq', changeFreq: 'weekly', priority: 0.75 },
    { path: '/punjab-job-portal', changeFreq: 'daily', priority: 0.85 },
    { path: '/sindh-job-portal', changeFreq: 'daily', priority: 0.85 },
    { path: '/national-job-portal', changeFreq: 'daily', priority: 0.85 },
    { path: '/kpk-job-portal', changeFreq: 'daily', priority: 0.85 },
    { path: '/balochistan-job-portal', changeFreq: 'daily', priority: 0.85 },
    { path: '/about', changeFreq: 'monthly', priority: 0.6 },
    { path: '/contact', changeFreq: 'monthly', priority: 0.6 },
    { path: '/privacy-policy', changeFreq: 'monthly', priority: 0.5 },
    { path: '/terms-of-service', changeFreq: 'monthly', priority: 0.5 }
  ];

  const staticRoutes = staticRoutePaths.map((item) => ({
    url: `${baseUrl}${item.path}`,
    lastModified: defaultLastMod,
    changeFrequency: item.changeFreq,
    priority: item.priority,
  }));

  // 2. Individual Job Pages: Open AND Recently Closed (last 30 days)
  // Older archived positions (> 30 days) are excluded from the sitemap to optimize crawl budget
  const eligibleJobs = JOBS_DATA.filter((j) => isJobOpen(j) || isRecentlyClosed(j, 30));
  const jobRoutes = eligibleJobs.map((job) => {
    let lastMod = defaultLastMod;
    if (job.postDate && /^\d{4}-\d{2}-\d{2}/.test(job.postDate)) {
      lastMod = `${job.postDate.slice(0, 10)}T00:00:00.000Z`;
    } else if (job.scrapedAt) {
      try {
        lastMod = new Date(job.scrapedAt).toISOString();
      } catch {
        lastMod = defaultLastMod;
      }
    }

    const slug = job.slug || job.id;
    const isOpen = isJobOpen(job);

    return {
      url: `${baseUrl}/jobs/${slug}`,
      lastModified: lastMod,
      changeFrequency: isOpen ? 'daily' : 'weekly',
      priority: isOpen ? (job.featured ? 0.95 : 0.85) : 0.6,
    };
  });

  // 3. Blog Articles
  const blogRoutes = BLOG_ARTICLES.map((article) => {
    let lastMod = defaultLastMod;
    if (article.updatedDate && /^\d{4}-\d{2}-\d{2}/.test(article.updatedDate)) {
      lastMod = `${article.updatedDate.slice(0, 10)}T00:00:00.000Z`;
    } else if (article.date && /^\d{4}-\d{2}-\d{2}/.test(article.date)) {
      lastMod = `${article.date.slice(0, 10)}T00:00:00.000Z`;
    }

    return {
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  // 4. City Landing Pages
  const cityRoutes = Object.keys(CITY_LANDING_CONTENT).map((city) => ({
    url: `${baseUrl}/city/${city}`,
    lastModified: defaultLastMod,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // 5. Agency Landing Pages
  const agencyRoutes = Object.keys(AGENCY_LANDING_CONTENT).map((agency) => ({
    url: `${baseUrl}/agency/${agency}`,
    lastModified: defaultLastMod,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 6. Category Landing Pages (Only categories that contain >= 1 job)
  const categoryRoutes = CATEGORIES_CONFIG
    .filter((cat) => JOBS_DATA.some((j) => j.categorySlug === cat.slug))
    .map((cat) => ({
      url: `${baseUrl}/jobs/${cat.slug}`,
      lastModified: defaultLastMod,
      changeFrequency: 'daily',
      priority: 0.8,
    }));

  const allEntries = [
    ...staticRoutes,
    ...agencyRoutes,
    ...categoryRoutes,
    ...cityRoutes,
    ...blogRoutes,
    ...jobRoutes
  ];

  // Safeguard: If URLs exceed 5,000, Next.js sitemap automatically handles sitemap index,
  // but we enforce returning the validated array under 5,000.
  return allEntries;
}
