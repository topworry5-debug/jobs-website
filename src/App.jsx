import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import JobListings from './components/JobListings';
import FilterSidebar from './components/FilterSidebar';
import JobDetailModal from './components/JobDetailModal';
import ExamCalendar from './components/ExamCalendar';
import CvBuilder from './components/CvBuilder';
import SavedJobs from './components/SavedJobs';
import QuickSearchModal from './components/QuickSearchModal';
import Footer from './components/Footer';

// Phase 2 Components
import TestPrepHub from './components/TestPrep/TestPrepHub';
import AlertsManager from './components/AlertsManager';
import EmployerPortal from './components/EmployerPortal';
import CityLandingPage from './components/CityLandingPage';
import AgencyLandingPage from './components/AgencyLandingPage';
import AdminPipelineDashboard from './components/AdminPipelineDashboard';

import { JOBS_DATA } from './data/jobsData';
import { EXAM_SCHEDULES } from './data/examCalendarData';
import { generateBreadcrumbSchema } from './utils/seoHelpers';

export default function App() {
  // Navigation tab: 'all' | 'govt' | 'private' | 'test-prep' | 'exams' | 'cv-builder' | 'alerts' | 'employer' | 'saved' | 'city-lahore' | 'city-karachi' | 'city-islamabad' | 'agency-fpsc' | 'agency-ppsc'
  const [currentTab, setCurrentTab] = useState('all');

  // Language state: 'en' | 'ur'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('tainaati_lang') || 'en';
  });

  // Dynamic Jobs list (includes seeded data + any employer postings)
  const [jobsList, setJobsList] = useState(JOBS_DATA);

  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('tainaati_theme') || 'dark';
  });

  // Saved / Bookmarked Job IDs
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const stored = localStorage.getItem('tainaati_saved_jobs');
      return stored ? JSON.parse(stored) : ['govt-fpsc-01', 'priv-tech-01'];
    } catch {
      return ['govt-fpsc-01', 'priv-tech-01'];
    }
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedProvince, setSelectedProvince] = useState('All Pakistan');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBps, setSelectedBps] = useState('All BPS Scales');
  const [selectedQualification, setSelectedQualification] = useState('All Qualifications');
  const [urgentOnly, setUrgentOnly] = useState(false);

  // Active Job Detail Modal
  const [selectedJob, setSelectedJob] = useState(null);

  // Quick Search Modal (Ctrl+K)
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);

  // Mobile Filter Drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tainaati_theme', theme);
  }, [theme]);

  // Apply language and RTL/LTR direction
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');
    localStorage.setItem('tainaati_lang', lang);
  }, [lang]);

  // Persist saved jobs
  useEffect(() => {
    localStorage.setItem('tainaati_saved_jobs', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ur' : 'en');
  };

  const handleToggleSave = (job) => {
    if (savedJobIds.includes(job.id)) {
      setSavedJobIds(savedJobIds.filter(id => id !== job.id));
    } else {
      setSavedJobIds([...savedJobIds, job.id]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All Cities');
    setSelectedProvince('All Pakistan');
    setSelectedCategory('all');
    setSelectedBps('All BPS Scales');
    setSelectedQualification('All Qualifications');
    setUrgentOnly(false);
  };

  const handleAddEmployerJob = (newJob) => {
    setJobsList([newJob, ...jobsList]);
  };

  // WhatsApp Share Handler
  const handleShareWhatsApp = (job) => {
    const text = `📢 *Job Alert on Tainaati*\n\n📌 *${job.title}*\n🏢 *${job.department || job.company}*\n📍 Location: ${job.city}\n⏳ Last Date: ${job.lastDate}\n\n🔗 View details & verify online:\n${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Facebook Share Handler
  const handleShareFacebook = (job) => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, '_blank');
  };

  // Filter logic
  const filteredJobs = jobsList.filter((job) => {
    if (currentTab === 'govt' && job.type !== 'govt') return false;
    if (currentTab === 'private' && job.type !== 'private') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      if (q === 'urgent') {
        if (!job.urgent) return false;
      } else {
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesDept = (job.department || '').toLowerCase().includes(q) || (job.company || '').toLowerCase().includes(q);
        const matchesCategory = (job.category || '').toLowerCase().includes(q);
        const matchesCity = job.city.toLowerCase().includes(q);
        const matchesBps = (job.bpsScale || '').toLowerCase().includes(q);
        const matchesQual = (job.qualification || '').toLowerCase().includes(q);

        if (!matchesTitle && !matchesDept && !matchesCategory && !matchesCity && !matchesBps && !matchesQual) {
          return false;
        }
      }
    }

    if (selectedCity !== 'All Cities' && !job.city.toLowerCase().includes(selectedCity.toLowerCase())) {
      return false;
    }

    if (selectedProvince !== 'All Pakistan' && job.province !== selectedProvince) {
      return false;
    }

    if (selectedCategory !== 'all') {
      if (job.category !== selectedCategory && job.agency !== selectedCategory) {
        return false;
      }
    }

    if (selectedBps !== 'All BPS Scales' && job.type === 'govt') {
      if (selectedBps === 'BPS-07 to BPS-11' && !['BPS-07', 'BPS-09', 'BPS-11'].includes(job.bpsScale)) return false;
      if (selectedBps === 'BPS-14' && job.bpsScale !== 'BPS-14') return false;
      if (selectedBps === 'BPS-16' && job.bpsScale !== 'BPS-16') return false;
      if (selectedBps === 'BPS-17' && job.bpsScale !== 'BPS-17') return false;
      if (selectedBps === 'BPS-18' && job.bpsScale !== 'BPS-18') return false;
      if (selectedBps === 'BPS-19+' && !['BPS-19', 'BPS-20', 'BPS-21'].includes(job.bpsScale)) return false;
    }

    if (selectedQualification !== 'All Qualifications') {
      if (selectedQualification === 'MBBS / Medical' && !job.qualification.includes('MBBS')) return false;
      if (selectedQualification === 'Engineering (PEC)' && !job.qualification.includes('Engineering')) return false;
      if (selectedQualification === 'Graduation / BS (16 Years)' && !job.qualification.includes('16 Years') && !job.qualification.includes('BS')) return false;
      if (selectedQualification === 'Master\'s / M.Phil (18 Years)' && !job.qualification.includes('Masters') && !job.qualification.includes('MS')) return false;
    }

    if (urgentOnly && !job.urgent) {
      return false;
    }

    return true;
  });

  return (
    <div className={`app-container ${lang === 'ur' ? 'font-urdu' : ''}`}>
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        theme={theme}
        toggleTheme={toggleTheme}
        lang={lang}
        toggleLanguage={toggleLanguage}
        savedCount={savedJobIds.length}
        onOpenSearch={() => setQuickSearchOpen(true)}
      />

      <main className="main-content">
        {/* VIEW 1: HOME & LISTINGS */}
        {(currentTab === 'all' || currentTab === 'govt' || currentTab === 'private') && (
          <>
            {currentTab === 'all' && (
              <HeroSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                jobs={jobsList}
                examSchedules={EXAM_SCHEDULES}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
                onJobClick={(job) => setSelectedJob(job)}
                onSwitchTab={(tab) => setCurrentTab(tab)}
              />
            )}

            <div className="container-xl listings-layout-wrapper" id="listings-section">
              <div className="desktop-sidebar-column">
                <FilterSidebar
                  activeType={currentTab}
                  setActiveType={(type) => setCurrentTab(type)}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedProvince={selectedProvince}
                  setSelectedProvince={setSelectedProvince}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  selectedBps={selectedBps}
                  setSelectedBps={setSelectedBps}
                  selectedQualification={selectedQualification}
                  setSelectedQualification={setSelectedQualification}
                  urgentOnly={urgentOnly}
                  setUrgentOnly={setUrgentOnly}
                  onResetFilters={handleResetFilters}
                  totalResultsCount={filteredJobs.length}
                />
              </div>

              <div className="listings-column">
                <JobListings
                  jobs={filteredJobs}
                  activeType={currentTab}
                  setActiveType={(type) => setCurrentTab(type)}
                  onSelectJob={(job) => setSelectedJob(job)}
                  savedJobIds={savedJobIds}
                  onToggleSave={handleToggleSave}
                  onShareWhatsApp={handleShareWhatsApp}
                  onShareFacebook={handleShareFacebook}
                  onOpenMobileFilter={() => setMobileFilterOpen(true)}
                  onResetFilters={handleResetFilters}
                />
              </div>
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFilterOpen && (
              <div className="modal-overlay mobile-filter-modal-overlay" onClick={() => setMobileFilterOpen(false)}>
                <div className="mobile-filter-drawer-card" onClick={(e) => e.stopPropagation()}>
                  <FilterSidebar
                    activeType={currentTab}
                    setActiveType={(type) => setCurrentTab(type)}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedProvince={selectedProvince}
                    setSelectedProvince={setSelectedProvince}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    selectedBps={selectedBps}
                    setSelectedBps={setSelectedBps}
                    selectedQualification={selectedQualification}
                    setSelectedQualification={setSelectedQualification}
                    urgentOnly={urgentOnly}
                    setUrgentOnly={setUrgentOnly}
                    onResetFilters={handleResetFilters}
                    totalResultsCount={filteredJobs.length}
                    onCloseMobileFilter={() => setMobileFilterOpen(false)}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* VIEW 2: TEST PREPARATION & MCQS */}
        {currentTab === 'test-prep' && (
          <TestPrepHub onSwitchTab={(tab) => setCurrentTab(tab)} />
        )}

        {/* VIEW 3: EXAM CALENDAR */}
        {currentTab === 'exams' && (
          <ExamCalendar onSwitchTab={(tab) => setCurrentTab(tab)} />
        )}

        {/* VIEW 4: ATS CV BUILDER */}
        {currentTab === 'cv-builder' && (
          <CvBuilder />
        )}

        {/* VIEW 5: VERIFIED EMAIL ALERTS */}
        {currentTab === 'alerts' && (
          <AlertsManager />
        )}

        {/* VIEW 6: EMPLOYER PORTAL */}
        {currentTab === 'employer' && (
          <EmployerPortal onJobCreated={handleAddEmployerJob} />
        )}

        {/* VIEW 7: SAVED JOBS TRACKER */}
        {currentTab === 'saved' && (
          <SavedJobs
            savedJobIds={savedJobIds}
            allJobs={jobsList}
            onSelectJob={(job) => setSelectedJob(job)}
            onToggleSave={handleToggleSave}
            onSwitchTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {/* VIEW 8: CITY LANDING PAGES */}
        {currentTab.startsWith('city-') && (
          <CityLandingPage
            cityKey={currentTab.replace('city-', '')}
            allJobs={jobsList}
            onSelectJob={(job) => setSelectedJob(job)}
            savedJobIds={savedJobIds}
            onToggleSave={handleToggleSave}
            onShareWhatsApp={handleShareWhatsApp}
            onShareFacebook={handleShareFacebook}
            onBack={() => setCurrentTab('all')}
          />
        )}

        {/* VIEW 9: AGENCY LANDING PAGES */}
        {currentTab.startsWith('agency-') && (
          <AgencyLandingPage
            agencyKey={currentTab.replace('agency-', '')}
            allJobs={jobsList}
            onSelectJob={(job) => setSelectedJob(job)}
            savedJobIds={savedJobIds}
            onToggleSave={handleToggleSave}
            onShareWhatsApp={handleShareWhatsApp}
            onShareFacebook={handleShareFacebook}
          />
        )}

        {/* VIEW 10: INTERNAL ADMIN & PIPELINE DASHBOARD */}
        {currentTab === 'admin' && (
          <AdminPipelineDashboard 
            jobs={jobsList} 
            onUpdateJobs={(updated) => setJobsList(updated)} 
          />
        )}
      </main>

      {/* Quick Search Modal (Ctrl+K) */}
      <QuickSearchModal
        isOpen={quickSearchOpen}
        onClose={() => setQuickSearchOpen(false)}
        jobs={jobsList}
        onSelectJob={(job) => setSelectedJob(job)}
        onSwitchTab={(tab) => setCurrentTab(tab)}
      />

      {/* Job Detail Modal with JobPosting JSON-LD */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          allJobs={jobsList}
          onSelectJob={(job) => setSelectedJob(job)}
          isSaved={savedJobIds.includes(selectedJob.id)}
          onToggleSave={handleToggleSave}
          onShareWhatsApp={handleShareWhatsApp}
          onShareFacebook={handleShareFacebook}
        />
      )}

      {/* Portal Footer */}
      <Footer onSwitchTab={(tab) => setCurrentTab(tab)} />
    </div>
  );
}
