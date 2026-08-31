import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HomeClientFilter from '../../../components/HomeClientFilter';
import { JOBS_DATA, CITIES } from '../../../data/jobsData';
import { CITY_LANDING_CONTENT } from '../../../data/landingPagesData';
import { generateItemListSchema, generateBreadcrumbSchema } from '../../../utils/seoHelpers';
import { MapPin, Building2, Landmark, ShieldCheck } from 'lucide-react';

export async function generateStaticParams() {
  const citySlugs = Object.keys(CITY_LANDING_CONTENT);
  return citySlugs.map((city) => ({
    city,
  }));
}

export async function generateMetadata({ params }) {
  const { city } = params;
  const content = CITY_LANDING_CONTENT[city.toLowerCase()];

  if (!content) {
    return {
      title: `Jobs in ${city.charAt(0).toUpperCase() + city.slice(1)}`,
      description: `Browse verified government and private sector jobs in ${city}.`
    };
  }

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `https://rozgar.pk/city/${city}`
    }
  };
}

export default function CityLandingPage({ params }) {
  const { city } = params;
  const cityKey = city.toLowerCase();
  const content = CITY_LANDING_CONTENT[cityKey] || {
    cityName: city.charAt(0).toUpperCase() + city.slice(1),
    province: "Pakistan",
    h1: `Verified Jobs in ${city.charAt(0).toUpperCase() + city.slice(1)}`,
    tagline: `Find active government and private sector jobs in ${city}.`,
    stats: { govtVacancies: "150+", privateOpenings: "80+", topDepts: "Healthcare, Education, IT" }
  };

  // Filter jobs for this city
  const cityJobs = JOBS_DATA.filter(
    (j) => j.city?.toLowerCase().includes(cityKey) || j.city?.toLowerCase().includes('all pakistan')
  );

  const itemListSchema = generateItemListSchema(cityJobs, `https://rozgar.pk/city/${city}`);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://rozgar.pk" },
    { name: "Cities", url: "https://rozgar.pk" },
    { name: content.cityName, url: `https://rozgar.pk/city/${city}` }
  ]);

  return (
    <div className="container-xl py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Header */}
      <div className="page-category-hero card p-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-govt">
            <MapPin size={13} />
            <span>{content.province} Hub</span>
          </span>
          <span className="badge badge-verified">
            <ShieldCheck size={13} />
            <span>{cityJobs.length} Active Listings</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">
          {content.h1}
        </h1>
        <p className="text-secondary text-sm max-w-3xl leading-relaxed">
          {content.tagline}
        </p>

        {/* Stats Row */}
        {content.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-subtle">
            <div>
              <span className="text-xs text-muted block">Govt Openings</span>
              <strong className="text-base text-primary">{content.stats.govtVacancies}</strong>
            </div>
            <div>
              <span className="text-xs text-muted block">Private Careers</span>
              <strong className="text-base text-primary">{content.stats.privateOpenings}</strong>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-xs text-muted block">Primary Sectors</span>
              <strong className="text-xs text-primary">{content.stats.topDepts}</strong>
            </div>
          </div>
        )}
      </div>

      <HomeClientFilter 
        initialJobs={cityJobs}
        initialCategory="all"
      />
    </div>
  );
}
