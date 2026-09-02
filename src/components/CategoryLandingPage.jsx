'use client';

import React from 'react';
import Link from 'next/link';
import HomeClientFilter from './HomeClientFilter';
import { 
  ShieldCheck, 
  MapPin, 
  Building2, 
  Landmark, 
  ChevronRight, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  Shield,
  ShieldAlert,
  Scale,
  Factory,
  GraduationCap,
  Stethoscope,
  Wrench,
  HeartHandshake,
  Plane,
  Laptop,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { getSiteUrl } from '../utils/siteUrl';

const ICON_MAP = {
  Shield: Shield,
  ShieldAlert: ShieldAlert,
  Scale: Scale,
  Factory: Factory,
  GraduationCap: GraduationCap,
  Stethoscope: Stethoscope,
  MapPin: MapPin,
  Landmark: Landmark,
  Wrench: Wrench,
  HeartHandshake: HeartHandshake,
  Sparkles: Sparkles,
  Plane: Plane,
  Laptop: Laptop,
  FileCheck: FileCheck,
  Building2: Building2
};

export default function CategoryLandingPage({ category, jobs = [] }) {
  const siteUrl = getSiteUrl();
  const IconComponent = ICON_MAP[category.icon] || Landmark;
  const isComingSoon = jobs.length === 0;

  const groupBadgeClass = 
    category.group === 'govt' ? 'badge-govt' : 
    category.group === 'private' ? 'badge-private' : 'badge-bps';

  return (
    <div className="category-landing-page container-xl py-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="breadcrumb-nav mb-4">
        <ol className="breadcrumb-list">
          <li><Link href="/">Home</Link></li>
          <li className="separator">/</li>
          <li><Link href={`/jobs/${category.group === 'govt' ? 'govt' : 'private'}`}>
            {category.groupLabel || "Jobs"}
          </Link></li>
          <li className="separator">/</li>
          <li className="current" aria-current="page">{category.name}</li>
        </ol>
      </nav>

      {/* Hero Category Header */}
      <div className="page-category-hero card p-6 mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`badge ${groupBadgeClass}`}>
            <IconComponent size={14} />
            <span>{category.groupLabel}</span>
          </span>
          {isComingSoon ? (
            <span className="badge badge-coming-soon bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold">
              <Sparkles size={13} />
              <span>Coming Soon — Verification in Progress</span>
            </span>
          ) : (
            <span className="badge badge-verified">
              <ShieldCheck size={13} />
              <span>{jobs.length} Verified {jobs.length === 1 ? 'Listing' : 'Listings'}</span>
            </span>
          )}
        </div>

        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <IconComponent size={26} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">
              {category.h1}
            </h1>
            <p className="text-secondary text-sm max-w-3xl leading-relaxed mb-4">
              {category.tagline}
            </p>

            {/* Subcategories Chips */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="subcategory-chips-wrap">
                <span className="text-xs font-semibold text-muted block mb-1.5 uppercase tracking-wider">
                  Key Sub-Cadres & Tracks:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {category.subcategories.map((sub, idx) => (
                    <span 
                      key={idx} 
                      className="subcat-chip text-xs px-2.5 py-1 rounded-md bg-surface-subtle border border-subtle text-secondary"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Jobs Section */}
      {!isComingSoon ? (
        <section className="mb-10">
          <HomeClientFilter 
            initialJobs={jobs}
            initialCategory={category.slug}
          />
        </section>
      ) : (
        <div className="card p-8 text-center bg-surface-subtle border border-subtle rounded-xl max-w-2xl mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Sparkles size={28} />
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">
            Verified {category.name} Postings In Vetting
          </h2>
          <p className="text-sm text-secondary leading-relaxed mb-6">
            RozgarPK enforces a strict <strong>Zero Fake Jobs / 100% Verified Gazette</strong> standard. We do not publish unverified or outdated vacancies. Postings for {category.name} will go live once authentic circulars are validated against official recruiting portals.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/jobs/govt" className="btn btn-primary btn-sm flex items-center gap-1.5">
              <Landmark size={14} />
              <span>Explore Verified Govt Jobs</span>
            </Link>
            <Link href="/jobs/banking-finance" className="btn btn-outline btn-sm flex items-center gap-1.5">
              <span>Explore Banking & Finance</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Frequently Asked Questions Section (SEO & Google AEO Rich Snippets) */}
      {category.faqs && category.faqs.length > 0 && (
        <section className="faq-section card p-6 mt-8">
          <div className="flex items-center gap-2.5 mb-5 border-b border-subtle pb-3">
            <HelpCircle size={20} className="text-emerald-500" />
            <h2 className="text-lg font-bold text-primary">
              Frequently Asked Questions — {category.name}
            </h2>
          </div>

          <div className="space-y-4">
            {category.faqs.map((faq, idx) => (
              <div key={idx} className="faq-item p-3.5 rounded-lg bg-surface-subtle border border-subtle">
                <h3 className="text-sm font-semibold text-primary mb-1">
                  {faq.question}
                </h3>
                <p className="text-xs text-secondary leading-relaxed">
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
