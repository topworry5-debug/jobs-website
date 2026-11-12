'use client';

import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Flame, 
  X
} from 'lucide-react';
import { PROVINCES, CITIES, BPS_SCALES } from '../data/jobsData';
import { useLanguage } from '../context/LanguageContext';

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
  totalResults,
  onCloseMobileFilter,
  categories = [],
  categoryCounts = {}
}) {
  const { t } = useLanguage();

  const isFilterActive = 
    selectedCategory !== 'all' || 
    selectedProvince !== 'All Pakistan' || 
    selectedCity !== 'All Cities' || 
    selectedBps !== 'All BPS Scales' || 
    (selectedQualification && selectedQualification !== 'All Qualifications') || 
    urgentOnly;

  const hasPrivateJobs = (categoryCounts?.private || 0) > 0;
  const isAllGovt = (categoryCounts?.govt || 0) === (categoryCounts?.all || 0) && (categoryCounts?.all || 0) > 0;

  return (
    <div className="filter-sidebar-wrapper">
      {/* Sidebar Header */}
      <div className="filter-header-row">
        <div className="filter-title-group">
          <Filter size={18} className="text-brand-primary" />
          <h3 className="filter-main-title">{t.filters?.title || 'Filter Openings'}</h3>
        </div>

        <div className="filter-header-actions">
          {isFilterActive && (
            <button 
              type="button"
              className="reset-filters-btn"
              onClick={onResetFilters}
              title="Clear all active filters"
            >
              <RotateCcw size={13} />
              <span>{t.filters?.reset || 'Reset'}</span>
            </button>
          )}

          {onCloseMobileFilter && (
            <button 
              type="button"
              className="mobile-filter-close-btn"
              onClick={onCloseMobileFilter}
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Sector Switcher (Only show if multiple non-empty sectors exist) */}
      {!isAllGovt && hasPrivateJobs && (
        <div className="filter-section">
          <label className="filter-section-label">{t.filters?.jobCategory || 'Job Sector'}</label>
          <div className="sector-toggle-group">
            <button
              type="button"
              className={`sector-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`sector-btn ${selectedCategory === 'govt' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('govt')}
            >
              Govt
            </button>
            <button
              type="button"
              className={`sector-btn ${selectedCategory === 'private' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('private')}
            >
              Private
            </button>
          </div>
        </div>
      )}

      {/* Urgency Quick Switch */}
      <div className="filter-section">
        <label className="checkbox-toggle-card">
          <div className="checkbox-info">
            <div className="checkbox-title">
              <Flame size={16} className="text-danger-red" />
              <span>{t.filters?.expiringSoon || 'Closing Soon (≤ 3 Days)'}</span>
            </div>
            <p className="checkbox-desc">{t.filters?.expiringSub || 'Urgent deadlines closing this week'}</p>
          </div>
          <input
            type="checkbox"
            checked={urgentOnly}
            onChange={(e) => setUrgentOnly(e.target.checked)}
            className="styled-checkbox"
          />
        </label>
      </div>

      {/* Category / Department Cadre (Only options with > 0 jobs and non-redundant) */}
      <div className="filter-section">
        <label className="filter-section-label">{t.filters?.deptCadre || 'Department / Cadre'}</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field select-field"
        >
          <option value="all">
            {t.filters?.allDepts || 'All Cadres'} {categoryCounts?.all > 0 ? `(${categoryCounts.all})` : ''}
          </option>
          {categories && categories.length > 0 && categories
            .filter(cat => cat.id !== 'all' && (categoryCounts?.[cat.id] || 0) > 0 && categoryCounts?.[cat.id] !== categoryCounts?.all)
            .map(cat => {
              const label = t.categories?.[cat.id] || cat.label || cat.name;
              const count = categoryCounts?.[cat.id];
              return (
                <option key={cat.id} value={cat.id}>
                  {label} {count > 0 ? `(${count})` : ''}
                </option>
              );
            })}
        </select>
      </div>

      {/* Province / Domicile */}
      <div className="filter-section">
        <label className="filter-section-label">{t.filters?.province || 'Province / Domicile'}</label>
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="input-field select-field"
        >
          <option value="All Pakistan">{t.filters?.allProvinces || 'All Pakistan'}</option>
          {PROVINCES.filter(p => p !== 'All Pakistan').map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div className="filter-section">
        <label className="filter-section-label">{t.filters?.postingCity || 'Posting City'}</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="input-field select-field"
        >
          <option value="All Cities">{t.hero?.allCities || 'All Cities'}</option>
          {CITIES.filter(c => c !== 'All Cities').map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* BPS Pay Scale */}
      <div className="filter-section">
        <label className="filter-section-label">{t.filters?.bpsScale || 'BPS Pay Scale'}</label>
        <select
          value={selectedBps}
          onChange={(e) => setSelectedBps(e.target.value)}
          className="input-field select-field"
        >
          <option value="All BPS Scales">{t.filters?.allBps || 'All BPS Scales'}</option>
          {BPS_SCALES.filter(b => b !== 'All BPS Scales').map((scale) => (
            <option key={scale} value={scale}>
              {scale}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
