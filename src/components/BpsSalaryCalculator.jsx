'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Calculator, 
  Building2, 
  Landmark, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  ExternalLink, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  ArrowDownCircle, 
  Coins, 
  CheckCircle2, 
  Sparkles,
  Award
} from 'lucide-react';
import { BPS_DATA, calculateBpsSalary, BIG_CITIES } from '../data/bpsPayScaleData';
import { useLanguage } from '../context/LanguageContext';

export default function BpsSalaryCalculator() {
  const { t } = useLanguage();
  const [selectedGrade, setSelectedGrade] = useState(17);
  const [stage, setStage] = useState(0);
  const [isBigCity, setIsBigCity] = useState(true);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const breakdownRef = useRef(null);

  // Trigger pulse animation when salary inputs change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 400);
    return () => clearTimeout(timer);
  }, [selectedGrade, stage, isBigCity]);

  // Adjust stage if current stage exceeds the newly selected grade's maximum stages
  const currentBpsMeta = useMemo(() => {
    return BPS_DATA.find(b => b.grade === Number(selectedGrade)) || BPS_DATA[16];
  }, [selectedGrade]);

  useEffect(() => {
    if (stage > currentBpsMeta.stages) {
      setStage(currentBpsMeta.stages);
    }
  }, [currentBpsMeta, stage]);

  const calculation = useMemo(() => {
    return calculateBpsSalary({
      gradeNumber: selectedGrade,
      stage,
      isBigCity
    });
  }, [selectedGrade, stage, isBigCity]);

  const { bps, basicPay, houseRent, conveyance, medical, adhocRelief, grossSalary, estimatedDeductions, estimatedNetPay } = calculation;

  const formatPKR = (val) => {
    return 'PKR ' + Number(val).toLocaleString('en-PK');
  };

  const scrollToBreakdown = () => {
    if (breakdownRef.current) {
      breakdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="calculator-container container-xl py-4 space-y-6">
      {/* Mobile Sticky Headline Summary (Shows on <768px for immediate feedback) */}
      <div className="mobile-salary-sticky-bar">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="badge badge-govt text-[10px] font-bold">BPS-{selectedGrade}</span>
            <span className="text-[11px] text-muted font-medium">Stage {stage}</span>
          </div>
          <div className={`text-lg font-bold font-serif ${isAnimating ? 'salary-pulse-active' : ''}`} style={{ color: '#C9A227' }}>
            {formatPKR(grossSalary)}
            <span className="text-[10px] text-muted font-sans font-normal ml-1">gross</span>
          </div>
        </div>

        <button 
          onClick={scrollToBreakdown}
          className="btn btn-outline btn-sm flex items-center gap-1.5 text-xs py-2 px-3 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
          aria-label="Scroll to Breakdown"
        >
          <span>Breakdown</span>
          <ArrowDownCircle size={14} />
        </button>
      </div>

      {/* Header Banner */}
      <div className="card p-6 md:p-8 bg-surface border border-subtle rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="badge badge-govt text-xs flex items-center gap-1.5">
            <Award size={13} />
            <span>Official Civil Service Pay Model</span>
          </span>
          <span className="badge badge-official text-xs">
            Revised Pay Scales 2022–2024
          </span>
          <span className="badge badge-mcq text-xs">
            Updated 2026 Adhoc Allowances
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-primary font-serif tracking-tight mb-2">
          Government of Pakistan BPS Pay Scale & Salary Calculator
        </h1>

        {/* Short, clear intro paragraph */}
        <p className="text-secondary text-sm md:text-base max-w-3xl leading-relaxed">
          Estimate your take-home government salary based on the 2022–2024 revised pay scales. Figures are approximate — always verify final pay with your departmental accounts office.
        </p>
      </div>

      {/* Main Two-Column Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================
            LEFT COLUMN (40%): INPUT CONTROLS CARD
            ========================================================= */}
        <div className="lg:col-span-5 space-y-6">
          <div className="salary-input-card p-6 md:p-8 space-y-6">
            <div className="border-b border-subtle pb-3">
              <h2 className="text-base font-bold text-primary flex items-center gap-2">
                <Layers size={18} className="text-emerald-600 dark:text-emerald-400" />
                <span>Service & Grade Parameters</span>
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Customize your civil service rank, post location, and seniority
              </p>
            </div>

            {/* SECTION 1: Civil Service Grade (BPS) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label 
                  htmlFor="bps-grade-select"
                  className="block text-xs font-bold uppercase tracking-wider text-secondary"
                >
                  Civil Service Grade (BPS)
                </label>
                <span className="badge badge-bps text-[11px] font-bold">
                  {bps.roleTier}
                </span>
              </div>

              <div className="relative">
                <select
                  id="bps-grade-select"
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(Number(e.target.value))}
                  className="w-full h-12 px-3.5 pr-10 rounded-xl bg-surface-subtle border border-subtle text-primary font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                  style={{ minHeight: '48px' }}
                >
                  {BPS_DATA.map((item) => (
                    <option key={item.grade} value={item.grade}>
                      BPS-{item.grade} — {item.roleTier} (Min Basic: PKR {item.minBasic.toLocaleString()})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                  <ChevronDown size={16} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-subtle text-xs space-y-1 mt-2">
                <div className="text-muted text-[11px] font-semibold uppercase tracking-wider">
                  Representative Cadres & Positions:
                </div>
                <div className="text-primary font-medium leading-relaxed" dir="auto">
                  {bps.cadres}
                </div>
                <div className="flex justify-between items-center text-[11px] text-secondary pt-1 border-t border-subtle font-mono">
                  <span>Scale: {formatPKR(bps.minBasic)} – {formatPKR(bps.maxBasic)}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Incr: +{formatPKR(bps.increment)}</span>
                </div>
              </div>
            </div>

            {/* SECTION 2: Station / City Category (House Rent Allowance) */}
            <div className="space-y-2 pt-2 border-t border-subtle">
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary">
                Station / City Category
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBigCity(true)}
                  className={`city-toggle-btn ${isBigCity ? 'active' : ''}`}
                  style={{ minHeight: '46px' }}
                  aria-pressed={isBigCity}
                >
                  <Building2 size={16} className={isBigCity ? 'text-amber-400' : 'text-muted'} />
                  <span>Big Specified Cities</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBigCity(false)}
                  className={`city-toggle-btn ${!isBigCity ? 'active' : ''}`}
                  style={{ minHeight: '46px' }}
                  aria-pressed={!isBigCity}
                >
                  <Landmark size={16} className={!isBigCity ? 'text-amber-400' : 'text-muted'} />
                  <span>Other Districts / Towns</span>
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-subtle text-[11px] text-muted leading-relaxed">
                {isBigCity ? (
                  <span>
                    <strong className="text-emerald-600 dark:text-emerald-400">45% House Rent Allowance:</strong> Applies to Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Quetta, Faisalabad, Multan, and Hyderabad.
                  </span>
                ) : (
                  <span>
                    <strong className="text-primary">30% House Rent Allowance:</strong> Applies to all other regional districts, tehsils, and rural government duty stations.
                  </span>
                )}
              </div>
            </div>

            {/* SECTION 3: Service Increment / Stage */}
            <div className="space-y-3 pt-2 border-t border-subtle">
              <div className="flex justify-between items-center">
                <label 
                  htmlFor="bps-stage-slider"
                  className="block text-xs font-bold uppercase tracking-wider text-secondary"
                >
                  Service Increment / Stage
                </label>
                <span className="badge badge-govt text-xs font-mono font-bold">
                  Stage {stage} ({stage === 0 ? 'Fresh Entry' : `${stage} Years in Grade`})
                </span>
              </div>

              <div className="py-2">
                <input
                  id="bps-stage-slider"
                  type="range"
                  min="0"
                  max={bps.stages}
                  value={stage}
                  onChange={(e) => setStage(Number(e.target.value))}
                  className="salary-slider"
                  aria-label="Service increments stage slider"
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-muted font-mono">
                <span>Stage 0 (Min Entry)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  +{formatPKR(bps.increment * stage)} accrued
                </span>
                <span>Stage {bps.stages} (Ceiling)</span>
              </div>
            </div>

            {/* SECTION 4: Collapsible Official Finance Division Notice */}
            <div className="pt-2 border-t border-subtle">
              <button
                id="finance-disclaimer-btn"
                type="button"
                onClick={() => setDisclaimerOpen(!disclaimerOpen)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-subtle text-xs font-semibold text-secondary hover:text-primary transition-all text-left"
                style={{ minHeight: '44px' }}
                aria-expanded={disclaimerOpen}
              >
                <div className="flex items-center gap-2">
                  <Info size={16} className="text-amber-500 flex-shrink-0" />
                  <span>Official Finance Division Notice & Disclaimers</span>
                </div>
                {disclaimerOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {disclaimerOpen && (
                <div 
                  id="finance-disclaimer-content"
                  className="p-3.5 mt-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-secondary space-y-2 leading-relaxed animate-fadeIn"
                >
                  <p>
                    This calculator implements the standard Federal and Provincial Government basic pay structure, standard House Rent Allowance (HRA), Medical Allowance, Conveyance Allowance, and active consolidated Adhoc Relief Allowances.
                  </p>
                  <p>
                    Department-specific allowances (such as Executive Allowance, Judicial Allowance, Health Risk Allowance, Ph.D. Allowance, or Technical Allowance) are not included as they vary by institution.
                  </p>
                  <p className="text-[11px] text-muted">
                    Deductions for General Provident (GP) Fund, Benevolent Fund, and Income Tax are estimated based on standard civil service withholding brackets.
                  </p>
                  <a 
                    href="https://finance.gov.pk" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold hover:underline pt-1 text-xs"
                  >
                    <span>Ministry of Finance Official Circulars (finance.gov.pk)</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN (60%): RESULTS CARD & BREAKDOWN
            ========================================================= */}
        <div className="lg:col-span-7 space-y-6" ref={breakdownRef}>
          {/* Main Visual Hero Results Card */}
          <div className="salary-results-card p-6 md:p-8 space-y-6">
            {/* Equal-Weight Results Grid: Gross Salary & Take-Home Net Pay */}
            <div className="salary-results-grid">
              {/* Column 1: Gross Salary */}
              <div className="salary-metric-col">
                <div>
                  <span className="salary-metric-heading">
                    Estimated Monthly Gross Salary (BPS-{selectedGrade})
                  </span>
                  <div className={`text-3xl md:text-4xl font-extrabold salary-hero-amount ${isAnimating ? 'salary-pulse-active' : ''}`}>
                    {formatPKR(grossSalary)}
                    <span className="text-xs md:text-sm font-sans font-normal text-muted ml-2">/ mo</span>
                  </div>
                </div>
                <span className="salary-metric-caption">
                  Includes Basic Pay + All Standard Federal/Provincial Allowances
                </span>
              </div>

              {/* Column 2: Net Take-Home Pay (Equal visual weight, high contrast) */}
              <div className="salary-metric-col">
                <div>
                  <span className="salary-metric-heading">
                    Estimated Take-Home (Net Pay)
                  </span>
                  <div className={`salary-metric-amount ${isAnimating ? 'salary-pulse-active' : ''}`}>
                    ~{formatPKR(estimatedNetPay)}
                  </div>
                </div>
                <span className="salary-metric-caption">
                  After estimated standard GP Fund, Benevolent & tax deductions
                </span>
              </div>
            </div>

            {/* Monthly Allowance & Pay Component Breakdown Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Monthly Allowance & Pay Component Breakdown
                </h3>
                <span className="text-[11px] text-muted font-mono">Currency: PKR</span>
              </div>

              <div className="space-y-1.5 rounded-xl bg-surface/60 border border-subtle p-2.5">
                {/* 1. Basic Pay */}
                <div className="salary-breakdown-row">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <div className="salary-row-info">
                      <span className="salary-row-label">
                        Running Basic Pay (Stage {stage})
                      </span>
                      <span className="salary-row-desc">
                        Scale base ({formatPKR(bps.minBasic)}) + {stage} increments
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-primary flex-shrink-0">{formatPKR(basicPay)}</span>
                </div>

                {/* 2. House Rent Allowance */}
                <div className="salary-breakdown-row">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <div className="salary-row-info">
                      <span className="salary-row-label">
                        House Rent Allowance (HRA)
                      </span>
                      <span className="salary-row-desc">
                        {isBigCity ? '45% Big Specified Cities rate' : '30% Regional / Town station rate'}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-primary flex-shrink-0">{formatPKR(houseRent)}</span>
                </div>

                {/* 3. Adhoc Relief Allowances */}
                <div className="salary-breakdown-row">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 flex-shrink-0" />
                    <div className="salary-row-info">
                      <span className="salary-row-label">
                        Adhoc Relief Allowances
                      </span>
                      <span className="salary-row-desc">
                        Cumulative ~{bps.adhocPercent}% of running basic pay
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-primary flex-shrink-0">{formatPKR(adhocRelief)}</span>
                </div>

                {/* 4. Medical Allowance */}
                <div className="salary-breakdown-row">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <div className="salary-row-info">
                      <span className="salary-row-label">
                        Medical Allowance
                      </span>
                      <span className="salary-row-desc">
                        Standard gazetted/non-gazetted medical coverage
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-primary flex-shrink-0">{formatPKR(medical)}</span>
                </div>

                {/* 5. Conveyance Allowance */}
                <div className="salary-breakdown-row">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 flex-shrink-0" />
                    <div className="salary-row-info">
                      <span className="salary-row-label">
                        Conveyance Allowance
                      </span>
                      <span className="salary-row-desc">
                        {conveyance > 0 ? 'Fixed monthly transport reimbursement' : 'Official car & fuel entitlement'}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-primary flex-shrink-0">
                    {conveyance > 0 ? formatPKR(conveyance) : 'Entitled Vehicle'}
                  </span>
                </div>

                {/* Total Deductions Row */}
                <div className="salary-breakdown-row salary-deductions-row mt-2">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
                    <div className="salary-row-info">
                      <span className="salary-row-label">
                        Total Estimated Deductions
                      </span>
                      <span className="salary-row-desc">
                        GP Fund, Benevolent Fund, Group Insurance & Tax
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold flex-shrink-0">-{formatPKR(estimatedDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Adjacent BPS Grades Pay Comparison Table */}
          <div className="card p-6 md:p-8 bg-surface border border-subtle rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h3 className="text-sm md:text-base font-bold text-primary flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Adjacent BPS Grades Pay Comparison</span>
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Click any row to instantly evaluate that scale at entry stage 0 (Big City)
                </p>
              </div>
              <span className="text-[11px] text-muted font-mono">Stage 0 Baseline</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-subtle text-muted uppercase text-[11px]">
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Role Cadre</th>
                    <th className="py-2.5 px-3 text-right font-mono">Min Basic</th>
                    <th className="py-2.5 px-3 text-right font-mono">Est. Gross (Big City)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    Math.max(1, selectedGrade - 2),
                    Math.max(1, selectedGrade - 1),
                    selectedGrade,
                    Math.min(22, selectedGrade + 1),
                    Math.min(22, selectedGrade + 2)
                  ]
                    .filter((v, i, arr) => arr.indexOf(v) === i)
                    .map((g) => {
                      const sample = calculateBpsSalary({ gradeNumber: g, stage: 0, isBigCity: true });
                      const isCurrent = g === selectedGrade;
                      return (
                        <tr 
                          key={g} 
                          className={`border-b border-subtle/60 comparison-table-row ${isCurrent ? 'selected-grade' : ''}`}
                          onClick={() => setSelectedGrade(g)}
                          title={`Switch to BPS-${g}`}
                        >
                          <td className="py-3 px-3">
                            <span className={`badge ${isCurrent ? 'badge-govt font-bold' : 'badge-bps font-medium'}`}>
                              BPS-{g} {isCurrent && '✓ Current'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-secondary font-medium">
                            {sample.bps.roleTier}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-secondary">
                            {formatPKR(sample.bps.minBasic)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold" style={{ color: isCurrent ? '#C9A227' : 'inherit' }}>
                            {formatPKR(sample.grossSalary)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
