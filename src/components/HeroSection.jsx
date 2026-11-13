'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { CITIES } from '../data/jobsData';

export default function HeroSection({ 
  openCount = 0,
  closingSoonCount = 0,
  lastUpdated = 'November 12, 2026',
  agencyCounts = {}
}) {
  const [localQuery, setLocalQuery] = useState('');
  const [localCity, setLocalCity] = useState('All Cities');

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

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const q = localQuery.trim();
    const city = localCity;

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tainaati:filter-change', {
        detail: { query: q, city }
      }));

      const params = new URLSearchParams(window.location.search);
      if (q) params.set('q', q); else params.delete('q');
      if (city && city !== 'All Cities') params.set('city', city); else params.delete('city');
      const qs = params.toString();
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.pushState(null, '', newUrl);

      const target = document.getElementById('job-listings');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleAgencyChipClick = (agencyCode) => {
    if (typeof window !== 'undefined') {
      const newQuery = localQuery === agencyCode ? '' : agencyCode;
      setLocalQuery(newQuery);
      window.dispatchEvent(new CustomEvent('tainaati:filter-change', {
        detail: { query: newQuery, city: 'All Cities', category: 'all' }
      }));
      const target = document.getElementById('job-listings');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const agencies = [
    { code: 'FPSC', label: 'FPSC', count: agencyCounts.FPSC || 0 },
    { code: 'PPSC', label: 'PPSC', count: agencyCounts.PPSC || 0 },
    { code: 'SPSC', label: 'SPSC', count: agencyCounts.SPSC || 0 },
    { code: 'KPPSC', label: 'KPPSC', count: agencyCounts.KPPSC || 0 },
    { code: 'BPSC', label: 'BPSC', count: agencyCounts.BPSC || 0 },
    { code: 'NTS', label: 'NTS', count: agencyCounts.NTS || 0 },
  ];

  // Slim info line segments: real values only; hide any part that is 0
  const infoSegments = [];
  if (openCount > 0) {
    infoSegments.push(`${openCount} open jobs`);
  } else {
    infoSegments.push('No open jobs currently');
  }
  if (closingSoonCount > 0) {
    infoSegments.push(`${closingSoonCount} closing in 3 days`);
  }
  if (lastUpdated) {
    infoSegments.push(`Last updated ${lastUpdated}`);
  }
  const infoLineText = infoSegments.join(' · ');

  return (
    <section className="compact-hero-section">
      <div className="container-xl compact-hero-inner">
        {/* H1 Heading */}
        <h1 className="compact-hero-title">
          Government Jobs in Pakistan
        </h1>

        {/* Short Descriptive Sentence */}
        <p className="compact-hero-subtitle">
          Direct public sector vacancies, gazette syllabus breakdowns, and examination schedules across Pakistan.
        </p>

        {/* Search Bar: Input with search icon INSIDE the field, city select, Find Jobs button */}
        <form onSubmit={handleSearchSubmit} className="compact-search-form" role="search">
          {/* Keyword Input with internal Search icon */}
          <div className="compact-search-input-box">
            <Search size={18} className="compact-search-icon" aria-hidden="true" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Job title, department, BPS scale, or agency..."
              className="compact-search-input"
              aria-label="Job search keyword"
            />
            {localQuery && (
              <button 
                type="button"
                onClick={() => {
                  setLocalQuery('');
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('tainaati:filter-change', {
                      detail: { query: '', city: localCity }
                    }));
                  }
                }}
                className="compact-clear-btn"
                aria-label="Clear search input"
              >
                ×
              </button>
            )}
          </div>

          {/* City Select */}
          <div className="compact-city-select-box">
            <MapPin size={16} className="compact-city-icon" aria-hidden="true" />
            <select
              value={localCity}
              onChange={(e) => setLocalCity(e.target.value)}
              className="compact-city-select"
              aria-label="Filter by city"
            >
              <option value="All Cities">All Cities</option>
              {CITIES.filter(c => c !== 'All Cities').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Find Jobs Button */}
          <button 
            type="submit" 
            className="compact-search-btn"
            aria-label="Find Jobs"
          >
            Find Jobs
          </button>
        </form>

        {/* Agency Chips: FPSC, PPSC, SPSC, KPPSC, BPSC, NTS (count only if > 0) */}
        <div className="compact-agency-chips-row" role="region" aria-label="Official Commission Quick Filters">
          <span className="compact-agency-label">Agencies:</span>
          <div className="compact-chips-list">
            {agencies.map((agency) => {
              const isSelected = localQuery.toUpperCase() === agency.code;
              return (
                <button
                  key={agency.code}
                  type="button"
                  onClick={() => handleAgencyChipClick(agency.code)}
                  className={`compact-agency-chip ${isSelected ? 'active' : ''}`}
                  aria-pressed={isSelected}
                  title={`Filter by ${agency.label}${agency.count > 0 ? ` (${agency.count} open)` : ''}`}
                >
                  <span className="chip-name">{agency.label}</span>
                  {agency.count > 0 && (
                    <span className="chip-count tabular-nums">({agency.count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Slim Info Line Under Hero: Real values only, hide 0, no floating icons beside numbers */}
      <div className="slim-info-bar">
        <div className="container-xl">
          <p className="slim-info-text tabular-nums">
            {infoLineText}
          </p>
        </div>
      </div>
    </section>
  );
}
