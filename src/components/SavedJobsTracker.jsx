'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
  Layers, 
  Calendar, 
  FileText, 
  Send,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  X,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { JOBS_DATA } from '../data/jobsData';
import { useLanguage } from '../context/LanguageContext';
import { isClosingSoon, calculateDaysLeft } from '../utils/jobMetrics';
import { getJobDeadlineInfo } from '../utils/jobStatus';

const STATUS_OPTIONS = [
  { id: 'Saved', label: 'Bookmarked', color: 'bg-blue-500/10 text-blue-600 border-blue-500/30' },
  { id: 'Applied', label: 'Applied', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' },
  { id: 'Interview Scheduled', label: 'Interview Scheduled', color: 'bg-purple-500/10 text-purple-600 border-purple-500/30' },
  { id: 'Result Awaited', label: 'Result Awaited', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
  { id: 'Closed', label: 'Closed / Archived', color: 'bg-gray-500/10 text-gray-500 border-gray-500/30' }
];

export default function SavedJobsTracker() {
  const { t } = useLanguage();
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [applicationData, setApplicationData] = useState({});
  const [activeTab, setActiveTab] = useState('all'); // 'all' | status
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tainaati_saved_jobs') || '[]');
      const apps = JSON.parse(localStorage.getItem('tainaati_job_applications') || '{}');
      setSavedJobIds(Array.isArray(saved) ? saved : []);
      setApplicationData(apps && typeof apps === 'object' ? apps : {});
    } catch (e) {
      console.error('Error loading saved jobs:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  const updateApplications = (newApps) => {
    setApplicationData(newApps);
    try {
      localStorage.setItem('tainaati_job_applications', JSON.stringify(newApps));
    } catch (e) {
      console.error('Failed to save application tracker status:', e);
    }
  };

  const handleStatusChange = (jobId, newStatus) => {
    const prev = applicationData[jobId] || {};
    const updated = {
      ...applicationData,
      [jobId]: {
        ...prev,
        status: newStatus,
        updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
    };
    updateApplications(updated);
  };

  const handleSaveNote = (jobId) => {
    const prev = applicationData[jobId] || {};
    const updated = {
      ...applicationData,
      [jobId]: {
        ...prev,
        notes: noteInput.trim(),
        updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
    };
    updateApplications(updated);
    setEditingNoteId(null);
    setNoteInput('');
  };

  const handleRemoveSaved = (jobId) => {
    const updatedIds = savedJobIds.filter(id => id !== jobId);
    setSavedJobIds(updatedIds);
    try {
      localStorage.setItem('tainaati_saved_jobs', JSON.stringify(updatedIds));
      window.dispatchEvent(new Event('tainaati_saved_jobs_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  // Find job objects
  const savedJobs = useMemo(() => {
    return savedJobIds
      .map(id => JOBS_DATA.find(j => j.id === id))
      .filter(Boolean);
  }, [savedJobIds]);

  // Metric counts
  const metrics = useMemo(() => {
    const counts = {
      total: savedJobs.length,
      Saved: 0,
      Applied: 0,
      'Interview Scheduled': 0,
      'Result Awaited': 0,
      Closed: 0
    };

    savedJobs.forEach(job => {
      const st = applicationData[job.id]?.status || 'Saved';
      if (counts[st] !== undefined) {
        counts[st]++;
      } else {
        counts.Saved++;
      }
    });

    return counts;
  }, [savedJobs, applicationData]);

  // Filtered jobs by active tab
  const filteredJobs = useMemo(() => {
    if (activeTab === 'all') return savedJobs;
    return savedJobs.filter(job => {
      const st = applicationData[job.id]?.status || 'Saved';
      return st === activeTab;
    });
  }, [savedJobs, applicationData, activeTab]);

  if (!isLoaded) {
    return (
      <div className="container-xl py-12 text-center text-muted">
        <div className="spinner mx-auto mb-3" />
        <p>Loading your personal career tracker...</p>
      </div>
    );
  }

  return (
    <div className="saved-jobs-tracker-container container-xl py-4">
      {/* Header Banner */}
      <div className="card p-5 mb-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
          <div>
            <div className="badge badge-govt mb-2">
              <Bookmark size={13} fill="currentColor" />
              <span>Personal Career Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-main">
              Saved Jobs & Application Tracker
            </h1>
            <p className="text-secondary text-sm md:text-base max-w-2xl mt-1">
              Track deadlines, record challan details, and advance your applications through every stage — completely private and stored securely on your browser.
            </p>
          </div>

          <Link href="/" className="btn btn-sm btn-outline text-xs self-start md:self-auto flex items-center gap-1.5">
            <span>Browse All Vacancies</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Dashboard Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-5">
          <div 
            onClick={() => setActiveTab('all')}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${activeTab === 'all' ? 'border-emerald-500 bg-emerald-500/10' : 'border-theme bg-subtle hover:border-theme-hover'}`}
          >
            <div className="text-xs text-muted font-medium">Total Tracked</div>
            <div className="text-2xl font-bold text-main font-mono mt-0.5">{metrics.total}</div>
          </div>

          <div 
            onClick={() => setActiveTab('Applied')}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${activeTab === 'Applied' ? 'border-emerald-500 bg-emerald-500/10' : 'border-theme bg-subtle hover:border-theme-hover'}`}
          >
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Applied</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{metrics.Applied}</div>
          </div>

          <div 
            onClick={() => setActiveTab('Interview Scheduled')}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${activeTab === 'Interview Scheduled' ? 'border-purple-500 bg-purple-500/10' : 'border-theme bg-subtle hover:border-theme-hover'}`}
          >
            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Interviews</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono mt-0.5">{metrics['Interview Scheduled']}</div>
          </div>

          <div 
            onClick={() => setActiveTab('Result Awaited')}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${activeTab === 'Result Awaited' ? 'border-amber-500 bg-amber-500/10' : 'border-theme bg-subtle hover:border-theme-hover'}`}
          >
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Result Awaited</div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">{metrics['Result Awaited']}</div>
          </div>

          <div 
            onClick={() => setActiveTab('Closed')}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${activeTab === 'Closed' ? 'border-gray-500 bg-gray-500/10' : 'border-theme bg-subtle hover:border-theme-hover'}`}
          >
            <div className="text-xs text-secondary font-medium">Closed / Archived</div>
            <div className="text-2xl font-bold text-secondary font-mono mt-0.5">{metrics.Closed}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'} text-xs`}
        >
          All Positions ({savedJobs.length})
        </button>
        {STATUS_OPTIONS.map((st) => (
          <button
            key={st.id}
            onClick={() => setActiveTab(st.id)}
            className={`btn btn-sm ${activeTab === st.id ? 'btn-primary' : 'btn-outline'} text-xs`}
          >
            {st.label} ({metrics[st.id] || 0})
          </button>
        ))}
      </div>

      {/* Job Cards List */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-3">
          {filteredJobs.map((job) => {
            const app = applicationData[job.id] || {};
            const currentStatus = app.status || 'Saved';
            const daysLeft = calculateDaysLeft(job.lastDate);
            const deadlineInfo = getJobDeadlineInfo(job.lastDate, job.status);
            const isGovt = job.type === 'govt';

            return (
              <div key={job.id} className="card p-4 space-y-3 border-theme hover:border-emerald-500/40 transition-all">
                {/* Card Top Row */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${isGovt ? 'badge-govt' : 'badge-private'}`}>
                        {isGovt ? job.bpsScale || 'Govt' : 'Private'}
                      </span>
                      {deadlineInfo.isClosingToday && (
                        <span className="badge badge-closing-today text-[10px] py-0.5">Closes today</span>
                      )}
                      {deadlineInfo.isExpired && (
                        <span className="badge badge-expired text-[10px] py-0.5">Closed</span>
                      )}
                      <span className="text-xs text-muted truncate max-w-xs">{job.department || job.company}</span>
                    </div>
                    <h2 className="text-base font-bold text-main">
                      <Link href={`/jobs/${job.id}`} className="hover:text-emerald-500 transition-colors">
                        {job.title}
                      </Link>
                    </h2>
                  </div>

                  <button
                    onClick={() => handleRemoveSaved(job.id)}
                    className="text-muted hover:text-rose-500 p-1 rounded transition-colors self-end sm:self-auto"
                    title="Remove from saved jobs"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Card Meta & Deadline */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-secondary border-t border-b border-theme py-2">
                  <div className="flex items-center gap-1">
                    <MapPin size={13} className="text-muted" />
                    <span>{job.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={13} className={deadlineInfo.isClosingToday || deadlineInfo.isUrgent ? 'text-red-500' : 'text-muted'} />
                    <span className={deadlineInfo.isClosingToday || deadlineInfo.isUrgent ? 'font-bold text-red-600 dark:text-red-400' : deadlineInfo.isExpired ? 'text-muted' : ''}>
                      Last Date: {job.lastDate} {deadlineInfo.isExpired ? '(Applications Closed)' : deadlineInfo.isClosingToday ? '(Closes today)' : deadlineInfo.isUrgent ? `(${daysLeft} days left)` : ''}
                    </span>
                  </div>
                  {job.challanFee && (
                    <div className="flex items-center gap-1">
                      <FileText size={13} className="text-muted" />
                      <span>Challan / Fee: {job.challanFee}</span>
                    </div>
                  )}
                </div>

                {/* Application Stage Pipeline Selector */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-semibold text-secondary mr-1">Status:</span>
                    {STATUS_OPTIONS.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => handleStatusChange(job.id, st.id)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                          currentStatus === st.id 
                            ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-sm' 
                            : 'bg-subtle text-secondary border-theme hover:border-emerald-500/50'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="btn btn-sm btn-outline text-xs"
                    >
                      View Details
                    </Link>
                    {job.officialUrl && (
                      <a
                        href={job.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary text-xs flex items-center gap-1"
                      >
                        <span>Official Apply</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Private Application Notes Box */}
                <div className="pt-2">
                  {editingNoteId === job.id ? (
                    <div className="space-y-2 bg-subtle p-2.5 rounded-lg border border-theme">
                      <label className="text-xs font-semibold text-secondary block">
                        Application Notes (Token #, Challan Details, Roll No):
                      </label>
                      <textarea
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="e.g. Paid Rs. 600 via JazzCash PSID 99401... Roll No Slip pending."
                        className="input-field w-full text-xs"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="btn btn-sm btn-outline text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNote(job.id)}
                          className="btn btn-sm btn-primary text-xs"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-xs text-muted">
                      {app.notes ? (
                        <div className="bg-subtle px-2.5 py-1.5 rounded border border-theme text-secondary max-w-xl truncate">
                          <strong className="text-main">Note:</strong> {app.notes}
                        </div>
                      ) : (
                        <span className="text-muted italic">No notes recorded yet.</span>
                      )}

                      <button
                        onClick={() => {
                          setEditingNoteId(job.id);
                          setNoteInput(app.notes || '');
                        }}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                      >
                        {app.notes ? 'Edit Note' : '+ Add Note / Tracking Token'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center space-y-4">
          <Bookmark size={40} className="text-muted mx-auto" />
          <h2 className="text-lg font-bold text-main">
            {savedJobs.length === 0 ? 'No Saved Jobs Yet' : `No Jobs in "${activeTab}" Status`}
          </h2>
          <p className="text-secondary text-sm max-w-md mx-auto">
            {savedJobs.length === 0 
              ? 'Click the bookmark icon on any job card across the site to save and track your applications here.'
              : 'You have no applications marked under this status category.'}
          </p>
          <Link href="/" className="btn btn-primary btn-sm mx-auto inline-flex items-center gap-2">
            <span>Explore Active Vacancies</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
