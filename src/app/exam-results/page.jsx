import React from 'react';
import ExamResultsHub from '../../components/ExamResultsHub';
import { generateBreadcrumbSchema } from '../../utils/seoHelpers';
import { getSiteUrl } from '../../utils/siteUrl';

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Exam Results & Roll Number Slips 2026 — FPSC, PPSC, SPSC, KPPSC & NTS Portals",
  description: "Download official roll number slips, admission certificates, and check written examination results for FPSC (CSS), PPSC, SPSC, KPPSC, and NTS testing services.",
  alternates: {
    canonical: `${siteUrl}/exam-results`
  },
  openGraph: {
    title: "Exam Results & Roll Number Slips 2026 — FPSC, PPSC, SPSC, KPPSC & NTS",
    description: "Direct official verification portal for Pakistani competitive examinations and testing services.",
    url: `${siteUrl}/exam-results`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function ExamResultsPage() {
  const currentUrl = getSiteUrl();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${currentUrl}` },
    { name: "Competitive Exams", url: `${currentUrl}/exams` },
    { name: "Results & Roll No Slips", url: `${currentUrl}/exam-results` }
  ]);

  return (
    <div className="py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ExamResultsHub />
    </div>
  );
}
