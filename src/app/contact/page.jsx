'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare, ShieldCheck, HelpCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'General Support',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [statusMsg, setStatusMsg] = useState('');
  const [ticketId, setTicketId] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setStatusMsg(data.message || 'Thank you for reaching out! We have received your inquiry.');
        setTicketId(data.ticketId || '');
        setFormData({
          name: '',
          email: '',
          department: 'General Support',
          subject: '',
          message: ''
        });
      } else {
        setStatus('error');
        setStatusMsg(data.error || 'Failed to submit contact message. Please try again or email us directly.');
      }
    } catch (err) {
      setStatus('error');
      setStatusMsg('Network error connecting to support endpoint. Please email contact@tainaati.com directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xl py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header Hero */}
        <div className="card p-6 md:p-8 mb-8 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-verified">
              <MessageSquare size={14} />
              <span>Direct Support & Inquiries</span>
            </span>
            <span className="text-xs text-muted">Response within 24 Hours</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-3">
            Contact Tainaati
          </h1>
          <p className="text-secondary text-sm md:text-base leading-relaxed">
            Have a question about a gazetted job listing, noticed a correction on an advertisement, or need technical support? 
            Reach out through the form below or contact our editorial desks directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Direct Inboxes */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-bold text-sm text-primary mb-3 flex items-center gap-2">
                <Mail size={16} className="text-emerald-500" />
                Monitored Email Inboxes
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-semibold text-primary">General Inquiries & Support</div>
                  <a href="mailto:contact@tainaati.com" className="text-emerald-500 underline font-medium">contact@tainaati.com</a>
                </div>
                <div>
                  <div className="font-semibold text-primary">Gazette Corrections & Updates</div>
                  <a href="mailto:corrections@tainaati.com" className="text-emerald-500 underline font-medium">corrections@tainaati.com</a>
                </div>
                <div>
                  <div className="font-semibold text-primary">Privacy & Data Requests</div>
                  <a href="mailto:privacy@tainaati.com" className="text-emerald-500 underline font-medium">privacy@tainaati.com</a>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-bold text-sm text-primary mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                Editorial Guarantee
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                If you are a representative of a government commission (FPSC, PPSC, SPSC, KPPSC, NTS) or an employer wishing to update a listing, please flag the Case/Advt Number in your message.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="md:col-span-2">
            <div className="card p-6">
              <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <Send size={16} className="text-emerald-500" />
                Send a Message
              </h2>

              {status === 'success' && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mb-6 text-sm flex items-start gap-3">
                  <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">{statusMsg}</div>
                    {ticketId && <div className="text-xs text-secondary mt-1">Ticket Reference ID: <span className="font-mono">{ticketId}</span></div>}
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 mb-6 text-sm flex items-start gap-3">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div className="font-medium">{statusMsg}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-primary mb-1">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Muhammad Ali"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field w-full text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-primary mb-1">
                      Your Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. candidate@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field w-full text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="department" className="block text-xs font-semibold text-primary mb-1">
                      Department / Reason
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="input-field w-full text-sm"
                    >
                      <option value="General Support">General Support</option>
                      <option value="Gazette Correction">Gazette Listing Correction</option>
                      <option value="Employer Inquiry">Tech Employer / Recruiter</option>
                      <option value="Privacy / Data">Privacy & Data Request</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-semibold text-primary mb-1">
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="e.g. Question on PPSC Tehsildar syllabus"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-field w-full text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-primary mb-1">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Describe your inquiry or correction in detail..."
                    value={formData.message}
                    onChange={handleChange}
                    className="input-field w-full text-sm resize-y"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-muted">
                    We never share your email address.
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-sm"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
