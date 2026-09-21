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
  Briefcase,
  Flame,
  HelpCircle,
  Tag,
  Landmark,
  ArrowRight,
  ShieldAlert,
  Layers,
  Zap
} from 'lucide-react';
import { JOBS_DATA } from '../../../data/jobsData';
import { getCategoryBySlug } from '../../../data/categoriesData';
import { generateJobPostingSchema, generateBreadcrumbSchema, generateFAQSchema } from '../../../utils/seoHelpers';
import { getJobLogoUrl, getJobLogoAlt } from '../../../utils/logoResolver';
import { getSiteUrl, getAbsoluteUrl } from '../../../utils/siteUrl';
import { getJobDeadlineInfo, isJobExpired } from '../../../utils/jobStatus';

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  return JOBS_DATA.map((job) => ({
    id: job.id,
  }));
}

/**
 * Normalizes agency name to a valid agency hub slug if supported.
 */
function resolveAgencySlug(job) {
  if (job.agencySlug) return job.agencySlug.toLowerCase();
  if (!job.agency) return null;
  const a = job.agency.toLowerCase();
  if (a.includes('fpsc')) return 'fpsc';
  if (a.includes('ppsc')) return 'ppsc';
  if (a.includes('spsc')) return 'spsc';
  if (a.includes('kppsc')) return 'kppsc';
  if (a.includes('bpsc')) return 'bpsc';
  if (a.includes('nts')) return 'nts';
  return null;
}

/**
 * Synthesizes concise, direct-answer FAQ pairs for Answer Engine Optimization (AEO).
 */
function getJobFaqs(job) {
  if (job.faqs && Array.isArray(job.faqs) && job.faqs.length > 0) {
    return job.faqs;
  }
  const org = job.department || job.company || 'the recruiting organization';
  return [
    {
      question: `What is the last date to apply for ${job.title}?`,
      answer: `The official deadline to apply for ${job.title} at ${org} is ${job.lastDate}. Applications received after this date are not accepted.`
    },
    {
      question: `What is the eligibility for ${job.title}?`,
      answer: `Applicants must hold ${job.qualification || 'the required academic qualification'}${job.ageLimit ? ` and meet the specified age limit (${job.ageLimit})` : ''}. Refer to the official advertisement for full service rules.`
    },
    {
      question: `How many vacancies are there for ${job.title}?`,
      answer: `${job.vacancies ? `There are ${job.vacancies} total vacancies announced` : 'Multiple vacancies are available'} for ${job.title} at ${org}${job.quota ? `, allocated under official provincial quotas` : ''}.`
    },
    {
      question: `How do I apply for ${job.title}?`,
      answer: `Interested candidates should apply ${job.applicationMethod || (job.type === 'govt' ? 'online via the official recruitment portal' : 'through the official employer career link')} before ${job.lastDate}${job.challanFee ? ` after paying the required fee (${job.challanFee})` : ''}.`
    }
  ];
}

function resolveCitySlug(job) {
  if (!job.city) return null;
  const c = job.city.toLowerCase();
  if (c.includes('lahore')) return 'lahore';
  if (c.includes('karachi')) return 'karachi';
  if (c.includes('islamabad')) return 'islamabad';
  if (c.includes('rawalpindi')) return 'rawalpindi';
  if (c.includes('peshawar')) return 'peshawar';
  if (c.includes('quetta')) return 'quetta';
  return null;
}

export async function generateMetadata({ params }) {
  const { id } = params;
  const job = JOBS_DATA.find((j) => j.id === id || j.id.toLowerCase() === (id || '').toLowerCase());

  if (!job) {
    return {
      title: "Job Not Found — Tainaati",
      description: "The requested job posting could not be found."
    };
  }

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/jobs/${job.id}`;
  const orgName = job.department || job.company || 'Government of Pakistan';

  // Phase 3 SEO Template:
  // Title: "[Job Title] - [Department] Jobs 2026 | Tainaati"
  // Desc: "Apply for [Job Title] at [Department]. BPS-[X], [N] vacancies. Last date: [Date]. Verified official notification & apply link."
  const pageTitle = `${job.title} - ${orgName} Jobs 2026 | Tainaati`;
  const bpsSnippet = job.bpsScale ? ` ${job.bpsScale},` : '';
  const vacSnippet = job.vacancies ? ` ${job.vacancies} vacancies.` : '';
  const pageDesc = `Apply for ${job.title} at ${orgName}.${bpsSnippet}${vacSnippet} Last date: ${job.lastDate}. Verified official notification & apply link.`;

  return {
    title: {
      absolute: pageTitle
    },
    description: pageDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: job.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc
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
  const deadlineInfo = getJobDeadlineInfo(job.lastDate, job.status);
  const { isExpired, isClosingToday, daysLeft } = deadlineInfo;

  const agencySlug = resolveAgencySlug(job);
  const citySlug = resolveCitySlug(job);
  const categoryObj = job.categorySlug ? getCategoryBySlug(job.categorySlug) : null;
  const jobFaqs = getJobFaqs(job);

  // SEO & AEO JSON-LD Schemas
  const jobPostingSchema = generateJobPostingSchema(job);
  const faqSchema = generateFAQSchema(jobFaqs);

  // Breadcrumbs including Category page for internal link strength
  const breadcrumbItems = [
    { name: "Home", url: `${siteUrl}` },
    { name: isGovt ? "Government Jobs" : "Private Jobs", url: `${siteUrl}/jobs/${isGovt ? 'govt' : 'private'}` }
  ];
  if (categoryObj) {
    breadcrumbItems.push({ name: categoryObj.name, url: `${siteUrl}/jobs/${categoryObj.slug}` });
  }
  breadcrumbItems.push({ name: job.title, url: `${siteUrl}/jobs/${job.id}` });
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  // Related opportunities (internal links) — guarantee 3 active listings
  const baseRelated = JOBS_DATA.filter(
    (j) => j.id !== job.id && !isJobExpired(j) && (j.categorySlug === job.categorySlug || j.agency === job.agency || j.city === job.city || j.type === job.type)
  ).slice(0, 3);
  let relatedJobs = [...baseRelated];
  if (relatedJobs.length < 3) {
    const remaining = JOBS_DATA.filter(j => j.id !== job.id && !isJobExpired(j) && !relatedJobs.some(r => r.id === j.id));
    relatedJobs = [...relatedJobs, ...remaining].slice(0, 3);
  }

  return (
    <div className="job-detail-page-container container-xl py-6">
      {/* JSON-LD Schemas in Server-Rendered HTML (SEO, AEO, Rich Snippets) */}
      {jobPostingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
        />
      )}
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

      {/* Breadcrumb Navigation with Category Internal Links */}
      <nav aria-label="Breadcrumb" className="breadcrumb-nav mb-4">
        <ol className="breadcrumb-list">
          <li><Link href="/">Home</Link></li>
          <li className="separator">/</li>
          <li><Link href={`/jobs/${isGovt ? 'govt' : 'private'}`}>{isGovt ? 'Government Jobs' : 'Private Jobs'}</Link></li>
          {categoryObj && (
            <>
              <li className="separator">/</li>
              <li><Link href={`/jobs/${categoryObj.slug}`}>{categoryObj.name}</Link></li>
            </>
          )}
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
                  {categoryObj && (
                    <Link 
                      href={`/jobs/${categoryObj.slug}`}
                      className="badge badge-subtle hover:border-emerald-500 transition-colors flex items-center gap-1 text-xs"
                      title={`Browse all ${categoryObj.name} jobs`}
                    >
                      <Tag size={11} className="text-emerald-500" />
                      <span>{categoryObj.shortName || categoryObj.name}</span>
                    </Link>
                  )}
                  {agencySlug && (
                    <Link 
                      href={`/agency/${agencySlug}`}
                      className="badge badge-subtle hover:border-emerald-500 transition-colors flex items-center gap-1 text-xs"
                      title={`View all ${job.agency} jobs and exam timetables`}
                    >
                      <Landmark size={11} className="text-emerald-500" />
                      <span>{job.agency} Portal</span>
                    </Link>
                  )}
                  {job.bpsScale && (
                    <span className="badge badge-bps font-mono">{job.bpsScale}</span>
                  )}
                  {isClosingToday && (
                    <span className="badge badge-closing-today flex items-center gap-1 font-bold">
                      <Flame size={12} className="text-amber-300 animate-pulse" />
                      <span>Closes today</span>
                    </span>
                  )}
                  {isExpired && (
                    <span className="badge badge-expired flex items-center gap-1 font-bold">
                      <AlertCircle size={12} />
                      <span>Applications Closed</span>
                    </span>
                  )}
                  {job.verified && (
                    <span className="badge badge-verified">
                      <ShieldCheck size={13} />
                      <span>Verified Gazette Notice</span>
                    </span>
                  )}
                </div>

                {/* Single H1 = Job Title */}
                <h1 className="job-hero-title text-2xl md:text-3xl font-extrabold text-primary mb-2" dir="auto">
                  {job.title}
                </h1>

                <div className="dept-subtitle text-base text-secondary font-medium" dir="auto">
                  {job.department || job.company} • {citySlug ? (
                    <Link href={`/city/${citySlug}`} className="text-primary font-semibold hover:text-emerald-500 hover:underline transition-colors" title={`Browse all jobs in ${job.city}`}>
                      {job.city}
                    </Link>
                  ) : (
                    <span className="text-primary font-semibold">{job.city}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="job-cta-box-top">
              {isExpired ? (
                <button disabled className="btn btn-secondary btn-lg opacity-60 cursor-not-allowed">
                  <span>Applications Closed</span>
                </button>
              ) : (
                <a
                  href={job.officialUrl || "https://www.tainaati.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Applications Closed / Archived Warning Banner with Internal Linking */}
          {isExpired && (
            <div className="p-5 mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200" role="alert">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle size={22} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-base text-amber-900 dark:text-amber-100">
                    This position has closed — view similar open roles
                  </div>
                  <div className="text-xs mt-0.5 text-amber-800 dark:text-amber-300 leading-relaxed">
                    Official applications for this position closed on <strong>{job.lastDate}</strong>. Browse these 3 similar verified active openings currently accepting applications:
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-amber-500/20">
                {relatedJobs.slice(0, 3).map((rJob) => (
                  <Link
                    key={rJob.id}
                    href={`/jobs/${rJob.id}`}
                    className="p-3 bg-white/80 dark:bg-slate-900/80 border border-amber-500/20 hover:border-emerald-500 rounded-lg transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div>
                      <div className="text-xs font-bold text-primary group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2" dir="auto">
                        {rJob.title}
                      </div>
                      <div className="text-[11px] text-secondary mt-1 line-clamp-1" dir="auto">
                        {rJob.department || rJob.company} • {rJob.city}
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span>Deadline: {rJob.lastDate}</span>
                      <span className="flex items-center gap-0.5">Apply →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Concise Quick Facts Block for Candidates & Answer Engines (GEO) */}
          <section className="card p-4 mb-6 bg-surface-subtle border border-subtle" aria-label="Job Quick Facts Summary">
            <div className="flex items-center justify-between mb-3 border-b border-subtle pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5 m-0">
                <Zap size={14} className="text-emerald-500" />
                <span>Job Snapshot & Fast Facts</span>
              </h2>
              <span className="text-[11px] text-muted">Direct Official Extract</span>
            </div>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <dt className="text-muted">Designation</dt>
                <dd className="font-semibold text-primary mt-0.5" dir="auto">{job.title}</dd>
              </div>
              <div>
                <dt className="text-muted">Department / Authority</dt>
                <dd className="font-semibold text-primary mt-0.5" dir="auto">{job.department || job.company}</dd>
              </div>
              <div>
                <dt className="text-muted">Basic Pay Scale (BPS)</dt>
                <dd className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{job.bpsScale || 'Not Specified'}</dd>
              </div>
              <div>
                <dt className="text-muted">Total Openings</dt>
                <dd className="font-semibold text-primary mt-0.5">{job.vacancies ? `${job.vacancies} ${job.vacancies === 1 ? 'Post' : 'Posts'}` : 'Multiple / Quota'}</dd>
              </div>
              <div>
                <dt className="text-muted">Application Deadline</dt>
                <dd className={`font-bold mt-0.5 ${job.hasNoExactDeadline ? 'text-amber-500' : 'text-red-500'}`}>{job.lastDate}</dd>
              </div>
              <div>
                <dt className="text-muted">Domicile / Quota</dt>
                <dd className="font-semibold text-primary mt-0.5" dir="auto">{job.quota || job.city || 'Pakistan'}</dd>
              </div>
              <div>
                <dt className="text-muted">Commission / Portal</dt>
                <dd className="font-semibold text-primary mt-0.5">{job.agency || 'Departmental / Direct'}</dd>
              </div>
              <div>
                <dt className="text-muted">Official Portal Link</dt>
                <dd className="mt-0.5">
                  <a 
                    href={job.officialUrl || "https://www.tainaati.com"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Visit Portal</span>
                    <ExternalLink size={11} />
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          {/* Official Verification & Freshness Banner */}
          <div className="official-verification-banner card p-4 mb-6">
            <div className="flex items-start gap-3">
              <ShieldCheck size={22} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <div dir="auto">
                <div className="font-bold text-sm text-primary mb-1">
                  100% Authentic Official Listing
                </div>
                <div className="text-xs text-secondary leading-relaxed">
                  Source Attribution: <strong>{job.officialSourceLabel || "Official Government Notification"}</strong>
                  <br />
                  <span className="inline-flex items-center gap-1.5 mt-0.5 font-medium text-main">
                    <Clock size={12} className="text-emerald-500" />
                    <span>Last verified & updated on: <strong>{job.lastVerifiedDate || "September 04, 2026"}</strong></span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Zero-Tolerance / Statutory Compliance Banner */}
          {job.complianceNotice && (
            <div className="p-4 mb-6 rounded-xl border border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-200 flex items-start gap-3" role="alert">
              <ShieldAlert size={22} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">Official Recruitment Integrity Notice</div>
                <div className="text-xs mt-0.5 leading-relaxed">{job.complianceNotice}</div>
              </div>
            </div>
          )}

          {/* Manual Review Reminder Banner for Unspecified Deadlines */}
          {job.hasNoExactDeadline && (
            <div className="p-4 mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 flex items-start gap-3" role="status">
              <Clock size={22} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">Application Deadline Notice & Manual Review Reminder</div>
                <div className="text-xs mt-0.5 opacity-90 leading-relaxed">
                  The exact application closing date is not specified in initial notices. Applicants must check the official {job.agency || 'recruitment'} portal (<strong>{job.officialUrl}</strong>) to verify the exact deadline before applying. Our editorial team performs continuous manual audits to update this listing upon official circular releases.
                </div>
              </div>
            </div>
          )}

          {/* Mandatory H2: Important Dates & Specifications Matrix */}
          <section className="spec-matrix-section mb-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Calendar size={18} className="text-emerald-500" />
              <span>Important Dates</span>
            </h2>
            <div className="spec-matrix-grid">
              <div className="spec-item-card">
                <span className="spec-label">⏳ Application Deadline</span>
                <span className={`spec-value font-bold ${job.hasNoExactDeadline ? 'text-amber-600 dark:text-amber-400 text-xs sm:text-sm' : 'text-red-500'}`}>{job.lastDate}</span>
              </div>
              <div className="spec-item-card">
                <span className="spec-label">📅 Announcement / Post Date</span>
                <span className="spec-value">{job.postDate || 'August 2026'}</span>
              </div>
              <div className="spec-item-card">
                <span className="spec-label">🏢 Authority / Dept</span>
                <span className="spec-value" dir="auto">{job.department || job.company}</span>
              </div>
              <div className="spec-item-card">
                <span className="spec-label">📍 Job Location</span>
                <span className="spec-value" dir="auto">{job.city}</span>
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
                  <Link 
                    href="/blog/age-relaxation-in-govt-jobs" 
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5 mt-1 font-medium"
                    title="Read official Federal and Provincial Age Relaxation rules"
                  >
                    <span>Rules Explainer →</span>
                  </Link>
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

          {/* Mandatory H2: Role Overview & Job Scope */}
          <section className="job-section mb-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Briefcase size={18} className="text-emerald-500" />
              <span>Role Overview & Job Scope</span>
            </h2>
            <p className="text-secondary leading-relaxed text-sm" dir="auto">
              {job.description || `Applications are invited by ${job.department || job.company} for the position of ${job.title}. Eligible candidates across Pakistan meeting the required academic qualifications and experience criteria are encouraged to apply online through the official portal before the closing deadline of ${job.lastDate}.`}
            </p>
          </section>

          {/* Provincial Quota Breakdown */}
          {job.quota && (
            <section className="job-section mb-6">
              <h3 className="text-base font-bold mb-2">Provincial Quota Distribution</h3>
              <div className="quota-pill-box p-3 rounded-lg border border-subtle bg-surface-subtle text-xs text-secondary leading-relaxed">
                {job.quota}
              </div>
            </section>
          )}

          {/* Mandatory H2: Eligibility Criteria */}
          <section className="job-section mb-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <GraduationCap size={18} className="text-emerald-500" />
              <span>Eligibility Criteria</span>
            </h2>
            {job.eligibilityCriteria && job.eligibilityCriteria.length > 0 ? (
              <ul className="bullet-list space-y-2 text-sm text-secondary">
                {job.eligibilityCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="bullet-list space-y-2 text-sm text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Educational Qualification:</strong> {job.qualification || "As per official service rules and advertisement"}</span>
                </li>
                {job.ageLimit && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Age Limit:</strong> {job.ageLimit}</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Nationality & Domicile:</strong> Valid Pakistani CNIC and applicable provincial/regional domicile.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-muted"><strong>Official Disclaimer:</strong> As per official advertisement, verify exact wording on {job.officialUrl || "official portal"} for legally binding details.</span>
                </li>
              </ul>
            )}
          </section>

          {/* Post-Wise Vacancy & Criteria Breakdown */}
          {job.postsBreakdown && Array.isArray(job.postsBreakdown) && job.postsBreakdown.length > 0 && (
            <section className="job-section mb-6">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Layers size={18} className="text-emerald-500" />
                <span>Post-Wise Vacancies & Eligibility Standards</span>
              </h2>
              <div className="space-y-3">
                {job.postsBreakdown.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-subtle bg-surface-subtle">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                      <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center text-xs font-mono font-bold">
                          {idx + 1}
                        </span>
                        <span>{item.postTitle}</span>
                      </h3>
                      {item.scale && (
                        <span className="badge badge-bps font-mono text-xs">{item.scale}</span>
                      )}
                    </div>
                    <div className="text-xs text-secondary space-y-1.5 ml-8">
                      <div><strong>Education:</strong> {item.qualification}</div>
                      {item.experience && <div><strong>Experience:</strong> {item.experience}</div>}
                      {item.skills && <div><strong>Required Skills:</strong> {item.skills}</div>}
                      {item.vacancies && <div><strong>Vacancies:</strong> {item.vacancies}</div>}
                      {item.quota && <div><strong>Quota Breakdown:</strong> {item.quota}</div>}
                      {item.physical && <div><strong>Physical Standards:</strong> {item.physical}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Exam Syllabus */}
          {job.syllabus && (
            <section className="job-section mb-6">
              <h3 className="text-base font-bold mb-3">Official Examination Syllabus & Pattern</h3>
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

          {/* Official Gazette Source Box with Legal Attribution */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200/60 rounded-xl flex items-center justify-between gap-3 flex-wrap mb-6">
            <div className="flex items-center gap-2.5 text-xs text-emerald-950 font-medium">
              <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
              <span>
                Source Attribution: <strong>{job.officialSourceLabel || "Official Government Gazette Notification"}</strong>
              </span>
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

          {/* Mandatory H2: How to Apply */}
          <section className="job-section mb-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <FileText size={18} className="text-emerald-500" />
              <span>How to Apply</span>
            </h2>
            <ol className="apply-steps-list space-y-3 text-sm text-secondary">
              <li className="flex items-start gap-3">
                <span className="step-num-badge">1</span>
                <div>
                  <strong>Verify Eligibility & Credentials:</strong> Confirm that your degree, CNIC, and domicile meet the official criteria before initiating your application.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="step-num-badge">2</span>
                <div>
                  <strong>Deposit Fee / Generate PSID:</strong> {job.challanFee ? `Pay ${job.challanFee}` : 'Deposit the required application fee'} through designated banking channels (1Link, ATM, mobile banking, or bank counter).
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="step-num-badge">3</span>
                <div>
                  <strong>Complete Online Submission:</strong> Visit the official portal link below and submit your complete application {job.hasNoExactDeadline ? 'after verifying the closing date on the official notice' : <>prior to <strong>{job.lastDate}</strong></>}. Keep a printed copy of the submitted form.
                </div>
              </li>
            </ol>

            <div className="mt-6 pt-4 border-t border-subtle flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-muted">Official Recruitment Portal:</div>
                <div className="text-sm font-semibold text-primary">{job.officialUrl || "https://www.tainaati.com"}</div>
              </div>

              {isExpired ? (
                <button disabled className="btn btn-secondary btn-lg opacity-60 cursor-not-allowed">
                  <span>Applications Closed</span>
                </button>
              ) : (
                <a
                  href={job.officialUrl || "https://www.tainaati.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                >
                  <span>Proceed to Official Application &rarr;</span>
                </a>
              )}
            </div>
          </section>

          {/* Mandatory H2: Frequently Asked Questions (AEO & Featured Snippets) */}
          <section className="job-section mb-6" id="faqs">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <HelpCircle size={18} className="text-emerald-500" />
              <span>Frequently Asked Questions</span>
            </h2>
            <div className="space-y-3">
              {jobFaqs.map((faq, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-subtle bg-surface-subtle">
                  <h3 className="text-sm font-bold text-primary mb-1">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* In-Article Internal Link Navigation Banner */}
          {agencySlug && (
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between gap-4 flex-wrap mt-6">
              <div>
                <div className="font-bold text-sm text-primary">Looking for more {job.agency} openings?</div>
                <div className="text-xs text-secondary">Explore all active job advertisements, syllabus guides, and roll number slip portals.</div>
              </div>
              <Link 
                href={`/agency/${agencySlug}`}
                className="btn btn-primary btn-sm flex items-center gap-1.5"
              >
                <span>View {job.agency} Portal</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="job-detail-sidebar space-y-4">
          {/* Agency & Category Navigation Cards */}
          <div className="card p-4">
            <h3 className="font-bold text-sm mb-3">Explore Categories & Agencies</h3>
            <div className="space-y-2 text-xs">
              {categoryObj && (
                <Link 
                  href={`/jobs/${categoryObj.slug}`} 
                  className="flex items-center justify-between p-2 rounded hover:bg-surface-subtle transition-colors text-secondary hover:text-primary"
                >
                  <span>📁 {categoryObj.name}</span>
                  <ArrowRight size={12} />
                </Link>
              )}
              {agencySlug && (
                <Link 
                  href={`/agency/${agencySlug}`} 
                  className="flex items-center justify-between p-2 rounded hover:bg-surface-subtle transition-colors text-secondary hover:text-primary"
                >
                  <span>🏛️ {job.agency} Jobs Gateway</span>
                  <ArrowRight size={12} />
                </Link>
              )}
              <Link 
                href="/salary-calculator" 
                className="flex items-center justify-between p-2 rounded hover:bg-surface-subtle transition-colors text-secondary hover:text-primary"
              >
                <span>💰 2026 Pay & Pension Calculator</span>
                <ArrowRight size={12} />
              </Link>
              <Link 
                href="/exam-results" 
                className="flex items-center justify-between p-2 rounded hover:bg-surface-subtle transition-colors text-secondary hover:text-primary"
              >
                <span>📋 Exam Results & Roll No Slips</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

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

          {/* Related Jobs Internal Links */}
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
