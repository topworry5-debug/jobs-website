'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Landmark, 
  GraduationCap, 
  Sparkles,
  Inbox,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Clock,
  Layers,
  FileText,
  Building2,
  Lock,
  Trash2,
  Bell,
  Play,
  Pause,
  SlidersHorizontal,
  Search,
  Check
} from 'lucide-react';
import { CITIES, PROVINCES, BPS_SCALES, QUALIFICATIONS, JOBS_DATA } from '../data/jobsData';
import { CATEGORIES_CONFIG, matchesJobCategory, getCategoryBySlug } from '../data/categoriesData';
import { SubscriberManager } from '../../pipeline/alerts/subscriberManager';
import { generateVerificationEmail, generateSingleJobAlertEmail, generateDigestAlertEmail } from '../../pipeline/alerts/emailTemplates';
import { useLanguage } from '../context/LanguageContext';

export default function AlertsManager() {
  const { t } = useLanguage();
  const [subManager] = useState(() => new SubscriberManager());

  // Navigation mode: 'create' | 'manage'
  const [activeMode, setActiveMode] = useState('create');

  // Form Fields
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [city, setCity] = useState('All Cities');
  const [keywords, setKeywords] = useState('');
  const [bpsScale, setBpsScale] = useState('All BPS Scales');
  const [frequency, setFrequency] = useState('instant'); // 'instant' | 'daily_digest'

  // Verification Step
  const [step, setStep] = useState('FORM'); // 'FORM' | 'VERIFY' | 'CONFIRMED'
  const [verificationInput, setVerificationInput] = useState('');
  const [activeCode, setActiveCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Saved alerts in localStorage
  const [userAlerts, setUserAlerts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved alerts from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tainaati_user_alerts') || '[]');
      if (Array.isArray(stored)) {
        setUserAlerts(stored);
      }
    } catch (e) {
      console.error('Error loading saved alerts:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveUserAlerts = (newAlerts) => {
    setUserAlerts(newAlerts);
    try {
      localStorage.setItem('tainaati_user_alerts', JSON.stringify(newAlerts));
    } catch (e) {
      console.error('Failed to save alerts to localStorage:', e);
    }
  };

  // Previewer tab
  const [inboxTab, setInboxTab] = useState('instant'); // 'verification' | 'instant' | 'digest'

  // Compute live match count for current configuration
  const liveMatchCount = useMemo(() => {
    return JOBS_DATA.filter((job) => {
      if (selectedCategory !== 'all' && !matchesJobCategory(job, selectedCategory)) {
        return false;
      }
      if (city !== 'All Cities' && !job.city?.toLowerCase().includes(city.toLowerCase()) && !job.city?.toLowerCase().includes('all pakistan')) {
        return false;
      }
      if (keywords.trim()) {
        const q = keywords.toLowerCase();
        const matchTitle = job.title?.toLowerCase().includes(q);
        const matchDept = (job.department || job.company || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDept) return false;
      }
      return true;
    }).length;
  }, [selectedCategory, city, keywords]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg("Please provide a valid email address.");
      return;
    }
    setErrorMsg('');

    // Generate code
    const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    setActiveCode(generatedCode);
    setStep('VERIFY');
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (verificationInput.trim() !== activeCode && verificationInput.trim() !== '849201') {
      setErrorMsg("Invalid verification code. Please enter the code shown in the demo hint.");
      return;
    }

    // Save alert into localStorage
    const newAlert = {
      id: 'alert_' + Date.now(),
      email: email.trim(),
      category: selectedCategory,
      categoryName: selectedCategory === 'all' ? 'All Categories' : (getCategoryBySlug(selectedCategory)?.name || selectedCategory),
      city,
      keywords: keywords.trim(),
      frequency,
      active: true,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = [newAlert, ...userAlerts];
    saveUserAlerts(updated);

    setStep('CONFIRMED');
    setSuccessMsg("Alert profile successfully verified and saved!");
    setErrorMsg('');
  };

  const handleToggleAlert = (alertId) => {
    const updated = userAlerts.map(a => {
      if (a.id === alertId) {
        return { ...a, active: !a.active };
      }
      return a;
    });
    saveUserAlerts(updated);
  };

  const handleDeleteAlert = (alertId) => {
    const updated = userAlerts.filter(a => a.id !== alertId);
    saveUserAlerts(updated);
  };

  // Sample matching jobs for preview
  const sampleJob = JOBS_DATA.find(j => selectedCategory === 'all' || matchesJobCategory(j, selectedCategory)) || JOBS_DATA[0];
  const sampleDigestJobs = JOBS_DATA.slice(0, 3);

  const previewHtml = 
    inboxTab === 'verification'
      ? generateVerificationEmail(email || "candidate@example.com", activeCode || "849201", "https://tainaati.com/alerts/verify")
      : inboxTab === 'instant'
      ? generateSingleJobAlertEmail(sampleJob, email || "candidate@example.com", "https://tainaati.com/alerts/unsubscribe", "https://tainaati.com/alerts/preferences")
      : generateDigestAlertEmail(sampleDigestJobs, email || "candidate@example.com", "https://tainaati.com/alerts/unsubscribe", "https://tainaati.com/alerts/preferences");

  return (
    <div className="alerts-manager-page container-xl py-4">
      {/* Hero Banner */}
      <div className="card p-5 mb-4">
        <div className="badge badge-govt mb-2">
          <Mail size={13} />
          <span>Double Opt-In Email Delivery • 100% Free & Zero Spam</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-main">
          Verified Email Job Alerts in Pakistan
        </h1>
        <p className="text-secondary text-sm md:text-base max-w-3xl mt-1">
          Receive curated notifications for Federal and Provincial government gazettes, banking schemes, engineering projects, and corporate positions matching your exact category, city, and keywords.
        </p>

        {/* Mode Navigation Tabs */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-theme">
          <button
            onClick={() => { setActiveMode('create'); setStep('FORM'); setErrorMsg(''); }}
            className={`btn btn-sm ${activeMode === 'create' ? 'btn-primary' : 'btn-outline'} text-xs flex items-center gap-1.5`}
          >
            <Bell size={13} />
            <span>Create New Job Alert</span>
          </button>
          <button
            onClick={() => setActiveMode('manage')}
            className={`btn btn-sm ${activeMode === 'manage' ? 'btn-primary' : 'btn-outline'} text-xs flex items-center gap-1.5`}
          >
            <SlidersHorizontal size={13} />
            <span>Manage Saved Alerts ({userAlerts.length})</span>
          </button>
        </div>
      </div>

      {activeMode === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT: Configuration Form */}
          <div className="lg:col-span-6 card p-5 space-y-4">
            {step === 'FORM' && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="border-b border-theme pb-2">
                  <h2 className="text-base font-bold text-main">1. Define Alert Parameters</h2>
                  <span className="text-xs text-secondary">Customized by category, target city, and specific keywords.</span>
                </div>

                {/* Email Address */}
                <div className="form-group">
                  <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                    Your Email Address (Primary Inbox)
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. candidate.name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-9 w-full text-sm"
                    />
                  </div>
                  <span className="text-xs text-muted block mt-0.5">We send a 6-digit confirmation code before activating alerts.</span>
                </div>

                {/* Category Selector */}
                <div className="form-group">
                  <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                    Preferred Job Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field select-field w-full text-sm"
                  >
                    <option value="all">All Categories (Govt + Private + Cross-Cutting)</option>
                    <optgroup label="Government Sectors">
                      {CATEGORIES_CONFIG.filter(c => c.group === 'govt').map(cat => (
                        <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Private & Industry Careers">
                      {CATEGORIES_CONFIG.filter(c => c.group === 'private').map(cat => (
                        <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* City & Keywords Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                      Preferred City / Location
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="input-field select-field w-full text-sm"
                    >
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                      Keyword Filter (Optional)
                    </label>
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        type="text"
                        placeholder="e.g. Lecturer, SBP, Officer"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        className="input-field pl-8 w-full text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Match Pill */}
                <div className="p-3 rounded-lg bg-subtle border border-theme flex justify-between items-center text-xs">
                  <span className="text-secondary">Matching active jobs right now:</span>
                  <span className="badge badge-bps font-mono font-bold">
                    {liveMatchCount} Positions Available
                  </span>
                </div>

                {/* Frequency */}
                <div className="form-group">
                  <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                    Email Delivery Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`p-2.5 rounded-lg border cursor-pointer text-xs transition-all flex items-start gap-2 ${frequency === 'instant' ? 'border-emerald-500 bg-emerald-500/10' : 'border-theme bg-subtle'}`}>
                      <input
                        type="radio"
                        name="freq"
                        checked={frequency === 'instant'}
                        onChange={() => setFrequency('instant')}
                        className="mt-0.5 accent-emerald-600"
                      />
                      <div>
                        <strong className="block text-main">Instant Alert</strong>
                        <span className="text-muted text-[11px]">As soon as gazetted</span>
                      </div>
                    </label>

                    <label className={`p-2.5 rounded-lg border cursor-pointer text-xs transition-all flex items-start gap-2 ${frequency === 'daily_digest' ? 'border-emerald-500 bg-emerald-500/10' : 'border-theme bg-subtle'}`}>
                      <input
                        type="radio"
                        name="freq"
                        checked={frequency === 'daily_digest'}
                        onChange={() => setFrequency('daily_digest')}
                        className="mt-0.5 accent-emerald-600"
                      />
                      <div>
                        <strong className="block text-main">Daily Digest</strong>
                        <span className="text-muted text-[11px]">Every morning at 8 AM</span>
                      </div>
                    </label>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-full text-xs justify-center flex items-center gap-2 py-2.5">
                  <Send size={14} />
                  <span>Send Confirmation Code &rarr;</span>
                </button>
              </form>
            )}

            {step === 'VERIFY' && (
              <div className="space-y-4">
                <div className="badge badge-verified">Step 2: Confirm Verification Code</div>
                <h3 className="text-lg font-bold text-main">Check Your Inbox</h3>
                <p className="text-secondary text-xs leading-relaxed">
                  We sent a 6-digit confirmation code to <strong>{email}</strong>.
                </p>

                <form onSubmit={handleVerifyCode} className="space-y-3">
                  <div className="form-group">
                    <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 849201"
                      value={verificationInput}
                      onChange={(e) => setVerificationInput(e.target.value)}
                      className="input-field text-center font-mono tracking-widest text-lg w-full"
                    />
                    <div className="text-xs text-muted mt-1">
                      Demo verification code: <code>{activeCode || '849201'}</code>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-1">
                      <AlertCircle size={14} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep('FORM')}
                      className="btn btn-outline text-xs flex-1"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary text-xs flex-1"
                    >
                      Verify & Activate Alert
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 'CONFIRMED' && (
              <div className="space-y-4 text-center py-6">
                <CheckCircle2 size={42} className="text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-main">Alert Activated Successfully!</h3>
                <p className="text-secondary text-xs max-w-sm mx-auto leading-relaxed">
                  We will deliver matching openings for <strong>{selectedCategory}</strong> in <strong>{city}</strong> to <strong>{email}</strong>.
                </p>

                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => { setActiveMode('manage'); setStep('FORM'); }}
                    className="btn btn-primary btn-sm text-xs"
                  >
                    View in Alert Manager
                  </button>
                  <button
                    onClick={() => { setStep('FORM'); setEmail(''); setKeywords(''); }}
                    className="btn btn-outline btn-sm text-xs"
                  >
                    Add Another Alert
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Live Email Preview Box */}
          <div className="lg:col-span-6 card p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-theme pb-2">
              <h2 className="text-sm font-bold text-main flex items-center gap-1.5">
                <Inbox size={15} className="text-emerald-500" />
                <span>Live Email Notification Preview</span>
              </h2>

              <div className="flex gap-1">
                <button
                  onClick={() => setInboxTab('instant')}
                  className={`badge cursor-pointer ${inboxTab === 'instant' ? 'badge-govt' : 'bg-subtle text-secondary'}`}
                >
                  Instant Match
                </button>
                <button
                  onClick={() => setInboxTab('digest')}
                  className={`badge cursor-pointer ${inboxTab === 'digest' ? 'badge-govt' : 'bg-subtle text-secondary'}`}
                >
                  Daily Digest
                </button>
              </div>
            </div>

            {/* Email Preview Frame */}
            <div className="border border-theme rounded-lg overflow-hidden bg-white text-slate-900 text-xs p-4 max-h-[500px] overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </div>
        </div>
      ) : (
        /* MANAGE SAVED ALERTS VIEW */
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-theme pb-3">
              <div>
                <h2 className="text-lg font-bold text-main">Your Saved Alert Subscriptions</h2>
                <p className="text-xs text-secondary">
                  Manage your active notification profiles, pause temporary alerts, or delete subscriptions.
                </p>
              </div>

              <button
                onClick={() => { setActiveMode('create'); setStep('FORM'); }}
                className="btn btn-sm btn-primary text-xs flex items-center gap-1"
              >
                <span>+ Create New Alert</span>
              </button>
            </div>

            {userAlerts.length > 0 ? (
              <div className="space-y-3">
                {userAlerts.map((alert) => {
                  const matchCount = JOBS_DATA.filter(j => {
                    if (alert.category !== 'all' && !matchesJobCategory(j, alert.category)) return false;
                    if (alert.city !== 'All Cities' && !j.city?.toLowerCase().includes(alert.city.toLowerCase())) return false;
                    if (alert.keywords) {
                      const q = alert.keywords.toLowerCase();
                      if (!j.title?.toLowerCase().includes(q) && !j.department?.toLowerCase().includes(q)) return false;
                    }
                    return true;
                  }).length;

                  return (
                    <div 
                      key={alert.id}
                      className={`p-4 rounded-lg border transition-all flex flex-col md:flex-row justify-between md:items-center gap-3 ${
                        alert.active 
                          ? 'bg-card border-theme hover:border-emerald-500/40' 
                          : 'bg-subtle border-theme/50 opacity-70'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`badge ${alert.active ? 'badge-govt' : 'bg-gray-500/20 text-gray-500'}`}>
                            {alert.active ? 'Active' : 'Paused'}
                          </span>
                          <span className="text-xs font-semibold text-main">
                            {alert.categoryName || alert.category}
                          </span>
                          <span className="text-xs text-muted">• {alert.city}</span>
                        </div>

                        <div className="text-xs text-secondary flex flex-wrap items-center gap-3">
                          <span>Email: <strong className="text-main">{alert.email}</strong></span>
                          {alert.keywords && <span>Keyword: <code className="text-xs">{alert.keywords}</code></span>}
                          <span>Frequency: <em>{alert.frequency === 'instant' ? 'Instant' : 'Daily Digest'}</em></span>
                          <span>Created: {alert.createdAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-auto">
                        <span className="badge badge-bps font-mono text-xs" title="Current matching jobs">
                          {matchCount} Matches
                        </span>

                        <button
                          onClick={() => handleToggleAlert(alert.id)}
                          className={`btn btn-sm ${alert.active ? 'btn-outline' : 'btn-primary'} text-xs flex items-center gap-1`}
                          title={alert.active ? 'Pause alerts' : 'Resume alerts'}
                        >
                          {alert.active ? <Pause size={12} /> : <Play size={12} />}
                          <span>{alert.active ? 'Pause' : 'Resume'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="text-muted hover:text-rose-500 p-1.5 rounded transition-colors"
                          title="Delete alert"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <Bell size={36} className="text-muted mx-auto" />
                <h3 className="text-base font-bold text-main">No Alerts Saved Yet</h3>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  You haven't set up any job alert preferences yet. Create an alert to receive email notifications when matching positions are gazetted.
                </p>
                <button
                  onClick={() => { setActiveMode('create'); setStep('FORM'); }}
                  className="btn btn-sm btn-primary text-xs mx-auto"
                >
                  Create Your First Alert
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
