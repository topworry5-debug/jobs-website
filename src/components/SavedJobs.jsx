'use client';

import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  Clock, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Flame,
  ArrowRight
} from 'lucide-react';

export default function SavedJobs({
  savedJobIds,
  allJobs,
  onSelectJob,
  onToggleSave,
  onSwitchTab
}) {
  const [jobStatuses, setJobStatuses] = useState({});

  const savedJobsList = allJobs.filter(j => savedJobIds.includes(j.id));

  const handleStatusChange = (jobId, status) => {
    setJobStatuses(prev => ({
      ...prev,
      [jobId]: status
    }));
  };

  return (
    <div className="saved-jobs-page-container">
      <div className="container-xl">
        {/* Header */}
        <div className="saved-header-card">
          <div className="saved-header-content">
            <div className="badge badge-govt mb-2">
              <Bookmark size={13} fill="currentColor" />
              <span>Personal Career Tracker</span>
            </div>
            <h1 className="saved-main-title">Bookmarked Positions & Application Status</h1>
            <p className="saved-main-desc">
              Track deadlines, organize requirements, and manage your public & private sector applications in one place.
            </p>
          </div>
        </div>

        {/* Content List */}
        {savedJobsList.length > 0 ? (
          <div className="saved-jobs-grid">
            {savedJobsList.map((job) => {
              const currentStatus = jobStatuses[job.id] || 'Saved';
              const isGovt = job.type === 'govt';
              return (
                <div key={job.id} className="saved-job-card card">
                  <div className="saved-card-top">
                    <div className="saved-dept-row">
                      <span className={`badge ${isGovt ? 'badge-govt' : 'badge-private'}`}>
                        {isGovt ? job.bpsScale || 'Govt' : 'Tech'}
                      </span>
                      <span className="saved-dept-text" dir="auto">{job.department || job.company}</span>
                    </div>

                    <button 
                      className="remove-saved-btn"
                      onClick={() => onToggleSave(job)}
                      title="Remove from saved"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <h3 className="saved-job-title" onClick={() => onSelectJob(job)} dir="auto">
                    {job.title}
                  </h3>

                  <div className="saved-meta-row">
                    <div className="meta-sub-item">
                      <MapPin size={14} className="text-muted" />
                      <span dir="auto">{job.city}</span>
                    </div>
                    <div className="meta-sub-item">
                      <Clock size={14} className="text-red" />
                      <span>Last Date: <strong>{job.lastDate}</strong></span>
                    </div>
                  </div>

                  {/* Status Pipeline Picker */}
                  <div className="status-pipeline-box">
                    <span className="pipeline-label">Application Status:</span>
                    <div className="pipeline-pills">
                      {['Saved', 'Applied', 'Test Scheduled', 'Interview'].map((st) => (
                        <button
                          key={st}
                          className={`pipeline-pill ${currentStatus === st ? 'active' : ''}`}
                          onClick={() => handleStatusChange(job.id, st)}
                        >
                          {currentStatus === st && <CheckCircle2 size={12} />}
                          <span>{st}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="saved-card-actions">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => onSelectJob(job)}
                    >
                      <span>View Specifications</span>
                    </button>
                    <a
                      href={job.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                    >
                      <span>Official Portal</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="saved-empty-state card">
            <div className="empty-icon-circle">
              <Bookmark size={36} className="text-muted" />
            </div>
            <h3 className="empty-title">You haven't saved any positions yet</h3>
            <p className="empty-desc">
              Browse Government or Private jobs and click the bookmark icon to track upcoming deadlines here.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => onSwitchTab('all')}
            >
              <span>Explore Active Openings</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
