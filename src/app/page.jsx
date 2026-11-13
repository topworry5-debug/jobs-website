import React from 'react';
import HeroSection from '../components/HeroSection';
import HomeClientFilter from '../components/HomeClientFilter';
import HomeTeasers from '../components/HomeTeasers';
import { JOBS_DATA } from '../data/jobsData';
import { EXAM_SCHEDULES } from '../data/examCalendarData';
import { generateItemListSchema, generateOrganizationSchema, generateWebSiteSchema } from '../utils/seoHelpers';
import { computeJobMetrics } from '../utils/jobMetrics';
import { getLastUpdatedTimestamp, partitionJobs } from '../lib/jobStatus';
import { getSiteUrl } from '../utils/siteUrl';

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Government Jobs in Pakistan (FPSC, PPSC, SPSC, KPPSC, BPSC & NTS)",
  description: "Browse Federal & Provincial Government jobs (FPSC, PPSC, SPSC, KPPSC, BPSC, NTS), gazette syllabus breakdowns, exam schedules, and test preparation.",
  alternates: {
    canonical: siteUrl
  },
  openGraph: {
    title: "Government Jobs in Pakistan (FPSC, PPSC, SPSC, KPPSC, BPSC & NTS)",
    description: "Browse Federal & Provincial Government jobs (FPSC, PPSC, SPSC, KPPSC, BPSC, NTS), gazette syllabus breakdowns, and exam schedules.",
    url: siteUrl,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export const revalidate = 60;

export default function HomePage() {
  const currentUrl = getSiteUrl();
  const { openJobs } = partitionJobs(JOBS_DATA, 30);
  const itemListSchema = generateItemListSchema(openJobs.slice(0, 20), currentUrl);
  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();
  const metrics = computeJobMetrics(JOBS_DATA, EXAM_SCHEDULES);
  const lastUpdated = getLastUpdatedTimestamp(JOBS_DATA);

  // Accurate agency open counts
  const agencyCounts = {
    FPSC: openJobs.filter(j => (j.agency || '').toUpperCase() === 'FPSC').length,
    PPSC: openJobs.filter(j => (j.agency || '').toUpperCase() === 'PPSC').length,
    SPSC: openJobs.filter(j => (j.agency || '').toUpperCase() === 'SPSC').length,
    KPPSC: openJobs.filter(j => (j.agency || '').toUpperCase() === 'KPPSC').length,
    BPSC: openJobs.filter(j => (j.agency || '').toUpperCase() === 'BPSC').length,
    NTS: openJobs.filter(j => (j.agency || '').toUpperCase() === 'NTS').length,
  };

  return (
    <div className="homepage-root">
      {/* JSON-LD Schemas in Server-Rendered HTML */}
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />

      {/* 1. Compact Hero (Max ~320px tall on desktop) with Agency Chips & Slim Info Line */}
      <HeroSection 
        openCount={openJobs.length}
        closingSoonCount={metrics.urgentCount}
        lastUpdated={lastUpdated}
        agencyCounts={agencyCounts}
      />

      {/* 2. Main Job Listings Immediately (List-First Structure) */}
      <main className="container-xl homepage-main-content" id="job-listings">
        <HomeClientFilter 
          initialJobs={JOBS_DATA}
          initialCategory="all"
        />

        {/* 3. Secondary Teasers: Exam Calendar, Test Prep, Alerts, Latest Guides */}
        <HomeTeasers examSchedules={EXAM_SCHEDULES} />
      </main>
    </div>
  );
}
