'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const officialPortals = [
    { name: "FPSC (Federal)", url: "https://online.fpsc.gov.pk" },
    { name: "PPSC (Punjab)", url: "https://www.ppsc.gop.pk" },
    { name: "SPSC (Sindh)", url: "https://spsc.gov.pk" },
    { name: "KPPSC (Khyber)", url: "https://www.kppsc.gov.pk" },
    { name: "BPSC (Balochistan)", url: "http://bpsc.gob.pk" },
    { name: "NTS Testing", url: "https://www.nts.org.pk" }
  ];

  const cityLinks = [
    { name: "Lahore", href: "/city/lahore" },
    { name: "Karachi", href: "/city/karachi" },
    { name: "Islamabad", href: "/city/islamabad" },
    { name: "Peshawar", href: "/city/peshawar" },
    { name: "Quetta", href: "/city/quetta" }
  ];

  return (
    <footer className="footer-root no-print">
      {/* Main 4-Column Section with 48px vertical padding */}
      <div className="footer-main-container container-xl">
        <div className="footer-grid-4col">
          {/* Column 1: Brand + Honest Sentence + Last Updated Timestamp */}
          <div className="footer-col footer-col-brand">
            <Link href="/" className="footer-brand-logo" aria-label="Tainaati Home">
              <div className="footer-brand-icon-box">
                <ShieldCheck size={20} className="footer-brand-icon" />
              </div>
              <span className="footer-brand-title">
                {t.nav?.brandName || 'Tainaa'}<span className="brand-accent">{t.nav?.brandAccent || 'ti'}</span>
              </span>
            </Link>

            <p className="footer-brand-sentence">
              {t.footer?.desc || "Government job notices and competitive exam resources in Pakistan, linked directly to official commission announcements."}
            </p>

            <div className="footer-timestamp tabular-nums">
              <Clock size={14} className="text-brand-primary flex-shrink-0" />
              <span>Last updated: November 2026</span>
            </div>
          </div>

          {/* Column 2: Jobs (Max 5 links) */}
          <div className="footer-col">
            <h4 className="footer-heading">{t.footer?.careerHub || "Jobs"}</h4>
            <ul className="footer-links">
              <li>
                <Link href="/jobs/govt" className="footer-link">
                  {t.footer?.govtJobsLink || "Govt Jobs"}
                </Link>
              </li>
              <li>
                <Link href="/exams" className="footer-link">
                  {t.footer?.examCalLink || "Exam Calendar"}
                </Link>
              </li>
              <li>
                <Link href="/test-prep" className="footer-link">
                  {t.footer?.testPrepLink || "Test Prep"}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="footer-link">
                  {t.footer?.blogLink || "Career Guides"}
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="footer-link">
                  {t.footer?.emailAlertsLink || "Job Alerts"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Commissions (FPSC, PPSC, SPSC, KPPSC, BPSC, NTS) */}
          <div className="footer-col">
            <h4 className="footer-heading">{t.footer?.commissionsTracked || "Commissions"}</h4>
            <ul className="footer-links">
              <li><Link href="/agency/fpsc" className="footer-link">FPSC Federal</Link></li>
              <li><Link href="/agency/ppsc" className="footer-link">PPSC Punjab</Link></li>
              <li><Link href="/agency/spsc" className="footer-link">SPSC Sindh</Link></li>
              <li><Link href="/agency/kppsc" className="footer-link">KPPSC Khyber</Link></li>
              <li><Link href="/agency/bpsc" className="footer-link">BPSC Balochistan</Link></li>
              <li><Link href="/agency/nts" className="footer-link">NTS Testing</Link></li>
            </ul>
          </div>

          {/* Column 4: Company (About, Contact, Privacy Policy, Terms - Max 5 links) */}
          <div className="footer-col">
            <h4 className="footer-heading">{t.footer?.trustTitle || "Company"}</h4>
            <ul className="footer-links">
              <li>
                <Link href="/about" className="footer-link">
                  {t.footer?.about || "About"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  {t.footer?.contact || "Contact"}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="footer-link">
                  {t.footer?.privacy || "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="footer-link">
                  {t.footer?.terms || "Terms of Service"}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="footer-link">
                  {t.footer?.faq || "FAQ"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Compact Bottom Rows: Cities & Official Portals */}
        <div className="footer-compact-section">
          {/* Cities Compact Row */}
          <div className="footer-compact-row">
            <span className="footer-compact-label">Cities:</span>
            <div className="footer-compact-links">
              {cityLinks.map((c, idx) => (
                <React.Fragment key={c.href}>
                  <Link href={c.href} className="footer-compact-link">
                    {c.name}
                  </Link>
                  {idx < cityLinks.length - 1 && (
                    <span className="footer-compact-dot" aria-hidden="true">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Official Portals Compact Row */}
          <div className="footer-compact-row">
            <span className="footer-compact-label">Official Portals:</span>
            <div className="footer-compact-links">
              {officialPortals.map((p, idx) => (
                <React.Fragment key={p.url}>
                  <a 
                    href={p.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="footer-compact-link flex items-center gap-1"
                  >
                    <span>{p.name}</span>
                    <ExternalLink size={10} className="opacity-70 flex-shrink-0" />
                  </a>
                  {idx < officialPortals.length - 1 && (
                    <span className="footer-compact-dot" aria-hidden="true">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Mandatory Disclaimer */}
      <div className="footer-bottom-bar">
        <div className="container-xl footer-bottom-flex">
          <div className="footer-copyright tabular-nums">
            © {currentYear} Tainaati. All rights reserved.
          </div>
          <div className="footer-disclaimer-note">
            Tainaati is not a government website. Always apply through the official portal.
          </div>
        </div>
      </div>
    </footer>
  );
}
