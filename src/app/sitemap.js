import { JOBS_DATA } from '../data/jobsData';
import { CITY_LANDING_CONTENT, AGENCY_LANDING_CONTENT } from '../data/landingPagesData';

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
    '/alerts'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' || route.startsWith('/jobs') ? 'hourly' : 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Individual Job Pages
  const jobRoutes = JOBS_DATA.map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: job.postDate || lastModified,
    changeFrequency: 'daily',
    priority: job.featured ? 0.9 : 0.7,
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

  return [...staticRoutes, ...jobRoutes, ...cityRoutes, ...agencyRoutes];
}
