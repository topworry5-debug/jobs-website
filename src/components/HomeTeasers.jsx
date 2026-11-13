'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  BookOpen, 
  Bell, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { BASE_BLOG_ARTICLES } from '../data/blogData';

export default function HomeTeasers({ examSchedules = [] }) {
  const [alertEmail, setAlertEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Filter exams that have real dates
  const today = new Date().toISOString().split('T')[0];
  const upcomingExams = (examSchedules || [])
    .filter(e => e.examDate && e.examDate >= today)
    .slice(0, 3);

  // Filter published blog articles (exclude any drafts or needs-human-review)
  const publishedGuides = (BASE_BLOG_ARTICLES || [])
    .filter(g => g.status !== 'needs-human-review' && g.status !== 'draft')
    .slice(0, 3);

  const handleAlertSubmit = (e) => {
    e.preventDefault();
    if (!alertEmail.trim()) return;
    try {
      const stored = JSON.parse(localStorage.getItem('tainaati_alerts') || '[]');
      stored.push({
        email: alertEmail.trim(),
        category: 'all',
        city: 'All Cities',
        date: new Date().toISOString()
      });
      localStorage.setItem('tainaati_alerts', JSON.stringify(stored));
      setSubscribed(true);
    } catch (err) {
      setSubscribed(true);
    }
  };

  return (
    <div className="home-teasers-container">
      {/* 1. Exam Calendar Teaser (Only if it has real upcoming dates) */}
      {upcomingExams.length > 0 && (
        <section className="teaser-card teaser-card-exams">
          <div className="teaser-card-header">
            <div className="teaser-header-left">
              <div className="teaser-icon-box">
                <Calendar size={18} className="text-brand-primary" />
              </div>
              <div>
                <h3 className="teaser-title">Upcoming Exam Calendar & Schedules</h3>
                <p className="teaser-desc">
                  Official screening test dates and roll number slip releases directly from testing agencies.
                </p>
              </div>
            </div>
            <Link href="/exams" className="teaser-cta-link">
              <span>View Full Calendar</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="teaser-exams-grid">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="teaser-exam-item">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="teaser-agency-badge">{exam.agency}</span>
                  <span className="teaser-exam-date tabular-nums">
                    <Clock size={11} className="inline mr-1" />
                    {exam.examDate}
                  </span>
                </div>
                <div className="teaser-exam-item-title">{exam.title}</div>
                <div className="teaser-exam-item-target">{exam.targetPosts}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Test Prep Teaser */}
      <section className="teaser-card teaser-card-prep">
        <div className="teaser-card-header">
          <div className="teaser-header-left">
            <div className="teaser-icon-box">
              <BookOpen size={18} className="text-brand-primary" />
            </div>
            <div>
              <h3 className="teaser-title">Test Preparation & Past Papers</h3>
              <p className="teaser-desc">
                Discipline-wise MCQs, syllabus breakdowns, and past paper screening patterns for FPSC, PPSC, and NTS tests.
              </p>
            </div>
          </div>
          <Link href="/test-prep" className="teaser-cta-link">
            <span>Explore Test Prep</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 3. Job Alerts Signup */}
      <section className="teaser-card teaser-card-alerts">
        <div className="teaser-alerts-inner">
          <div className="teaser-alerts-text">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="teaser-icon-box">
                <Bell size={18} className="text-brand-primary" />
              </div>
              <h3 className="teaser-title">Government Job Alerts</h3>
            </div>
            <p className="teaser-desc">
              Receive notifications when new official gazette vacancies and examination schedules are announced.
            </p>
          </div>

          <form onSubmit={handleAlertSubmit} className="teaser-alerts-form">
            <input
              type="email"
              required
              value={alertEmail}
              onChange={(e) => setAlertEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="teaser-alerts-input"
              disabled={subscribed}
              aria-label="Email address for job alerts"
            />
            <button
              type="submit"
              disabled={subscribed}
              className="teaser-alerts-btn"
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
        {subscribed && (
          <div className="teaser-alerts-success">
            <CheckCircle2 size={14} className="text-brand-primary flex-shrink-0" />
            <span>You have been subscribed to job notifications.</span>
          </div>
        )}
      </section>

      {/* 4. Latest Guides (Only published guides) */}
      {publishedGuides.length > 0 && (
        <section className="teaser-section-guides">
          <div className="teaser-section-heading-row">
            <div>
              <h3 className="teaser-title">Recruitment & Preparation Guides</h3>
              <p className="teaser-desc">
                Step-by-step application walkthroughs, syllabus guides, and service rules.
              </p>
            </div>
            <Link href="/blog" className="teaser-cta-link">
              <span>View All Guides</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="teaser-guides-grid">
            {publishedGuides.map((guide) => (
              <Link 
                key={guide.slug} 
                href={`/blog/${guide.slug}`} 
                className="teaser-guide-card"
              >
                <div className="teaser-guide-cluster">
                  {guide.clusterLabel || 'Guide'}
                </div>
                <h4 className="teaser-guide-title">
                  {guide.title}
                </h4>
                <div className="teaser-guide-footer">
                  <span className="teaser-guide-readtime tabular-nums">
                    <Clock size={12} className="inline mr-1" />
                    {guide.readTime}
                  </span>
                  <span className="teaser-guide-read-link">
                    Read Guide →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
