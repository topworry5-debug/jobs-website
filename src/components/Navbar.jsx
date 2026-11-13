'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Search, 
  Bookmark, 
  Bell, 
  Languages, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ChevronDown, 
  Check, 
  Landmark, 
  Building2, 
  BookOpen, 
  Calendar, 
  FileCheck, 
  Calculator, 
  FileText,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import QuickSearchModal from './QuickSearchModal';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ur', label: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'roman', label: 'Roman Urdu', native: 'Roman', flag: '🇵🇰' }
];

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, t, theme, toggleTheme } = useLanguage();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'govt' | 'resources' | null
  const [savedCount, setSavedCount] = useState(0);

  // Mobile accordion state
  const [mobileGovtOpen, setMobileGovtOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  const headerRef = useRef(null);
  const govtTriggerRef = useRef(null);
  const resourcesTriggerRef = useRef(null);
  const langTriggerRef = useRef(null);

  // Sync saved jobs count reactive to storage events
  useEffect(() => {
    const updateCount = () => {
      try {
        const list = JSON.parse(localStorage.getItem('tainaati_saved_jobs') || '[]');
        setSavedCount(Array.isArray(list) ? list.length : 0);
      } catch (e) {
        setSavedCount(0);
      }
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('tainaati_saved_jobs_updated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('tainaati_saved_jobs_updated', updateCount);
    };
  }, []);

  // Global Cmd+K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setLangMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close all dropdowns & mobile menu on route change
  useEffect(() => {
    setActiveDropdown(null);
    setLangMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (href) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const isGovtActive = pathname.startsWith('/jobs/govt') || 
    ['/agency/fpsc', '/agency/ppsc', '/agency/spsc', '/agency/kppsc', '/agency/bpsc', '/agency/nts',
     '/national-job-portal', '/punjab-job-portal', '/sindh-job-portal', '/kpk-job-portal', '/balochistan-job-portal'
    ].some(p => pathname === p || pathname.startsWith(p + '/'));

  const isResourcesActive = ['/exams', '/exam-results', '/salary-calculator', '/cv-builder', '/blog']
    .some(p => pathname === p || pathname.startsWith(p + '/'));

  const currentLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <>
      <header className="header-root" ref={headerRef}>
        <div className="header-inner">
          {/* Left: Brand Logo + Tainaati */}
          <Link 
            href="/" 
            className="header-brand"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Tainaati Homepage"
          >
            <div className="header-brand-icon-box">
              <ShieldCheck className="header-brand-icon" size={20} />
            </div>
            <span className="header-brand-title">
              {t.nav?.brandName || 'Tainaa'}<span className="brand-accent">{t.nav?.brandAccent || 'ti'}</span>
            </span>
          </Link>

          {/* Center (Desktop >= 1024px): All Jobs, Govt Jobs (dropdown), Test Prep, Resources (dropdown) */}
          <nav className="header-nav" aria-label="Main Navigation">
            {/* 1. All Jobs */}
            <Link
              href="/"
              className={`header-nav-link ${isActive('/') && !isGovtActive && !isResourcesActive && pathname !== '/test-prep' ? 'active' : ''}`}
            >
              <span>{t.nav?.allJobs || 'All Jobs'}</span>
            </Link>

            {/* 2. Govt Jobs (dropdown) */}
            <div 
              className="header-dropdown-container"
              onMouseEnter={() => setActiveDropdown('govt')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                ref={govtTriggerRef}
                type="button"
                className={`header-nav-link header-dropdown-trigger ${isGovtActive ? 'active' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === 'govt' ? null : 'govt')}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setActiveDropdown(null);
                }}
                aria-expanded={activeDropdown === 'govt'}
                aria-haspopup="true"
              >
                <span>{t.nav?.govtJobs || 'Govt Jobs'}</span>
                <ChevronDown size={14} className={`dropdown-chevron ${activeDropdown === 'govt' ? 'rotated' : ''}`} />
              </button>

              {activeDropdown === 'govt' && (
                <div 
                  className="header-dropdown-menu header-dropdown-mega" 
                  role="menu"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setActiveDropdown(null);
                      govtTriggerRef.current?.focus();
                    }
                  }}
                >
                  <div className="dropdown-mega-header">
                    <Link 
                      href="/jobs/govt" 
                      className="dropdown-mega-title-card"
                      onClick={() => setActiveDropdown(null)}
                      role="menuitem"
                    >
                      <div className="flex items-center gap-2">
                        <Landmark size={16} className="text-brand-primary" />
                        <div>
                          <div className="dropdown-title-strong">All Government Jobs</div>
                          <div className="dropdown-title-sub">Federal & Provincial Gazette Announcements</div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="dropdown-mega-columns">
                    {/* Commissions Column */}
                    <div className="dropdown-col">
                      <div className="dropdown-col-heading">Public Service Commissions</div>
                      <Link href="/agency/fpsc" className="dropdown-item" onClick={() => setActiveDropdown(null)} role="menuitem">
                        <span>FPSC Federal</span>
                        <span className="dropdown-item-badge">BPS 16-22</span>
                      </Link>
                      <Link href="/agency/ppsc" className="dropdown-item" onClick={() => setActiveDropdown(null)} role="menuitem">
                        <span>PPSC Punjab</span>
                        <span className="dropdown-item-badge">BPS 11-18</span>
                      </Link>
                      <Link href="/agency/spsc" className="dropdown-item" onClick={() => setActiveDropdown(null)} role="menuitem">
                        <span>SPSC Sindh</span>
                        <span className="dropdown-item-badge">CCE</span>
                      </Link>
                      <Link href="/agency/kppsc" className="dropdown-item" onClick={() => setActiveDropdown(null)} role="menuitem">
                        <span>KPPSC Khyber</span>
                        <span className="dropdown-item-badge">Provincial</span>
                      </Link>
                      <Link href="/agency/bpsc" className="dropdown-item" onClick={() => setActiveDropdown(null)} role="menuitem">
                        <span>BPSC Balochistan</span>
                        <span className="dropdown-item-badge">Gazette</span>
                      </Link>
                      <Link href="/agency/nts" className="dropdown-item" onClick={() => setActiveDropdown(null)} role="menuitem">
                        <span>NTS Testing</span>
                        <span className="dropdown-item-badge">Projects</span>
                      </Link>
                    </div>

                    {/* Portal Hubs Column */}
                    <div className="dropdown-col">
                      <div className="dropdown-col-heading">Portal Hubs</div>
                      <Link href="/national-job-portal" className="dropdown-item" onClick={() => setActiveDropdown(null)} role="menuitem">
                        <span>National Job Portal (NJP)</span>
                      </Link>
                      <Link href="/punjab-job-portal" className="dropdown-item" onClick={() => setActiveDropdown(null)} role="menuitem">
                        <span>Punjab Job Portal</span>
                      </Link>
                      <Link href="/sindh-job-portal" className="dropdown-item" onClick={() => setActiveDropdown(null)} role="menuitem">
                        <span>Sindh Job Portal</span>
                      </Link>
                      <Link href="/kpk-job-portal" className="dropdown-item" onClick={() => setActiveDropdown(null)} role="menuitem">
                        <span>KPK Job Portal</span>
                      </Link>
                      <Link href="/balochistan-job-portal" className="dropdown-item" onClick={() => setActiveDropdown(null)} role="menuitem">
                        <span>Balochistan Job Portal</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Test Prep */}
            <Link
              href="/test-prep"
              className={`header-nav-link ${isActive('/test-prep') ? 'active' : ''}`}
            >
              <span>{t.nav?.testPrep || 'Test Prep'}</span>
            </Link>

            {/* 4. Resources (dropdown) */}
            <div 
              className="header-dropdown-container"
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                ref={resourcesTriggerRef}
                type="button"
                className={`header-nav-link header-dropdown-trigger ${isResourcesActive ? 'active' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setActiveDropdown(null);
                }}
                aria-expanded={activeDropdown === 'resources'}
                aria-haspopup="true"
              >
                <span>{t.nav?.resources || 'Resources'}</span>
                <ChevronDown size={14} className={`dropdown-chevron ${activeDropdown === 'resources' ? 'rotated' : ''}`} />
              </button>

              {activeDropdown === 'resources' && (
                <div 
                  className="header-dropdown-menu header-dropdown-list" 
                  role="menu"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setActiveDropdown(null);
                      resourcesTriggerRef.current?.focus();
                    }
                  }}
                >
                  <Link href="/exams" className="dropdown-item-rich" onClick={() => setActiveDropdown(null)} role="menuitem">
                    <Calendar size={16} className="text-brand-primary flex-shrink-0" />
                    <div>
                      <div className="dropdown-item-title">{t.nav?.examCalendar || 'Exam Calendar'}</div>
                      <div className="dropdown-item-desc">FPSC, PPSC & NTS Test Schedules</div>
                    </div>
                  </Link>

                  <Link href="/exam-results" className="dropdown-item-rich" onClick={() => setActiveDropdown(null)} role="menuitem">
                    <FileCheck size={16} className="text-emerald-600 flex-shrink-0" />
                    <div>
                      <div className="dropdown-item-title">{t.nav?.examResults || 'Results & Roll No Slips'}</div>
                      <div className="dropdown-item-desc">Merit lists & admission certificates</div>
                    </div>
                  </Link>

                  <Link href="/salary-calculator" className="dropdown-item-rich" onClick={() => setActiveDropdown(null)} role="menuitem">
                    <Calculator size={16} className="text-amber-600 flex-shrink-0" />
                    <div>
                      <div className="dropdown-item-title">{t.nav?.salaryCalculator || 'BPS Salary Calculator'}</div>
                      <div className="dropdown-item-desc">Pay scales & allowance calculator</div>
                    </div>
                  </Link>

                  <Link href="/cv-builder" className="dropdown-item-rich" onClick={() => setActiveDropdown(null)} role="menuitem">
                    <FileText size={16} className="text-indigo-600 flex-shrink-0" />
                    <div>
                      <div className="dropdown-item-title">{t.nav?.cvBuilder || 'ATS CV Builder'}</div>
                      <div className="dropdown-item-desc">Standard single-column PDF resume</div>
                    </div>
                  </Link>

                  <Link href="/blog" className="dropdown-item-rich" onClick={() => setActiveDropdown(null)} role="menuitem">
                    <BookOpen size={16} className="text-rose-600 flex-shrink-0" />
                    <div>
                      <div className="dropdown-item-title">{t.nav?.guides || 'Career Guides'}</div>
                      <div className="dropdown-item-desc">Syllabus analysis & preparation guides</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Search, Saved, Alerts, Language switch, Theme toggle (40x40 icon buttons) */}
          <div className="header-actions">
            {/* Search Icon Button (40x40) */}
            <button
              type="button"
              className="header-icon-btn"
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search jobs (Ctrl+K)"
              title="Search jobs (Ctrl+K)"
            >
              <Search size={18} />
            </button>

            {/* Saved Jobs (40x40 with badge only if > 0) */}
            <Link
              href="/saved-jobs"
              className={`header-icon-btn ${isActive('/saved-jobs') ? 'active' : ''}`}
              aria-label={savedCount > 0 ? `Saved jobs (${savedCount})` : 'Saved jobs'}
              title={savedCount > 0 ? `Saved jobs (${savedCount})` : 'Saved jobs'}
            >
              <Bookmark size={18} className={savedCount > 0 ? 'fill-current text-brand-primary' : ''} />
              {savedCount > 0 && (
                <span className="header-badge-count tabular-nums" aria-hidden="true">
                  {savedCount}
                </span>
              )}
            </Link>

            {/* Alerts (40x40) */}
            <Link
              href="/alerts"
              className={`header-icon-btn ${isActive('/alerts') ? 'active' : ''}`}
              aria-label="Job alerts"
              title="Job alerts"
            >
              <Bell size={18} />
            </Link>

            {/* Language Switcher (40x40 or compact trigger) */}
            <div className="header-lang-wrapper">
              <button
                ref={langTriggerRef}
                type="button"
                className="header-icon-btn"
                onClick={() => setLangMenuOpen(v => !v)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setLangMenuOpen(false);
                }}
                aria-label={`Select language (Current: ${currentLangObj.label})`}
                title={`Select language (Current: ${currentLangObj.label})`}
                aria-expanded={langMenuOpen}
                aria-haspopup="true"
              >
                <Languages size={18} />
              </button>

              {langMenuOpen && (
                <div 
                  className="header-dropdown-menu header-lang-menu" 
                  role="menu"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setLangMenuOpen(false);
                      langTriggerRef.current?.focus();
                    }
                  }}
                >
                  <div className="header-lang-menu-title">Select Language</div>
                  {LANGUAGES.map((l) => {
                    const isSelected = lang === l.code;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        className={`header-lang-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setLang(l.code);
                          setLangMenuOpen(false);
                        }}
                        role="menuitem"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">{l.flag}</span>
                          <div className="text-left">
                            <span className="font-semibold block text-xs">{l.native}</span>
                            <span className="text-[10px] text-muted block">{l.label}</span>
                          </div>
                        </div>
                        {isSelected && <Check size={14} className="text-brand-primary" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Theme Toggle (40x40) */}
            <button
              type="button"
              className="header-icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-slate-700" />
              )}
            </button>

            {/* Mobile Hamburger Toggle (Visible below 1024px) */}
            <button
              type="button"
              className="header-icon-btn mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label={mobileMenuOpen ? 'Close mobile navigation menu' : 'Open mobile navigation menu'}
              title="Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu (Below 1024px) */}
      {mobileMenuOpen && (
        <div 
          className="mobile-drawer-overlay" 
          onClick={() => setMobileMenuOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div 
            className="mobile-drawer-panel" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="mobile-drawer-header">
              <Link 
                href="/" 
                className="header-brand" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="header-brand-icon-box">
                  <ShieldCheck className="header-brand-icon" size={18} />
                </div>
                <span className="header-brand-title text-base">
                  {t.nav?.brandName || 'Tainaa'}<span className="brand-accent">{t.nav?.brandAccent || 'ti'}</span>
                </span>
              </Link>
              <button 
                type="button"
                className="header-icon-btn" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Navigation Links (Min 44px tap targets) */}
            <div className="mobile-drawer-nav">
              {/* All Jobs */}
              <Link
                href="/"
                className={`mobile-nav-link ${isActive('/') && !isGovtActive && !isResourcesActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{t.nav?.allJobs || 'All Jobs'}</span>
              </Link>

              {/* Govt Jobs Accordion */}
              <div className="mobile-accordion">
                <button
                  type="button"
                  className={`mobile-nav-link mobile-accordion-trigger ${isGovtActive ? 'active' : ''}`}
                  onClick={() => setMobileGovtOpen(v => !v)}
                  aria-expanded={mobileGovtOpen}
                >
                  <span>{t.nav?.govtJobs || 'Govt Jobs'}</span>
                  <ChevronDown size={16} className={`dropdown-chevron ${mobileGovtOpen ? 'rotated' : ''}`} />
                </button>
                {mobileGovtOpen && (
                  <div className="mobile-accordion-body">
                    <Link href="/jobs/govt" className="mobile-subnav-link font-semibold text-brand-primary" onClick={() => setMobileMenuOpen(false)}>
                      All Government Gazette Jobs
                    </Link>
                    <div className="mobile-subnav-label">Public Service Commissions</div>
                    <Link href="/agency/fpsc" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>FPSC Federal</Link>
                    <Link href="/agency/ppsc" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>PPSC Punjab</Link>
                    <Link href="/agency/spsc" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>SPSC Sindh</Link>
                    <Link href="/agency/kppsc" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>KPPSC Khyber</Link>
                    <Link href="/agency/bpsc" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>BPSC Balochistan</Link>
                    <Link href="/agency/nts" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>NTS Testing</Link>
                    <div className="mobile-subnav-label">Portal Hubs</div>
                    <Link href="/national-job-portal" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>National Job Portal</Link>
                    <Link href="/punjab-job-portal" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>Punjab Job Portal</Link>
                    <Link href="/sindh-job-portal" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>Sindh Job Portal</Link>
                    <Link href="/kpk-job-portal" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>KPK Job Portal</Link>
                    <Link href="/balochistan-job-portal" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>Balochistan Job Portal</Link>
                  </div>
                )}
              </div>

              {/* Test Prep */}
              <Link
                href="/test-prep"
                className={`mobile-nav-link ${isActive('/test-prep') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{t.nav?.testPrep || 'Test Prep'}</span>
              </Link>

              {/* Resources Accordion */}
              <div className="mobile-accordion">
                <button
                  type="button"
                  className={`mobile-nav-link mobile-accordion-trigger ${isResourcesActive ? 'active' : ''}`}
                  onClick={() => setMobileResourcesOpen(v => !v)}
                  aria-expanded={mobileResourcesOpen}
                >
                  <span>{t.nav?.resources || 'Resources'}</span>
                  <ChevronDown size={16} className={`dropdown-chevron ${mobileResourcesOpen ? 'rotated' : ''}`} />
                </button>
                {mobileResourcesOpen && (
                  <div className="mobile-accordion-body">
                    <Link href="/exams" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>
                      {t.nav?.examCalendar || 'Exam Calendar'}
                    </Link>
                    <Link href="/exam-results" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>
                      {t.nav?.examResults || 'Results & Roll No Slips'}
                    </Link>
                    <Link href="/salary-calculator" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>
                      {t.nav?.salaryCalculator || 'BPS Salary Calculator'}
                    </Link>
                    <Link href="/cv-builder" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>
                      {t.nav?.cvBuilder || 'ATS CV Builder'}
                    </Link>
                    <Link href="/blog" className="mobile-subnav-link" onClick={() => setMobileMenuOpen(false)}>
                      {t.nav?.guides || 'Career Guides'}
                    </Link>
                  </div>
                )}
              </div>

              {/* Saved Jobs with count */}
              <Link
                href="/saved-jobs"
                className={`mobile-nav-link ${isActive('/saved-jobs') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Bookmark size={18} />
                  <span>{t.nav?.savedJobs || 'Saved Jobs'}</span>
                </div>
                {savedCount > 0 && (
                  <span className="header-badge-count-inline tabular-nums">
                    {savedCount}
                  </span>
                )}
              </Link>

              {/* Job Alerts */}
              <Link
                href="/alerts"
                className={`mobile-nav-link ${isActive('/alerts') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Bell size={18} />
                  <span>{t.nav?.alerts || 'Job Alerts'}</span>
                </div>
              </Link>
            </div>

            {/* Drawer Bottom Utilities */}
            <div className="mobile-drawer-footer">
              <div className="mobile-drawer-footer-row">
                <span className="text-xs font-semibold text-muted">Language:</span>
                <div className="flex gap-1">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      className={`btn-filter-pill ${lang === l.code ? 'active' : ''}`}
                      onClick={() => setLang(l.code)}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mobile-drawer-footer-row">
                <span className="text-xs font-semibold text-muted">Theme:</span>
                <button
                  type="button"
                  className="btn-filter-pill flex items-center gap-1.5"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun size={14} className="text-amber-400" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon size={14} className="text-slate-700" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Quick Search Modal (Cmd+K) */}
      <QuickSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
