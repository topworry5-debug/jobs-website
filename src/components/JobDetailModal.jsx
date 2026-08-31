'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  GraduationCap, 
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
  Sparkles,
  Flame,
  ArrowRight
} from 'lucide-react';
import { generateJobPostingSchema } from '../utils/seoHelpers';

export default function JobDetailModal({
  job,
  onClose,
  allJobs,
  onSelectJob,
  isSaved,
  onToggleSave,
  onShareWhatsApp,
  onShareFacebook
}) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const isGovt = job.type === 'govt';

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
              {isGovt ? 'Government of Pakistan' : 'Verified Private Opportunity'}
            </span>
            {job.verified && (
              <span className="badge badge-verified">
                <ShieldCheck size={13} />
                <span>Verified Cross-Checked</span>
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
              <div className={`detail-avatar-box ${isGovt ? 'govt' : 'tech'}`}>
                {isGovt ? <Building2 size={26} /> : <Sparkles size={26} />}
              </div>
              <div className="detail-title-block">
                <h2 className="detail-job-title">{job.title}</h2>
                <div className="detail-dept-row">
                  <span className="detail-org-name">{job.department || job.company}</span>
                  {job.bpsScale && <span className="bps-pill">{job.bpsScale}</span>}
                </div>
              </div>
            </div>

            {/* Official Source Reference */}
            {job.officialSourceLabel && (
              <div className="official-source-bar">
                <ShieldCheck size={15} className="text-emerald" />
                <span>Source: <strong>{job.officialSourceLabel}</strong> • Last verified: <strong>{job.lastVerifiedDate || "August 30, 2026"}</strong></span>
              </div>
            )}
          </div>

          {/* Live Application Deadline Countdown Card */}
          <div className="deadline-countdown-banner">
            <div className="countdown-info">
              <div className="countdown-label">
                <Clock size={16} />
                <span>Application Deadline Countdown</span>
              </div>
              <div className="countdown-date">
                Last Date: <strong>{job.lastDate}</strong> (11:59 PM PST)
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
            <div className="spec-box">
              <span className="spec-label">Location / Posting</span>
              <span className="spec-value">
                <MapPin size={15} className="text-emerald" />
                {job.city}
              </span>
            </div>

            <div className="spec-box">
              <span className="spec-label">Total Vacancies</span>
              <span className="spec-value">
                <Users size={15} className="text-emerald" />
                {job.vacancies} {job.vacancies === 1 ? 'Position' : 'Openings'}
              </span>
            </div>

            {isGovt && job.ageLimit && (
              <div className="spec-box">
                <span className="spec-label">Age Limit (Govt)</span>
                <span className="spec-value">{job.ageLimit}</span>
              </div>
            )}

            {isGovt && job.challanFee && (
              <div className="spec-box">
                <span className="spec-label">Challan Examination Fee</span>
                <span className="spec-value">{job.challanFee}</span>
              </div>
            )}

            {!isGovt && job.salaryRange && (
              <div className="spec-box">
                <span className="spec-label">Remuneration Package</span>
                <span className="spec-value">{job.salaryRange}</span>
              </div>
            )}

            {!isGovt && job.experience && (
              <div className="spec-box">
                <span className="spec-label">Required Experience</span>
                <span className="spec-value">{job.experience}</span>
              </div>
            )}
          </div>

          {/* Section: Job Description */}
          <div className="detail-section-block">
            <h4 className="detail-section-title">
              <FileText size={17} className="text-emerald" />
              <span>Job Overview & Purpose</span>
            </h4>
            <p className="detail-text-p">{job.description}</p>
          </div>

          {/* Section: Quota Breakdown (Govt specific) */}
          {isGovt && job.quota && (
            <div className="detail-section-block">
              <h4 className="detail-section-title">
                <Users size={17} className="text-emerald" />
                <span>Provincial & Regional Quota Allocation</span>
              </h4>
              <div className="quota-display-card">
                {job.quota.split('|').map((q, idx) => (
                  <div key={idx} className="quota-item-pill">
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
                <span>Eligibility & Minimum Qualifications</span>
              </h4>
              <ul className="criteria-checklist">
                {job.eligibilityCriteria.map((item, idx) => (
                  <li key={idx} className="criteria-item">
                    <CheckCircle2 size={16} className="criteria-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section: Syllabus / Exam Scheme (Govt specific) */}
          {isGovt && job.syllabus && job.syllabus.length > 0 && (
            <div className="detail-section-block">
              <h4 className="detail-section-title">
                <BookOpen size={17} className="text-emerald" />
                <span>Screening Syllabus & Marks Distribution</span>
              </h4>
              <div className="syllabus-container">
                {job.syllabus.map((syl, idx) => (
                  <div key={idx} className="syllabus-item-card">
                    <span className="syl-number">0{idx + 1}</span>
                    <span className="syl-text">{syl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Benefits & Perks (Private/Tech specific) */}
          {!isGovt && job.benefits && (
            <div className="detail-section-block">
              <h4 className="detail-section-title">
                <Sparkles size={17} className="text-blue" />
                <span>Benefits & Perks</span>
              </h4>
              <div className="benefits-grid">
                {job.benefits.map((benefit, idx) => (
                  <div key={idx} className="benefit-card">
                    <Sparkles size={14} className="text-blue" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: How to Apply Steps */}
          {job.howToApply && job.howToApply.length > 0 && (
            <div className="detail-section-block">
              <h4 className="detail-section-title">
                <CheckCircle2 size={17} className="text-emerald" />
                <span>Step-by-Step Application Instructions</span>
              </h4>
              <div className="apply-steps-list">
                {job.howToApply.map((step, idx) => (
                  <div key={idx} className="apply-step-row">
                    <div className="step-badge">Step {idx + 1}</div>
                    <div className="step-content">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Portal Notice Alert */}
          <div className="official-disclaimer-card">
            <AlertTriangle size={18} className="disclaimer-icon" />
            <div className="disclaimer-text">
              <strong>Official Direct Portal Submission Notice:</strong> RozgarPK is an informational and intelligence portal. We do not charge any application fee. All government applications must be submitted directly through the official commission / department portal.
            </div>
          </div>

          {/* Similar Opportunities */}
          {relatedJobs.length > 0 && (
            <div className="detail-section-block related-section">
              <h4 className="detail-section-title">
                <Building2 size={17} className="text-emerald" />
                <span>Similar Active Openings</span>
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
                    <div className="related-job-deadline">Last Date: {rJob.lastDate}</div>
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

            {/* Facebook Share */}
            <button 
              className="btn btn-outline"
              onClick={() => onShareFacebook(job)}
              title="Share on Facebook"
            >
              <span>Facebook</span>
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
              title={isSaved ? "Saved" : "Save Job"}
            >
              <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          {/* Primary Action Button */}
          <a
            href={job.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-lg btn-primary direct-apply-btn"
          >
            <span>Apply on Official Portal</span>
            <ExternalLink size={17} />
          </a>
        </div>
      </div>
    </div>
  );
}
