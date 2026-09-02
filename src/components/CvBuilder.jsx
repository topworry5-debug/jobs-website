'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutTemplate, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  Layers, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  GripVertical, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Download, 
  Printer, 
  Share2, 
  FileDown, 
  X, 
  Upload, 
  Camera, 
  Check, 
  RotateCcw, 
  Info, 
  Search, 
  ArrowUp, 
  ArrowDown, 
  HelpCircle, 
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  Building,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Sliders,
  Eye,
  Edit3
} from 'lucide-react';

const STORAGE_KEY = 'rozgar_cv_builder_v2';

const PAKISTANI_CITIES = [
  'Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Peshawar', 
  'Quetta', 'Multan', 'Faisalabad', 'Gujranwala', 'Sialkot', 
  'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 
  'Larkana', 'Mirpur (AJK)', 'Muzaffarabad', 'Gilgit', 'Gwadar'
];

const PREWRITTEN_SUMMARIES = {
  govt: {
    category: "Government & Civil Service",
    items: [
      "Dedicated and integrity-driven public administration professional with 4+ years of experience in civil service procedures, regulatory compliance, and inter-departmental coordination under Federal Service Rules. Proven track record drafting official notifications, managing provincial quotas, and executing budgetary allocations with zero audit objections.",
      "Results-oriented administrative officer experienced in e-Office implementation, secretariat procedures, and public grievance redressal through the Pakistan Citizen's Portal. Adept in public policy analysis, Rules of Business 1973, and ensuring PPRA compliance across high-volume procurements.",
      "Vigilant regulatory and revenue operations specialist with extensive background in district administration, statutory reporting, and gazette publication. Recognized for reducing public service turnaround time by 35% through standardized operating procedures."
    ]
  },
  tech: {
    category: "IT & Software Engineering",
    items: [
      "Innovative Full Stack Engineer with 5+ years of experience architecting resilient distributed systems and responsive web applications using React, Next.js, Node.js, and cloud microservices. Successfully engineered high-scale fintech systems serving 1.5M+ daily transactions with 99.98% uptime.",
      "Performance-focused Software Developer adept in modern frontend frameworks, REST/GraphQL APIs, and PostgreSQL database optimization. Decreased page bundle load times by 40% and mentored junior engineering cohorts across agile sprints.",
      "Cloud Solutions Architect & DevOps practitioner with proven expertise in AWS (EKS, RDS), Docker containerization, and automated CI/CD pipelines. Decreased deployment latency by 65% while enforcing strict zero-trust security."
    ]
  },
  engineering: {
    category: "Engineering & Technical",
    items: [
      "PEC-registered Civil Engineer with 6+ years of hands-on experience directing mega infrastructure, commercial construction, and structural rehabilitation projects across Pakistan. Proficient in Primavera P6, AutoCAD, BOQ estimation, and enforcing strict HSE quality standards.",
      "Detail-oriented Electrical Engineer specializing in power distribution, substation automation, and PLC SCADA control architectures. Led cross-functional teams delivering 132kV grid modernization ahead of schedule.",
      "Mechanical Project Engineer skilled in HVAC systems design, industrial piping, and predictive maintenance protocols. Achieved PKR 28M in annual operational savings through energy-efficiency retrofits."
    ]
  },
  healthcare: {
    category: "Healthcare & Medicine",
    items: [
      "Compassionate, PMDC-registered Medical Officer with 4+ years of clinical emergency, inpatient diagnosis, and critical care management experience in tertiary hospitals. Committed to evidence-based treatment, infection control protocols, and empathetic patient communication.",
      "Licensed Clinical Pharmacist experienced in hospital formulary management, drug interaction audits, and specialized dosage calculations. Spearheaded antimicrobial stewardship initiatives reducing medication errors by 22%."
    ]
  },
  finance: {
    category: "Finance, Banking & Accounting",
    items: [
      "ACCA / CA finalist with 5+ years of corporate accounting, financial modeling, and statutory tax compliance under FBR guidelines. Supervised comprehensive internal audits for multi-entity portfolios valued over PKR 1.2B.",
      "Commercial Banking Specialist skilled in credit risk evaluation, SME loan structuring, and SBP regulatory reporting. Expanded departmental portfolio by 28% while maintaining a sub-1.5% non-performing loan ratio."
    ]
  }
};

const SUGGESTED_SKILLS = {
  govt: [
    "Public Policy Analysis", "Rules of Business 1973", "Official Correspondence", 
    "Civil Service Regulations", "Budget Allocation & Planning", "PPRA Procurement Rules", 
    "E-Office Management System", "Secretariat Procedures", "Urdu & English Drafting", 
    "Public Grievance Redressal", "File & Dossier Management", "Inter-Provincial Coordination"
  ],
  tech: [
    "JavaScript (ES6+) / TypeScript", "React.js & Next.js", "Node.js & Express", 
    "Python & FastAPI", "RESTful & GraphQL APIs", "PostgreSQL & MongoDB", 
    "Docker & Kubernetes", "AWS Cloud Services", "Git & CI/CD Pipelines", 
    "Tailwind CSS", "Microservices Architecture", "Automated Unit Testing"
  ],
  engineering: [
    "AutoCAD & SolidWorks", "Primavera P6 & MS Project", "PEC Standards & Compliance", 
    "Site Supervision & Quality Control", "BOQ & Cost Estimation", "Structural Analysis", 
    "HSE Safety Regulations", "HVAC / MEP Design", "Contract Administration"
  ],
  healthcare: [
    "Clinical Diagnostics", "Emergency Patient Care", "PMDC Standards", 
    "Medical Records & EHR", "Pharmacology & Dosage", "Surgical Prep & Assistance", 
    "Infection Control Protocols", "BLS / ACLS Certified", "Medical Ethics"
  ],
  finance: [
    "Financial Modeling", "FBR Tax Filing & Returns", "Internal & External Auditing", 
    "SBP Compliance Regulations", "QuickBooks & Tally", "Balance Sheet Analysis", 
    "Cost Accounting & Budgeting", "Risk Management & Mitigation", "Reconciliation"
  ]
};

const INITIAL_CV_DATA = {
  template: 'classic', // 'classic' | 'modern' | 'govt' | 'executive'
  personal: {
    fullName: "Muhammad Usman Ali",
    title: "Assistant Director (General Cadre / BPS-17)",
    email: "usman.ali@gmail.com",
    phone: "+92 300 1234567",
    city: "Islamabad",
    linkedin: "linkedin.com/in/usman-ali-pk",
    portfolio: "usmanali.pk",
    photoUrl: "",
    showPhoto: false
  },
  summary: "Dedicated and integrity-driven public administration professional with 4+ years of experience in civil service procedures, regulatory compliance, and inter-departmental coordination under Federal Service Rules. Proven track record drafting official notifications, managing provincial quotas, and executing budgetary allocations with zero audit objections.",
  experience: [
    {
      id: "exp-1",
      role: "Assistant Director (Operations)",
      company: "Ministry of Federal Education & Professional Training",
      city: "Islamabad",
      type: "Full-time",
      startDate: "Jan 2023",
      endDate: "Present",
      current: true,
      bullets: [
        "Spearheaded digitization of curriculum inspection logs across 42 federal institutes, reducing review turnaround by 35%.",
        "Drafted 18+ official summaries and gazette notifications for Cabinet approval in strict compliance with Rules of Business 1973.",
        "Monitored budgetary execution of PKR 450M allocated to national scholarship programs with zero audit objections."
      ]
    },
    {
      id: "exp-2",
      role: "Administrative Officer (BPS-16)",
      company: "Higher Education Commission (HEC)",
      city: "Islamabad",
      type: "Full-time",
      startDate: "Aug 2020",
      endDate: "Dec 2022",
      current: false,
      bullets: [
        "Managed degree verification correspondence for 12,000+ national and overseas applicants annually with a 99.4% SLA adherence rate.",
        "Coordinated with provincial higher education departments to implement standardized degree equivalence criteria across 74 universities."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Master of Public Administration (MPA)",
      institution: "Quaid-i-Azam University (QAU)",
      city: "Islamabad",
      startYear: "2018",
      endYear: "2020",
      ongoing: false,
      grade: "CGPA: 3.75 / 4.00 (First Division)"
    },
    {
      id: "edu-2",
      degree: "B.Sc (Hons) Economics & Political Science",
      institution: "Government College University (GCU)",
      city: "Lahore",
      startYear: "2014",
      endYear: "2018",
      ongoing: false,
      grade: "CGPA: 3.60 / 4.00"
    }
  ],
  skills: [
    { name: "Public Policy Analysis", rating: 5 },
    { name: "Rules of Business 1973", rating: 5 },
    { name: "Official Correspondence", rating: 5 },
    { name: "PPRA Procurement Rules", rating: 4 },
    { name: "Budget Planning & Execution", rating: 4 },
    { name: "E-Office Management System", rating: 5 },
    { name: "Urdu & English Drafting", rating: 5 },
    { name: "Civil Service Regulations", rating: 4 }
  ],
  showSkillRatings: false,
  extras: {
    certifications: [
      { id: "c-1", name: "Public Sector Governance & Secretariat Procedures", issuer: "NSPP / National Institute of Management", year: "2023" },
      { id: "c-2", name: "Federal Public Procurement Regulatory Authority (PPRA) Basic Certification", issuer: "Federal PPRA", year: "2022" }
    ],
    languages: [
      { id: "l-1", name: "English", level: "Professional Working Proficiency" },
      { id: "l-2", name: "Urdu", level: "Native / Bilingual" },
      { id: "l-3", name: "Punjabi", level: "Conversational" }
    ],
    projects: [
      { id: "p-1", title: "Federal E-Cabinet Dossier Integration", description: "Standardized paperless digital briefing templates adopted by 4 regional divisions.", link: "" }
    ],
    referencesAvailable: true,
    customReferences: []
  }
};

const STEP_DEFINITIONS = [
  { id: 0, key: 'template', label: 'Template', icon: LayoutTemplate },
  { id: 1, key: 'personal', label: 'Personal Info', icon: User },
  { id: 2, key: 'summary', label: 'Summary', icon: FileText },
  { id: 3, key: 'experience', label: 'Experience', icon: Briefcase },
  { id: 4, key: 'education', label: 'Education', icon: GraduationCap },
  { id: 5, key: 'skills', label: 'Skills', icon: Sparkles },
  { id: 6, key: 'extras', label: 'Extras', icon: Award },
  { id: 7, key: 'finalize', label: 'Finalize & Export', icon: CheckCircle2 }
];

const TEMPLATE_CARDS = [
  {
    id: 'classic',
    name: 'Classic Professional',
    tagline: 'Single-column with traditional serif headers & horizontal dividing rules.',
    atsScore: '100% ATS Safe',
    badgeClass: 'badge-verified'
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    tagline: 'Streamlined sans-serif with subtle emerald accent bar and clean dates.',
    atsScore: '100% ATS Safe',
    badgeClass: 'badge-verified'
  },
  {
    id: 'govt',
    name: 'Government / Formal',
    tagline: 'Conservative, high-contrast B&W layout tailored for FPSC, PPSC, and civil service dossiers.',
    atsScore: 'Civil Gazette Standard',
    badgeClass: 'badge-verified'
  },
  {
    id: 'executive',
    name: 'Executive Leadership',
    tagline: 'Authoritative Fraunces display headings with dual emerald/charcoal tone.',
    atsScore: '100% ATS Safe',
    badgeClass: 'badge-verified'
  }
];

export default function CvBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [cvData, setCvData] = useState(INITIAL_CV_DATA);
  const [debouncedData, setDebouncedData] = useState(INITIAL_CV_DATA);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setCvData(parsed);
          setDebouncedData(parsed);
        }
      } catch (e) {
        console.error("Failed to load CV from storage", e);
      }
      setIsLoaded(true);
    }
  }, []);
  const [mobileViewTab, setMobileViewTab] = useState('form'); // 'form' | 'preview'
  const [isExporting, setIsExporting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [expandedExperienceId, setExpandedExperienceId] = useState("exp-1");
  const [expandedEducationId, setExpandedEducationId] = useState("edu-1");
  const [skillInput, setSkillInput] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSummaryHelper, setShowSummaryHelper] = useState(false);
  const [targetJobDescription, setTargetJobDescription] = useState('');
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const previewSheetRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-Save Effect (500ms debounce)
  useEffect(() => {
    if (!isLoaded) return;
    setSaveStatus('Saving...');
    const timer = setTimeout(() => {
      setDebouncedData(cvData);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
        setSaveStatus('Saved just now');
      } catch (e) {
        setSaveStatus('Error saving');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [cvData, isLoaded]);

  // Detected Job Category for Contextual Suggestions
  const detectedCategory = useMemo(() => {
    const title = (cvData.personal?.title || '').toLowerCase();
    if (title.includes('software') || title.includes('developer') || title.includes('engineer') && (title.includes('frontend') || title.includes('backend') || title.includes('full stack') || title.includes('react') || title.includes('python'))) {
      return 'tech';
    }
    if (title.includes('civil') || title.includes('electrical') || title.includes('mechanical') || title.includes('pec') || title.includes('autocad')) {
      return 'engineering';
    }
    if (title.includes('doctor') || title.includes('nurse') || title.includes('mbbs') || title.includes('medical') || title.includes('pharmacist')) {
      return 'healthcare';
    }
    if (title.includes('accountant') || title.includes('finance') || title.includes('audit') || title.includes('tax') || title.includes('banking')) {
      return 'finance';
    }
    return 'govt'; // Default
  }, [cvData.personal?.title]);

  // Real-time ATS Strength Score Calculation (0-100%)
  const { strengthScore, checklist } = useMemo(() => {
    const checks = [];
    let score = 0;

    // 1. Personal Contact Info
    const hasContact = cvData.personal.fullName && cvData.personal.title && cvData.personal.email && cvData.personal.phone && cvData.personal.city;
    checks.push({
      label: "Contact details complete (Name, Title, Email, Phone, City)",
      passed: Boolean(hasContact),
      points: 15
    });
    if (hasContact) score += 15;

    // 2. Professional Summary
    const summaryWords = (cvData.summary || '').trim().split(/\s+/).filter(Boolean).length;
    const hasGoodSummary = summaryWords >= 25 && summaryWords <= 90;
    checks.push({
      label: "Focused summary (25–90 words highlighting core strengths)",
      passed: hasGoodSummary,
      points: 15
    });
    if (hasGoodSummary) score += 15;

    // 3. Work Experience (At least 2 entries)
    const hasTwoJobs = cvData.experience && cvData.experience.length >= 2 && cvData.experience.every(e => e.role && e.company);
    checks.push({
      label: "Work experience includes at least 2 roles",
      passed: Boolean(hasTwoJobs),
      points: 20
    });
    if (hasTwoJobs) score += 20;

    // 4. Measurable Metrics in Bullets (Numbers, percentages, PKR)
    const allBullets = cvData.experience.flatMap(e => e.bullets || []);
    const metricRegex = /(\d+%|\d+\s*(M|k|K|crore|lakh)|PKR|\b\d{1,3}\b)/;
    const bulletsWithMetrics = allBullets.filter(b => metricRegex.test(b));
    const hasMetrics = bulletsWithMetrics.length >= 2;
    checks.push({
      label: "Measurable achievements with metrics (e.g. 35%, PKR 450M, 42 institutes)",
      passed: hasMetrics,
      points: 20
    });
    if (hasMetrics) score += 20;

    // 5. Skills Count >= 6
    const hasEnoughSkills = (cvData.skills || []).length >= 6;
    checks.push({
      label: "At least 6 ATS-relevant technical & administrative skills",
      passed: hasEnoughSkills,
      points: 15
    });
    if (hasEnoughSkills) score += 15;

    // 6. Education
    const hasEducation = cvData.education && cvData.education.length >= 1 && cvData.education[0].degree;
    checks.push({
      label: "Academic credentials recorded with degree & university",
      passed: Boolean(hasEducation),
      points: 15
    });
    if (hasEducation) score += 15;

    return { strengthScore: Math.min(score, 100), checklist: checks };
  }, [cvData]);

  // Real-time Summary Quality Indicator
  const summaryQuality = useMemo(() => {
    const text = (cvData.summary || '').trim();
    if (!text) return { text: "Add a summary to boost your ATS score", status: "empty" };
    const words = text.split(/\s+/).filter(Boolean).length;
    const hasNumber = /\d/.test(text);

    if (words < 15) return { text: "Too short — add your domain focus and key achievement", status: "warning" };
    if (words > 85) return { text: "A bit long for ATS scannability — keep under 80 words", status: "warning" };
    if (!hasNumber) return { text: "Good length! Consider adding a quantifiable metric (e.g. 4+ years, 15+ projects)", status: "tip" };
    return { text: "✓ Strong, impactful ATS executive summary", status: "great" };
  }, [cvData.summary]);

  // Job Description Keyword Optimizer
  useEffect(() => {
    if (!targetJobDescription.trim()) {
      setMatchedKeywords([]);
      setMissingKeywords([]);
      return;
    }

    const jdText = targetJobDescription.toLowerCase();
    const currentSkills = (cvData.skills || []).map(s => s.name.toLowerCase());
    
    // Check which user skills appear in JD
    const matched = currentSkills.filter(s => jdText.includes(s));
    
    // Extract prospective high-value keywords from pool
    const pool = [
      ...SUGGESTED_SKILLS.govt,
      ...SUGGESTED_SKILLS.tech,
      ...SUGGESTED_SKILLS.engineering,
      ...SUGGESTED_SKILLS.finance,
      ...SUGGESTED_SKILLS.healthcare
    ];

    const missing = pool.filter(kw => {
      const lower = kw.toLowerCase();
      return jdText.includes(lower) && !currentSkills.includes(lower);
    }).slice(0, 5);

    setMatchedKeywords(matched);
    setMissingKeywords(missing);
  }, [targetJobDescription, cvData.skills]);

  // Step Validation on Navigation
  const validateStep = (step) => {
    const errors = {};
    if (step === 1) { // Personal
      if (!cvData.personal.fullName?.trim()) errors.fullName = "Full name is required";
      if (!cvData.personal.title?.trim()) errors.title = "Target professional title is required";
      if (!cvData.personal.email?.trim()) {
        errors.email = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cvData.personal.email)) {
        errors.email = "Please enter a valid email format (e.g. name@example.com)";
      }
      if (!cvData.personal.phone?.trim()) {
        errors.phone = "Contact number is required";
      }
      if (!cvData.personal.city?.trim()) {
        errors.city = "City is required";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEP_DEFINITIONS.length - 1) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    } else {
      // Scroll to first error
      const firstError = document.querySelector('.input-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // City Autocomplete Handler
  const handleCityInput = (val) => {
    setCvData(prev => ({ ...prev, personal: { ...prev.personal, city: val } }));
    if (val.trim().length > 0) {
      const matches = PAKISTANI_CITIES.filter(c => c.toLowerCase().startsWith(val.toLowerCase()));
      setCitySuggestions(matches);
    } else {
      setCitySuggestions([]);
    }
  };

  // Photo Upload Handler with Crop Validation
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid JPG or PNG image file.");
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

  // Work Experience Handlers
  const addExperience = () => {
    const newId = `exp-${Date.now()}`;
    setCvData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: newId,
          role: "",
          company: "",
          city: "",
          type: "Full-time",
          startDate: "",
          endDate: "",
          current: false,
          bullets: [""]
        }
      ]
    }));
    setExpandedExperienceId(newId);
  };

  const updateExperience = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const moveExperience = (index, direction) => {
    const nextList = [...cvData.experience];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= nextList.length) return;
    const [moved] = nextList.splice(index, 1);
    nextList.splice(targetIdx, 0, moved);
    setCvData(prev => ({ ...prev, experience: nextList }));
  };

  const removeExperience = (id) => {
    if (window.confirm("Are you sure you want to remove this work experience entry?")) {
      setCvData(prev => ({
        ...prev,
        experience: prev.experience.filter(exp => exp.id !== id)
      }));
    }
  };

  // Experience Bullet Editors
  const addBullet = (expId) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          return { ...exp, bullets: [...(exp.bullets || []), ""] };
        }
        return exp;
      })
    }));
  };

  const updateBullet = (expId, bulletIdx, value) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          const updated = [...(exp.bullets || [])];
          updated[bulletIdx] = value;
          return { ...exp, bullets: updated };
        }
        return exp;
      })
    }));
  };

  const moveBullet = (expId, bulletIdx, direction) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          const updated = [...(exp.bullets || [])];
          const target = bulletIdx + direction;
          if (target < 0 || target >= updated.length) return exp;
          const [item] = updated.splice(bulletIdx, 1);
          updated.splice(target, 0, item);
          return { ...exp, bullets: updated };
        }
        return exp;
      })
    }));
  };

  const removeBullet = (expId, bulletIdx) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          const updated = (exp.bullets || []).filter((_, idx) => idx !== bulletIdx);
          return { ...exp, bullets: updated.length ? updated : [""] };
        }
        return exp;
      })
    }));
  };

  // Education Handlers
  const addEducation = () => {
    const newId = `edu-${Date.now()}`;
    setCvData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: newId,
          degree: "",
          institution: "",
          city: "",
          startYear: "",
          endYear: "",
          ongoing: false,
          grade: ""
        }
      ]
    }));
    setExpandedEducationId(newId);
  };

  const updateEducation = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const moveEducation = (index, direction) => {
    const nextList = [...cvData.education];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= nextList.length) return;
    const [moved] = nextList.splice(index, 1);
    nextList.splice(targetIdx, 0, moved);
    setCvData(prev => ({ ...prev, education: nextList }));
  };

  const removeEducation = (id) => {
    if (window.confirm("Remove this academic credential?")) {
      setCvData(prev => ({
        ...prev,
        education: prev.education.filter(edu => edu.id !== id)
      }));
    }
  };

  // Skills Handlers
  const addSkillChip = (name) => {
    const trimmed = (name || skillInput).trim();
    if (!trimmed) return;
    const exists = cvData.skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      setCvData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: trimmed, rating: 4 }]
      }));
      setSkillInput('');
    }
  };

  const removeSkillChip = (skillName) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.name !== skillName)
    }));
  };

  const updateSkillRating = (skillName, rating) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.name === skillName ? { ...s, rating } : s)
    }));
  };

  // PDF Export via Lazy-Loaded html2pdf.js
  const handleDownloadPdf = async () => {
    if (!previewSheetRef.current) return;
    setIsExporting(true);

    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const element = previewSheetRef.current;
      const cleanName = (cvData.personal.fullName || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${cleanName}_ATS_Resume_RozgarPK.pdf`;

      const opt = {
        margin: [10, 10, 10, 10],
        filename: filename,
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
    } catch (err) {
      console.error("html2pdf export failed, fallback to native print", err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // Word (.doc) Export
  const handleDownloadWord = () => {
    if (!previewSheetRef.current) return;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
      "xmlns:w='urn:schemas-microsoft-com:office:word' "+
      "xmlns='http://www.w3.org/TR/REC-html40'>"+
      "<head><meta charset='utf-8'><title>Resume</title><style>body{font-family:Arial,sans-serif;font-size:10.5pt;line-height:1.4;color:#111827;} h1{font-size:18pt;margin-bottom:4pt;} h2{font-size:12pt;border-bottom:1pt solid #ccc;margin-top:12pt;margin-bottom:4pt;} p{margin:0 0 4pt 0;} ul{margin-top:2pt;margin-bottom:6pt;padding-left:16pt;}</style></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + previewSheetRef.current.innerHTML + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${(cvData.personal.fullName || 'Resume').replace(/\s+/g, '_')}_RozgarPK.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  // Copy Shareable Link Handler
  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 2500);
    }
  };

  // Reset Everything Handler
  const handleResetConfirmed = () => {
    setCvData({
      template: 'classic',
      personal: { fullName: "", title: "", email: "", phone: "", city: "", linkedin: "", portfolio: "", photoUrl: "", showPhoto: false },
      summary: "",
      experience: [{ id: "exp-1", role: "", company: "", city: "", type: "Full-time", startDate: "", endDate: "", current: false, bullets: [""] }],
      education: [{ id: "edu-1", degree: "", institution: "", city: "", startYear: "", endYear: "", ongoing: false, grade: "" }],
      skills: [],
      showSkillRatings: false,
      extras: { certifications: [], languages: [], projects: [], referencesAvailable: true, customReferences: [] }
    });
    setCurrentStep(0);
    setShowResetModal(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  return (
    <div className="cv-app-root">
      {/* Top Header Bar */}
      <header className="cv-top-bar">
        <div className="cv-top-bar-inner">
          <div className="flex items-center gap-3">
            <span className="badge badge-verified">
              <ShieldCheck size={13} />
              <span>100% Single-Column ATS Guaranteed</span>
            </span>
            <span className="save-status-text">
              <Check size={12} className="text-emerald-500 inline mr-1" />
              {saveStatus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCvData(INITIAL_CV_DATA)}
              className="btn btn-outline btn-sm text-xs py-1 px-3"
              title="Preload authentic Pakistani candidate credentials"
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Load Sample</span>
            </button>
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="btn btn-outline btn-sm text-xs py-1 px-3 text-red-500 hover:text-red-700"
              title="Start a new blank resume"
            >
              <RotateCcw size={13} />
              <span>Start New</span>
            </button>
          </div>
        </div>

        {/* Mobile View Toggle (Only visible on <768px) */}
        <div className="mobile-toggle-wrapper md:hidden">
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-tab ${mobileViewTab === 'form' ? 'active' : ''}`}
              onClick={() => setMobileViewTab('form')}
            >
              <Edit3 size={14} />
              <span>Edit Form ({currentStep + 1}/8)</span>
            </button>
            <button
              type="button"
              className={`segmented-tab ${mobileViewTab === 'preview' ? 'active' : ''}`}
              onClick={() => setMobileViewTab('preview')}
            >
              <Eye size={14} />
              <span>Live ATS Preview</span>
            </button>
          </div>
        </div>
      </header>

      {/* Horizontal Progress Stepper */}
      <nav className="cv-stepper-nav" aria-label="Resume builder progress">
        <div className="cv-stepper-scroll">
          {STEP_DEFINITIONS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (validateStep(currentStep) || step.id < currentStep) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`cv-step-button ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <span className="cv-step-badge">
                  {isCompleted ? <Check size={12} strokeWidth={3} /> : step.id + 1}
                </span>
                <span className="cv-step-name">{step.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Split-Screen Workspace */}
      <div className="cv-workspace-split">
        {/* LEFT PANEL: Form Editor */}
        <section className={`cv-editor-panel ${mobileViewTab === 'preview' ? 'hidden-mobile' : ''}`}>
          <div className="cv-card card p-6">
            {/* Step Header */}
            <div className="editor-step-header mb-6 pb-4 border-b border-subtle flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-muted tracking-wider">
                  Step {currentStep + 1} of {STEP_DEFINITIONS.length}
                </span>
                <h1 className="text-xl font-bold font-display text-primary mt-1">
                  {STEP_DEFINITIONS[currentStep].label}
                </h1>
              </div>
              <div className="text-xs text-muted font-medium">
                {currentStep === 0 && "Select single-column ATS layout"}
                {currentStep === 1 && "Contact details & identification"}
                {currentStep === 2 && "2–4 sentence career elevator pitch"}
                {currentStep === 3 && "Employment history & achievements"}
                {currentStep === 4 && "Degrees & academic credentials"}
                {currentStep === 5 && "Core technical & administrative skills"}
                {currentStep === 6 && "Certifications, languages & projects"}
                {currentStep === 7 && "Review ATS score & export PDF"}
              </div>
            </div>

            {/* STEP 0: TEMPLATE GALLERY */}
            {currentStep === 0 && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-xs text-secondary leading-relaxed">
                  Choose an ATS-verified layout. Every template is strictly <strong>single-column</strong> and structured for 100% readability by government scanners (FPSC, PPSC, NTS) and enterprise ATS systems. You can switch anytime without losing data.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {TEMPLATE_CARDS.map((tpl) => {
                    const isSelected = cvData.template === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => setCvData(prev => ({ ...prev, template: tpl.id }))}
                        className={`template-card-choice ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="template-card-thumb">
                          {/* Visual miniature mockup */}
                          <div className={`thumb-sheet template-${tpl.id}`}>
                            <div className="thumb-line thumb-header" />
                            <div className="thumb-line thumb-sub" />
                            <div className="thumb-divider" />
                            <div className="thumb-line thumb-body-1" />
                            <div className="thumb-line thumb-body-2" />
                            <div className="thumb-line thumb-bullet" />
                            <div className="thumb-line thumb-bullet" />
                          </div>
                        </div>

                        <div className="template-card-meta">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-primary">{tpl.name}</span>
                            {isSelected && <CheckCircle2 size={16} className="text-emerald-600" />}
                          </div>
                          <p className="text-[11.5px] text-muted leading-relaxed mb-2">{tpl.tagline}</p>
                          <span className={`badge ${tpl.badgeClass} text-[10px]`}>{tpl.atsScore}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 1: PERSONAL INFO */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                {/* Photo Upload Box with Govt Disclaimer */}
                <div className="photo-dossier-box p-4 rounded-xl bg-surface-subtle border border-subtle">
                  <div className="flex items-start gap-4">
                    <div className="photo-crop-circle">
                      {cvData.personal.photoUrl && cvData.personal.showPhoto ? (
                        <img 
                          src={cvData.personal.photoUrl} 
                          alt="Applicant" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-surface border border-subtle flex items-center justify-center text-muted">
                          <Camera size={22} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary">Passport Photo (Optional)</span>
                        <label className="flex items-center gap-1.5 text-xs text-secondary cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cvData.personal.showPhoto}
                            onChange={(e) => setCvData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, showPhoto: e.target.checked }
                            }))}
                            className="rounded text-emerald-600"
                          />
                          <span>Show on CV</span>
                        </label>
                      </div>
                      <p className="text-[11px] text-muted leading-normal mt-1 mb-2">
                        Notice: Photos are optional and not recommended for most Federal/Provincial civil service submissions unless specifically requested by the gazette notice.
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn btn-outline btn-sm py-1 px-2.5 text-xs"
                        >
                          <Upload size={12} />
                          <span>Upload Image</span>
                        </button>
                        {cvData.personal.photoUrl && (
                          <button
                            type="button"
                            onClick={() => setCvData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, photoUrl: "", showPhoto: false }
                            }))}
                            className="btn btn-outline btn-sm py-1 px-2.5 text-xs text-red-500"
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
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`input-field ${formErrors.fullName ? 'input-error' : ''}`}
                      placeholder="e.g. Muhammad Usman Ali"
                      value={cvData.personal.fullName}
                      onChange={(e) => setCvData(prev => ({ ...prev, personal: { ...prev.personal, fullName: e.target.value } }))}
                      onBlur={() => validateStep(1)}
                    />
                    {formErrors.fullName && <p className="form-error-msg">{formErrors.fullName}</p>}
                    <span className="helper-text">Your legal name matching your CNIC or degree credentials.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Target Job Title / Headline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`input-field ${formErrors.title ? 'input-error' : ''}`}
                      placeholder="e.g. Assistant Director / Software Engineer"
                      value={cvData.personal.title}
                      onChange={(e) => setCvData(prev => ({ ...prev, personal: { ...prev.personal, title: e.target.value } }))}
                      onBlur={() => validateStep(1)}
                    />
                    {formErrors.title && <p className="form-error-msg">{formErrors.title}</p>}
                    <span className="helper-text">Specifies the exact cadre or professional level you are seeking.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className={`input-field ${formErrors.email ? 'input-error' : ''}`}
                      placeholder="usman.ali@gmail.com"
                      value={cvData.personal.email}
                      onChange={(e) => setCvData(prev => ({ ...prev, personal: { ...prev.personal, email: e.target.value } }))}
                      onBlur={() => validateStep(1)}
                    />
                    {formErrors.email && <p className="form-error-msg">{formErrors.email}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`input-field ${formErrors.phone ? 'input-error' : ''}`}
                      placeholder="+92 300 1234567"
                      value={cvData.personal.phone}
                      onChange={(e) => setCvData(prev => ({ ...prev, personal: { ...prev.personal, phone: e.target.value } }))}
                      onBlur={() => validateStep(1)}
                    />
                    {formErrors.phone && <p className="form-error-msg">{formErrors.phone}</p>}
                    <span className="helper-text">Mobile or WhatsApp contact for test call letters & interview alerts.</span>
                  </div>

                  <div className="form-group relative">
                    <label className="form-label">
                      City / Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`input-field ${formErrors.city ? 'input-error' : ''}`}
                      placeholder="e.g. Islamabad, Lahore, Karachi"
                      value={cvData.personal.city}
                      onChange={(e) => handleCityInput(e.target.value)}
                      onBlur={() => {
                        setTimeout(() => setCitySuggestions([]), 200);
                        validateStep(1);
                      }}
                    />
                    {citySuggestions.length > 0 && (
                      <div className="autocomplete-dropdown">
                        {citySuggestions.map((city, idx) => (
                          <div
                            key={idx}
                            className="autocomplete-item"
                            onMouseDown={() => {
                              setCvData(prev => ({ ...prev, personal: { ...prev.personal, city } }));
                              setCitySuggestions([]);
                            }}
                          >
                            <MapPin size={13} className="text-muted inline mr-1.5" />
                            <span>{city}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {formErrors.city && <p className="form-error-msg">{formErrors.city}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      LinkedIn URL (Optional)
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="linkedin.com/in/username"
                      value={cvData.personal.linkedin}
                      onChange={(e) => setCvData(prev => ({ ...prev, personal: { ...prev.personal, linkedin: e.target.value } }))}
                    />
                  </div>

                  <div className="form-group sm:col-span-2">
                    <label className="form-label">
                      Portfolio or Personal Website (Optional)
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="https://yourportfolio.pk"
                      value={cvData.personal.portfolio}
                      onChange={(e) => setCvData(prev => ({ ...prev, personal: { ...prev.personal, portfolio: e.target.value } }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PROFESSIONAL SUMMARY */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="form-group">
                  <div className="flex items-center justify-between mb-1">
                    <label className="form-label mb-0">Career Summary Statement</label>
                    <span className="text-xs font-mono text-muted">
                      {(cvData.summary || '').length} / 500 chars
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    maxLength={500}
                    className="input-field leading-relaxed font-sans text-xs"
                    placeholder="2–4 sentences highlighting your domain expertise, civil/private track record, and strongest quantifiable credential..."
                    value={cvData.summary}
                    onChange={(e) => setCvData(prev => ({ ...prev, summary: e.target.value }))}
                  />

                  {/* Real-time Quality Indicator */}
                  <div className={`summary-quality-pill ${summaryQuality.status} mt-2`}>
                    <Lightbulb size={14} className="flex-shrink-0" />
                    <span>{summaryQuality.text}</span>
                  </div>
                </div>

                {/* Pre-written Examples Accordion */}
                <div className="border border-subtle rounded-xl overflow-hidden bg-surface">
                  <button
                    type="button"
                    onClick={() => setShowSummaryHelper(!showSummaryHelper)}
                    className="w-full flex items-center justify-between p-3.5 bg-surface-subtle text-left text-xs font-bold text-primary hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className="text-amber-500" />
                      <span>Need help writing this? View verified Pakistani career examples</span>
                    </div>
                    {showSummaryHelper ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {showSummaryHelper && (
                    <div className="p-4 space-y-4 border-t border-subtle animate-fade-in text-xs">
                      {Object.keys(PREWRITTEN_SUMMARIES).map((catKey) => {
                        const bundle = PREWRITTEN_SUMMARIES[catKey];
                        return (
                          <div key={catKey} className="space-y-2">
                            <span className="font-bold text-primary uppercase text-[11px] tracking-wider block">
                              {bundle.category}
                            </span>
                            <div className="space-y-2">
                              {bundle.items.map((sampleText, idx) => (
                                <div 
                                  key={idx} 
                                  className="p-3 rounded-lg bg-surface-subtle border border-subtle hover:border-emerald-600 transition-colors cursor-pointer group"
                                  onClick={() => {
                                    setCvData(prev => ({ ...prev, summary: sampleText }));
                                    setShowSummaryHelper(false);
                                  }}
                                >
                                  <p className="text-secondary leading-relaxed group-hover:text-primary">
                                    &ldquo;{sampleText}&rdquo;
                                  </p>
                                  <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
                                    + Click to use this example
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: WORK EXPERIENCE */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-secondary leading-relaxed">
                    Add your professional roles in reverse chronological order. Use bullet achievements starting with strong action verbs.
                  </p>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="btn btn-primary btn-sm py-1 px-3 text-xs"
                  >
                    <Plus size={13} />
                    <span>Add Another Job</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {cvData.experience.map((exp, idx) => {
                    const isExpanded = expandedExperienceId === exp.id;

                    return (
                      <div key={exp.id} className="collapsible-entry-card card border border-subtle overflow-hidden">
                        {/* Summary Header Row */}
                        <div 
                          className="collapsible-header flex items-center justify-between p-3.5 bg-surface-subtle cursor-pointer select-none"
                          onClick={() => setExpandedExperienceId(isExpanded ? null : exp.id)}
                        >
                          <div className="flex items-center gap-2.5">
                            <GripVertical size={16} className="text-muted cursor-grab" />
                            <div>
                              <span className="font-bold text-xs text-primary block">
                                {exp.role || `Untitled Role #${idx + 1}`}
                              </span>
                              <span className="text-[11px] text-muted">
                                {exp.company || "Company / Ministry"} {exp.startDate ? `• ${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}` : ''}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                            {/* Reorder Buttons for Mobile & Keyboard */}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveExperience(idx, -1)}
                              className="action-btn-sm"
                              title="Move position up"
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === cvData.experience.length - 1}
                              onClick={() => moveExperience(idx, 1)}
                              className="action-btn-sm"
                              title="Move position down"
                            >
                              <ArrowDown size={13} />
                            </button>
                            {cvData.experience.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeExperience(exp.id)}
                                className="action-btn-sm text-red-500 hover:text-red-700"
                                title="Delete position"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setExpandedExperienceId(isExpanded ? null : exp.id)}
                              className="action-btn-sm ml-1"
                            >
                              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Form Fields */}
                        {isExpanded && (
                          <div className="p-4 space-y-4 border-t border-subtle animate-fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="form-group">
                                <label className="form-label">Job Title / Cadre *</label>
                                <input
                                  type="text"
                                  className="input-field"
                                  placeholder="e.g. Assistant Director (Operations)"
                                  value={exp.role}
                                  onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Department or Company *</label>
                                <input
                                  type="text"
                                  className="input-field"
                                  placeholder="e.g. Ministry of Federal Education"
                                  value={exp.company}
                                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">City / Station</label>
                                <input
                                  type="text"
                                  className="input-field"
                                  placeholder="e.g. Islamabad"
                                  value={exp.city}
                                  onChange={(e) => updateExperience(exp.id, 'city', e.target.value)}
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Employment Type</label>
                                <select
                                  className="input-field"
                                  value={exp.type || 'Full-time'}
                                  onChange={(e) => updateExperience(exp.id, 'type', e.target.value)}
                                >
                                  <option value="Full-time">Full-time (Regular / Permanent)</option>
                                  <option value="Contract">Contractual (BPS / Project)</option>
                                  <option value="Part-time">Part-time</option>
                                  <option value="Internship">Internship / Apprenticeship</option>
                                </select>
                              </div>

                              <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                                <div className="form-group">
                                  <label className="form-label">Start Date</label>
                                  <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. Jan 2023"
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
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
                                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>

                            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={exp.current || false}
                                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                className="rounded text-emerald-600"
                              />
                              <span>I currently work in this position</span>
                            </label>

                            {/* Structured Bullet Point Editor */}
                            <div className="bullets-editor-section pt-2 border-t border-subtle">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-primary">
                                  Key Responsibilities & Measurable Achievements
                                </span>
                                <span className="text-[11px] text-muted">Formula: Action Verb + Task + Quantified Result</span>
                              </div>

                              <div className="space-y-2">
                                {(exp.bullets || []).map((bulletText, bIdx) => (
                                  <div key={bIdx} className="bullet-input-row flex items-start gap-2">
                                    <div className="bullet-indicator mt-2.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 block" />
                                    </div>
                                    <textarea
                                      rows={2}
                                      className="input-field text-xs leading-relaxed flex-1"
                                      placeholder="e.g. Spearheaded digitization of curriculum records across 42 institutes, reducing review time by 35%."
                                      value={bulletText}
                                      onChange={(e) => updateBullet(exp.id, bIdx, e.target.value)}
                                    />
                                    <div className="bullet-actions flex flex-col gap-1 mt-1">
                                      <button
                                        type="button"
                                        disabled={bIdx === 0}
                                        onClick={() => moveBullet(exp.id, bIdx, -1)}
                                        className="action-btn-mini"
                                        title="Move bullet up"
                                      >
                                        <ArrowUp size={11} />
                                      </button>
                                      <button
                                        type="button"
                                        disabled={bIdx === (exp.bullets || []).length - 1}
                                        onClick={() => moveBullet(exp.id, bIdx, 1)}
                                        className="action-btn-mini"
                                        title="Move bullet down"
                                      >
                                        <ArrowDown size={11} />
                                      </button>
                                      {(exp.bullets || []).length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => removeBullet(exp.id, bIdx)}
                                          className="action-btn-mini text-red-500"
                                          title="Remove bullet"
                                        >
                                          <Trash2 size={11} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => addBullet(exp.id)}
                                className="btn btn-outline btn-sm text-xs py-1 px-3 mt-2"
                              >
                                <Plus size={12} />
                                <span>Add Another Bullet</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: EDUCATION */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-secondary leading-relaxed">
                    List your academic qualifications in reverse chronological order (HEC recognized degrees, boards, universities).
                  </p>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="btn btn-primary btn-sm py-1 px-3 text-xs"
                  >
                    <Plus size={13} />
                    <span>Add Degree / Certificate</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {cvData.education.map((edu, idx) => {
                    const isExpanded = expandedEducationId === edu.id;

                    return (
                      <div key={edu.id} className="collapsible-entry-card card border border-subtle overflow-hidden">
                        <div 
                          className="collapsible-header flex items-center justify-between p-3.5 bg-surface-subtle cursor-pointer select-none"
                          onClick={() => setExpandedEducationId(isExpanded ? null : edu.id)}
                        >
                          <div className="flex items-center gap-2.5">
                            <GripVertical size={16} className="text-muted cursor-grab" />
                            <div>
                              <span className="font-bold text-xs text-primary block">
                                {edu.degree || `Qualification #${idx + 1}`}
                              </span>
                              <span className="text-[11px] text-muted">
                                {edu.institution || "University / College / Board"} {edu.startYear ? `• ${edu.startYear} – ${edu.ongoing ? 'Ongoing' : edu.endYear}` : ''}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveEducation(idx, -1)}
                              className="action-btn-sm"
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === cvData.education.length - 1}
                              onClick={() => moveEducation(idx, 1)}
                              className="action-btn-sm"
                            >
                              <ArrowDown size={13} />
                            </button>
                            {cvData.education.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeEducation(edu.id)}
                                className="action-btn-sm text-red-500"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setExpandedEducationId(isExpanded ? null : edu.id)}
                              className="action-btn-sm ml-1"
                            >
                              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-4 space-y-3 border-t border-subtle animate-fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="form-group">
                                <label className="form-label">Degree / Certificate *</label>
                                <input
                                  type="text"
                                  className="input-field"
                                  placeholder="e.g. Master of Public Administration (MPA) / BS CS"
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Institution / University / Board *</label>
                                <input
                                  type="text"
                                  className="input-field"
                                  placeholder="e.g. Quaid-i-Azam University (QAU), Islamabad"
                                  value={edu.institution}
                                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">City</label>
                                <input
                                  type="text"
                                  className="input-field"
                                  placeholder="e.g. Islamabad"
                                  value={edu.city}
                                  onChange={(e) => updateEducation(edu.id, 'city', e.target.value)}
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Grade / CGPA / Division (Optional)</label>
                                <input
                                  type="text"
                                  className="input-field"
                                  placeholder="e.g. CGPA: 3.8 / 4.0 (1st Division)"
                                  value={edu.grade}
                                  onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                                />
                                <span className="helper-text">e.g., 1st Division, 3.8 CGPA, A Grade</span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                                <div className="form-group">
                                  <label className="form-label">Start Year</label>
                                  <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. 2018"
                                    value={edu.startYear}
                                    onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">End Year</label>
                                  <input
                                    type="text"
                                    className="input-field"
                                    placeholder={edu.ongoing ? "Ongoing" : "e.g. 2022"}
                                    disabled={edu.ongoing}
                                    value={edu.ongoing ? "Ongoing" : edu.endYear}
                                    onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>

                            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={edu.ongoing || false}
                                onChange={(e) => updateEducation(edu.id, 'ongoing', e.target.checked)}
                                className="rounded text-emerald-600"
                              />
                              <span>Currently enrolled / Ongoing study</span>
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: SKILLS */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-fade-in">
                {/* Tag Input */}
                <div className="form-group">
                  <label className="form-label">Add Core Skills (Type & Press Enter)</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      className="input-field flex-1"
                      placeholder="e.g. Public Policy, React, PPRA Rules, Budgeting..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkillChip();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => addSkillChip()}
                      className="btn btn-primary px-4 py-2 text-xs"
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Active Skill Chips */}
                  <div className="skill-chips-wall p-3 rounded-xl bg-surface-subtle border border-subtle min-h-[55px] flex flex-wrap gap-2 items-center">
                    {cvData.skills.length > 0 ? (
                      cvData.skills.map((skill, sIdx) => (
                        <div key={sIdx} className="skill-tag-pill flex items-center gap-1.5">
                          <span>{skill.name}</span>
                          {cvData.showSkillRatings && (
                            <div className="skill-rating-dots flex gap-0.5 ml-1">
                              {[1, 2, 3, 4, 5].map((dot) => (
                                <button
                                  key={dot}
                                  type="button"
                                  onClick={() => updateSkillRating(skill.name, dot)}
                                  className={`w-1.5 h-1.5 rounded-full ${dot <= (skill.rating || 4) ? 'bg-amber-400' : 'bg-gray-400/40'}`}
                                />
                              ))}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeSkillChip(skill.name)}
                            className="skill-remove-btn"
                            title={`Remove ${skill.name}`}
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted">No skills added yet. Type above or choose suggested skills below.</span>
                    )}
                  </div>
                </div>

                {/* Rating Toggle with ATS Explanation */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-subtle">
                  <div className="flex items-center gap-2">
                    <label htmlFor="toggle-ratings" className="text-xs font-semibold cursor-pointer text-primary">
                      Display 1–5 visual skill proficiency dots
                    </label>
                    <span className="tooltip-hint text-muted" title="ATS parsers only read skill keywords and generally ignore visual graphics or rating bars. Recommended for human-read CVs.">
                      <HelpCircle size={14} />
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    id="toggle-ratings"
                    checked={cvData.showSkillRatings}
                    onChange={(e) => setCvData(prev => ({ ...prev, showSkillRatings: e.target.checked }))}
                    className="rounded text-emerald-600"
                  />
                </div>

                {/* Contextual Suggested Skills */}
                <div className="suggested-skills-box p-4 rounded-xl bg-surface-subtle border border-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className="text-amber-500" />
                      <span className="text-xs font-bold text-primary">
                        Suggested skills for: {cvData.personal.title || "Your Target Role"}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted">Click to add</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {(SUGGESTED_SKILLS[detectedCategory] || SUGGESTED_SKILLS.govt).map((skillName, idx) => {
                      const alreadyAdded = cvData.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => addSkillChip(skillName)}
                          className={`suggestion-chip text-xs ${alreadyAdded ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          {alreadyAdded ? <Check size={12} className="text-emerald-600" /> : <Plus size={12} />}
                          <span>{skillName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: EXTRAS (ACCORDION) */}
            {currentStep === 6 && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-xs text-secondary leading-relaxed">
                  Enhance your resume with certifications, languages, key projects, and professional references. All sections in this step are optional.
                </p>

                {/* Certifications Accordion */}
                <div className="border border-subtle rounded-xl p-4 bg-surface-subtle">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-xs text-primary flex items-center gap-2">
                      <Award size={15} className="text-emerald-600" />
                      <span>Certifications & Statutory Licenses (PEC, PMDC, HEC)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setCvData(prev => ({
                        ...prev,
                        extras: {
                          ...prev.extras,
                          certifications: [...prev.extras.certifications, { id: `c-${Date.now()}`, name: "", issuer: "", year: "" }]
                        }
                      }))}
                      className="btn btn-outline btn-sm py-0.5 px-2.5 text-xs"
                    >
                      <Plus size={11} />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {cvData.extras.certifications.map((cert, idx) => (
                      <div key={cert.id || idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded bg-surface border border-subtle items-center">
                        <input
                          type="text"
                          className="input-field text-xs sm:col-span-2"
                          placeholder="Certification Name / PEC License"
                          value={cert.name}
                          onChange={(e) => {
                            const updated = [...cvData.extras.certifications];
                            updated[idx].name = e.target.value;
                            setCvData(prev => ({ ...prev, extras: { ...prev.extras, certifications: updated } }));
                          }}
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            className="input-field text-xs"
                            placeholder="Year"
                            value={cert.year}
                            onChange={(e) => {
                              const updated = [...cvData.extras.certifications];
                              updated[idx].year = e.target.value;
                              setCvData(prev => ({ ...prev, extras: { ...prev.extras, certifications: updated } }));
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = cvData.extras.certifications.filter((_, i) => i !== idx);
                              setCvData(prev => ({ ...prev, extras: { ...prev.extras, certifications: updated } }));
                            }}
                            className="action-btn-sm text-red-500"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages Accordion */}
                <div className="border border-subtle rounded-xl p-4 bg-surface-subtle">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-xs text-primary flex items-center gap-2">
                      <Globe size={15} className="text-emerald-600" />
                      <span>Languages</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setCvData(prev => ({
                        ...prev,
                        extras: {
                          ...prev.extras,
                          languages: [...prev.extras.languages, { id: `l-${Date.now()}`, name: "", level: "Professional" }]
                        }
                      }))}
                      className="btn btn-outline btn-sm py-0.5 px-2.5 text-xs"
                    >
                      <Plus size={11} />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {cvData.extras.languages.map((lang, idx) => (
                      <div key={lang.id || idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 rounded bg-surface border border-subtle items-center">
                        <input
                          type="text"
                          className="input-field text-xs"
                          placeholder="e.g. English, Urdu, Pashto, Sindhi"
                          value={lang.name}
                          onChange={(e) => {
                            const updated = [...cvData.extras.languages];
                            updated[idx].name = e.target.value;
                            setCvData(prev => ({ ...prev, extras: { ...prev.extras, languages: updated } }));
                          }}
                        />
                        <div className="flex items-center gap-1">
                          <select
                            className="input-field text-xs flex-1"
                            value={lang.level}
                            onChange={(e) => {
                              const updated = [...cvData.extras.languages];
                              updated[idx].level = e.target.value;
                              setCvData(prev => ({ ...prev, extras: { ...prev.extras, languages: updated } }));
                            }}
                          >
                            <option value="Native / Bilingual">Native / Bilingual</option>
                            <option value="Professional Working Proficiency">Professional Working</option>
                            <option value="Conversational">Conversational</option>
                            <option value="Basic">Basic</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = cvData.extras.languages.filter((_, i) => i !== idx);
                              setCvData(prev => ({ ...prev, extras: { ...prev.extras, languages: updated } }));
                            }}
                            className="action-btn-sm text-red-500"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* References Toggle */}
                <div className="border border-subtle rounded-xl p-4 bg-surface">
                  <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                    <span className="text-primary">State &ldquo;References available upon request&rdquo;</span>
                    <input
                      type="checkbox"
                      checked={cvData.extras.referencesAvailable}
                      onChange={(e) => setCvData(prev => ({
                        ...prev,
                        extras: { ...prev.extras, referencesAvailable: e.target.checked }
                      }))}
                      className="rounded text-emerald-600"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* STEP 7: FINALIZE & ATS SCORE */}
            {currentStep === 7 && (
              <div className="space-y-6 animate-fade-in">
                {/* Circular ATS Strength Score Ring */}
                <div className="ats-score-card p-5 rounded-2xl bg-surface border border-subtle flex flex-col sm:flex-row items-center gap-6">
                  <div className="score-ring-container relative flex items-center justify-center">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="var(--border-subtle)"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke={strengthScore >= 80 ? "#059669" : strengthScore >= 50 ? "#D97706" : "#DC2626"}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={(2 * Math.PI * 48) * (1 - strengthScore / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-bold font-display text-primary">{strengthScore}%</span>
                      <span className="text-[10px] text-muted block uppercase font-mono">ATS Score</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-sm text-primary">Resume Strength Checklist</h3>
                    <div className="space-y-1.5 text-xs">
                      {checklist.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {item.passed ? (
                            <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                          ) : (
                            <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
                          )}
                          <span className={item.passed ? 'text-secondary' : 'text-primary font-medium'}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Job Description Keyword Optimizer */}
                <div className="jd-optimizer-card p-4 rounded-xl bg-surface-subtle border border-subtle space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search size={15} className="text-emerald-600" />
                      <span className="text-xs font-bold text-primary">Optimize For Specific Job Announcement</span>
                    </div>
                    <span className="text-[11px] text-muted">Paste JD below</span>
                  </div>

                  <textarea
                    rows={3}
                    className="input-field text-xs font-sans"
                    placeholder="Paste job posting text, advertisement requirements, or gazette qualification criteria here..."
                    value={targetJobDescription}
                    onChange={(e) => setTargetJobDescription(e.target.value)}
                  />

                  {targetJobDescription.trim() && (
                    <div className="optimizer-results space-y-2 pt-1">
                      <div className="text-xs">
                        <span className="font-bold text-emerald-600 mr-2">✓ Matched Keywords ({matchedKeywords.length}):</span>
                        {matchedKeywords.length ? matchedKeywords.join(', ') : <span className="text-muted">None detected yet.</span>}
                      </div>

                      {missingKeywords.length > 0 && (
                        <div className="text-xs">
                          <span className="font-bold text-amber-600 mr-2">⚠ Recommended Missing Keywords ({missingKeywords.length}):</span>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {missingKeywords.map((kw, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => addSkillChip(kw)}
                                className="suggestion-chip text-[11px]"
                              >
                                + Add &ldquo;{kw}&rdquo;
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Export Options */}
                <div className="export-actions-card p-5 rounded-2xl bg-surface border border-subtle space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-primary">Export & Download Your Resume</h3>
                    <p className="text-xs text-muted mt-0.5">
                      Ready for direct submission to FPSC, PPSC, National Job Portal, or corporate HR portals.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={isExporting}
                      className="btn btn-primary flex-1 py-3"
                    >
                      <Download size={16} />
                      <span>{isExporting ? "Generating PDF..." : "Download ATS PDF"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadWord}
                      className="btn btn-outline py-3 px-4 text-xs"
                      title="Download editable Microsoft Word format"
                    >
                      <FileDown size={16} />
                      <span>Download .DOC</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyShareLink}
                      className="btn btn-outline py-3 px-4 text-xs"
                      title="Copy browser link to resume editing session"
                    >
                      <Share2 size={16} />
                      <span>{shareLinkCopied ? "Link Copied!" : "Share Link"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Navigation Controls */}
            <div className="cv-form-footer border-t border-subtle pt-4 mt-6 flex items-center justify-between">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="btn btn-outline btn-sm py-2 px-4"
                >
                  <span>Back</span>
                </button>
              ) : <div />}

              {currentStep < STEP_DEFINITIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn btn-primary btn-sm py-2 px-5 ml-auto"
                >
                  <span>Continue to {STEP_DEFINITIONS[currentStep + 1].label}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                  className="btn btn-primary btn-sm py-2 px-6 ml-auto"
                >
                  <Download size={16} />
                  <span>Download Official PDF</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: Sticky Live A4 Preview */}
        <section className={`cv-preview-panel ${mobileViewTab === 'form' ? 'hidden-mobile' : ''}`}>
          <div className="preview-sticky-frame">
            {/* Quick Preview Toolbar */}
            <div className="preview-control-toolbar flex items-center justify-between pb-3 mb-3 border-b border-subtle">
              <div className="flex items-center gap-2">
                <span className="pulse-dot" />
                <span className="text-xs font-mono font-bold text-primary uppercase">
                  Real-time ATS Preview ({TEMPLATE_CARDS.find(t => t.id === cvData.template)?.name})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Template Quick Switcher */}
                <select
                  value={cvData.template}
                  onChange={(e) => setCvData(prev => ({ ...prev, template: e.target.value }))}
                  className="input-field text-xs py-1 px-2.5 h-8 min-h-0"
                >
                  {TEMPLATE_CARDS.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                  className="btn btn-primary btn-sm py-1 px-3 text-xs"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* A4 Sheet Container */}
            <div className="a4-scroll-viewport">
              <div
                ref={previewSheetRef}
                id="resume-live-sheet"
                className={`a4-page-sheet template-${debouncedData.template}`}
              >
                {/* TEMPLATE 1: CLASSIC PROFESSIONAL */}
                {debouncedData.template === 'classic' && (
                  <div className="sheet-classic-layout">
                    {/* Header */}
                    <header className="text-center pb-3 mb-3 border-b border-gray-400">
                      <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight uppercase mb-1">
                        {debouncedData.personal.fullName || "Your Full Name"}
                      </h1>
                      <div className="text-xs font-semibold text-gray-700 tracking-wide mb-1.5">
                        {debouncedData.personal.title || "Professional Title"}
                      </div>
                      <div className="text-[10.5px] text-gray-600 flex flex-wrap justify-center gap-x-3 gap-y-1">
                        {debouncedData.personal.email && <span>{debouncedData.personal.email}</span>}
                        {debouncedData.personal.phone && <span>• {debouncedData.personal.phone}</span>}
                        {debouncedData.personal.city && <span>• {debouncedData.personal.city}</span>}
                        {debouncedData.personal.linkedin && <span>• {debouncedData.personal.linkedin}</span>}
                      </div>
                    </header>

                    {/* Summary */}
                    {debouncedData.summary && (
                      <section className="mb-3.5">
                        <h2 className="section-title-classic">Professional Summary</h2>
                        <p className="text-[11px] text-gray-800 leading-relaxed text-justify">
                          {debouncedData.summary}
                        </p>
                      </section>
                    )}

                    {/* Experience */}
                    {debouncedData.experience.length > 0 && debouncedData.experience.some(e => e.role) && (
                      <section className="mb-3.5">
                        <h2 className="section-title-classic">Work Experience</h2>
                        <div className="space-y-3">
                          {debouncedData.experience.map((exp, i) => exp.role && (
                            <div key={i} className="experience-entry">
                              <div className="flex justify-between items-baseline">
                                <span className="font-bold text-[11.5px] text-gray-900">{exp.role}</span>
                                <span className="text-[10.5px] font-mono text-gray-600">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                              </div>
                              <div className="text-[11px] font-semibold text-gray-700 mb-1">
                                {exp.company}{exp.city ? `, ${exp.city}` : ''}
                              </div>
                              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-gray-800 leading-relaxed">
                                {(exp.bullets || []).map((b, bI) => b && (
                                  <li key={bI}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Education */}
                    {debouncedData.education.length > 0 && debouncedData.education.some(e => e.degree) && (
                      <section className="mb-3.5">
                        <h2 className="section-title-classic">Education</h2>
                        <div className="space-y-2">
                          {debouncedData.education.map((edu, i) => edu.degree && (
                            <div key={i}>
                              <div className="flex justify-between items-baseline">
                                <span className="font-bold text-[11.5px] text-gray-900">{edu.degree}</span>
                                <span className="text-[10.5px] font-mono text-gray-600">{edu.startYear} – {edu.ongoing ? 'Ongoing' : edu.endYear}</span>
                              </div>
                              <div className="text-[11px] text-gray-700">
                                {edu.institution}{edu.city ? `, ${edu.city}` : ''} {edu.grade ? `(${edu.grade})` : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Skills */}
                    {debouncedData.skills.length > 0 && (
                      <section className="mb-3.5">
                        <h2 className="section-title-classic">Core Skills & Competencies</h2>
                        <p className="text-[11px] text-gray-800 leading-relaxed">
                          {debouncedData.skills.map(s => s.name).join(" • ")}
                        </p>
                      </section>
                    )}

                    {/* Extras */}
                    {(debouncedData.extras.certifications.length > 0 || debouncedData.extras.languages.length > 0) && (
                      <section className="pt-1 border-t border-gray-300 grid grid-cols-2 gap-4">
                        {debouncedData.extras.certifications.length > 0 && (
                          <div>
                            <h2 className="section-title-classic text-[10.5px]">Certifications</h2>
                            <ul className="list-disc pl-4 text-[10.5px] text-gray-800 space-y-0.5">
                              {debouncedData.extras.certifications.map((c, i) => c.name && (
                                <li key={i}>{c.name} {c.year ? `(${c.year})` : ''}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {debouncedData.extras.languages.length > 0 && (
                          <div>
                            <h2 className="section-title-classic text-[10.5px]">Languages</h2>
                            <div className="text-[10.5px] text-gray-800 space-y-0.5">
                              {debouncedData.extras.languages.map((l, i) => l.name && (
                                <div key={i}><strong>{l.name}</strong>: {l.level}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </section>
                    )}
                  </div>
                )}

                {/* TEMPLATE 2: MODERN MINIMAL */}
                {debouncedData.template === 'modern' && (
                  <div className="sheet-modern-layout">
                    <header className="pb-3 mb-3 border-b-2 border-emerald-800 flex justify-between items-center">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                          {debouncedData.personal.fullName || "Your Full Name"}
                        </h1>
                        <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mt-0.5">
                          {debouncedData.personal.title || "Professional Role"}
                        </div>
                      </div>
                      {debouncedData.personal.photoUrl && debouncedData.personal.showPhoto && (
                        <img
                          src={debouncedData.personal.photoUrl}
                          alt="Applicant"
                          style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', borderRadius: '9999px', objectFit: 'cover' }}
                        />
                      )}
                    </header>

                    <div className="text-[10.5px] text-gray-600 flex flex-wrap gap-x-4 gap-y-1 mb-3 bg-gray-100 p-2 rounded">
                      {debouncedData.personal.email && <span>✉ {debouncedData.personal.email}</span>}
                      {debouncedData.personal.phone && <span>📞 {debouncedData.personal.phone}</span>}
                      {debouncedData.personal.city && <span>📍 {debouncedData.personal.city}</span>}
                      {debouncedData.personal.linkedin && <span>🔗 {debouncedData.personal.linkedin}</span>}
                    </div>

                    {debouncedData.summary && (
                      <section className="mb-3.5">
                        <h2 className="section-title-modern">Professional Profile</h2>
                        <p className="text-[11px] text-gray-800 leading-relaxed">
                          {debouncedData.summary}
                        </p>
                      </section>
                    )}

                    {debouncedData.experience.length > 0 && (
                      <section className="mb-3.5">
                        <h2 className="section-title-modern">Experience</h2>
                        <div className="space-y-3">
                          {debouncedData.experience.map((exp, i) => exp.role && (
                            <div key={i} className="border-l-2 border-emerald-800 pl-3">
                              <div className="flex justify-between items-baseline">
                                <span className="font-bold text-[11.5px] text-gray-900">{exp.role}</span>
                                <span className="text-[10.5px] font-mono text-gray-600">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                              </div>
                              <div className="text-[11px] text-gray-700 font-medium mb-1">{exp.company} • {exp.city}</div>
                              <ul className="list-disc pl-3 text-[10.5px] text-gray-800 space-y-0.5">
                                {(exp.bullets || []).map((b, bI) => b && (
                                  <li key={bI}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {debouncedData.education.length > 0 && (
                      <section className="mb-3.5">
                        <h2 className="section-title-modern">Education</h2>
                        <div className="space-y-2">
                          {debouncedData.education.map((edu, i) => edu.degree && (
                            <div key={i} className="flex justify-between items-baseline border-b border-gray-200 pb-1">
                              <div>
                                <span className="font-bold text-[11px] text-gray-900">{edu.degree}</span>
                                <div className="text-[10.5px] text-gray-600">{edu.institution} {edu.grade ? `(${edu.grade})` : ''}</div>
                              </div>
                              <span className="text-[10px] font-mono text-gray-500">{edu.startYear} – {edu.endYear}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {debouncedData.skills.length > 0 && (
                      <section className="mb-3">
                        <h2 className="section-title-modern">Skills</h2>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {debouncedData.skills.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-gray-100 text-[10.5px] font-medium text-gray-800">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                )}

                {/* TEMPLATE 3: GOVERNMENT / FORMAL */}
                {debouncedData.template === 'govt' && (
                  <div className="sheet-govt-layout">
                    <header className="text-center pb-2 mb-3 border-b-2 border-black">
                      <div className="text-[9.5px] font-mono uppercase tracking-widest text-gray-600">
                        Islamic Republic of Pakistan • Curriculum Vitae (BPS Cadre Format)
                      </div>
                      <h1 className="text-2xl font-serif font-bold text-black uppercase tracking-tight mt-1 mb-0.5">
                        {debouncedData.personal.fullName || "YOUR FULL NAME"}
                      </h1>
                      <div className="text-xs font-bold text-black uppercase tracking-wider">
                        {debouncedData.personal.title || "TARGET CADRE"}
                      </div>
                    </header>

                    {/* Single-Column Contact Matrix */}
                    <div className="text-[10.5px] text-black border border-gray-400 p-2 mb-3 leading-relaxed">
                      <div><strong>Address / Station:</strong> {debouncedData.personal.city || "Pakistan"}</div>
                      <div><strong>Contact:</strong> {debouncedData.personal.phone} | {debouncedData.personal.email}</div>
                      {debouncedData.personal.linkedin && <div><strong>Profile:</strong> {debouncedData.personal.linkedin}</div>}
                    </div>

                    {debouncedData.summary && (
                      <section className="mb-3">
                        <h2 className="section-title-govt">Statement of Qualification & Civil Service Intent</h2>
                        <p className="text-[11px] text-black leading-relaxed text-justify">
                          {debouncedData.summary}
                        </p>
                      </section>
                    )}

                    {debouncedData.experience.length > 0 && (
                      <section className="mb-3">
                        <h2 className="section-title-govt">Official Employment & Service Record</h2>
                        <div className="space-y-3">
                          {debouncedData.experience.map((exp, i) => exp.role && (
                            <div key={i} className="border-b border-gray-300 pb-2">
                              <div className="flex justify-between font-bold text-[11.5px] text-black">
                                <span>{exp.role}</span>
                                <span className="font-mono text-[10.5px]">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                              </div>
                              <div className="text-[11px] font-semibold text-gray-800 mb-1">{exp.company} — {exp.city} ({exp.type})</div>
                              <ul className="list-disc pl-4 text-[10.5px] text-black space-y-0.5">
                                {(exp.bullets || []).map((b, bI) => b && (
                                  <li key={bI}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {debouncedData.education.length > 0 && (
                      <section className="mb-3">
                        <h2 className="section-title-govt">Academic Qualifications (HEC Standard)</h2>
                        <div className="space-y-1.5">
                          {debouncedData.education.map((edu, i) => edu.degree && (
                            <div key={i} className="flex justify-between text-[11px] text-black">
                              <div>
                                <strong>{edu.degree}</strong> — {edu.institution} {edu.grade ? `(${edu.grade})` : ''}
                              </div>
                              <span className="font-mono text-[10.5px]">{edu.startYear} – {edu.endYear}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {debouncedData.skills.length > 0 && (
                      <section className="mb-3">
                        <h2 className="section-title-govt">Core Administrative & Technical Competencies</h2>
                        <p className="text-[11px] text-black leading-relaxed">
                          {debouncedData.skills.map(s => s.name).join("; ")}
                        </p>
                      </section>
                    )}
                  </div>
                )}

                {/* TEMPLATE 4: EXECUTIVE */}
                {debouncedData.template === 'executive' && (
                  <div className="sheet-executive-layout">
                    <header className="pb-3 mb-3 border-b-2 border-emerald-900 flex justify-between items-center">
                      <div>
                        <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
                          {debouncedData.personal.fullName || "Your Full Name"}
                        </h1>
                        <div className="text-xs font-bold text-emerald-900 uppercase tracking-widest mt-1">
                          {debouncedData.personal.title || "Executive Role"}
                        </div>
                      </div>
                      <div className="text-right text-[10.5px] text-gray-600 space-y-0.5">
                        {debouncedData.personal.email && <div>{debouncedData.personal.email}</div>}
                        {debouncedData.personal.phone && <div>{debouncedData.personal.phone}</div>}
                        {debouncedData.personal.city && <div>{debouncedData.personal.city}</div>}
                      </div>
                    </header>

                    {debouncedData.summary && (
                      <section className="mb-3.5">
                        <h2 className="section-title-executive">Executive Profile</h2>
                        <p className="text-[11px] text-gray-800 leading-relaxed text-justify">
                          {debouncedData.summary}
                        </p>
                      </section>
                    )}

                    {debouncedData.experience.length > 0 && (
                      <section className="mb-3.5">
                        <h2 className="section-title-executive">Leadership & Operational Experience</h2>
                        <div className="space-y-3">
                          {debouncedData.experience.map((exp, i) => exp.role && (
                            <div key={i}>
                              <div className="flex justify-between items-baseline">
                                <span className="font-bold text-[12px] text-emerald-950">{exp.role}</span>
                                <span className="text-[10.5px] font-mono text-gray-600">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                              </div>
                              <div className="text-[11px] font-semibold text-gray-700 mb-1">{exp.company} • {exp.city}</div>
                              <ul className="list-disc pl-4 text-[11px] text-gray-800 space-y-0.5">
                                {(exp.bullets || []).map((b, bI) => b && (
                                  <li key={bI}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {debouncedData.education.length > 0 && (
                      <section className="mb-3.5">
                        <h2 className="section-title-executive">Education & Credentials</h2>
                        <div className="space-y-1.5">
                          {debouncedData.education.map((edu, i) => edu.degree && (
                            <div key={i} className="flex justify-between text-[11px]">
                              <div>
                                <span className="font-bold text-gray-900">{edu.degree}</span> — {edu.institution} {edu.grade ? `(${edu.grade})` : ''}
                              </div>
                              <span className="text-[10px] font-mono text-gray-500">{edu.startYear} – {edu.endYear}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {debouncedData.skills.length > 0 && (
                      <section className="mb-3">
                        <h2 className="section-title-executive">Executive Competencies</h2>
                        <p className="text-[11px] text-gray-800 leading-relaxed">
                          {debouncedData.skills.map(s => s.name).join(" • ")}
                        </p>
                      </section>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Confirmation Reset Modal */}
      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-dialog card p-6 max-w-sm mx-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 text-red-500 mb-3">
              <AlertCircle size={24} />
              <h3 className="font-bold text-lg text-primary">Start New Resume?</h3>
            </div>
            <p className="text-xs text-secondary mb-5 leading-relaxed">
              This will permanently delete your current resume data from your browser. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetConfirmed}
                className="btn btn-primary btn-sm bg-red-600 hover:bg-red-700"
              >
                Yes, Start New
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
