import React from 'react';
import CvBuilder from '../../components/CvBuilder';
import { generateBreadcrumbSchema } from '../../utils/seoHelpers';
import { getSiteUrl } from '../../utils/siteUrl';

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Free ATS CV & Resume Builder for Pakistan Jobs (Govt & Tech)",
  description: "Build an institutional, ATS-friendly Pakistani resume with BPS scale fields, provincial domicile, HEC education breakdown, and export high-res vector PDF for free.",
  alternates: {
    canonical: `${siteUrl}/cv-builder`
  },
  openGraph: {
    title: "Free ATS CV & Resume Builder for Pakistan Jobs",
    description: "Build an institutional, ATS-friendly Pakistani resume.",
    url: `${siteUrl}/cv-builder`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function CvBuilderPage() {
  const currentUrl = getSiteUrl();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${currentUrl}` },
    { name: "CV Builder", url: `${currentUrl}/cv-builder` }
  ]);

  return (
    <div className="container-xl py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CvBuilder />
    </div>
  );
}
