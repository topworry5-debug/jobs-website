'use client';

import React from 'react';
import { LanguageProvider } from '../context/LanguageContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientProviders({ children }) {
  return (
    <LanguageProvider>
      <div className="app-container">
        <Navbar />
        <main className="main-content-wrapper">
          {children}
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
