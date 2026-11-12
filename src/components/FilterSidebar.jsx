'use client';

import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  X,
  Search
} from 'lucide-react';
import { PROVINCES, CITIES, BPS_SCALES } from '../data/jobsData';

export default function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedProvince,
  setSelectedProvince,
  selectedCity,
  setSelectedCity,
  selectedBps,
  setSelectedBps,
  selectedQualification,
  setSelectedQualification,
  urgentOnly,
  setUrgentOnly,
  onResetFilters,
  totalResults = 0,
  onCloseMobileFilter,
  categories = [],
  categoryCounts = {},
  searchQuery = '',
  setSearchQuery = () => {}
}) {
  const isFilterActive = 
    selectedCategory !== 'all' || 
    selectedProvince !== 'All Pakistan' || 
    selectedCity !== 'All Cities' || 
    selectedBps !== 'All BPS Scales' || 
    (selectedQualification && selectedQualification !== 'All Qualifications') || 
    urgentOnly ||
    (searchQuery && searchQuery.trim().length > 0);

  const hasPrivateJobs = (categoryCounts?.private || 0) > 0;
  const isAllGovt = (categoryCounts?.govt || 0) === (categoryCounts?.all || 0) && (categoryCounts?.all || 0) > 0;

  return (
    <div className="filter-panel-card">
      {/* Panel Header: Title, Live Count ("9 jobs"), and Clear Link */}
      <div className="filter-panel-header">
        <div className="flex items-center gap-2">
          <Filter size={17} className="text-brand-primary" aria-hidden="true" />
          <h3 className="filter-panel-title">Filters</h3>
          <span className="filter-live-count tabular-nums">
            {totalResults} {totalResults === 1 ? 'job' : 'jobs'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isFilterActive && (
            <button 
              type="button"
              className="filter-clear-link"
              onClick={onResetFilters}
            >
              Clear filters
            </button>
          )}

          {onCloseMobileFilter && (
            <button 
              type="button"
              className="filter-close-btn"
              onClick={onCloseMobileFilter}
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Inline Search Input with internal Search icon */}
      <div className="filter-group">
        <label htmlFor="filter-search-input" className="filter-label">Search Keyword</label>
        <div className="filter-search-box">
          <Search size={16} className="filter-search-icon" aria-hidden="true" />
          <input
            id="filter-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, city, dept..."
            className="filter-native-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="filter-input-clear-btn"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Sector Switcher (Only if multiple sectors with jobs exist) */}
      {!isAllGovt && hasPrivateJobs && (
        <div className="filter-group">
          <label className="filter-label">Sector</label>
          <div className="filter-sector-toggle">
            <button
              type="button"
              className={`sector-toggle-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`sector-toggle-btn ${selectedCategory === 'govt' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('govt')}
            >
              Govt
            </button>
            <button
              type="button"
              className={`sector-toggle-btn ${selectedCategory === 'private' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('private')}
            >
              Private
            </button>
          </div>
        </div>
      )}

      {/* Simple Toggle Switch for "Closing soon" (Not a pink box) */}
      <div className="filter-group">
        <div className="filter-switch-row">
          <span className="filter-switch-label" id="closing-soon-label">Closing soon (≤ 3 days)</span>
          <button
            type="button"
            role="switch"
            aria-checked={urgentOnly}
            aria-labelledby="closing-soon-label"
            onClick={() => setUrgentOnly(!urgentOnly)}
            className={`filter-toggle-switch ${urgentOnly ? 'active' : ''}`}
          >
            <span className="filter-switch-knob" />
          </button>
        </div>
      </div>

      {/* Department / Agency Cadre Select (44px height, chevron, focus ring) */}
      <div className="filter-group">
        <label htmlFor="filter-cadre-select" className="filter-label">Department / Cadre</label>
        <div className="filter-select-wrapper">
          <select
            id="filter-cadre-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-native-select"
          >
            <option value="all">
              All Cadres {categoryCounts?.all > 0 ? `(${categoryCounts.all})` : ''}
            </option>
            {categories && categories.length > 0 && categories
              .filter(cat => cat.id !== 'all' && (categoryCounts?.[cat.id] || 0) > 0 && categoryCounts?.[cat.id] !== categoryCounts?.all)
              .map(cat => {
                const label = cat.label || cat.name;
                const count = categoryCounts?.[cat.id];
                return (
                  <option key={cat.id} value={cat.id}>
                    {label} {count > 0 ? `(${count})` : ''}
                  </option>
                );
              })}
          </select>
        </div>
      </div>

      {/* Province / Domicile Select */}
      <div className="filter-group">
        <label htmlFor="filter-province-select" className="filter-label">Province / Domicile</label>
        <div className="filter-select-wrapper">
          <select
            id="filter-province-select"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="filter-native-select"
          >
            <option value="All Pakistan">All Pakistan</option>
            {PROVINCES.filter(p => p !== 'All Pakistan').map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* City Select */}
      <div className="filter-group">
        <label htmlFor="filter-city-select" className="filter-label">City</label>
        <div className="filter-select-wrapper">
          <select
            id="filter-city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="filter-native-select"
          >
            <option value="All Cities">All Cities</option>
            {CITIES.filter(c => c !== 'All Cities').map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* BPS Pay Scale Select */}
      <div className="filter-group">
        <label htmlFor="filter-bps-select" className="filter-label">BPS Pay Scale</label>
        <div className="filter-select-wrapper">
          <select
            id="filter-bps-select"
            value={selectedBps}
            onChange={(e) => setSelectedBps(e.target.value)}
            className="filter-native-select"
          >
            <option value="All BPS Scales">All BPS Scales</option>
            {BPS_SCALES.filter(b => b !== 'All BPS Scales').map((scale) => (
              <option key={scale} value={scale}>
                {scale}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
