'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import SectionBadge from './SectionBadge';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  Filter,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function BlogClientHub({ articles = [], clusters = [] }) {
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchCluster = selectedCluster === 'all' || art.cluster === selectedCluster;
      const matchQuery = !searchQuery || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.metaDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.targetKeywords && art.targetKeywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCluster && matchQuery;
    });
  }, [articles, selectedCluster, searchQuery]);

  return (
    <div className="blog-hub-container">
      {/* Search & Cluster Filter Bar */}
      <div className="blog-filters-bar">
        {/* Cluster Tabs */}
        <div className="blog-cluster-tabs">
          {clusters.map((cluster) => {
            const isActive = selectedCluster === cluster.id;
            return (
              <button
                key={cluster.id}
                onClick={() => setSelectedCluster(cluster.id)}
                className={`blog-filter-btn ${isActive ? 'active' : ''}`}
              >
                {cluster.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="blog-search-box">
          <div className="blog-search-icon">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides by keyword..."
            className="blog-search-input"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="blog-grid">
          {filteredArticles.map((art) => (
            <article 
              key={art.slug} 
              className="blog-card"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <SectionBadge variant="govt" size="xs">
                    {art.clusterLabel}
                  </SectionBadge>
                  <span className="text-[11px] text-muted flex items-center gap-1 font-mono">
                    <Clock size={11} className="flex-shrink-0" />
                    <span>{art.readTime}</span>
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-2">
                  {art.heroBanner?.logo && (
                    <div className="w-10 h-10 rounded-lg bg-surface-subtle border border-subtle flex items-center justify-center p-1.5 flex-shrink-0 mt-0.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={art.heroBanner.logo} 
                        alt="" 
                        className="w-full h-full object-contain"
                        width={28}
                        height={28}
                      />
                    </div>
                  )}
                  <h3 className="blog-card-title flex-1">
                    <Link href={`/blog/${art.slug}`}>
                      {art.title}
                    </Link>
                  </h3>
                </div>

                <p className="text-secondary text-xs line-clamp-3 leading-relaxed mb-4">
                  {art.metaDescription}
                </p>

                {art.heroBanner?.quickStats && (
                  <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    {art.heroBanner.quickStats.slice(0, 2).map((s, idx) => (
                      <span key={idx} className="badge badge-bps text-[10px]">
                        {s.label}: {s.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-subtle flex items-center justify-between mt-auto">
                <span className="text-[11px] text-muted">
                  Updated: {art.updatedDate}
                </span>
                <Link 
                  href={`/blog/${art.slug}`}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
                >
                  <span>Read Guide</span>
                  <ArrowRight size={13} className="flex-shrink-0" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center bg-surface-subtle">
          <BookOpen size={28} className="mx-auto text-muted mb-2 flex-shrink-0" />
          <h3 className="font-bold text-base text-primary">No guides found</h3>
          <p className="text-secondary text-xs mt-1">Try searching for a different keyword or resetting your category filter.</p>
          <button
            onClick={() => { setSelectedCluster('all'); setSearchQuery(''); }}
            className="btn btn-outline btn-sm mt-4 text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
