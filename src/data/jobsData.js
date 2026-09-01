import liveScrapedJobs from './liveScrapedJobs.json';

export const BASE_JOBS_DATA = [
  {
    id: "govt-fpsc-01",
    type: "govt",
    title: "Assistant Director (Investigation) - BPS-17",
    department: "Federal Investigation Agency (FIA) / FPSC",
    agency: "FPSC",
    category: "Federal (FPSC)",
    subCategory: "Law Enforcement & Investigation",
    bpsScale: "BPS-17",
    city: "Islamabad (All Pakistan Posting)",
    province: "Federal",
    qualification: "Masters / BS (16 Years) in Criminology / Law / CS / Social Sciences",
    vacancies: 48,
    ageLimit: "22 - 30 Years (+ 5 Years General Relaxation = 35 Max)",
    quota: "Merit: 4 | Punjab: 24 | Sindh (R): 5 | Sindh (U): 4 | KPK: 6 | Balochistan: 3 | Ex-FATA: 2",
    postDate: "2026-08-26",
    lastDate: "2026-09-03", // Urgent (expiring soon)
    urgent: true,
    featured: true,
    verified: true,
    challanFee: "PKR 300 (Paid in NBP/State Bank via Treasury Receipt 32-A)",
    officialUrl: "https://online.fpsc.gov.pk",
    officialSourceLabel: "FPSC Official Consolidated Advt No. 08/2026 (Case No. F.4-112/2026-R)",
    description: "Federal Public Service Commission invites online applications for 48 permanent positions of Assistant Director (Investigation) in the Federal Investigation Agency (FIA), Ministry of Interior. Candidates will undergo a Screening MCQ Test followed by Descriptive Test & Psychological Assessment.",
    eligibilityCriteria: [
      "Second Class or Grade 'C' Master's Degree / 4-Year Bachelor's Degree from a HEC recognized University.",
      "Physical Fitness: Minimum Height 5'6\" (Male), 5'2\" (Female); Chest 32\"-33.5\" (Male).",
      "Pakistani Citizens holding valid CNIC & Domicile certificate of respective province."
    ],
    syllabus: [
      "Part-I (English 20 Marks): Grammar Usage, Sentence Structuring, Vocabulary",
      "Part-II (General Knowledge 20 Marks): Pakistan Affairs, Current Affairs, Everyday Science",
      "Part-III (FIA Act 1974 & Investigation Laws 30 Marks): Basic Criminal Law & Prevention of Electronic Crimes Act (PECA 2016)",
      "Part-IV (Basic IT & Cyber Fundamentals 30 Marks): Databases, Cyber Threats, Digital Forensics Awareness"
    ],
    howToApply: [
      "Download FPSC Challan Form (32-A) and deposit PKR 300 at any National Bank of Pakistan branch.",
      "Visit the official FPSC Online Portal (online.fpsc.gov.pk) and select Consolidated Advt No. 08/2026.",
      "Fill your profile, enter the Bank Challan Code, Branch Name, and Fee Deposit Date.",
      "Select your preferred examination center (Islamabad, Lahore, Karachi, Peshawar, Quetta, Multan, Sukkur).",
      "Submit before the deadline. Keep the original bank receipt safe for test entry."
    ]
  },
  {
    id: "govt-ppsc-02",
    type: "govt",
    title: "Tehsildar / Consolidations Officer - BPS-16",
    department: "Punjab Revenue Authority / Board of Revenue Punjab",
    agency: "PPSC",
    category: "Provincial (PPSC)",
    subCategory: "Revenue & Administration",
    bpsScale: "BPS-16",
    city: "Lahore / All Punjab Districts",
    province: "Punjab",
    qualification: "Graduation (14 or 16 Years) in any discipline from HEC recognized University",
    vacancies: 64,
    ageLimit: "21 - 28 Years (+ 5 Years Male / + 8 Years Female Relaxation)",
    quota: "Open Merit: 45 | Women Quota: 12 | Special Person: 4 | Minority: 3",
    postDate: "2026-08-20",
    lastDate: "2026-09-08",
    urgent: false,
    featured: true,
    verified: true,
    challanFee: "PKR 600 (Paid through 1Link, ATM, JazzCash, EasyPaisa via PSID)",
    officialUrl: "https://www.ppsc.gop.pk",
    officialSourceLabel: "PPSC Advertisement No. 19/2026",
    description: "Punjab Public Service Commission (PPSC) announces prestigious revenue administration openings for Tehsildar & Naib Tehsildar in the Punjab Board of Revenue. Selected candidates will oversee land revenue, dispute settlement, and local district coordination.",
    eligibilityCriteria: [
      "Graduation (Second Division) from a recognized university.",
      "Domicile: Punjab Province (All Districts eligible).",
      "Computer proficiency in MS Office / IT fundamentals is mandatory."
    ],
    syllabus: [
      "Paper-I (English Essay & Composition - 100 Marks / Subjective)",
      "Paper-II (Urdu Essay & Precise - 100 Marks / Subjective)",
      "Paper-III (General Ability MCQ - 100 Marks): Pakistan Studies, Islamic Studies, Geography, Everyday Science, Math",
      "Paper-IV (Revenue Laws & Land Records Manual - 100 Marks MCQ)"
    ],
    howToApply: [
      "Generate 17-digit PSID through PPSC portal application step.",
      "Pay PKR 600 application fee via Mobile Banking App, ATM, JazzCash or 1Link OTC.",
      "Upload CNIC front/back, recent passport-size photograph with white background, and Bank Deposit confirmation.",
      "Verify all qualification entries and finalize application before 12:00 AM on the closing date."
    ]
  },
  {
    id: "govt-nts-03",
    type: "govt",
    title: "Assistant Director (Engineering / Operations) - BPS-17",
    department: "Water & Power Development Authority (WAPDA)",
    agency: "NTS",
    category: "Testing Services (NTS)",
    subCategory: "Engineering & Power",
    bpsScale: "BPS-17",
    city: "Tarbela / Mangla / Lahore",
    province: "Federal",
    qualification: "B.Sc / BE Electrical / Mechanical / Civil Engineering (PEC Registered)",
    vacancies: 32,
    ageLimit: "21 - 33 Years",
    quota: "Open Merit: 3 | Punjab: 16 | Sindh: 6 | KPK: 4 | Balochistan: 2 | AJK: 1",
    postDate: "2026-08-28",
    lastDate: "2026-09-04", // Urgent
    urgent: true,
    featured: false,
    verified: true,
    challanFee: "PKR 550 (Via 1Bill / EasyPaisa / JazzCash / Bank Invoice)",
    officialUrl: "https://www.nts.org.pk",
    officialSourceLabel: "WAPDA Recruitment Project Phase-IV (NTS Code: WAPD-2026-A)",
    description: "WAPDA is inducting talented young engineers for mega hydropower dam projects (Diamer Bhasha, Mohmand Dam, Tarbela 5th Extension). National Testing Service (NTS) is conducting the national screening aptitude examination.",
    eligibilityCriteria: [
      "16 Years Bachelor's Degree in Electrical, Mechanical, or Civil Engineering with minimum 1st Division / 3.0 CGPA.",
      "Active registration with Pakistan Engineering Council (PEC)."
    ],
    syllabus: [
      "Core Engineering Subject Specialization (50%)",
      "General English & Analytical Reasoning (20%)",
      "Quantitative & Applied Mathematics (15%)",
      "Pakistan Studies, Islamic Studies & Current Affairs (15%)"
    ],
    howToApply: [
      "Visit NTS Official Portal (nts.org.pk) and navigate to Open Applications.",
      "Fill online application form and generate fee deposit slip with unique 1Bill Consumer Number.",
      "Pay fee via ATM, Online Banking, or Mobile Wallet.",
      "Download printed confirmation receipt for Roll Number Slip retrieval."
    ]
  },
  {
    id: "govt-spsc-04",
    type: "govt",
    title: "Medical Officer & Women Medical Officer - BPS-17",
    department: "Health Department, Government of Sindh",
    agency: "SPSC",
    category: "Provincial (SPSC)",
    subCategory: "Healthcare & Medicine",
    bpsScale: "BPS-17",
    city: "Karachi, Hyderabad, Sukkur, Larkana",
    province: "Sindh",
    qualification: "MBBS with 1 Year Mandatory House Job (PMDC / PMC Registered)",
    vacancies: 350,
    ageLimit: "21 - 30 Years (+ 15 Years General Relaxation for Sindh Health Cadre)",
    quota: "Sindh (Rural): 210 | Sindh (Urban): 140",
    postDate: "2026-08-15",
    lastDate: "2026-09-15",
    urgent: false,
    featured: true,
    verified: true,
    challanFee: "PKR 500 (Paid at State Bank / NBP through Head of Account C02101)",
    officialUrl: "https://www.spsc.gos.pk",
    officialSourceLabel: "SPSC Combined Medical Service Advertisement 06/2026",
    description: "Sindh Public Service Commission (SPSC) invites applications from eligible Medical Graduates for 350 regular posts of Medical Officers across District Headquarters Hospitals (DHQs) and Rural Health Centres (RHCs).",
    eligibilityCriteria: [
      "MBBS degree recognized by Pakistan Medical and Dental Council (PM&DC).",
      "One year regular house job completion certificate.",
      "Valid permanent PMDC registration certificate."
    ],
    syllabus: [
      "Internal Medicine & Surgery (40 Marks)",
      "Pediatrics, Gynecology & Obstetrics (30 Marks)",
      "Public Health, Epidemiology & Community Medicine (20 Marks)",
      "General English & Medical Ethics (10 Marks)"
    ],
    howToApply: [
      "Pay Challan at National Bank / SBP under Account Head C02101 - SPSC Examination Fee.",
      "Log into spsc.gos.pk using CNIC and registered password.",
      "Upload scanned copy of paid challan, PMDC certificate, and Domicile Form-D.",
      "Submit application and print confirmation summary sheet."
    ]
  },
  {
    id: "govt-kppsc-05",
    type: "govt",
    title: "Lecturer (Computer Science / IT) - BPS-17",
    department: "Higher Education Department, Government of Khyber Pakhtunkhwa",
    agency: "KPPSC",
    category: "Provincial (KPPSC)",
    subCategory: "Education & Teaching",
    bpsScale: "BPS-17",
    city: "Peshawar, Mardan, Swat, Abbottabad",
    province: "Khyber Pakhtunkhwa",
    qualification: "Master's Degree / MS / BS (16 Years) in Computer Science / IT / Software Engineering",
    vacancies: 75,
    ageLimit: "21 - 35 Years",
    quota: "Zone-1: 15 | Zone-2: 15 | Zone-3: 15 | Zone-4: 15 | Zone-5: 15",
    postDate: "2026-08-22",
    lastDate: "2026-09-02", // Urgent
    urgent: true,
    featured: false,
    verified: true,
    challanFee: "PKR 500 (Payable through JazzCash / EasyPaisa / Bank Agent)",
    officialUrl: "https://www.kppsc.gov.pk",
    officialSourceLabel: "KPPSC Advt No. 05/2026 (Higher Education Cadre)",
    description: "Khyber Pakhtunkhwa Public Service Commission announces recruitment for Assistant Professors & Lecturers in Government Degree Colleges across all KP zonal areas.",
    eligibilityCriteria: [
      "At least Second Class Master's degree or 4-year BS in CS / IT from HEC recognized university.",
      "Domicile: KP including Merged Tribal Districts (Ex-FATA)."
    ],
    syllabus: [
      "Core CS Curriculum: Algorithms, Data Structures, OOP, DBMS (45 Marks)",
      "Software Engineering, Web & Network Systems (25 Marks)",
      "Pedagogical Principles & Research Methodology (15 Marks)",
      "English Communication & Grammar (15 Marks)"
    ],
    howToApply: [
      "Deposit PKR 500 fee through KPPSC digital payment partner using Transaction PIN.",
      "Visit kppsc.gov.pk, log in with CNIC, enter transaction code.",
      "Select College Education Department > Lecturer CS (BPS-17).",
      "Confirm zonal quota selection and submit form."
    ]
  },
  {
    id: "govt-mod-06",
    type: "govt",
    title: "Sub-Inspector (Investigation) - BPS-14",
    department: "Anti-Narcotics Force (ANF) / Ministry of Narcotics Control",
    agency: "NTS",
    category: "Police & Armed Forces",
    subCategory: "Security & Intelligence",
    bpsScale: "BPS-14",
    city: "Rawalpindi, Karachi, Lahore, Quetta, Peshawar",
    province: "Federal",
    qualification: "Graduation (BA / B.Sc / B.Com / BS) Second Division",
    vacancies: 56,
    ageLimit: "18 - 30 Years",
    quota: "Merit: 4 | Punjab: 28 | Sindh: 9 | KPK: 7 | Balochistan: 4 | AJK/GB: 4",
    postDate: "2026-08-24",
    lastDate: "2026-09-12",
    urgent: false,
    featured: false,
    verified: true,
    challanFee: "PKR 400 (Online deposit via 1Link / NTS)",
    officialUrl: "https://www.anf.gov.pk",
    officialSourceLabel: "ANF Headquarter Direct Recruitment 2026-II",
    description: "Anti-Narcotics Force (ANF) invites energetic youth for field and intelligence operations against drug trafficking and transnational narcotics networks.",
    eligibilityCriteria: [
      "Bachelor's Degree in any discipline from a recognized University.",
      "Physical: Height 5'7\" (Male), 5'4\" (Female); Running: 1.6 KM in 7 minutes."
    ],
    syllabus: [
      "Physical Screening Test (Height, Chest, 1 Mile Run, Push-ups)",
      "Written MCQ Test: English (25%), Intelligence/IQ (25%), General Knowledge (25%), Anti-Narcotics Laws (25%)"
    ],
    howToApply: [
      "Register on official recruitment portal.",
      "Download physical test registration slip.",
      "Appear at designated ANF field headquarters for endurance test."
    ]
  },
  {
    id: "govt-sbp-07",
    type: "govt",
    title: "Assistant Director (State Bank Officers Training Scheme - SBOTS 27th Batch)",
    department: "State Bank of Pakistan (SBP) & SBP BSC",
    agency: "Testing Services (NTS)",
    category: "Banking & Finance",
    subCategory: "Central Banking & Monetary Policy",
    bpsScale: "OG-2 (Equivalent to BPS-17)",
    city: "Karachi (Head Office) / Nationwide Branches",
    province: "Federal",
    qualification: "Master's / 4-Year Bachelor's with 16 years education in Economics, Finance, CS, Business, Stats",
    vacancies: 60,
    ageLimit: "Max 26 Years (Relaxed by 3 Years for Candidates from Balochistan, AJK, GB & FATA)",
    quota: "Provincial / Regional Quota strictly observed as per Federal Government policy",
    postDate: "2026-08-18",
    lastDate: "2026-09-09",
    urgent: false,
    featured: true,
    verified: true,
    challanFee: "PKR 650 (Online Testing & Center Fee)",
    officialUrl: "https://www.sbp.org.pk",
    officialSourceLabel: "State Bank of Pakistan Official Career Announcement SBOTS-27",
    description: "State Bank of Pakistan offers premier career opportunity through SBOTS 27th Batch. Selected officers receive 6 months residential training at National Institute of Banking & Finance (NIBAF) with attractive stipend and confirmed placement as OG-2.",
    eligibilityCriteria: [
      "16 Years of Education with at least 60% marks or 2.5/4.0 CGPA.",
      "Graduates of 2024, 2025, 2026 eligible."
    ],
    syllabus: [
      "Section A: English Comprehension & Verbal Reasoning (30%)",
      "Section B: Quantitative Aptitude & Data Interpretation (30%)",
      "Section C: Analytical Reasoning & Logic (20%)",
      "Section D: Pakistan Economy & Financial System Fundamentals (20%)"
    ],
    howToApply: [
      "Submit application on SBP/Testing Agency web link.",
      "Print generated bank challan and deposit required fee.",
      "Shortlisted candidates will take computerized adaptive screening test across major cities."
    ]
  },

  // ================= PRIVATE / IT / TECH JOBS =================
  {
    id: "priv-tech-01",
    type: "private",
    title: "Senior Full Stack Engineer (React + Node.js / Python)",
    company: "Systems Limited",
    category: "IT & Software",
    subCategory: "Software Development",
    salaryRange: "PKR 350,000 - 500,000 / month + Medical + Fuel",
    city: "Lahore / Karachi (Hybrid - 2 days WFH)",
    province: "Punjab",
    qualification: "BS / MS in Computer Science, Software Engineering or equivalent experience",
    vacancies: 4,
    experience: "4 - 7 Years",
    postDate: "2026-08-27",
    lastDate: "2026-09-05", // Urgent
    urgent: true,
    featured: true,
    verified: true,
    officialUrl: "https://www.systemsltd.com/careers",
    officialSourceLabel: "Systems Limited Official Careers Portal",
    description: "Systems Limited is seeking experienced Full Stack Engineers to architect enterprise-grade cloud native platforms for tier-1 telecommunication and fintech clients in North America and EMEA.",
    eligibilityCriteria: [
      "4+ years building high-throughput microservices using Node.js or Python (FastAPI).",
      "Deep expertise with modern React, TypeScript, Tailwind/styled systems, Next.js.",
      "Hands-on production knowledge with PostgreSQL, Redis, Docker, AWS/GCP CI/CD pipelines."
    ],
    benefits: [
      "Market leading provident fund & gratuity",
      "Comprehensive family health insurance (OPD & IPD)",
      "Quarterly performance bonuses & fuel allowance",
      "Sponsored international cloud certifications (AWS / Azure)"
    ],
    howToApply: [
      "Click 'Apply on Official Site' to access the Systems Ltd ATS portal.",
      "Attach your ATS-friendly resume / CV and LinkedIn profile URL.",
      "Include GitHub / portfolio links showcasing full-stack projects."
    ]
  },
  {
    id: "priv-tech-02",
    type: "private",
    title: "DevOps & Cloud Infrastructure Specialist",
    company: "Arbisoft",
    category: "IT & Software",
    subCategory: "Cloud & DevOps",
    salaryRange: "PKR 280,000 - 420,000 / month + Annual Bonus",
    city: "Lahore / Islamabad (Hybrid)",
    province: "Punjab",
    qualification: "BS Computer Science / Software Engineering / IT",
    vacancies: 3,
    experience: "3 - 5 Years",
    postDate: "2026-08-25",
    lastDate: "2026-09-10",
    urgent: false,
    featured: true,
    verified: true,
    officialUrl: "https://arbisoft.com/careers",
    officialSourceLabel: "Arbisoft Careers Board",
    description: "Join Arbisoft's Infrastructure Engineering team to build robust automated deployment pipelines, maintain multi-region Kubernetes clusters, and optimize cloud infrastructure costs for Fortune 500 web applications.",
    eligibilityCriteria: [
      "Strong proficiency with Kubernetes, Terraform, Docker, and Helm charts.",
      "Production experience managing AWS (EKS, RDS, CloudFront, IAM) or GCP infrastructure.",
      "Proficient in Linux systems administration, Prometheus/Grafana monitoring, and GitHub Actions."
    ],
    benefits: [
      "Free daily breakfast & lunch buffet at campus",
      "Gym & wellness allowance",
      "Flexible working hours and modern ergonomic equipment provided",
      "Profit sharing annual dividend"
    ],
    howToApply: [
      "Submit application through Arbisoft career portal.",
      "Complete the initial 45-minute DevOps aptitude and coding challenge online.",
      "Technical video interview with Lead Platform Architect."
    ]
  },
  {
    id: "priv-tech-03",
    type: "private",
    title: "AI / Machine Learning Engineer (LLMs & RAG Systems)",
    company: "10Pearls",
    category: "IT & Software",
    subCategory: "Artificial Intelligence & Data",
    salaryRange: "PKR 300,000 - 480,000 / month + Equity Options",
    city: "Karachi / Islamabad / Remote Pakistan",
    province: "Federal",
    qualification: "BS / MS in CS, Data Science, AI or Applied Math",
    vacancies: 2,
    experience: "2 - 5 Years",
    postDate: "2026-08-28",
    lastDate: "2026-09-04", // Urgent
    urgent: true,
    featured: true,
    verified: true,
    officialUrl: "https://10pearls.com/careers",
    officialSourceLabel: "10Pearls Global Careers",
    description: "10Pearls Labs is expanding its generative AI practice. You will develop production-grade Retrieval-Augmented Generation (RAG) pipelines, fine-tune open-weights models (Llama, Mistral), and build agentic AI workflows.",
    eligibilityCriteria: [
      "Solid Python skills and experience with PyTorch, LangChain / LlamaIndex, Vector DBs (Pinecone, Qdrant, Milvus).",
      "Experience deploying models using vLLM, Ollama, Triton or AWS Bedrock.",
      "Clear understanding of tokenization, prompt engineering, embeddings, and evaluation metrics."
    ],
    benefits: [
      "Remote-first work environment",
      "Home office setup stipend (PKR 100,000)",
      "US client project exposure & AI conference sponsorships",
      "Annual company retreat & paid parental leave"
    ],
    howToApply: [
      "Apply directly on 10Pearls careers website.",
      "Provide links to Hugging Face models, Kaggle profile, or open source PRs."
    ]
  },
  {
    id: "priv-tech-04",
    type: "private",
    title: "Senior Product Designer (UI/UX - SaaS Systems)",
    company: "Careem (An Uber Company)",
    category: "IT & Software",
    subCategory: "Design & Product",
    salaryRange: "PKR 320,000 - 460,000 / month + Ride Credits",
    city: "Karachi / Lahore / Islamabad (Remote Allowed)",
    province: "Sindh",
    qualification: "Bachelors in Design, CS, HCI or equivalent proven portfolio",
    vacancies: 2,
    experience: "4+ Years",
    postDate: "2026-08-21",
    lastDate: "2026-09-14",
    urgent: false,
    featured: false,
    verified: true,
    officialUrl: "https://www.careem.com/en-ae/careers",
    officialSourceLabel: "Careem Global Job Openings",
    description: "Careem is looking for a Senior Product Designer to design seamless experiences for millions of Captains and Customers across Pakistan and the MENA region. You will craft design systems, user flows, and high-fidelity prototypes in Figma.",
    eligibilityCriteria: [
      "Strong portfolio demonstrating complex mobile app and SaaS workflow designs.",
      "Expert mastery in Figma, auto-layout, design tokens, component libraries, and micro-interactions.",
      "Experience conducting user interviews and usability testing in Urdu & English."
    ],
    benefits: [
      "Monthly Careem ride & Food delivery credits",
      "Comprehensive medical coverage including parents",
      "Flexible hybrid/remote policy",
      "MacBook Pro M3 Max workstation provided"
    ],
    howToApply: [
      "Apply via Careem Careers link with PDF or web link to your live design portfolio."
    ]
  },
  {
    id: "priv-fin-05",
    type: "private",
    title: "Fintech Growth & Performance Marketing Manager",
    company: "SadaPay",
    category: "Banking & Finance",
    subCategory: "Fintech & Marketing",
    salaryRange: "PKR 250,000 - 380,000 / month + Stock Options",
    city: "Islamabad / Remote",
    province: "Federal",
    qualification: "BBA / BS Marketing, Data Analytics, or related discipline",
    vacancies: 1,
    experience: "3 - 6 Years",
    postDate: "2026-08-23",
    lastDate: "2026-09-11",
    urgent: false,
    featured: false,
    verified: true,
    officialUrl: "https://sadapay.pk/careers",
    officialSourceLabel: "SadaPay Workable Portal",
    description: "SadaPay is on a mission to make money so simple that any Pakistani can use it effortlessly. Lead user acquisition across Meta, TikTok, Google Ads, and in-app referral funnels.",
    eligibilityCriteria: [
      "Proven track record scaling mobile app user acquisition (CAC, ROAS, LTV) in Pakistan.",
      "Proficient in Mixpanel, Adjust/AppsFlyer, Google Analytics 4, and SQL queries.",
      "Experience managing six-figure monthly digital ad budgets."
    ],
    benefits: [
      "Generous stock option (ESOP) grant",
      "Unlimited paid time off policy",
      "Health & mental wellness insurance",
      "MacBook + 4K monitor setup allowance"
    ],
    howToApply: [
      "Submit CV through SadaPay careers portal with a 2-paragraph summary of your largest growth campaign."
    ]
  }
];

export const JOBS_DATA = [...BASE_JOBS_DATA, ...(Array.isArray(liveScrapedJobs) ? liveScrapedJobs : [])];

export const CATEGORIES = [
  { id: "all", label: "All Opportunities", icon: "LayoutGrid", count: 12 },
  { id: "govt", label: "Government Jobs", icon: "Landmark", count: 7 },
  { id: "private", label: "Private & Tech Jobs", icon: "Building2", count: 5 },
  { id: "fpsc", label: "Federal (FPSC)", icon: "ShieldCheck", count: 2 },
  { id: "ppsc", label: "Punjab (PPSC)", icon: "Award", count: 2 },
  { id: "spsc", label: "Sindh (SPSC)", icon: "Compass", count: 1 },
  { id: "kppsc", label: "KPK (KPPSC)", icon: "BookOpen", count: 1 },
  { id: "nts", label: "Testing Services (NTS)", icon: "FileCheck", count: 3 },
  { id: "tech", label: "Software & IT", icon: "Code2", count: 4 },
  { id: "banking", label: "Banking & Finance", icon: "Coins", count: 2 }
];

export const PROVINCES = [
  "All Pakistan",
  "Federal",
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "AJK",
  "Gilgit-Baltistan",
  "Remote"
];

export const CITIES = [
  "All Cities",
  "Islamabad",
  "Lahore",
  "Karachi",
  "Rawalpindi",
  "Peshawar",
  "Quetta",
  "Multan",
  "Faisalabad",
  "Hyderabad",
  "Abbottabad",
  "Remote"
];

export const BPS_SCALES = [
  "All BPS Scales",
  "BPS-07 to BPS-11",
  "BPS-14",
  "BPS-16",
  "BPS-17",
  "BPS-18",
  "BPS-19+"
];

export const QUALIFICATIONS = [
  "All Qualifications",
  "Matric / Intermediate",
  "Bachelor's (14 Years)",
  "Graduation / BS (16 Years)",
  "Master's / M.Phil (18 Years)",
  "MBBS / Medical",
  "Engineering (PEC)"
];
