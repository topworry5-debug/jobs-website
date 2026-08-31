'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Calendar, 
  Users, 
  ArrowRight,
  TrendingUp,
  Landmark,
  Briefcase
} from 'lucide-react';
import { CITIES } from '../data/jobsData';

export default function HeroSection({ 
  searchQuery = '', 
  setSearchQuery = () => {}, 
  selectedCity = 'All Cities', 
  setSelectedCity = () => {}, 
  jobs = [], 
  examSchedules = [],
  onSelectCategory = () => {},
  onJobClick = () => {},
  onSwitchTab = () => {}
}) {
  const [internalQuery, setInternalQuery] = useState(searchQuery);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const query = searchQuery || internalQuery;

  // Dynamic statistics calculated from live data
  const totalVacancies = jobs.reduce((sum, j) => sum + (j.vacancies || 1), 0);
  const urgentCount = jobs.filter(j => j.urgent).length;
  const verifiedDeptsCount = new Set(jobs.map(j => j.department || j.company)).size;
  const upcomingExamsCount = examSchedules.length;

  // Filter autosuggest results
  const autosuggestResults = (query || '').trim().length > 1
    ? jobs.filter(j => 
        j.title.toLowerCase().includes((query || '').toLowerCase()) ||
        (j.department && j.department.toLowerCase().includes((query || '').toLowerCase())) ||
        (j.company && j.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        j.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (j.bpsScale && j.bpsScale.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (job) => {
    setSearchQuery(job.title);
    setSuggestionsOpen(false);
    onJobClick(job);
  };

  const quickPills = [
    { label: 'FPSC BPS-17', query: 'FPSC' },
    { label: 'PPSC Revenue', query: 'PPSC' },
    { label: 'NTS WAPDA', query: 'NTS' },
    { label: 'Remote IT / AI', query: 'Remote' },
    { label: 'Closing in 3 Days', query: 'urgent', isUrgentFilter: true }
  ];

  return (
    <div className="hero-container">
      {/* Subtle Background Glows */}
      <div className="hero-glow-green" />
      <div className="hero-glow-blue" />

      <div className="container-xl hero-content">
        {/* Trust Pill */}
        <div className="trust-announcement-pill">
          <span className="trust-icon-wrapper">
            <ShieldCheck size={15} />
          </span>
          <span>100% Verified Advertisements — No Outdated Ads or Clutter</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="hero-title">
          The Authority on Careers & Competitive Exams in <span className="text-gradient-emerald">Pakistan</span>
        </h1>
        <p className="hero-subtitle">
          Direct verified access to Federal & Provincial Government positions (FPSC, PPSC, SPSC, KPPSC, NTS) 
          and top-tier Private & Tech opportunities — all in one modern, ad-free interface.
        </p>

        {/* Interactive Main Search Bar */}
        <div className="hero-search-wrapper" ref={searchContainerRef}>
          <div className="hero-search-card">
            {/* Keyword Input */}
            <div className="search-input-group flex-2">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Job title, department, BPS scale, or skills..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSuggestionsOpen(true);
                }}
                onFocus={() => setSuggestionsOpen(true)}
                className="hero-search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-query-btn" 
                  onClick={() => setSearchQuery('')}
                  title="Clear"
                >
                  ×
                </button>
              )}
            </div>

            {/* City Selector */}
            <div className="search-input-group flex-1 border-left-divider">
              <MapPin className="search-icon" size={18} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="hero-city-select"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Search CTA */}
            <button 
              className="btn btn-primary hero-submit-btn"
              onClick={() => {
                setSuggestionsOpen(false);
                const resultsElement = document.getElementById('listings-section');
                if (resultsElement) resultsElement.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Search size={18} />
              <span>Find Jobs</span>
            </button>
          </div>

          {/* Autosuggest Dropdown */}
          {suggestionsOpen && autosuggestResults.length > 0 && (
            <div className="autosuggest-dropdown">
              <div className="autosuggest-header">
                <span>Matching Verified Listings</span>
              </div>
              {autosuggestResults.map((job) => (
                <div 
                  key={job.id} 
                  className="autosuggest-item"
                  onClick={() => handleSuggestionClick(job)}
                >
                  <div className="autosuggest-item-left">
                    <div className={`suggest-badge ${job.type === 'govt' ? 'govt' : 'private'}`}>
                      {job.type === 'govt' ? job.bpsScale || 'Govt' : 'Tech'}
                    </div>
                    <div>
                      <div className="suggest-title">{job.title}</div>
                      <div className="suggest-dept">
                        {job.department || job.company} • {job.city}
                      </div>
                    </div>
                  </div>
                  <div className="autosuggest-arrow">
                    <ArrowRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Search Tag Pills */}
        <div className="quick-tags-container">
          <span className="quick-tags-label">Popular Searches:</span>
          <div className="quick-tags-list">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                className={`quick-pill-btn ${pill.isUrgentFilter ? 'urgent-pill' : ''}`}
                onClick={() => {
                  if (pill.isUrgentFilter) {
                    setSearchQuery('urgent');
                  } else {
                    setSearchQuery(pill.query);
                  }
                }}
              >
                {pill.isUrgentFilter && <Flame size={13} className="text-red" />}
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Pathway Cards (Govt vs Private vs Exams) */}
        <div className="category-cards-grid">
          <div 
            className="pathway-card govt-card"
            onClick={() => {
              onSwitchTab('govt');
              const el = document.getElementById('listings-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="pathway-header">
              <div className="pathway-icon-wrapper govt">
                <Landmark size={22} />
              </div>
              <span className="pathway-badge govt">FPSC • PPSC • SPSC • NTS</span>
            </div>
            <h3 className="pathway-title">Government & Public Sector</h3>
            <p className="pathway-desc">
              Gazetted BPS-16 to BPS-21 openings, Armed Forces, Police, and Central Bank recruitment with official quota details.
            </p>
            <div className="pathway-footer">
              <span>Explore Govt Openings</span>
              <ArrowRight size={16} />
            </div>
          </div>

          <div 
            className="pathway-card tech-card"
            onClick={() => {
              onSwitchTab('private');
              const el = document.getElementById('listings-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="pathway-header">
              <div className="pathway-icon-wrapper tech">
                <Briefcase size={22} />
              </div>
              <span className="pathway-badge tech">High-Growth IT & Remote</span>
            </div>
            <h3 className="pathway-title">Private & Tech Careers</h3>
            <p className="pathway-desc">
              Software engineering, AI, DevOps, Product, and Fintech positions with verified salary benchmarks and hybrid perks.
            </p>
            <div className="pathway-footer">
              <span>Explore Tech Jobs</span>
              <ArrowRight size={16} />
            </div>
          </div>

          <div 
            className="pathway-card exam-card"
            onClick={() => {
              onSwitchTab('exams');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="pathway-header">
              <div className="pathway-icon-wrapper exam">
                <Calendar size={22} />
              </div>
              <span className="pathway-badge exam">Live Tracker</span>
            </div>
            <h3 className="pathway-title">Competitive Exam Calendar</h3>
            <p className="pathway-desc">
              Screening test dates, roll number slip releases, and result timelines for all major testing agencies in Pakistan.
            </p>
            <div className="pathway-footer">
              <span>View Exam Calendar</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>

        {/* Dynamic Real-Time Stats Bar */}
        <div className="stats-bar-wrapper">
          <div className="stats-bar-inner">
            <div className="stat-item">
              <div className="stat-number-wrapper">
                <span className="stat-number">{totalVacancies}+</span>
                <span className="stat-indicator green" />
              </div>
              <span className="stat-label">Active Vacancies Open</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
              <div className="stat-number-wrapper">
                <span className="stat-number">{verifiedDeptsCount}</span>
                <ShieldCheck size={16} className="text-emerald" />
              </div>
              <span className="stat-label">Verified Depts & Agencies</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
              <div className="stat-number-wrapper">
                <span className="stat-number text-urgent">{urgentCount}</span>
                <Flame size={16} className="text-red" />
              </div>
              <span className="stat-label">Closing in &lt; 3 Days</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
              <div className="stat-number-wrapper">
                <span className="stat-number">{upcomingExamsCount}</span>
                <Calendar size={16} className="text-blue" />
              </div>
              <span className="stat-label">Upcoming Exam Cycles</span>
            </div>
          </div>
        </div>

        {/* City Dedicated Hubs Bar */}
        <div className="city-hubs-quickbar mt-4">
          <span className="city-hubs-label">Explore Jobs by Major City:</span>
          <div className="city-hubs-links">
            <button className="city-hub-btn" onClick={() => onSwitchTab('city-lahore')}>
              <MapPin size={13} />
              <span>Lahore Jobs Hub</span>
            </button>
            <button className="city-hub-btn" onClick={() => onSwitchTab('city-karachi')}>
              <MapPin size={13} />
              <span>Karachi Jobs Hub</span>
            </button>
            <button className="city-hub-btn" onClick={() => onSwitchTab('city-islamabad')}>
              <MapPin size={13} />
              <span>Islamabad & Rawalpindi</span>
            </button>
          </div>
        </div>

        {/* Transparent Candidate Feedback & Integrity Notice */}
        <div className="trust-feedback-placeholder-card card mt-4">
          <div className="feedback-head">
            <ShieldCheck size={18} className="text-emerald" />
            <h4 className="feedback-title">Authenticity & Community Reviews Commitment</h4>
          </div>
          <p className="feedback-text">
            Verified candidate reviews, screening test experiences, and departmental interview insights will be published here as the 2026 recruitment cycles conclude. <strong>RozgarPK strictly prohibits fabricated testimonials or inflated user counters.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
