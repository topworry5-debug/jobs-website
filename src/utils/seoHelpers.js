/**
 * RozgarPK SEO, GEO & Schema.org JSON-LD Helper Engine
 */

export function generateJobPostingSchema(job) {
  if (!job) return null;

  const isGovt = job.type === 'govt';
  const orgName = job.department || job.company || 'Government of Pakistan';
  const validThrough = `${job.lastDate}T23:59:59+05:00`;
  const datePosted = `${job.postDate}T00:00:00+05:00`;

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
    "validThrough": validThrough,
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": orgName,
      "sameAs": job.officialUrl
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.city,
        "addressRegion": job.province,
        "addressCountry": "PK"
      }
    },
    ...(job.salaryRange && {
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "PKR",
        "value": {
          "@type": "QuantitativeValue",
          "value": job.salaryRange.match(/\d+/g) ? parseInt(job.salaryRange.match(/\d+/g)[0]) * 1000 : 80000,
          "unitText": "MONTH"
        }
      }
    }),
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "Pakistan"
    },
    "educationRequirements": job.qualification,
    "experienceRequirements": isGovt ? (job.ageLimit || "As per official rules") : (job.experience || "Entry to Senior level")
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
      "item": item.url
    }))
  };
}

export function generateItemListSchema(jobs = [], pageUrl = "https://rozgar.pk") {
  if (!jobs || jobs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "url": pageUrl,
    "numberOfItems": jobs.length,
    "itemListElement": jobs.slice(0, 30).map((job, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://rozgar.pk/jobs/${job.id}`,
      "name": job.title,
      "description": `${job.department || job.company} - ${job.city}`
    }))
  };
}

export function updatePageMeta({ title, description, canonicalUrl }) {
  if (title) {
    document.title = `${title} — RozgarPK`;
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
