'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CommissionsBar({ jobsCountMap = {} }) {
  const { t, isRtl } = useLanguage();

  const c = t.commissionsBar || {
    heading: "Official Public Service Commissions Monitored",
    subHeading: "Updated Every 6 Hours with Direct Gazette Links",
    activeCount: "Active",
    fpsc: { name: "FPSC Federal", sub: "General Recruitment & CSS" },
    ppsc: { name: "PPSC Punjab", sub: "Lecturers, Registrars & Admin" },
    spsc: { name: "SPSC Sindh", sub: "Municipal & Civil Services" },
    kppsc: { name: "KPPSC Khyber", sub: "Provincial Examination Cadre" },
    nts: { name: "NTS Testing", sub: "Judiciary & Public Authorities" }
  };

  const officialAgencies = [
    { key: 'fpsc', name: c.fpsc?.name || "FPSC Federal", sub: c.fpsc?.sub || "General Recruitment & CSS", count: jobsCountMap.FPSC || 0, href: "/agency/fpsc", logo: "/logos/fpsc.svg" },
    { key: 'ppsc', name: c.ppsc?.name || "PPSC Punjab", sub: c.ppsc?.sub || "Lecturers, Registrars & Admin", count: jobsCountMap.PPSC || 0, href: "/agency/ppsc", logo: "/logos/ppsc.svg" },
    { key: 'spsc', name: c.spsc?.name || "SPSC Sindh", sub: c.spsc?.sub || "Municipal & Civil Services", count: jobsCountMap.SPSC || 0, href: "/agency/spsc", logo: "/logos/spsc.svg" },
    { key: 'kppsc', name: c.kppsc?.name || "KPPSC Khyber", sub: c.kppsc?.sub || "Provincial Examination Cadre", count: jobsCountMap.KPPSC || 0, href: "/agency/kppsc", logo: "/logos/kppsc.svg" },
    { key: 'nts', name: c.nts?.name || "NTS Testing", sub: c.nts?.sub || "Judiciary & Public Authorities", count: jobsCountMap.NTS || 0, href: "/agency/nts", logo: "/logos/nts.svg" }
  ];

  return (
    <section className="commissions-bar-section py-4 border-b border-subtle bg-surface-subtle">
      <div className="container-xl">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" />
            <span className="font-bold text-xs uppercase tracking-wider text-primary">{c.heading}</span>
          </div>
          <span className="text-xs text-secondary">{c.subHeading}</span>
        </div>

        <div className="commissions-cards-grid">
          {officialAgencies.map((agency) => {
            return (
              <Link key={agency.key} href={agency.href} className="commission-card-item">
                <div className="flex items-center gap-3">
                  <div className="card-logo-container">
                    <Image 
                      src={agency.logo} 
                      alt={`${agency.name} Emblem`} 
                      className="card-official-logo"
                      width={36}
                      height={36}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-primary">{agency.name}</h3>
                    <div className="text-xs text-muted">{agency.sub}</div>
                  </div>
                </div>
                <span className="badge badge-bps text-xs font-mono">
                  {isRtl ? `${agency.count} ${c.activeCount}` : `${agency.count} ${c.activeCount}`}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
