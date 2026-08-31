'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ExternalLink, 
  FileText, 
  Calendar, 
  Building2, 
  Landmark, 
  CheckCircle2, 
  Lock,
  Mail,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t, isRtl } = useLanguage();

  const officialPortals = [
    { name: "FPSC Federal Portal", url: "https://online.fpsc.gov.pk" },
    { name: "PPSC Punjab Portal", url: "https://www.ppsc.gop.pk" },
    { name: "SPSC Sindh Portal", url: "https://spsc.gov.pk" },
    { name: "KPPSC Khyber Pakhtunkhwa", url: "https://www.kppsc.gov.pk" },
    { name: "BPSC Balochistan", url: "http://bpsc.gob.pk" },
    { name: "NTS Testing Service", url: "https://www.nts.org.pk" },
    { name: "Higher Education Commission", url: "https://hec.gov.pk" },
    { name: "State Bank Careers", url: "https://www.sbp.org.pk" }
  ];

  return (
    <footer className="portal-footer no-print">
      {/* Upper Footer - Official Directory Links */}
      <div className="footer-official-bar">
        <div className="container-xl">
          <div className="official-bar-title-row">
            <ShieldCheck size={18} className="text-emerald" />
            <span className="official-bar-heading">{t.footer.directoryHeading}</span>
          </div>
          <div className="official-portals-grid">
            {officialPortals.map((portal, idx) => (
              <a
                key={idx}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="official-portal-link"
              >
                <span>{portal.name}</span>
                <ExternalLink size={12} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-main-section">
        <div className="container-xl footer-content-grid">
          {/* Brand & Purpose */}
          <div className="footer-brand-col">
            <Link href="/" className="brand-logo footer-logo">
              <div className="logo-icon-box">
                <ShieldCheck className="brand-icon" size={22} />
              </div>
              <div className="brand-text-box">
                <span className="brand-title font-display">{t.nav.brandName}<span className="brand-accent">{t.nav.brandAccent}</span></span>
                <span className="brand-tagline">{t.nav.tagline}</span>
              </div>
            </Link>
            <p className="footer-desc">
              {t.footer.desc}
            </p>
            <div className="footer-trust-badge">
              <CheckCircle2 size={15} className="text-emerald" />
              <span>{t.footer.antiScamBadge}</span>
            </div>
          </div>

          {/* Quick Hub Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">{t.footer.careerHub}</h4>
            <ul className="footer-links-list">
              <li>
                <Link href="/jobs/govt" className="footer-link-btn">
                  <Landmark size={14} />
                  <span>{t.footer.govtJobsLink}</span>
                </Link>
              </li>
              <li>
                <Link href="/jobs/private" className="footer-link-btn">
                  <Building2 size={14} />
                  <span>{t.footer.privateJobsLink}</span>
                </Link>
              </li>
              <li>
                <Link href="/exams" className="footer-link-btn">
                  <Calendar size={14} />
                  <span>{t.footer.examCalLink}</span>
                </Link>
              </li>
              <li>
                <Link href="/test-prep" className="footer-link-btn">
                  <BookOpen size={14} />
                  <span>{t.footer.testPrepLink}</span>
                </Link>
              </li>
              <li>
                <Link href="/cv-builder" className="footer-link-btn">
                  <FileText size={14} />
                  <span>{t.footer.cvBuilderLink}</span>
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="footer-link-btn">
                  <Mail size={14} />
                  <span>{t.footer.emailAlertsLink}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* City Portals */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">City Hubs</h4>
            <ul className="footer-links-list">
              <li><Link href="/city/lahore" className="footer-link-btn">Jobs in Lahore (Punjab)</Link></li>
              <li><Link href="/city/karachi" className="footer-link-btn">Jobs in Karachi (Sindh)</Link></li>
              <li><Link href="/city/islamabad" className="footer-link-btn">Jobs in Islamabad / Rawalpindi</Link></li>
              <li><Link href="/city/peshawar" className="footer-link-btn">Jobs in Peshawar (KPK)</Link></li>
              <li><Link href="/city/quetta" className="footer-link-btn">Jobs in Quetta (Balochistan)</Link></li>
            </ul>
          </div>

          {/* Commissions */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">{t.footer.commissionsTracked}</h4>
            <ul className="footer-links-list">
              <li><Link href="/agency/fpsc" className="footer-link-btn">FPSC Federal Intelligence</Link></li>
              <li><Link href="/agency/ppsc" className="footer-link-btn">PPSC Punjab Intelligence</Link></li>
              <li><Link href="/agency/spsc" className="footer-link-btn">SPSC Sindh Intelligence</Link></li>
              <li><Link href="/agency/kppsc" className="footer-link-btn">KPPSC Khyber Pakhtunkhwa</Link></li>
              <li><Link href="/agency/nts" className="footer-link-btn">NTS National Testing Service</Link></li>
              <li><Link href="/admin" className="footer-link-btn text-muted">Internal Admin & Telemetry</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="container-xl footer-bottom-flex">
          <div className="footer-copyright">
            {t.footer.copyright}
          </div>
          <div className="footer-badges-right">
            <span className="footer-badge-item">
              <Lock size={12} />
              <span>SSL 256-Bit Encrypted</span>
            </span>
            <span className="footer-badge-item">Zero Ads Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
