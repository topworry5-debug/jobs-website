import { JOBS_DATA } from '../data/jobsData';
import { CITY_LANDING_CONTENT, AGENCY_LANDING_CONTENT } from '../data/landingPagesData';
import { BLOG_ARTICLES } from '../data/blogData';

export default function sitemap() {
  const baseUrl = 'https://rozgar.pk';
  const lastModified = new Date().toISOString();

  // Core Static Pages
  const staticRoutes = [
    '',
    '/jobs/govt',
    '/jobs/private',
    '/exams',
    '/test-prep',
    '/cv-builder',
    '/alerts',
    '/blog',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' || route.startsWith('/jobs') ? 'hourly' : 'daily',
    priority: route === '' ? 1.0 : (route === '/blog' ? 0.9 : (route === '/about' || route === '/contact' || route.startsWith('/privacy') || route.startsWith('/terms') ? 0.6 : 0.8)),
  }));

  // Individual Job Pages
  const jobRoutes = JOBS_DATA.map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: job.postDate || lastModified,
    changeFrequency: 'daily',
    priority: job.featured ? 0.9 : 0.7,
  }));

  // Blog / Career Guides Pages
  const blogRoutes = BLOG_ARTICLES.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.updatedDate || lastModified,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // City Landing Pages
  const cityRoutes = Object.keys(CITY_LANDING_CONTENT).map((city) => ({
    url: `${baseUrl}/city/${city}`,
    lastModified,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Agency Landing Pages
  const agencyRoutes = Object.keys(AGENCY_LANDING_CONTENT).map((agency) => ({
    url: `${baseUrl}/agency/${agency}`,
    lastModified,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticRoutes, ...jobRoutes, ...blogRoutes, ...cityRoutes, ...agencyRoutes];
}
