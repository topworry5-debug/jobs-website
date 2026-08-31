'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import QuickSearchModal from './QuickSearchModal';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ur', label: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'roman', label: 'Roman Urdu', native: 'Roman Urdu', flag: '🇵🇰' }
];

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, t, theme, toggleTheme, isRtl } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { href: '/', label: t.nav.allJobs, icon: Briefcase },
    { href: '/jobs/govt', label: t.nav.govtJobs, icon: Landmark, badge: t.nav.officialBadge },
    { href: '/jobs/private', label: t.nav.privateJobs, icon: Building2, badge: t.nav.techBadge },
    { href: '/test-prep', label: t.nav.testPrep, icon: BookOpen, badge: t.nav.mcqBadge, highlight: true },
    { href: '/exams', label: t.nav.examCalendar, icon: Calendar },
    { href: '/cv-builder', label: t.nav.cvBuilder, icon: FileText, badge: t.nav.freeBadge },
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
              <ShieldCheck className="brand-icon" size={24} />
            </div>
            <div className="brand-text-box">
              <span className="brand-title font-display">{t.nav.brandName}<span className="brand-accent">{t.nav.brandAccent}</span></span>
              <span className="brand-tagline">{t.nav.tagline}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav-links" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link-item ${active ? 'active' : ''} ${item.highlight ? 'highlight-item' : ''}`}
                >
                  <Icon size={16} className="nav-icon" />
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

          {/* Right Utilities */}
          <div className="navbar-actions">
            {/* Quick Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="action-btn search-trigger-btn"
              title="Search Jobs (Ctrl + K)"
              aria-label="Quick Search"
            >
              <Search size={17} />
              <span className="search-btn-label">{t.nav.quickSearch}</span>
              <kbd className="search-shortcut">{t.nav.searchShortcut}</kbd>
            </button>

            {/* 3-Language Switcher Dropdown */}
            <div className="lang-switcher-wrapper relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="action-btn lang-dropdown-trigger"
                title={t.nav.selectLanguage}
                aria-label="Select Language"
                aria-expanded={langMenuOpen}
              >
                <Languages size={17} />
                <span className="current-lang-text font-bold">{currentLangObj.native}</span>
                <ChevronDown size={14} className={`transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div className="lang-dropdown-menu">
                  <div className="lang-dropdown-header">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">{t.nav.selectLanguage}</span>
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
                          <span className="text-base">{l.flag}</span>
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
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-toggle"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-nav-dropdown">
            <div className="mobile-nav-container">
              {/* Mobile Language Selector */}
              <div className="mobile-lang-segmented mb-4 p-2 rounded-xl bg-surface-subtle border border-subtle">
                <span className="text-xs font-bold text-muted block mb-2 px-1">{t.nav.selectLanguage}:</span>
                <div className="grid grid-cols-3 gap-1">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-xs py-1.5 px-2 rounded-lg font-bold transition-all text-center ${
                        lang === l.code 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'bg-surface text-secondary hover:text-primary'
                      }`}
                    >
                      {l.native}
                    </button>
                  ))}
                </div>
              </div>

              {navItems.map((item) => {
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
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </Link>
                );
              })}

              {/* Mobile Theme Toggle */}
              <div className="mt-4 pt-3 border-t border-subtle flex items-center justify-between">
                <span className="text-xs font-semibold text-secondary">
                  {theme === 'dark' ? t.nav.themeDark : t.nav.themeLight}
                </span>
                <button
                  onClick={toggleTheme}
                  className="btn btn-outline btn-sm flex items-center gap-2"
                >
                  {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
                  <span>{theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <QuickSearchModal 
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          onSelectJob={(job) => {
            setSearchModalOpen(false);
            window.location.href = `/jobs/${job.id}`;
          }}
        />
      )}
    </>
  );
}
