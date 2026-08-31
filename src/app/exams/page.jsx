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

      <div className="page-category-hero card p-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-govt">
            <Calendar size={13} />
            <span>Official Examination Timetable</span>
          </span>
          <span className="badge badge-verified">
            <ShieldCheck size={13} />
            <span>FPSC & PPSC Synchronized</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">
          Competitive Exam Calendar & Test Schedules 2026
        </h1>
        <p className="text-secondary text-sm max-w-3xl leading-relaxed">
          Track upcoming screening tests, descriptive examination phases, physical endurance assessments, and roll number slip releases across Federal and Provincial Public Service Commissions.
        </p>

        <h2 className="text-sm font-bold text-primary mt-4 pt-4 border-t border-subtle">
          Upcoming Screening Tests & Descriptive Phases (FPSC, PPSC, SPSC, KPPSC)
        </h2>
      </div>

      <ExamCalendar />
    </div>
  );
}
