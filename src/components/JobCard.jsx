import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  Flame, 
  Bookmark, 
  Share2, 
  ChevronRight, 
  GraduationCap, 
  Sparkles 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getJobLogoUrl, getJobLogoAlt } from '../utils/logoResolver';
import { calculateDaysLeft, isClosingSoon } from '../utils/jobMetrics';

export default function JobCard({ 
  job, 
  isSaved, 
  onToggleSave, 
  onShareWhatsApp 
}) {
  const { t, isRtl } = useLanguage();
  const isGovt = job.type === 'govt';

  // Calculate days remaining to deadline using centralized helper
  const daysLeft = calculateDaysLeft(job.lastDate);
  const isUrgent = isClosingSoon(job.lastDate, 3);

  const logoUrl = getJobLogoUrl(job);
  const logoAlt = getJobLogoAlt(job);

  return (
    <article className={`job-card-item ${isGovt ? 'govt-card-border' : 'tech-card-border'} ${job.featured ? 'featured-highlight' : ''}`}>
      {/* Card Header */}
      <div className="card-top-row">
        <div className="card-agency-box">
          <div className="card-logo-container">
            <Image 
              src={logoUrl} 
              alt={logoAlt} 
              className="card-official-logo"
              width={38}
              height={38}
              loading="lazy"
            />
          </div>
          <div className="card-dept-meta-col">
            <div className="card-dept-name">{job.department || job.company}</div>
            <div className="card-category-sub">{job.subCategory || job.category}</div>
          </div>
        </div>

        <div className="card-badges-group">
          {job.verified && (
            <span className="badge badge-verified" title="Cross-checked against official Gazette / Portal">
              <ShieldCheck size={12} />
              <span>{t.jobCard.verified}</span>
            </span>
          )}

          {isGovt && job.bpsScale && (
            <span className="badge badge-bps font-mono">
              {job.bpsScale}
            </span>
          )}

          {isUrgent && (
            <span className="badge badge-urgent">
              <Flame size={12} />
              <span>{t.jobCard.closingIn} {daysLeft}{t.jobCard.days}</span>
            </span>
          )}
        </div>
      </div>

      {/* Direct Clickable Title */}
      <h3 className="job-card-title">
        <Link 
          href={`/jobs/${job.id}`}
          className="job-card-title-link"
          title={`View full details for ${job.title}`}
        >
          {job.title}
        </Link>
      </h3>

      {/* Meta Grid */}
      <div className="card-meta-grid">
        <div className="meta-item">
          <MapPin size={14} className="text-muted flex-shrink-0" />
          <span className="truncate">{job.city}</span>
        </div>

        {job.vacancies && (
          <div className="meta-item">
            <Users size={14} className="text-muted flex-shrink-0" />
            <span><strong>{job.vacancies}</strong> {job.vacancies === 1 ? t.jobCard.vacancy : t.jobCard.vacancies}</span>
          </div>
        )}

        {job.qualification && (
          <div className="meta-item full-width-meta">
            <GraduationCap size={14} className="text-muted flex-shrink-0" />
            <span className="meta-qual-text">{job.qualification}</span>
          </div>
        )}
      </div>

      {/* Bottom Action Strip with Direct Detail Link */}
      <div className="card-footer-row">
        <div className="card-deadline-info">
          <Clock size={13} className={isUrgent ? 'text-amber-500' : 'text-muted'} />
          <span className={`text-xs ${isUrgent ? 'font-bold text-amber-500' : 'text-secondary'}`}>
            {t.jobCard.deadline}: {job.lastDate}
          </span>
        </div>

        <div className="card-actions-cluster">
          {onToggleSave && (
            <button 
              onClick={() => onToggleSave(job)}
              className={`card-icon-btn ${isSaved ? 'saved' : ''}`}
              title={isSaved ? t.jobCard.removeSaved : t.jobCard.saveJob}
              aria-label="Save Job"
            >
              <Bookmark size={15} className={isSaved ? 'fill-emerald-500 text-emerald-500' : ''} />
            </button>
          )}

          {onShareWhatsApp && (
            <button 
              onClick={() => onShareWhatsApp(job)}
              className="card-icon-btn whatsapp-share-btn"
              title={t.jobCard.shareWhatsApp}
              aria-label="Share via WhatsApp"
            >
              <Share2 size={15} />
            </button>
          )}

          {/* Direct Navigation Button to Detail Page */}
          <Link 
            href={`/jobs/${job.id}`}
            className="btn btn-sm btn-primary card-view-btn"
            title={`View full details for ${job.title}`}
          >
            <span>{t.jobCard.viewDetails}</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
