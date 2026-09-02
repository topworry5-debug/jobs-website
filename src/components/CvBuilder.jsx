'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  Award, 
  Languages, 
  Download, 
  Printer, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Check, 
  CheckCircle2, 
  X, 
  Upload, 
  Camera, 
  Eye, 
  Edit3, 
  AlertCircle, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone, 
  Linkedin, 
  Globe, 
  ExternalLink,
  Layers,
  Palette,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LOCAL_STORAGE_KEY = 'rozgar_cv_data';

// Skill Suggestion Knowledge Base for Pakistani Career Categories
const SKILL_SUGGESTIONS = {
  govt: {
    category: "Government & Public Administration",
    matchKeywords: ['govt', 'officer', 'assistant', 'bps', 'inspector', 'admin', 'revenue', 'commissioner', 'clerk', 'secretariat', 'css', 'pms'],
    skills: [
      "Public Policy Analysis", "Official Correspondence", "Rules of Business 1973", 
      "Civil Service Regulations", "Budget Allocation & Auditing", "Secretariat Procedures", 
      "Urdu & English Drafting", "File & Record Management", "Public Procurement (PPRA Rules)", 
      "E-Office Management System", "Inter-Departmental Coordination", "Public Relations"
    ]
  },
  tech: {
    category: "IT & Software Engineering",
    matchKeywords: ['developer', 'software', 'engineer', 'frontend', 'backend', 'full stack', 'react', 'python', 'java', 'web', 'data', 'cloud'],
    skills: [
      "JavaScript / TypeScript", "React.js & Next.js", "Node.js & Express", 
      "Python & Django", "RESTful & GraphQL APIs", "PostgreSQL & MongoDB", 
      "Docker & Kubernetes", "AWS Cloud Services", "Git & CI/CD Pipelines", 
      "Microservices Architecture", "Tailwind CSS", "Unit Testing (Jest)"
    ]
  },
  engineering: {
    category: "Engineering & Technical",
    matchKeywords: ['engineer', 'civil', 'electrical', 'mechanical', 'structural', 'autocad', 'site'],
    skills: [
      "AutoCAD & SolidWorks", "Project Planning & Primavera P6", "Site Supervision", 
      "Quality Assurance & Inspection", "PEC Code Compliance", "BOQ & Cost Estimation", 
      "Circuit Analysis & PCB Design", "Health & Safety (HSE Standards)", "Structural Analysis"
    ]
  },
  finance: {
    category: "Finance & Accounting",
    matchKeywords: ['finance', 'accountant', 'audit', 'bank', 'banking', 'tax', 'accounts'],
    skills: [
      "Financial Modeling", "Tax Filing & FBR Compliance", "Internal & External Auditing", 
      "State Bank of Pakistan (SBP) Regulations", "QuickBooks & Tally", "Balance Sheet Analysis", 
      "Cost Accounting & Budgeting", "Risk Management", "Payroll Administration"
    ]
  },
  healthcare: {
    category: "Healthcare & Medicine",
    matchKeywords: ['doctor', 'nurse', 'medical', 'mbbs', 'pharmacist', 'hospital', 'clinical'],
    skills: [
      "Clinical Diagnostics", "Patient Care & Monitoring", "Emergency Medicine Protocol", 
      "PMDC / PMC Regulations", "Pharmacology & Dosage Calculation", "Electronic Health Records (EHR)", 
      "Infection Control & Sterilization", "Surgical Assistance", "Medical Ethics"
    ]
  }
};

const SAMPLE_PHOTO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230B3D2E'/%3E%3Cstop offset='100%25' stop-color='%231B7458'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23g)'/%3E%3Ccircle cx='100' cy='75' r='38' fill='%23FAF8F3' opacity='0.95'/%3E%3Cpath d='M30 185 C30 135, 70 120, 100 120 C130 120, 170 135, 170 185 Z' fill='%23FAF8F3' opacity='0.95'/%3E%3C/svg%3E";

const SAMPLE_DATA = {
  personal: {
    fullName: "Muhammad Usman Ali",
    title: "Assistant Director (General Cadre / BPS-17)",
    email: "usman.ali@email.com",
    phone: "+92 300 1234567",
    city: "Islamabad",
    domicile: "Punjab (Rawalpindi District)",
    cnic: "37405-1234567-1",
    linkedin: "linkedin.com/in/usman-ali-pk",
    portfolio: "usmanali.dev",
    photoUrl: SAMPLE_PHOTO,
    showPhoto: true
  },
  summary: "Dedicated and result-oriented public administration professional with 4+ years of institutional experience in regulatory compliance, civil secretariat operations, and digital governance initiatives. Proven ability to draft official gazettes, coordinate inter-provincial public sector projects, and maintain high standards of accountability under Federal Service Rules.",
  experience: [
    {
      id: "exp-1",
      role: "Assistant Director (Operations)",
      company: "Ministry of Federal Education & Professional Training",
      city: "Islamabad",
      startDate: "Jan 2023",
      endDate: "Present",
      current: true,
      description: "• Spearheaded digitization of curriculum inspection logs across 42 federal institutes, reducing review turnaround by 35%.\n• Drafted 18+ official summaries and notifications for Cabinet approval in compliance with Rules of Business 1973.\n• Monitored budgetary execution of PKR 450M allocated to national scholarship programs with zero audit objections."
    },
    {
      id: "exp-2",
      role: "Administrative Officer (BPS-16)",
      company: "Higher Education Commission (HEC)",
      city: "Islamabad",
      startDate: "Aug 2020",
      endDate: "Dec 2022",
      current: false,
      description: "• Managed degree verification correspondence for 12,000+ national and overseas applicants annually.\n• Coordinated with provincial universities to implement standardized degree equivalence criteria."
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Master of Public Administration (MPA)",
      institution: "Quaid-i-Azam University (QAU), Islamabad",
      city: "Islamabad",
      year: "2018 - 2020",
      grade: "CGPA: 3.75 / 4.00 (First Division)"
    },
    {
      id: "edu-2",
      degree: "B.Sc (Hons) Economics & Political Science",
      institution: "Government College University (GCU), Lahore",
      city: "Lahore",
      year: "2014 - 2018",
      grade: "CGPA: 3.60 / 4.00"
    }
  ],
  skills: [
    "Public Policy Analysis", "Rules of Business 1973", "Official Correspondence", 
    "Civil Service Regulations", "Budget Planning & Execution", "PPRA Procurement Rules", 
    "E-Office Systems", "Inter-Departmental Coordination", "Urdu & English Drafting"
  ],
  certifications: [
    {
      id: "cert-1",
      name: "National Institute of Management Certificate in Public Sector Governance",
      issuer: "NIM / NSPP",
      year: "2023"
    },
    {
      id: "cert-2",
      name: "Public Procurement Regulatory Authority (PPRA) Basic Certification",
      issuer: "Federal PPRA Authority",
      year: "2022"
    }
  ],
  languages: [
    { id: "lang-1", name: "English", level: "Professional Working Proficiency" },
    { id: "lang-2", name: "Urdu", level: "Native / Bilingual" },
    { id: "lang-3", name: "Punjabi", level: "Conversational" }
  ]
};

const INITIAL_EMPTY_DATA = {
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    city: "",
    domicile: "",
    cnic: "",
    linkedin: "",
    portfolio: "",
    photoUrl: "",
    showPhoto: false
  },
  summary: "",
  experience: [
    { id: "exp-0", role: "", company: "", city: "", startDate: "", endDate: "", current: false, description: "" }
  ],
  education: [
    { id: "edu-0", degree: "", institution: "", city: "", year: "", grade: "" }
  ],
  skills: [],
  certifications: [
    { id: "cert-0", name: "", issuer: "", year: "" }
  ],
  languages: [
    { id: "lang-0", name: "English", level: "Professional" },
    { id: "lang-1", name: "Urdu", level: "Native" }
  ]
};

const STEPS = [
  { id: 1, key: 'personal', title: 'Personal Info', icon: User },
  { id: 2, key: 'summary', title: 'Summary', icon: FileText },
  { id: 3, key: 'experience', title: 'Experience', icon: Briefcase },
  { id: 4, key: 'education', title: 'Education', icon: GraduationCap },
  { id: 5, key: 'skills', title: 'Skills', icon: Sparkles },
  { id: 6, key: 'certifications', title: 'Certifications', icon: Award },
  { id: 7, key: 'languages', title: 'Languages', icon: Languages },
  { id: 8, key: 'preview', title: 'Preview & Export', icon: Eye }
];

const TEMPLATES = [
  { id: 'classic', name: 'Classic Professional', desc: 'Single-column traditional layout with maximum ATS parsing score.' },
  { id: 'modern', name: 'Modern Minimal', desc: 'Editorial layout with subtle emerald subheaders and clean spec matrix.' },
  { id: 'govt', name: 'Government / Formal', desc: 'Pakistani civil service format with father name, CNIC, and domicile quota.' }
];

const ACCENT_COLORS = [
  { id: 'forest', name: 'Forest Emerald', hex: '#0B3D2E' },
  { id: 'gold', name: 'Muted Gold', hex: '#C9A227' },
  { id: 'navy', name: 'Executive Navy', hex: '#0F172A' },
  { id: 'burgundy', name: 'Regal Burgundy', hex: '#881337' }
];

export default function CvBuilder() {
  const { t, isRtl } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [selectedColor, setSelectedColor] = useState(ACCENT_COLORS[0]);
  const [mobileView, setMobileView] = useState('form'); // 'form' | 'preview'
  const [isExporting, setIsExporting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);

  // Resume Data State with LocalStorage Loading
  const [cvData, setCvData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to load local CV data", e);
      }
    }
    return SAMPLE_DATA;
  });

  // Debounced Live Preview State (150ms)
  const [debouncedData, setDebouncedData] = useState(cvData);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedData(cvData);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cvData));
      } catch (e) {}
    }, 150);

    return () => clearTimeout(handler);
  }, [cvData]);

  // Determine Recommended Skill Bundles based on current Job Title / Headline
  const getRelevantSkillBundle = () => {
    const title = (cvData.personal?.title || '').toLowerCase();
    for (const key in SKILL_SUGGESTIONS) {
      const bundle = SKILL_SUGGESTIONS[key];
      if (bundle.matchKeywords.some(kw => title.includes(kw))) {
        return bundle;
      }
    }
    return SKILL_SUGGESTIONS.govt; // Default for Pakistani public authority
  };

  const currentBundle = getRelevantSkillBundle();

  // Inline Validation for Current Step
  const validateCurrentStep = () => {
    const errors = {};
    if (currentStep === 1) {
      if (!cvData.personal.fullName?.trim()) {
        errors.fullName = "Full name is required";
      }
      if (!cvData.personal.title?.trim()) {
        errors.title = "Target job title / headline is required";
      }
      if (!cvData.personal.email?.trim()) {
        errors.email = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cvData.personal.email)) {
        errors.email = "Please enter a valid email format";
      }
      if (!cvData.personal.phone?.trim()) {
        errors.phone = "Phone number is required";
      }
      if (!cvData.personal.city?.trim()) {
        errors.city = "City is required";
      }
    } else if (currentStep === 2) {
      if (!cvData.summary?.trim()) {
        errors.summary = "A brief professional summary is recommended for ATS score";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 8) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 180, behavior: 'smooth' });
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  // Field Updater Helpers
  const updatePersonalInfo = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Profile Photo Upload Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCvData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          photoUrl: event.target.result,
          showPhoto: true
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setCvData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        photoUrl: "",
        showPhoto: false
      }
    }));
  };

  // Experience Handlers
  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp-${Date.now()}`,
          role: "",
          company: "",
          city: "",
          startDate: "",
          endDate: "",
          current: false,
          description: ""
        }
      ]
    }));
  };

  const updateExperience = (index, field, value) => {
    setCvData(prev => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const removeExperience = (index) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Education Handlers
  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          degree: "",
          institution: "",
          city: "",
          year: "",
          grade: ""
        }
      ]
    }));
  };

  const updateEducation = (index, field, value) => {
    setCvData(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const removeEducation = (index) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Skills Tag Input Handlers
  const handleAddSkill = (skillText) => {
    const trimmed = (skillText || skillInput).trim();
    if (trimmed && !cvData.skills.includes(trimmed)) {
      setCvData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmed]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Certifications Handlers
  const addCertification = () => {
    setCvData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: `cert-${Date.now()}`, name: "", issuer: "", year: "" }
      ]
    }));
  };

  const updateCertification = (index, field, value) => {
    setCvData(prev => {
      const updated = [...prev.certifications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, certifications: updated };
    });
  };

  const removeCertification = (index) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  // Languages Handlers
  const addLanguage = () => {
    setCvData(prev => ({
      ...prev,
      languages: [
        ...prev.languages,
        { id: `lang-${Date.now()}`, name: "", level: "Professional" }
      ]
    }));
  };

  const updateLanguage = (index, field, value) => {
    setCvData(prev => {
      const updated = [...prev.languages];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, languages: updated };
    });
  };

  const removeLanguage = (index) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // Start Over / Reset Handlers
  const handleStartOver = () => {
    setCvData(INITIAL_EMPTY_DATA);
    setCurrentStep(1);
    setShowConfirmReset(false);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {}
  };

  const handleLoadSample = () => {
    setCvData(SAMPLE_DATA);
    setFormErrors({});
  };

  // Lazy-Loaded High-Res PDF Export
  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);

    try {
      // Dynamically import html2pdf only when requested
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const element = previewRef.current;
      const fileName = `${cvData.personal.fullName ? cvData.personal.fullName.replace(/\s+/g, '_') : 'Resume'}_CV_RozgarPK.pdf`;

      const opt = {
        margin: [8, 8, 8, 8],
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Export error, falling back to print", error);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="cv-builder-root">
      {/* Top Value Header */}
      <div className="cv-builder-hero mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="badge badge-verified">
                <ShieldCheck size={13} />
                <span>HEC & Gazette ATS Standard</span>
              </span>
              <span className="text-xs text-muted font-medium">Free Vector PDF Export</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-primary">
              Institutional ATS Resume Builder
            </h1>
            <p className="text-xs md:text-sm text-secondary max-w-2xl mt-1 leading-relaxed">
              Craft a verified Pakistani government (BPS-11 to BPS-21) and enterprise-ready resume with provincial quota, HEC education breakdown, and action-oriented achievements.
            </p>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              type="button" 
              onClick={handleLoadSample}
              className="btn btn-outline btn-sm text-xs"
              title="Preload authentic Pakistani civil service & tech credentials"
            >
              <Sparkles size={14} className="text-gold-accent" />
              <span>Load Sample</span>
            </button>
            <button 
              type="button" 
              onClick={() => setShowConfirmReset(true)}
              className="btn btn-outline btn-sm text-xs text-muted hover:text-red-500"
              title="Wipe form and start fresh"
            >
              <RotateCcw size={14} />
              <span>Start Over</span>
            </button>
          </div>
        </div>

        {/* Mobile Viewport Segmented Switch */}
        <div className="mobile-view-toggle-bar mt-4 lg:hidden">
          <button
            type="button"
            className={`mobile-view-tab ${mobileView === 'form' ? 'active' : ''}`}
            onClick={() => setMobileView('form')}
          >
            <Edit3 size={15} />
            <span>Edit Form (Step {currentStep}/8)</span>
          </button>
          <button
            type="button"
            className={`mobile-view-tab ${mobileView === 'preview' ? 'active' : ''}`}
            onClick={() => setMobileView('preview')}
          >
            <Eye size={15} />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Multi-Step Progress Stepper */}
      <div className="cv-stepper-container mb-6">
        <div className="cv-stepper-track">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <button
                key={step.id}
                type="button"
                className={`cv-step-pill ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => {
                  if (validateCurrentStep()) setCurrentStep(step.id);
                }}
              >
                <div className="cv-step-icon-box">
                  {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <span className="cv-step-label">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Builder Grid: Form Editor (Left) & Real-Time A4 Preview (Right) */}
      <div className="cv-builder-grid">
        {/* LEFT COLUMN: Guided Step Form */}
        <div className={`cv-form-panel ${mobileView === 'preview' ? 'hidden-on-mobile' : ''}`}>
          <div className="cv-card card p-6">
            {/* Step Header */}
            <div className="flex items-center justify-between border-b border-subtle pb-4 mb-5">
              <div>
                <span className="text-[11px] font-mono font-bold text-muted uppercase tracking-wider">
                  Step {currentStep} of 8
                </span>
                <h2 className="text-xl font-bold font-display text-primary mt-0.5">
                  {STEPS[currentStep - 1].title}
                </h2>
              </div>
              <div className="text-xs text-secondary font-medium">
                Auto-saved locally ✓
              </div>
            </div>

            {/* STEP 1: PERSONAL INFO */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                {/* Photo Upload & Preview Row */}
                <div className="photo-upload-row flex items-center gap-4 p-4 rounded-lg bg-surface-subtle border border-subtle">
                  <div className="photo-preview-box">
                    {cvData.personal.photoUrl ? (
                      <img 
                        src={cvData.personal.photoUrl} 
                        alt="Profile Preview" 
                        style={{ width: '60px', height: '60px', minWidth: '60px', minHeight: '60px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid var(--emerald-500)' }}
                      />
                    ) : (
                      <div style={{ width: '60px', height: '60px', minWidth: '60px', minHeight: '60px', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }} className="text-muted">
                        <Camera size={22} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-primary block">Passport Photo (Optional)</span>
                    <span className="text-[11px] text-muted block mb-2">Standard for Pakistani government dossiers & medical registrations</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-outline btn-sm py-1 px-2.5 text-xs"
                      >
                        <Upload size={12} />
                        <span>Upload Photo</span>
                      </button>
                      {cvData.personal.photoUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="btn btn-outline btn-sm py-1 px-2.5 text-xs text-red-500 hover:text-red-600"
                        >
                          <X size={12} />
                          <span>Remove</span>
                        </button>
                      )}
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={handlePhotoUpload} 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`input-field ${formErrors.fullName ? 'border-red-500' : ''}`}
                      placeholder="e.g. Muhammad Usman Ali"
                      value={cvData.personal.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    />
                    {formErrors.fullName && <p className="form-error-msg">{formErrors.fullName}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Professional Headline / Target Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`input-field ${formErrors.title ? 'border-red-500' : ''}`}
                      placeholder="e.g. Assistant Director (BPS-17) / Software Engineer"
                      value={cvData.personal.title}
                      onChange={(e) => updatePersonalInfo('title', e.target.value)}
                    />
                    {formErrors.title && <p className="form-error-msg">{formErrors.title}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className={`input-field ${formErrors.email ? 'border-red-500' : ''}`}
                      placeholder="usman.ali@example.com"
                      value={cvData.personal.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    />
                    {formErrors.email && <p className="form-error-msg">{formErrors.email}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Mobile / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`input-field ${formErrors.phone ? 'border-red-500' : ''}`}
                      placeholder="+92 300 1234567"
                      value={cvData.personal.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    />
                    {formErrors.phone && <p className="form-error-msg">{formErrors.phone}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      City of Residence <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`input-field ${formErrors.city ? 'border-red-500' : ''}`}
                      placeholder="e.g. Islamabad, Lahore, Karachi"
                      value={cvData.personal.city}
                      onChange={(e) => updatePersonalInfo('city', e.target.value)}
                    />
                    {formErrors.city && <p className="form-error-msg">{formErrors.city}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Provincial Domicile & District <span className="text-xs text-muted font-normal">(Govt Quota)</span>
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Punjab (Rawalpindi District)"
                      value={cvData.personal.domicile}
                      onChange={(e) => updatePersonalInfo('domicile', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      CNIC Number <span className="text-xs text-muted font-normal">(Optional for civil service)</span>
                    </label>
                    <input
                      type="text"
                      className="input-field font-mono"
                      placeholder="37405-1234567-1"
                      value={cvData.personal.cnic}
                      onChange={(e) => updatePersonalInfo('cnic', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      LinkedIn / Public Profile URL
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="linkedin.com/in/username"
                      value={cvData.personal.linkedin}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PROFESSIONAL SUMMARY */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3.5 rounded-lg bg-surface-subtle border border-subtle flex items-start gap-3">
                  <Info size={18} className="text-emerald mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-secondary leading-relaxed">
                    <strong>ATS Best Practice:</strong> Keep summary to 3–4 concise sentences. Highlight your core domain (e.g. public sector administration, full stack development), years of experience, and your strongest competitive credential.
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label flex items-center justify-between">
                    <span>Executive Summary Statement</span>
                    <span className="text-xs text-muted">
                      {cvData.summary.length} characters
                    </span>
                  </label>
                  <textarea
                    rows={6}
                    className={`input-field ${formErrors.summary ? 'border-red-500' : ''}`}
                    placeholder="Results-driven professional with X years of experience leading projects in..."
                    value={cvData.summary}
                    onChange={(e) => {
                      setCvData(prev => ({ ...prev, summary: e.target.value }));
                      if (formErrors.summary) setFormErrors(prev => ({ ...prev, summary: null }));
                    }}
                  />
                  {formErrors.summary && <p className="form-error-msg">{formErrors.summary}</p>}
                </div>

                {/* Quick Insert Starter Snippets */}
                <div className="summary-suggestions mt-2">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">
                    Quick Insert Starters:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="suggestion-chip text-xs"
                      onClick={() => setCvData(prev => ({
                        ...prev,
                        summary: prev.summary + (prev.summary ? " " : "") + "Proven track record delivering mission-critical public deliverables in compliance with statutory frameworks."
                      }))}
                    >
                      + Compliance & Statutory Track Record
                    </button>
                    <button
                      type="button"
                      className="suggestion-chip text-xs"
                      onClick={() => setCvData(prev => ({
                        ...prev,
                        summary: prev.summary + (prev.summary ? " " : "") + "Recognized for streamlining departmental workflows and achieving measurable reductions in administrative turnaround times."
                      }))}
                    >
                      + Administrative Streamlining
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: WORK EXPERIENCE */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-secondary">
                    Add your previous and current professional roles in reverse chronological order.
                  </p>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="btn btn-outline btn-sm py-1 px-3 text-xs"
                  >
                    <Plus size={13} />
                    <span>Add Role</span>
                  </button>
                </div>

                {cvData.experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="repeatable-card card p-4 border border-subtle relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge badge-bps text-xs font-bold">
                        Position #{idx + 1}
                      </span>
                      {cvData.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(idx)}
                          className="action-btn-sm text-red-500 hover:text-red-700"
                          title="Remove position"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="form-group">
                        <label className="form-label">Job Title / Designation *</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Senior Software Engineer / Assistant Director"
                          value={exp.role}
                          onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Organization / Department *</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Ministry of Finance / Systems Limited"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Location / City</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Islamabad (Hybrid)"
                          value={exp.city}
                          onChange={(e) => updateExperience(idx, 'city', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="form-group">
                          <label className="form-label">Start Date</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. Jan 2022"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">End Date</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder={exp.current ? "Present" : "e.g. Dec 2023"}
                            disabled={exp.current}
                            value={exp.current ? "Present" : exp.endDate}
                            onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        id={`current-job-${idx}`}
                        checked={exp.current || false}
                        onChange={(e) => updateExperience(idx, 'current', e.target.checked)}
                        className="rounded text-emerald"
                      />
                      <label htmlFor={`current-job-${idx}`} className="text-xs font-semibold cursor-pointer">
                        Currently working in this role
                      </label>
                    </div>

                    <div className="form-group">
                      <div className="flex items-center justify-between mb-1">
                        <label className="form-label mb-0">Key Responsibilities & Measurable Achievements</label>
                        <span className="text-[11px] text-muted">Use bullet points (•)</span>
                      </div>
                      <textarea
                        rows={4}
                        className="input-field text-xs font-sans leading-relaxed"
                        placeholder="• Spearheaded departmental audit reconciliation, resulting in 100% compliance.&#10;• Led cross-functional team of 6 officers, processing 5,000+ public complaints under citizen portal.&#10;• Reduced filing latency by 25% via e-Office automation."
                        value={exp.description}
                        onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 4: EDUCATION */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-secondary">
                    List your academic degrees in reverse chronological order (HEC recognized qualifications).
                  </p>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="btn btn-outline btn-sm py-1 px-3 text-xs"
                  >
                    <Plus size={13} />
                    <span>Add Degree</span>
                  </button>
                </div>

                {cvData.education.map((edu, idx) => (
                  <div key={edu.id || idx} className="repeatable-card card p-4 border border-subtle relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge badge-bps text-xs font-bold">
                        Academic Qualification #{idx + 1}
                      </span>
                      {cvData.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="action-btn-sm text-red-500 hover:text-red-700"
                          title="Remove degree"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="form-group">
                        <label className="form-label">Degree / Certificate *</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Master of Public Administration (MPA) / BS CS"
                          value={edu.degree}
                          onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">University / Board / Institution *</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Quaid-i-Azam University (QAU), Islamabad"
                          value={edu.institution}
                          onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Graduation Year / Period</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. 2018 - 2022"
                          value={edu.year}
                          onChange={(e) => updateEducation(idx, 'year', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Grade / CGPA / Division</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. CGPA: 3.8 / 4.0 (1st Division)"
                          value={edu.grade}
                          onChange={(e) => updateEducation(idx, 'grade', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 5: SKILLS WITH DYNAMIC SUGGESTIONS */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-fade-in">
                {/* Tag Input Box */}
                <div className="form-group">
                  <label className="form-label">
                    Add Core Technical & Administrative Skills (Press Enter to Add)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      className="input-field flex-1"
                      placeholder="Type a skill and press Enter (e.g. Public Policy, React, PPRA Rules)..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkill()}
                      className="btn btn-primary px-4 py-2 text-xs"
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Active Skill Chips */}
                  <div className="skill-chips-container min-h-[50px] p-3 rounded-lg bg-surface-subtle border border-subtle flex flex-wrap gap-2">
                    {cvData.skills.length > 0 ? (
                      cvData.skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag-pill">
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="skill-remove-btn"
                            title={`Remove ${skill}`}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted">No skills added yet. Type above or click recommendations below.</span>
                    )}
                  </div>
                </div>

                {/* Intelligent Recommended Skills Bundle */}
                <div className="suggested-skills-card p-4 rounded-lg bg-surface border border-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-gold-accent" />
                      <span className="text-xs font-bold text-primary">
                        Recommended for: {currentBundle.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted">Click to add directly</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {currentBundle.skills.map((s, i) => {
                      const isAdded = cvData.skills.includes(s);
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddSkill(s)}
                          className={`suggestion-chip text-xs ${isAdded ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          {isAdded ? <Check size={12} className="text-emerald" /> : <Plus size={12} />}
                          <span>{s}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: CERTIFICATIONS */}
            {currentStep === 6 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-secondary">
                    Add statutory licenses (PEC, PMDC, Bar Council, HEC) or professional certificates.
                  </p>
                  <button
                    type="button"
                    onClick={addCertification}
                    className="btn btn-outline btn-sm py-1 px-3 text-xs"
                  >
                    <Plus size={13} />
                    <span>Add Certificate</span>
                  </button>
                </div>

                {cvData.certifications.map((cert, idx) => (
                  <div key={cert.id || idx} className="repeatable-card card p-4 border border-subtle relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge badge-bps text-xs font-bold">
                        Certificate #{idx + 1}
                      </span>
                      {cvData.certifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCertification(idx)}
                          className="action-btn-sm text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="form-group md:col-span-2">
                        <label className="form-label">Certificate Title / Credential *</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. PEC Registered Professional Engineer (COMP/14290)"
                          value={cert.name}
                          onChange={(e) => updateCertification(idx, 'name', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Year Acquired</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. 2023"
                          value={cert.year}
                          onChange={(e) => updateCertification(idx, 'year', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 7: LANGUAGES */}
            {currentStep === 7 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-secondary">
                    List languages you can read, write, or conduct official business in.
                  </p>
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="btn btn-outline btn-sm py-1 px-3 text-xs"
                  >
                    <Plus size={13} />
                    <span>Add Language</span>
                  </button>
                </div>

                {cvData.languages.map((lang, idx) => (
                  <div key={lang.id || idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-surface-subtle border border-subtle items-center">
                    <div className="form-group mb-0">
                      <label className="form-label text-xs">Language Name</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. English, Urdu, Sindhi, Pashto"
                        value={lang.name}
                        onChange={(e) => updateLanguage(idx, 'name', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="form-group mb-0 flex-1">
                        <label className="form-label text-xs">Proficiency Level</label>
                        <select
                          className="input-field"
                          value={lang.level}
                          onChange={(e) => updateLanguage(idx, 'level', e.target.value)}
                        >
                          <option value="Native / Bilingual">Native / Bilingual</option>
                          <option value="Professional Working Proficiency">Professional Working</option>
                          <option value="Conversational">Conversational</option>
                          <option value="Elementary">Elementary</option>
                        </select>
                      </div>
                      {cvData.languages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLanguage(idx)}
                          className="action-btn-sm text-red-500 mt-4"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 8: PREVIEW & DOWNLOAD */}
            {currentStep === 8 && (
              <div className="space-y-6 animate-fade-in">
                {/* Template Selector */}
                <div>
                  <label className="form-label flex items-center gap-1.5 mb-2">
                    <Layers size={15} className="text-emerald" />
                    <span>Choose ATS Resume Template:</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        className={`template-select-card ${selectedTemplate === tpl.id ? 'active' : ''}`}
                        onClick={() => setSelectedTemplate(tpl.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-primary">{tpl.name}</span>
                          {selectedTemplate === tpl.id && <CheckCircle2 size={14} className="text-emerald" />}
                        </div>
                        <p className="text-[11px] text-muted text-left leading-normal">{tpl.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Palette Selector */}
                <div>
                  <label className="form-label flex items-center gap-1.5 mb-2">
                    <Palette size={15} className="text-emerald" />
                    <span>Accent Tone:</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {ACCENT_COLORS.map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${selectedColor.id === col.id ? 'scale-125 border-emerald shadow-md' : 'border-transparent'}`}
                        style={{ backgroundColor: col.hex }}
                        onClick={() => setSelectedColor(col)}
                        title={col.name}
                      />
                    ))}
                    <span className="text-xs font-semibold text-secondary ml-2">{selectedColor.name}</span>
                  </div>
                </div>

                {/* Download CTA Bar */}
                <div className="p-4 rounded-xl bg-surface-subtle border border-subtle space-y-3">
                  <div className="flex items-center gap-2 text-emerald">
                    <ShieldCheck size={18} />
                    <span className="text-xs font-bold">100% Vector PDF Generator Ready</span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Your resume is formatted strictly to A4 page dimensions with crisp vector text, embedded fonts, and ATS-parseable headings.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={isExporting}
                      className="btn btn-primary flex-1 py-3"
                    >
                      <Download size={16} />
                      <span>{isExporting ? "Generating PDF..." : "Download Official PDF"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="btn btn-outline py-3 px-4 text-xs"
                    >
                      <Printer size={16} />
                      <span>Print Document</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Navigation Controls */}
            <div className="cv-form-footer border-t border-subtle pt-5 mt-6 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="btn btn-outline btn-sm py-2 px-4"
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>
              ) : <div />}

              {currentStep < 8 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn btn-primary btn-sm py-2 px-5 ml-auto"
                >
                  <span>Continue to {STEPS[currentStep].title}</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                  className="btn btn-primary btn-sm py-2 px-6 ml-auto"
                >
                  <Download size={16} />
                  <span>Download PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive A4 Preview Sheet */}
        <div className={`cv-preview-panel ${mobileView === 'form' ? 'hidden-on-mobile' : ''}`}>
          <div className="cv-preview-sticky-wrap">
            <div className="preview-top-toolbar flex items-center justify-between pb-3 mb-3 border-b border-subtle">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold font-mono text-primary uppercase">Live ATS Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                  className="btn btn-primary btn-sm py-1 px-3 text-xs"
                  title="Download vector PDF"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* A4 Sheet Container */}
            <div className="a4-sheet-container">
              <div 
                ref={previewRef} 
                id="resume-preview-sheet" 
                className={`resume-paper template-${selectedTemplate}`}
                style={{ '--accent-theme': selectedColor.hex }}
              >
                {/* TEMPLATE 1: CLASSIC PROFESSIONAL */}
                {selectedTemplate === 'classic' && (
                  <div className="tpl-classic-inner">
                    {/* Header */}
                    <div className="tpl-header text-center border-b-2 pb-4 mb-4" style={{ borderColor: selectedColor.hex }}>
                      <h1 className="text-2xl font-bold font-serif text-primary tracking-tight uppercase">
                        {debouncedData.personal.fullName || "Your Full Name"}
                      </h1>
                      <div className="text-xs font-semibold text-secondary mt-1">
                        {debouncedData.personal.title || "Target Career Title"}
                      </div>
                      <div className="text-[11px] text-muted flex flex-wrap justify-center gap-3 mt-2">
                        {debouncedData.personal.email && <span>✉ {debouncedData.personal.email}</span>}
                        {debouncedData.personal.phone && <span>📞 {debouncedData.personal.phone}</span>}
                        {debouncedData.personal.city && <span>📍 {debouncedData.personal.city}</span>}
                        {debouncedData.personal.domicile && <span>🏛 Domicile: {debouncedData.personal.domicile}</span>}
                        {debouncedData.personal.cnic && <span>🪪 CNIC: {debouncedData.personal.cnic}</span>}
                      </div>
                    </div>

                    {/* Summary */}
                    {debouncedData.summary && (
                      <div className="tpl-section mb-4">
                        <h2 className="tpl-section-title font-bold text-xs uppercase tracking-wider mb-1.5" style={{ color: selectedColor.hex }}>
                          Professional Profile
                        </h2>
                        <p className="text-[11.5px] text-primary leading-relaxed text-justify">
                          {debouncedData.summary}
                        </p>
                      </div>
                    )}

                    {/* Experience */}
                    {debouncedData.experience.length > 0 && debouncedData.experience.some(e => e.role || e.company) && (
                      <div className="tpl-section mb-4">
                        <h2 className="tpl-section-title font-bold text-xs uppercase tracking-wider mb-2" style={{ color: selectedColor.hex }}>
                          Professional Experience
                        </h2>
                        <div className="space-y-3">
                          {debouncedData.experience.map((exp, i) => (
                            (exp.role || exp.company) && (
                              <div key={i} className="tpl-entry">
                                <div className="flex justify-between items-baseline">
                                  <span className="font-bold text-[12px] text-primary">{exp.role}</span>
                                  <span className="text-[10.5px] font-mono text-muted">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                                </div>
                                <div className="text-[11px] font-semibold text-secondary">
                                  {exp.company}{exp.city ? ` • ${exp.city}` : ''}
                                </div>
                                {exp.description && (
                                  <div className="text-[11px] text-primary mt-1 whitespace-pre-line leading-relaxed pl-1">
                                    {exp.description}
                                  </div>
                                )}
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {debouncedData.education.length > 0 && debouncedData.education.some(e => e.degree || e.institution) && (
                      <div className="tpl-section mb-4">
                        <h2 className="tpl-section-title font-bold text-xs uppercase tracking-wider mb-2" style={{ color: selectedColor.hex }}>
                          Education & Academic Credentials
                        </h2>
                        <div className="space-y-2.5">
                          {debouncedData.education.map((edu, i) => (
                            (edu.degree || edu.institution) && (
                              <div key={i} className="tpl-entry">
                                <div className="flex justify-between items-baseline">
                                  <span className="font-bold text-[12px] text-primary">{edu.degree}</span>
                                  <span className="text-[10.5px] font-mono text-muted">{edu.year}</span>
                                </div>
                                <div className="text-[11px] text-secondary">
                                  {edu.institution}{edu.grade ? ` • ${edu.grade}` : ''}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {debouncedData.skills.length > 0 && (
                      <div className="tpl-section mb-4">
                        <h2 className="tpl-section-title font-bold text-xs uppercase tracking-wider mb-1.5" style={{ color: selectedColor.hex }}>
                          Core Competencies & Technical Skills
                        </h2>
                        <p className="text-[11px] text-primary leading-relaxed">
                          {debouncedData.skills.join(" • ")}
                        </p>
                      </div>
                    )}

                    {/* Certifications & Languages Grid */}
                    <div className="grid grid-cols-2 gap-4 mt-2 pt-2 border-t border-subtle">
                      {debouncedData.certifications.length > 0 && debouncedData.certifications.some(c => c.name) && (
                        <div>
                          <h2 className="tpl-section-title font-bold text-[11px] uppercase tracking-wider mb-1" style={{ color: selectedColor.hex }}>
                            Certifications & Licenses
                          </h2>
                          <ul className="list-disc pl-3 text-[10.5px] text-primary space-y-0.5">
                            {debouncedData.certifications.map((c, i) => c.name && (
                              <li key={i}>{c.name} {c.year ? `(${c.year})` : ''}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {debouncedData.languages.length > 0 && debouncedData.languages.some(l => l.name) && (
                        <div>
                          <h2 className="tpl-section-title font-bold text-[11px] uppercase tracking-wider mb-1" style={{ color: selectedColor.hex }}>
                            Languages
                          </h2>
                          <div className="text-[10.5px] text-primary space-y-0.5">
                            {debouncedData.languages.map((l, i) => l.name && (
                              <div key={i}><strong>{l.name}</strong>: {l.level}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TEMPLATE 2: MODERN MINIMAL */}
                {selectedTemplate === 'modern' && (
                  <div className="tpl-modern-inner">
                    <div className="tpl-modern-header flex items-center justify-between pb-4 mb-4 border-b border-subtle">
                      <div>
                        <h1 className="text-2xl font-bold font-display tracking-tight text-primary">
                          {debouncedData.personal.fullName || "Your Full Name"}
                        </h1>
                        <div className="text-xs font-semibold tracking-wide uppercase mt-0.5" style={{ color: selectedColor.hex }}>
                          {debouncedData.personal.title || "Professional Role"}
                        </div>
                      </div>
                      {debouncedData.personal.photoUrl && debouncedData.personal.showPhoto && (
                        <img 
                          src={debouncedData.personal.photoUrl} 
                          alt="Applicant" 
                          style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', borderRadius: '9999px', objectFit: 'cover', border: `2px solid ${selectedColor.hex}` }}
                        />
                      )}
                    </div>

                    <div className="modern-contact-bar flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-secondary mb-4 p-2.5 rounded bg-surface-subtle">
                      {debouncedData.personal.email && <span>{debouncedData.personal.email}</span>}
                      {debouncedData.personal.phone && <span>{debouncedData.personal.phone}</span>}
                      {debouncedData.personal.city && <span>{debouncedData.personal.city}</span>}
                      {debouncedData.personal.domicile && <span>Domicile: {debouncedData.personal.domicile}</span>}
                    </div>

                    {debouncedData.summary && (
                      <div className="mb-4">
                        <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: selectedColor.hex }}>
                          Executive Summary
                        </div>
                        <p className="text-[11.5px] text-primary leading-relaxed">
                          {debouncedData.summary}
                        </p>
                      </div>
                    )}

                    {/* Experience */}
                    {debouncedData.experience.length > 0 && debouncedData.experience.some(e => e.role) && (
                      <div className="mb-4">
                        <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: selectedColor.hex }}>
                          Experience
                        </div>
                        <div className="space-y-3">
                          {debouncedData.experience.map((exp, i) => exp.role && (
                            <div key={i} className="border-l-2 pl-3" style={{ borderColor: selectedColor.hex }}>
                              <div className="flex justify-between items-baseline">
                                <span className="font-bold text-[12px] text-primary">{exp.role}</span>
                                <span className="text-[10px] font-mono text-muted">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                              </div>
                              <div className="text-[11px] text-secondary font-medium">{exp.company} • {exp.city}</div>
                              {exp.description && (
                                <div className="text-[11px] text-primary mt-1 whitespace-pre-line leading-relaxed">
                                  {exp.description}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {debouncedData.education.length > 0 && debouncedData.education.some(e => e.degree) && (
                      <div className="mb-4">
                        <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: selectedColor.hex }}>
                          Education
                        </div>
                        <div className="space-y-2">
                          {debouncedData.education.map((edu, i) => edu.degree && (
                            <div key={i} className="flex justify-between items-baseline border-b border-subtle pb-1.5">
                              <div>
                                <span className="font-bold text-[11.5px] text-primary">{edu.degree}</span>
                                <div className="text-[10.5px] text-secondary">{edu.institution} {edu.grade ? `(${edu.grade})` : ''}</div>
                              </div>
                              <span className="text-[10px] font-mono text-muted">{edu.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {debouncedData.skills.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: selectedColor.hex }}>
                          Skills & Competencies
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {debouncedData.skills.map((sk, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-surface-subtle text-[10.5px] font-medium text-primary">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TEMPLATE 3: GOVERNMENT / FORMAL */}
                {selectedTemplate === 'govt' && (
                  <div className="tpl-govt-inner">
                    <div className="govt-sheet-header text-center border-b-2 pb-3 mb-3" style={{ borderColor: selectedColor.hex }}>
                      <div className="text-[10px] font-bold tracking-widest text-muted uppercase">Curriculum Vitae (Pakistani Civil & Public Sector Format)</div>
                      <h1 className="text-2xl font-bold font-serif text-primary mt-1 tracking-tight">
                        {debouncedData.personal.fullName || "YOUR FULL NAME"}
                      </h1>
                      <div className="text-xs font-bold uppercase tracking-wide mt-0.5" style={{ color: selectedColor.hex }}>
                        {debouncedData.personal.title || "PROSPECTIVE POSITION CADRE"}
                      </div>
                    </div>

                    {/* Gazette Dossier Table */}
                    <table className="w-full text-[10.5px] mb-3 border border-subtle">
                      <tbody>
                        <tr className="border-b border-subtle bg-surface-subtle">
                          <td className="p-1.5 font-bold w-1/4">CNIC No:</td>
                          <td className="p-1.5 font-mono w-1/4">{debouncedData.personal.cnic || "N/A"}</td>
                          <td className="p-1.5 font-bold w-1/4">Provincial Domicile:</td>
                          <td className="p-1.5 w-1/4">{debouncedData.personal.domicile || "Pakistan"}</td>
                        </tr>
                        <tr className="border-b border-subtle">
                          <td className="p-1.5 font-bold">Contact Phone:</td>
                          <td className="p-1.5">{debouncedData.personal.phone || "N/A"}</td>
                          <td className="p-1.5 font-bold">Email Address:</td>
                          <td className="p-1.5">{debouncedData.personal.email || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="p-1.5 font-bold">Station / City:</td>
                          <td className="p-1.5">{debouncedData.personal.city || "Pakistan"}</td>
                          <td className="p-1.5 font-bold">Verification:</td>
                          <td className="p-1.5 text-emerald font-semibold">Gazette Verified Format</td>
                        </tr>
                      </tbody>
                    </table>

                    {debouncedData.summary && (
                      <div className="mb-3">
                        <div className="bg-surface-subtle px-2 py-1 font-bold text-[11px] uppercase border-l-4" style={{ borderColor: selectedColor.hex }}>
                          Statement of Purpose & Public Service Record
                        </div>
                        <p className="text-[11px] text-primary p-2 leading-relaxed text-justify">
                          {debouncedData.summary}
                        </p>
                      </div>
                    )}

                    {/* Official Experience */}
                    {debouncedData.experience.length > 0 && (
                      <div className="mb-3">
                        <div className="bg-surface-subtle px-2 py-1 font-bold text-[11px] uppercase border-l-4 mb-2" style={{ borderColor: selectedColor.hex }}>
                          Chronological Employment & Administrative Record
                        </div>
                        <div className="space-y-2.5 px-2">
                          {debouncedData.experience.map((exp, i) => exp.role && (
                            <div key={i} className="text-[11px]">
                              <div className="flex justify-between font-bold">
                                <span>{exp.role} — {exp.company}</span>
                                <span className="font-mono text-muted text-[10px]">{exp.startDate} to {exp.current ? 'Present' : exp.endDate}</span>
                              </div>
                              {exp.description && (
                                <div className="whitespace-pre-line text-primary mt-0.5 leading-normal text-[10.5px]">
                                  {exp.description}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Academic Table */}
                    {debouncedData.education.length > 0 && (
                      <div className="mb-3">
                        <div className="bg-surface-subtle px-2 py-1 font-bold text-[11px] uppercase border-l-4 mb-2" style={{ borderColor: selectedColor.hex }}>
                          Educational Qualifications (HEC Standard)
                        </div>
                        <table className="w-full text-[10.5px] border border-subtle">
                          <thead>
                            <tr className="bg-surface-subtle text-left border-b border-subtle">
                              <th className="p-1.5">Degree / Certificate</th>
                              <th className="p-1.5">Board / University</th>
                              <th className="p-1.5">Period</th>
                              <th className="p-1.5">Division / CGPA</th>
                            </tr>
                          </thead>
                          <tbody>
                            {debouncedData.education.map((edu, i) => edu.degree && (
                              <tr key={i} className="border-b border-subtle">
                                <td className="p-1.5 font-semibold">{edu.degree}</td>
                                <td className="p-1.5">{edu.institution}</td>
                                <td className="p-1.5 font-mono">{edu.year}</td>
                                <td className="p-1.5">{edu.grade || "Passed"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Resetting */}
      {showConfirmReset && (
        <div className="modal-overlay" onClick={() => setShowConfirmReset(false)}>
          <div className="modal-dialog card p-6 max-w-sm mx-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 text-red-500 mb-3">
              <AlertCircle size={24} />
              <h3 className="font-bold text-lg text-primary">Start Over?</h3>
            </div>
            <p className="text-xs text-secondary mb-5 leading-relaxed">
              This will erase your current drafted information from your browser&apos;s storage. You cannot undo this action.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartOver}
                className="btn btn-primary btn-sm bg-red-600 hover:bg-red-700"
              >
                Yes, Start Over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
