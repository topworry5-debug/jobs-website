'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Flame, 
  Calendar, 
  ArrowRight,
  Landmark,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import { CITIES } from '../data/jobsData';
import { useLanguage } from '../context/LanguageContext';
import { computeJobMetrics, isClosingSoon } from '../utils/jobMetrics';
import AnimatedCount from './AnimatedCount';

export default function HeroSection({ 
  searchQuery: propQuery = '', 
  setSearchQuery: propSetQuery = () => {}, 
  selectedCity: propCity = 'All Cities', 
  setSelectedCity: propSetCity = () => {}, 
  jobs = [], 
  examSchedules = [],
  onJobClick = () => {}
}) {
  const { t, isRtl } = useLanguage();
  const [localQuery, setLocalQuery] = useState(propQuery || '');
  const [localCity, setLocalCity] = useState(propCity || 'All Cities');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Sync with prop changes if parent provides them
  useEffect(() => {
    if (propQuery !== undefined && propQuery !== '') {
      setLocalQuery(propQuery);
    }
  }, [propQuery]);

  useEffect(() => {
    if (propCity !== undefined && propCity !== 'All Cities') {
      setLocalCity(propCity);
    }
  }, [propCity]);

  // Read URL search params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || params.get('query');
      const c = params.get('city');
      if (q) setLocalQuery(q);
      if (c) setLocalCity(c);
    }
  }, []);

  // Centralized single source of truth dynamic metrics
  const metrics = computeJobMetrics(jobs, examSchedules);

  // Filter autosuggest results
  const autosuggestResults = (localQuery || '').trim().length > 1
    ? jobs.filter(j => 
        j.title.toLowerCase().includes((localQuery || '').toLowerCase()) ||
        (j.department && j.department.toLowerCase().includes((localQuery || '').toLowerCase())) ||
        (j.company && j.company.toLowerCase().includes((localQuery || '').toLowerCase())) ||
        j.city.toLowerCase().includes((localQuery || '').toLowerCase()) ||
        (j.bpsScale && j.bpsScale.toLowerCase().includes((localQuery || '').toLowerCase()))
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

  const handleSearchSubmit = (overrideQuery, overrideCity) => {
    const q = (overrideQuery !== undefined ? overrideQuery : localQuery).trim();
    const city = overrideCity !== undefined ? overrideCity : localCity;

    setSuggestionsOpen(false);

    // 1. Notify parent prop if provided
    propSetQuery(q);
    propSetCity(city);

    // 2. Dispatch window event for immediate reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('rozgar:filter-change', {
        detail: { query: q, city }
      }));

      // 3. Update URL with search params
      const params = new URLSearchParams(window.location.search);
      if (q) {
        params.set('q', q);
      } else {
        params.delete('q');
      }
      if (city && city !== 'All Cities') {
        params.set('city', city);
      } else {
        params.delete('city');
      }

      const qs = params.toString();
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.pushState(null, '', newUrl);

      // 4. Smooth scroll down to listings section
      const resultsElement = document.getElementById('job-listings') || document.getElementById('listings-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSuggestionClick = (job) => {
    setLocalQuery(job.title);
    setSuggestionsOpen(false);
    handleSearchSubmit(job.title, undefined);
    onJobClick(job);
  };

  const quickPills = [
    { label: 'PPSC Revenue & Water', query: 'PPSC' },
    { label: 'SPSC Sindh Cadre', query: 'SPSC' },
    { label: 'NTS Projects', query: 'NTS' },
    { label: 'FPSC CSS MPT', query: 'FPSC' },
    { label: `${t.hero.closingIn3Days} (${metrics.urgentCount})`, query: 'urgent', isUrgentFilter: true }
  ];

  return (
    <div className="hero-container">
      {/* Subtle Background Glows */}
      <div className="hero-glow-green" />
      <div className="hero-glow-blue" />

      <div className="container-xl hero-content">
        {/* Trust Pill */}
        <div className="trust-announcement-pill hero-fade-in-1">
          <span className="trust-icon-wrapper">
            <ShieldCheck size={15} />
          </span>
          <span>{t.hero.trustBadge}</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="hero-title hero-fade-in-2">
          {t.hero.titlePrefix} {t.hero.titleIn} <span className="text-gold-accent font-serif">{t.hero.titleCountry}</span>
        </h1>
        <p className="hero-subtitle hero-fade-in-3">
          {t.hero.subtitle}
        </p>

        {/* Interactive Main Search Bar */}
        <div className="hero-search-wrapper hero-fade-in-4" ref={searchContainerRef}>
          <div className="hero-search-card">
            {/* Keyword Input */}
            <div className="search-input-group flex-2">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder={t.hero.searchPlaceholder}
                value={localQuery}
                onChange={(e) => {
                  setLocalQuery(e.target.value);
                  setSuggestionsOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
                onFocus={() => setSuggestionsOpen(true)}
                className="hero-search-input"
              />
              {localQuery && (
                <button 
                  className="clear-query-btn" 
                  onClick={() => {
                    setLocalQuery('');
                    handleSearchSubmit('');
                  }}
                  title="Clear"
                  aria-label="Clear search query"
                >
                  ×
                </button>
              )}
            </div>

            {/* City Selector */}
            <div className="search-input-group flex-1 border-left-divider">
              <MapPin className="search-icon" size={18} />
              <select
                value={localCity}
                onChange={(e) => {
                  const newCity = e.target.value;
                  setLocalCity(newCity);
                  handleSearchSubmit(undefined, newCity);
                }}
                className="hero-city-select"
                aria-label="Filter vacancies by city"
              >
                <option value="All Cities">{t.hero.allCities}</option>
                {CITIES.filter(c => c !== 'All Cities').map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Search CTA */}
            <button 
              id="hero-find-jobs-btn"
              className="btn btn-primary hero-submit-btn"
              onClick={() => handleSearchSubmit()}
              aria-label="Find Jobs"
            >
              <Search size={18} />
              <span>{t.hero.findJobs}</span>
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
                      {job.type === 'govt' ? job.bpsScale || 'Govt' : 'Private'}
                    </div>
                    <div>
                      <div className="suggest-title" dir="auto">{job.title}</div>
                      <div className="suggest-dept" dir="auto">
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
        <div className="quick-tags-container hero-fade-in-5">
          <span className="quick-tags-label">{t.hero.popularSearches}</span>
          <div className="quick-tags-list">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                className={`quick-pill-btn ${pill.isUrgentFilter ? 'urgent-pill' : ''}`}
                onClick={() => {
                  const q = pill.isUrgentFilter ? 'urgent' : pill.query;
                  setLocalQuery(q);
                  handleSearchSubmit(q, undefined);
                }}
              >
                {pill.isUrgentFilter && <Flame size={13} className="text-red" />}
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Pathway Cards */}
        <h2 className="sr-only">Career Pathways and Recruitment Sectors</h2>
        <div className="category-cards-grid">
          <Link 
            href="/jobs/govt"
            className="pathway-card govt-card"
          >
            <div className="pathway-header">
              <div className="pathway-icon-wrapper govt">
                <Landmark size={22} />
              </div>
              <span className="pathway-badge govt">FPSC • PPSC • SPSC • KPPSC</span>
            </div>
            <h3 className="pathway-title">{t.hero.trackGovtTitle}</h3>
            <p className="pathway-desc">
              {t.hero.trackGovtDesc}
            </p>
            <div className="pathway-footer">
              <span>{t.hero.trackGovtAction} ({metrics.govtCount})</span>
              <ArrowRight size={16} />
            </div>
          </Link>

          {metrics.privateCount > 0 ? (
            <Link 
              href="/jobs/private"
              className="pathway-card tech-card"
            >
              <div className="pathway-header">
                <div className="pathway-icon-wrapper tech">
                  <Briefcase size={22} />
                </div>
                <span className="pathway-badge tech">High-Growth Careers</span>
              </div>
              <h3 className="pathway-title">{t.hero.trackPrivateTitle}</h3>
              <p className="pathway-desc">
                {t.hero.trackPrivateDesc}
              </p>
              <div className="pathway-footer">
                <span>{t.hero.trackPrivateAction} ({metrics.privateCount})</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          ) : (
            <Link 
              href="/agency/nts"
              className="pathway-card tech-card"
            >
              <div className="pathway-header">
                <div className="pathway-icon-wrapper tech">
                  <ShieldCheck size={22} />
                </div>
                <span className="pathway-badge tech">NTS & Autonomous Authorities</span>
              </div>
              <h3 className="pathway-title">Testing Services & Authorities</h3>
              <p className="pathway-desc">
                Screening tests and recruitment projects for Sindh Social Protection Authority, Judiciary, and public sector corporations.
              </p>
              <div className="pathway-footer">
                <span>Explore Testing Openings ({metrics.agencyCounts.NTS || 0})</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          )}

          <Link 
            href="/exams"
            className="pathway-card exam-card"
          >
            <div className="pathway-header">
              <div className="pathway-icon-wrapper exam">
                <Calendar size={22} />
              </div>
              <span className="pathway-badge exam">Live Tracker</span>
            </div>
            <h3 className="pathway-title">{t.hero.trackExamsTitle}</h3>
            <p className="pathway-desc">
              {t.hero.trackExamsDesc}
            </p>
            <div className="pathway-footer">
              <span>{t.hero.trackExamsAction} ({metrics.upcomingExamsCount})</span>
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>

        {/* Dynamic Real-Time Stats Bar */}
        <div className="stats-bar-wrapper">
          <div className="stats-bar-inner">
            <div className="stat-item">
              <div className="stat-number-wrapper">
                <span className="stat-number">
                  <AnimatedCount target={metrics.totalListings} suffix="+" />
                </span>
                <span className="stat-indicator green" />
              </div>
              <span className="stat-label">{t.hero.statVacancies}</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
              <div className="stat-number-wrapper">
                <span className="stat-number">
                  <AnimatedCount target={metrics.verifiedDeptsCount} />
                </span>
                <ShieldCheck size={16} className="text-emerald-500" />
              </div>
              <span className="stat-label">{t.hero.statDepts}</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
              <div className="stat-number-wrapper">
                <span className="stat-number text-urgent">
                  <AnimatedCount target={metrics.urgentCount} />
                </span>
                <Flame size={16} className="text-red-500" />
              </div>
              <span className="stat-label">{t.hero.statUrgent}</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
              <div className="stat-number-wrapper">
                <span className="stat-number">
                  <AnimatedCount target={metrics.upcomingExamsCount} />
                </span>
                <Calendar size={16} className="text-blue-500" />
              </div>
              <span className="stat-label">{t.hero.statExams}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
