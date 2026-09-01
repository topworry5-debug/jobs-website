import React from 'react';
import Link from 'next/link';
import HomeClientFilter from '../../../components/HomeClientFilter';
import { JOBS_DATA } from '../../../data/jobsData';
import { generateItemListSchema, generateBreadcrumbSchema } from '../../../utils/seoHelpers';
import { Landmark, ShieldCheck } from 'lucide-react';
import { getSiteUrl } from '../../../utils/siteUrl';

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Government Jobs in Pakistan 2026 (FPSC, PPSC, SPSC, KPPSC & NTS)",
  description: "Explore all verified Federal & Provincial Government jobs in Pakistan. BPS-07 to BPS-20 scales with official syllabus, challan info, and verified direct links.",
  alternates: {
    canonical: `${siteUrl}/jobs/govt`
  },
  openGraph: {
    title: "Government Jobs in Pakistan 2026 (FPSC, PPSC, SPSC, KPPSC & NTS)",
    description: "Explore all verified Federal & Provincial Government jobs in Pakistan.",
    url: `${siteUrl}/jobs/govt`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function GovtJobsPage() {
  const currentUrl = getSiteUrl();
  const govtJobs = JOBS_DATA.filter((j) => j.type === 'govt');
  const itemListSchema = generateItemListSchema(govtJobs, `${currentUrl}/jobs/govt`);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${currentUrl}` },
    { name: "Government Jobs", url: `${currentUrl}/jobs/govt` }
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
          <span className="badge badge-govt">
            <Landmark size={13} />
            <span>Public Sector Intelligence</span>
          </span>
          <span className="badge badge-verified">
            <ShieldCheck size={13} />
            <span>100% Gazette Verified</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">
          Government Jobs in Pakistan 2026
        </h1>
        <p className="text-secondary text-sm max-w-3xl leading-relaxed">
          Comprehensive, real-time index of active gazette advertisements from the Federal Public Service Commission (FPSC), Punjab Public Service Commission (PPSC), Sindh Public Service Commission (SPSC), Khyber Pakhtunkhwa Public Service Commission (KPPSC), and National Testing Service (NTS).
        </p>
      </div>

      <HomeClientFilter 
        initialJobs={govtJobs}
        initialCategory="govt"
      />
    </div>
  );
}
