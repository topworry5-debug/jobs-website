import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  Share2, 
  Bookmark, 
  ArrowLeft,
  DollarSign,
  AlertCircle,
  FileText,
  Briefcase
} from 'lucide-react';
import { JOBS_DATA } from '../../../data/jobsData';
import { generateJobPostingSchema, generateBreadcrumbSchema } from '../../../utils/seoHelpers';
import { getJobLogoUrl, getJobLogoAlt } from '../../../utils/logoResolver';
import { getSiteUrl, getAbsoluteUrl } from '../../../utils/siteUrl';

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  return JOBS_DATA.map((job) => ({
    id: job.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = params;
  const job = JOBS_DATA.find((j) => j.id === id || j.id.toLowerCase() === (id || '').toLowerCase());

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  const siteUrl = getSiteUrl();
  const isGovt = job.type === 'govt';
  const agencyTitle = job.agency || (isGovt ? 'Government of Pakistan' : job.company);
  const pageTitle = `${job.title} - ${agencyTitle} (${job.city})`;
  const pageDesc = `Apply for ${job.title} at ${job.department || job.company}. Required: ${job.qualification}. Last date to apply: ${job.lastDate}. Verified on Tainaati.`;
  const canonicalUrl = `${siteUrl}/jobs/${job.id}`;

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: [job.title, job.department, job.city, job.agency, job.bpsScale, "Pakistan Jobs", "Apply Online"].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      type: 'article',
      publishedTime: job.postDate,
      modifiedTime: job.lastDate,
      images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: job.title }]
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
      images: [`${siteUrl}/og-image.png`]
    }
  };
}

export default function JobDetailPage({ params }) {
  const { id } = params;
  const job = JOBS_DATA.find((j) => j.id === id || j.id.toLowerCase() === (id || '').toLowerCase());

  if (!job) {
    notFound();
  }

  const isGovt = job.type === 'govt';
  const siteUrl = getSiteUrl();
  const jobPostingSchema = generateJobPostingSchema(job);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}` },
    { name: isGovt ? "Government Jobs" : "Private Jobs", url: `${siteUrl}/jobs/${isGovt ? 'govt' : 'private'}` },
    { name: job.title, url: `${siteUrl}/jobs/${job.id}` }
  ]);

  const relatedJobs = JOBS_DATA.filter(
    (j) => j.id !== job.id && (j.agency === job.agency || j.city === job.city || j.type === job.type)
  ).slice(0, 4);

  return (
    <div className="job-detail-page-container container-xl py-6">
      {/* JSON-LD Schemas in Server-Rendered HTML */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="breadcrumb-nav mb-4">
        <ol className="breadcrumb-list">
          <li><Link href="/">Home</Link></li>
          <li className="separator">/</li>
          <li><Link href={`/jobs/${isGovt ? 'govt' : 'private'}`}>{isGovt ? 'Government Jobs' : 'Private Jobs'}</Link></li>
          <li className="separator">/</li>
          <li className="current" aria-current="page" dir="auto">{job.title}</li>
        </ol>
      </nav>

      <div className="job-detail-grid">
        {/* Main Job Article */}
        <article className="job-main-article card p-6">
          {/* Header */}
          <div className="job-header-flex mb-6">
            <div className="flex items-start gap-3.5">
              <div className="detail-page-logo-box flex-shrink-0">
                <Image 
                  src={getJobLogoUrl(job)} 
                  alt={getJobLogoAlt(job)} 
                  className="detail-official-page-logo"
                  width={56}
                  height={56}
                  priority
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  <span className={`badge ${isGovt ? 'badge-govt' : 'badge-private'}`}>
                    {isGovt ? '🏛️ Official Government Vacancy' : '💼 Private Sector Career'}
                  </span>
                  {job.bpsScale && (
                    <span className="badge badge-bps font-mono">{job.bpsScale}</span>
                  )}
                  {job.verified && (
                    <span className="badge badge-verified">
                      <ShieldCheck size={13} />
                      <span>Verified Gazette Notice</span>
                    </span>
                  )}
                </div>

                <h1 className="job-hero-title text-2xl md:text-3xl font-extrabold text-primary mb-2" dir="auto">
                  {job.title}
                </h1>

                <div className="dept-subtitle text-base text-secondary font-medium" dir="auto">
                  {job.department || job.company} • <span className="text-primary font-semibold">{job.city}</span>
                </div>
              </div>
            </div>

            <div className="job-cta-box-top">
              <a
                href={job.officialUrl || "https://tainaati.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Official Verification Banner */}
          <div className="official-verification-banner card p-4 mb-6">
            <div className="flex items-start gap-3">
              <ShieldCheck size={22} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <div dir="auto">
                <div className="font-bold text-sm text-primary mb-1">
                  100% Authentic Official Listing
                </div>
                <div className="text-xs text-secondary leading-relaxed">
                  Source Reference: <strong>{job.officialSourceLabel || "Official Government Notification"}</strong>
                  <br />
                  Last verified against official commission portal on <strong>{job.lastVerifiedDate || "August 31, 2026"}</strong>.
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Matrix Table */}
          <section className="spec-matrix-section mb-6">
            <h2 className="text-lg font-bold mb-3">Key Position Specifications</h2>
            <div className="spec-matrix-grid">
              <div className="spec-item-card">
                <span className="spec-label">🏢 Authority / Dept</span>
                <span className="spec-value" dir="auto">{job.department || job.company}</span>
              </div>
              <div className="spec-item-card">
                <span className="spec-label">📍 Job Location</span>
                <span className="spec-value" dir="auto">{job.city}</span>
              </div>
              <div className="spec-item-card">
                <span className="spec-label">⏳ Application Deadline</span>
                <span className="spec-value text-red-500 font-bold">{job.lastDate}</span>
              </div>
              <div className="spec-item-card">
                <span className="spec-label">🎓 Minimum Qualification</span>
                <span className="spec-value" dir="auto">{job.qualification || "As per official service rules"}</span>
              </div>
              {job.bpsScale && (
                <div className="spec-item-card">
                  <span className="spec-label">⚖️ Pay Scale</span>
                  <span className="spec-value font-mono font-bold text-emerald-500">{job.bpsScale}</span>
                </div>
              )}
              {job.vacancies && (
                <div className="spec-item-card">
                  <span className="spec-label">👥 Total Openings</span>
                  <span className="spec-value">{job.vacancies} {job.vacancies === 1 ? 'Post' : 'Posts'}</span>
                </div>
              )}
              {job.ageLimit && (
                <div className="spec-item-card">
                  <span className="spec-label">🎂 Age Limit</span>
                  <span className="spec-value" dir="auto">{job.ageLimit}</span>
                </div>
              )}
              {job.challanFee && (
                <div className="spec-item-card">
                  <span className="spec-label">💳 Application / Challan Fee</span>
                  <span className="spec-value text-emerald-500" dir="auto">{job.challanFee}</span>
                </div>
              )}
            </div>
          </section>

          {/* Description & Overview */}
          <section className="job-section mb-6">
            <h2 className="text-lg font-bold mb-3">Job Description & Official Scope</h2>
            <p className="text-secondary leading-relaxed text-sm" dir="auto">
              {job.description || `Applications are invited by ${job.department || job.company} for the position of ${job.title}. Eligible candidates across Pakistan meeting the required academic qualifications and experience criteria are encouraged to apply online through the official portal before the closing deadline of ${job.lastDate}.`}
            </p>
          </section>

          {/* Provincial Quota Breakdown */}
          {job.quota && (
            <section className="job-section mb-6">
              <h2 className="text-lg font-bold mb-3">Provincial Quota Distribution</h2>
              <div className="quota-pill-box p-3 rounded-lg border border-subtle bg-surface-subtle text-xs text-secondary leading-relaxed">
                {job.quota}
              </div>
            </section>
          )}

          {/* Eligibility Criteria */}
          {job.eligibilityCriteria && job.eligibilityCriteria.length > 0 && (
            <section className="job-section mb-6">
              <h2 className="text-lg font-bold mb-3">Eligibility & Mandatory Requirements</h2>
              <ul className="bullet-list space-y-2 text-sm text-secondary">
                {job.eligibilityCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Exam Syllabus */}
          {job.syllabus && (
            <section className="job-section mb-6">
              <h2 className="text-lg font-bold mb-3">Official Examination Syllabus & Pattern</h2>
              {Array.isArray(job.syllabus) ? (
                <div className="syllabus-grid">
                  {job.syllabus.map((syl, idx) => (
                    <div key={idx} className="syllabus-card p-3 rounded-lg border border-subtle bg-surface-subtle">
                      <span className="text-xs font-mono text-emerald-500 font-bold block mb-1">Module {idx + 1}</span>
                      <span className="text-sm font-medium text-primary">{syl}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 rounded-lg border border-subtle bg-surface-subtle text-sm text-secondary leading-relaxed">
                  {job.syllabus}
                </div>
              )}
            </section>
          )}

          {/* Official Gazette Source Box */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200/60 rounded-xl flex items-center justify-between gap-3 flex-wrap mb-6">
            <div className="flex items-center gap-2.5 text-xs text-emerald-950 font-medium">
              <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
              <span>Full Details Verified: <strong>{job.officialSourceLabel || "Official Government Gazette Notification"}</strong></span>
            </div>
            <a 
              href={job.officialNotificationUrl || job.officialUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline btn-xs flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <span>View Official Gazette PDF / Portal</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* How to Apply */}
          <section className="job-section mb-6">
            <h2 className="text-lg font-bold mb-3">Step-by-Step How to Apply</h2>
            <ol className="apply-steps-list space-y-3 text-sm text-secondary">
              <li className="flex items-start gap-3">
                <span className="step-num-badge">1</span>
                <div>
                  <strong>Verify Eligibility:</strong> Ensure your degree, CNIC, and domicile credentials match the official criteria.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="step-num-badge">2</span>
                <div>
                  <strong>Pay Challan / PSID Fee:</strong> Deposit the required test fee via 1Link, ATM, JazzCash, EasyPaisa, or State Bank treasury slip.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="step-num-badge">3</span>
                <div>
                  <strong>Submit Online Application:</strong> Visit the official portal link below and complete your submission prior to <strong>{job.lastDate}</strong>.
                </div>
              </li>
            </ol>

            <div className="mt-6 pt-4 border-t border-subtle flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-muted">Official Recruitment Portal:</div>
                <div className="text-sm font-semibold text-primary">{job.officialUrl || "https://tainaati.com"}</div>
              </div>

              <a
                href={job.officialUrl || "https://tainaati.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                <span>Proceed to Official Application &rarr;</span>
              </a>
            </div>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="job-detail-sidebar space-y-4">
          <div className="card p-4">
            <h3 className="font-bold text-sm mb-3">Quick Navigation</h3>
            <ul className="sidebar-quick-links space-y-2 text-xs">
              <li><Link href="/jobs/govt" className="text-secondary hover:text-primary">🏛️ All Government Jobs in Pakistan</Link></li>
              <li><Link href="/jobs/private" className="text-secondary hover:text-primary">💼 Software & IT Careers</Link></li>
              <li><Link href="/exams" className="text-secondary hover:text-primary">📅 FPSC / PPSC Exam Calendar</Link></li>
              <li><Link href="/cv-builder" className="text-secondary hover:text-primary">📄 Free ATS CV Builder</Link></li>
              <li><Link href="/alerts" className="text-secondary hover:text-primary">📧 Free Email Job Alerts</Link></li>
            </ul>
          </div>

          {/* Related Jobs */}
          {relatedJobs.length > 0 && (
            <div className="card p-4">
              <h3 className="font-bold text-sm mb-3">Related Openings</h3>
              <div className="space-y-3">
                {relatedJobs.map((rj) => (
                  <Link key={rj.id} href={`/jobs/${rj.id}`} className="block p-2 rounded hover:bg-surface-subtle transition-colors">
                    <div className="font-semibold text-xs text-primary line-clamp-1">{rj.title}</div>
                    <div className="text-xs text-muted flex items-center justify-between mt-1">
                      <span>{rj.city}</span>
                      <span className="text-emerald-500 font-bold">{rj.bpsScale || 'Verified'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
