import React from 'react';
import Link from 'next/link';
import TestPrepHub from '../../components/TestPrep/TestPrepHub';
import { generateBreadcrumbSchema } from '../../utils/seoHelpers';
import { BookOpen, ShieldCheck, Award } from 'lucide-react';

export const metadata = {
  title: "FPSC, PPSC & NTS Test Preparation (MCQs & Past Papers 2026)",
  description: "Free competitive exam preparation module for FPSC, PPSC, SPSC, and NTS. Practice English, Everyday Science, Pakistan Affairs, and Subject Specialization MCQs.",
  alternates: {
    canonical: "https://rozgar.pk/test-prep"
  }
};

export default function TestPrepPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://rozgar.pk" },
    { name: "Test Prep", url: "https://rozgar.pk/test-prep" }
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
            <BookOpen size={13} />
            <span>Interactive Exam Preparation</span>
          </span>
          <span className="badge badge-verified">
            <ShieldCheck size={13} />
            <span>Past Papers & Syllabus Aligned</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">
          Competitive Exam Test Preparation & MCQ Practice
        </h1>
        <p className="text-secondary text-sm max-w-3xl leading-relaxed">
          Master the official syllabus for FPSC General Recruitment, PPSC Lecturer & Assistant posts, CSS MPT Screening, and NTS recruitment tests with instant scoring and detailed answer explanations.
        </p>

        <h2 className="text-sm font-bold text-primary mt-4 pt-4 border-t border-subtle">
          Official Past Paper Categories & Timed Mock Test Modules
        </h2>
      </div>

      <TestPrepHub />
    </div>
  );
}
