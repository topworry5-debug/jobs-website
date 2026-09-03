'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Users, 
  Building2, 
  ExternalLink, 
  Share2, 
  Bookmark, 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { generateJobPostingSchema } from '../utils/seoHelpers';
import { useLanguage } from '../context/LanguageContext';
import { getJobLogoUrl, getJobLogoAlt } from '../utils/logoResolver';

export default function JobDetailModal({
  job,
  onClose,
  allJobs = [],
  onSelectJob = () => {},
  isSaved,
  onToggleSave = () => {},
  onShareWhatsApp = () => {},
  onShareFacebook = () => {}
}) {
  const { t, isRtl } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const isGovt = job.type === 'govt';
  const logoUrl = getJobLogoUrl(job);
  const logoAlt = getJobLogoAlt(job);

  // Inject Schema.org JobPosting structured JSON-LD
  useEffect(() => {
    const schema = generateJobPostingSchema(job);
    let scriptTag = document.getElementById('job-posting-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'job-posting-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schema);

    return () => {
      if (scriptTag) scriptTag.remove();
    };
  }, [job]);

  // Live countdown timer calculation
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const deadlineDate = new Date(`${job.lastDate}T23:59:59`).getTime();
      const now = new Date().getTime();
      const difference = deadlineDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [job.lastDate]);

  // Find related jobs
  const relatedJobs = allJobs
    .filter(j => j.id !== job.id && (j.type === job.type || j.category === job.category))
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container job-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header Bar */}
        <div className="modal-header">
          <div className="modal-header-dept">
            <span className={`badge ${isGovt ? 'badge-govt' : 'badge-private'}`}>
              {isGovt ? t.jobDetail.officialGovtBadge : t.jobDetail.privateBadge}
            </span>
            {job.verified && (
              <span className="badge badge-verified">
                <ShieldCheck size={13} />
                <span>{t.jobDetail.verifiedBadge}</span>
              </span>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-content">
          {/* Main Title & Agency */}
          <div className="job-detail-headline-section">
            <div className="headline-icon-row">
              <div className="detail-logo-wrapper">
                <Image 
                  src={logoUrl} 
                  alt={logoAlt} 
                  className="detail-official-logo"
                  width={56}
                  height={56}
                  loading="lazy"
                />
              </div>
              <div className="detail-title-block">
                <h2 className="detail-job-title" dir="auto">{job.title}</h2>
                <div className="detail-dept-row">
                  <span className="detail-org-name" dir="auto">{job.department || job.company}</span>
                  {job.bpsScale && <span className="bps-pill font-mono">{job.bpsScale}</span>}
                </div>
              </div>
            </div>

            {/* Official Source Reference */}
            {job.officialSourceLabel && (
              <div className="official-source-bar" dir="auto">
                <ShieldCheck size={15} className="text-emerald" />
                <span>{t.jobDetail.sourceRef} <strong>{job.officialSourceLabel}</strong> • {t.jobDetail.lastVerifiedAgainst} <strong>{job.lastVerifiedDate || "August 31, 2026"}</strong></span>
              </div>
            )}
          </div>

          {/* Live Application Deadline Countdown Card */}
          <div className="deadline-countdown-banner">
            <div className="countdown-info">
              <div className="countdown-label">
                <Clock size={16} />
                <span>{t.jobDetail.deadline}</span>
              </div>
              <div className="countdown-date">
                {t.jobCard.lastDate} <strong>{job.lastDate}</strong> (11:59 PM PST)
              </div>
            </div>

            <div className="countdown-timer-grid">
              <div className="timer-box">
                <span className="timer-val">{timeLeft.days}</span>
                <span className="timer-unit">Days</span>
              </div>
              <span className="timer-sep">:</span>
              <div className="timer-box">
                <span className="timer-val">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="timer-unit">Hours</span>
              </div>
              <span className="timer-sep">:</span>
              <div className="timer-box">
                <span className="timer-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="timer-unit">Mins</span>
              </div>
              <span className="timer-sep">:</span>
              <div className="timer-box">
                <span className="timer-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="timer-unit">Secs</span>
              </div>
            </div>
          </div>

          {/* Key Job Specifications Matrix */}
          <div className="spec-matrix-grid">
            <div className="spec-item-card">
              <span className="spec-label">📍 {t.jobDetail.jobLocation}</span>
              <span className="spec-value" dir="auto">{job.city}</span>
            </div>

            <div className="spec-item-card">
              <span className="spec-label">👥 {t.jobDetail.totalOpenings}</span>
              <span className="spec-value">{job.vacancies} {job.vacancies === 1 ? t.jobCard.vacancy : t.jobCard.vacancies}</span>
            </div>

            {isGovt && job.ageLimit && (
              <div className="spec-item-card">
                <span className="spec-label">🎂 {t.jobDetail.ageLimit}</span>
                <span className="spec-value" dir="auto">{job.ageLimit}</span>
              </div>
            )}

            {isGovt && job.challanFee && (
              <div className="spec-item-card">
                <span className="spec-label">💳 {t.jobDetail.challanFee}</span>
                <span className="spec-value text-emerald-500" dir="auto">{job.challanFee}</span>
              </div>
            )}

            {!isGovt && job.salaryRange && (
              <div className="spec-item-card">
                <span className="spec-label">💰 {t.jobDetail.payScale}</span>
                <span className="spec-value text-emerald-500" dir="auto">{job.salaryRange}</span>
              </div>
            )}

            {job.qualification && (
              <div className="spec-item-card">
                <span className="spec-label">🎓 {t.jobDetail.minQualification}</span>
                <span className="spec-value" dir="auto">{job.qualification}</span>
              </div>
            )}
          </div>

          {/* Section: Job Description */}
          <div className="detail-section-block">
            <h4 className="detail-section-title">
              <FileText size={17} className="text-emerald" />
              <span>{t.jobDetail.descTitle}</span>
            </h4>
            <p className="detail-text-p" dir="auto">{job.description}</p>
          </div>

          {/* Section: Quota Breakdown (Govt specific) */}
          {isGovt && job.quota && (
            <div className="detail-section-block">
              <h4 className="detail-section-title">
                <Users size={17} className="text-emerald" />
                <span>{t.jobDetail.quotaTitle}</span>
              </h4>
              <div className="quota-display-card">
                {job.quota.split('|').map((q, idx) => (
                  <div key={idx} className="quota-item-pill" dir="auto">
                    {q.trim()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Eligibility Criteria */}
          {job.eligibilityCriteria && job.eligibilityCriteria.length > 0 && (
            <div className="detail-section-block">
              <h4 className="detail-section-title">
                <CheckCircle2 size={17} className="text-emerald" />
                <span>{t.jobDetail.eligibilityTitle}</span>
              </h4>
              <ul className="criteria-checklist">
                {job.eligibilityCriteria.map((item, idx) => (
                  <li key={idx} className="criteria-item">
                    <CheckCircle2 size={16} className="criteria-icon text-emerald" />
                    <span dir="auto">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section: Syllabus / Exam Scheme (Govt specific) */}
          {isGovt && job.syllabus && (
            <div className="detail-section-block">
              <h4 className="detail-section-title">
                <BookOpen size={17} className="text-emerald" />
                <span>{t.jobDetail.syllabusTitle}</span>
              </h4>
              {Array.isArray(job.syllabus) ? (
                <div className="syllabus-container">
                  {job.syllabus.map((syl, idx) => (
                    <div key={idx} className="syllabus-item-card">
                      <span className="syl-number">0{idx + 1}</span>
                      <span className="syl-text" dir="auto">{syl}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 bg-surface-subtle border border-subtle rounded-lg text-sm text-secondary leading-relaxed" dir="auto">
                  {job.syllabus}
                </div>
              )}
            </div>
          )}

          {/* Official Gazette / Advertisement Source Box */}
          <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/60 rounded-lg flex items-center justify-between gap-3 flex-wrap my-4">
            <div className="flex items-center gap-2 text-xs text-emerald-950 font-medium">
              <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
              <span>Verified Source: {job.officialSourceLabel || 'Official Government Gazette Portal'}</span>
            </div>
            <a 
              href={job.officialNotificationUrl || job.officialUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline btn-xs flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <span>Full Details on Official Notification</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Similar Opportunities */}
          {relatedJobs.length > 0 && (
            <div className="detail-section-block related-section">
              <h4 className="detail-section-title">
                <Building2 size={17} className="text-emerald" />
                <span>{t.jobDetail.relatedOpenings}</span>
              </h4>
              <div className="related-jobs-grid">
                {relatedJobs.map((rJob) => (
                  <div 
                    key={rJob.id} 
                    className="related-job-item"
                    onClick={() => onSelectJob(rJob)}
                  >
                    <div className="related-job-title">{rJob.title}</div>
                    <div className="related-job-dept">{rJob.department || rJob.company} • {rJob.city}</div>
                    <div className="related-job-deadline">{t.jobCard.lastDate} {rJob.lastDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer Action Bar */}
        <div className="modal-sticky-footer">
          <div className="footer-share-cluster">
            {/* WhatsApp Share */}
            <button 
              className="btn btn-whatsapp"
              onClick={() => onShareWhatsApp(job)}
              title="Share on WhatsApp"
            >
              <Share2 size={16} />
              <span>WhatsApp</span>
            </button>

            {/* Copy Link */}
            <button 
              className="btn btn-ghost"
              onClick={handleCopyLink}
              title="Copy Job Link"
            >
              {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Bookmark */}
            <button 
              className={`btn btn-outline ${isSaved ? 'btn-saved' : ''}`}
              onClick={() => onToggleSave(job)}
              title={isSaved ? t.jobCard.saved : t.jobCard.save}
            >
              <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
              <span>{isSaved ? t.jobCard.saved : t.jobCard.save}</span>
            </button>
          </div>

          {/* Primary Action Button */}
          <a
            href={job.officialUrl || "https://tainaati.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-lg btn-primary direct-apply-btn"
          >
            <span>{t.jobDetail.applyOfficialPortal}</span>
            <ExternalLink size={17} />
          </a>
        </div>
      </div>
    </div>
  );
}
