import React, { useEffect } from 'react';
import { 
  MapPin, 
  Building2, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { CITY_LANDING_PAGES } from '../data/landingPagesData';
import { generateFAQSchema, updatePageMeta } from '../utils/seoHelpers';
import JobCard from './JobCard';

export default function CityLandingPage({ 
  cityKey, 
  allJobs, 
  onSelectJob, 
  savedJobIds, 
  onToggleSave,
  onShareWhatsApp,
  onShareFacebook,
  onBack 
}) {
  const cityData = CITY_LANDING_PAGES[cityKey] || CITY_LANDING_PAGES['lahore'];

  // Update SEO metadata & inject FAQ schema
  useEffect(() => {
    updatePageMeta({
      title: `${cityData.name} Jobs 2026 — Verified Govt & IT Openings`,
      description: cityData.description
    });

    const faqSchema = generateFAQSchema(cityData.faqs);
    let scriptTag = document.getElementById('city-faq-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'city-faq-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(faqSchema);

    return () => {
      if (scriptTag) scriptTag.remove();
    };
  }, [cityData]);

  // Filter jobs for this city
  const cityJobs = allJobs.filter(j => 
    j.city.toLowerCase().includes(cityData.name.toLowerCase()) || 
    j.province === cityData.province
  );

  return (
    <div className="city-landing-page">
      {/* Header Banner */}
      <div className="city-header-banner">
        <div className="container-xl">
          <div className="city-badge-row">
            <span className="badge badge-govt">
              <MapPin size={13} />
              <span>{cityData.province} Province</span>
            </span>
            <span className="badge badge-verified">
              <ShieldCheck size={13} />
              <span>Verified Openings</span>
            </span>
          </div>

          <h1 className="city-headline">{cityData.headline}</h1>
          <p className="city-desc">{cityData.description}</p>

          <div className="city-stats-tags">
            <div className="city-stat-tag">
              <span>Average Monthly Compensation: <strong>{cityData.avgSalary}</strong></span>
            </div>
            <div className="city-stat-tag">
              <span>Hot Sectors: <strong>{cityData.hotSectors.join(' • ')}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container-xl city-content-body">
        {/* Openings Grid */}
        <div className="city-jobs-section mb-5">
          <h2 className="section-title">
            Active Verified Openings in {cityData.name} ({cityJobs.length})
          </h2>

          <div className="jobs-layout-container grid-view">
            {cityJobs.map((job) => (
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
        </div>

        {/* Localized FAQ Section (AEO & Featured Snippets) */}
        <div className="city-faq-section card">
          <div className="faq-header-row">
            <HelpCircle size={20} className="text-emerald" />
            <h3 className="faq-main-title">Frequently Asked Questions — Jobs in {cityData.name}</h3>
          </div>

          <div className="faq-list">
            {cityData.faqs.map((faq, idx) => (
              <div key={idx} className="faq-item-block">
                <h4 className="faq-q-text">{faq.question}</h4>
                <p className="faq-a-text">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
