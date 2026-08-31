'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Building2, 
  MapPin, 
  ArrowRight, 
  Landmark, 
  Sparkles, 
  Calendar 
} from 'lucide-react';

export default function QuickSearchModal({
  isOpen,
  onClose,
  jobs,
  onSelectJob,
  onSwitchTab
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered from parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredJobs = searchTerm.trim().length > 0
    ? jobs.filter(j => 
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (j.department && j.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (j.company && j.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        j.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (j.bpsScale && j.bpsScale.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 6)
    : jobs.slice(0, 4);

  return (
    <div className="modal-overlay quick-search-overlay" onClick={onClose}>
      <div className="quick-search-modal" onClick={(e) => e.stopPropagation()}>
        {/* Search Header */}
        <div className="quick-search-input-box">
          <Search size={20} className="quick-search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by job title, department, BPS scale, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="quick-search-native-input"
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
          <kbd className="esc-badge">ESC</kbd>
        </div>

        {/* Quick Suggestions & Results */}
        <div className="quick-results-scroll">
          <div className="quick-results-section-header">
            {searchTerm ? 'Search Results' : 'Suggested & Trending Openings'}
          </div>

          <div className="quick-results-list">
            {filteredJobs.map((job) => {
              const isGovt = job.type === 'govt';
              return (
                <div
                  key={job.id}
                  className="quick-result-item"
                  onClick={() => {
                    onSelectJob(job);
                    onClose();
                  }}
                >
                  <div className={`quick-result-icon ${isGovt ? 'govt' : 'tech'}`}>
                    {isGovt ? <Building2 size={16} /> : <Sparkles size={16} />}
                  </div>

                  <div className="quick-result-info">
                    <div className="quick-result-title">{job.title}</div>
                    <div className="quick-result-sub">
                      {job.department || job.company} • {job.city} {job.bpsScale && `• ${job.bpsScale}`}
                    </div>
                  </div>

                  <div className="quick-result-arrow">
                    <ArrowRight size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Nav Footers */}
        <div className="quick-search-footer">
          <span className="quick-footer-hint">Quick Navigation:</span>
          <button 
            className="quick-footer-pill"
            onClick={() => {
              onSwitchTab('govt');
              onClose();
            }}
          >
            <Landmark size={13} />
            <span>Govt Openings</span>
          </button>
          <button 
            className="quick-footer-pill"
            onClick={() => {
              onSwitchTab('private');
              onClose();
            }}
          >
            <Sparkles size={13} />
            <span>Tech Careers</span>
          </button>
          <button 
            className="quick-footer-pill"
            onClick={() => {
              onSwitchTab('exams');
              onClose();
            }}
          >
            <Calendar size={13} />
            <span>Exam Dates</span>
          </button>
        </div>
      </div>
    </div>
  );
}
