import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HomeClientFilter from '../../../components/HomeClientFilter';
import { JOBS_DATA } from '../../../data/jobsData';
import { AGENCY_LANDING_CONTENT } from '../../../data/landingPagesData';
import { generateItemListSchema, generateBreadcrumbSchema } from '../../../utils/seoHelpers';
import { Landmark, ShieldCheck, ExternalLink, Award, FileText } from 'lucide-react';
import { getSiteUrl } from '../../../utils/siteUrl';

export async function generateStaticParams() {
  const agencySlugs = Object.keys(AGENCY_LANDING_CONTENT);
  return agencySlugs.map((agency) => ({
    agency,
  }));
}

export async function generateMetadata({ params }) {
  const { agency } = params;
  const content = AGENCY_LANDING_CONTENT[agency.toLowerCase()];
  const siteUrl = getSiteUrl();

  if (!content) {
    return {
      title: `${agency.toUpperCase()} Jobs 2026`,
      description: `Official ${agency.toUpperCase()} recruitment advertisements and syllabus.`
    };
  }

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `${siteUrl}/agency/${agency}`
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: `${siteUrl}/agency/${agency}`,
      images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
    }
  };
}

export default function AgencyLandingPage({ params }) {
  const { agency } = params;
  const agencyKey = agency.toLowerCase();
  const siteUrl = getSiteUrl();
  const content = AGENCY_LANDING_CONTENT[agencyKey] || {
    agencyCode: agency.toUpperCase(),
    fullName: `${agency.toUpperCase()} Public Service Commission`,
    h1: `${agency.toUpperCase()} Jobs 2026 & Application Gateway`,
    tagline: `Track official advertisements, gazette notices, and syllabus for ${agency.toUpperCase()}.`,
    officialPortalUrl: "https://online.fpsc.gov.pk",
    challanGuide: "Deposit challan fee at designated bank branches prior to online submission."
  };

  // Filter jobs for this agency
  const agencyJobs = JOBS_DATA.filter((j) => {
    const code = agencyKey.toUpperCase();
    return (j.agency || '').toUpperCase() === code || (j.category || '').toUpperCase().includes(code);
  });

  const itemListSchema = generateItemListSchema(agencyJobs, `${siteUrl}/agency/${agency}`);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}` },
    { name: "Public Service Commissions", url: `${siteUrl}/jobs/govt` },
    { name: content.agencyCode, url: `${siteUrl}/agency/${agency}` }
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
        <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="badge badge-govt">
              <Landmark size={13} />
              <span>{content.agencyCode} Portal</span>
            </span>
            <span className="badge badge-verified">
              <ShieldCheck size={13} />
              <span>{agencyJobs.length} Live Openings</span>
            </span>
          </div>

          <a
            href={content.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <span>Official Commission Portal</span>
            <ExternalLink size={14} />
          </a>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">
          {content.h1}
        </h1>
        <p className="text-secondary text-sm max-w-3xl leading-relaxed mb-4">
          {content.tagline}
        </p>

        {/* Challan & Fee Advisory Card */}
        {content.challanGuide && (
          <div className="p-3 rounded-lg border border-subtle bg-surface-subtle text-xs text-secondary leading-relaxed flex items-start gap-2">
            <FileText size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-primary block">Fee Deposit & Application Advisory:</strong>
              {content.challanGuide}
            </div>
          </div>
        )}
      </div>

      <HomeClientFilter 
        initialJobs={agencyJobs}
        initialCategory={agencyKey}
      />
    </div>
  );
}
