'use client';

import React, { useState } from 'react';
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
  Lock
} from 'lucide-react';
import { CITIES, PROVINCES, BPS_SCALES, QUALIFICATIONS } from '../data/jobsData';
import { SubscriberManager } from '../../pipeline/alerts/subscriberManager';
import { generateVerificationEmail, generateSingleJobAlertEmail, generateDigestAlertEmail } from '../../pipeline/alerts/emailTemplates';

export default function AlertsManager() {
  const [subManager] = useState(() => new SubscriberManager());
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('All Cities');
  const [sector, setSector] = useState('all');
  const [bpsScale, setBpsScale] = useState('All BPS Scales');
  const [qualification, setQualification] = useState('All Qualifications');
  const [frequency, setFrequency] = useState('instant'); // 'instant' | 'daily_digest'

  // Verification Step
  const [step, setStep] = useState('FORM'); // 'FORM' | 'VERIFY' | 'CONFIRMED'
  const [verificationInput, setVerificationInput] = useState('');
  const [activeCode, setActiveCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Inbox & Email Previewer State
  const [inboxTab, setInboxTab] = useState('verification'); // 'verification' | 'instant' | 'digest'

  const sampleJob = {
    id: "govt-ppsc-live-1",
    type: "govt",
    title: "Senior Registrar Oncology - BPS-17",
    department: "Specialized Healthcare & Medical Education Department Punjab",
    city: "Lahore / All Punjab Districts",
    qualification: "MBBS / FCPS in Oncology or relevant specialty",
    lastDate: "2026-09-22",
    vacancies: 6,
    bpsScale: "BPS-17",
    officialSourceLabel: "PPSC Official Consolidated Advt No. 08/2026",
    officialUrl: "https://www.ppsc.gop.pk/Jobs.aspx",
    description: "Punjab Public Service Commission invites online applications for 6 posts of Senior Registrar Oncology across tertiary hospitals in Punjab.",
    lastVerifiedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  };

  const sampleDigestJobs = [
    sampleJob,
    {
      id: "govt-nts-live-1",
      type: "govt",
      title: "District & Session Judge, Tharparkar (Career Opportunities)",
      department: "District & Session Court Tharparkar / High Court of Sindh",
      city: "Tharparkar, Sindh",
      qualification: "LL.B / LL.M with Bar Council Registration",
      lastDate: "2026-09-11",
      officialUrl: "https://nts.org.pk",
      agency: "NTS"
    },
    {
      id: "govt-fpsc-live-1",
      type: "govt",
      title: "CSS Competitive Examination Preliminary Test (MPT) - BPS-17",
      department: "Federal Public Service Commission (FPSC)",
      city: "Islamabad & All Pakistan",
      qualification: "Bachelor's Degree (14 or 16 Years)",
      lastDate: "2026-09-30",
      bpsScale: "BPS-17",
      officialUrl: "https://online.fpsc.gov.pk",
      agency: "FPSC"
    }
  ];

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg("Please provide a valid email address.");
      return;
    }
    setErrorMsg('');
    const subRecord = subManager.registerSubscriber({
      email,
      sector,
      city,
      bpsScale,
      qualification,
      frequency
    });
    setActiveCode(subRecord.verificationCode);
    setStep('VERIFY');
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    const res = subManager.verifyEmail(email, verificationInput);
    if (res.success) {
      setStep('CONFIRMED');
      setErrorMsg('');
    } else {
      setErrorMsg(res.message);
    }
  };

  // Generate Email HTML Previews
  const currentEmail = email || "candidate@example.com";
  const previewHtml = 
    inboxTab === 'verification'
      ? generateVerificationEmail(currentEmail, activeCode || "849201", "https://rozgar.pk/alerts/verify")
      : inboxTab === 'instant'
      ? generateSingleJobAlertEmail(sampleJob, currentEmail, "https://rozgar.pk/alerts/unsubscribe", "https://rozgar.pk/alerts/preferences")
      : generateDigestAlertEmail(sampleDigestJobs, currentEmail, "https://rozgar.pk/alerts/unsubscribe", "https://rozgar.pk/alerts/preferences");

  return (
    <div className="alerts-manager-page container-xl">
      {/* Hero Banner */}
      <div className="alerts-hero-card card mb-4">
        <div className="badge badge-govt mb-2">
          <Mail size={13} />
          <span>Double Opt-In Email Delivery • 100% Free & Zero Spam</span>
        </div>
        <h1 className="alerts-title">Verified Email Job Alerts in Pakistan</h1>
        <p className="alerts-desc">
          Never miss an FPSC, PPSC, or tech career deadline. Receive matching verified openings delivered straight to your inbox with one-click unsubscribe.
        </p>
      </div>

      <div className="alerts-layout-grid">
        {/* LEFT COLUMN: SUBSCRIPTION & VERIFICATION FORM */}
        <div className="alerts-form-container card">
          {step === 'FORM' && (
            <form onSubmit={handleRegister} className="alerts-form">
              <div className="form-section-header mb-3">
                <h3 className="font-bold text-base">Configure Your Alert Profile</h3>
                <span className="text-secondary text-xs">Customized by sector, city, scale, and qualification.</span>
              </div>

              {/* Email Address Field */}
              <div className="form-group">
                <label>Your Email Address (Primary Inbox)</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    required
                    placeholder="candidate.name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
                <span className="input-hint">We send a 6-digit confirmation code before activating alerts.</span>
              </div>

              {/* Filter Criteria */}
              <div className="grid-2">
                <div className="form-group">
                  <label>Target City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field select-field"
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Job Sector</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="input-field select-field"
                  >
                    <option value="all">All Opportunities (Govt + Tech)</option>
                    <option value="govt">Government & Public Service Commissions</option>
                    <option value="private">Private & High-Growth Tech</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>BPS Scale (Govt Openings)</label>
                  <select
                    value={bpsScale}
                    onChange={(e) => setBpsScale(e.target.value)}
                    className="input-field select-field"
                  >
                    {BPS_SCALES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Qualification Level</label>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="input-field select-field"
                  >
                    {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
              </div>

              {/* Alert Frequency */}
              <div className="form-group">
                <label>Email Delivery Frequency</label>
                <div className="frequency-toggle-group">
                  <label className={`freq-option-card ${frequency === 'instant' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="freq" 
                      checked={frequency === 'instant'} 
                      onChange={() => setFrequency('instant')} 
                    />
                    <div>
                      <strong>Instant Email Alerts</strong>
                      <div className="text-xs text-secondary">Sent within minutes of official publication</div>
                    </div>
                  </label>

                  <label className={`freq-option-card ${frequency === 'daily_digest' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="freq" 
                      checked={frequency === 'daily_digest'} 
                      onChange={() => setFrequency('daily_digest')} 
                    />
                    <div>
                      <strong>Daily Morning Digest (8:00 AM PST)</strong>
                      <div className="text-xs text-secondary">One consolidated email with all matching openings</div>
                    </div>
                  </label>
                </div>
              </div>

              {errorMsg && (
                <div className="alert-error-bar">
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100 mt-3">
                <Send size={16} />
                <span>Send Verification Code &rarr;</span>
              </button>
            </form>
          )}

          {step === 'VERIFY' && (
            <div className="verification-step-box">
              <div className="badge badge-verified mb-2">Step 2 of 2: Confirm Inbox</div>
              <h3 className="text-lg font-bold">Check Your Email</h3>
              <p className="text-secondary text-sm mb-4">
                We sent a 6-digit confirmation code to <strong>{email}</strong>.
              </p>

              <form onSubmit={handleVerifyCode} className="verification-form">
                <div className="form-group">
                  <label>Enter 6-Digit Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 849201"
                    value={verificationInput}
                    onChange={(e) => setVerificationInput(e.target.value)}
                    className="input-field code-input"
                  />
                  <div className="text-xs text-muted mt-1">
                    Tip: Demo verification code is pre-generated as <code>{activeCode}</code>
                  </div>
                </div>

                {errorMsg && (
                  <div className="alert-error-bar mb-3">
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary flex-1">
                    Verify & Activate Alerts
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => setStep('FORM')}
                  >
                    Edit Email
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'CONFIRMED' && (
            <div className="subscription-success-box">
              <CheckCircle2 size={48} className="text-emerald" />
              <h3 className="success-title">Email Alerts Activated!</h3>
              <p className="success-desc">
                Your email <strong>{email}</strong> has been verified. You will receive verified notifications for <strong>{city}</strong> ({frequency === 'daily_digest' ? 'Daily 8:00 AM Digest' : 'Instant Delivery'}).
              </p>

              <div className="security-notice-chip">
                <Lock size={13} />
                <span>Every alert email includes a 1-click instant unsubscribe link.</span>
              </div>

              <button 
                className="btn btn-outline btn-sm mt-3"
                onClick={() => {
                  setStep('FORM');
                  setEmail('');
                  setVerificationInput('');
                }}
              >
                Configure Another Alert
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INBOX & BRANDED HTML EMAIL PREVIEWER */}
        <div className="email-previewer-panel card">
          <div className="previewer-header">
            <div className="inbox-title-row">
              <Inbox size={18} className="text-emerald" />
              <div>
                <strong>Live Inbox Email Preview</strong>
                <div className="text-xs text-secondary">High-deliverability responsive template</div>
              </div>
            </div>

            {/* Template Selector Tabs */}
            <div className="email-tab-pills">
              <button 
                className={`email-tab-pill ${inboxTab === 'verification' ? 'active' : ''}`}
                onClick={() => setInboxTab('verification')}
              >
                Verification Code
              </button>
              <button 
                className={`email-tab-pill ${inboxTab === 'instant' ? 'active' : ''}`}
                onClick={() => setInboxTab('instant')}
              >
                Instant Match
              </button>
              <button 
                className={`email-tab-pill ${inboxTab === 'digest' ? 'active' : ''}`}
                onClick={() => setInboxTab('digest')}
              >
                Daily Digest
              </button>
            </div>
          </div>

          {/* Email IFrame Sandbox */}
          <div className="email-iframe-container">
            <iframe 
              title="Email Template Live Preview"
              srcDoc={previewHtml}
              className="email-render-frame"
            />
          </div>
        </div>
      </div>

      {/* TRANSACTIONAL EMAIL PROVIDER & INFRASTRUCTURE REPORT */}
      <div className="card cost-transparency-card mt-4">
        <div className="cost-card-header">
          <ShieldCheck size={20} className="text-emerald" />
          <h3 className="cost-card-title">Transactional Email Infrastructure & Free Tier Breakdown</h3>
        </div>

        <div className="cost-comparison-grid">
          <div className="cost-col active-channel">
            <div className="cost-badge free">PRIMARY PROVIDER (ZERO-COST FREE TIER)</div>
            <h4 className="channel-heading">Resend API (resend.com)</h4>
            <ul className="cost-bullets">
              <li>• <strong>Free Tier Volume:</strong> 3,000 emails/month (100 emails/day completely free).</li>
              <li>• <strong>Deliverability:</strong> Dedicated high-reputation IP pools with DKIM, SPF, DMARC alignment.</li>
              <li>• <strong>Spam Protection:</strong> Double opt-in confirmation required before dispatching alerts.</li>
              <li>• <strong>Zero Cost:</strong> $0 / month for initial launch phase.</li>
            </ul>
          </div>

          <div className="cost-col">
            <div className="cost-badge paid">SECONDARY HIGH-VOLUME BACKUP</div>
            <h4 className="channel-heading">Brevo Transactional SMTP (brevo.com)</h4>
            <ul className="cost-bullets">
              <li>• <strong>Free Tier Volume:</strong> 300 emails/day = 9,000 emails/month free.</li>
              <li>• <strong>Upgrade Threshold:</strong> Seamlessly activates if monthly subscribers exceed 3,000 alerts.</li>
              <li>• <strong>Legal Compliance:</strong> Automated list cleaning and mandatory RFC-8058 One-Click Unsubscribe headers.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
