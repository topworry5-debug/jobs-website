'use client';

import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Sparkles, 
  Plus, 
  Trash2, 
  Eye, 
  Edit3, 
  ShieldCheck, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code2, 
  CheckCircle2, 
  RotateCcw,
  Camera,
  Upload,
  X,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Check,
  Palette,
  Lightbulb,
  Sliders,
  FolderGit2
} from 'lucide-react';

const SAMPLE_PHOTO_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23059669'/%3E%3Cstop offset='100%25' stop-color='%23047857'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23g)'/%3E%3Ccircle cx='100' cy='75' r='38' fill='%23ffffff' opacity='0.9'/%3E%3Cpath d='M30 185 C30 135, 70 120, 100 120 C130 120, 170 135, 170 185 Z' fill='%23ffffff' opacity='0.9'/%3E%3C/svg%3E";

const ACCENT_COLORS = [
  { id: 'emerald', label: 'Emerald Green (Trust & Govt)', hex: '#059669', light: '#ecfdf5', border: '#a7f3d0' },
  { id: 'navy', label: 'Midnight Navy (Executive)', hex: '#0f172a', light: '#f8fafc', border: '#cbd5e1' },
  { id: 'teal', label: 'Forest Teal (Modern SaaS)', hex: '#0d9488', light: '#f0fdfa', border: '#99f6e4' },
  { id: 'indigo', label: 'Tech Indigo (Software)', hex: '#4f46e5', light: '#eef2ff', border: '#c7d2fe' },
  { id: 'burgundy', label: 'Regal Burgundy (Academic)', hex: '#881337', light: '#fff1f2', border: '#fecdd3' }
];

const SAMPLE_RESUME_DATA = {
  personal: {
    fullName: "Muhammad Hamza Khan",
    title: "Senior Full Stack Engineer & Systems Architect",
    email: "hamza.khan@gmail.com",
    phone: "+92 300 1234567",
    city: "Islamabad, Pakistan",
    domicile: "Punjab (Rawalpindi District)",
    cnic: "37405-1234567-1",
    linkedin: "linkedin.com/in/hamzakhan-pk",
    github: "github.com/hamzakhan-dev",
    portfolio: "hamzakhan.dev",
    fatherName: "Tariq Mahmood Khan",
    dob: "14-Aug-1996",
    photoUrl: SAMPLE_PHOTO_URL
  },
  showPhoto: true,
  summary: "Results-driven Software Engineer with 5+ years of experience architecting high-scale web platforms, distributed microservices, and cloud systems. Proven track record delivering mission-critical applications across Pakistani enterprise and international fintech clients. Well-versed in civil service technical cadre standards and private tech benchmarks.",
  experience: [
    {
      id: "exp-1",
      role: "Senior Full Stack Engineer",
      company: "Systems Limited",
      location: "Islamabad (Hybrid)",
      startDate: "Jan 2023",
      endDate: "Present",
      description: "Led development of core banking API layer serving 2M+ daily active requests with 99.98% uptime. Mentored 6 junior engineers and migrated legacy monolithic services to Dockerized microservices on AWS (EKS & RDS)."
    },
    {
      id: "exp-2",
      role: "Software Developer",
      company: "Arbisoft",
      location: "Lahore",
      startDate: "Jul 2021",
      endDate: "Dec 2022",
      description: "Engineered responsive frontend interfaces in React & Next.js. Reduced page bundle load times by 42% through code-splitting, asset optimization, and CDN caching."
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "BS Computer Science (4 Years)",
      institution: "National University of Sciences and Technology (NUST), Islamabad",
      year: "2017 - 2021",
      grade: "CGPA: 3.82 / 4.0 (Dean's Honor List)"
    },
    {
      id: "edu-2",
      degree: "F.Sc (Pre-Engineering)",
      institution: "Punjab Group of Colleges, Rawalpindi",
      year: "2015 - 2017",
      grade: "Grade: A+ (945 / 1100) — 1st Division"
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "PakGovt Exam Tracker & Syllabus Scraper",
      tech: "Python, FastAPI, React, PostgreSQL",
      description: "Built automated alerting system indexing FPSC & PPSC gazettes with over 15,000 active monthly subscribers."
    }
  ],
  skills: [
    "JavaScript / TypeScript", "React & Next.js", "Node.js & Python", 
    "PostgreSQL & Redis", "Docker & Kubernetes", "AWS Cloud (EKS, RDS)", 
    "RESTful & GraphQL APIs", "Git & CI/CD Pipelines", "Public Administration"
  ],
  certifications: [
    "AWS Certified Solutions Architect – Associate (2024)",
    "FPSC Screening Aptitude Examination (92nd Percentile)",
    "PEC Registered Professional Engineer (COMP/14290)"
  ],
  languages: ["English (Professional)", "Urdu (Native / Bilingual)"]
};

export default function CvBuilder() {
  const [template, setTemplate] = useState('executive'); // 'executive' | 'govt' | 'tech'
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);
  const [resumeData, setResumeData] = useState(SAMPLE_RESUME_DATA);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'experience' | 'education' | 'projects' | 'skills'
  const [mobileViewMode, setMobileViewMode] = useState('editor'); // 'editor' | 'preview'
  const fileInputRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleLoadSample = () => {
    setResumeData(SAMPLE_RESUME_DATA);
  };

  const handleClear = () => {
    setResumeData({
      personal: {
        fullName: "",
        title: "",
        email: "",
        phone: "",
        city: "",
        domicile: "",
        cnic: "",
        linkedin: "",
        github: "",
        portfolio: "",
        fatherName: "",
        dob: "",
        photoUrl: ""
      },
      showPhoto: false,
      summary: "",
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
      languages: []
    });
  };

  // Profile Photo Upload Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file (JPG, PNG, or WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeData(prev => ({
        ...prev,
        showPhoto: true,
        personal: {
          ...prev.personal,
          photoUrl: event.target.result
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setResumeData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        photoUrl: ""
      }
    }));
  };

  // Add Dynamic Entries
  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: `exp-${Date.now()}`,
          role: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: ""
        }
      ]
    });
  };

  const updateExperience = (id, field, value) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  const removeExperience = (id) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(e => e.id !== id)
    });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: `edu-${Date.now()}`,
          degree: "",
          institution: "",
          year: "",
          grade: ""
        }
      ]
    });
  };

  const updateEducation = (id, field, value) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  const removeEducation = (id) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(e => e.id !== id)
    });
  };

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...(resumeData.projects || []),
        {
          id: `proj-${Date.now()}`,
          name: "",
          tech: "",
          description: ""
        }
      ]
    });
  };

  const updateProject = (id, field, value) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  const removeProject = (id) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter(p => p.id !== id)
    });
  };

  return (
    <div className="cv-builder-page-container">
      {/* Top Banner */}
      <div className="cv-builder-header no-print">
        <div className="container-xl">
          <div className="cv-header-flex">
            <div>
              <div className="badge badge-verified mb-2">
                <ShieldCheck size={13} />
                <span>Flagship 2026 Engine • 100% Free & ATS-Compliant</span>
              </div>
              <h1 className="cv-builder-title">Premium ATS Resume & CV Builder</h1>
              <p className="cv-builder-subtitle">
                Engineered for Pakistani Public Service Commissions (FPSC / PPSC) and Top Tech / Corporate Careers.
              </p>
            </div>

            <div className="cv-header-actions">
              <button className="btn btn-outline btn-sm" onClick={handleLoadSample}>
                <Sparkles size={14} className="text-emerald" />
                <span>Load Sample Data</span>
              </button>
              <button className="btn btn-outline btn-sm" onClick={handleClear}>
                <RotateCcw size={14} />
                <span>Clear</span>
              </button>
              <button className="btn btn-primary" onClick={handlePrint}>
                <Printer size={16} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>

          {/* Control Bar: Templates & Color Theme */}
          <div className="cv-customizer-toolbar">
            {/* Template Selector */}
            <div className="customizer-group">
              <span className="customizer-label">Template Design:</span>
              <div className="template-options-row">
                <button
                  className={`template-tab-btn ${template === 'executive' ? 'active' : ''}`}
                  onClick={() => setTemplate('executive')}
                >
                  1. Executive Minimalist (Corporate)
                </button>
                <button
                  className={`template-tab-btn ${template === 'govt' ? 'active' : ''}`}
                  onClick={() => setTemplate('govt')}
                >
                  2. Govt & Academic Standard (FPSC / PPSC)
                </button>
                <button
                  className={`template-tab-btn ${template === 'tech' ? 'active' : ''}`}
                  onClick={() => setTemplate('tech')}
                >
                  3. Modern Tech & Sidebar
                </button>
              </div>
            </div>

            {/* Accent Color Palette */}
            <div className="customizer-group">
              <span className="customizer-label">Theme Color:</span>
              <div className="color-swatches-row">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    className={`color-swatch-btn ${accentColor.id === c.id ? 'active' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setAccentColor(c)}
                    title={c.label}
                  >
                    {accentColor.id === c.id && <Check size={13} color="#ffffff" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Photo Toggle */}
            <div className="customizer-group">
              <label className="photo-toggle-label">
                <input
                  type="checkbox"
                  checked={resumeData.showPhoto}
                  onChange={(e) => setResumeData({ ...resumeData, showPhoto: e.target.checked })}
                  className="styled-checkbox"
                />
                <span className="photo-toggle-text">Show Profile Photo</span>
              </label>
            </div>
          </div>

          {/* Mobile View Toggle */}
          <div className="mobile-view-mode-bar">
            <button
              className={`mobile-view-btn ${mobileViewMode === 'editor' ? 'active' : ''}`}
              onClick={() => setMobileViewMode('editor')}
            >
              <Edit3 size={15} />
              <span>Edit CV Content</span>
            </button>
            <button
              className={`mobile-view-btn ${mobileViewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setMobileViewMode('preview')}
            >
              <Eye size={15} />
              <span>Live ATS Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="container-xl cv-workspace-grid">
        {/* LEFT COLUMN: FORM EDITOR */}
        <div className={`cv-editor-panel card no-print ${mobileViewMode === 'preview' ? 'mobile-hidden' : ''}`}>
          {/* Navigation Tabs */}
          <div className="editor-nav-tabs">
            <button 
              className={`editor-tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <User size={15} />
              <span>Personal</span>
            </button>
            <button 
              className={`editor-tab ${activeTab === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              <Briefcase size={15} />
              <span>Experience</span>
            </button>
            <button 
              className={`editor-tab ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              <GraduationCap size={15} />
              <span>Education</span>
            </button>
            <button 
              className={`editor-tab ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <FolderGit2 size={15} />
              <span>Projects</span>
            </button>
            <button 
              className={`editor-tab ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              <Award size={15} />
              <span>Skills & Certs</span>
            </button>
          </div>

          <div className="editor-tab-body">
            {/* TAB: Personal Info */}
            {activeTab === 'personal' && (
              <div className="form-section-stack">
                {/* Photo Upload Box */}
                <div className="photo-upload-container">
                  <div className="photo-preview-box">
                    {resumeData.personal.photoUrl ? (
                      <img src={resumeData.personal.photoUrl} alt="Preview" className="photo-img-preview" />
                    ) : (
                      <div className="photo-placeholder">
                        <Camera size={26} className="text-muted" />
                        <span>No Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="photo-upload-controls">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/png, image/jpeg, image/webp"
                      style={{ display: 'none' }}
                    />
                    <div className="photo-btns-row">
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={14} />
                        <span>Upload Photo</span>
                      </button>
                      {resumeData.personal.photoUrl && (
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline text-red"
                          onClick={handleRemovePhoto}
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <span className="photo-hint-text">
                      Recommended: Professional square or passport portrait (JPG, PNG, max 2MB).
                    </span>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Muhammad Hamza Khan"
                      value={resumeData.personal.fullName}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, fullName: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Target Title / Profession *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Senior Software Engineer"
                      value={resumeData.personal.title}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, title: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="e.g. hamza@gmail.com"
                      value={resumeData.personal.email}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, email: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number (Pakistan) *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="+92 300 1234567"
                      value={resumeData.personal.phone}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, phone: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>City & Address</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Islamabad, Pakistan"
                      value={resumeData.personal.city}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, city: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Domicile & District (Crucial for Govt)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Punjab (Rawalpindi District)"
                      value={resumeData.personal.domicile}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, domicile: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>CNIC Number (Govt Format)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="37405-1234567-1"
                      value={resumeData.personal.cnic}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, cnic: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Father's Name (Govt standard)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Tariq Mahmood Khan"
                      value={resumeData.personal.fatherName}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, fatherName: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>LinkedIn Profile</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="linkedin.com/in/username"
                      value={resumeData.personal.linkedin}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, linkedin: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label>GitHub / Portfolio URL</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="github.com/username"
                      value={resumeData.personal.github}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personal: { ...resumeData.personal, github: e.target.value }
                      })}
                    />
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="form-group">
                  <div className="form-label-with-tip">
                    <label>Professional Summary & Bio</label>
                    <span className="pro-tip-badge">
                      <Lightbulb size={12} />
                      <span>Pro-tip: 3–4 concise lines emphasizing key metrics & tech/govt eligibility</span>
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    className="input-field"
                    placeholder="Results-oriented professional with 5+ years of experience delivering measurable impact..."
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* TAB: Work Experience */}
            {activeTab === 'experience' && (
              <div className="form-section-stack">
                <div className="section-head-with-add">
                  <span className="form-label-bold">Work Experience & Positions</span>
                  <button className="btn btn-sm btn-primary" onClick={addExperience}>
                    <Plus size={14} />
                    <span>Add Position</span>
                  </button>
                </div>

                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="dynamic-entry-card">
                    <div className="entry-card-header">
                      <span className="entry-index-badge">Experience #{index + 1}</span>
                      <button className="delete-entry-btn" onClick={() => removeExperience(exp.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label>Job Title / Role</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Senior Software Engineer"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Company / Department</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Systems Limited / FIA"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Jan 2023"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Present"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Responsibilities & Quantified Achievements</label>
                      <textarea
                        rows={3}
                        className="input-field"
                        placeholder="Detail key responsibilities, scale of systems, and quantifiable achievements..."
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: Education */}
            {activeTab === 'education' && (
              <div className="form-section-stack">
                <div className="section-head-with-add">
                  <span className="form-label-bold">Academic Qualifications</span>
                  <button className="btn btn-sm btn-primary" onClick={addEducation}>
                    <Plus size={14} />
                    <span>Add Degree</span>
                  </button>
                </div>

                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} className="dynamic-entry-card">
                    <div className="entry-card-header">
                      <span className="entry-index-badge">Degree #{index + 1}</span>
                      <button className="delete-entry-btn" onClick={() => removeEducation(edu.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label>Degree / Certificate Title</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. BS Computer Science (4 Years)"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Institution / Board / University</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. NUST Islamabad"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label>Passing Year</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. 2017 - 2021"
                          value={edu.year}
                          onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Grade / CGPA / Division</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. CGPA: 3.82 / 4.0 or 1st Division"
                          value={edu.grade}
                          onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: Projects */}
            {activeTab === 'projects' && (
              <div className="form-section-stack">
                <div className="section-head-with-add">
                  <span className="form-label-bold">Key Projects & Open Source</span>
                  <button className="btn btn-sm btn-primary" onClick={addProject}>
                    <Plus size={14} />
                    <span>Add Project</span>
                  </button>
                </div>

                {(resumeData.projects || []).map((proj, index) => (
                  <div key={proj.id} className="dynamic-entry-card">
                    <div className="entry-card-header">
                      <span className="entry-index-badge">Project #{index + 1}</span>
                      <button className="delete-entry-btn" onClick={() => removeProject(proj.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label>Project Name</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Microservices Gateway"
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Technologies Used</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Python, Docker, React"
                          value={proj.tech}
                          onChange={(e) => updateProject(proj.id, 'tech', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Project Summary & Impact</label>
                      <textarea
                        rows={2}
                        className="input-field"
                        placeholder="Brief overview of problem solved and impact..."
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: Skills & Certs */}
            {activeTab === 'skills' && (
              <div className="form-section-stack">
                <div className="form-group">
                  <label>Skills & Competencies (Comma-separated)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="React, TypeScript, Python, Public Administration, Land Laws, SQL..."
                    value={resumeData.skills.join(', ')}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                  />
                  <span className="input-hint">Rendered as clean modern badge tags in the generated CV</span>
                </div>

                <div className="form-group">
                  <label>Certifications & Public Service Exams (One per line)</label>
                  <textarea
                    rows={4}
                    className="input-field"
                    placeholder="AWS Certified Solutions Architect&#10;FPSC Screening Examination Cleared&#10;PEC License Registration"
                    value={resumeData.certifications.join('\n')}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      certifications: e.target.value.split('\n').filter(Boolean)
                    })}
                  />
                </div>

                <div className="form-group">
                  <label>Languages (Comma-separated)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="English (Fluent), Urdu (Native), Punjabi"
                    value={(resumeData.languages || []).join(', ')}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE ATS RESUME PREVIEW */}
        <div className={`cv-preview-panel ${mobileViewMode === 'editor' ? 'mobile-hidden' : ''}`}>
          <div className="preview-toolbar no-print">
            <div className="preview-label">
              <Eye size={15} className="text-emerald" />
              <span>Live ATS Document Preview ({template.toUpperCase()} • {accentColor.id.toUpperCase()})</span>
            </div>
            <button className="btn btn-sm btn-primary" onClick={handlePrint}>
              <Download size={14} />
              <span>Download PDF</span>
            </button>
          </div>

          {/* Printable Document Paper */}
          <div 
            className={`printable-resume-sheet template-${template}`} 
            style={{ 
              '--cv-accent': accentColor.hex,
              '--cv-accent-light': accentColor.light,
              '--cv-accent-border': accentColor.border
            }}
          >
            {/* ====================================================================
               TEMPLATE 1: EXECUTIVE MINIMALIST (UNIVERSAL / CORPORATE)
               ==================================================================== */}
            {template === 'executive' && (
              <div className="resume-sheet-content executive-design">
                <header className="exec-header-grid">
                  <div className="exec-header-left">
                    <h1 className="exec-name" style={{ color: accentColor.hex }}>
                      {resumeData.personal.fullName || "Your Full Name"}
                    </h1>
                    <div className="exec-title">{resumeData.personal.title || "Professional Title"}</div>

                    {/* Micro-Contact Badges */}
                    <div className="exec-contact-row">
                      {resumeData.personal.email && (
                        <span className="exec-contact-item">
                          <Mail size={12} style={{ color: accentColor.hex }} />
                          {resumeData.personal.email}
                        </span>
                      )}
                      {resumeData.personal.phone && (
                        <span className="exec-contact-item">
                          <Phone size={12} style={{ color: accentColor.hex }} />
                          {resumeData.personal.phone}
                        </span>
                      )}
                      {resumeData.personal.city && (
                        <span className="exec-contact-item">
                          <MapPin size={12} style={{ color: accentColor.hex }} />
                          {resumeData.personal.city}
                        </span>
                      )}
                      {resumeData.personal.linkedin && (
                        <span className="exec-contact-item">
                          <Linkedin size={12} style={{ color: accentColor.hex }} />
                          {resumeData.personal.linkedin}
                        </span>
                      )}
                      {resumeData.personal.github && (
                        <span className="exec-contact-item">
                          <Github size={12} style={{ color: accentColor.hex }} />
                          {resumeData.personal.github}
                        </span>
                      )}
                    </div>
                  </div>

                  {resumeData.showPhoto && resumeData.personal.photoUrl && (
                    <div className="exec-photo-wrapper">
                      <img src={resumeData.personal.photoUrl} alt="Profile" className="exec-photo-img" />
                    </div>
                  )}
                </header>

                <div className="exec-divider-line" style={{ backgroundColor: accentColor.hex }} />

                {/* Summary */}
                {resumeData.summary && (
                  <section className="cv-sec-block">
                    <h2 className="cv-sec-title" style={{ color: accentColor.hex }}>Executive Summary</h2>
                    <p className="cv-sec-body">{resumeData.summary}</p>
                  </section>
                )}

                {/* Experience */}
                {resumeData.experience.length > 0 && (
                  <section className="cv-sec-block">
                    <h2 className="cv-sec-title" style={{ color: accentColor.hex }}>Work Experience</h2>
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="cv-item-block">
                        <div className="cv-item-header">
                          <strong className="cv-item-role">{exp.role || "Role"}</strong>
                          <span className="cv-item-dates">{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <div className="cv-item-sub">
                          <span className="company-bold">{exp.company}</span>
                          {exp.location && <span className="text-muted"> • {exp.location}</span>}
                        </div>
                        <p className="cv-item-desc">{exp.description}</p>
                      </div>
                    ))}
                  </section>
                )}

                {/* Projects */}
                {resumeData.projects && resumeData.projects.length > 0 && (
                  <section className="cv-sec-block">
                    <h2 className="cv-sec-title" style={{ color: accentColor.hex }}>Key Projects & Initiatives</h2>
                    {resumeData.projects.map((proj) => (
                      <div key={proj.id} className="cv-item-block">
                        <div className="cv-item-header">
                          <strong className="cv-item-role">{proj.name}</strong>
                          {proj.tech && <span className="cv-item-tech-tag">{proj.tech}</span>}
                        </div>
                        <p className="cv-item-desc">{proj.description}</p>
                      </div>
                    ))}
                  </section>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                  <section className="cv-sec-block">
                    <h2 className="cv-sec-title" style={{ color: accentColor.hex }}>Education & Qualifications</h2>
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="cv-item-block">
                        <div className="cv-item-header">
                          <strong className="cv-item-role">{edu.degree}</strong>
                          <span className="cv-item-dates">{edu.year}</span>
                        </div>
                        <div className="cv-item-sub">
                          <span>{edu.institution}</span>
                          {edu.grade && <span className="grade-highlight"> • {edu.grade}</span>}
                        </div>
                      </div>
                    ))}
                  </section>
                )}

                {/* Skills */}
                {resumeData.skills.length > 0 && (
                  <section className="cv-sec-block">
                    <h2 className="cv-sec-title" style={{ color: accentColor.hex }}>Core Competencies & Skills</h2>
                    <div className="cv-skills-pills-wrap">
                      {resumeData.skills.map((skill, idx) => (
                        <span key={idx} className="cv-skill-pill" style={{ borderColor: accentColor.border }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Certifications */}
                {resumeData.certifications.length > 0 && (
                  <section className="cv-sec-block">
                    <h2 className="cv-sec-title" style={{ color: accentColor.hex }}>Certifications & Honors</h2>
                    <ul className="cv-bullet-list">
                      {resumeData.certifications.map((cert, idx) => (
                        <li key={idx}>{cert}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            {/* ====================================================================
               TEMPLATE 2: GOVT & ACADEMIC STANDARD (FPSC / PPSC OFFICIAL)
               ==================================================================== */}
            {template === 'govt' && (
              <div className="resume-sheet-content govt-design">
                {/* Official Header */}
                <header className="govt-header-box">
                  <div className="govt-header-top">
                    <div className="govt-header-title-col">
                      <div className="govt-cv-title-tag">CURRICULUM VITAE (PAKISTAN PUBLIC SERVICE CADRE)</div>
                      <h1 className="govt-full-name">{resumeData.personal.fullName || "FULL NAME"}</h1>
                      <div className="govt-post-applied">{resumeData.personal.title || "CANDIDATE"}</div>
                    </div>

                    {resumeData.showPhoto && resumeData.personal.photoUrl && (
                      <div className="govt-photo-frame">
                        <img src={resumeData.personal.photoUrl} alt="Passport Photo" className="govt-photo-img" />
                        <span className="photo-frame-lbl">Passport Size Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Statutory Credential Grid */}
                  <div className="govt-credential-grid">
                    <div className="cred-item"><strong>Father's Name:</strong> {resumeData.personal.fatherName || "N/A"}</div>
                    <div className="cred-item"><strong>CNIC Number:</strong> {resumeData.personal.cnic || "N/A"}</div>
                    <div className="cred-item"><strong>Domicile & District:</strong> {resumeData.personal.domicile || "N/A"}</div>
                    <div className="cred-item"><strong>Contact Number:</strong> {resumeData.personal.phone || "N/A"}</div>
                    <div className="cred-item"><strong>Email Address:</strong> {resumeData.personal.email || "N/A"}</div>
                    <div className="cred-item"><strong>Postal Address:</strong> {resumeData.personal.city || "N/A"}</div>
                  </div>
                </header>

                {/* 1. Academic Record Table */}
                {resumeData.education.length > 0 && (
                  <section className="govt-section">
                    <h2 className="govt-sec-heading">1. ACADEMIC & EDUCATIONAL QUALIFICATIONS</h2>
                    <table className="govt-formal-table">
                      <thead>
                        <tr>
                          <th style={{ width: '32%' }}>Degree / Certificate</th>
                          <th style={{ width: '36%' }}>Board / University</th>
                          <th style={{ width: '14%' }}>Passing Year</th>
                          <th style={{ width: '18%' }}>Division / CGPA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumeData.education.map((edu) => (
                          <tr key={edu.id}>
                            <td><strong>{edu.degree}</strong></td>
                            <td>{edu.institution}</td>
                            <td>{edu.year}</td>
                            <td>{edu.grade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                )}

                {/* 2. Employment History */}
                {resumeData.experience.length > 0 && (
                  <section className="govt-section">
                    <h2 className="govt-sec-heading">2. RECORD OF PUBLIC / PRIVATE EMPLOYMENT</h2>
                    <div className="govt-exp-list">
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="govt-exp-card">
                          <div className="govt-exp-top-row">
                            <span className="role-bold">{exp.role}</span>
                            <span className="org-italic">{exp.company}</span>
                            <span className="period-tag">({exp.startDate} – {exp.endDate})</span>
                          </div>
                          <p className="govt-desc-p">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 3. Skills */}
                {resumeData.skills.length > 0 && (
                  <section className="govt-section">
                    <h2 className="govt-sec-heading">3. PROFESSIONAL SKILLS & DOMAIN KNOWLEDGE</h2>
                    <p className="govt-inline-skills">{resumeData.skills.join('  •  ')}</p>
                  </section>
                )}

                {/* 4. Certifications */}
                {resumeData.certifications.length > 0 && (
                  <section className="govt-section">
                    <h2 className="govt-sec-heading">4. STATUTORY CERTIFICATIONS & REGISTRATIONS</h2>
                    <ul className="govt-bullet-ul">
                      {resumeData.certifications.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Declaration */}
                <div className="govt-declaration-block">
                  <p>
                    <em>I hereby solemnly affirm that the facts mentioned above are true, complete and correct to the best of my knowledge and belief.</em>
                  </p>
                  <div className="govt-signature-row">
                    <span>Date: ____________________</span>
                    <span>Signature of Candidate: ____________________</span>
                  </div>
                </div>
              </div>
            )}

            {/* ====================================================================
               TEMPLATE 3: MODERN TECH & SOFTWARE (SIDEBAR LAYOUT)
               ==================================================================== */}
            {template === 'tech' && (
              <div className="resume-sheet-content tech-sidebar-design">
                {/* LEFT SIDEBAR */}
                <aside className="tech-left-sidebar" style={{ backgroundColor: accentColor.light, borderColor: accentColor.border }}>
                  {resumeData.showPhoto && resumeData.personal.photoUrl && (
                    <div className="tech-avatar-box">
                      <img src={resumeData.personal.photoUrl} alt="Avatar" className="tech-avatar-img" />
                    </div>
                  )}

                  <div className="tech-side-contact-block">
                    <h3 className="tech-side-title" style={{ color: accentColor.hex }}>Contact</h3>
                    {resumeData.personal.email && (
                      <div className="tech-side-contact-item">
                        <Mail size={12} />
                        <span>{resumeData.personal.email}</span>
                      </div>
                    )}
                    {resumeData.personal.phone && (
                      <div className="tech-side-contact-item">
                        <Phone size={12} />
                        <span>{resumeData.personal.phone}</span>
                      </div>
                    )}
                    {resumeData.personal.city && (
                      <div className="tech-side-contact-item">
                        <MapPin size={12} />
                        <span>{resumeData.personal.city}</span>
                      </div>
                    )}
                    {resumeData.personal.linkedin && (
                      <div className="tech-side-contact-item">
                        <Linkedin size={12} />
                        <span>{resumeData.personal.linkedin}</span>
                      </div>
                    )}
                    {resumeData.personal.github && (
                      <div className="tech-side-contact-item">
                        <Github size={12} />
                        <span>{resumeData.personal.github}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills Cloud */}
                  {resumeData.skills.length > 0 && (
                    <div className="tech-side-section">
                      <h3 className="tech-side-title" style={{ color: accentColor.hex }}>Core Stack</h3>
                      <div className="tech-skill-cloud">
                        {resumeData.skills.map((s, idx) => (
                          <span key={idx} className="tech-skill-chip" style={{ borderColor: accentColor.border }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {resumeData.certifications.length > 0 && (
                    <div className="tech-side-section">
                      <h3 className="tech-side-title" style={{ color: accentColor.hex }}>Certifications</h3>
                      <ul className="tech-cert-list">
                        {resumeData.certifications.map((cert, idx) => (
                          <li key={idx}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Languages */}
                  {resumeData.languages && resumeData.languages.length > 0 && (
                    <div className="tech-side-section">
                      <h3 className="tech-side-title" style={{ color: accentColor.hex }}>Languages</h3>
                      <div className="tech-lang-list">
                        {resumeData.languages.map((l, idx) => (
                          <div key={idx} className="tech-lang-item">{l}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>

                {/* RIGHT MAIN CONTENT */}
                <main className="tech-main-content">
                  <header className="tech-header-block">
                    <h1 className="tech-name" style={{ color: accentColor.hex }}>
                      {resumeData.personal.fullName || "Your Full Name"}
                    </h1>
                    <div className="tech-role-tag">{resumeData.personal.title || "Full Stack Engineer"}</div>
                  </header>

                  {/* Summary */}
                  {resumeData.summary && (
                    <section className="tech-content-section">
                      <h2 className="tech-section-h" style={{ color: accentColor.hex }}>About</h2>
                      <p className="tech-bio-p">{resumeData.summary}</p>
                    </section>
                  )}

                  {/* Experience */}
                  {resumeData.experience.length > 0 && (
                    <section className="tech-content-section">
                      <h2 className="tech-section-h" style={{ color: accentColor.hex }}>Experience</h2>
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="tech-exp-row">
                          <div className="tech-exp-meta">
                            <strong className="tech-exp-role">{exp.role}</strong>
                            <span className="tech-exp-duration">{exp.startDate} – {exp.endDate}</span>
                          </div>
                          <div className="tech-exp-org">
                            <span>{exp.company}</span>
                            {exp.location && <span className="text-muted"> • {exp.location}</span>}
                          </div>
                          <p className="tech-exp-desc">{exp.description}</p>
                        </div>
                      ))}
                    </section>
                  )}

                  {/* Projects */}
                  {resumeData.projects && resumeData.projects.length > 0 && (
                    <section className="tech-content-section">
                      <h2 className="tech-section-h" style={{ color: accentColor.hex }}>Key Projects</h2>
                      {resumeData.projects.map((p) => (
                        <div key={p.id} className="tech-exp-row">
                          <div className="tech-exp-meta">
                            <strong className="tech-exp-role">{p.name}</strong>
                            {p.tech && <span className="tech-badge">{p.tech}</span>}
                          </div>
                          <p className="tech-exp-desc">{p.description}</p>
                        </div>
                      ))}
                    </section>
                  )}

                  {/* Education */}
                  {resumeData.education.length > 0 && (
                    <section className="tech-content-section">
                      <h2 className="tech-section-h" style={{ color: accentColor.hex }}>Education</h2>
                      {resumeData.education.map((edu) => (
                        <div key={edu.id} className="tech-exp-row">
                          <div className="tech-exp-meta">
                            <strong className="tech-exp-role">{edu.degree}</strong>
                            <span className="tech-exp-duration">{edu.year}</span>
                          </div>
                          <div className="tech-exp-org">{edu.institution} • {edu.grade}</div>
                        </div>
                      ))}
                    </section>
                  )}
                </main>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
