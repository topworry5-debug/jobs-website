'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Building2, 
  Landmark, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Layers, 
  HelpCircle,
  Coins,
  ArrowRight,
  TrendingUp,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { BPS_DATA, calculateBpsSalary, BIG_CITIES } from '../data/bpsPayScaleData';
import { useLanguage } from '../context/LanguageContext';

export default function BpsSalaryCalculator() {
  const { t } = useLanguage();
  const [selectedGrade, setSelectedGrade] = useState(17);
  const [stage, setStage] = useState(0);
  const [isBigCity, setIsBigCity] = useState(true);

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

  return (
    <div className="calculator-container container-xl py-4">
      {/* Header Banner */}
      <div className="calculator-header-card card mb-4">
        <div className="badge badge-govt mb-2">
          <Calculator size={13} />
          <span>Official 2026 Revision Guide</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-main mb-2">
          Government of Pakistan BPS Pay Scale & Salary Calculator
        </h1>
        <p className="text-secondary text-sm md:text-base max-w-3xl">
          Estimate your monthly pay package for Federal and Provincial civil service positions (BPS-1 to BPS-22). Computes Basic Pay, House Rent Allowance (HRA), Medical, Conveyance, and Adhoc Relief.
        </p>

        <div className="flex items-center gap-2 mt-3 text-xs text-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>Model: Federal / Provincial Revised Pay Scales 2022-2024 & Adhoc Notifications</span>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card p-4 space-y-4">
            <h2 className="text-base font-semibold text-main flex items-center gap-2 border-b pb-2 border-theme">
              <Layers size={16} className="text-emerald-500" />
              <span>Select Service Parameters</span>
            </h2>

            {/* Parameter 1: BPS Grade */}
            <div className="form-group">
              <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                Civil Service Grade (BPS)
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(Number(e.target.value))}
                className="input-field select-field w-full"
              >
                {BPS_DATA.map((item) => (
                  <option key={item.grade} value={item.grade}>
                    BPS-{item.grade} — {item.roleTier}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted mt-1">
                Common posts: <em>{bps.cadres}</em>
              </p>
            </div>

            {/* Parameter 2: City Category (House Rent) */}
            <div className="form-group">
              <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                Station / City Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsBigCity(true)}
                  className={`btn btn-sm ${isBigCity ? 'btn-primary' : 'btn-outline'} text-xs justify-center`}
                >
                  <Building2 size={13} />
                  <span>Big Specified Cities</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBigCity(false)}
                  className={`btn btn-sm ${!isBigCity ? 'btn-primary' : 'btn-outline'} text-xs justify-center`}
                >
                  <Landmark size={13} />
                  <span>Other Districts / Towns</span>
                </button>
              </div>
              <p className="text-xs text-muted mt-1">
                {isBigCity 
                  ? "Big Cities (Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Quetta, Faisalabad, Multan, Hyderabad) qualify for 45% HRA."
                  : "Other regional districts receive standard 30% House Rent Allowance."}
              </p>
            </div>

            {/* Parameter 3: Service Stage (Annual Increments) */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-secondary uppercase">
                  Service Increments / Stage
                </label>
                <span className="badge badge-bps text-xs font-mono font-bold">
                  Stage {stage} ({stage === 0 ? 'Fresh Entry' : `${stage} Years in Grade`})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={bps.stages}
                value={stage}
                onChange={(e) => setStage(Number(e.target.value))}
                className="w-full cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-muted mt-1 font-mono">
                <span>Stage 0 (Min)</span>
                <span>Annual Increment: +{formatPKR(bps.increment)}</span>
                <span>Stage {bps.stages} (Max)</span>
              </div>
            </div>

            {/* Grade Metadata Card */}
            <div className="bg-subtle p-3 rounded-lg border border-theme text-xs space-y-1">
              <div className="flex justify-between text-secondary">
                <span>Basic Pay Scale Range:</span>
                <span className="font-mono font-medium">{formatPKR(bps.minBasic)} — {formatPKR(bps.maxBasic)}</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Cadre Classification:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{bps.roleTier}</span>
              </div>
            </div>
          </div>

          {/* Official Disclaimer Box */}
          <div className="card p-3 bg-amber-500/5 border border-amber-500/20 text-xs text-secondary space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
              <AlertCircle size={14} />
              <span>Official Finance Division Notice</span>
            </div>
            <p className="leading-relaxed">
              This calculator provides an estimate based on standard Federal & Provincial notifications. Departmental special allowances (e.g. Executive Allowance, Health Risk Allowance, Judicial Allowance) and individual GP Fund or tax deductions vary by province and department.
            </p>
            <a 
              href="https://finance.gov.pk" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1 hover:underline pt-1"
            >
              <span>Visit Ministry of Finance (finance.gov.pk)</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Right Column: Salary Breakdown & Net Summary */}
        <div className="lg:col-span-7 space-y-4">
          {/* Highlight Card */}
          <div className="card p-5 bg-gradient-to-br from-emerald-950/20 to-transparent border-emerald-500/30">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-theme pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Estimated Monthly Gross Salary (BPS-{selectedGrade})
                </span>
                <div className="text-3xl font-extrabold text-main font-mono mt-0.5 text-emerald-600 dark:text-emerald-400">
                  {formatPKR(grossSalary)}
                  <span className="text-xs text-muted font-sans font-normal ml-1">/ month</span>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Estimated Take-Home (Net Pay)
                </span>
                <div className="text-xl font-bold text-main font-mono mt-0.5">
                  ~{formatPKR(estimatedNetPay)}
                </div>
                <span className="text-xs text-muted">After standard deductions</span>
              </div>
            </div>

            {/* Allowances Breakdown Table */}
            <div className="mt-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                Monthly Allowance & Pay Component Breakdown
              </h3>

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between py-1.5 border-b border-theme/60">
                  <span className="text-secondary flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                    <strong>Running Basic Pay (Stage {stage})</strong>
                  </span>
                  <span className="font-mono font-medium">{formatPKR(basicPay)}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-theme/60">
                  <span className="text-secondary flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
                    <span>House Rent Allowance ({isBigCity ? '45% Big City' : '30% Regional'})</span>
                  </span>
                  <span className="font-mono font-medium">{formatPKR(houseRent)}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-theme/60">
                  <span className="text-secondary flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block" />
                    <span>Adhoc Relief Allowances (~{bps.adhocPercent}%)</span>
                  </span>
                  <span className="font-mono font-medium">{formatPKR(adhocRelief)}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-theme/60">
                  <span className="text-secondary flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                    <span>Medical Allowance</span>
                  </span>
                  <span className="font-mono font-medium">{formatPKR(medical)}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-theme/60">
                  <span className="text-secondary flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                    <span>Conveyance Allowance</span>
                  </span>
                  <span className="font-mono font-medium">
                    {conveyance > 0 ? formatPKR(conveyance) : 'Official Vehicle / Car Entitlement'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 text-xs text-muted pt-2">
                  <span>Estimated Standard Deductions (GP Fund, Benevolent Fund, Tax):</span>
                  <span className="font-mono text-rose-500">-{formatPKR(estimatedDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Pay Scale Progression Overview */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-main mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" />
              <span>Adjacent BPS Grades Pay Comparison (Initial Stage 0)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-theme text-muted">
                    <th className="py-2 px-2">Grade</th>
                    <th className="py-2 px-2">Role Cadre</th>
                    <th className="py-2 px-2 font-mono">Min Basic</th>
                    <th className="py-2 px-2 font-mono">Est. Gross (Big City)</th>
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
                          className={`border-b border-theme/50 transition-colors cursor-pointer ${isCurrent ? 'bg-emerald-500/10 font-bold' : 'hover:bg-subtle'}`}
                          onClick={() => setSelectedGrade(g)}
                        >
                          <td className="py-2 px-2 font-mono">
                            <span className={`badge ${isCurrent ? 'badge-govt' : 'badge-bps'}`}>
                              BPS-{g}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-secondary">{sample.bps.roleTier}</td>
                          <td className="py-2 px-2 font-mono">{formatPKR(sample.bps.minBasic)}</td>
                          <td className="py-2 px-2 font-mono text-emerald-600 dark:text-emerald-400">
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
