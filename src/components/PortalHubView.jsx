import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Landmark, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  ExternalLink,
  Search,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import HomeClientFilter from './HomeClientFilter';

export default function PortalHubView({ 
  portal, 
  jobs = [], 
  siteUrl = 'https://www.tainaati.com' 
}) {
  const activeJobs = jobs.filter(j => !j.archived_at);

  return (
    <div className="portal-hub-page-container container-xl py-6">
      {/* Hero Section */}
      <div className="card p-6 md:p-8 mb-6 border-l-4 border-l-emerald-500 bg-surface">
        {/* Top Badges */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="badge badge-govt font-bold">
              <Landmark size={13} />
              <span>{portal.name} Hub</span>
            </span>
            <span className="badge badge-verified">
              <ShieldCheck size={13} />
              <span>{activeJobs.length} Live Openings</span>
            </span>
          </div>
          <span className="text-xs text-muted font-mono">
            🎯 High Intent: {portal.targetKeyword} ({portal.monthlySearches})
          </span>
        </div>

        {/* H1 - Exact Keyword Match */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-3">
          {portal.h1}
        </h1>

        {/* Intro Paragraph */}
        <p className="text-secondary text-sm md:text-base leading-relaxed max-w-4xl mb-6">
          {portal.intro}
        </p>

        {/* Highlights Grid */}
        {portal.highlights && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {portal.highlights.map((hl, idx) => (
              <div key={idx} className="bg-surface-subtle p-3 rounded-lg border border-subtle">
                <span className="text-[11px] text-muted block">{hl.label}</span>
                <strong className="text-xs sm:text-sm font-bold text-primary block mt-0.5">{hl.value}</strong>
              </div>
            ))}
          </div>
        )}

        {/* Official Statutory Notice */}
        {portal.officialNotice && (
          <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-secondary leading-relaxed flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-primary font-semibold block mb-0.5">Official Statutory Compliance Notice:</strong>
              <span>{portal.officialNotice}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sub-Hubs Navigation (Cities, Agencies & Guides) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* City Hubs */}
        {portal.cities && portal.cities.length > 0 && (
          <div className="card p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2.5 flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-500" />
              <span>City Career Hubs</span>
            </h3>
            <div className="space-y-2">
              {portal.cities.map((city, idx) => (
                <Link
                  key={idx}
                  href={city.href}
                  className="p-2 rounded border border-subtle hover:border-emerald-500 transition-colors flex items-center justify-between text-xs group"
                >
                  <div>
                    <span className="font-semibold text-primary block group-hover:text-emerald-500 transition-colors">{city.name}</span>
                    <span className="text-[10px] text-muted">{city.note}</span>
                  </div>
                  <ArrowRight size={12} className="text-muted group-hover:text-emerald-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Commission / Agency Hubs */}
        {portal.agencies && portal.agencies.length > 0 && (
          <div className="card p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2.5 flex items-center gap-1.5">
              <Landmark size={14} className="text-emerald-500" />
              <span>Public Service Commissions</span>
            </h3>
            <div className="space-y-2">
              {portal.agencies.map((agency, idx) => (
                <Link
                  key={idx}
                  href={agency.href}
                  className="p-2 rounded border border-subtle hover:border-emerald-500 transition-colors flex items-center justify-between text-xs group"
                >
                  <div>
                    <span className="font-semibold text-primary block group-hover:text-emerald-500 transition-colors">{agency.name}</span>
                    <span className="text-[10px] text-muted">{agency.note}</span>
                  </div>
                  <ArrowRight size={12} className="text-muted group-hover:text-emerald-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Preparation Guides */}
        {portal.guides && portal.guides.length > 0 && (
          <div className="card p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2.5 flex items-center gap-1.5">
              <BookOpen size={14} className="text-emerald-500" />
              <span>Verified Application Guides</span>
            </h3>
            <div className="space-y-2">
              {portal.guides.map((guide, idx) => (
                <Link
                  key={idx}
                  href={guide.href}
                  className="p-2 rounded border border-subtle hover:border-emerald-500 transition-colors flex items-center justify-between text-xs group"
                >
                  <span className="font-semibold text-primary group-hover:text-emerald-500 transition-colors">{guide.name}</span>
                  <span className="badge badge-subtle text-[10px]">{guide.badge}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Jobs Filter & Feed */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <Building2 size={18} className="text-emerald-500" />
            <span>Active Verified Openings in {portal.shortName}</span>
          </h2>
          <span className="text-xs text-muted">Filtered by {portal.provinceName} Domicile & Region</span>
        </div>

        <HomeClientFilter 
          initialJobs={jobs}
          initialCategory="all"
        />
      </section>

      {/* Targeted FAQs Section with Answer Engine Optimization */}
      {portal.faqs && portal.faqs.length > 0 && (
        <section className="card p-6 md:p-8 bg-surface-subtle border border-subtle mt-8">
          <div className="flex items-center gap-2 mb-4 border-b border-subtle pb-3">
            <HelpCircle size={20} className="text-emerald-500" />
            <h2 className="text-lg font-bold text-primary m-0">
              Frequently Asked Questions about {portal.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portal.faqs.map((faq, idx) => (
              <div key={idx} className="bg-surface p-4 rounded-lg border border-subtle">
                <strong className="text-sm text-primary block mb-1.5 font-bold">
                  {faq.question}
                </strong>
                <p className="text-xs text-secondary leading-relaxed m-0">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
