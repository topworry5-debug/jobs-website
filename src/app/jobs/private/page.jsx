import React from 'react';
import Link from 'next/link';
import HomeClientFilter from '../../../components/HomeClientFilter';
import { JOBS_DATA } from '../../../data/jobsData';
import { generateItemListSchema, generateBreadcrumbSchema } from '../../../utils/seoHelpers';
import { Building2, Sparkles, ShieldCheck, Landmark, ArrowRight } from 'lucide-react';

export const metadata = {
  title: "Private Sector & Corporate Jobs in Pakistan — RozgarPK",
  description: "Browse verified private sector and corporate career opportunities in Pakistan. Transparent compensation and verified employer listings.",
  alternates: {
    canonical: "https://rozgar.pk/jobs/private"
  }
};

export default function PrivateJobsPage() {
  const privateJobs = JOBS_DATA.filter((j) => j.type === 'private');
  const itemListSchema = generateItemListSchema(privateJobs, "https://rozgar.pk/jobs/private");
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://rozgar.pk" },
    { name: "Private & Corporate Jobs", url: "https://rozgar.pk/jobs/private" }
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
            <span>Strict Verification Guarantee</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">
          Private Sector & Corporate Jobs in Pakistan
        </h1>
        <p className="text-secondary text-sm max-w-3xl leading-relaxed">
          RozgarPK strictly lists verified opportunities. While our primary automated scrapers continuously monitor official public service commissions and testing services, corporate listings undergo thorough vetting before publication.
        </p>
      </div>

      {privateJobs.length > 0 ? (
        <HomeClientFilter 
          initialJobs={privateJobs}
          initialCategory="private"
        />
      ) : (
        <div className="card p-8 text-center bg-surface-subtle border border-subtle rounded-xl max-w-2xl mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Building2 size={24} />
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">
            No Private Sector Openings Listed Right Now
          </h2>
          <p className="text-sm text-secondary leading-relaxed mb-6">
            All currently active vacancies on RozgarPK are from verified Federal & Provincial Public Service Commissions (PPSC, SPSC, FPSC) and Testing Services (NTS). Private employer listings are published as new verified openings are confirmed.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/jobs/govt" className="btn btn-primary btn-sm flex items-center gap-1.5">
              <Landmark size={14} />
              <span>Explore Verified Govt Jobs ({JOBS_DATA.length})</span>
            </Link>
            <Link href="/exams" className="btn btn-outline btn-sm flex items-center gap-1.5">
              <span>View Exam Calendar</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
