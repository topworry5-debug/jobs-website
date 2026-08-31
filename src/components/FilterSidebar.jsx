'use client';

import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Landmark, 
  Building2, 
  Flame, 
  GraduationCap, 
  MapPin, 
  Scale, 
  CheckCircle2,
  X
} from 'lucide-react';
import { PROVINCES, CITIES, BPS_SCALES, QUALIFICATIONS } from '../data/jobsData';

export default function FilterSidebar({
  activeType,
  setActiveType,
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
  totalResultsCount,
  onCloseMobileFilter
}) {
  const isFilterActive = 
    activeType !== 'all' || 
    selectedCategory !== 'all' || 
    selectedProvince !== 'All Pakistan' || 
    selectedCity !== 'All Cities' || 
    selectedBps !== 'All BPS Scales' || 
    selectedQualification !== 'All Qualifications' || 
    urgentOnly;

  return (
    <aside className="filter-sidebar-wrapper">
      {/* Sidebar Header */}
      <div className="filter-header-row">
        <div className="filter-title-group">
          <Filter size={18} className="text-emerald" />
          <h3 className="filter-main-title">Filter Openings</h3>
        </div>

        <div className="filter-header-actions">
          {isFilterActive && (
            <button 
              className="reset-filters-btn"
              onClick={onResetFilters}
              title="Clear all active filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}

          {onCloseMobileFilter && (
            <button 
              className="mobile-filter-close-btn"
              onClick={onCloseMobileFilter}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Filter 1: Primary Sector Switcher */}
      <div className="filter-section">
        <label className="filter-section-label">Job Category</label>
        <div className="sector-toggle-group">
          <button
            className={`sector-btn ${activeType === 'all' ? 'active' : ''}`}
            onClick={() => setActiveType('all')}
          >
            All
          </button>
          <button
            className={`sector-btn govt ${activeType === 'govt' ? 'active' : ''}`}
            onClick={() => setActiveType('govt')}
          >
            <Landmark size={14} />
            <span>Govt</span>
          </button>
          <button
            className={`sector-btn tech ${activeType === 'private' ? 'active' : ''}`}
            onClick={() => setActiveType('private')}
          >
            <Building2 size={14} />
            <span>Private / IT</span>
          </button>
        </div>
      </div>

      {/* Filter 2: Urgency Quick Switch */}
      <div className="filter-section">
        <label className="checkbox-toggle-card">
          <div className="checkbox-info">
            <div className="checkbox-title">
              <Flame size={16} className="text-red" />
              <span>Expiring Soon (&lt; 3 Days)</span>
            </div>
            <p className="checkbox-desc">Show urgent deadlines closing this week</p>
          </div>
          <input
            type="checkbox"
            checked={urgentOnly}
            onChange={(e) => setUrgentOnly(e.target.checked)}
            className="styled-checkbox"
          />
        </label>
      </div>

      {/* Filter 3: Testing Agency / Sector */}
      <div className="filter-section">
        <label className="filter-section-label">Department / Agency Cadre</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field select-field"
        >
          <option value="all">All Departments & Agencies</option>
          <optgroup label="Government Commissions">
            <option value="Federal (FPSC)">Federal (FPSC)</option>
            <option value="Provincial (PPSC)">Punjab (PPSC)</option>
            <option value="Provincial (SPSC)">Sindh (SPSC)</option>
            <option value="Provincial (KPPSC)">Khyber Pakhtunkhwa (KPPSC)</option>
            <option value="Testing Services (NTS)">Testing Services (NTS/PTS)</option>
            <option value="Police & Armed Forces">Police & Armed Forces</option>
          </optgroup>
          <optgroup label="Private & Industry">
            <option value="IT & Software">IT & Software Engineering</option>
            <option value="Banking & Finance">Banking & Fintech</option>
          </optgroup>
        </select>
      </div>

      {/* Filter 4: Province / Domicile */}
      <div className="filter-section">
        <label className="filter-section-label">Province / Domicile</label>
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="input-field select-field"
        >
          {PROVINCES.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      {/* Filter 5: City */}
      <div className="filter-section">
        <label className="filter-section-label">Posting City</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="input-field select-field"
        >
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Filter 6: BPS Scale (Govt specific) */}
      {(activeType === 'all' || activeType === 'govt') && (
        <div className="filter-section">
          <label className="filter-section-label">BPS Pay Scale (Govt)</label>
          <select
            value={selectedBps}
            onChange={(e) => setSelectedBps(e.target.value)}
            className="input-field select-field"
          >
            {BPS_SCALES.map((scale) => (
              <option key={scale} value={scale}>
                {scale}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Filter 7: Minimum Qualification */}
      <div className="filter-section">
        <label className="filter-section-label">Required Qualification</label>
        <select
          value={selectedQualification}
          onChange={(e) => setSelectedQualification(e.target.value)}
          className="input-field select-field"
        >
          {QUALIFICATIONS.map((qual) => (
            <option key={qual} value={qual}>
              {qual}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Filter Apply Button */}
      {onCloseMobileFilter && (
        <div className="mobile-filter-footer">
          <button 
            className="btn btn-primary btn-block"
            onClick={onCloseMobileFilter}
          >
            Show {totalResultsCount} Results
          </button>
        </div>
      )}
    </aside>
  );
}
