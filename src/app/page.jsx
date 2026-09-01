import React from 'react';
import Link from 'next/link';
import HeroSection from '../components/HeroSection';
import HomeClientFilter from '../components/HomeClientFilter';
import { JOBS_DATA } from '../data/jobsData';
import { EXAM_SCHEDULES } from '../data/examCalendarData';
import { generateItemListSchema } from '../utils/seoHelpers';
import { 
  ShieldCheck, 
  Landmark, 
  Building2, 
  Calendar, 
  BookOpen, 
  FileText, 
  ExternalLink,
  Award,
  Sparkles,
  TrendingUp
} from 'lucide-react';

import CommissionsBar from '../components/CommissionsBar';

export const metadata = {
  title: "RozgarPK — Verified Jobs in Pakistan (FPSC, PPSC, NTS & Tech Careers)",
  description: "Browse 60+ verified Federal & Provincial Government jobs (FPSC, PPSC, SPSC, KPPSC, NTS), high-growth tech careers, syllabus breakdown, and test preparation.",
  alternates: {
    canonical: "https://rozgar.pk"
  }
};

export const revalidate = 60;

export default function HomePage() {
  const itemListSchema = generateItemListSchema(JOBS_DATA.slice(0, 20), "https://rozgar.pk");

  const jobsCountMap = {
    FPSC: JOBS_DATA.filter(j => j.agency === 'FPSC').length,
    PPSC: JOBS_DATA.filter(j => j.agency === 'PPSC').length,
    SPSC: JOBS_DATA.filter(j => j.agency === 'SPSC').length,
    KPPSC: JOBS_DATA.filter(j => j.agency === 'KPPSC').length,
    NTS: JOBS_DATA.filter(j => j.agency === 'NTS').length,
  };

  return (
    <div className="homepage-wrapper">
      {/* ItemList Schema in Server-Rendered HTML */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero Section */}
      <HeroSection 
        jobs={JOBS_DATA}
        examSchedules={EXAM_SCHEDULES}
      />

      {/* Official Commissions Portal Fast-Track Grid */}
      <CommissionsBar jobsCountMap={jobsCountMap} />

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
