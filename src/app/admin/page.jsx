'use client';

import React, { useState } from 'react';
import AdminPipelineDashboard from '../../components/AdminPipelineDashboard';
import { JOBS_DATA } from '../../data/jobsData';

export default function AdminPage() {
  const [jobs, setJobs] = useState(JOBS_DATA);

  return (
    <div className="py-6">
      <AdminPipelineDashboard 
        jobs={jobs}
        onUpdateJobs={setJobs}
      />
    </div>
  );
}
