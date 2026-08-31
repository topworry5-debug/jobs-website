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
  Briefcase
} from 'lucide-react';
import { CITIES } from '../data/jobsData';
import { useLanguage } from '../context/LanguageContext';

export default function HeroSection({ 
  searchQuery = '', 
  setSearchQuery = () => {}, 
  selectedCity = 'All Cities', 
  setSelectedCity = () => {}, 
  jobs = [], 
  examSchedules = [],
  onJobClick = () => {}
}) {
  const { t, isRtl } = useLanguage();
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
    { label: t.hero.closingIn3Days, query: 'urgent', isUrgentFilter: true }
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
          <span>{t.hero.trustBadge}</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="hero-title">
          {t.hero.titlePrefix} {t.hero.titleIn} <span className="text-gradient-emerald">{t.hero.titleCountry}</span>
        </h1>
        <p className="hero-subtitle">
          {t.hero.subtitle}
        </p>

        {/* Interactive Main Search Bar */}
        <div className="hero-search-wrapper" ref={searchContainerRef}>
          <div className="hero-search-card">
            {/* Keyword Input */}
            <div className="search-input-group flex-2">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder={t.hero.searchPlaceholder}
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
              className="btn btn-primary hero-submit-btn"
              onClick={() => {
                setSuggestionsOpen(false);
                const resultsElement = document.getElementById('listings-section');
                if (resultsElement) resultsElement.scrollIntoView({ behavior: 'smooth' });
              }}
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
          <span className="quick-tags-label">{t.hero.popularSearches}</span>
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
          <Link 
            href="/jobs/govt"
            className="pathway-card govt-card"
          >
            <div className="pathway-header">
              <div className="pathway-icon-wrapper govt">
                <Landmark size={22} />
              </div>
              <span className="pathway-badge govt">FPSC • PPSC • SPSC • NTS</span>
            </div>
            <h3 className="pathway-title">{t.hero.trackGovtTitle}</h3>
            <p className="pathway-desc">
              {t.hero.trackGovtDesc}
            </p>
            <div className="pathway-footer">
              <span>{t.hero.trackGovtAction}</span>
              <ArrowRight size={16} />
            </div>
          </Link>

          <Link 
            href="/jobs/private"
            className="pathway-card tech-card"
          >
            <div className="pathway-header">
              <div className="pathway-icon-wrapper tech">
                <Briefcase size={22} />
              </div>
              <span className="pathway-badge tech">High-Growth IT & Remote</span>
            </div>
            <h3 className="pathway-title">{t.hero.trackPrivateTitle}</h3>
            <p className="pathway-desc">
              {t.hero.trackPrivateDesc}
            </p>
            <div className="pathway-footer">
              <span>{t.hero.trackPrivateAction}</span>
              <ArrowRight size={16} />
            </div>
          </Link>

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
              <span>{t.hero.trackExamsAction}</span>
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>

        {/* Dynamic Real-Time Stats Bar */}
        <div className="stats-bar-wrapper">
          <div className="stats-bar-inner">
            <div className="stat-item">
              <div className="stat-number-wrapper">
                <span className="stat-number">{totalVacancies}+</span>
                <span className="stat-indicator green" />
              </div>
              <span className="stat-label">{t.hero.statVacancies}</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
              <div className="stat-number-wrapper">
                <span className="stat-number">{verifiedDeptsCount}</span>
                <ShieldCheck size={16} className="text-emerald" />
              </div>
              <span className="stat-label">{t.hero.statDepts}</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
              <div className="stat-number-wrapper">
                <span className="stat-number text-urgent">{urgentCount}</span>
                <Flame size={16} className="text-red" />
              </div>
              <span className="stat-label">{t.hero.statUrgent}</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
              <div className="stat-number-wrapper">
                <span className="stat-number">{upcomingExamsCount}</span>
                <Calendar size={16} className="text-blue" />
              </div>
              <span className="stat-label">{t.hero.statExams}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
