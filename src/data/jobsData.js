import liveScrapedJobs from './liveScrapedJobs.json';

export const BASE_JOBS_DATA = [];

export const JOBS_DATA = [...BASE_JOBS_DATA, ...liveScrapedJobs];

export const CITIES = [
  "All Cities",
  "Islamabad",
  "Lahore",
  "Karachi",
  "Peshawar",
  "Quetta",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Hyderabad",
  "Sukkur",
  "Abbottabad",
  "Tarbela",
  "Mangla"
];

export const PROVINCES = [
  "All Pakistan",
  "Federal",
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "AJK & Gilgit-Baltistan"
];

export const BPS_SCALES = [
  "All BPS Scales",
  "BPS-11",
  "BPS-14",
  "BPS-16",
  "BPS-17",
  "BPS-18",
  "BPS-19",
  "BPS-20"
];

export const QUALIFICATIONS = [
  "All Qualifications",
  "Matric / Intermediate",
  "Bachelor's Degree (14 Years)",
  "BS / Master's Degree (16 Years)",
  "MS / M.Phil (18 Years)",
  "MBBS / Medical Degree",
  "Engineering (PEC Registered)",
  "LL.B / Law Degree"
];

export const CATEGORIES = [
  { id: "all", label: "All Opportunities", icon: "Layers" },
  { id: "govt", label: "Government Jobs", icon: "Landmark" },
  { id: "private", label: "Private & Tech Jobs", icon: "Building2" },
  { id: "fpsc", label: "Federal (FPSC)", icon: "Landmark" },
  { id: "ppsc", label: "Punjab (PPSC)", icon: "Landmark" },
  { id: "spsc", label: "Sindh (SPSC)", icon: "Landmark" },
  { id: "kppsc", label: "KPK (KPPSC)", icon: "Landmark" },
  { id: "nts", label: "Testing Services (NTS)", icon: "ShieldCheck" },
  { id: "tech", label: "Software & IT", icon: "Sparkles" }
];

export const EXAM_SCHEDULES = [
  {
    id: "exam-css-2027",
    title: "CSS Competitive Examination 2027 (MPT Preliminary)",
    agency: "FPSC",
    badge: "Federal Commission",
    status: "Upcoming",
    screeningDate: "October 18, 2026",
    writtenExamDate: "February 15, 2027",
    challanDeadline: "September 30, 2026",
    challanFee: "PKR 250",
    syllabusUrl: "https://www.fpsc.gov.pk",
    description: "Screening MCQ-based preliminary test (MPT) is mandatory for appearing in CSS 2027 Written Exam.",
    subjects: ["English (50)", "General Ability (60)", "General Knowledge (50)", "Islamic Studies (20)", "Urdu (20)"],
    eligibility: "Bachelor's Degree (2nd Division), Age: 21-30 Years (as of 31-12-2026)"
  },
  {
    id: "exam-pms-punjab-2026",
    title: "PMS Punjab Combined Competitive Examination 2026",
    agency: "PPSC",
    badge: "Punjab Commission",
    status: "Registration Closed",
    screeningDate: "September 27, 2026",
    writtenExamDate: "November 10, 2026",
    challanDeadline: "Closed",
    challanFee: "PKR 1000",
    syllabusUrl: "https://www.ppsc.gop.pk",
    description: "Provincial Management Service (PMS) Officer recruitment across 36 districts of Punjab.",
    subjects: ["English Essay (100)", "English Precis (100)", "Urdu (100)", "Islamic Studies (100)", "Pakistan Studies (100)", "General Knowledge (100)"],
    eligibility: "Graduation (2nd Division), Domicile: Punjab, Age: 21-28 (+ 5 Years Gen Relaxation)"
  },
  {
    id: "exam-spsc-cce-2026",
    title: "CCE Combined Competitive Examination 2026 (Sindh)",
    agency: "SPSC",
    badge: "Sindh Commission",
    status: "Syllabus Released",
    screeningDate: "November 05, 2026",
    writtenExamDate: "January 12, 2027",
    challanDeadline: "October 15, 2026",
    challanFee: "PKR 1000",
    syllabusUrl: "https://www.spsc.gos.pk",
    description: "Sindh Public Service Commission recruitment for Assistant Commissioner (AC) & Section Officer (SO).",
    subjects: ["English Composition", "Sindhi / Urdu", "General Knowledge & Current Affairs", "Three Optional Electives"],
    eligibility: "Graduation (2nd Division), Domicile: Sindh (Rural/Urban), Age: 21-30 (+ General Age Relaxation)"
  },
  {
    id: "exam-kppsc-pms-2026",
    title: "KPPSC Provincial Management Service (PMS) 2026",
    agency: "KPPSC",
    badge: "Khyber Commission",
    status: "Upcoming",
    screeningDate: "October 24, 2026",
    writtenExamDate: "December 08, 2026",
    challanDeadline: "September 25, 2026",
    challanFee: "PKR 1500",
    syllabusUrl: "https://www.kppsc.gov.pk",
    description: "Recruitment for Provincial Planning & Admin cadre in Khyber Pakhtunkhwa civil service.",
    subjects: ["English Essay", "General Knowledge", "Everyday Science", "Current Affairs", "Optional Group Papers"],
    eligibility: "14 or 16 Years Degree, Domicile: Khyber Pakhtunkhwa / Merged Districts"
  }
];
