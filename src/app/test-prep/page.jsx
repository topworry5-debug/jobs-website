import React from 'react';
import TestPrepHub from '../../components/TestPrep/TestPrepHub';
import { generateBreadcrumbSchema } from '../../utils/seoHelpers';
import { getSiteUrl } from '../../utils/siteUrl';

const siteUrl = getSiteUrl();

export const metadata = {
  title: "FPSC, PPSC & NTS Test Preparation (MCQs & Past Papers 2026)",
  description: "Free competitive exam preparation module for FPSC, PPSC, SPSC, and NTS. Practice English, Everyday Science, Pakistan Affairs, and Subject Specialization MCQs.",
  alternates: {
    canonical: `${siteUrl}/test-prep`
  },
  openGraph: {
    title: "FPSC, PPSC & NTS Test Preparation (MCQs & Past Papers 2026)",
    description: "Free competitive exam preparation module for FPSC, PPSC, SPSC, and NTS.",
    url: `${siteUrl}/test-prep`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function TestPrepPage() {
  const currentUrl = getSiteUrl();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${currentUrl}` },
    { name: "Test Prep", url: `${currentUrl}/test-prep` }
  ]);

  return (
    <div className="container-xl py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <TestPrepHub />
    </div>
  );
}
