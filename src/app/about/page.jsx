import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Target, Zap, Clock, Users, FileText, CheckCircle2, Award, Landmark, Building2, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: "About RozgarPK — Pakistan's Verified Career Intelligence Authority",
  description: "Learn why RozgarPK was built: to eliminate fake job ads, spam popups, and outdated listings with an automated 6-hour verified government gazette pipeline.",
  alternates: {
    canonical: "https://rozgar.pk/about"
  }
};

export default function AboutPage() {
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
        <div className="card p-6 md:p-8 mb-8 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-verified">
              <ShieldCheck size={14} />
              <span>Our Story & Mission</span>
            </span>
            <span className="text-xs text-muted">Building for Pakistani Candidates</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-3">
            About RozgarPK
          </h1>
          <p className="text-secondary text-sm md:text-base leading-relaxed">
            RozgarPK is an independent, non-partisan digital intelligence portal engineered to bring clarity, speed, and 100% verified accuracy to Pakistan&apos;s employment and competitive examination landscape.
          </p>
        </div>

        {/* Story Grid */}
        <div className="card p-6 md:p-8 space-y-8 text-secondary text-sm md:text-base leading-relaxed">
          {/* Section 1: The Problem */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 border-b border-subtle pb-2">
              <Target size={18} className="text-rose-500" />
              The Problem with Job Portals in Pakistan
            </h2>
            <p>
              For millions of educated Pakistani graduates, doctors, engineers, and competitive exam aspirants, searching for authentic career opportunities is an exhausting, frustrating experience. Most existing Pakistani job boards suffer from three severe problems:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-surface-subtle p-4 rounded-lg border border-subtle">
                <div className="font-bold text-sm text-primary mb-1">1. Cluttered Ads & Spam Popups</div>
                <p className="text-xs text-secondary">Pages cluttered with intrusive banner ads, fake &quot;Download&quot; buttons, and malware redirects that obscure the actual job notice.</p>
              </div>
              <div className="bg-surface-subtle p-4 rounded-lg border border-subtle">
                <div className="font-bold text-sm text-primary mb-1">2. Expired & Stale Listings</div>
                <p className="text-xs text-secondary">Job notices that expired months or years ago left live to generate ad impressions, misleading candidates into wasting time.</p>
              </div>
              <div className="bg-surface-subtle p-4 rounded-lg border border-subtle">
                <div className="font-bold text-sm text-primary mb-1">3. Fabricated & Guesswork Data</div>
                <p className="text-xs text-secondary">Portals guessing fake vacancy counts, incomplete syllabus breakdowns, or omitting official challan fee submission rules.</p>
              </div>
            </div>
          </section>

          {/* Section 2: What We Do Differently */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 border-b border-subtle pb-2">
              <Zap size={18} className="text-emerald-500" />
              What Makes RozgarPK Different
            </h2>
            <p>
              RozgarPK was built as an honest, modern alternative. We treat job search as a mission-critical utility for candidates:
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-primary">Automated 6-Hour Gazette Monitoring</h3>
                  <p className="text-xs text-secondary mt-0.5">Our custom ingestion pipeline queries official commission endpoints (FPSC, PPSC, SPSC, KPPSC, NTS) every 6 hours, detecting newly gazetted notices instantly and automatically archiving expired listings.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-primary">Zero-Tolerance Anti-Fabrication Policy</h3>
                  <p className="text-xs text-secondary mt-0.5">Every listing on RozgarPK links directly to the underlying official commission notice or verified employer career page. If a sub-quota or fee detail cannot be verified with 100% certainty, we state it transparently rather than guessing.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-primary">100% Free Public Utilities</h3>
                  <p className="text-xs text-secondary mt-0.5">Beyond listings, we provide candidate tools including a privacy-first ATS CV Builder (processed 100% in your browser), a Competitive Exam Calendar (tracking CSS, PMS, and Screening dates), and an interactive MCQs test prep engine.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Official Coverage */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 border-b border-subtle pb-2">
              <Landmark size={18} className="text-emerald-500" />
              Public Service Commissions Tracked
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
              <div className="bg-surface-subtle p-3 rounded-lg border border-subtle text-center">
                <div className="font-bold text-xs text-primary">FPSC Federal</div>
                <div className="text-[11px] text-muted">CSS & General Recruitment</div>
              </div>
              <div className="bg-surface-subtle p-3 rounded-lg border border-subtle text-center">
                <div className="font-bold text-xs text-primary">PPSC Punjab</div>
                <div className="text-[11px] text-muted">Provincial Cadre & Health</div>
              </div>
              <div className="bg-surface-subtle p-3 rounded-lg border border-subtle text-center">
                <div className="font-bold text-xs text-primary">SPSC Sindh</div>
                <div className="text-[11px] text-muted">Civil & Municipal Services</div>
              </div>
              <div className="bg-surface-subtle p-3 rounded-lg border border-subtle text-center">
                <div className="font-bold text-xs text-primary">KPPSC Khyber</div>
                <div className="text-[11px] text-muted">Zonal Provincial Openings</div>
              </div>
              <div className="bg-surface-subtle p-3 rounded-lg border border-subtle text-center">
                <div className="font-bold text-xs text-primary">NTS Testing</div>
                <div className="text-[11px] text-muted">Judiciary & Power Sector</div>
              </div>
            </div>
          </section>

          {/* Section 4: Project Independence */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 border-b border-subtle pb-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              Our Commitment to You
            </h2>
            <p>
              RozgarPK is an independent software project. We do not accept sponsorships from paid test academies to promote unverified materials, and we will never sell candidate email addresses to third parties.
            </p>
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <Link href="/jobs/govt" className="btn btn-primary btn-sm">
                <span>Browse Verified Govt Jobs</span>
              </Link>
              <Link href="/cv-builder" className="btn btn-outline btn-sm">
                <span>Create Free ATS Resume</span>
              </Link>
              <Link href="/contact" className="btn btn-outline btn-sm">
                <span>Contact Our Team</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
