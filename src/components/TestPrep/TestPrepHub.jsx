'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Flame, 
  Target,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { TEST_PREP_MODULES } from '../../data/testPrepData';
import QuizSimulator from './QuizSimulator';
import { useLanguage } from '../../context/LanguageContext';

export default function TestPrepHub() {
  const { t, isRtl } = useLanguage();
  const [activeModule, setActiveModule] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  if (activeModule) {
    return <QuizSimulator module={activeModule} onBack={() => setActiveModule(null)} />;
  }

  return (
    <div className="test-prep-hub-page">
      {/* Header Banner */}
      <div className="test-prep-header">
        <div className="container-xl">
          <div className="test-prep-header-content">
            <div className="badge badge-govt mb-2">
              <ShieldCheck size={13} />
              <span>Official FPSC, PPSC & NTS MCQ Test Bank</span>
            </div>
            <h1 className="test-prep-title">Competitive Exam MCQ Practice & Past Papers</h1>
            <p className="test-prep-desc">
              Prepare with verified past papers, instant conceptual explanations, timed screening simulations, and negative marking penalty calculation.
            </p>
          </div>
        </div>
      </div>

      {/* Module Catalog Grid */}
      <div className="container-xl test-prep-body">
        {/* Performance Overview Card */}
        <div className="test-prep-stats-banner card mb-4">
          <div className="stats-col">
            <div className="stat-icon-circle green">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="stat-b-title">Instant Verification</span>
              <p className="stat-b-sub">Every MCQ contains verified statutory & conceptual references</p>
            </div>
          </div>

          <div className="stat-divider-vertical" />

          <div className="stats-col">
            <div className="stat-icon-circle blue">
              <Clock size={20} />
            </div>
            <div>
              <span className="stat-b-title">Timed Exam Simulation</span>
              <p className="stat-b-sub">Accurate time constraints matching real commission tests</p>
            </div>
          </div>

          <div className="stat-divider-vertical" />

          <div className="stats-col">
            <div className="stat-icon-circle amber">
              <Target size={20} />
            </div>
            <div>
              <span className="stat-b-title">Negative Marking Mode</span>
              <p className="stat-b-sub">Calculates 0.25 penalty deductions for PPSC tests</p>
            </div>
          </div>
        </div>

        {/* Papers List */}
        <div className="test-modules-grid">
          {TEST_PREP_MODULES.map((mod) => (
            <div key={mod.id} className="test-module-card card">
              <div className="test-card-top">
                <span className="badge badge-govt">{mod.agency}</span>
                <span className="test-time-tag">
                  <Clock size={13} />
                  <span>{mod.timeLimitMinutes} Mins</span>
                </span>
              </div>

              <h3 className="test-card-title">{mod.title}</h3>
              <p className="test-card-desc">{mod.description}</p>

              <div className="test-card-meta">
                <div className="test-meta-pill">
                  <strong>{mod.questions.length}</strong> Questions
                </div>
                <div className="test-meta-pill">
                  <strong>{mod.totalMarks}</strong> Total Marks
                </div>
                {mod.negativeMarking > 0 ? (
                  <div className="test-meta-pill text-red">
                    -{mod.negativeMarking} Negative Marking
                  </div>
                ) : (
                  <div className="test-meta-pill text-emerald">
                    Zero Penalty
                  </div>
                )}
              </div>

              <div className="test-card-footer">
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => setActiveModule(mod)}
                >
                  <span>Start Timed Practice</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
