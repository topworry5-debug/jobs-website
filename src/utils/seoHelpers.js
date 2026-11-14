/**
 * Tainaati SEO, GEO & Schema.org JSON-LD Helper Engine
 * Generates valid Google Jobs rich-result schemas, BreadcrumbList, and ItemList schemas.
 */

import { getSiteUrl, getAbsoluteUrl } from './siteUrl';

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cleanText(text) {
  if (!text) return '';
  return text.replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function truncateAtWord(str, max) {
  if (!str || str.length <= max) return str;
  const sub = str.slice(0, max);
  const lastSpace = sub.lastIndexOf(' ');
  if (lastSpace > max * 0.6) {
    return sub.slice(0, lastSpace).trim().replace(/[,\-–—/:\s]+$/, '');
  }
  return sub.trim().replace(/[,\-–—/:\s]+$/, '');
}

/**
 * Generates unique page title strictly capped to max ~60 characters.
 * @param {Object} job
 * @returns {string}
 */
export function formatJobPageTitle(job) {
  if (!job) return 'Government Job Opportunities | Tainaati';
  const brand = ' | Tainaati'; // 11 chars
  const maxAvailable = 60 - brand.length; // 49 chars
  const title = cleanText(job.title).replace(/^NTS:\s*/i, '').trim();
  const agency = cleanText(job.agency || 'Govt');

  const prefix = `${title} - ${agency}`;
  if (prefix.length <= maxAvailable) {
    return `${prefix}${brand}`;
  }

  const availableForTitle = maxAvailable - (agency.length + 3);
  if (availableForTitle > 15) {
    const truncTitle = truncateAtWord(title, availableForTitle);
    return `${truncTitle} - ${agency}${brand}`;
  }

  return `${truncateAtWord(title, maxAvailable)}${brand}`;
}

/**
 * Generates unique meta description strictly capped to max ~155 characters.
 * @param {Object} job
 * @returns {string}
 */
export function formatJobPageDescription(job) {
  if (!job) return 'Public sector job notices, syllabus guides and exam schedules in Pakistan with official source links.';
  const title = cleanText(job.title);
  const org = cleanText(job.department || job.company || job.agency || 'Public Sector');
  const bps = job.bpsScale ? ` ${job.bpsScale}.` : '';
  const vac = job.vacancies ? ` ${job.vacancies} posts.` : '';
  const deadline = job.lastDate ? ` Last date: ${job.lastDate}.` : '';

  let desc = `Apply for ${title} at ${org}.${bps}${vac}${deadline} Official notification details.`;
  if (desc.length <= 155) return desc;

  desc = `${title} at ${org}.${bps}${deadline} Official vacancy notice.`;
  if (desc.length <= 155) return desc;

  const base = `${truncateAtWord(title, 70)} at ${truncateAtWord(org, 35)}.${bps}${deadline}`;
  if (base.length <= 155) return base;

  return truncateAtWord(base, 151) + '...';
}

/**
 * Builds full HTML description using only real stored job data for Google JobPosting schema.
 * @param {Object} job
 * @returns {string} HTML description
 */
export function buildJobHtmlDescription(job) {
  const parts = [];
  if (job.description) {
    parts.push(`<p>${escapeHtml(job.description)}</p>`);
  } else {
    const org = escapeHtml(job.department || job.company || job.agency || 'Government of Pakistan');
    parts.push(`<p>Official recruitment notification for <strong>${escapeHtml(job.title)}</strong> at <strong>${org}</strong>.</p>`);
  }

  const details = [];
  if (job.agency) details.push(`<li><strong>Agency / Commission:</strong> ${escapeHtml(job.agency)}</li>`);
  if (job.department || job.company) details.push(`<li><strong>Department:</strong> ${escapeHtml(job.department || job.company)}</li>`);
  if (job.bpsScale) details.push(`<li><strong>Pay Scale:</strong> ${escapeHtml(job.bpsScale)}</li>`);
  if (job.vacancies) details.push(`<li><strong>Total Openings:</strong> ${escapeHtml(String(job.vacancies))} Posts</li>`);
  if (job.qualification) details.push(`<li><strong>Minimum Qualification:</strong> ${escapeHtml(job.qualification)}</li>`);
  if (job.ageLimit) details.push(`<li><strong>Age Limit:</strong> ${escapeHtml(job.ageLimit)}</li>`);
  if (job.quota) details.push(`<li><strong>Quota / Domicile:</strong> ${escapeHtml(job.quota)}</li>`);
  if (job.city) details.push(`<li><strong>City / Location:</strong> ${escapeHtml(job.city)}</li>`);
  if (job.challanFee) details.push(`<li><strong>Application Fee:</strong> ${escapeHtml(job.challanFee)}</li>`);
  if (job.lastDate) details.push(`<li><strong>Application Deadline:</strong> ${escapeHtml(job.lastDate)}</li>`);

  if (details.length > 0) {
    parts.push(`<p><strong>Job Specifications:</strong></p><ul>${details.join('')}</ul>`);
  }

  if (Array.isArray(job.eligibilityCriteria) && job.eligibilityCriteria.length > 0) {
    parts.push(`<p><strong>Eligibility Criteria:</strong></p><ul>${job.eligibilityCriteria.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>`);
  }

  if (job.officialUrl) {
    parts.push(`<p>Apply online through the official portal: <a href="${escapeHtml(job.officialUrl)}">${escapeHtml(job.officialUrl)}</a></p>`);
  }

  return parts.join('');
}

export function generateJobPostingSchema(job) {
  if (!job) return null;

  const baseUrl = getSiteUrl();
  const isGovt = job.type === 'govt';
  const orgName = job.department || job.company || job.agency || 'Government of Pakistan';
  const jobSlug = job.slug || job.id;
  const jobUrl = `${baseUrl}/jobs/${jobSlug}`;

  // validThrough ISO timestamp (in future for open jobs, in past for closed jobs)
  let validThrough = null;
  if (job.lastDate && /^\d{4}-\d{2}-\d{2}/.test(job.lastDate)) {
    const dateMatch = job.lastDate.match(/^\d{4}-\d{2}-\d{2}/)[0];
    validThrough = `${dateMatch}T23:59:59+05:00`;
  }

  // datePosted ISO timestamp
  let datePosted = null;
  if (job.postDate && /^\d{4}-\d{2}-\d{2}/.test(job.postDate)) {
    const postMatch = job.postDate.match(/^\d{4}-\d{2}-\d{2}/)[0];
    datePosted = `${postMatch}T00:00:00+05:00`;
  } else if (job.scrapedAt) {
    try {
      datePosted = new Date(job.scrapedAt).toISOString();
    } catch {
      datePosted = '2026-08-15T00:00:00+05:00';
    }
  } else {
    datePosted = '2026-08-15T00:00:00+05:00';
  }

  // Only include baseSalary when a real numeric salary is explicitly stored
  let baseSalaryObj = null;
  if (typeof job.baseSalary === 'number' && job.baseSalary > 0) {
    baseSalaryObj = {
      "@type": "MonetaryAmount",
      "currency": "PKR",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.baseSalary,
        "unitText": "MONTH"
      }
    };
  }

  const locality = job.city ? job.city.split(',')[0].split('/')[0].trim() : 'Islamabad';

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": buildJobHtmlDescription(job),
    "identifier": {
      "@type": "PropertyValue",
      "name": isGovt ? (job.agency || "Public Service Commission") : (job.company || "Employer"),
      "value": job.caseNo || job.advtNo || job.id
    },
    "datePosted": datePosted,
    ...(validThrough ? { "validThrough": validThrough } : {}),
    "employmentType": job.employmentType || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": orgName,
      ...(job.officialUrl || job.sourceUrl ? { "sameAs": job.officialUrl || job.sourceUrl } : {}),
      "logo": `${baseUrl}/icon.png`
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "PK",
        "addressLocality": locality,
        ...(job.province ? { "addressRegion": job.province } : {})
      }
    },
    "directApply": Boolean(job.officialUrl),
    "url": jobUrl,
    ...(baseSalaryObj ? { "baseSalary": baseSalaryObj } : {}),
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "Pakistan"
    },
    ...(job.qualification ? {
      "educationRequirements": {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": job.qualification
      }
    } : {}),
    ...(job.ageLimit ? {
      "experienceRequirements": job.ageLimit
    } : {})
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
    "logo": `${siteUrl}/icon.png`,
    "description": "Public sector job notices, syllabus guides and exam schedules in Pakistan with official source links.",
    "foundingLocation": {
      "@type": "Country",
      "name": "Pakistan"
    },
    "areaServed": "PK"
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
      "url": `${baseUrl}/jobs/${job.slug || job.id}`,
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
