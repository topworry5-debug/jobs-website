import React from 'react';
import Link from 'next/link';
import { Search, Home, ArrowRight, Landmark, Calendar, FileText, AlertCircle, Briefcase } from 'lucide-react';
import { JOBS_DATA } from '../data/jobsData';
import { filterOpenJobs, getJobUrl } from '../lib/jobStatus';
import { decodeHtmlEntities } from '../utils/textCleaning';

export const metadata = {
  title: 'Page Not Found (404) | Tainaati',
  description: 'The requested job posting or page could not be found. Search active Pakistani public sector job opportunities and competitive exam schedules.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const openJobs = filterOpenJobs(JOBS_DATA).slice(0, 4);

  return (
    <div className="container-xl py-12 md:py-20 text-center">
      <div className="max-w-2xl mx-auto px-4">
        {/* Error Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
          <AlertCircle size={14} />
          <span>Error 404 — Page Not Found</span>
        </div>

        {/* 1. Single H1 */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
          Looking for a Job or Exam Notice?
        </h1>

        <p className="text-base text-secondary mb-8 leading-relaxed">
          The page you requested could not be found or has moved. Browse the latest open positions below, or search active vacancies and competitive exam schedules.
        </p>

        {/* 2. Direct Search Box */}
        <form action="/" method="GET" className="relative max-w-lg mx-auto mb-10">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-muted pointer-events-none" size={18} />
            <input
              type="text"
              name="search"
              placeholder="Search by job title, department, or BPS grade..."
              aria-label="Search job notices"
              className="w-full pl-11 pr-28 py-3 rounded-xl bg-surface-subtle border border-subtle text-primary placeholder:text-muted focus:outline-none focus:border-emerald-500 transition-colors text-sm"
            />
            <button
              type="submit"
              className="absolute right-1.5 btn btn-primary btn-sm px-4 py-2"
              aria-label="Submit search"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Hub Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <Link href="/" className="btn btn-outline btn-sm flex items-center gap-1.5 text-xs">
            <Home size={13} />
            <span>Homepage</span>
          </Link>
          <Link href="/jobs/govt" className="btn btn-outline btn-sm flex items-center gap-1.5 text-xs">
            <Landmark size={13} />
            <span>Government Jobs</span>
          </Link>
          <Link href="/agency/fpsc" className="btn btn-outline btn-sm flex items-center gap-1.5 text-xs">
            <Landmark size={13} />
            <span>FPSC Portal</span>
          </Link>
          <Link href="/agency/ppsc" className="btn btn-outline btn-sm flex items-center gap-1.5 text-xs">
            <Landmark size={13} />
            <span>PPSC Portal</span>
          </Link>
          <Link href="/exams" className="btn btn-outline btn-sm flex items-center gap-1.5 text-xs">
            <Calendar size={13} />
            <span>Exam Calendar</span>
          </Link>
          <Link href="/cv-builder" className="btn btn-outline btn-sm flex items-center gap-1.5 text-xs">
            <FileText size={13} />
            <span>Free CV Builder</span>
          </Link>
        </div>

        {/* 3. Latest Open Jobs List */}
        {openJobs.length > 0 && (
          <div className="text-left card p-6 bg-surface-subtle border border-subtle">
            <div className="flex items-center justify-between mb-4 border-b border-subtle pb-3">
              <h2 className="text-sm font-bold text-primary flex items-center gap-2 m-0">
                <Briefcase size={16} className="text-emerald-500" />
                <span>Latest Open Government Positions</span>
              </h2>
              <Link href="/jobs/govt" className="text-xs text-emerald-500 hover:underline flex items-center gap-1">
                <span>View all</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              {openJobs.map((job) => (
                <Link
                  key={job.slug || job.id}
                  href={getJobUrl(job)}
                  className="block p-3 rounded-lg bg-surface border border-subtle hover:border-emerald-500/50 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-primary group-hover:text-emerald-500 transition-colors" dir="auto">
                        {job.title}
                      </div>
                      <div className="text-xs text-secondary mt-0.5" dir="auto">
                        {decodeHtmlEntities(job.department || job.company)} • {decodeHtmlEntities(job.city)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 text-xs">
                      {job.bpsScale && (
                        <span className="badge badge-bps font-mono">{job.bpsScale}</span>
                      )}
                      <span className="text-emerald-500 font-semibold hidden sm:inline">Apply &rarr;</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
