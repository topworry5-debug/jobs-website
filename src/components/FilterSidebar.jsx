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
  X
} from 'lucide-react';
import { PROVINCES, CITIES, BPS_SCALES, QUALIFICATIONS } from '../data/jobsData';
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
  onCloseMobileFilter
}) {
  const { t, isRtl } = useLanguage();

  const isFilterActive = 
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
          <h3 className="filter-main-title">{t.filters.title}</h3>
        </div>

        <div className="filter-header-actions">
          {isFilterActive && (
            <button 
              className="reset-filters-btn"
              onClick={onResetFilters}
              title="Clear all active filters"
            >
              <RotateCcw size={13} />
              <span>{t.filters.reset}</span>
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
        <label className="filter-section-label">{t.filters.jobCategory}</label>
        <div className="sector-toggle-group">
          <button
            className={`sector-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            {t.filters.allCat}
          </button>
          <button
            className={`sector-btn govt ${selectedCategory === 'govt' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('govt')}
          >
            <Landmark size={14} />
            <span>{t.filters.govtCat}</span>
          </button>
          <button
            className={`sector-btn tech ${selectedCategory === 'private' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('private')}
          >
            <Building2 size={14} />
            <span>{t.filters.privateCat}</span>
          </button>
        </div>
      </div>

      {/* Filter 2: Urgency Quick Switch */}
      <div className="filter-section">
        <label className="checkbox-toggle-card">
          <div className="checkbox-info">
            <div className="checkbox-title">
              <Flame size={16} className="text-red" />
              <span>{t.filters.expiringSoon}</span>
            </div>
            <p className="checkbox-desc">{t.filters.expiringSub}</p>
          </div>
          <input
            type="checkbox"
            checked={urgentOnly}
            onChange={(e) => setUrgentOnly(e.target.checked)}
            className="styled-checkbox"
          />
        </label>
      </div>

      {/* Filter 3: Category / Cadre */}
      <div className="filter-section">
        <label className="filter-section-label">{t.filters.deptCadre}</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field select-field"
        >
          <option value="all">{t.filters.allDepts}</option>
          <optgroup label="Government Sectors">
            <option value="armed-forces">Armed Forces & Defence</option>
            <option value="police-law-enforcement">Police & Law Enforcement</option>
            <option value="judiciary-legal">Judiciary & Legal</option>
            <option value="public-sector-enterprises">Public Sector Enterprises / PSEs</option>
            <option value="teaching-education">Teaching & Education</option>
            <option value="healthcare-medical">Healthcare & Medical</option>
            <option value="local-government">Local Government / Municipal</option>
            <option value="matric-inter-support">Matric/Inter & Support Staff</option>
            <option value="agriculture-livestock">Agriculture & Livestock Dept</option>
            <option value="ajk-gilgit-baltistan">AJK & Gilgit-Baltistan Jobs</option>
          </optgroup>
          <optgroup label="Private & Industry Careers">
            <option value="banking-finance">Banking & Finance</option>
            <option value="engineering">Engineering & Technical</option>
            <option value="ngo-international">NGO & International Orgs</option>
            <option value="internships-trainee">Internships & Trainee Programs</option>
            <option value="shutdown-industrial">Shutdown & Industrial Jobs</option>
            <option value="part-time-labor">Part-Time & Daily Wage Labor</option>
            <option value="media-journalism">Media, Journalism & Content</option>
          </optgroup>
          <optgroup label="Cross-Cutting & Remote">
            <option value="overseas-gulf">Overseas & Gulf Jobs</option>
            <option value="remote-freelance">Remote & Freelance</option>
            <option value="exam-recruitment-hub">Exam-Based Recruitment Hub</option>
          </optgroup>
          <optgroup label="Public Service Commissions">
            <option value="fpsc">Federal (FPSC)</option>
            <option value="ppsc">Punjab (PPSC)</option>
            <option value="spsc">Sindh (SPSC)</option>
            <option value="kppsc">KPK (KPPSC)</option>
            <option value="nts">Testing Services (NTS)</option>
          </optgroup>
        </select>
      </div>

      {/* Filter 4: Province / Domicile */}
      <div className="filter-section">
        <label className="filter-section-label">{t.filters.province}</label>
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="input-field select-field"
        >
          <option value="All Pakistan">{t.filters.allProvinces}</option>
          {PROVINCES.filter(p => p !== 'All Pakistan').map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      {/* Filter 5: City */}
      <div className="filter-section">
        <label className="filter-section-label">{t.filters.postingCity}</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="input-field select-field"
        >
          <option value="All Cities">{t.hero.allCities}</option>
          {CITIES.filter(c => c !== 'All Cities').map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Filter 6: BPS Scale */}
      <div className="filter-section">
        <label className="filter-section-label">{t.filters.bpsScale}</label>
        <select
          value={selectedBps}
          onChange={(e) => setSelectedBps(e.target.value)}
          className="input-field select-field"
        >
          <option value="All BPS Scales">{t.filters.allBps}</option>
          {BPS_SCALES.filter(b => b !== 'All BPS Scales').map((scale) => (
            <option key={scale} value={scale}>
              {scale}
            </option>
          ))}
        </select>
      </div>

      {/* Filter 7: Minimum Qualification */}
      <div className="filter-section">
        <label className="filter-section-label">{t.filters.qualification}</label>
        <select
          value={selectedQualification}
          onChange={(e) => setSelectedQualification(e.target.value)}
          className="input-field select-field"
        >
          <option value="All Qualifications">{t.filters.allQualifications}</option>
          {QUALIFICATIONS.filter(q => q !== 'All Qualifications').map((qual) => (
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
            Show {totalResults} Results
          </button>
        </div>
      )}
    </aside>
  );
}
