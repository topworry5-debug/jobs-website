'use client';

import React, { useState, useEffect, useMemo } from 'react';
import FilterSidebar from './FilterSidebar';
import JobCard from './JobCard';
import JobDetailModal from './JobDetailModal';
import { CATEGORIES } from '../data/jobsData';
import { CATEGORIES_CONFIG, matchesJobCategory, getCategoryBySlug } from '../data/categoriesData';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  RotateCcw, 
  SlidersHorizontal,
  X,
  ChevronDown,
  Inbox
} from 'lucide-react';
import { partitionJobs, isClosingSoon } from '../lib/jobStatus';

export default function HomeClientFilter({ initialJobs = [], initialCategory = 'all' }) {
  const { t } = useLanguage();
  const [jobs] = useState(initialJobs);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedProvince, setSelectedProvince] = useState('All Pakistan');
  const [selectedBps, setSelectedBps] = useState('All BPS Scales');
  const [selectedQualification, setSelectedQualification] = useState('All Qualifications');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState('closing-soon'); // 'closing-soon' | 'newest' | 'vacancies'
  const [selectedJobModal, setSelectedJobModal] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [recentlyClosedOpen, setRecentlyClosedOpen] = useState(false); // Collapsed by default
  const [visibleCount, setVisibleCount] = useState(12);

  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const stored = localStorage.getItem('tainaati_saved_jobs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Read URL params on mount
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

  // Listen to filter events from hero search, chips, and popstate
  useEffect(() => {
    const handleFilterChange = (e) => {
      if (e?.detail) {
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
    const nextSaved = isSaved 
      ? savedJobIds.filter(id => id !== job.id)
      : [...savedJobIds, job.id];

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

  // Partition jobs into open and recently closed (<= 30d)
  const { openJobs, recentlyClosedJobs } = useMemo(() => {
    return partitionJobs(jobs, 30);
  }, [jobs]);

  // Compute live category counts based strictly on OPEN listings
  const categoryCounts = useMemo(() => {
    const counts = {
      all: openJobs.length,
      govt: openJobs.filter(j => j.type === 'govt').length,
      private: openJobs.filter(j => j.type === 'private').length,
      fpsc: openJobs.filter(j => (j.agency || '').toUpperCase() === 'FPSC').length,
      ppsc: openJobs.filter(j => (j.agency || '').toUpperCase() === 'PPSC').length,
      spsc: openJobs.filter(j => (j.agency || '').toUpperCase() === 'SPSC').length,
      kppsc: openJobs.filter(j => (j.agency || '').toUpperCase() === 'KPPSC').length,
      bpsc: openJobs.filter(j => (j.agency || '').toUpperCase() === 'BPSC').length,
      nts: openJobs.filter(j => (j.agency || '').toUpperCase() === 'NTS').length,
    };
    CATEGORIES_CONFIG.forEach(cat => {
      counts[cat.slug] = openJobs.filter(j => matchesJobCategory(j, cat.id)).length;
    });
    return counts;
  }, [openJobs]);

  // Filter visible category tabs:
  // 1. Keep 'all'
  // 2. Hide any tab where count === 0
  // 3. Hide any tab where count === categoryCounts.all (omit redundant duplicate equal to 'All')
  const visibleCategories = useMemo(() => {
    const totalOpen = categoryCounts.all;
    return CATEGORIES.filter(cat => {
      if (cat.id === 'all') return true;
      const count = categoryCounts[cat.id] ?? 0;
      if (count <= 0) return false;
      if (count === totalOpen) return false;
      return true;
    });
  }, [categoryCounts]);

  // Matcher for filtering
  const matchesJobFilters = (job, checkUrgency = true) => {
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

    if (selectedCategory !== 'all') {
      if (selectedCategory === 'govt') {
        if (job.type !== 'govt') return false;
      } else if (selectedCategory === 'private') {
        if (job.type !== 'private') return false;
      } else if (['fpsc', 'ppsc', 'spsc', 'kppsc', 'bpsc', 'nts'].includes(selectedCategory.toLowerCase())) {
        const agencyCode = selectedCategory.toUpperCase();
        if ((job.agency || '').toUpperCase() !== agencyCode && !(job.category || '').toUpperCase().includes(agencyCode)) return false;
      } else if (!matchesJobCategory(job, selectedCategory)) {
        return false;
      }
    }

    if (selectedCity !== 'All Cities') {
      if (!job.city?.toLowerCase().includes(selectedCity.toLowerCase()) && !job.city?.toLowerCase().includes('all pakistan')) return false;
    }

    if (selectedProvince !== 'All Pakistan') {
      if (job.province !== selectedProvince && job.province !== 'Federal') return false;
    }

    if (selectedBps !== 'All BPS Scales') {
      if (job.bpsScale !== selectedBps) return false;
    }

    if (selectedQualification !== 'All Qualifications') {
      if (!job.qualification?.toLowerCase().includes(selectedQualification.toLowerCase())) return false;
    }

    if (checkUrgency && urgentOnly) {
      if (!isClosingSoon(job.lastDate, 3)) return false;
    }

    return true;
  };

  // Filter open jobs
  const rawFilteredJobs = useMemo(() => {
    return openJobs.filter(j => matchesJobFilters(j, true));
  }, [openJobs, searchQuery, selectedCategory, selectedCity, selectedProvince, selectedBps, selectedQualification, urgentOnly]);

  // Apply sorting: default is closing soonest first
  const sortedJobs = useMemo(() => {
    const list = [...rawFilteredJobs];
    if (sortBy === 'closing-soon') {
      return list.sort((a, b) => new Date(a.lastDate) - new Date(b.lastDate));
    }
    if (sortBy === 'newest') {
      return list.sort((a, b) => (new Date(b.postedDate || 0) - new Date(a.postedDate || 0)));
    }
    if (sortBy === 'vacancies') {
      return list.sort((a, b) => (b.vacancies || 1) - (a.vacancies || 1));
    }
    return list;
  }, [rawFilteredJobs, sortBy]);

  // Filter recently closed jobs
  const filteredRecentlyClosedJobs = useMemo(() => {
    return recentlyClosedJobs.filter(j => matchesJobFilters(j, false));
  }, [recentlyClosedJobs, searchQuery, selectedCategory, selectedCity, selectedProvince, selectedBps, selectedQualification]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, selectedProvince, selectedCity, selectedBps, selectedQualification, urgentOnly, searchQuery, sortBy]);

  const displayedJobs = sortedJobs.slice(0, visibleCount);
  const hasMore = visibleCount < sortedJobs.length;

  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) +
    (selectedProvince !== 'All Pakistan' ? 1 : 0) +
    (selectedCity !== 'All Cities' ? 1 : 0) +
    (selectedBps !== 'All BPS Scales' ? 1 : 0) +
    (selectedQualification !== 'All Qualifications' ? 1 : 0) +
    (urgentOnly ? 1 : 0) +
    (searchQuery.trim().length > 0 ? 1 : 0);

  return (
    <div className="home-filter-root">
      {/* Category Tabs: only shown if there are multiple non-redundant tabs */}
      {visibleCategories.length > 1 && (
        <div className="category-tabs-container">
          <div className="category-scroll-wrapper" role="tablist" aria-label="Job categories">
            {visibleCategories.map((cat) => {
              const translatedLabel = t.categories?.[cat.id] || cat.label;
              const count = categoryCounts[cat.id] ?? null;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`category-pill-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{translatedLabel}</span>
                  {count > 0 && <span className="cat-count-badge tabular-nums">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="main-content-layout">
        {/* Desktop Left Filter Sidebar */}
        <aside className="filters-sidebar-col desktop-only-sidebar" aria-label="Filter Options">
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
            totalResults={sortedJobs.length}
            categories={visibleCategories}
            categoryCounts={categoryCounts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </aside>

        {/* Jobs Feed Column */}
        <section className="jobs-feed-col" aria-label="Job Listings">
          {/* Feed Header with Live Result Count ("9 jobs"), Sort Dropdown & Search */}
          <div className="feed-header-bar">
            <div className="feed-title-block">
              <h2 className="feed-title">
                {selectedCategory === 'all' ? 'Job Openings' : (getCategoryBySlug(selectedCategory)?.name || 'Filtered Positions')}
              </h2>
              <span className="feed-live-count tabular-nums">
                {sortedJobs.length} {sortedJobs.length === 1 ? 'job' : 'jobs'}
              </span>
            </div>

            <div className="feed-controls-right">
              {/* Visible Sort Dropdown */}
              <div className="feed-sort-wrapper">
                <label htmlFor="feed-sort-select" className="sr-only">Sort Jobs</label>
                <select
                  id="feed-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="feed-sort-select"
                  aria-label="Sort jobs by"
                >
                  <option value="closing-soon">Sort: Closing soon</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="vacancies">Sort: Most vacancies</option>
                </select>
              </div>

              {/* Mobile Filter Button (Under 1024px) */}
              <button 
                type="button"
                className={`mobile-filter-open-btn ${isFilterActive ? 'has-filters' : ''}`}
                onClick={() => setMobileFilterOpen(true)}
                aria-label="Open filter options"
              >
                <SlidersHorizontal size={15} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="active-filter-badge tabular-nums">{activeFilterCount}</span>
                )}
              </button>

              {/* Search Within Feed with search icon INSIDE the input */}
              <div className="feed-quick-search-box">
                <Search size={15} className="feed-quick-search-icon" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Filter by title, city, dept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="feed-quick-search-input"
                  aria-label="Filter listings by title, city, department"
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')}
                    className="feed-search-clear-btn"
                    aria-label="Clear filter text"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* OPEN JOBS LISTING: Compact Rows */}
          {sortedJobs.length > 0 ? (
            <>
              <div className="jobs-rows-list" role="feed" aria-label="Open Positions">
                {displayedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobIds.includes(job.id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="load-more-section">
                  <button 
                    type="button"
                    onClick={() => setVisibleCount(prev => prev + 12)}
                    className="load-more-btn"
                  >
                    Load More Positions ({sortedJobs.length - visibleCount} Remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Accessible, Readable Empty State */
            <div className="empty-state-readable" role="region" aria-label="No jobs found">
              <div className="empty-state-icon-box">
                <Inbox size={32} className="text-muted" aria-hidden="true" />
              </div>
              <h3 className="empty-state-title">No jobs match your selected filters</h3>
              <p className="empty-state-desc">
                {isFilterActive 
                  ? 'No active vacancies match your current search criteria. Try removing some filters or clearing your search term to see all available opportunities.'
                  : 'There are currently no active openings published in this category. New notices are monitored and published as soon as gazettes are released.'}
              </p>
              {isFilterActive && (
                <button 
                  type="button"
                  onClick={handleResetFilters} 
                  className="empty-state-reset-btn"
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  <span>Clear All Filters</span>
                </button>
              )}
            </div>
          )}

          {/* RECENTLY CLOSED POSITIONS (Last 30 Days) - Collapsed by default */}
          {filteredRecentlyClosedJobs.length > 0 && (
            <div className="recently-closed-section">
              <button
                type="button"
                className="recently-closed-toggle-header"
                onClick={() => setRecentlyClosedOpen(!recentlyClosedOpen)}
                aria-expanded={recentlyClosedOpen}
              >
                <div className="flex items-center gap-2">
                  <span className="recently-closed-dot" aria-hidden="true" />
                  <h3 className="recently-closed-title">Recently Closed Positions (Last 30 Days)</h3>
                  <span className="recently-closed-badge tabular-nums">
                    {filteredRecentlyClosedJobs.length}
                  </span>
                </div>
                <div className="recently-closed-action">
                  <span>{recentlyClosedOpen ? 'Hide' : 'Show'}</span>
                  <ChevronDown size={16} className={`toggle-chevron ${recentlyClosedOpen ? 'rotated' : ''}`} />
                </div>
              </button>

              {recentlyClosedOpen && (
                <div className="recently-closed-body">
                  <p className="recently-closed-note">
                    Applications have closed. Retained for candidate verification, syllabus review, and gazette reference.
                  </p>
                  <div className="jobs-rows-list">
                    {filteredRecentlyClosedJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        isSaved={savedJobIds.includes(job.id)}
                        onToggleSave={handleToggleSave}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileFilterOpen(false)}>
          <div className="mobile-filter-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-filter-drawer-header">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-brand-primary" />
                <h3 className="font-bold text-base">Filter Positions</h3>
              </div>
              <button 
                type="button"
                className="header-icon-btn"
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mobile-filter-drawer-body">
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
                totalResults={sortedJobs.length}
                onCloseMobileFilter={() => setMobileFilterOpen(false)}
                categories={visibleCategories}
                categoryCounts={categoryCounts}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
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
