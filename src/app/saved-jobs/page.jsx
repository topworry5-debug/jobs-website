import React from 'react';
import SavedJobsTracker from '../../components/SavedJobsTracker';
import { generateBreadcrumbSchema } from '../../utils/seoHelpers';
import { getSiteUrl } from '../../utils/siteUrl';

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Saved Jobs & Application Tracker — Tainaati",
  description: "Track your bookmarked jobs, manage application stages (Applied, Interview Scheduled, Result Awaited), and store personal challan/tracking tokens securely.",
  alternates: {
    canonical: `${siteUrl}/saved-jobs`
  },
  openGraph: {
    title: "Saved Jobs & Application Tracker — Tainaati",
    description: "Personal career tracker for Pakistani public and private sector vacancies.",
    url: `${siteUrl}/saved-jobs`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function SavedJobsPage() {
  const currentUrl = getSiteUrl();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${currentUrl}` },
    { name: "Personal Hub", url: `${currentUrl}` },
    { name: "Saved Jobs & Tracker", url: `${currentUrl}/saved-jobs` }
  ]);

  return (
    <div className="py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SavedJobsTracker />
    </div>
  );
}
