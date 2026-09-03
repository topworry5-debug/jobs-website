'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Bookmark, 
  ShieldCheck, 
  Flame,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { JOBS_DATA } from '../data/jobsData';
import { matchesJobCategory, getCategoryBySlug } from '../data/categoriesData';
import { calculateDaysLeft, isClosingSoon } from '../utils/jobMetrics';

export default function JobsForYouSection() {
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [userAlerts, setUserAlerts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tainaati_saved_jobs') || '[]');
      const alerts = JSON.parse(localStorage.getItem('tainaati_user_alerts') || '[]');
      setSavedJobIds(Array.isArray(saved) ? saved : []);
      setUserAlerts(Array.isArray(alerts) ? alerts : []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const handleToggleSave = (jobId) => {
    let updated;
    if (savedJobIds.includes(jobId)) {
      updated = savedJobIds.filter(id => id !== jobId);
    } else {
      updated = [...savedJobIds, jobId];
    }
    setSavedJobIds(updated);
    try {
      localStorage.setItem('tainaati_saved_jobs', JSON.stringify(updated));
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

      const matching = JOBS_DATA.filter(job => {
        if (savedJobIds.includes(job.id)) return false; // Already saved
        let matches = false;
        if (topCategory && matchesJobCategory(job, topCategory)) matches = true;
        if (topCity && job.city?.toLowerCase().includes(topCity.toLowerCase())) matches = true;
        return matches;
      }).slice(0, 4);

      if (matching.length > 0) {
        return {
          recommendedJobs: matching,
          reasonLabel: reason,
          hasPersonalHistory: true
        };
      }
    }

    // Fallback: Trending Opportunities (High vacancy / featured)
    const fallback = JOBS_DATA
      .filter(j => !savedJobIds.includes(j.id))
      .sort((a, b) => (b.vacancies || 1) - (a.vacancies || 1))
      .slice(0, 4);

    return {
      recommendedJobs: fallback,
      reasonLabel: "High-Demand National Vacancies (Verified Quotas)",
      hasPersonalHistory: false
    };
  }, [savedJobIds, userAlerts]);

  if (!isLoaded || recommendedJobs.length === 0) return null;

  return (
    <section className="jobs-for-you-section mb-6">
      <div className="card p-4 md:p-5 bg-gradient-to-r from-emerald-950/20 via-subtle to-transparent border-emerald-500/30">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 border-b border-theme pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-main">
                  {hasPersonalHistory ? "Jobs Recommended For You" : "Trending Opportunities"}
                </h2>
                {hasPersonalHistory && (
                  <span className="badge badge-govt text-[11px] py-0.5">Personalized</span>
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
            <span>View Saved Jobs ({savedJobIds.length})</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* 4-Card Horizontal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recommendedJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            const daysLeft = calculateDaysLeft(job.lastDate);
            const isUrgent = isClosingSoon(job.lastDate, 3);
            const isGovt = job.type === 'govt';

            return (
              <div 
                key={job.id} 
                className="p-3.5 rounded-lg border border-theme bg-card hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-2 group shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-start gap-1 mb-1">
                    <span className={`badge ${isGovt ? 'badge-govt' : 'badge-private'} text-[10px]`}>
                      {isGovt ? job.bpsScale || 'Govt' : 'Private'}
                    </span>

                    <button
                      onClick={() => handleToggleSave(job.id)}
                      className={`text-muted hover:text-emerald-500 p-0.5 rounded transition-colors ${isSaved ? 'text-emerald-500' : ''}`}
                      title={isSaved ? "Remove from saved" : "Save job"}
                    >
                      <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <h3 className="text-xs font-bold text-main line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
                    <Link href={`/jobs/${job.id}`}>
                      {job.title}
                    </Link>
                  </h3>

                  <div className="text-[11px] text-muted truncate mt-1" dir="auto">
                    {job.department || job.company}
                  </div>
                </div>

                <div className="border-t border-theme/60 pt-2 space-y-1 text-[11px] text-secondary">
                  <div className="flex items-center gap-1 truncate">
                    <MapPin size={11} className="text-muted flex-shrink-0" />
                    <span className="truncate">{job.city}</span>
                  </div>

                  <div className="flex justify-between items-center pt-0.5">
                    <div className="flex items-center gap-1">
                      <Clock size={11} className={isUrgent ? 'text-amber-500' : 'text-muted'} />
                      <span className={isUrgent ? 'font-bold text-amber-500' : 'text-muted'}>
                        {daysLeft}d left
                      </span>
                    </div>

                    <Link 
                      href={`/jobs/${job.id}`}
                      className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center text-[11px]"
                    >
                      <span>Apply</span>
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
