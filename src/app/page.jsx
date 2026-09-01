import React from 'react';
import HeroSection from '../components/HeroSection';
import HomeClientFilter from '../components/HomeClientFilter';
import CommissionsBar from '../components/CommissionsBar';
import { JOBS_DATA } from '../data/jobsData';
import { EXAM_SCHEDULES } from '../data/examCalendarData';
import { generateItemListSchema } from '../utils/seoHelpers';
import { computeJobMetrics } from '../utils/jobMetrics';

export const metadata = {
  title: "RozgarPK — Verified Jobs in Pakistan (FPSC, PPSC, SPSC, KPPSC & NTS)",
  description: "Browse verified Federal & Provincial Government jobs (FPSC, PPSC, SPSC, KPPSC, NTS), gazette syllabus breakdowns, exam schedules, and test preparation.",
  alternates: {
    canonical: "https://rozgar.pk"
  }
};

export const revalidate = 60;

export default function HomePage() {
  const itemListSchema = generateItemListSchema(JOBS_DATA.slice(0, 20), "https://rozgar.pk");
  const metrics = computeJobMetrics(JOBS_DATA, EXAM_SCHEDULES);

  return (
    <div className="homepage-wrapper">
      {/* ItemList Schema in Server-Rendered HTML */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero Section with Dynamic Single Source-of-Truth Metrics */}
      <HeroSection 
        jobs={JOBS_DATA}
        examSchedules={EXAM_SCHEDULES}
      />

      {/* Official Commissions Portal Fast-Track Grid */}
      <CommissionsBar jobsCountMap={metrics.agencyCounts} />

      {/* Main Jobs Listing & Interactive Filter Matrix */}
      <main className="container-xl py-6" id="job-listings">
        <HomeClientFilter 
          initialJobs={JOBS_DATA}
          initialCategory="all"
        />
      </main>
    </div>
  );
}
