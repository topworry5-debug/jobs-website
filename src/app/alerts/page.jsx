import React from 'react';
import AlertsManager from '../../components/AlertsManager';
import { generateBreadcrumbSchema } from '../../utils/seoHelpers';
import { getSiteUrl } from '../../utils/siteUrl';

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Verified Email Job Alerts in Pakistan (FPSC, PPSC & Tech)",
  description: "Subscribe to verified Pakistani job alerts via email. Double opt-in confirmation, zero spam, instant match or daily digest with one-click unsubscribe.",
  alternates: {
    canonical: `${siteUrl}/alerts`
  },
  openGraph: {
    title: "Verified Email Job Alerts in Pakistan",
    description: "Subscribe to verified Pakistani job alerts via email.",
    url: `${siteUrl}/alerts`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function AlertsPage() {
  const currentUrl = getSiteUrl();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${currentUrl}` },
    { name: "Email Alerts", url: `${currentUrl}/alerts` }
  ]);

  return (
    <div className="py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AlertsManager />
    </div>
  );
}
