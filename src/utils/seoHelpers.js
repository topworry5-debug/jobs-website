/**
 * Tainaati SEO, GEO & Schema.org JSON-LD Helper Engine
 * Generates valid Google Jobs rich-result schemas, BreadcrumbList, and ItemList schemas.
 */

import { getSiteUrl, getAbsoluteUrl } from './siteUrl';

function getEstimatedSalary(job) {
  if (job.salaryRange) {
    const numbers = job.salaryRange.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      const val = parseInt(numbers[0]);
      return val < 1000 ? val * 1000 : val;
    }
  }
  const scaleStr = (job.bpsScale || '').toUpperCase();
  if (scaleStr.includes('20')) return 250000;
  if (scaleStr.includes('19')) return 175000;
  if (scaleStr.includes('18')) return 125000;
  if (scaleStr.includes('17')) return 85000;
  if (scaleStr.includes('16')) return 70000;
  if (scaleStr.includes('15') || scaleStr.includes('14')) return 55000;
  if (scaleStr.includes('11') || scaleStr.includes('12') || scaleStr.includes('09') || scaleStr.includes('07') || scaleStr.includes('05')) return 45000;
  return 65000;
}

export function generateJobPostingSchema(job) {
  if (!job) return null;
  // Exclude archived and expired jobs from JobPosting rich results
  if (job.status === 'archived' || job.status === 'closed' || job.status === 'expired') return null;
  if (job.lastDate && /^\d{4}-\d{2}-\d{2}$/.test(job.lastDate)) {
    const todayStr = new Date().toISOString().split('T')[0];
    if (job.lastDate < todayStr) return null;
  }

  const baseUrl = getSiteUrl();
  const isGovt = job.type === 'govt';
  const orgName = job.department || job.company || 'Government of Pakistan';
  const hasIsoDate = job.lastDate && /^\d{4}-\d{2}-\d{2}$/.test(job.lastDate);
  const validThrough = hasIsoDate ? `${job.lastDate}T23:59:59+05:00` : null;
  const datePosted = `${job.postDate || '2026-08-15'}T00:00:00+05:00`;
  const jobUrl = `${baseUrl}/jobs/${job.id}`;
  const salaryVal = getEstimatedSalary(job);

  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": `${job.description} Qualification Required: ${job.qualification}. Last date to apply: ${job.lastDate}.`,
    "identifier": {
      "@type": "PropertyValue",
      "name": isGovt ? (job.agency || "Public Service Commission") : (job.company || "Employer"),
      "value": job.officialSourceLabel || job.id
    },
    "datePosted": datePosted,
    ...(validThrough ? { "validThrough": validThrough } : {}),
    "employmentType": job.employmentType || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": orgName,
      "sameAs": job.officialUrl || baseUrl,
      "logo": `${baseUrl}/icons/logo.png`
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": job.department || "Government Secretariat",
        "addressLocality": job.city ? job.city.split(',')[0].trim() : "Islamabad",
        "addressRegion": job.province || "Federal",
        "addressCountry": "PK"
      }
    },
    "directApply": true,
    "url": jobUrl,
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "PKR",
      "value": {
        "@type": "QuantitativeValue",
        "value": salaryVal,
        "unitText": "MONTH"
      }
    },
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "Pakistan"
    },
    "educationRequirements": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": job.qualification || "Bachelor's Degree"
    },
    "experienceRequirements": isGovt ? (job.ageLimit || "As per official service rules") : (job.experience || "Entry to Senior level")
  };
}

export function generateOrganizationSchema() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tainaati",
    "alternateName": "Tainaati Pakistan Jobs Portal",
    "url": siteUrl,
    "logo": `${siteUrl}/icons/logo.png`,
    "description": "Pakistan's 100% verified zero-fabrication public sector recruitment and career opportunities platform (FPSC, PPSC, SPSC, KPPSC, BPSC, NTS).",
    "foundingLocation": {
      "@type": "Country",
      "name": "Pakistan"
    },
    "areaServed": "PK",
    "sameAs": [
      "https://twitter.com/tainaati",
      "https://facebook.com/tainaati"
    ]
  };
}

export function generateWebSiteSchema() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Tainaati",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function generateHowToSchema(howTo) {
  if (!howTo || !howTo.steps || howTo.steps.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howTo.name,
    "description": howTo.description,
    "step": howTo.steps.map((step, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": step.name,
      "text": step.text,
      ...(step.url ? { "url": step.url } : {})
    }))
  };
}

export function generateFAQSchema(faqs) {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };
}

export function generateBreadcrumbSchema(items) {
  if (!items || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : getAbsoluteUrl(item.url)
    }))
  };
}

export function generateItemListSchema(jobs = [], pageUrl = null) {
  if (!jobs || jobs.length === 0) return null;

  const baseUrl = getSiteUrl();
  const targetPageUrl = pageUrl || baseUrl;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "url": targetPageUrl,
    "numberOfItems": jobs.length,
    "itemListElement": jobs.slice(0, 30).map((job, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${baseUrl}/jobs/${job.id}`,
      "name": job.title,
      "description": `${job.department || job.company} - ${job.city}`
    }))
  };
}

export function updatePageMeta({ title, description, canonicalUrl }) {
  if (title) {
    document.title = `${title} — Tainaati`;
  }
  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;
  }
}
