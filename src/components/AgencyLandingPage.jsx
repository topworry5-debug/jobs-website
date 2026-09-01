import React, { useEffect } from 'react';
import { 
  Landmark, 
  ShieldCheck, 
  ExternalLink, 
  HelpCircle, 
  BookOpen, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { AGENCY_LANDING_PAGES } from '../data/landingPagesData';
import { generateFAQSchema, updatePageMeta } from '../utils/seoHelpers';
import JobCard from './JobCard';

export default function AgencyLandingPage({ 
  agencyKey, 
  allJobs, 
  onSelectJob, 
  savedJobIds, 
  onToggleSave,
  onShareWhatsApp,
  onShareFacebook 
}) {
  const agencyData = AGENCY_LANDING_PAGES[agencyKey] || AGENCY_LANDING_PAGES['fpsc'];

  useEffect(() => {
    updatePageMeta({
      title: `${agencyData.code} Jobs 2026 — Official ${agencyData.fullName}`,
      description: `Complete verified advertisement list, syllabus guidelines, and bank challan instructions for ${agencyData.fullName}.`
    });

    const faqSchema = generateFAQSchema(agencyData.faqs);
    let scriptTag = document.getElementById('agency-faq-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'agency-faq-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(faqSchema);

    return () => {
      if (scriptTag) scriptTag.remove();
    };
  }, [agencyData]);

  // Filter jobs for this agency
  const agencyJobs = allJobs.filter(j => 
    (j.agency && j.agency.toLowerCase().includes(agencyData.code.toLowerCase())) ||
    (j.category && j.category.toLowerCase().includes(agencyData.code.toLowerCase()))
  );

  return (
    <div className="agency-landing-page">
      <div className="agency-header-banner">
        <div className="container-xl">
          <div className="agency-badge-row">
            <span className="badge badge-govt">
              <Landmark size={13} />
              <span>{agencyData.jurisdiction}</span>
            </span>
            <span className="badge badge-verified">
              <ShieldCheck size={13} />
              <span>Official Authority Hub</span>
            </span>
          </div>

          <h1 className="agency-headline">{agencyData.fullName} ({agencyData.code}) Jobs 2026</h1>
          <p className="agency-desc">
            Directly verified gazette advertisements, screening syllabus, bank challan instructions, and online application portal.
          </p>

          <div className="agency-action-bar">
            <a
              href={agencyData.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <span>Visit {agencyData.code} Official Portal</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>

      <div className="container-xl agency-content-body">
        {/* Challan Guide Card */}
        <div className="challan-guide-box card mb-4">
          <div className="challan-guide-header">
            <CheckCircle2 size={18} className="text-emerald" />
            <h3 className="challan-guide-title">Official Fee Challan Instructions ({agencyData.code})</h3>
          </div>
          <p className="challan-guide-text">{agencyData.challanGuide}</p>
        </div>

        {/* Active Openings */}
        <div className="agency-jobs-section mb-5">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h2 className="section-title mb-0">
              Current {agencyData.code} Advertised Positions ({agencyJobs.length})
            </h2>
            <span className="text-xs text-muted">
              Live Verified via Official Portal Telemetry
            </span>
          </div>

          {agencyJobs.length > 0 ? (
            <div className="jobs-layout-container grid-view">
              {agencyJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSelect={onSelectJob}
                  isSaved={savedJobIds.includes(job.id)}
                  onToggleSave={onToggleSave}
                  onShareWhatsApp={onShareWhatsApp}
                  onShareFacebook={onShareFacebook}
                />
              ))}
            </div>
          ) : (
            <div className="card p-6 md:p-8 bg-surface-subtle border border-subtle text-center rounded-xl">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-primary mb-1.5 font-display">
                No Active Vacancy Advertisements Right Now
              </h3>
              <p className="text-sm text-secondary max-w-lg mx-auto mb-5 leading-relaxed">
                The {agencyData.fullName} official portal confirms there are currently no new open advertisements accepting fresh online applications. However, active written test schedules, physical endurance tests, and interview call-up lists for previously-advertised posts are ongoing.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <a 
                  href="/exams" 
                  className="btn btn-primary btn-sm flex items-center gap-1.5"
                >
                  <BookOpen size={14} />
                  <span>Check {agencyData.code} Exam & Interview Calendar</span>
                </a>
                <a 
                  href={agencyData.officialWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline btn-sm flex items-center gap-1.5"
                >
                  <span>Visit {agencyData.code} Portal</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* FAQs */}
        <div className="agency-faq-section card">
          <div className="faq-header-row">
            <HelpCircle size={20} className="text-emerald" />
            <h3 className="faq-main-title">{agencyData.code} Recruitment FAQs & Regulations</h3>
          </div>

          <div className="faq-list">
            {agencyData.faqs.map((faq, idx) => (
              <div key={idx} className="faq-item-block">
                <h4 className="faq-q-text">{faq.question}</h4>
                <p className="faq-a-text">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
