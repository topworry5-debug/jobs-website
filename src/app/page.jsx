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

export const metadata = {
  title: "RozgarPK — Verified Jobs in Pakistan (FPSC, PPSC, NTS & Tech Careers)",
  description: "Browse 60+ verified Federal & Provincial Government jobs (FPSC, PPSC, SPSC, KPPSC, NTS), high-growth tech careers, syllabus breakdown, and test preparation.",
  alternates: {
    canonical: "https://rozgar.pk"
  }
};

export default function HomePage() {
  const itemListSchema = generateItemListSchema(JOBS_DATA.slice(0, 20), "https://rozgar.pk");

  const officialAgencies = [
    { name: "FPSC Federal", sub: "General Recruitment & CSS", count: JOBS_DATA.filter(j => j.agency === 'FPSC').length, href: "/agency/fpsc", icon: Landmark },
    { name: "PPSC Punjab", sub: "Lecturers, Registrars & Admin", count: JOBS_DATA.filter(j => j.agency === 'PPSC').length, href: "/agency/ppsc", icon: Award },
    { name: "SPSC Sindh", sub: "Municipal & Civil Services", count: JOBS_DATA.filter(j => j.agency === 'SPSC').length, href: "/agency/spsc", icon: Landmark },
    { name: "KPPSC Khyber", sub: "Provincial Examination Cadre", count: JOBS_DATA.filter(j => j.agency === 'KPPSC').length, href: "/agency/kppsc", icon: Landmark },
    { name: "NTS Testing", sub: "Judiciary & Public Authorities", count: JOBS_DATA.filter(j => j.agency === 'NTS').length, href: "/agency/nts", icon: ShieldCheck }
  ];

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
      <section className="commissions-bar-section py-4 border-b border-subtle bg-surface-subtle">
        <div className="container-xl">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="font-bold text-xs uppercase tracking-wider text-primary">Official Public Service Commissions Monitored</span>
            </div>
            <span className="text-xs text-secondary">Updated Every 6 Hours with Direct Gazette Links</span>
          </div>

          <div className="commissions-cards-grid">
            {officialAgencies.map((agency) => {
              const Icon = agency.icon;
              return (
                <Link key={agency.name} href={agency.href} className="commission-card-item">
                  <div className="flex items-center gap-3">
                    <div className="dept-icon-circle govt-bg">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-primary">{agency.name}</h3>
                      <div className="text-xs text-muted">{agency.sub}</div>
                    </div>
                  </div>
                  <span className="badge badge-bps text-xs font-mono">{agency.count} Active</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

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
