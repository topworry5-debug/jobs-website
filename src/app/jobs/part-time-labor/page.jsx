import React from 'react';
import { notFound } from 'next/navigation';
import { JOBS_DATA } from '../../../data/jobsData';
import { getCategoryBySlug, matchesJobCategory } from '../../../data/categoriesData';
import CategoryLandingPage from '../../../components/CategoryLandingPage';
import { generateItemListSchema, generateBreadcrumbSchema, generateFAQSchema } from '../../../utils/seoHelpers';
import { getSiteUrl } from '../../../utils/siteUrl';

const CATEGORY_SLUG = 'part-time-labor';
const category = getCategoryBySlug(CATEGORY_SLUG);
const siteUrl = getSiteUrl();

export const metadata = {
  title: category ? category.metaTitle : "Jobs in Pakistan",
  description: category ? category.metaDescription : "Browse verified jobs in Pakistan.",
  alternates: {
    canonical: `${siteUrl}/jobs/${CATEGORY_SLUG}`
  },
  openGraph: {
    title: category ? category.metaTitle : "Jobs in Pakistan",
    description: category ? category.metaDescription : "Browse verified jobs in Pakistan.",
    url: `${siteUrl}/jobs/${CATEGORY_SLUG}`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function CategoryPage() {
  const cat = getCategoryBySlug(CATEGORY_SLUG);
  if (!cat) notFound();

  const currentUrl = getSiteUrl();
  const categoryJobs = JOBS_DATA.filter((j) => matchesJobCategory(j, cat.id));

  const itemListSchema = generateItemListSchema(categoryJobs, `${currentUrl}/jobs/${cat.slug}`);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${currentUrl}` },
    { name: cat.groupLabel, url: `${currentUrl}/jobs/${cat.group === 'govt' ? 'govt' : 'private'}` },
    { name: cat.name, url: `${currentUrl}/jobs/${cat.slug}` }
  ]);
  const faqSchema = cat.faqs ? generateFAQSchema(cat.faqs) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <CategoryLandingPage category={cat} jobs={categoryJobs} />
    </>
  );
}
