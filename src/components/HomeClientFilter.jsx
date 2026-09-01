'use client';

import React, { useState } from 'react';
import FilterSidebar from './FilterSidebar';
import JobCard from './JobCard';
import JobDetailModal from './JobDetailModal';
import { CITIES, PROVINCES, BPS_SCALES, QUALIFICATIONS, CATEGORIES } from '../data/jobsData';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  Sparkles, 
  RotateCcw, 
  Flame, 
  Layers, 
  Building2, 
  Landmark, 
  ShieldCheck, 
  AlertCircle,
  Filter,
  SlidersHorizontal,
  X
} from 'lucide-react';

export default function HomeClientFilter({ initialJobs = [], initialCategory = 'all' }) {
  const { t, isRtl } = useLanguage();
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedProvince, setSelectedProvince] = useState('All Pakistan');
  const [selectedBps, setSelectedBps] = useState('All BPS Scales');
  const [selectedQualification, setSelectedQualification] = useState('All Qualifications');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [selectedJobModal, setSelectedJobModal] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const stored = localStorage.getItem('rozgar_saved_jobs');
      return stored ? JSON.parse(stored) : ['govt-fpsc-01'];
    } catch {
      return ['govt-fpsc-01'];
    }
  });

  const handleToggleSave = (job) => {
    const isSaved = savedJobIds.includes(job.id);
    let nextSaved;
    if (isSaved) {
      nextSaved = savedJobIds.filter(id => id !== job.id);
    } else {
      nextSaved = [...savedJobIds, job.id];
    }
    setSavedJobIds(nextSaved);
    try {
      localStorage.setItem('rozgar_saved_jobs', JSON.stringify(nextSaved));
    } catch {}
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedCity('All Cities');
    setSelectedProvince('All Pakistan');
    setSelectedBps('All BPS Scales');
    setSelectedQualification('All Qualifications');
    setUrgentOnly(false);
  };

  const isFilterActive = 
    selectedCategory !== 'all' || 
    selectedProvince !== 'All Pakistan' || 
    selectedCity !== 'All Cities' || 
    selectedBps !== 'All BPS Scales' || 
    selectedQualification !== 'All Qualifications' || 
    urgentOnly ||
    searchQuery.trim().length > 0;

  // Filter Logic
  const filteredJobs = jobs.filter((job) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title?.toLowerCase().includes(q);
      const matchDept = (job.department || job.company || '').toLowerCase().includes(q);
      const matchCity = job.city?.toLowerCase().includes(q);
      const matchAgency = (job.agency || '').toLowerCase().includes(q);
      const matchCategory = (job.category || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDept && !matchCity && !matchAgency && !matchCategory) return false;
    }

    // 2. Category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'govt' && job.type !== 'govt') return false;
      if (selectedCategory === 'private' && job.type !== 'private') return false;
      if (selectedCategory === 'fpsc' && (job.agency !== 'FPSC' && !job.category?.includes('Federal'))) return false;
      if (selectedCategory === 'ppsc' && (job.agency !== 'PPSC' && !job.category?.includes('Punjab'))) return false;
      if (selectedCategory === 'spsc' && (job.agency !== 'SPSC' && !job.category?.includes('Sindh'))) return false;
      if (selectedCategory === 'kppsc' && (job.agency !== 'KPPSC' && !job.category?.includes('KPK'))) return false;
      if (selectedCategory === 'nts' && (job.agency !== 'NTS' && !job.category?.includes('NTS'))) return false;
      if (selectedCategory === 'tech' && job.category !== 'Software & IT') return false;
      if (selectedCategory === 'banking' && job.category !== 'Banking & Finance') return false;
    }

    // 3. City
    if (selectedCity !== 'All Cities') {
      if (!job.city?.toLowerCase().includes(selectedCity.toLowerCase()) && !job.city?.toLowerCase().includes('all pakistan')) return false;
    }

    // 4. Province
    if (selectedProvince !== 'All Pakistan') {
      if (job.province !== selectedProvince && job.province !== 'Federal') return false;
    }

    // 5. BPS Scale
    if (selectedBps !== 'All BPS Scales') {
      if (job.bpsScale !== selectedBps) return false;
    }

    // 6. Qualification
    if (selectedQualification !== 'All Qualifications') {
      if (!job.qualification?.toLowerCase().includes(selectedQualification.toLowerCase())) return false;
    }

    // 7. Urgent Only
    if (urgentOnly) {
      const diff = new Date(job.lastDate).getTime() - new Date().getTime();
      const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (daysLeft > 3 || daysLeft < 0) return false;
    }

    return true;
  });

  const getFeedTitle = () => {
    if (selectedCategory === 'govt') return t.feed.govtTitle;
    if (selectedCategory === 'private') return t.feed.privateTitle;
    return t.feed.allTitle;
  };

  return (
    <div className="home-filter-container">
      {/* Category Pills Header with clean horizontal scroll */}
      <div className="category-tabs-bar mb-5">
        <div className="category-scroll-wrapper">
          {CATEGORIES.map((cat) => {
            const translatedLabel = t.categories[cat.id] || cat.label;
            const count = cat.id === 'all' 
              ? jobs.length 
              : cat.id === 'govt' 
              ? jobs.filter(j => j.type === 'govt').length 
              : cat.id === 'private'
              ? jobs.filter(j => j.type === 'private').length
              : null;

            return (
              <button
                key={cat.id}
                className={`category-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{translatedLabel}</span>
                {count !== null && <span className="cat-count-badge">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="main-content-layout">
        {/* Desktop Filter Sidebar */}
        <aside className="filters-sidebar-col desktop-only-sidebar">
          <FilterSidebar
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBps={selectedBps}
            setSelectedBps={setSelectedBps}
            selectedQualification={selectedQualification}
            setSelectedQualification={setSelectedQualification}
            urgentOnly={urgentOnly}
            setUrgentOnly={setUrgentOnly}
            onResetFilters={handleResetFilters}
            totalResults={filteredJobs.length}
          />
        </aside>

        {/* Jobs Feed Column */}
        <section className="jobs-feed-col">
          {/* Feed Header */}
          <div className="feed-header-bar mb-4">
            <div className="feed-title-block">
              <h2 className="feed-title text-xl font-bold tracking-tight">
                {getFeedTitle()}
              </h2>
              <p className="feed-subtitle text-xs text-secondary mt-0.5">
                {t.feed.subtitlePrefix} <strong>{filteredJobs.length}</strong> {t.feed.subtitleSuffix}
              </p>
            </div>

            <div className="feed-controls-right">
              {/* Mobile Filter Button (Visible on screens < 992px) */}
              <button 
                className={`mobile-filter-open-btn ${isFilterActive ? 'has-filters' : ''}`}
                onClick={() => setMobileFilterOpen(true)}
              >
                <SlidersHorizontal size={15} />
                <span>Filters</span>
                {isFilterActive && <span className="active-filter-dot" />}
              </button>

              <div className="relative feed-search-input-wrapper">
                <input
                  type="text"
                  placeholder={t.feed.searchFilterPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field input-sm pl-8 text-xs"
                />
                <Search size={14} className="absolute left-2.5 top-2.5 text-muted" />
              </div>
            </div>
          </div>

          {/* Job Cards 2-Column Equalized Grid */}
          {filteredJobs.length > 0 ? (
            <div className="jobs-cards-grid">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSelect={(j) => setSelectedJobModal(j)}
                  isSaved={savedJobIds.includes(job.id)}
                  onToggleSave={handleToggleSave}
                  onShareWhatsApp={(j) => {
                    const text = encodeURIComponent(`🇵🇰 *${j.title}*\n🏢 Dept: ${j.department || j.company}\n📍 City: ${j.city}\n⏳ Last Date: ${j.lastDate}\n\n👉 Apply via RozgarPK: https://rozgar.pk/jobs/${j.id}`);
                    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state card text-center py-12 px-4">
              <AlertCircle size={40} className="text-muted mx-auto mb-3" />
              <h3 className="text-base font-bold mb-1">{t.feed.noResultsTitle}</h3>
              <p className="text-xs text-secondary max-w-md mx-auto mb-4">
                {t.feed.noResultsDesc}
              </p>
              <button onClick={handleResetFilters} className="btn btn-outline btn-sm mx-auto">
                <RotateCcw size={14} />
                <span>{t.filters.reset}</span>
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileFilterOpen(false)}>
          <div className="mobile-filter-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-filter-drawer-header">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-emerald-500" />
                <h3 className="font-bold text-base text-primary">Filter Positions</h3>
              </div>
              <button 
                className="action-btn-sm"
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mobile-filter-scroll-body p-4">
              <FilterSidebar
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                selectedProvince={selectedProvince}
                setSelectedProvince={setSelectedProvince}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedBps={selectedBps}
                setSelectedBps={setSelectedBps}
                selectedQualification={selectedQualification}
                setSelectedQualification={setSelectedQualification}
                urgentOnly={urgentOnly}
                setUrgentOnly={setUrgentOnly}
                onResetFilters={handleResetFilters}
                totalResults={filteredJobs.length}
                onCloseMobileFilter={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Selected Job Modal */}
      {selectedJobModal && (
        <JobDetailModal
          job={selectedJobModal}
          isOpen={!!selectedJobModal}
          onClose={() => setSelectedJobModal(null)}
          isSaved={savedJobIds.includes(selectedJobModal.id)}
          onToggleSave={handleToggleSave}
          allJobs={jobs}
        />
      )}
    </div>
  );
}
