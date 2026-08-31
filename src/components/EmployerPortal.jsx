'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Plus, 
  Users, 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CITIES } from '../data/jobsData';

export default function EmployerPortal({ onJobCreated }) {
  const [activeTab, setActiveTab] = useState('post'); // 'post' | 'applicants'
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    city: 'Lahore',
    category: 'IT & Software',
    salaryRange: 'PKR 250,000 - 400,000 / month',
    qualification: 'BS Computer Science / Software Engineering',
    experience: '3+ Years',
    lastDate: '2026-09-25',
    description: '',
    applyUrl: ''
  });
  const [postSuccess, setPostSuccess] = useState(false);

  // Mock applicants list for demonstration
  const mockApplicants = [
    {
      id: "app-1",
      candidateName: "Ali Raza",
      roleApplied: "Senior Full Stack Engineer",
      city: "Lahore",
      experience: "5 Years",
      education: "BS CS (FAST NUCES)",
      matchScore: 94,
      status: "Shortlisted"
    },
    {
      id: "app-2",
      candidateName: "Fatima Noor",
      roleApplied: "Product Designer (UI/UX)",
      city: "Karachi",
      experience: "4 Years",
      education: "B.Des (IVS)",
      matchScore: 88,
      status: "Review Pending"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.jobTitle) return;
    
    // Call callback if available to add to live listings
    if (onJobCreated) {
      onJobCreated({
        id: `priv-emp-${Date.now()}`,
        type: 'private',
        title: formData.jobTitle,
        company: formData.companyName,
        category: formData.category,
        subCategory: "Software & Technology",
        salaryRange: formData.salaryRange,
        city: formData.city,
        province: "Punjab",
        qualification: formData.qualification,
        vacancies: 2,
        experience: formData.experience,
        postDate: new Date().toISOString().split('T')[0],
        lastDate: formData.lastDate,
        urgent: false,
        featured: true,
        verified: true,
        officialUrl: formData.applyUrl || "https://rozgar.pk",
        officialSourceLabel: "Direct Employer Verified Posting",
        description: formData.description || "Direct opportunity from verified employer on RozgarPK."
      });
    }

    setPostSuccess(true);
  };

  return (
    <div className="employer-portal-page">
      <div className="container-xl">
        {/* Header */}
        <div className="employer-header-card">
          <div className="badge badge-private mb-2">
            <Building2 size={13} />
            <span>Verified Employer Recruitment Network</span>
          </div>
          <h1 className="employer-main-title">Hire Top Engineering & Professional Talent in Pakistan</h1>
          <p className="employer-main-desc">
            Directly connect with 100,000+ verified Pakistani professionals, developers, and competitive exam rankers.
          </p>

          <div className="employer-nav-pills">
            <button
              className={`emp-nav-btn ${activeTab === 'post' ? 'active' : ''}`}
              onClick={() => { setActiveTab('post'); setPostSuccess(false); }}
            >
              <Plus size={15} />
              <span>Post a Verified Opening</span>
            </button>
            <button
              className={`emp-nav-btn ${activeTab === 'applicants' ? 'active' : ''}`}
              onClick={() => setActiveTab('applicants')}
            >
              <Users size={15} />
              <span>Applicant CV Pipeline ({mockApplicants.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Post a Job */}
        {activeTab === 'post' && (
          <div className="employer-form-card card">
            {!postSuccess ? (
              <form onSubmit={handleSubmit} className="emp-job-form">
                <div className="grid-2">
                  <div className="form-group">
                    <label>Company / Organization Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Systems Limited / TechScale"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label>Position Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lead Backend Architect (Node.js)"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Posting City</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="input-field select-field"
                    >
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Salary Package (PKR)</label>
                    <input
                      type="text"
                      placeholder="e.g. PKR 300,000 - 450,000 / month"
                      value={formData.salaryRange}
                      onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Minimum Qualification</label>
                    <input
                      type="text"
                      placeholder="e.g. BS Computer Science / Software Engineering"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label>Application Closing Date</label>
                    <input
                      type="date"
                      value={formData.lastDate}
                      onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Official Application Link / Careers URL</label>
                  <input
                    type="url"
                    placeholder="https://yourcompany.com/careers/apply"
                    value={formData.applyUrl}
                    onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label>Job Description & Key Requirements</label>
                  <textarea
                    rows={4}
                    placeholder="Describe team, core stack, responsibilities, and benefits..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg mt-3">
                  <CheckCircle2 size={16} />
                  <span>Publish Verified Listing</span>
                </button>
              </form>
            ) : (
              <div className="subscription-success-box">
                <CheckCircle2 size={44} className="text-emerald" />
                <h2 className="success-title">Position Published Successfully!</h2>
                <p className="success-desc">
                  Your listing for <strong>{formData.jobTitle}</strong> at <strong>{formData.companyName}</strong> is now live on RozgarPK and indexed for Google for Jobs.
                </p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => setPostSuccess(false)}
                >
                  <span>Post Another Vacancy</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Applicants Pipeline */}
        {activeTab === 'applicants' && (
          <div className="applicants-pipeline-card card">
            <h3 className="pipeline-table-title">Recent Verified Applicants (Sample ATS Pipeline)</h3>
            <table className="applicants-table">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Role Applied</th>
                  <th>City</th>
                  <th>Experience & Degree</th>
                  <th>AI Match Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockApplicants.map((app) => (
                  <tr key={app.id}>
                    <td><strong>{app.candidateName}</strong></td>
                    <td>{app.roleApplied}</td>
                    <td>{app.city}</td>
                    <td>{app.experience} • {app.education}</td>
                    <td>
                      <span className="badge badge-verified">
                        <Sparkles size={11} />
                        <span>{app.matchScore}% Fit</span>
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-govt">{app.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
