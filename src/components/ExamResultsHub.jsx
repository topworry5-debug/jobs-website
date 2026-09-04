'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileCheck, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  CheckCircle2, 
  Landmark, 
  FileText,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { COMMISSIONS_PORTALS } from '../data/examResultsData';
import { useLanguage } from '../context/LanguageContext';

export default function ExamResultsHub() {
  const { t } = useLanguage();
  const [selectedAgency, setSelectedAgency] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'slip' | 'result'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgencies = useMemo(() => {
    return COMMISSIONS_PORTALS.filter((agency) => {
      if (selectedAgency !== 'all' && agency.agencyId !== selectedAgency) {
        return false;
      }
      return true;
    }).map((agency) => {
      // Filter services within this agency
      const services = agency.services.filter((srv) => {
        if (selectedType !== 'all' && srv.type !== selectedType) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = srv.title.toLowerCase().includes(q);
          const matchNote = srv.note.toLowerCase().includes(q);
          const matchAgency = agency.agencyName.toLowerCase().includes(q);
          if (!matchTitle && !matchNote && !matchAgency) return false;
        }
        return true;
      });

      return {
        ...agency,
        matchingServices: services
      };
    }).filter(agency => agency.matchingServices.length > 0);
  }, [selectedAgency, selectedType, searchQuery]);

  return (
    <div className="exam-results-hub-container container-xl py-4">
      {/* Header Banner */}
      <div className="card mb-4 p-5">
        <div className="badge badge-govt mb-2">
          <FileCheck size={13} />
          <span>Official Verification Gateway</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-main mb-2">
          Exam Results & Roll Number Slip Direct Access Hub 2026
        </h1>
        <p className="text-secondary text-sm md:text-base max-w-3xl">
          Direct, authenticated portal links to download admission letters, roll number slips, written examination results, and merit lists from FPSC, PPSC, SPSC, KPPSC, NTS, BPSC, and AJKPSC.
        </p>

        {/* Security & Verification Guarantee Banner */}
        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
          <ShieldCheck size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-secondary leading-relaxed">
            <strong className="text-main block mb-0.5">Authenticity & Safety Guarantee:</strong>
            Tainaati routes candidates directly to the authenticated, SSL-secured domain servers of official government testing bodies (e.g. <code>fpsc.gov.pk</code>, <code>ppsc.gop.pk</code>). We do not solicit candidate CNICs or passwords on our servers. Always verify your roll numbers and final recommendations directly on the official portal.
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card p-4 mb-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by exam name, agency, 'slip', 'CSS', 'PPSC merit'..."
              className="input-field pl-10 w-full text-sm"
            />
          </div>

          {/* Service Type Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`btn btn-sm ${selectedType === 'all' ? 'btn-primary' : 'btn-outline'} text-xs`}
            >
              All Services
            </button>
            <button
              onClick={() => setSelectedType('slip')}
              className={`btn btn-sm ${selectedType === 'slip' ? 'btn-primary' : 'btn-outline'} text-xs flex items-center gap-1`}
            >
              <Download size={13} />
              <span>Roll No Slips</span>
            </button>
            <button
              onClick={() => setSelectedType('result')}
              className={`btn btn-sm ${selectedType === 'result' ? 'btn-primary' : 'btn-outline'} text-xs flex items-center gap-1`}
            >
              <CheckCircle2 size={13} />
              <span>Written Results</span>
            </button>
          </div>
        </div>

        {/* Agency Quick Filter Pills */}
        <div className="testing-body-pills-wrap">
          <span className="text-xs font-semibold text-muted mr-1 self-center">Testing Body:</span>
          {[
            { id: 'all', label: 'All Commissions' },
            { id: 'fpsc', label: 'FPSC Federal' },
            { id: 'ppsc', label: 'PPSC Punjab' },
            { id: 'spsc', label: 'SPSC Sindh' },
            { id: 'kppsc', label: 'KPPSC Khyber' },
            { id: 'nts', label: 'NTS National' },
            { id: 'regional', label: 'AJKPSC & BPSC' }
          ].map((ag) => (
            <button
              key={ag.id}
              onClick={() => setSelectedAgency(ag.id)}
              className={`testing-body-pill ${selectedAgency === ag.id ? 'active' : ''}`}
            >
              {ag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Listings Grid */}
      <div className="space-y-6">
        {filteredAgencies.length > 0 ? (
          filteredAgencies.map((agency) => (
            <div key={agency.agencyId} className="exam-agency-card space-y-4">
              {/* Agency Header Row */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-subtle pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="badge badge-bps font-mono font-bold">{agency.logoText}</span>
                    <span className="text-xs text-muted font-medium">{agency.jurisdiction}</span>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-primary">
                    {agency.agencyName}
                  </h2>
                  <p className="text-xs text-secondary mt-1 leading-relaxed max-w-2xl">
                    {agency.description}
                  </p>
                </div>

                <a
                  href={agency.verifiedPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline text-xs self-start sm:self-auto flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>Official Domain: {agency.officialDomain}</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Agency Specific Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agency.matchingServices.map((srv, idx) => {
                  const isSlip = srv.type === 'slip';
                  return (
                    <div 
                      key={idx} 
                      className="exam-service-card"
                    >
                      <div>
                        <div className="exam-service-header">
                          <span className={`badge text-xs font-semibold ${isSlip ? 'badge-govt' : 'badge-private'}`}>
                            {isSlip ? 'Admission / Roll No Slip' : 'Examination Results'}
                          </span>
                          <span className="exam-verified-badge">
                            <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                            <span>Verified Link</span>
                          </span>
                        </div>

                        <div className="exam-service-body">
                          <h3 className="exam-service-title">
                            {srv.title}
                          </h3>
                          <p className="exam-service-desc">
                            {srv.note}
                          </p>
                        </div>
                      </div>

                      <a
                        href={srv.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`exam-cta-btn ${isSlip ? 'exam-cta-btn-primary' : 'exam-cta-btn-outline'}`}
                      >
                        <span>{isSlip ? 'Download Roll Number Slip' : 'View Official Gazette Results'}</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="card p-8 text-center space-y-3">
            <AlertTriangle size={32} className="text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-main">No Matching Portal Links Found</h3>
            <p className="text-sm text-secondary max-w-md mx-auto">
              No examination links matched your search criteria. Try clearing your query or switching agency tabs.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedAgency('all'); setSelectedType('all'); }}
              className="btn btn-sm btn-outline text-xs mx-auto"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
