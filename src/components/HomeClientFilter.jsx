'use client';

import React, { useState, useEffect, useMemo } from 'react';
import FilterSidebar from './FilterSidebar';
import JobCard from './JobCard';
import JobCardSkeleton from './JobCardSkeleton';
import JobDetailModal from './JobDetailModal';
import { CITIES, PROVINCES, BPS_SCALES, QUALIFICATIONS, CATEGORIES } from '../data/jobsData';
import { CATEGORIES_CONFIG, matchesJobCategory, getCategoryBySlug } from '../data/categoriesData';
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

import { isClosingSoon } from '../utils/jobMetrics';

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
      const stored = localStorage.getItem('tainaati_saved_jobs');
      return stored ? JSON.parse(stored) : ['govt-fpsc-01'];
    } catch {
      return ['govt-fpsc-01'];
    }
  });

  // Read URL search params on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || params.get('query');
      const c = params.get('city');
      const cat = params.get('category');
      if (q) setSearchQuery(q);
      if (c && c !== 'All Cities') setSelectedCity(c);
      if (cat && cat !== 'all') setSelectedCategory(cat);
    }
  }, []);

  // Listen to filter change events from hero search bar, navbar, and browser history navigation
  useEffect(() => {
    const handleFilterChange = (e) => {
      if (e && e.detail) {
        if (e.detail.query !== undefined) setSearchQuery(e.detail.query);
        if (e.detail.city !== undefined) setSelectedCity(e.detail.city);
        if (e.detail.category !== undefined) setSelectedCategory(e.detail.category);
      }
    };

    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        setSearchQuery(params.get('q') || params.get('query') || '');
        setSelectedCity(params.get('city') || 'All Cities');
        setSelectedCategory(params.get('category') || initialCategory);
      }
    };

    window.addEventListener('tainaati:filter-change', handleFilterChange);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('tainaati:filter-change', handleFilterChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [initialCategory]);

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
      localStorage.setItem('tainaati_saved_jobs', JSON.stringify(nextSaved));
      window.dispatchEvent(new Event('tainaati_saved_jobs_updated'));
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

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
      window.dispatchEvent(new CustomEvent('tainaati:filter-change', {
        detail: { query: '', city: 'All Cities', category: 'all' }
      }));
    }
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
    // 1. Search Query & Quick Urgent Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      if (q === 'urgent' || q === 'closing soon') {
        if (!isClosingSoon(job.lastDate, 3)) return false;
      } else {
        const matchTitle = job.title?.toLowerCase().includes(q);
        const matchDept = (job.department || job.company || '').toLowerCase().includes(q);
        const matchCity = job.city?.toLowerCase().includes(q);
        const matchAgency = (job.agency || '').toLowerCase().includes(q);
        const matchCategory = (job.category || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDept && !matchCity && !matchAgency && !matchCategory) return false;
      }
    }

    // 2. Category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'govt') {
        if (job.type !== 'govt') return false;
      } else if (selectedCategory === 'private') {
        if (job.type !== 'private') return false;
      } else if (!matchesJobCategory(job, selectedCategory)) {
        return false;
      }
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

    // 7. Urgent Only (closing in <= 3 days)
    if (urgentOnly) {
      if (!isClosingSoon(job.lastDate, 3)) return false;
    }

    return true;
  });

  const getFeedTitle = () => {
    if (selectedCategory === 'govt') return t.feed.govtTitle;
    if (selectedCategory === 'private') return t.feed.privateTitle;
    const catConfig = getCategoryBySlug(selectedCategory);
    if (catConfig) return catConfig.name;
    return t.feed.allTitle;
  };

  // Compute live category counts dynamically
  const categoryCounts = useMemo(() => {
    const counts = {
      all: jobs.length,
      govt: jobs.filter(j => j.type === 'govt').length,
      private: jobs.filter(j => j.type === 'private').length,
      fpsc: jobs.filter(j => j.agency === 'FPSC').length,
      ppsc: jobs.filter(j => j.agency === 'PPSC').length,
      spsc: jobs.filter(j => j.agency === 'SPSC').length,
      kppsc: jobs.filter(j => j.agency === 'KPPSC').length,
      nts: jobs.filter(j => j.agency === 'NTS').length,
    };
    CATEGORIES_CONFIG.forEach(cat => {
      counts[cat.slug] = jobs.filter(j => matchesJobCategory(j, cat.id)).length;
    });
    return counts;
  }, [jobs]);

  // Only display categories that have active jobs (or are the master 'all'/'govt' views)
  const visibleCategories = useMemo(() => {
    const active = CATEGORIES.filter(cat => {
      const count = categoryCounts[cat.id] ?? 0;
      if (cat.id === 'all' || cat.id === 'govt' || cat.id === selectedCategory) return true;
      return count > 0;
    });
    return active;
  }, [categoryCounts, selectedCategory]);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFilterOpen]);

  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) +
    (selectedProvince !== 'All Pakistan' ? 1 : 0) +
    (selectedCity !== 'All Cities' ? 1 : 0) +
    (selectedBps !== 'All BPS Scales' ? 1 : 0) +
    (selectedQualification !== 'All Qualifications' ? 1 : 0) +
    (urgentOnly ? 1 : 0);

  const [visibleCount, setVisibleCount] = useState(12);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, selectedProvince, selectedCity, selectedBps, selectedQualification, urgentOnly, searchQuery]);

  const displayedJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  return (
    <div className="home-filter-container">
      {/* Category Pills Header with clean horizontal scroll */}
      <div className="category-tabs-bar mb-5">
        <div className="category-scroll-wrapper">
          {visibleCategories.map((cat) => {
            const translatedLabel = t.categories[cat.id] || cat.label;
            const count = categoryCounts[cat.id] ?? null;

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
                aria-label="Filters"
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="active-filter-badge">{activeFilterCount}</span>
                )}
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
            <>
              <div className="jobs-cards-grid">
                {displayedJobs.map((job, idx) => (
                  <div 
                    key={job.id} 
                    className="job-card-entrance-wrapper"
                    style={{ animationDelay: `${Math.min(idx * 60, 600)}ms` }}
                  >
                    <JobCard
                      job={job}
                      isSaved={savedJobIds.includes(job.id)}
                      onToggleSave={handleToggleSave}
                      onShareWhatsApp={(j) => {
                        const text = encodeURIComponent(`🇵🇰 *${j.title}*\n🏢 Dept: ${j.department || j.company}\n📍 City: ${j.city}\n⏳ Last Date: ${j.lastDate}\n\n👉 Apply via Tainaati: https://tainaati.com/jobs/${j.id}`);
                        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                      }}
                    />
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="load-more-section text-center mt-6 pt-4 border-t border-subtle">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 12)}
                    className="btn btn-primary px-8 py-3 font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Load More Positions ({filteredJobs.length - visibleCount} Remaining)</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state card text-center py-12 px-6">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-emerald-500/10 text-emerald-600 mb-3 mx-auto">
                <AlertCircle size={36} />
              </div>
              <h3 className="text-xl font-bold font-display mb-2">
                {searchQuery.trim() 
                  ? `No positions found for "${searchQuery.trim()}"` 
                  : selectedCity !== 'All Cities' 
                    ? `No positions found in ${selectedCity}`
                    : t.feed.noResultsTitle}
              </h3>
              <p className="text-sm text-secondary max-w-md mx-auto mb-5 leading-relaxed">
                {searchQuery.trim() || selectedCity !== 'All Cities'
                  ? `We could not find active verified jobs matching your criteria in ${selectedCity !== 'All Cities' ? selectedCity : 'all regions'}. Try using a broader keyword, selecting "All Cities", or clearing all active filters.`
                  : t.feed.noResultsDesc}
              </p>
              <button 
                id="clear-all-filters-btn"
                onClick={handleResetFilters} 
                className="btn btn-primary btn-sm mx-auto"
              >
                <RotateCcw size={14} />
                <span>Clear All Filters</span>
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
