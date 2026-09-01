'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { JOBS_DATA } from '../data/jobsData';
import QuickSearchModal from './QuickSearchModal';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ur', label: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'roman', label: 'Roman Urdu', native: 'Roman', flag: '🇵🇰' }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t, theme, toggleTheme, isRtl } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef(null);

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

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const desktopNavItems = [
    { href: '/', label: t.nav.allJobs, icon: Briefcase },
    { href: '/jobs/govt', label: t.nav.govtJobs, icon: Landmark, badge: t.nav.officialBadge },
    { href: '/jobs/private', label: t.nav.privateJobs, icon: Building2, badge: t.nav.techBadge },
    { href: '/test-prep', label: t.nav.testPrep, icon: BookOpen, badge: t.nav.mcqBadge, highlight: true },
    { href: '/exams', label: t.nav.examCalendar, icon: Calendar },
    { href: '/cv-builder', label: t.nav.cvBuilder, icon: FileText, badge: t.nav.freeBadge }
  ];

  const allNavItems = [
    ...desktopNavItems,
    { href: '/alerts', label: t.nav.alerts, icon: Bell }
  ];

  const isActive = (href) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

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
              <span className="brand-title font-display">{t.nav.brandName}<span className="brand-accent">{t.nav.brandAccent}</span></span>
              <span className="brand-tagline">{t.nav.tagline}</span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Clean 6 links, no wrap) */}
          <nav className="desktop-nav-links" aria-label="Main Navigation">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link-item ${active ? 'active' : ''} ${item.highlight ? 'highlight-item' : ''}`}
                >
                  <Icon size={14} className="nav-icon" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`nav-badge ${item.badge === t.nav.officialBadge ? 'badge-official' : item.badge === t.nav.mcqBadge ? 'badge-mcq' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
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
              <span className="search-btn-label">{t.nav.quickSearch}</span>
              <kbd className="search-shortcut">⌘K</kbd>
            </button>

            {/* Alerts Quick Button */}
            <Link
              href="/alerts"
              className={`action-btn desktop-alerts-btn ${isActive('/alerts') ? 'active' : ''}`}
              title={t.nav.alerts}
              aria-label="Job Alerts"
            >
              <Bell size={16} />
            </Link>

            {/* 3-Language Switcher Dropdown (Desktop Only) */}
            <div className="lang-switcher-wrapper desktop-lang-switcher" ref={langDropdownRef}>
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

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="action-btn theme-toggle-btn"
              title={theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-500" />}
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
                  <span className="brand-title font-display text-base">{t.nav.brandName}<span className="brand-accent">{t.nav.brandAccent}</span></span>
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

              {/* Mobile Nav Links List */}
              <div className="mobile-nav-scroll-list px-3 py-2 flex-1 overflow-y-auto">
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-2 px-1">
                  Navigation
                </span>
                <div className="flex flex-col gap-1">
                  {allNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`mobile-nav-item ${active ? 'active' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`nav-icon-box ${active ? 'active' : ''}`}>
                            <Icon size={16} />
                          </div>
                          <span className="font-semibold text-sm">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`nav-badge ${item.badge === t.nav.officialBadge ? 'badge-official' : item.badge === t.nav.mcqBadge ? 'badge-mcq' : ''}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
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
      </header>

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
