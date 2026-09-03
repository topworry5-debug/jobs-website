'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  X, 
  Building2, 
  MapPin, 
  ArrowRight, 
  Landmark, 
  Sparkles, 
  ShieldCheck,
  Clock,
  CornerDownLeft
} from 'lucide-react';
import { JOBS_DATA } from '../data/jobsData';
import { useLanguage } from '../context/LanguageContext';
import { isJobExpired } from '../utils/jobStatus';

export default function QuickSearchModal({
  isOpen,
  onClose,
  jobs = JOBS_DATA,
  onSelectJob,
  onSwitchTab
}) {
  const router = useRouter();
  const { t, isRtl } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const activeJobs = (jobs && jobs.length > 0 ? jobs : JOBS_DATA).filter(j => !isJobExpired(j));

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const filteredJobs = (searchTerm || '').trim().length > 0
    ? activeJobs.filter(j => {
        const queryTerms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
        const searchableText = `${j.title || ''} ${j.department || ''} ${j.company || ''} ${j.city || ''} ${j.agency || ''} ${j.bpsScale || ''} ${j.category || ''} ${j.qualification || ''}`.toLowerCase();
        return queryTerms.every(term => searchableText.includes(term));
      }).slice(0, 8)
    : activeJobs.slice(0, 5);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  // Keyboard navigation & global shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredJobs.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredJobs.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredJobs[selectedIndex]) {
          handleSelect(filteredJobs[selectedIndex]);
        } else if (searchTerm.trim()) {
          handleSearchAll(searchTerm.trim());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredJobs, selectedIndex, searchTerm]);

  const handleSelect = (job) => {
    onClose();
    if (onSelectJob) {
      onSelectJob(job);
    } else {
      router.push(`/jobs/${job.id}`);
    }
  };

  const handleSearchAll = (term) => {
    if (!term || !term.trim()) return;
    onClose();
    const q = term.trim();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tainaati:filter-change', {
        detail: { query: q, city: 'All Cities' }
      }));
    }
    router.push(`/?q=${encodeURIComponent(q)}#job-listings`);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay quick-search-overlay" onClick={onClose}>
      <div 
        className="quick-search-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Search Header Input */}
        <div className="quick-search-input-box">
          <Search size={20} className="quick-search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t.hero.searchPlaceholder || "Search by job title, department, BPS scale, or city..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="quick-search-input"
          />
          {searchTerm && (
            <button 
              className="quick-clear-btn" 
              onClick={() => setSearchTerm('')}
              title="Clear"
            >
              <X size={16} />
            </button>
          )}
          <button 
            className="quick-close-btn"
            onClick={onClose}
            title="Close (Esc)"
          >
            <kbd>ESC</kbd>
          </button>
        </div>

        {/* Results List */}
        <div className="quick-search-body">
          {filteredJobs.length > 0 ? (
            <div className="quick-results-list">
              <div className="quick-results-header">
                <span>{searchTerm ? `Results for "${searchTerm}"` : 'Recent Active Opportunities'}</span>
                <span className="text-[11px] font-mono opacity-70">↑↓ to navigate, Enter to select</span>
              </div>
              {filteredJobs.map((job, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={job.id}
                    className={`quick-result-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(job)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="quick-result-icon">
                      {job.type === 'govt' ? <Landmark size={16} className="text-emerald-500" /> : <Building2 size={16} className="text-blue-400" />}
                    </div>

                    <div className="quick-result-info">
                      <div className="quick-result-title-row">
                        <span className="quick-result-title" dir="auto">{job.title}</span>
                        {job.bpsScale && <span className="quick-result-bps font-mono">{job.bpsScale}</span>}
                        {job.verified && <ShieldCheck size={13} className="text-emerald-500 flex-shrink-0" />}
                      </div>
                      <div className="quick-result-meta" dir="auto">
                        <span dir="auto">{job.department || job.company}</span>
                        <span className="mx-1.5 opacity-40">•</span>
                        <span dir="auto">📍 {job.city}</span>
                        {job.lastDate && <span className="ml-2 text-muted text-[11px]">⏳ {job.lastDate}</span>}
                      </div>
                    </div>

                    <div className="quick-result-enter-hint">
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          Select <CornerDownLeft size={11} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {searchTerm.trim().length > 0 && (
                <div 
                  className="quick-result-item view-all-row"
                  onClick={() => handleSearchAll(searchTerm.trim())}
                >
                  <div className="quick-result-icon">
                    <Search size={16} className="text-amber-500" />
                  </div>
                  <div className="quick-result-info">
                    <span className="quick-result-title text-amber-500 font-semibold">
                      View all listings matching &ldquo;{searchTerm.trim()}&rdquo; on feed
                    </span>
                  </div>
                  <div className="quick-result-enter-hint">
                    <CornerDownLeft size={13} className="text-amber-500" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="quick-search-empty py-8 text-center">
              <p className="text-sm font-semibold text-primary mb-1">No matching positions found</p>
              <p className="text-xs text-muted mb-3">Try searching with a different keyword, BPS scale (e.g. BPS-17), or city.</p>
              {searchTerm.trim() && (
                <button
                  className="btn btn-outline btn-sm mx-auto"
                  onClick={() => handleSearchAll(searchTerm.trim())}
                >
                  Search &ldquo;{searchTerm.trim()}&rdquo; on main feed
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick Nav Footer Pills */}
        <div className="quick-search-footer">
          <span className="quick-footer-hint">Explore Sections:</span>
          <div className="quick-footer-pills">
            <button 
              className="quick-footer-pill"
              onClick={() => {
                onClose();
                router.push('/jobs/govt');
              }}
            >
              <Landmark size={13} className="text-emerald-500" />
              <span>Govt Jobs</span>
            </button>
            <button 
              className="quick-footer-pill"
              onClick={() => {
                onClose();
                router.push('/jobs/private');
              }}
            >
              <Sparkles size={13} className="text-blue-400" />
              <span>Tech & Private</span>
            </button>
            <button 
              className="quick-footer-pill"
              onClick={() => {
                onClose();
                router.push('/exams');
              }}
            >
              <Clock size={13} className="text-purple-400" />
              <span>Exam Timetable</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
