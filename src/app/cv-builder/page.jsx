import React from 'react';
import CvBuilder from '../../components/CvBuilder';
import { generateBreadcrumbSchema } from '../../utils/seoHelpers';
import { FileText, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata = {
  title: "Free ATS CV & Resume Builder for Pakistan Jobs (Govt & Tech)",
  description: "Build an institutional, ATS-friendly Pakistani resume with BPS scale fields, provincial domicile, HEC education breakdown, and export high-res vector PDF for free.",
  alternates: {
    canonical: "https://rozgar.pk/cv-builder"
  }
};

export default function CvBuilderPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://rozgar.pk" },
    { name: "CV Builder", url: "https://rozgar.pk/cv-builder" }
  ]);

  return (
    <div className="container-xl py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="page-category-hero card p-6 mb-6 no-print">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-govt">
            <FileText size={13} />
            <span>ATS Resume Generator</span>
          </span>
          <span className="badge badge-verified">
            <Sparkles size={13} />
            <span>100% Free & No Sign-Up Required</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">
          Institutional ATS CV Builder for Pakistani Careers
        </h1>
        <p className="text-secondary text-sm max-w-3xl leading-relaxed">
          Craft professional, ATS-optimized CVs customized for Federal/Provincial Government applications (including Domicile, CNIC, and BPS History) and modern Tech/Private industry standards.
        </p>
      </div>

      <CvBuilder />
    </div>
  );
}
