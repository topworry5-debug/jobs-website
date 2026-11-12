import React from 'react';
import ExamCalendar from '../../components/ExamCalendar';
import { EXAM_SCHEDULES } from '../../data/examCalendarData';
import { generateBreadcrumbSchema } from '../../utils/seoHelpers';
import { getSiteUrl } from '../../utils/siteUrl';

const siteUrl = getSiteUrl();
const hasUpcomingExams = EXAM_SCHEDULES.length > 0;

export const metadata = {
  title: "Competitive Exam Calendar 2026 (FPSC, PPSC, SPSC, KPPSC Schedules)",
  description: "Official examination schedules, admission certificates, screening test dates, and descriptive test timelines across Pakistani Public Service Commissions.",
  robots: hasUpcomingExams ? { index: true, follow: true } : { index: false, follow: true },
  alternates: {
    canonical: `${siteUrl}/exams`
  },
  openGraph: {
    title: "Competitive Exam Calendar 2026 (FPSC, PPSC, SPSC, KPPSC Schedules)",
    description: "Official examination schedules, screening test dates, and timelines.",
    url: `${siteUrl}/exams`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function ExamCalendarPage() {
  const currentUrl = getSiteUrl();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${currentUrl}` },
    { name: "Exam Calendar", url: `${currentUrl}/exams` }
  ]);

  return (
    <div className="container-xl py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ExamCalendar />
    </div>
  );
}
