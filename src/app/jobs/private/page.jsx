import React from 'react';
import Link from 'next/link';
import HomeClientFilter from '../../../components/HomeClientFilter';
import { JOBS_DATA } from '../../../data/jobsData';
import { filterOpenJobs } from '../../../lib/jobStatus';
import { generateItemListSchema, generateBreadcrumbSchema } from '../../../utils/seoHelpers';
import { Building2, Sparkles, ShieldCheck, Landmark, ArrowRight } from 'lucide-react';
import { getSiteUrl } from '../../../utils/siteUrl';

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Private Sector & Corporate Jobs in Pakistan",
  description: "Browse private sector and corporate career opportunities in Pakistan. Transparent compensation and employer listings.",
  robots: {
    index: false,
    follow: true
  },
  alternates: {
    canonical: `${siteUrl}/jobs/private`
  },
  openGraph: {
    title: "Private Sector & Corporate Jobs in Pakistan",
    description: "Browse private sector and corporate career opportunities in Pakistan.",
    url: `${siteUrl}/jobs/private`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function PrivateJobsPage() {
  const currentUrl = getSiteUrl();
  const privateJobs = JOBS_DATA.filter((j) => j.type === 'private');
  const openPrivateJobs = filterOpenJobs(privateJobs);
  const itemListSchema = generateItemListSchema(openPrivateJobs.slice(0, 20), `${currentUrl}/jobs/private`);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${currentUrl}` },
    { name: "Private & Corporate Jobs", url: `${currentUrl}/jobs/private` }
  ]);

  return (
    <div className="container-xl py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Header */}
      <div className="page-category-hero card p-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-private">
            <Sparkles size={13} />
            <span>Corporate & Private Opportunities</span>
          </span>
          <span className="badge badge-verified">
            <ShieldCheck size={13} />
            {openPrivateJobs.length > 0 ? (
              <span>{openPrivateJobs.length} Active Openings</span>
            ) : (
              <span>Archived Notices</span>
            )}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">
          Private Sector & Corporate Jobs in Pakistan
        </h1>
        <p className="text-secondary text-sm max-w-3xl leading-relaxed">
          Tainaati strictly lists verified opportunities. While our primary automated scrapers continuously monitor official public service commissions and testing services, corporate listings undergo thorough vetting before publication.
        </p>
      </div>

      <HomeClientFilter 
        initialJobs={privateJobs}
        initialCategory="private"
      />
    </div>
  );
}
