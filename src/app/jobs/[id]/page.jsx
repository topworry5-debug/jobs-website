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
import { 
  generateJobPostingSchema, 
  generateBreadcrumbSchema, 
  generateFAQSchema,
  formatJobPageTitle,
  formatJobPageDescription
} from '../../../utils/seoHelpers';
import { getJobLogoUrl, getJobLogoAlt } from '../../../utils/logoResolver';
import { getSiteUrl } from '../../../utils/siteUrl';
import { decodeHtmlEntities } from '../../../utils/textCleaning';
import { 
  getJobStatus, 
  isJobOpen, 
  isJobExpired, 
  calculateDaysRemaining,
  findJobBySlugOrId,
  getJobSlug 
} from '../../../lib/jobStatus';

export const dynamicParams = true;
// Daily revalidation (24 hours) to update expired jobs automatically
export const revalidate = 86400;

export async function generateStaticParams() {
  const seen = new Set();
  const params = [];
  
  for (const job of JOBS_DATA) {
    const slug = job.slug || getJobSlug(job);
    if (slug && !seen.has(slug)) {
      params.push({ id: slug });
      seen.add(slug);
    }
  }

  return params;
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
 * Generates concise, direct-answer FAQ pairs based strictly on stored data.
 */
function getJobFaqs(job) {
  if (job.faqs && Array.isArray(job.faqs) && job.faqs.length > 0) {
    return job.faqs;
  }
  const org = job.department || job.company || job.agency || 'the recruiting organization';
  const faqs = [];

  if (job.lastDate) {
    faqs.push({
      question: `What is the last date to apply for ${job.title}?`,
      answer: `The official application deadline for ${job.title} at ${org} is ${job.lastDate}.`
    });
  }

  if (job.qualification || job.ageLimit) {
    const qualText = job.qualification ? `hold ${job.qualification}` : 'meet the specified criteria';
    const ageText = job.ageLimit ? ` and comply with the age limit of ${job.ageLimit}` : '';
    faqs.push({
      question: `What are the eligibility criteria for ${job.title}?`,
      answer: `Candidates must ${qualText}${ageText} as stated in the official announcement.`
    });
  }

  if (job.vacancies) {
    faqs.push({
      question: `How many vacancies are available for ${job.title}?`,
      answer: `There are ${job.vacancies} total vacancies announced for ${job.title} at ${org}.`
    });
  }

  if (job.officialUrl) {
    faqs.push({
      question: `How do I apply for ${job.title}?`,
      answer: `Eligible candidates can apply online directly through the official portal at ${job.officialUrl}${job.challanFee ? ` after paying the required fee of ${job.challanFee}` : ''}.`
    });
  }

  return faqs;
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
  const job = findJobBySlugOrId(id, JOBS_DATA);

  if (!job) {
    return {
      title: "Job Notice | Tainaati",
      description: "Public sector job notices, syllabus guides and exam schedules in Pakistan."
    };
  }

  const siteUrl = getSiteUrl();
  const jobSlug = job.slug || getJobSlug(job);
  const canonicalUrl = `${siteUrl}/jobs/${jobSlug}`;

  // Unique Title max ~60 chars and Meta Description max ~155 chars
  const pageTitle = formatJobPageTitle(job);
  const pageDesc = formatJobPageDescription(job);

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
  const job = findJobBySlugOrId(id, JOBS_DATA);

  if (!job) {
    notFound();
  }

  const isGovt = job.type === 'govt';
  const siteUrl = getSiteUrl();
  const jobSlug = job.slug || getJobSlug(job);
  const expired = isJobExpired(job);
  const daysLeft = calculateDaysRemaining(job.lastDate);
  const isClosingSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;
  const isClosingToday = daysLeft === 0;

  const agencySlug = resolveAgencySlug(job);
  const citySlug = resolveCitySlug(job);
  const categoryObj = job.categorySlug ? getCategoryBySlug(job.categorySlug) : null;
  const jobFaqs = getJobFaqs(job);

  // SEO JSON-LD Schemas: JobPosting + BreadcrumbList + FAQPage
  const jobPostingSchema = generateJobPostingSchema(job);
  const faqSchema = jobFaqs.length > 0 ? generateFAQSchema(jobFaqs) : null;

  // Breadcrumbs: Home > Agency > Job
  const agencyBreadcrumbName = job.agency ? `${job.agency}` : (isGovt ? 'Government Jobs' : 'Private Jobs');
  const agencyBreadcrumbUrl = agencySlug ? `/agency/${agencySlug}` : (isGovt ? '/jobs/govt' : '/jobs/private');
  
  const breadcrumbItems = [
    { name: "Home", url: `${siteUrl}/` },
    { name: agencyBreadcrumbName, url: `${siteUrl}${agencyBreadcrumbUrl}` },
    { name: job.title, url: `${siteUrl}/jobs/${jobSlug}` }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  // Verified Date display - ONLY if real verifiedAt exists
  const verifiedDate = job.verifiedAt
    ? new Date(job.verifiedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Karachi" })
    : null;

  // Official advertisement image / PDF link
  const officialDocUrl = job.officialNotificationUrl || job.adImageUrl || 
    (job.sourceUrl && (job.sourceUrl.endsWith('.pdf') || job.sourceUrl.includes('uploads')) ? job.sourceUrl : null);

  // 3 Verified Active Openings for recommendations
  const relatedOpenJobs = JOBS_DATA.filter(
    (j) => j.id !== job.id && isJobOpen(j) && (j.categorySlug === job.categorySlug || j.agency === job.agency || j.city === job.city || j.type === job.type)
  ).slice(0, 3);

  return (
    <div className="job-detail-page-container container-xl py-6">
      {/* JSON-LD Schemas: JobPosting, BreadcrumbList, FAQPage */}
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

      {/* Visible Breadcrumbs: Home > Agency > Job */}
      <nav aria-label="Breadcrumb" className="breadcrumb-nav mb-4">
        <ol className="breadcrumb-list">
          <li><Link href="/">Home</Link></li>
          <li className="separator">/</li>
          <li><Link href={agencyBreadcrumbUrl}>{agencyBreadcrumbName}</Link></li>
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
                  {job.agency && agencySlug ? (
                    <Link 
                      href={`/agency/${agencySlug}`}
                      className="badge badge-subtle hover:border-emerald-500 transition-colors flex items-center gap-1 text-xs"
                      title={`View all ${job.agency} jobs`}
                    >
                      <Landmark size={11} className="text-emerald-500" />
                      <span>{job.agency}</span>
                    </Link>
                  ) : job.agency ? (
                    <span className="badge badge-subtle flex items-center gap-1 text-xs">
                      <Landmark size={11} className="text-emerald-500" />
                      <span>{job.agency}</span>
                    </span>
                  ) : null}

                  {job.bpsScale && (
                    <span className="badge badge-bps font-mono">{job.bpsScale}</span>
                  )}

                  {expired ? (
                    <span className="badge badge-expired flex items-center gap-1 font-bold">
                      <AlertCircle size={12} />
                      <span>Applications Closed</span>
                    </span>
                  ) : isClosingToday ? (
                    <span className="badge badge-closing-today flex items-center gap-1 font-bold">
                      <Flame size={12} className="text-amber-300 animate-pulse" />
                      <span>Closes today</span>
                    </span>
                  ) : isClosingSoon ? (
                    <span className="badge badge-closing-today flex items-center gap-1 font-bold">
                      <Flame size={12} className="text-amber-300" />
                      <span>{daysLeft}d left</span>
                    </span>
                  ) : (
                    <span className="badge badge-govt">
                      <span>Open Position</span>
                    </span>
                  )}

                  {job.sourceUrl && (
                    <a
                      href={job.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="badge-source-linked"
                      title="Direct official source advertisement link"
                    >
                      <ExternalLink size={11} aria-hidden="true" />
                      <span>Source linked</span>
                    </a>
                  )}

                  {verifiedDate && (
                    <span className="badge badge-verified">
                      <ShieldCheck size={13} />
                      <span>Verified on {verifiedDate}</span>
                    </span>
                  )}
                </div>

                {/* Single H1 = Job Title */}
                <h1 className="job-hero-title text-2xl md:text-3xl font-extrabold text-primary mb-2" dir="auto">
                  {decodeHtmlEntities(job.title)}
                </h1>

                {(job.department || job.company || job.city) && (
                  <div className="dept-subtitle text-base text-secondary font-medium" dir="auto">
                    {(job.department || job.company) && <span>{decodeHtmlEntities(job.department || job.company)}</span>}
                    {(job.department || job.company) && job.city && <span> • </span>}
                    {job.city && (
                      citySlug ? (
                        <Link href={`/city/${citySlug}`} className="text-primary font-semibold hover:text-emerald-500 hover:underline transition-colors">
                          {job.city}
                        </Link>
                      ) : (
                        <span className="text-primary font-semibold">{job.city}</span>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="job-cta-box-top">
              {expired ? (
                <button disabled className="btn btn-secondary btn-lg opacity-60 cursor-not-allowed">
                  <span>Applications Closed</span>
                </button>
              ) : job.officialUrl ? (
                <a
                  href={job.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink size={16} />
                </a>
              ) : null}
            </div>
          </div>

          {/* Applications Closed Notice Banner (Only for Expired Jobs) */}
          {expired && (
            <div className="p-5 mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200" role="alert">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle size={22} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-base text-amber-900 dark:text-amber-100">
                    Applications Closed
                  </div>
                  <div className="text-xs mt-0.5 text-amber-800 dark:text-amber-300 leading-relaxed">
                    Official applications for this position closed on <strong>{job.lastDate}</strong>. This listing is retained for examination, syllabus, and official record. Browse active openings:
                  </div>
                </div>
              </div>
              {relatedOpenJobs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-amber-500/20">
                  {relatedOpenJobs.map((rJob) => (
                    <Link
                      key={rJob.slug || rJob.id}
                      href={`/jobs/${rJob.slug || rJob.id}`}
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
              )}
            </div>
          )}

          {/* Quick Specifications Matrix (Real stored data only - missing fields are hidden) */}
          <section className="card p-4 mb-6 bg-surface-subtle border border-subtle" aria-label="Job Snapshot">
            <div className="flex items-center justify-between mb-3 border-b border-subtle pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5 m-0">
                <Zap size={14} className="text-emerald-500" />
                <span>Job Snapshot & Specifications</span>
              </h2>
              {job.agency && <span className="text-[11px] text-muted">{job.agency} Official Notice</span>}
            </div>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <dt className="text-muted">Designation</dt>
                <dd className="font-semibold text-primary mt-0.5" dir="auto">{job.title}</dd>
              </div>

              {(job.department || job.company) && (
                <div>
                  <dt className="text-muted">Department</dt>
                  <dd className="font-semibold text-primary mt-0.5" dir="auto">{job.department || job.company}</dd>
                </div>
              )}

              {job.agency && (
                <div>
                  <dt className="text-muted">Commission / Portal</dt>
                  <dd className="font-semibold text-primary mt-0.5">{job.agency}</dd>
                </div>
              )}

              {job.bpsScale && (
                <div>
                  <dt className="text-muted">Basic Pay Scale</dt>
                  <dd className="spec-value-highlight font-mono mt-0.5">{job.bpsScale}</dd>
                </div>
              )}

              {job.vacancies && (
                <div>
                  <dt className="text-muted">Total Openings</dt>
                  <dd className="font-semibold text-primary mt-0.5">{job.vacancies} {job.vacancies === 1 ? 'Post' : 'Posts'}</dd>
                </div>
              )}

              {job.lastDate && (
                <div>
                  <dt className="text-muted">Application Deadline</dt>
                  <dd className={`font-bold mt-0.5 ${expired ? 'text-muted' : isClosingSoon ? 'text-amber-500' : 'text-red-500'}`}>
                    {job.lastDate}
                  </dd>
                </div>
              )}

              {job.postDate && (
                <div>
                  <dt className="text-muted">Announcement Date</dt>
                  <dd className="font-semibold text-primary mt-0.5">{job.postDate}</dd>
                </div>
              )}

              {job.quota && (
                <div>
                  <dt className="text-muted">Domicile / Quota</dt>
                  <dd className="font-semibold text-primary mt-0.5" dir="auto">{job.quota}</dd>
                </div>
              )}

              {job.city && (
                <div>
                  <dt className="text-muted">Location</dt>
                  <dd className="font-semibold text-primary mt-0.5" dir="auto">{job.city}</dd>
                </div>
              )}

              {job.province && (
                <div>
                  <dt className="text-muted">Province</dt>
                  <dd className="font-semibold text-primary mt-0.5" dir="auto">{job.province}</dd>
                </div>
              )}

              {job.ageLimit && (
                <div>
                  <dt className="text-muted">Age Limit</dt>
                  <dd className="font-semibold text-primary mt-0.5" dir="auto">{job.ageLimit}</dd>
                </div>
              )}

              {job.challanFee && (
                <div>
                  <dt className="text-muted">Application Fee</dt>
                  <dd className="spec-value-highlight mt-0.5">{job.challanFee}</dd>
                </div>
              )}

              {job.officialUrl && (
                <div>
                  <dt className="text-muted">Official Portal</dt>
                  <dd className="mt-0.5">
                    <a 
                      href={job.officialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="spec-value-highlight hover:underline inline-flex items-center gap-1 min-h-[44px] py-1"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink size={11} />
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Official Source Link Banner (Rendered only if sourceUrl exists) */}
          {job.sourceUrl && (
            <div className="official-verification-banner card p-4 mb-6">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={22} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div dir="auto">
                    <div className="font-bold text-sm text-primary mb-1">
                      Source notice
                    </div>
                    <div className="text-xs text-secondary leading-relaxed">
                      Source:{' '}
                      <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                        {job.officialSourceLabel || job.agency || "Official source notice"}
                      </a>
                      {verifiedDate && (
                        <>
                          <br />
                          <span className="inline-flex items-center gap-1.5 mt-0.5 font-medium text-main">
                            <Clock size={12} className="text-emerald-500" />
                            <span>Verified on {verifiedDate}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {officialDocUrl && (
                  <a
                    href={officialDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-xs flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 self-center"
                  >
                    <span>View Gazette / Ad Notice</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Statutory Compliance Notice */}
          {job.complianceNotice && (
            <div className="p-4 mb-6 rounded-xl border border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-200 flex items-start gap-3" role="alert">
              <ShieldAlert size={22} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">Recruitment Notice & Policy</div>
                <div className="text-xs mt-0.5 leading-relaxed">{job.complianceNotice}</div>
              </div>
            </div>
          )}

          {/* Role Overview */}
          <section className="job-section mb-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Briefcase size={18} className="text-emerald-500" />
              <span>Role Overview</span>
            </h2>
            <p className="text-secondary leading-relaxed text-sm" dir="auto">
              {job.description || `Official job advertisement for the position of ${job.title} at ${job.department || job.company || job.agency || 'Government of Pakistan'}.${job.lastDate ? ` Applications close on ${job.lastDate}.` : ''}`}
            </p>
          </section>

          {/* Eligibility Criteria (Rendered only if qualification or criteria exist) */}
          {(job.qualification || job.ageLimit || (job.eligibilityCriteria && job.eligibilityCriteria.length > 0)) && (
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
                  {job.qualification && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Educational Qualification:</strong> {job.qualification}</span>
                    </li>
                  )}
                  {job.ageLimit && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Age Limit:</strong> {job.ageLimit}</span>
                    </li>
                  )}
                  {job.quota && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Quota / Domicile:</strong> {job.quota}</span>
                    </li>
                  )}
                </ul>
              )}
            </section>
          )}

          {/* Post-Wise Vacancy & Criteria Breakdown */}
          {job.postsBreakdown && Array.isArray(job.postsBreakdown) && job.postsBreakdown.length > 0 && (
            <section className="job-section mb-6">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Layers size={18} className="text-emerald-500" />
                <span>Post-Wise Vacancies</span>
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
                      {item.qualification && <div><strong>Education:</strong> {item.qualification}</div>}
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
              <h3 className="text-base font-bold mb-3">Examination Syllabus & Pattern</h3>
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

          {/* How to Apply */}
          <section className="job-section mb-6" aria-labelledby="how-to-apply-heading">
            <h2 id="how-to-apply-heading" className="text-lg font-bold mb-3 flex items-center gap-2">
              <FileText size={18} className="text-emerald-500" />
              <span>How to Apply</span>
            </h2>
            <ol className="apply-steps-list space-y-3 text-sm text-secondary">
              <li className="flex items-start gap-3">
                <span className="step-num-badge">1</span>
                <div>
                  <strong>Verify Eligibility:</strong> Check that your academic credentials{job.ageLimit ? ` and age limit (${job.ageLimit})` : ''} meet the requirements in the official advertisement.
                </div>
              </li>
              {job.challanFee && (
                <li className="flex items-start gap-3">
                  <span className="step-num-badge">2</span>
                  <div>
                    <strong>Deposit Application Fee:</strong> Pay {job.challanFee} through the designated banking mode / PSID token as instructed by the recruitment authority.
                  </div>
                </li>
              )}
              <li className="flex items-start gap-3">
                <span className="step-num-badge">{job.challanFee ? 3 : 2}</span>
                <div>
                  <strong>Submit Online Application:</strong> {job.officialUrl ? (
                    <>
                      Apply online via the official recruitment portal at{' '}
                      <a href={job.officialUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline font-medium break-all">
                        {job.officialUrl}
                      </a>
                      {job.lastDate ? ` on or before ${job.lastDate}.` : '.'}
                    </>
                  ) : (
                    `Submit your application following the instructions in the official notification${job.lastDate ? ` before ${job.lastDate}.` : '.'}`
                  )}
                </div>
              </li>
            </ol>

            <div className="mt-6 pt-4 border-t border-subtle flex flex-wrap items-center justify-between gap-4">
              {job.officialUrl && (
                <div>
                  <div className="text-xs text-muted">Official Recruitment Portal:</div>
                  <div className="text-sm font-semibold text-primary">{job.officialUrl}</div>
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                {officialDocUrl && (
                  <a
                    href={officialDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-md flex items-center gap-2"
                  >
                    <FileText size={16} className="text-emerald-600" />
                    <span>View Official Ad Notice</span>
                    <ExternalLink size={14} />
                  </a>
                )}

                {expired ? (
                  <button disabled className="btn btn-secondary btn-lg opacity-60 cursor-not-allowed">
                    <span>Applications Closed</span>
                  </button>
                ) : job.officialUrl ? (
                  <a
                    href={job.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg"
                  >
                    <span>Proceed to Official Application &rarr;</span>
                  </a>
                ) : null}
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          {jobFaqs.length > 0 && (
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
          )}

          {/* Agency Hub Link */}
          {agencySlug && job.agency && (
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between gap-4 flex-wrap mt-6">
              <div>
                <div className="font-bold text-sm text-primary">Looking for more {job.agency} openings?</div>
                <div className="text-xs text-secondary">View all active advertisements and exam schedules.</div>
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
              {agencySlug && job.agency && (
                <Link 
                  href={`/agency/${agencySlug}`} 
                  className="flex items-center justify-between p-2 rounded hover:bg-surface-subtle transition-colors text-secondary hover:text-primary"
                >
                  <span>🏛️ {job.agency} Hub</span>
                  <ArrowRight size={12} />
                </Link>
              )}
              <Link 
                href="/salary-calculator" 
                className="flex items-center justify-between p-2 rounded hover:bg-surface-subtle transition-colors text-secondary hover:text-primary"
              >
                <span>💰 Pay & Pension Calculator</span>
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
              <li><Link href="/jobs/govt" className="text-secondary hover:text-primary">🏛️ All Government Jobs</Link></li>
              <li><Link href="/exams" className="text-secondary hover:text-primary">📅 Competitive Exam Calendar</Link></li>
              <li><Link href="/cv-builder" className="text-secondary hover:text-primary">📄 Free CV Builder</Link></li>
              <li><Link href="/alerts" className="text-secondary hover:text-primary">📧 Email Job Alerts</Link></li>
            </ul>
          </div>

          {/* Related Active Openings */}
          {relatedOpenJobs.length > 0 && (
            <div className="card p-4">
              <h3 className="font-bold text-sm mb-3">Related Open Positions</h3>
              <div className="space-y-3">
                {relatedOpenJobs.map((rj) => {
                  const rjSlug = rj.slug || getJobSlug(rj);
                  return (
                    <Link key={rjSlug} href={`/jobs/${rjSlug}`} className="block p-2 rounded hover:bg-surface-subtle transition-colors">
                      <div className="font-semibold text-xs text-primary line-clamp-1">{rj.title}</div>
                      <div className="text-xs text-muted flex items-center justify-between mt-1">
                        <span>{rj.city}</span>
                        {rj.bpsScale && <span className="text-emerald-500 font-bold">{rj.bpsScale}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
