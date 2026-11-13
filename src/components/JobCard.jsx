'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Bookmark, 
  ArrowRight,
  ExternalLink,
  Users
} from 'lucide-react';
import { 
  toTitleCase, 
  formatLocations, 
  getDisplayTitle, 
  formatJobDeadline 
} from '../utils/textCleaning';

export default function JobCard({ 
  job, 
  isSaved = false, 
  onToggleSave 
}) {
  if (!job) return null;

  const { displayTitle, originalTitle } = getDisplayTitle(job);
  const cleanDept = toTitleCase(job.department || job.company || '');
  const { display: cityDisplay, full: fullCity } = formatLocations(job.city);
  const deadline = formatJobDeadline(job.lastDate, job.status);
  const hasSource = Boolean(job.sourceUrl);
  const jobUrl = `/jobs/${job.slug || job.id}`;

  return (
    <article className={`job-row-item ${deadline.isClosed ? 'job-row-closed' : ''}`}>
      {/* Main Info Column (Left) */}
      <div className="job-row-main">
        {/* Row 1: Title + Source Linked Badge */}
        <div className="job-row-title-line">
          <Link 
            href={jobUrl}
            className="job-row-title-link"
            title={originalTitle || displayTitle}
          >
            {displayTitle}
          </Link>

          {hasSource && (
            <span className="badge-source-linked" title="Direct official source advertisement link available">
              <ExternalLink size={11} aria-hidden="true" />
              <span>Source linked</span>
            </span>
          )}
        </div>

        {/* Row 2: Department / Agency */}
        <div className="job-row-dept-line" title={cleanDept}>
          <Building2 size={13} className="text-muted flex-shrink-0" aria-hidden="true" />
          <span className="job-row-dept-name">{cleanDept}</span>
          {originalTitle && originalTitle !== displayTitle && (
            <span className="job-row-original-tag" title={originalTitle}>
              (Ad: {originalTitle})
            </span>
          )}
        </div>

        {/* Row 3: Meta Line (BPS, Vacancies, City) - Never wraps */}
        <div className="job-row-meta-line">
          {job.bpsScale && (
            <span className="job-row-meta-badge badge-bps font-mono">
              {job.bpsScale.startsWith('BPS') || job.bpsScale.startsWith('BS') ? job.bpsScale : `BPS-${job.bpsScale}`}
            </span>
          )}

          {job.vacancies && job.vacancies > 0 && (
            <span className="job-row-meta-pill">
              <Users size={12} className="text-muted" aria-hidden="true" />
              <span>{job.vacancies} {job.vacancies === 1 ? 'post' : 'posts'}</span>
            </span>
          )}

          <span className="job-row-meta-pill" title={fullCity}>
            <MapPin size={12} className="text-muted flex-shrink-0" aria-hidden="true" />
            <span className="job-row-city-text">{cityDisplay}</span>
          </span>
        </div>
      </div>

      {/* Right Column: Bookmark + Last Date + View Details CTA */}
      <div className="job-row-side">
        {/* Bookmark Button */}
        {onToggleSave && (
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSave(job);
            }}
            className={`job-row-bookmark-btn ${isSaved ? 'saved' : ''}`}
            title={isSaved ? "Saved" : "Save job"}
            aria-label={isSaved ? "Remove from saved jobs" : "Save this job"}
          >
            <Bookmark size={16} className={isSaved ? "fill-brand-primary text-brand-primary" : ""} />
          </button>
        )}

        {/* Deadline Box: Real Date + Relative Label */}
        <div className="job-row-deadline-box tabular-nums">
          <span className="job-row-real-date">{deadline.dateFormatted}</span>
          <span className={`job-row-relative-label ${deadline.isClosed ? 'closed' : deadline.isUrgent ? 'urgent' : 'normal'}`}>
            <Clock size={11} aria-hidden="true" />
            <span>{deadline.relativeLabel}</span>
          </span>
        </div>

        {/* View Details Primary Button (Not "Apply") */}
        <Link 
          href={jobUrl}
          className="job-row-cta-btn"
          title={`View details for ${displayTitle}`}
        >
          <span>View details</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
