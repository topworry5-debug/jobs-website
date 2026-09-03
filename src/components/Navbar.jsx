'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Briefcase, 
  Landmark, 
  Building2, 
  Calendar, 
  FileText, 
  Moon, 
  Sun, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  BookOpen, 
  Bell, 
  Languages, 
  ChevronDown, 
  Check,
  Sparkles,
  Shield,
  ShieldAlert,
  Scale,
  Factory,
  GraduationCap,
  Stethoscope,
  MapPin,
  Wrench,
  HeartHandshake,
  Plane,
  Laptop,
  FileCheck,
  ArrowRight,
  UserCheck,
  Leaf,
  Mountain,
  Flame,
  Clock,
  Tv,
  Calculator,
  Bookmark
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { JOBS_DATA } from '../data/jobsData';
import { CATEGORIES_CONFIG, matchesJobCategory } from '../data/categoriesData';
import { isJobExpired } from '../utils/jobStatus';
import QuickSearchModal from './QuickSearchModal';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ur', label: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'roman', label: 'Roman Urdu', native: 'Roman', flag: '🇵🇰' }
];

const ICON_MAP = {
  Shield,
  ShieldAlert,
  Scale,
  Factory,
  GraduationCap,
  Stethoscope,
  MapPin,
  Landmark,
  Wrench,
  HeartHandshake,
  Sparkles,
  Plane,
  Laptop,
  FileCheck,
  Building2,
  UserCheck,
  Leaf,
  Mountain,
  Flame,
  Clock,
  Tv,
  Calculator,
  Bookmark
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t, theme, toggleTheme, isRtl } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'govt' | 'private' | 'tools' | null
  const [savedCount, setSavedCount] = useState(0);
  
  // Mobile accordion states
  const [mobileGovtOpen, setMobileGovtOpen] = useState(false);
  const [mobilePrivateOpen, setMobilePrivateOpen] = useState(false);
  const [mobileExamsOpen, setMobileExamsOpen] = useState(false);

  const langDropdownRef = useRef(null);
  const govtDropdownRef = useRef(null);
  const privateDropdownRef = useRef(null);
  const toolsDropdownRef = useRef(null);

  // Sync saved jobs count reactive to storage events
  useEffect(() => {
    const updateCount = () => {
      try {
        const list = JSON.parse(localStorage.getItem('tainaati_saved_jobs') || '[]');
        setSavedCount(Array.isArray(list) ? list.length : 0);
      } catch (e) {}
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('tainaati_saved_jobs_updated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('tainaati_saved_jobs_updated', updateCount);
    };
  }, []);

  // Compute live job counts for all categories dynamically (strictly active listings)
  const categoryCounts = useMemo(() => {
    const activeJobs = JOBS_DATA.filter(j => !isJobExpired(j));
    const counts = {};
    CATEGORIES_CONFIG.forEach(cat => {
      counts[cat.slug] = activeJobs.filter(j => matchesJobCategory(j, cat.id)).length;
    });
    counts['govt'] = activeJobs.filter(j => j.type === 'govt').length;
    counts['private'] = activeJobs.filter(j => j.type === 'private').length;
    return counts;
  }, []);

  // Filter categories by group
  const govtCategories = useMemo(() => 
    CATEGORIES_CONFIG.filter(c => c.group === 'govt'), []
  );

  const privateCategories = useMemo(() => 
    CATEGORIES_CONFIG.filter(c => c.group === 'private' || c.group === 'cross-cutting' && c.id !== 'exam-recruitment-hub'), []
  );

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click or route change
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
      if (
        (!govtDropdownRef.current || !govtDropdownRef.current.contains(event.target)) &&
        (!privateDropdownRef.current || !privateDropdownRef.current.contains(event.target)) &&
        (!toolsDropdownRef.current || !toolsDropdownRef.current.contains(event.target))
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
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

  const isGovtActive = pathname.startsWith('/jobs/govt') || govtCategories.some(c => pathname === `/jobs/${c.slug}`);
  const isPrivateActive = pathname.startsWith('/jobs/private') || privateCategories.some(c => pathname === `/jobs/${c.slug}`);
  const isResourcesActive = ['/exams', '/exam-results', '/salary-calculator', '/cv-builder', '/blog'].some(p => pathname === p || pathname.startsWith(p + '/'));

  const currentLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <>
      <header className="navbar-wrapper">
        <div className="container-xl navbar-inner">
          {/* Brand Logo */}
          <Link href="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-icon-box">
              <ShieldCheck className="brand-icon" size={20} />
            </div>
            <div className="brand-text-box">
              <span className="brand-title font-display">
                {t.nav.brandName}<span className="brand-accent">{t.nav.brandAccent}</span>
              </span>
              <span className="brand-tagline">{t.nav.tagline}</span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Rich Dropdowns */}
          <nav className="desktop-nav-links" aria-label="Main Navigation">
            {/* All Jobs Link */}
            <Link
              href="/"
              className={`nav-link-item ${isActive('/') ? 'active' : ''}`}
            >
              <Briefcase size={14} className="nav-icon" />
              <span>{t.nav.allJobs}</span>
            </Link>

            {/* 1. Government Jobs Dropdown */}
            <div 
              className="nav-dropdown-container" 
              ref={govtDropdownRef}
              onMouseEnter={() => setActiveDropdown('govt')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={`nav-dropdown-trigger ${isGovtActive ? 'active' : ''} ${activeDropdown === 'govt' ? 'open' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === 'govt' ? null : 'govt')}
                aria-expanded={activeDropdown === 'govt'}
                aria-haspopup="true"
              >
                <Landmark size={14} className="nav-icon" />
                <span>{t.nav.govtJobs}</span>
                <span className="nav-badge badge-official">{t.nav.officialBadge}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${activeDropdown === 'govt' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'govt' && (
                <div className="nav-mega-dropdown" role="menu">
                  {/* Master View All Govt Jobs */}
                  <Link 
                    href="/jobs/govt"
                    className="nav-dropdown-header-card"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="flex items-center gap-2">
                      <Landmark size={16} className="text-emerald-500" />
                      <div>
                        <div className="text-xs font-bold text-primary">All Government Gazette Jobs</div>
                        <div className="text-[10px] text-muted">FPSC, PPSC, SPSC, KPPSC & NTS</div>
                      </div>
                    </div>
                    <span className="nav-dropdown-count text-emerald-600 font-bold">{categoryCounts.govt || 0}</span>
                  </Link>

                  {/* Govt Sub-categories */}
                  <div className="nav-dropdown-items-list">
                    {govtCategories.map((cat) => {
                      const count = categoryCounts[cat.slug] || 0;
                      const IconComp = ICON_MAP[cat.icon] || Landmark;
                      const active = pathname === `/jobs/${cat.slug}`;
                      const isComingSoon = count === 0;

                      return (
                        <Link
                          key={cat.slug}
                          href={`/jobs/${cat.slug}`}
                          className={`nav-dropdown-item-link ${active ? 'active' : ''}`}
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="flex items-center gap-2">
                            <IconComp size={14} className={active ? 'text-emerald-600' : 'text-muted'} />
                            <span>{cat.name}</span>
                          </div>
                          {isComingSoon ? (
                            <span className="nav-dropdown-coming-soon">Coming Soon</span>
                          ) : (
                            <span className="nav-dropdown-count">{count}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Private & Careers Dropdown */}
            <div 
              className="nav-dropdown-container" 
              ref={privateDropdownRef}
              onMouseEnter={() => setActiveDropdown('private')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={`nav-dropdown-trigger ${isPrivateActive ? 'active' : ''} ${activeDropdown === 'private' ? 'open' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === 'private' ? null : 'private')}
                aria-expanded={activeDropdown === 'private'}
                aria-haspopup="true"
              >
                <Building2 size={14} className="nav-icon" />
                <span>Private & Careers</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${activeDropdown === 'private' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'private' && (
                <div className="nav-mega-dropdown" role="menu">
                  {/* Master View All Private Jobs */}
                  <Link 
                    href="/jobs/private"
                    className="nav-dropdown-header-card"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-blue-500" />
                      <div>
                        <div className="text-xs font-bold text-primary">All Corporate & Private Jobs</div>
                        <div className="text-[10px] text-muted">Banking, Engineering, Tech & Remote</div>
                      </div>
                    </div>
                    <span className="nav-dropdown-count text-blue-600 font-bold">{categoryCounts.private || 0}</span>
                  </Link>

                  {/* Private & Cross-cutting Sub-categories */}
                  <div className="nav-dropdown-items-list">
                    {privateCategories.map((cat) => {
                      const count = categoryCounts[cat.slug] || 0;
                      const IconComp = ICON_MAP[cat.icon] || Building2;
                      const active = pathname === `/jobs/${cat.slug}`;
                      const isComingSoon = count === 0;

                      return (
                        <Link
                          key={cat.slug}
                          href={`/jobs/${cat.slug}`}
                          className={`nav-dropdown-item-link ${active ? 'active' : ''}`}
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="flex items-center gap-2">
                            <IconComp size={14} className={active ? 'text-blue-600' : 'text-muted'} />
                            <span>{cat.name}</span>
                          </div>
                          {isComingSoon ? (
                            <span className="nav-dropdown-coming-soon">Coming Soon</span>
                          ) : (
                            <span className="nav-dropdown-count">{count}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Test Prep Link */}
            <Link
              href="/test-prep"
              className={`nav-link-item ${isActive('/test-prep') ? 'active' : ''} highlight-item`}
            >
              <BookOpen size={14} className="nav-icon" />
              <span>{t.nav.testPrep}</span>
              <span className="nav-badge badge-mcq">{t.nav.mcqBadge}</span>
            </Link>

            {/* Resources & Tools Dropdown (Consolidates Exams, Results, Salary, CV Builder, Guides) */}
            <div 
              className="nav-dropdown-container" 
              ref={toolsDropdownRef}
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={`nav-dropdown-trigger ${isResourcesActive ? 'active' : ''} ${activeDropdown === 'resources' ? 'open' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
                aria-expanded={activeDropdown === 'resources'}
                aria-haspopup="true"
              >
                <Sparkles size={14} className="nav-icon text-amber-500" />
                <span>{t.nav.resources || "Resources"}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'resources' && (
                <div className="nav-mega-dropdown nav-resources-dropdown" role="menu">
                  <div className="nav-dropdown-header-card">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-500" />
                      <div>
                        <div className="text-xs font-bold text-primary">Candidate Resources & Tools</div>
                        <div className="text-[10px] text-muted">Exam tracking, salary calculation & ATS tools</div>
                      </div>
                    </div>
                  </div>

                  <div className="nav-dropdown-items-list">
                    <Link
                      href="/exams"
                      className={`nav-dropdown-item-link ${pathname === '/exams' ? 'active' : ''}`}
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="flex items-center gap-2.5">
                        <Calendar size={15} className="text-blue-500 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block">{t.nav.examCalendar}</span>
                          <span className="text-[10px] text-muted block">FPSC, PPSC & NTS Test Schedules</span>
                        </div>
                      </div>
                      <span className="nav-dropdown-count">Live</span>
                    </Link>

                    <Link
                      href="/exam-results"
                      className={`nav-dropdown-item-link ${pathname === '/exam-results' ? 'active' : ''}`}
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileCheck size={15} className="text-emerald-500 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block">{t.nav.examResults || "Results & Roll No Slips"}</span>
                          <span className="text-[10px] text-muted block">Merit lists & interview letters</span>
                        </div>
                      </div>
                      <span className="nav-badge badge-official">Verified</span>
                    </Link>

                    <Link
                      href="/salary-calculator"
                      className={`nav-dropdown-item-link ${pathname === '/salary-calculator' ? 'active' : ''}`}
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="flex items-center gap-2.5">
                        <Calculator size={15} className="text-amber-500 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block">{t.nav.salaryCalculator || "BPS Salary Calculator"}</span>
                          <span className="text-[10px] text-muted block">Pay scales & allowance calculator (BPS 1-22)</span>
                        </div>
                      </div>
                      <span className="nav-badge badge-mcq">2026</span>
                    </Link>

                    <Link
                      href="/cv-builder"
                      className={`nav-dropdown-item-link ${pathname === '/cv-builder' ? 'active' : ''}`}
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText size={15} className="text-purple-500 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block">{t.nav.cvBuilder}</span>
                          <span className="text-[10px] text-muted block">ATS-friendly PDF resume generator</span>
                        </div>
                      </div>
                      <span className="nav-badge badge-free text-[9px] bg-emerald-500/10 text-emerald-600 font-bold px-1.5 py-0.5 rounded-full">{t.nav.freeBadge}</span>
                    </Link>

                    <Link
                      href="/blog"
                      className={`nav-dropdown-item-link ${pathname === '/blog' || pathname.startsWith('/blog/') ? 'active' : ''}`}
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen size={15} className="text-rose-500 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block">{t.nav.guides}</span>
                          <span className="text-[10px] text-muted block">Syllabus patterns, test prep & guides</span>
                        </div>
                      </div>
                      <span className="nav-dropdown-count">Guides</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Utilities Cluster */}
          <div className="navbar-actions">
            {/* Quick Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="action-btn search-trigger-btn"
              title="Search Jobs (Ctrl + K / Cmd + K)"
              aria-label="Quick Search"
            >
              <Search size={15} />
              <kbd className="search-shortcut">⌘K</kbd>
            </button>

            {/* Saved Jobs Shortcut Button */}
            <Link
              href="/saved-jobs"
              className={`action-btn desktop-saved-btn relative ${isActive('/saved-jobs') ? 'active' : ''}`}
              title={t.nav.savedJobs || "Saved Jobs & Application Tracker"}
              aria-label="Saved Jobs"
            >
              <Bookmark size={16} className={savedCount > 0 ? "fill-emerald-500 text-emerald-500" : ""} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {savedCount}
                </span>
              )}
            </Link>

            {/* Alerts Quick Button */}
            <Link
              href="/alerts"
              className={`action-btn desktop-alerts-btn ${isActive('/alerts') ? 'active' : ''}`}
              title={t.nav.alerts}
              aria-label="Job Alerts"
            >
              <Bell size={16} />
            </Link>

            {/* 3-Language Switcher Dropdown (Always Visible Desktop & Mobile) */}
            <div className="lang-switcher-wrapper" ref={langDropdownRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="action-btn lang-dropdown-trigger"
                title={t.nav.selectLanguage}
                aria-label="Select Language"
                aria-expanded={langMenuOpen}
              >
                <Languages size={15} />
                <span className="current-lang-text font-bold">{currentLangObj.native}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div className="lang-dropdown-menu">
                  <div className="lang-dropdown-header">
                    <span className="text-[11px] font-bold text-muted uppercase tracking-wider">{t.nav.selectLanguage}</span>
                  </div>
                  {LANGUAGES.map((l) => {
                    const isSelected = lang === l.code;
                    return (
                      <button
                        key={l.code}
                        className={`lang-option-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setLang(l.code);
                          setLangMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{l.flag}</span>
                          <div className="text-left">
                            <span className="font-semibold block text-xs text-primary">{l.native}</span>
                            <span className="text-[10px] text-muted block">{l.label}</span>
                          </div>
                        </div>
                        {isSelected && <Check size={14} className="text-emerald-500" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modern Dual-Slot Dark/Light Mode Switch */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-pill"
              title={theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
              aria-label="Toggle Dark / Light Theme"
            >
              <div className={`theme-icon-slot ${theme === 'light' ? 'active-slot' : ''}`}>
                <Sun size={14} className={theme === 'light' ? 'text-amber-500' : ''} />
              </div>
              <div className={`theme-icon-slot ${theme === 'dark' ? 'active-slot' : ''}`}>
                <Moon size={14} className={theme === 'dark' ? 'text-emerald-400' : ''} />
              </div>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="action-btn mobile-menu-toggle"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="mobile-drawer-header">
              <Link href="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
                <div className="logo-icon-box">
                  <ShieldCheck className="brand-icon" size={18} />
                </div>
                <span className="brand-title font-display text-base">
                  {t.nav.brandName}<span className="brand-accent">{t.nav.brandAccent}</span>
                </span>
              </Link>
              <button 
                className="action-btn-sm" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={17} />
              </button>
            </div>

            {/* Mobile Quick Search Button */}
            <div className="p-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-subtle text-sm text-secondary hover:text-primary transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Search size={16} className="text-emerald-500" />
                  <span className="font-medium">{t.nav.quickSearch}</span>
                </div>
                <kbd className="px-2 py-0.5 text-xs rounded bg-surface border border-subtle font-mono text-muted">⌘K</kbd>
              </button>
            </div>

            {/* Mobile 3-Language Segmented Picker */}
            <div className="px-3 py-2">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-2 px-1">
                {t.nav.selectLanguage}:
              </span>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-surface-subtle border border-subtle">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`text-xs py-2 px-1 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
                      lang === l.code 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-transparent text-secondary hover:text-primary'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.native}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Nav Links List with Expandable Accordions */}
            <div className="mobile-nav-scroll-list px-3 py-2 flex-1 overflow-y-auto">
              {/* All Jobs Direct Link */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-nav-item mb-2 ${isActive('/') ? 'active' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="nav-icon-box">
                    <Briefcase size={16} />
                  </div>
                  <span className="font-semibold text-sm">{t.nav.allJobs}</span>
                </div>
              </Link>

              {/* Accordion 1: Government Jobs */}
              <div className="mobile-nav-accordion">
                <button
                  className="mobile-accordion-toggle"
                  onClick={() => setMobileGovtOpen(!mobileGovtOpen)}
                  aria-expanded={mobileGovtOpen}
                >
                  <div className="flex items-center gap-2">
                    <Landmark size={16} className="text-emerald-600" />
                    <span>Government Jobs ({categoryCounts.govt || 0})</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${mobileGovtOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileGovtOpen && (
                  <div className="mobile-accordion-body">
                    <Link
                      href="/jobs/govt"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-sub-item font-semibold text-primary"
                    >
                      <span>🏛️ View All Govt Gazette Jobs</span>
                      <span className="nav-dropdown-count">{categoryCounts.govt || 0}</span>
                    </Link>
                    {govtCategories.map((cat) => {
                      const count = categoryCounts[cat.slug] || 0;
                      const IconComp = ICON_MAP[cat.icon] || Landmark;
                      const isComingSoon = count === 0;

                      return (
                        <Link
                          key={cat.slug}
                          href={`/jobs/${cat.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="mobile-sub-item"
                        >
                          <div className="flex items-center gap-2">
                            <IconComp size={13} className="text-muted" />
                            <span>{cat.name}</span>
                          </div>
                          {isComingSoon ? (
                            <span className="nav-dropdown-coming-soon">Coming Soon</span>
                          ) : (
                            <span className="nav-dropdown-count">{count}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 2: Private & Careers */}
              <div className="mobile-nav-accordion">
                <button
                  className="mobile-accordion-toggle"
                  onClick={() => setMobilePrivateOpen(!mobilePrivateOpen)}
                  aria-expanded={mobilePrivateOpen}
                >
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-blue-600" />
                    <span>Private & Careers ({categoryCounts.private || 0})</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${mobilePrivateOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobilePrivateOpen && (
                  <div className="mobile-accordion-body">
                    <Link
                      href="/jobs/private"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-sub-item font-semibold text-primary"
                    >
                      <span>💼 View All Private & Corporate Jobs</span>
                      <span className="nav-dropdown-count">{categoryCounts.private || 0}</span>
                    </Link>
                    {privateCategories.map((cat) => {
                      const count = categoryCounts[cat.slug] || 0;
                      const IconComp = ICON_MAP[cat.icon] || Building2;
                      const isComingSoon = count === 0;

                      return (
                        <Link
                          key={cat.slug}
                          href={`/jobs/${cat.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="mobile-sub-item"
                        >
                          <div className="flex items-center gap-2">
                            <IconComp size={13} className="text-muted" />
                            <span>{cat.name}</span>
                          </div>
                          {isComingSoon ? (
                            <span className="nav-dropdown-coming-soon">Coming Soon</span>
                          ) : (
                            <span className="nav-dropdown-count">{count}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 3: Exams & Hub */}
              <div className="mobile-nav-accordion">
                <button
                  className="mobile-accordion-toggle"
                  onClick={() => setMobileExamsOpen(!mobileExamsOpen)}
                  aria-expanded={mobileExamsOpen}
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-amber-500" />
                    <span>Competitive Exams & Hub</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${mobileExamsOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileExamsOpen && (
                  <div className="mobile-accordion-body">
                    <Link
                      href="/jobs/exam-recruitment-hub"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-sub-item font-semibold text-primary"
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck size={13} className="text-emerald-500" />
                        <span>Exam Recruitment Hub</span>
                      </div>
                      <span className="nav-dropdown-count">{categoryCounts['exam-recruitment-hub'] || 0}</span>
                    </Link>
                    <Link
                      href="/test-prep"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-sub-item"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen size={13} className="text-amber-500" />
                        <span>Interactive Test Prep (MCQs)</span>
                      </div>
                      <span className="nav-badge badge-mcq">{t.nav.mcqBadge}</span>
                    </Link>
                    <Link
                      href="/exams"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-sub-item"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-blue-500" />
                        <span>FPSC / PPSC Exam Calendar</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Utility Direct Links */}
              <div className="mt-3 flex flex-col gap-1">
                {/* Saved Jobs & Application Tracker */}
                <Link
                  href="/saved-jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-item ${isActive('/saved-jobs') ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="nav-icon-box">
                      <Bookmark size={16} className={savedCount > 0 ? "text-emerald-500 fill-emerald-500" : ""} />
                    </div>
                    <span className="font-semibold text-sm">{t.nav.savedJobs || "Saved Jobs & Tracker"}</span>
                  </div>
                  {savedCount > 0 && (
                    <span className="nav-dropdown-count bg-emerald-600 text-white font-mono font-bold">{savedCount}</span>
                  )}
                </Link>

                {/* Exam Results & Roll No Slips */}
                <Link
                  href="/exam-results"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-item ${isActive('/exam-results') ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="nav-icon-box">
                      <FileCheck size={16} className="text-emerald-500" />
                    </div>
                    <span className="font-semibold text-sm">{t.nav.examResults || "Results & Roll No Slips"}</span>
                  </div>
                </Link>

                {/* BPS Salary Calculator */}
                <Link
                  href="/salary-calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-item ${isActive('/salary-calculator') ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="nav-icon-box">
                      <Calculator size={16} className="text-amber-500" />
                    </div>
                    <span className="font-semibold text-sm">{t.nav.salaryCalculator || "BPS Salary Calculator"}</span>
                  </div>
                </Link>

                <Link
                  href="/cv-builder"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-item ${isActive('/cv-builder') ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="nav-icon-box">
                      <FileText size={16} />
                    </div>
                    <span className="font-semibold text-sm">{t.nav.cvBuilder}</span>
                  </div>
                  <span className="nav-badge badge-free text-[9px] bg-emerald-500/10 text-emerald-600 font-bold px-1.5 py-0.5 rounded-full">{t.nav.freeBadge}</span>
                </Link>

                <Link
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-item ${isActive('/blog') ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="nav-icon-box">
                      <BookOpen size={16} />
                    </div>
                    <span className="font-semibold text-sm">{t.nav.guides}</span>
                  </div>
                </Link>

                <Link
                  href="/alerts"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-item ${isActive('/alerts') ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="nav-icon-box">
                      <Bell size={16} />
                    </div>
                    <span className="font-semibold text-sm">{t.nav.alerts}</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Drawer Footer with Theme Toggle */}
            <div className="mobile-drawer-footer p-3 border-t border-subtle bg-surface-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === 'dark' ? <Moon size={16} className="text-emerald-400" /> : <Sun size={16} className="text-amber-500" />}
                <span className="text-xs font-semibold text-primary">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className="btn btn-outline btn-sm py-1.5 px-3 text-xs"
              >
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Search Modal Overlay */}
      {searchModalOpen && (
        <QuickSearchModal 
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          jobs={JOBS_DATA}
          onSelectJob={(job) => {
            setSearchModalOpen(false);
            router.push(`/jobs/${job.id}`);
          }}
        />
      )}
    </>
  );
}
