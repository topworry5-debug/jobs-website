import React from 'react';
import Link from 'next/link';
import ExamCalendar from '../../components/ExamCalendar';
import { EXAM_SCHEDULES } from '../../data/examCalendarData';
import { generateBreadcrumbSchema } from '../../utils/seoHelpers';
import { Calendar, ShieldCheck, Award, FileText } from 'lucide-react';

export const metadata = {
  title: "Competitive Exam Calendar 2026 (FPSC, PPSC, SPSC, KPPSC Schedules)",
  description: "Official examination schedules, admission certificates, screening test dates, and descriptive test timelines across Pakistani Public Service Commissions.",
  alternates: {
    canonical: "https://rozgar.pk/exams"
  }
};

export default function ExamCalendarPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://rozgar.pk" },
    { name: "Exam Calendar", url: "https://rozgar.pk/exams" }
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
