/**
 * Tainaati — Master Category Taxonomy & Configuration
 * Defines the expanded 20 top-level and sub-categories across Govt, Private, and Cross-Cutting sectors.
 * Single source of truth for navigation, landing pages, SEO metadata, icons, and filtering.
 */

export const CATEGORIES_CONFIG = [
  // ==========================================
  // GOVERNMENT-SIDE CATEGORIES (1-7)
  // ==========================================
  {
    id: "armed-forces",
    slug: "armed-forces",
    name: "Armed Forces & Defence",
    shortName: "Armed Forces",
    group: "govt",
    groupLabel: "Government Sectors",
    icon: "Shield",
    h1: "Armed Forces & Defence Jobs in Pakistan 2026",
    tagline: "Commissioned officer courses, civilian technical cadres, and uniformed personnel recruitment across Pak Army, Navy, PAF, and paramilitary forces.",
    metaTitle: "Armed Forces & Defence Jobs in Pakistan 2026 — Army, Navy, PAF & Rangers",
    metaDescription: "Apply for latest Pakistan Armed Forces commissions and civilian jobs. Pak Army PMA Long Course, Navy PN CADET & Civilian, PAF GD Pilot, and Rangers vacancies with official criteria.",
    subcategories: [
      "Pak Army Commissions (PMA / DSSC)",
      "Pakistan Navy (Officers & Civilian Staff)",
      "Pakistan Air Force (PAF GD Pilot / Aeronautical)",
      "Pakistan Rangers & Frontier Corps (FC)",
      "Ministry of Defence (MoD) Civilian Posts"
    ],
    faqs: [
      {
        question: "How can I join the Pakistan Armed Forces as an officer?",
        answer: "Candidates can join via the PMA Long Course (Pak Army), PN Cadet (Pakistan Navy), or GD Pilot / Aeronautical Engineering (PAF) through official selection centers and ISSB (Inter Services Selection Board) testing."
      },
      {
        question: "Are there civilian recruitment positions in Defence departments?",
        answer: "Yes, the Pakistan Navy, Pakistan Air Force, and Ministry of Defence regularly hire civilian assistants, stenotypists, IT specialists, and engineers through FPSC and direct departmental recruitment."
      },
      {
        question: "What is the age limit for Armed Forces commission?",
        answer: "For regular commissioned courses (Intermediate qualified), the age limit is typically 17 to 22 years. For Direct Short Service Commissions (DSSC) with professional degrees (Doctors, Engineers, IT), the age limit extends up to 28-32 years."
      }
    ]
  },
  {
    id: "police-law-enforcement",
    slug: "police-law-enforcement",
    name: "Police & Law Enforcement",
    shortName: "Police & Enforcement",
    group: "govt",
    groupLabel: "Government Sectors",
    icon: "ShieldAlert",
    h1: "Police & Law Enforcement Jobs in Pakistan 2026",
    tagline: "Provincial police forces, Federal Investigation Agency (FIA), Anti-Narcotics Force (ANF), and Excise & Taxation recruitment across all provinces.",
    metaTitle: "Police & Law Enforcement Jobs in Pakistan 2026 — Police, FIA, ANF & Excise",
    metaDescription: "Browse verified vacancies in Punjab Police, Sindh Police, KP Police, Balochistan Police, FIA, ANF, and Provincial Excise & Taxation departments. Gazette verified criteria.",
    subcategories: [
      "Provincial Police (Punjab / Sindh / KP / Balochistan Police)",
      "Federal Investigation Agency (FIA Investigation & Cyber Crime)",
      "Anti Narcotics Force (ANF Cadre)",
      "Excise, Taxation & Narcotics Control",
      "Motorway Police (NHMP Inspector & Patrol Officer)"
    ],
    faqs: [
      {
        question: "How do I apply for Sub-Inspector or ASI jobs in Provincial Police?",
        answer: "Sub-Inspector posts (BPS-14) are recruited through Provincial Public Service Commissions (PPSC, SPSC, KPPSC) with written tests, physical screening (running and chest/height measurement), and psychology/interview rounds."
      },
      {
        question: "How does FIA recruit Assistant Directors and Inspectors?",
        answer: "Federal Investigation Agency (FIA) gazetted posts (BPS-16 and BPS-17) are advertised through Federal Public Service Commission (FPSC) consolidated advertisements with screening MCQs and descriptive tests."
      }
    ]
  },
  {
    id: "judiciary-legal",
    slug: "judiciary-legal",
    name: "Judiciary & Legal",
    shortName: "Judiciary & Legal",
    group: "govt",
    groupLabel: "Government Sectors",
    icon: "Scale",
    h1: "Judiciary & Legal Affairs Jobs in Pakistan 2026",
    tagline: "Civil Judge & Judicial Magistrate examinations, Additional District & Sessions Judge posts, High Court Law Clerks, and Public Prosecutor recruitment.",
    metaTitle: "Judiciary & Legal Jobs in Pakistan 2026 — Civil Judge, AD&SJ, Law Officer Posts",
    metaDescription: "Explore verified Judicial service exams and Legal Advisor positions in Pakistan. Provincial High Courts, District Courts, Law & Justice Commission, and Prosecution departments.",
    subcategories: [
      "Civil Judge & Judicial Magistrate (Provincial High Courts)",
      "Additional District & Sessions Judge (AD&SJ)",
      "High Court Law Clerks & Research Associates",
      "Public Prosecutors & District Attorneys",
      "Corporate Legal Advisors & Law Officers (BPS-17+)"
    ],
    faqs: [
      {
        question: "What is the eligibility requirement for Civil Judge examinations in Pakistan?",
        answer: "Applicants must hold an LL.B. degree from a recognized university and possess at least 2 years of active practice as an advocate, verified by the respective Provincial Bar Council."
      },
      {
        question: "Which authorities conduct judicial service recruitments?",
        answer: "Judicial recruitment is conducted either directly by the High Court Examination Committee (Lahore High Court, Sindh High Court, Peshawar High Court) or via Provincial Public Service Commissions."
      }
    ]
  },
  {
    id: "public-sector-enterprises",
    slug: "public-sector-enterprises",
    name: "Public Sector Enterprises / PSEs",
    shortName: "PSEs & Authorities",
    group: "govt",
    groupLabel: "Government Sectors",
    icon: "Factory",
    h1: "Public Sector Enterprises (PSEs) & Autonomous Bodies Jobs",
    tagline: "Career opportunities at WAPDA, NADRA, OGDCL, PTCL, Pakistan Post, SSGC, SNGPL, PIA, and National Highway Authority.",
    metaTitle: "PSEs & Public Sector Enterprises Jobs in Pakistan 2026 — WAPDA, NADRA, OGDCL",
    metaDescription: "Discover active vacancies in Pakistan's premier Public Sector Enterprises: WAPDA, NADRA, OGDCL, SSGC, SNGPL, Pakistan Post, and Civil Aviation Authority. Official application portals.",
    subcategories: [
      "WAPDA (Water & Power Development Authority)",
      "NADRA (National Database & Registration Authority)",
      "OGDCL & Energy Sector Corporations (SSGC, SNGPL, PSO)",
      "Pakistan Post & National Logistics Cell (NLC)",
      "Civil Aviation Authority (CAA) & PIA"
    ],
    faqs: [
      {
        question: "Are jobs in WAPDA and NADRA government or autonomous positions?",
        answer: "WAPDA and NADRA are statutory autonomous federal authorities governed by official service regulations, offering competitive public pay packages, provident funds, and pension/gratuity benefits."
      },
      {
        question: "How do testing agencies screen candidates for PSE positions?",
        answer: "Entities like WAPDA, NADRA, and Pakistan Post frequently engage NTS, PTS, or Open Testing Service (OTS) to conduct preliminary screening tests before departmental interviews."
      }
    ]
  },
  {
    id: "teaching-education",
    slug: "teaching-education",
    name: "Teaching & Education",
    shortName: "Teaching & Education",
    group: "govt",
    groupLabel: "Government Sectors",
    icon: "GraduationCap",
    h1: "Teaching & Education Jobs in Pakistan 2026",
    tagline: "Lecturer and Assistant Professor positions, School Educators (SST/EST/PST), BISE examination boards, and HEC university faculty recruitments.",
    metaTitle: "Teaching & Education Jobs in Pakistan 2026 — School, College & University Posts",
    metaDescription: "Verified teaching vacancies across Pakistan. PPSC/FPSC College Lecturers (BPS-17), School Education Department recruitment, BISE administrative cadres, and HEC tenure-track faculty.",
    subcategories: [
      "College Lecturers & Subject Specialists (BPS-17)",
      "School Educators (SST, EST, PST cadres)",
      "University Faculty & HEC Tenure Track (TTS)",
      "Boards of Intermediate & Secondary Education (BISE)",
      "Special Education & Literacy Departments"
    ],
    faqs: [
      {
        question: "What qualification is required for College Lecturer (BPS-17) through PPSC/FPSC?",
        answer: "A Master's degree or BS (16 years of education) in the relevant subject with at least 2nd division from an HEC recognized university."
      },
      {
        question: "What is the examination pattern for teaching posts?",
        answer: "The written test typically consists of 80% subject-specific questions (syllabus of Master's/BS) and 20% General Knowledge, English, and Basic Mathematics."
      }
    ]
  },
  {
    id: "healthcare-medical",
    slug: "healthcare-medical",
    name: "Healthcare & Medical",
    shortName: "Healthcare & Medical",
    group: "govt",
    groupLabel: "Government Sectors",
    icon: "Stethoscope",
    h1: "Healthcare & Medical Jobs in Pakistan 2026",
    tagline: "Medical Officer (MO/WMO BPS-17), Senior Registrar & Consultant (BPS-18/19), Charge Nurse (BPS-16), and DHQ/THQ hospital postings.",
    metaTitle: "Healthcare & Medical Jobs in Pakistan 2026 — Doctors, Nurses & Specialists",
    metaDescription: "Browse verified public healthcare jobs in Pakistan. Specialized Healthcare Department, Medical Officers (BPS-17), Senior Registrars (BPS-18), Charge Nurses, and Paramedical postings.",
    subcategories: [
      "Medical Officers & Women Medical Officers (MO/WMO - BPS-17)",
      "Senior Registrars & Specialized Consultants (BPS-18/BPS-19)",
      "Charge Nurses & Nursing Instructors (BPS-16)",
      "Pharmacists & Drug Inspectors (BPS-17)",
      "DHQ / THQ District Healthcare Cadres"
    ],
    faqs: [
      {
        question: "Is PMDC / PNC registration mandatory to apply for medical posts?",
        answer: "Yes, valid permanent registration with the Pakistan Medical & Dental Council (PMDC) or Pakistan Nursing Council (PNC) is an absolute mandatory prerequisite."
      },
      {
        question: "What is the quota allocation for rural postings?",
        answer: "Provincial health departments typically offer rural posting incentives and assign a significant proportion of Medical Officer vacancies to District Headquarter (DHQ) and Tehsil Headquarter (THQ) hospitals."
      }
    ]
  },
  {
    id: "local-government",
    slug: "local-government",
    name: "Local Government / Municipal",
    shortName: "Local Govt & Municipal",
    group: "govt",
    groupLabel: "Government Sectors",
    icon: "MapPin",
    h1: "Local Government & Municipal Jobs in Pakistan 2026",
    tagline: "Chief Officers, Municipal Officers (Regulations/Finance), WASA water engineers, Union Council Secretaries, and City District Government administration.",
    metaTitle: "Local Government & Municipal Jobs in Pakistan 2026 — TMAs, WASA & Municipal",
    metaDescription: "Find verified positions in Local Government & Community Development, TMA municipal cadres, Water & Sanitation Agencies (WASA), and City District collectorates.",
    subcategories: [
      "Municipal Corporations & TMAs (Chief Officer / Regulations)",
      "WASA (Water and Sanitation Agency Engineers & Technicians)",
      "District Collectorate & Revenue Administration",
      "Union Council Secretaries & Field Staff",
      "Urban Development Authorities (LDA, KDA, CDA)"
    ],
    faqs: [
      {
        question: "How are Chief Officers and Municipal Officers recruited?",
        answer: "Recruitment is carried out by Provincial Public Service Commissions (such as PPSC in Punjab or SPSC in Sindh) under the Local Government Service Cadre."
      },
      {
        question: "Can non-residents apply for district-specific municipal jobs?",
        answer: "Most local municipal posts are domicile-specific to ensure local representation across tehsils, while higher supervisory cadres (BPS-17+) are open to province-wide merit."
      }
    ]
  },

  // ==========================================
  // PRIVATE-SIDE CATEGORIES (8-11)
  // ==========================================
  {
    id: "banking-finance",
    slug: "banking-finance",
    name: "Banking & Finance",
    shortName: "Banking & Finance",
    group: "private",
    groupLabel: "Private & Careers",
    icon: "Landmark",
    h1: "Banking & Finance Jobs in Pakistan 2026",
    tagline: "Central bank recruitment at State Bank of Pakistan (SBP), leading commercial banks (HBL, UBL, MCB, Allied), Islamic banks (Meezan), and fintech firms.",
    metaTitle: "Banking & Finance Jobs in Pakistan 2026 — SBP, HBL, Meezan & MCB",
    metaDescription: "Explore verified careers in Pakistani banking. State Bank of Pakistan SBOTS OG-2 scheme, commercial bank officers, Islamic finance, credit risk, and branch management openings.",
    subcategories: [
      "State Bank of Pakistan (SBOTS OG-2 Officer Training)",
      "Commercial Banking (Branch Managers, Cash Officers, Relationship Managers)",
      "Islamic Banking & Shariah Compliance (Meezan, BankIslami)",
      "Credit Risk, Internal Audit & Regulatory Compliance",
      "Fintech, Microfinance & Digital Payments"
    ],
    faqs: [
      {
        question: "What is the SBP SBOTS Officers Training Scheme?",
        answer: "State Bank Officers Training Scheme (SBOTS) is the premier central banking career track recruiting OG-2 officers through competitive screening (NTS) followed by residential training at NIBAF Islamabad."
      },
      {
        question: "Do Pakistani banks offer graduate trainee batches?",
        answer: "Yes, major financial institutions including HBL (The League MTO), Meezan Bank (Branch Service Trainee), and UBL launch annual nationwide management trainee programs for fresh graduates."
      }
    ]
  },
  {
    id: "engineering",
    slug: "engineering",
    name: "Engineering & Technical",
    shortName: "Engineering",
    group: "private",
    groupLabel: "Private & Careers",
    icon: "Wrench",
    h1: "Engineering & Technical Jobs in Pakistan 2026",
    tagline: "Civil, Electrical, Mechanical, and Chemical engineering roles across major consulting firms (NESPAK, Descon, FWO) and public infrastructure departments.",
    metaTitle: "Engineering Jobs in Pakistan 2026 — Civil, Electrical & Mechanical Roles",
    metaDescription: "Verified engineering jobs for PEC-registered engineers. Civil infrastructure, electrical power, mechanical design, project management, and irrigation cadres across Pakistan.",
    subcategories: [
      "Civil Engineering (Structural, Roadways & Infrastructure)",
      "Electrical & Power Systems (Transmission, Solar, DISCOs)",
      "Mechanical & HVAC Engineering",
      "Irrigation & Agricultural Water Engineering",
      "Health, Safety & Environment (HSE) Specialists"
    ],
    faqs: [
      {
        question: "Is Pakistan Engineering Council (PEC) registration mandatory?",
        answer: "Yes, for any graduate engineering position in both public sector (PWD, C&W, WAPDA) and reputed private EPC contractors, active PEC registration as a Registered/Professional Engineer is mandatory."
      },
      {
        question: "Where are the biggest engineering hubs in Pakistan?",
        answer: "Major construction, mega-dams, and industrial projects are centered in Lahore, Karachi, Islamabad/Rawalpindi, Tarbela, Mangla, and CPEC special economic zones."
      }
    ]
  },
  {
    id: "ngo-international",
    slug: "ngo-international",
    name: "NGO & International Organizations",
    shortName: "NGO & International",
    group: "private",
    groupLabel: "Private & Careers",
    icon: "HeartHandshake",
    h1: "NGO & International Organization Jobs in Pakistan 2026",
    tagline: "United Nations agencies (UNDP, UNICEF, WHO), USAID-funded programs, international development partners, and humanitarian relief organizations.",
    metaTitle: "NGO & UN Jobs in Pakistan 2026 — UNDP, UNICEF, USAID & Non-Profit Careers",
    metaDescription: "Discover verified career openings in international development and humanitarian organizations in Pakistan. UN agencies, USAID initiatives, social impact, and M&E roles.",
    subcategories: [
      "United Nations System (UNDP, UNICEF, WHO, UNHCR, WFP Pakistan)",
      "USAID & Foreign Development Agency Projects",
      "Monitoring, Evaluation, Accountability & Learning (MEAL)",
      "Humanitarian Relief & Disaster Management",
      "Community Development & Public Health Initiatives"
    ],
    faqs: [
      {
        question: "How do I apply for UN jobs in Pakistan?",
        answer: "UN positions in Pakistan (NO-A, NO-B, SB cadres) are published on UN Careers (inspira.un.org) and UNDP job portals. Applications require a detailed UN P11 profile submission."
      },
      {
        question: "What languages are required for international NGO jobs?",
        answer: "Fluency in written and spoken English is essential, while knowledge of Urdu and relevant local provincial languages (Pashto, Sindhi, Balochi) is highly valued for field operations."
      }
    ]
  },
  {
    id: "internships-trainee",
    slug: "internships-trainee",
    name: "Internships & Management Trainee Programs",
    shortName: "Internships & Trainees",
    group: "private",
    groupLabel: "Private & Careers",
    icon: "Sparkles",
    h1: "Internships & Management Trainee Programs in Pakistan 2026",
    tagline: "Fast-track corporate leadership programs (MTOs), banking trainee batches, paid telecom internships, and early-career graduate pathways.",
    metaTitle: "Management Trainee (MTO) & Internships in Pakistan 2026 — Top Corporate Programs",
    metaDescription: "Apply for competitive Management Trainee Programs (MTO) and paid internships at HBL, Jazz, Unilever, Nestlé, PTCL, and leading FMCG and banking conglomerates.",
    subcategories: [
      "Corporate Management Trainee Programs (MTO - FMCG, Telecom & Energy)",
      "Banking Trainee Officer Schemes (BTO / OG-2)",
      "Summer & Winter Paid Corporate Internships",
      "Graduate Engineer Trainee (GET Programs)",
      "Government National Internship Initiatives"
    ],
    faqs: [
      {
        question: "What is a Management Trainee Officer (MTO) program?",
        answer: "An MTO program is an intensive 1 to 2-year leadership track offered by top corporations designed to fast-track high-potential fresh university graduates into managerial positions."
      },
      {
        question: "Are fresh graduates without experience eligible for MTOs?",
        answer: "Yes, MTO programs specifically target graduating students and candidates with 0 to 1 year of professional experience, focusing evaluation on aptitude tests, assessment centers, and behavioral interviews."
      }
    ]
  },

  // ==========================================
  // CROSS-CUTTING CATEGORIES (12-14)
  // ==========================================
  {
    id: "overseas-gulf",
    slug: "overseas-gulf",
    name: "Overseas & Gulf Jobs",
    shortName: "Overseas & Gulf",
    group: "cross-cutting",
    groupLabel: "Cross-Cutting & Remote",
    icon: "Plane",
    h1: "Verified Overseas & Gulf Jobs for Pakistanis 2026",
    tagline: "Ministry-verified employment opportunities in Saudi Arabia, UAE (Dubai/Abu Dhabi), Qatar, Oman, and Kuwait via licensed Overseas Employment Promoters.",
    metaTitle: "Overseas & Gulf Jobs for Pakistanis 2026 — Saudi Arabia, UAE & Qatar",
    metaDescription: "Verified overseas career vacancies in Saudi Arabia, UAE, and Qatar. Government licensed OEP listings, healthcare, engineering, logistics, and skilled professional contracts.",
    subcategories: [
      "Saudi Arabia (KSA Mega Projects & Healthcare)",
      "United Arab Emirates (Dubai / Abu Dhabi Engineering & Corporate)",
      "Qatar, Oman & Kuwait Certified Vacancies",
      "Bureau of Emigration & Overseas Employment (BEOE Verified)",
      "Overseas Pakistani Foundation (OPF Direct Recruitment)"
    ],
    faqs: [
      {
        question: "How can I check if an overseas job offer is legitimate in Pakistan?",
        answer: "All legal overseas recruitments must be approved by the Bureau of Emigration & Overseas Employment (beoe.gov.pk). Check the OEP license number and permission number on the official BEOE portal before paying any processing charges."
      },
      {
        question: "What professions are most in-demand in the Gulf region?",
        answer: "Civil/infrastructure engineers, registered nurses, medical specialists, certified IT professionals, HVAC technicians, and hospitality supervisors represent the highest volume of verified demand."
      }
    ]
  },
  {
    id: "remote-freelance",
    slug: "remote-freelance",
    name: "Remote & Freelance Jobs",
    shortName: "Remote & Freelance",
    group: "cross-cutting",
    groupLabel: "Cross-Cutting & Remote",
    icon: "Laptop",
    h1: "Remote & Freelance Jobs in Pakistan 2026",
    tagline: "Work-from-home software development, AI model data annotation, content creation, virtual assistance, and digital marketing positions with USD/PKR compensation.",
    metaTitle: "Remote Jobs in Pakistan 2026 — Work From Home Software, Tech & Content",
    metaDescription: "Explore verified remote jobs in Pakistan. Global tech companies hiring Pakistani software engineers, AI trainers, digital marketers, and customer support with work-from-home flexibility.",
    subcategories: [
      "Remote Software Development (Full-Stack, React, Python, Mobile)",
      "AI Data Training, Annotation & LLM Evaluation",
      "Technical Content Writing & SEO Copywriting",
      "Virtual Assistance & Customer Experience Support",
      "UI/UX Design & Digital Product Management"
    ],
    faqs: [
      {
        question: "Can Pakistani residents receive remote salaries legally in USD?",
        answer: "Yes, IT freelancers and remote employees can receive foreign remittances directly via State Bank of Pakistan's designated Freelancer Foreign Currency (FFC) bank accounts with preferential tax incentives."
      },
      {
        question: "Do remote jobs require fixed working hours?",
        answer: "Remote positions vary: some require overlap with US/European time zones (EST/GMT), while many offer flexible asynchronous working hours based on sprint deliverables."
      }
    ]
  },
  {
    id: "exam-recruitment-hub",
    slug: "exam-recruitment-hub",
    name: "Exam-Based Recruitment Hub",
    shortName: "Exam Recruitment Hub",
    group: "cross-cutting",
    groupLabel: "Cross-Cutting & Remote",
    icon: "FileCheck",
    h1: "Exam-Based Competitive Recruitment Hub 2026",
    tagline: "Direct bridge to Central Superior Services (CSS), Provincial Management Service (PMS/CCE), National Testing Service (NTS), and public service screening tests.",
    metaTitle: "Exam-Based Recruitment Hub 2026 — CSS, PMS, CCE & NTS Job Tests",
    metaDescription: "Access all exam-based government recruitment in Pakistan. Connect active competitive examination vacancies (CSS, PMS, SPSC CCE, NTS) directly to syllabus and mock test prep.",
    subcategories: [
      "CSS Competitive Examination (FPSC BPS-17 Cadre)",
      "Provincial Management Service (PMS / CCE Cadres)",
      "National Testing Service (NTS Government Screening)",
      "Public Service Commission General Recruitment Tests",
      "Aptitude & Subject-Specialist MCQ Assessments"
    ],
    faqs: [
      {
        question: "How does the Exam-Based Recruitment Hub connect with Test Prep?",
        answer: "Every position in this category is directly linked to Tainaati's interactive Test Prep module, allowing candidates to review official syllabus breakdowns, download past papers, and practice timed MCQs."
      },
      {
        question: "What is the difference between General Recruitment and Competitive Exams?",
        answer: "Competitive Exams (CSS, PMS, CCE) recruit officers into elite civil services cadres with comprehensive multi-subject written papers. General Recruitment uses a single-paper 100-mark MCQ test for specific departmental vacancies."
      }
    ]
  },

  // ==========================================
  // ADDITIONAL EXPANDED CATEGORIES (15-20)
  // ==========================================
  {
    id: "matric-inter-support",
    slug: "matric-inter-support",
    name: "Matric/Inter & Support Staff",
    shortName: "Support Staff",
    group: "govt",
    groupLabel: "Government Sectors",
    icon: "UserCheck",
    h1: "Matric/Inter-Level & Support Staff Jobs in Pakistan 2026",
    tagline: "High-volume public sector employment for Matric, Intermediate, and Class-IV candidates: Junior Clerks (BPS-11), Naib Qasid, Drivers, Chowkidars, and Support Staff across federal and provincial secretariats.",
    metaTitle: "Matric, Inter & Support Staff Jobs in Pakistan 2026 — Junior Clerk & Class-IV",
    metaDescription: "Apply for latest Matric and Intermediate level government jobs in Pakistan. Junior Clerk (BPS-11), Naib Qasid, Driver, Chowkidar, and clerical vacancies with direct application instructions.",
    subcategories: [
      "Junior Clerk & Record Keeper (BPS-11)",
      "Naib Qasid & Office Attendant (BPS-01)",
      "Driver & Dispatch Rider (BPS-04/05)",
      "Chowkidar & Security Guard (BPS-01/02)",
      "Sanitary Worker & Sweeper",
      "Store Attendant & Daftari (BPS-02 to BPS-05)"
    ],
    faqs: [
      {
        question: "What is the typing speed requirement for Junior Clerk (BPS-11)?",
        answer: "Most government departments require a minimum typing speed of 25 to 30 words per minute (wpm) in English on computer, accompanied by a 3 to 6-month IT / Office Automation certificate."
      },
      {
        question: "What are the age limits for Class-IV and Support Staff positions?",
        answer: "The general age limit is 18 to 25 years plus the standard 5-year general age relaxation granted by the government (total up to 30-33 years depending on provincial notifications)."
      }
    ]
  },
  {
    id: "agriculture-livestock",
    slug: "agriculture-livestock",
    name: "Agriculture & Livestock Dept",
    shortName: "Agriculture & Livestock",
    group: "govt",
    groupLabel: "Government Sectors",
    icon: "Leaf",
    h1: "Agriculture & Livestock Department Jobs in Pakistan 2026",
    tagline: "Provincial public service commission recruitment for Veterinary Officers (BPS-17), Agriculture Officers, On-Farm Water Management, Dairy Development, and Field Assistants.",
    metaTitle: "Agriculture & Livestock Jobs in Pakistan 2026 — Veterinary & Agri Officers",
    metaDescription: "Find official vacancies in Agriculture Extension, Livestock & Dairy Development Department. BPS-11 to BPS-18 Veterinary Doctors (DVM), Agronomists, and Water Management specialists.",
    subcategories: [
      "Veterinary Officers & Animal Health (DVM - BPS-17)",
      "Agriculture Officers & Extension Agronomists (BPS-17)",
      "Water Management & On-Farm Water (OFWM Specialist)",
      "Livestock Dairy & Poultry Production Supervisors",
      "Agriculture Field Assistants & Research Associates"
    ],
    faqs: [
      {
        question: "What qualification is required for Veterinary Officer (BPS-17)?",
        answer: "Candidates must possess a Doctor of Veterinary Medicine (DVM) degree from a recognized university and valid active registration with the Pakistan Veterinary Medical Council (PVMC)."
      },
      {
        question: "Which commissions recruit Agriculture and Livestock officers?",
        answer: "PPSC (Punjab), SPSC (Sindh), KPPSC (Khyber Pakhtunkhwa), and BPSC (Balochistan) conduct regular recruitment for Provincial Agriculture and Livestock cadres."
      }
    ]
  },
  {
    id: "ajk-gilgit-baltistan",
    slug: "ajk-gilgit-baltistan",
    name: "AJK & Gilgit-Baltistan Jobs",
    shortName: "AJK & Gilgit-Baltistan",
    group: "govt",
    groupLabel: "Government Sectors",
    icon: "Mountain",
    h1: "AJK & Gilgit-Baltistan Government Jobs 2026",
    tagline: "Dedicated career portal for Azad Jammu & Kashmir Public Service Commission (AJKPSC), Gilgit-Baltistan Services & General Administration, Karakoram University, and regional district councils.",
    metaTitle: "AJK & Gilgit-Baltistan Jobs 2026 — AJKPSC & GB Government Vacancies",
    metaDescription: "Browse official gazette postings in Azad Kashmir (AJKPSC) and Gilgit-Baltistan. BPS-11 to BPS-18 administrative, medical, teaching, and forest service cadres with domicile requirements.",
    subcategories: [
      "AJK Public Service Commission (AJKPSC Gazetted Posts)",
      "Gilgit-Baltistan Services & General Administration (S&GAD)",
      "AJK School & Higher Education Department",
      "Karakoram & Poonch University Faculty Posts",
      "GB & AJK Forest, Wildlife & Tourism Cadres"
    ],
    faqs: [
      {
        question: "Who is eligible to apply for AJKPSC and GB government jobs?",
        answer: "Applicants must possess a valid State Subject Certificate / Permanent Residence Certificate (PRC) of Azad Jammu & Kashmir or Gilgit-Baltistan domicile for regional quota posts."
      },
      {
        question: "How do candidates apply for AJK Public Service Commission vacancies?",
        answer: "AJKPSC advertisements are published online at ajkpsc.gov.pk. Applications are submitted online with treasury challan fee deposited at State Bank of Pakistan or National Bank branches in AJK."
      }
    ]
  },
  {
    id: "shutdown-industrial",
    slug: "shutdown-industrial",
    name: "Shutdown & Industrial Jobs",
    shortName: "Shutdown & Industrial",
    group: "private",
    groupLabel: "Private & Careers",
    icon: "Flame",
    h1: "Shutdown, Industrial & Contract Jobs in Pakistan 2026",
    tagline: "Short-term maintenance turnarounds, industrial plant shutdowns, safety supervisors, pipefitters, millwright mechanics, and electrical/instrumentation technicians across refineries and energy plants.",
    metaTitle: "Industrial Plant Shutdown & Contract Jobs in Pakistan 2026 — Turnaround Techs",
    metaDescription: "Apply for industrial plant shutdowns and maintenance turnarounds in Pakistan. Refineries, fertilizer plants (FFC, Engro), power generation, and Descon industrial contracts.",
    subcategories: [
      "Petrochemical & Refinery Turnaround Contracts",
      "HSE Safety Officers & Fire Watchers",
      "Millwright Mechanics & Pipefitters",
      "Industrial Electrical & Instrumentation (E&I)",
      "Non-Destructive Testing (NDT) & Welding Inspectors"
    ],
    faqs: [
      {
        question: "What is an industrial plant shutdown job?",
        answer: "A shutdown or turnaround (TAR) is a scheduled period where petrochemical refineries, fertilizer complexes, or power plants halt operations for overhaul. Companies hire hundreds of technical specialists on high daily/monthly wages."
      },
      {
        question: "Which companies hire shutdown technicians in Pakistan?",
        answer: "Key employers include Descon Engineering, Engro Fertilizers, Fauji Fertilizer Company (FFC), Pakistan Refinery Limited (PRL), PARCO, and Attock Refinery."
      }
    ]
  },
  {
    id: "part-time-labor",
    slug: "part-time-labor",
    name: "Part-Time & Daily Wage Labor",
    shortName: "Part-Time & Labor",
    group: "private",
    groupLabel: "Private & Careers",
    icon: "Clock",
    h1: "Part-Time, Daily Wage & Labor Jobs in Pakistan 2026",
    tagline: "Genuine verified local employment opportunities for commercial delivery riders, drivers, warehouse helpers, factory packaging staff, security guards, and maintenance labor.",
    metaTitle: "Part-Time, Daily Wage & Labor Jobs in Pakistan 2026 — Drivers & Helpers",
    metaDescription: "Find genuine part-time and daily wage employment opportunities across Pakistan. Commercial drivers, security guards, factory laborers, riders, and warehouse staff with verified employer contacts.",
    subcategories: [
      "Commercial Drivers (LTV / HTV / PSV License)",
      "Private Security Guards & Shift Supervisors",
      "Warehouse Logistics & Packaging Helpers",
      "Food & Courier Delivery Riders (Bykea, Foodpanda, Yango)",
      "Construction, Plumbing & Electrical Maintenance Labor"
    ],
    faqs: [
      {
        question: "Are daily wage and delivery jobs verified on Tainaati?",
        answer: "Yes, Tainaati screens company registrations and official fleet partners to safeguard jobseekers against advance-fee scams and deceptive agent commissions."
      },
      {
        question: "What is required to work as a commercial driver in Pakistan?",
        answer: "A valid computerized driving license (LTV, HTV, or PSV endorsement), Police Character Certificate, CNIC verification, and safe driving record."
      }
    ]
  },
  {
    id: "media-journalism",
    slug: "media-journalism",
    name: "Media, Journalism & Content",
    shortName: "Media & Journalism",
    group: "private",
    groupLabel: "Private & Careers",
    icon: "Tv",
    h1: "Media, Journalism & Content Jobs in Pakistan 2026",
    tagline: "Public broadcasting at PTV and Radio Pakistan, PEMRA regulatory cadres, private news channels, digital content creators, broadcast engineers, and video editors.",
    metaTitle: "Media & Journalism Jobs in Pakistan 2026 — PTV, Radio & News Channels",
    metaDescription: "Explore verified vacancies in Pakistani media. PTV Corporation, Radio Pakistan (PBC), PEMRA, private satellite channels, news anchors, investigative reporters, and video editors.",
    subcategories: [
      "PTV (Pakistan Television Corporation Broadcasters)",
      "Radio Pakistan (Pakistan Broadcasting Corporation - PBC)",
      "Broadcast News Reporting & News Anchoring",
      "Digital Video Editing & Motion Graphics",
      "Content Writing, Sub-Editing & Copywriting"
    ],
    faqs: [
      {
        question: "How do candidates apply for PTV and Radio Pakistan recruitment?",
        answer: "Both PTV and PBC advertise contractual and regular vacancies in national newspapers and on their official career portals with online applications or written tests."
      },
      {
        question: "What qualifications are required for media content roles?",
        answer: "A BS or Master's degree in Mass Communication, Journalism, Media Studies, or Film & TV Production, along with demonstrated portfolio work."
      }
    ]
  }
];

// Helper lookups
export const CATEGORIES_BY_SLUG = Object.fromEntries(
  CATEGORIES_CONFIG.map(cat => [cat.slug, cat])
);

export const CATEGORIES_BY_ID = Object.fromEntries(
  CATEGORIES_CONFIG.map(cat => [cat.id, cat])
);

/**
 * Returns a category object by its slug or ID.
 * @param {string} identifier - e.g. "banking-finance" or "armed-forces"
 * @returns {Object|null}
 */
export function getCategoryBySlug(identifier) {
  if (!identifier) return null;
  const clean = identifier.toLowerCase().trim();
  return CATEGORIES_BY_SLUG[clean] || CATEGORIES_BY_ID[clean] || null;
}

/**
 * Categorizes a job based on its category slug, category name, department, or keywords.
 * @param {Object} job
 * @param {string} categoryId - e.g. "banking-finance"
 * @returns {boolean}
 */
export function matchesJobCategory(job, categoryId) {
  if (!job || !categoryId) return false;
  if (categoryId === 'all') return true;
  if (categoryId === 'govt') return job.type === 'govt';
  if (categoryId === 'private') return job.type === 'private';

  const catConfig = getCategoryBySlug(categoryId);
  if (!catConfig) {
    // Fallback agency checks
    if (categoryId === 'fpsc') return job.agency === 'FPSC' || job.category?.includes('Federal');
    if (categoryId === 'ppsc') return job.agency === 'PPSC' || job.category?.includes('Punjab');
    if (categoryId === 'spsc') return job.agency === 'SPSC' || job.category?.includes('Sindh');
    if (categoryId === 'kppsc') return job.agency === 'KPPSC' || job.category?.includes('KPK');
    if (categoryId === 'nts') return job.agency === 'NTS' || job.category?.includes('NTS');
    return false;
  }

  // 1. Direct slug or ID match
  if (job.categorySlug === catConfig.slug || job.categorySlug === catConfig.id) {
    return true;
  }

  // 2. Exact Category string match
  if (job.category === catConfig.name || job.category === catConfig.shortName) {
    return true;
  }

  // 3. SubCategory string match
  if (job.subCategory && catConfig.subcategories.some(sc => sc.toLowerCase().includes(job.subCategory.toLowerCase()))) {
    return true;
  }

  // 4. Keyword heuristic based on category
  const title = (job.title || '').toLowerCase();
  const dept = (job.department || job.company || '').toLowerCase();
  const rawCat = (job.category || '').toLowerCase();

  switch (catConfig.id) {
    case 'armed-forces':
      return title.includes('navy') || title.includes('army') || title.includes('paf') || title.includes('rangers') ||
             dept.includes('defence') || dept.includes('navy') || dept.includes('air force');

    case 'police-law-enforcement':
      return title.includes('police') || title.includes('inspector') || title.includes('fia') || title.includes('excise') ||
             dept.includes('police') || dept.includes('excise') || dept.includes('narcotics') || dept.includes('investigation agency');

    case 'judiciary-legal':
      return title.includes('judge') || title.includes('law officer') || title.includes('court') || title.includes('prosecut') ||
             dept.includes('judge') || dept.includes('court') || dept.includes('law & justice') || dept.includes('cmit') && title.includes('law');

    case 'public-sector-enterprises':
      return dept.includes('wapda') || dept.includes('nadra') || dept.includes('ogdcl') || dept.includes('ptcl') ||
             dept.includes('pakistan post') || dept.includes('ssgc') || dept.includes('sngpl') || dept.includes('pia') ||
             dept.includes('authority') && !dept.includes('police');

    case 'teaching-education':
      return title.includes('lecturer') || title.includes('teacher') || title.includes('professor') || title.includes('educat') ||
             dept.includes('education') || dept.includes('bise') || dept.includes('university') || dept.includes('school');

    case 'healthcare-medical':
      return title.includes('registrar') || title.includes('doctor') || title.includes('medical') || title.includes('nurse') ||
             dept.includes('health') || dept.includes('medical') || dept.includes('hospital');

    case 'local-government':
      return title.includes('municipal') || title.includes('chief officer') || title.includes('district collector') ||
             dept.includes('local government') || dept.includes('collector') || dept.includes('wasa') || dept.includes('municipal');

    case 'banking-finance':
      return title.includes('bank') || title.includes('credit') || title.includes('finance') || title.includes('audit') ||
             dept.includes('bank') || dept.includes('finance') || dept.includes('cooperation') || rawCat.includes('banking');

    case 'engineering':
      return title.includes('engineer') || title.includes('civil') || title.includes('mechanical') || title.includes('electrical') ||
             dept.includes('works') || dept.includes('communication and works') || dept.includes('water management') || dept.includes('nespak');

    case 'ngo-international':
      return dept.includes('united nations') || dept.includes('undp') || dept.includes('unicef') || dept.includes('usaid') ||
             dept.includes('ngo') || title.includes('humanitarian') || title.includes('monitoring and evaluation');

    case 'internships-trainee':
      return title.includes('trainee') || title.includes('intern') || title.includes('mto') || title.includes('graduate program');

    case 'overseas-gulf':
      return (job.country && job.country !== 'Pakistan') || title.includes('saudi') || title.includes('dubai') ||
             title.includes('gulf') || dept.includes('overseas') || (job.city && (job.city.includes('Saudi') || job.city.includes('Dubai')));

    case 'remote-freelance':
      return job.isRemote === true || title.includes('remote') || dept.includes('remote') || (job.city && job.city.toLowerCase().includes('remote'));

    case 'exam-recruitment-hub':
      return title.includes('cce') || title.includes('css') || title.includes('pms') || job.agency === 'NTS' ||
             title.includes('competitive examination');

    case 'matric-inter-support':
      return title.includes('naib qasid') || title.includes('chowkidar') || title.includes('clerk') ||
             title.includes('sanitary') || title.includes('peon') || title.includes('mali') ||
             title.includes('driver') || title.includes('sweeper') || title.includes('security guard') ||
             (job.bpsScale && ['BPS-01', 'BPS-02', 'BPS-03', 'BPS-04', 'BPS-05', 'BPS-07', 'BPS-11'].includes(job.bpsScale) &&
              !title.includes('engineer') && !title.includes('officer') && !title.includes('registrar'));

    case 'agriculture-livestock':
      return dept.includes('agriculture') || dept.includes('livestock') || dept.includes('dairy') ||
             dept.includes('water management') || title.includes('veterinary') || title.includes('water management officer');

    case 'ajk-gilgit-baltistan':
      return job.province === 'AJK & Gilgit-Baltistan' || dept.includes('ajk') || dept.includes('gilgit') ||
             dept.includes('baltistan') || dept.includes('karakoram') || title.includes('ajk') || title.includes('gilgit');

    case 'shutdown-industrial':
      return title.includes('shutdown') || title.includes('turnaround') || title.includes('pipefitter') ||
             title.includes('millwright') || title.includes('hse') || dept.includes('refinery') || dept.includes('plant');

    case 'part-time-labor':
      return title.includes('driver') || title.includes('security guard') || title.includes('labor') ||
             title.includes('helper') || title.includes('rider') || title.includes('part-time');

    case 'media-journalism':
      return dept.includes('ptv') || dept.includes('radio pakistan') || dept.includes('pemra') ||
             dept.includes('media') || title.includes('reporter') || title.includes('video editor') ||
             title.includes('producer') || title.includes('journalist');

    default:
      return false;
  }
}
