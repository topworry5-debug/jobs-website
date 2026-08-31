import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  Flame, 
  Bookmark, 
  Share2, 
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Sparkles
} from 'lucide-react';

export default function JobCard({ 
  job, 
  onSelect, 
  isSaved, 
  onToggleSave,
  onShareWhatsApp,
  onShareFacebook
}) {
  const isGovt = job.type === 'govt';

  // Calculate days remaining to deadline
  const calculateDaysLeft = (dateStr) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysLeft(job.lastDate);
  const isUrgent = daysLeft <= 3 && daysLeft >= 0;

  return (
    <article className={`job-card-item ${isGovt ? 'govt-card-border' : 'tech-card-border'} ${job.featured ? 'featured-highlight' : ''}`}>
      {/* Card Header */}
      <div className="card-top-row">
        <div className="card-agency-box">
          <div className={`dept-icon-circle ${isGovt ? 'govt-bg' : 'tech-bg'}`}>
            {isGovt ? <Building2 size={16} /> : <Sparkles size={16} />}
          </div>
          <div>
            <div className="card-dept-name">{job.department || job.company}</div>
            <div className="card-category-sub">{job.subCategory || job.category}</div>
          </div>
        </div>

        <div className="card-badges-group">
          {job.verified && (
            <span className="badge badge-verified" title="Cross-checked against official Gazette / Portal">
              <ShieldCheck size={12} />
              <span>Verified</span>
            </span>
          )}

          {isGovt && job.bpsScale && (
            <span className="badge badge-bps">
              {job.bpsScale}
            </span>
          )}

          {isUrgent && (
            <span className="badge badge-urgent">
              <Flame size={12} />
              <span>Closing in {daysLeft}d</span>
            </span>
          )}
        </div>
      </div>

      {/* Title with Direct Link */}
      <h3 className="job-card-title">
        <Link href={`/jobs/${job.id}`} onClick={(e) => {
          if (onSelect) {
            e.preventDefault();
            onSelect(job);
          }
        }}>
          {job.title}
        </Link>
      </h3>

      {/* Meta Grid */}
      <div className="card-meta-grid">
        <div className="meta-item">
          <MapPin size={14} className="text-muted" />
          <span>{job.city}</span>
        </div>

        {job.vacancies && (
          <div className="meta-item">
            <Users size={14} className="text-muted" />
            <span><strong>{job.vacancies}</strong> {job.vacancies === 1 ? 'Vacancy' : 'Vacancies'}</span>
          </div>
        )}

        {isGovt && job.quota && (
          <div className="meta-item full-width-meta">
            <span className="quota-tag-label">Quota:</span>
            <span className="quota-tag-text">{job.quota.split('|')[0]}...</span>
          </div>
        )}

        {!isGovt && job.salaryRange && (
          <div className="meta-item full-width-meta">
            <span className="salary-tag-text">{job.salaryRange}</span>
          </div>
        )}

        <div className="meta-item qualification-meta">
          <GraduationCap size={14} className="text-muted" />
          <span className="truncate-text">{job.qualification}</span>
        </div>

        <div className="meta-item full-width-meta verified-timestamp-meta">
          <ShieldCheck size={13} className="text-emerald" />
          <span>Last verified on <strong>{job.lastVerifiedDate || "August 31, 2026"}</strong></span>
        </div>
      </div>

      {/* Deadline & Actions Footer */}
      <div className="card-footer-row">
        <div className="deadline-badge-group">
          <Clock size={14} className={isUrgent ? 'text-red' : 'text-muted'} />
          <span className={`deadline-text ${isUrgent ? 'deadline-urgent' : ''}`}>
            Last Date: <strong>{job.lastDate}</strong>
          </span>
        </div>

        <div className="card-actions-group">
          {/* WhatsApp Share Button */}
          {onShareWhatsApp && (
            <button 
              className="card-icon-btn whatsapp" 
              onClick={(e) => {
                e.stopPropagation();
                onShareWhatsApp(job);
              }}
              title="Share on WhatsApp"
              aria-label="Share on WhatsApp"
            >
              <Share2 size={15} />
            </button>
          )}

          {/* Bookmark Button */}
          {onToggleSave && (
            <button 
              className={`card-icon-btn ${isSaved ? 'saved' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(job);
              }}
              title={isSaved ? "Saved in bookmarks" : "Save job"}
              aria-label="Save job"
            >
              <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
            </button>
          )}

          {/* View Details Primary Button */}
          <Link 
            href={`/jobs/${job.id}`}
            className="btn btn-sm btn-primary view-details-btn"
            onClick={(e) => {
              if (onSelect) {
                e.preventDefault();
                onSelect(job);
              }
            }}
          >
            <span>Details</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
