'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Briefcase, 
  Landmark, 
  Building2, 
  Calendar, 
  FileText, 
  Bookmark, 
  Moon, 
  Sun, 
  Search, 
  Menu, 
  X, 
  ShieldCheck,
  Sparkles,
  BookOpen,
  Bell,
  Languages,
  PlusCircle
} from 'lucide-react';
import { URDU_TRANSLATIONS } from '../data/urduTranslations';
import QuickSearchModal from './QuickSearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');
  const [savedCount, setSavedCount] = useState(2);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('rozgar_theme') || 'dark';
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);

      const storedLang = localStorage.getItem('rozgar_lang') || 'en';
      setLang(storedLang);

      const storedSaved = localStorage.getItem('rozgar_saved_jobs');
      if (storedSaved) {
        setSavedCount(JSON.parse(storedSaved).length);
      }
    } catch {}
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('rozgar_theme', nextTheme);
    } catch {}
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'ur' : 'en';
    setLang(nextLang);
    try {
      localStorage.setItem('rozgar_lang', nextLang);
    } catch {}
  };

  const t = lang === 'ur' ? URDU_TRANSLATIONS.nav : null;

  const navItems = [
    { href: '/', label: t ? t.allJobs : 'All Jobs', icon: Briefcase },
    { href: '/jobs/govt', label: t ? t.govtJobs : 'Govt Jobs', icon: Landmark, badge: 'Official' },
    { href: '/jobs/private', label: t ? t.privateJobs : 'Private & IT', icon: Building2, badge: 'Tech' },
    { href: '/test-prep', label: t ? t.testPrep : 'Test Prep', icon: BookOpen, badge: 'MCQs', highlight: true },
    { href: '/exams', label: t ? t.examCalendar : 'Exam Calendar', icon: Calendar },
    { href: '/cv-builder', label: t ? t.cvBuilder : 'CV Builder', icon: FileText, badge: 'Free' },
    { href: '/alerts', label: t ? t.alerts : 'Alerts', icon: Bell }
  ];

  const isActive = (href) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

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
              <span className="brand-title font-display">Rozgar<span className="brand-accent">PK</span></span>
              <span className="brand-tagline">Verified Jobs Intelligence</span>
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
                    <span className={`nav-badge ${item.badge === 'Official' ? 'badge-official' : item.badge === 'MCQs' ? 'badge-mcq' : ''}`}>
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
              <Search size={18} />
              <span className="search-btn-label">Quick Search</span>
              <kbd className="search-shortcut">⌘K</kbd>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="action-btn lang-toggle-btn"
              title={lang === 'en' ? 'اردو میں دیکھیں' : 'Switch to English'}
              aria-label="Toggle Language"
            >
              <Languages size={18} />
              <span className="lang-code">{lang === 'en' ? 'اردو' : 'EN'}</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="action-btn theme-toggle-btn"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
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
