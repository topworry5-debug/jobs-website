'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Flame, 
  Bookmark, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getJobDeadlineInfo, isJobExpired } from '../utils/jobStatus';

export default function JobCard({ 
  job, 
  isSaved, 
  onToggleSave 
}) {
  const { t, isRtl } = useLanguage();
  if (!job) return null;

  const isGovt = job.type === 'govt';
  const deadlineInfo = getJobDeadlineInfo(job.lastDate, job.status);
  const { isExpired, isClosingToday, isUrgent, isClosingSoon, daysLeft } = deadlineInfo;

  return (
    <article 
      className={`job-card-item ${isGovt ? 'govt-card-border' : 'tech-card-border'} ${job.featured ? 'featured-highlight' : ''} ${isExpired ? 'job-card-expired' : ''}`}
    >
      {/* 1. TOP ROW: Category / BPS Badge (Left) & Bookmark (Right) */}
      <div className="card-top-row">
        <div className="card-badge-cluster">
          {isClosingToday ? (
            <span className="badge badge-closing-today" title="Deadline expires today!">
              <Flame size={12} className="text-amber-300 animate-pulse" />
              <span>{t.jobCard?.closesToday || "Closes today"}</span>
            </span>
          ) : isExpired ? (
            <span className="badge badge-expired" title="Application deadline has passed">
              <AlertCircle size={12} />
              <span>{t.jobCard?.applicationsClosed || "Closed"}</span>
            </span>
          ) : isUrgent ? (
            <span className="badge badge-urgent" title={`Closing in ${daysLeft} days`}>
              <Flame size={12} />
              <span>{daysLeft}d left</span>
            </span>
          ) : (
            <span className={`badge ${isGovt ? 'badge-govt' : 'badge-private'}`}>
              {isGovt ? (job.bpsScale || 'Govt Gazette') : (job.category || 'Corporate')}
            </span>
          )}

          {job.verified && !isExpired && (
            <span className="badge badge-verified" title="Cross-checked against official Gazette / Commission Notice">
              <CheckCircle2 size={11} />
              <span>{t.jobCard?.verified || "Verified"}</span>
            </span>
          )}
        </div>

        {/* Bookmark Icon Button (44px touch target on mobile) */}
        {onToggleSave && (
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSave(job);
            }}
            className={`card-bookmark-btn ${isSaved ? 'saved' : ''}`}
            title={isSaved ? (t.jobCard?.saved || "Saved") : (t.jobCard?.save || "Save Job")}
            aria-label={isSaved ? "Remove from saved jobs" : "Save this job"}
          >
            <Bookmark size={16} className={isSaved ? "fill-emerald-500 text-emerald-500" : ""} />
          </button>
        )}
      </div>

      {/* 2. MIDDLE CONTENT: Title (Fraunces Serif 18px, 2-line clamp) & Organization */}
      <div className="card-body-content">
        <h3 className="job-card-title" dir="auto">
          <Link 
            href={`/jobs/${job.id}`}
            className="job-card-title-link"
            title={job.title}
          >
            {job.title}
          </Link>
        </h3>

        <div className="card-org-name" dir="auto" title={job.department || job.company}>
          <Building2 size={13} className="text-muted flex-shrink-0" />
          <span className="truncate">{job.department || job.company}</span>
        </div>

        {/* Location & Vacancies Row */}
        <div className="card-meta-row">
          <div className="meta-item location-meta">
            <MapPin size={13} className="text-muted flex-shrink-0" />
            <span className="truncate" dir="auto">{job.city}</span>
          </div>

          {job.vacancies && (
            <div className="meta-item vacancy-meta">
              <Users size={13} className="text-muted flex-shrink-0" />
              <span><strong>{job.vacancies}</strong> {job.vacancies === 1 ? (t.jobCard?.vacancy || "Vacancy") : (t.jobCard?.vacancies || "Vacancies")}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. FOOTER ROW: Deadline (Left) & Apply CTA (Right) */}
      <div className="card-footer-row">
        <div className="card-deadline-box">
          {isExpired ? (
            <div className="deadline-indicator text-expired">
              <Clock size={13} className="text-muted flex-shrink-0" />
              <span className="text-xs text-muted font-medium">{t.jobCard?.applicationsClosed || "Closed"}</span>
            </div>
          ) : isClosingToday ? (
            <div className="deadline-indicator text-today">
              <Flame size={13} className="text-red-500 flex-shrink-0 animate-pulse" />
              <span className="text-xs font-bold text-red-600 dark:text-red-400">
                {t.jobCard?.closesToday || "Closes today"}
              </span>
            </div>
          ) : isUrgent ? (
            <div className="deadline-indicator text-urgent">
              <Clock size={13} className="text-red-500 flex-shrink-0" />
              <span className="text-xs font-bold text-red-600 dark:text-red-400">
                {daysLeft}d left
              </span>
            </div>
          ) : isClosingSoon ? (
            <div className="deadline-indicator text-soon">
              <Clock size={13} className="text-amber-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                {daysLeft}d left
              </span>
            </div>
          ) : (
            <div className="deadline-indicator text-normal">
              <Clock size={13} className="text-emerald-500 flex-shrink-0" />
              <span className="text-xs text-secondary font-medium">
                {daysLeft}d left
              </span>
            </div>
          )}
        </div>

        {/* Call to Action: "Apply →" in emerald/gold theme */}
        <Link 
          href={`/jobs/${job.id}`}
          className={`job-card-apply-btn ${isExpired ? 'apply-btn-closed' : ''}`}
          title={`View full details and application instructions for ${job.title}`}
        >
          <span>{isExpired ? (t.jobCard?.details || "Details") : (t.jobCard?.apply || "Apply")}</span>
          <ArrowRight size={14} className="apply-arrow-icon" />
        </Link>
      </div>
    </article>
  );
}
