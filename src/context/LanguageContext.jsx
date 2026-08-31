'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../data/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');
  const [theme, setThemeState] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedLang = localStorage.getItem('rozgar_lang');
      if (savedLang && ['en', 'ur', 'roman'].includes(savedLang)) {
        setLangState(savedLang);
        if (savedLang === 'ur') {
          document.documentElement.setAttribute('dir', 'rtl');
        } else {
          document.documentElement.setAttribute('dir', 'ltr');
        }
      }

      const savedTheme = localStorage.getItem('rozgar_theme');
      if (savedTheme && ['dark', 'light'].includes(savedTheme)) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch {}
  }, []);

  const setLang = (newLang) => {
    if (!['en', 'ur', 'roman'].includes(newLang)) return;
    setLangState(newLang);
    try {
      localStorage.setItem('rozgar_lang', newLang);
    } catch {}

    if (newLang === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('rozgar_theme', nextTheme);
    } catch {}
  };

  const setTheme = (newTheme) => {
    if (!['dark', 'light'].includes(newTheme)) return;
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('rozgar_theme', newTheme);
    } catch {}
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRtl = lang === 'ur';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl, theme, toggleTheme, setTheme, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'en',
      setLang: () => {},
      t: TRANSLATIONS.en,
      isRtl: false,
      theme: 'dark',
      toggleTheme: () => {},
      setTheme: () => {},
      mounted: false
    };
  }
  return context;
}
