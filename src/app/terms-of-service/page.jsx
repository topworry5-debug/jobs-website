import React from 'react';
import Link from 'next/link';
import { Scale, AlertTriangle, ShieldCheck, FileCheck, CheckCircle2, Globe, ArrowLeft, Mail } from 'lucide-react';
import { getSiteUrl } from '../../utils/siteUrl';

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Terms of Service — Tainaati",
  description: "Terms of Service for Tainaati. Outlines service nature, official government disclaimers, candidate verification obligations, and legal parameters.",
  alternates: {
    canonical: `${siteUrl}/terms-of-service`
  },
  openGraph: {
    title: "Terms of Service — Tainaati",
    description: "Terms of Service for Tainaati.",
    url: `${siteUrl}/terms-of-service`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function TermsOfServicePage() {
  return (
    <div className="container-xl py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header Hero */}
        <div className="card p-6 md:p-8 legal-hero-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-verified">
              <Scale size={14} />
              <span>User Agreement</span>
            </span>
            <span className="text-xs text-muted">Effective: September 1, 2026</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-3">
            Terms of Service
          </h1>
          <p className="text-secondary text-sm md:text-base leading-relaxed">
            Please read these Terms of Service carefully before accessing or using Tainaati (<Link href="/" className="text-emerald-500 font-semibold underline">https://www.tainaati.com</Link>). 
            By browsing the site, subscribing to job alerts, or utilizing our ATS CV Builder and Examination tools, you agree to be bound by these terms.
          </p>
        </div>

        {/* Content Body */}
        <div className="card p-6 md:p-8 space-y-6 text-secondary leading-relaxed">
          {/* Section 1 */}
          <section className="legal-section-block">
            <h2 className="legal-heading-flex">
              <Globe size={20} className="text-emerald-500 flex-shrink-0" />
              <span>1. Nature of the Service (Information Aggregator & Intelligence Index)</span>
            </h2>
            <p>
              Tainaati is an independent, specialized digital career aggregator and exam intelligence platform. 
              <strong>Tainaati is not an employer, hiring agency, or staffing firm.</strong> We do not conduct recruitment, collect job application fees on behalf of employers, schedule interviews, or influence hiring decisions.
            </p>
            <p>
              Our platform monitors, indexes, and organizes publicly accessible job advertisements, official gazette notices, and syllabus outlines released by Pakistani government commissions and verified private tech employers to provide a structured, accessible search experience.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 border-b border-subtle pb-2">
              <AlertTriangle size={18} className="text-amber-500" />
              2. Government & Third-Party Disclaimers (Non-Affiliation)
            </h2>
            <div className="bg-surface-subtle p-4 rounded-lg border-l-4 border-l-amber-500 text-sm">
              <p className="font-bold text-primary mb-1">Important Non-Affiliation Disclosure:</p>
              <p>
                Tainaati is an independent informational portal and is <strong>NOT affiliated, associated, authorized, endorsed by, or in any way officially connected</strong> with the Federal Public Service Commission (FPSC), Punjab Public Service Commission (PPSC), Sindh Public Service Commission (SPSC), Khyber Pakhtunkhwa Public Service Commission (KPPSC), Balochistan Public Service Commission (BPSC), National Testing Service (NTS), or any department or agency of the Government of Pakistan.
              </p>
            </div>
            <p>
              Official commission names, emblems, and gazette identifiers are referenced solely for descriptive and informational identification purposes under fair use.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 border-b border-subtle pb-2">
              <FileCheck size={18} className="text-emerald-500" />
              3. Candidate Responsibility & Verification Obligation
            </h2>
            <p>
              While Tainaati maintains an automated verification pipeline that cross-checks postings against published gazettes every 6 hours:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong>Official Source Verification:</strong> Candidates are strictly advised to review the official advertisement notice, eligibility criteria, challan fee instructions, and submission deadlines on the hiring authority&apos;s official website (e.g. <code className="text-xs bg-surface-subtle px-1.5 py-0.5 rounded font-mono">online.fpsc.gov.pk</code> or <code className="text-xs bg-surface-subtle px-1.5 py-0.5 rounded font-mono">ppsc.gop.pk</code>) before submitting applications or depositing fees.
              </li>
              <li>
                <strong>Fee Deposit Safety:</strong> Government recruitment examination fees in Pakistan must ONLY be deposited into authorized National Bank of Pakistan (NBP) branches, State Bank of Pakistan (SBP) treasury accounts, or through designated government PSID 1Link channels. Tainaati will never ask you to transfer funds directly to any private bank account or mobile wallet.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 border-b border-subtle pb-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              4. Intellectual Property & Fair Use
            </h2>
            <p>
              All proprietary layout designs, user interface code, automated indexing algorithms, CSS styling, custom vector assets, and editorial compilations on Tainaati are the intellectual property of Tainaati and are protected by applicable copyright and intellectual property laws.
            </p>
            <p>
              The original text of government gazette notifications, public recruitment circulars, and official test syllabus descriptions remain the public property of their respective government issuing authorities and are credited and linked accordingly.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 border-b border-subtle pb-2">
              <Scale size={18} className="text-emerald-500" />
              5. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, Tainaati and its developers shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Rejection or disqualification of job applications by hiring agencies.</li>
              <li>Downtime, network errors, or submission failures on external government portals.</li>
              <li>Unannounced revisions in government quota allocations, closing dates, or examination venues made by commissions after publication.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 border-b border-subtle pb-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              6. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Islamic Republic of Pakistan. Any legal dispute or claim arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in Islamabad or Lahore, Pakistan.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 border-b border-subtle pb-2">
              <Mail size={18} className="text-emerald-500" />
              7. Legal & Correction Inquiries
            </h2>
            <p>
              If you have questions regarding these Terms, or if you represent a government department or hiring entity wishing to update or correct a listing, please contact our legal desk:
            </p>
            <div className="bg-surface-subtle p-4 rounded-lg border border-subtle text-sm">
              <p className="font-bold text-primary">Tainaati Legal & Editorial Compliance</p>
              <p>Email: <a href="mailto:legal@tainaati.com" className="text-emerald-500 font-medium underline">legal@tainaati.com</a></p>
              <p>Corrections: <a href="mailto:corrections@tainaati.com" className="text-emerald-500 font-medium underline">corrections@tainaati.com</a></p>
              <p className="text-xs text-muted mt-2">Islamabad, Islamic Republic of Pakistan</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
