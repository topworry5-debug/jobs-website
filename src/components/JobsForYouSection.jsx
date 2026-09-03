'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, Bookmark } from 'lucide-react';
import { JOBS_DATA } from '../data/jobsData';
import { matchesJobCategory, getCategoryBySlug } from '../data/categoriesData';
import { isJobClosedOrClosingToday } from '../utils/jobStatus';
import JobCard from './JobCard';

export default function JobsForYouSection() {
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [userAlerts, setUserAlerts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tainaati_saved_jobs') || '[]');
      setSavedJobIds(Array.isArray(saved) ? saved : []);

      const alerts = JSON.parse(localStorage.getItem('tainaati_alerts') || '[]');
      setUserAlerts(Array.isArray(alerts) ? alerts : []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const handleToggleSave = (job) => {
    try {
      const isSaved = savedJobIds.includes(job.id);
      const nextSaved = isSaved 
        ? savedJobIds.filter(id => id !== job.id)
        : [...savedJobIds, job.id];

      setSavedJobIds(nextSaved);
      localStorage.setItem('tainaati_saved_jobs', JSON.stringify(nextSaved));
      window.dispatchEvent(new Event('tainaati_saved_jobs_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  // Compute recommendation affinities
  const { recommendedJobs, reasonLabel, hasPersonalHistory } = useMemo(() => {
    // 1. Gather saved jobs
    const savedJobs = savedJobIds
      .map(id => JOBS_DATA.find(j => j.id === id))
      .filter(Boolean);

    // Count categories & cities
    const catFreq = {};
    const cityFreq = {};

    savedJobs.forEach(job => {
      const cat = job.categorySlug || job.category;
      if (cat) catFreq[cat] = (catFreq[cat] || 0) + 1;
      if (job.city && job.city !== 'All Pakistan') cityFreq[job.city] = (cityFreq[job.city] || 0) + 1;
    });

    userAlerts.forEach(alert => {
      if (alert.category && alert.category !== 'all') {
        catFreq[alert.category] = (catFreq[alert.category] || 0) + 2;
      }
      if (alert.city && alert.city !== 'All Cities') {
        cityFreq[alert.city] = (cityFreq[alert.city] || 0) + 2;
      }
    });

    const topCategory = Object.keys(catFreq).sort((a, b) => catFreq[b] - catFreq[a])[0];
    const topCity = Object.keys(cityFreq).sort((a, b) => cityFreq[b] - cityFreq[a])[0];

    if (topCategory || topCity) {
      // User has personal history
      const categoryObj = topCategory ? getCategoryBySlug(topCategory) : null;
      const catName = categoryObj ? categoryObj.shortName : topCategory;

      let reason = "Based on your saved jobs & alert preferences";
      if (catName && topCity) {
        reason = `Based on your interest in ${catName} in ${topCity}`;
      } else if (catName) {
        reason = `Based on your interest in ${catName}`;
      } else if (topCity) {
        reason = `Based on your interest in jobs in ${topCity}`;
      }

      // Strictly exclude any job that is closed or closing today (0d left)
      const matching = JOBS_DATA.filter(job => {
        if (savedJobIds.includes(job.id)) return false; // Already saved
        if (isJobClosedOrClosingToday(job)) return false; // Exclude 0d left or expired
        let matches = false;
        if (topCategory && matchesJobCategory(job, topCategory)) matches = true;
        if (topCity && job.city?.toLowerCase().includes(topCity.toLowerCase())) matches = true;
        return matches;
      }).slice(0, 3);

      if (matching.length > 0) {
        return {
          recommendedJobs: matching,
          reasonLabel: reason,
          hasPersonalHistory: true
        };
      }
    }

    // Fallback: Trending Opportunities (High vacancy / featured)
    // Strictly exclude any job that is closed or closing today (0d left)
    const fallback = JOBS_DATA
      .filter(j => !savedJobIds.includes(j.id) && !isJobClosedOrClosingToday(j))
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.vacancies || 1) - (a.vacancies || 1);
      })
      .slice(0, 3);

    return {
      recommendedJobs: fallback,
      reasonLabel: "High-Demand National Vacancies (Verified Quotas)",
      hasPersonalHistory: false
    };
  }, [savedJobIds, userAlerts]);

  if (!isLoaded || recommendedJobs.length === 0) return null;

  return (
    <section className="jobs-for-you-section mb-8">
      <div className="card p-5 md:p-6 bg-surface border border-subtle rounded-2xl shadow-sm space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-subtle pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-primary font-serif">
                  {hasPersonalHistory ? "Jobs Recommended For You" : "Trending Opportunities"}
                </h2>
                {hasPersonalHistory ? (
                  <span className="badge badge-govt text-[11px] py-0.5">Personalized</span>
                ) : (
                  <span className="badge badge-official text-[11px] py-0.5">High Demand</span>
                )}
              </div>
              <p className="text-xs text-secondary mt-0.5">
                {reasonLabel}
              </p>
            </div>
          </div>

          <Link 
            href="/saved-jobs" 
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Saved Jobs ({savedJobIds.length})</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Unified Responsive 3-Column / 2-Column / 1-Column Card Grid */}
        <div className="jobs-cards-grid">
          {recommendedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.includes(job.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
