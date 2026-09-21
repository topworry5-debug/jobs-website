import React from 'react';
import { notFound } from 'next/navigation';
import PortalHubView from '../../components/PortalHubView';
import { PORTAL_HUBS_DATA, PORTAL_FILTERS } from '../../data/portalHubsData';
import { JOBS_DATA } from '../../data/jobsData';
import { getSiteUrl } from '../../utils/siteUrl';
import { generateItemListSchema, generateBreadcrumbSchema, generateFAQSchema } from '../../utils/seoHelpers';

const portalKey = 'punjab-job-portal';
const portal = PORTAL_HUBS_DATA[portalKey];

export const metadata = {
  title: portal.metaTitle,
  description: portal.metaDescription,
  alternates: {
    canonical: `${getSiteUrl()}/${portal.slug}`
  },
  openGraph: {
    title: portal.metaTitle,
    description: portal.metaDescription,
    url: `${getSiteUrl()}/${portal.slug}`,
    images: [{ url: `${getSiteUrl()}/og-image.png`, width: 1200, height: 630 }]
  }
};

export const revalidate = 60;

export default function PunjabJobPortalPage() {
  const siteUrl = getSiteUrl();
  const filterFn = PORTAL_FILTERS[portalKey] || (() => true);
  const filteredJobs = JOBS_DATA.filter(filterFn);
  const activeJobs = filteredJobs.filter(j => !j.archived_at);

  const itemListSchema = generateItemListSchema(activeJobs.slice(0, 25), siteUrl);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: portal.name, url: `${siteUrl}/${portal.slug}` }
  ]);
  const faqSchema = generateFAQSchema(portal.faqs || []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <PortalHubView 
        portal={portal} 
        jobs={filteredJobs} 
        siteUrl={siteUrl} 
      />
    </>
  );
}
