'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Bell, 
  FileText, 
  Award, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { EXAM_SCHEDULES } from '../data/examCalendarData';
import { useLanguage } from '../context/LanguageContext';

export default function ExamCalendar() {
  const { t, isRtl } = useLanguage();
  const [selectedAgency, setSelectedAgency] = useState('ALL');
  const [reminderSetIds, setReminderSetIds] = useState([]);
  const [reminderToast, setReminderToast] = useState(null);

  const agencies = ['ALL', 'FPSC', 'PPSC', 'SPSC', 'KPPSC', 'NTS'];

  const filteredExams = selectedAgency === 'ALL' 
    ? EXAM_SCHEDULES 
    : EXAM_SCHEDULES.filter(e => e.agency === selectedAgency);

  const handleSetReminder = (exam) => {
    if (reminderSetIds.includes(exam.id)) {
      setReminderSetIds(reminderSetIds.filter(id => id !== exam.id));
      setReminderToast(`Reminder removed for ${exam.agency} examination`);
    } else {
      setReminderSetIds([...reminderSetIds, exam.id]);
      setReminderToast(`📅 Reminder saved for ${exam.agency} exam on ${exam.examDate}`);
    }
    setTimeout(() => setReminderToast(null), 3000);
  };

  return (
    <div className="exam-calendar-page-container">
      {/* Toast Alert */}
      {reminderToast && (
        <div className="calendar-toast-notification">
          <CheckCircle2 size={16} className="text-emerald" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="exam-calendar-header-card">
        <div className="container-xl">
          <div className="exam-header-content">
            <div className="exam-badge-row">
              <span className="badge badge-govt">
                <ShieldCheck size={13} />
                <span>Central Competitive Schedule</span>
              </span>
              <span className="badge badge-verified">Updated Daily</span>
            </div>

            <h1 className="exam-calendar-title">
              {t.examCalendar.title}
            </h1>
            <p className="exam-calendar-desc">
              {t.examCalendar.subtitle}
            </p>

            {/* Agency Switcher Pills */}
            <div className="agency-pill-cluster">
              <span className="agency-filter-label">{t.examCalendar.filterAgency}:</span>
              <div className="agency-pills-list">
                {agencies.map((agency) => (
                  <button
                    key={agency}
                    className={`agency-pill-btn ${selectedAgency === agency ? 'active' : ''}`}
                    onClick={() => setSelectedAgency(agency)}
                  >
                    {agency === 'ALL' ? 'All Testing Bodies' : agency}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container-xl exam-timeline-section">
        <div className="timeline-grid">
          {filteredExams.map((exam) => {
            const hasReminder = reminderSetIds.includes(exam.id);
            return (
              <div key={exam.id} className="exam-schedule-card card">
                {/* Top Badge & Agency Header */}
                <div className="exam-card-header">
                  <div className="exam-agency-chip">
                    <span className="agency-tag-pill">{exam.agency}</span>
                    <span className="exam-status-tag">{exam.status}</span>
                  </div>

                  <button
                    className={`exam-reminder-btn ${hasReminder ? 'active' : ''}`}
                    onClick={() => handleSetReminder(exam)}
                    title={hasReminder ? "Reminder Active" : "Set Alert"}
                  >
                    <Bell size={15} fill={hasReminder ? "currentColor" : "none"} />
                    <span>{hasReminder ? 'Alert Set' : 'Set Alert'}</span>
                  </button>
                </div>

                {/* Exam Title & Target Posts */}
                <h3 className="exam-card-title">{exam.title}</h3>
                <div className="exam-target-posts">
                  <strong>Target Posts:</strong> {exam.targetPosts}
                </div>

                {/* Date Milestones Grid */}
                <div className="exam-milestones-grid">
                  <div className="milestone-box">
                    <span className="milestone-label">{t.examCalendar.tableAction}</span>
                    <span className="milestone-date text-blue">{exam.slipReleaseDate}</span>
                  </div>

                  <div className="milestone-box exam-day-highlight">
                    <span className="milestone-label">{t.examCalendar.tableDate}</span>
                    <span className="milestone-date text-emerald"><strong>{exam.examDate}</strong></span>
                  </div>

                  <div className="milestone-box">
                    <span className="milestone-label">Expected Result</span>
                    <span className="milestone-date text-muted">{exam.resultExpectedDate}</span>
                  </div>
                </div>

                {/* Centers & Info */}
                <div className="exam-details-meta">
                  <div className="meta-line">
                    <MapPin size={14} className="text-muted" />
                    <span><strong>Exam Centers:</strong> {exam.centers}</span>
                  </div>
                  <div className="meta-line">
                    <AlertCircle size={14} className="text-muted" />
                    <span>{exam.notes}</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="exam-card-footer">
                  <a
                    href={exam.officialPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline exam-portal-btn"
                  >
                    <span>Check {exam.agency} Official Portal</span>
                    <ExternalLink size={14} />
                  </a>

                  <Link 
                    href="/cv-builder"
                    className="btn btn-sm btn-primary"
                  >
                    <span>Prepare ATS CV</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
