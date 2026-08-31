import React from 'react';
import Link from 'next/link';
import HomeClientFilter from '../../../components/HomeClientFilter';
import { JOBS_DATA } from '../../../data/jobsData';
import { generateItemListSchema, generateBreadcrumbSchema } from '../../../utils/seoHelpers';
import { Building2, Sparkles, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: "Private & IT Jobs in Pakistan (Software, Fintech & Engineering)",
  description: "Browse high-paying tech and private sector jobs in Lahore, Karachi, Islamabad and Remote. Transparent salaries, vetted engineering teams.",
  alternates: {
    canonical: "https://rozgar.pk/jobs/private"
  }
};

export default function PrivateJobsPage() {
  const privateJobs = JOBS_DATA.filter((j) => j.type === 'private');
  const itemListSchema = generateItemListSchema(privateJobs, "https://rozgar.pk/jobs/private");
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://rozgar.pk" },
    { name: "Private & IT Jobs", url: "https://rozgar.pk/jobs/private" }
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
            <span>High-Growth Tech & Private Sector</span>
          </span>
          <span className="badge badge-verified">
            <ShieldCheck size={13} />
            <span>Vetted Employers</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">
          Private Sector & IT Jobs in Pakistan
        </h1>
        <p className="text-secondary text-sm max-w-3xl leading-relaxed">
          High-growth career opportunities in Software Engineering, Product Management, Fintech, and Digital Operations. Transparent compensation ranges, vetted work cultures, and direct recruiter application paths.
        </p>
      </div>

      <HomeClientFilter 
        initialJobs={privateJobs}
        initialCategory="private"
      />
    </div>
  );
}
