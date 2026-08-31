import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Grid, 
  List, 
  ArrowUpDown, 
  Briefcase, 
  Landmark, 
  AlertCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import JobCard from './JobCard';

export default function JobListings({
  jobs,
  activeType,
  setActiveType,
  onSelectJob,
  savedJobIds,
  onToggleSave,
  onShareWhatsApp,
  onShareFacebook,
  onOpenMobileFilter,
  onResetFilters
}) {
  const [sortBy, setSortBy] = useState('closing-soon');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Sort logic
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'closing-soon') {
      return new Date(a.lastDate) - new Date(b.lastDate);
    }
    if (sortBy === 'newest') {
      return new Date(b.postDate) - new Date(a.postDate);
    }
    if (sortBy === 'vacancies') {
      return (b.vacancies || 0) - (a.vacancies || 0);
    }
    return 0;
  });

  return (
    <div className="job-listings-main-container">
      {/* Top Header Controls */}
      <div className="listings-control-bar">
        <div className="listings-info">
          <h2 className="listings-heading">
            {activeType === 'govt' ? 'Government & Public Sector Positions' : 
             activeType === 'private' ? 'Private & Tech Careers' : 
             'All Verified Job Openings in Pakistan'}
          </h2>
          <p className="listings-subheading">
            Showing <strong>{sortedJobs.length}</strong> active verified opportunities
          </p>
        </div>

        <div className="listings-actions-right">
          {/* Mobile Filter Button */}
          <button 
            className="mobile-filter-trigger-btn"
            onClick={onOpenMobileFilter}
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="sort-dropdown-wrapper">
            <ArrowUpDown size={15} className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="closing-soon">Deadline: Closing Soonest</option>
              <option value="newest">Posted: Newest First</option>
              <option value="vacancies">Highest Vacancies</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {sortedJobs.length > 0 ? (
        <div className={`jobs-layout-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
          {sortedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={onSelectJob}
              isSaved={savedJobIds.includes(job.id)}
              onToggleSave={onToggleSave}
              onShareWhatsApp={onShareWhatsApp}
              onShareFacebook={onShareFacebook}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="empty-results-state card">
          <div className="empty-icon-circle">
            <AlertCircle size={36} className="text-muted" />
          </div>
          <h3 className="empty-title">No listings match your selected criteria</h3>
          <p className="empty-desc">
            Try adjusting your search keywords, clearing province/city filters, or resetting the filter panel.
          </p>
          <button 
            className="btn btn-outline"
            onClick={onResetFilters}
          >
            <RotateCcw size={15} />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
