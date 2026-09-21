import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HomeClientFilter from '../../../components/HomeClientFilter';
import { JOBS_DATA } from '../../../data/jobsData';
import { AGENCY_LANDING_CONTENT } from '../../../data/landingPagesData';
import { generateItemListSchema, generateBreadcrumbSchema, generateFAQSchema } from '../../../utils/seoHelpers';
import { Landmark, ShieldCheck, ExternalLink, Award, FileText, CheckCircle2, BookOpen, Clock, HelpCircle, AlertCircle } from 'lucide-react';
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
  const faqSchema = content.faqs && content.faqs.length > 0 ? generateFAQSchema(content.faqs) : null;

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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

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

        {/* Quotable 2-Sentence Definition Block (GEO / AEO) */}
        {content.quotableDefinition && (
          <div className="p-4 mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs sm:text-sm text-secondary leading-relaxed">
            <strong className="text-primary font-bold block mb-1">What is {content.fullName} ({content.agencyCode})?</strong>
            <p className="m-0 text-secondary">{content.quotableDefinition}</p>
          </div>
        )}

        {/* Challan & Fee Advisory Card */}
        {content.challanGuide && (
          <div className="p-3 rounded-lg border border-subtle bg-surface-subtle text-xs text-secondary leading-relaxed flex items-start gap-2.5">
            <FileText size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <div className="label-caption-group">
              <strong className="text-primary font-semibold block">Fee Deposit & Application Advisory:</strong>
              <span className="text-secondary text-xs block">{content.challanGuide}</span>
            </div>
          </div>
        )}

        {/* Live Zero-Vacancy Official Advisory */}
        {agencyJobs.length === 0 && (
          <div className="p-4 mt-4 rounded-xl border border-emerald-900/30 bg-emerald-950/20 text-xs text-secondary flex items-start gap-3">
            <ShieldCheck size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300 font-semibold text-sm block mb-1">
                Official Commission Status: No Active Advertisements Currently Open
              </strong>
              <p className="leading-relaxed">
                Direct monitoring of {content.agencyCode} confirms that the previous recruitment advertisement has closed, and the Commission has not yet released its next consolidated gazette. As soon as {content.agencyCode} gazettes new vacancies, Tainaati will ingest them automatically.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Jobs Listing & Interactive Filter */}
      <HomeClientFilter 
        initialJobs={agencyJobs}
        initialCategory={agencyKey}
      />

      {/* Recruitment Guide, Syllabus & Rules Section */}
      <div className="mt-10 space-y-6">
        {content.recruitmentProcess && (
          <section className="card p-6">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <span>How Recruitment Works Through {content.agencyCode}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.recruitmentProcess.map((step, sIdx) => (
                <div key={sIdx} className="p-4 rounded-lg border border-subtle bg-surface-subtle">
                  <h3 className="font-bold text-sm text-primary mb-1.5">{step.step}</h3>
                  <p className="text-xs text-secondary leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.syllabusOverview && (
            <section className="card p-6">
              <h2 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-emerald-500" />
                <span>Scheme of Examination & Syllabus Pattern</span>
              </h2>
              <p className="text-xs text-secondary leading-relaxed">
                {content.syllabusOverview}
              </p>
            </section>
          )}

          {content.ageRelaxationPolicy && (
            <section className="card p-6">
              <h2 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                <Clock size={18} className="text-emerald-500" />
                <span>Official Age Relaxation Rules</span>
              </h2>
              <p className="text-xs text-secondary leading-relaxed">
                {content.ageRelaxationPolicy}
              </p>
            </section>
          )}
        </div>

        {/* FAQs */}
        {content.faqs && content.faqs.length > 0 && (
          <section className="card p-6">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <HelpCircle size={20} className="text-emerald-500" />
              <span>Frequently Asked Questions About {content.agencyCode}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.faqs.map((faq, fIdx) => (
                <div key={fIdx} className="p-4 rounded-lg border border-subtle bg-surface-subtle">
                  <h3 className="font-bold text-sm text-primary mb-1.5">{faq.question}</h3>
                  <p className="text-xs text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
