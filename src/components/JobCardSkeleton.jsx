'use client';

import React from 'react';

export default function JobCardSkeleton() {
  return (
    <div className="job-card-skeleton card">
      {/* Top row skeleton */}
      <div className="skeleton-top-row">
        <div className="skeleton-logo-box" />
        <div className="skeleton-dept-col">
          <div className="skeleton-line skeleton-dept" />
          <div className="skeleton-line skeleton-cat" />
        </div>
        <div className="skeleton-badge-box" />
      </div>

      {/* Title skeleton */}
      <div className="skeleton-title-box">
        <div className="skeleton-line skeleton-title-1" />
        <div className="skeleton-line skeleton-title-2" />
      </div>

      {/* Spec grid skeleton */}
      <div className="skeleton-spec-grid">
        <div className="skeleton-pill" />
        <div className="skeleton-pill" />
        <div className="skeleton-pill" />
        <div className="skeleton-pill" />
      </div>

      {/* Action row skeleton */}
      <div className="skeleton-bottom-row">
        <div className="skeleton-salary-box" />
        <div className="skeleton-btn-box" />
      </div>
    </div>
  );
}
