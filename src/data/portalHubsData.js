/**
 * Tainaati — High-Volume Pillar Portal Hubs Data
 * Targets massive navigational-intent search volumes:
 * - "punjab job portal" (~201,000/mo, KD 39)
 * - "sindh job portal" (~90,500/mo, KD 25)
 * - "national job portal" (~74,000/mo, KD 29)
 * - "kpk job portal" / "kppsc jobs" (~15,000+/mo)
 * - "balochistan job portal" / "bpsc jobs" (~10,000+/mo)
 */

export const PORTAL_HUBS_DATA = {
  "punjab-job-portal": {
    slug: "punjab-job-portal",
    aliasSlug: "punjab-jobs",
    targetKeyword: "punjab job portal",
    monthlySearches: "201,000 / month",
    kd: 39,
    name: "Punjab Job Portal",
    shortName: "Punjab",
    provinceName: "Punjab",
    h1: "Punjab Job Portal: Latest Verified Jobs in Punjab (2026)",
    metaTitle: "Punjab Job Portal 2026 — Latest Govt & Private Jobs in Punjab | Tainaati",
    metaDescription: "Browse verified jobs on Punjab Job Portal 2026. Official PPSC gazette advertisements, Punjab Police, School Education, and top private IT roles in Lahore & Rawalpindi.",
    tagline: "Single source-of-truth aggregator for all verified government gazettes, PPSC notices, and top-tier private corporate openings across Punjab Province.",
    intro: "The Punjab Job Portal (PJP) on Tainaati brings together all public sector gazette announcements from the Punjab Public Service Commission (PPSC), specialized departmental hiring (Health, School Education, Auqaf, Transport), and verified private sector careers in Lahore, Rawalpindi, Faisalabad, and Multan. Rather than navigating fragmented gazettes or outdated third-party blogs, candidates can review 100% verified application deadlines, basic pay scales (BPS-05 to BPS-18), 17-digit PSID fee submission instructions, and official portal links in one unified, ad-free interface.",
    highlights: [
      { label: "Search Volume", value: "201,000 / mo" },
      { label: "Key Commission", value: "PPSC (ppsc.gop.pk)" },
      { label: "Major Centers", value: "Lahore, Rawalpindi, Multan" },
      { label: "Fee Standard", value: "PKR 600 via 1Link PSID" }
    ],
    officialNotice: "Recruitment for Punjab civil posts is conducted under the Punjab Civil Servants Act 1974. Official examination fees must be deposited exclusively using the 17-digit computerized PSID through 1Link banking channels (ATMs, Mobile Banking, JazzCash, EasyPaisa).",
    cities: [
      { name: "Lahore Careers Hub", href: "/city/lahore", note: "Provincial Capital & Tech Hub" },
      { name: "Rawalpindi Careers Hub", href: "/city/rawalpindi", note: "Federal Twin City & Health Cadres" }
    ],
    agencies: [
      { name: "PPSC Commission Portal", href: "/agency/ppsc", note: "Consolidated Advertisements & PMS" },
      { name: "Punjab Police Recruitment", href: "/blog/how-to-apply-police-job-pakistan", note: "Constabulary & Sub-Inspectors" }
    ],
    guides: [
      { name: "PPSC Complete Master Guide", href: "/blog/ppsc-jobs-complete-guide", badge: "Exam Guide" },
      { name: "CTI College Teaching Interns", href: "/blog/how-to-apply-cti-jobs", badge: "HED Punjab" },
      { name: "STI School Teacher Interns", href: "/blog/how-to-apply-sti-jobs", badge: "SED Punjab" },
      { name: "Age Relaxation Rules in Punjab", href: "/blog/age-relaxation-in-govt-jobs", badge: "Service Rules" }
    ],
    faqs: [
      {
        question: "What is Punjab Job Portal (PJP)?",
        answer: "Punjab Job Portal is the centralized platform aggregating verified public and private employment opportunities across Punjab, including Punjab Public Service Commission (PPSC) gazette vacancies, government school teacher internships (CTI/STI), and corporate software house careers."
      },
      {
        question: "How do I apply for jobs on Punjab Job Portal?",
        answer: "Review the active verified listing, check the required domicile district and BPS scale, deposit the prescribed fee via 1Link 17-digit PSID if applying for PPSC, and complete your application directly on the official portal link provided."
      },
      {
        question: "Is PPSC application fee paid online in Punjab?",
        answer: "Yes. PPSC has eliminated paper treasury challans. All examination fees (PKR 600 for standard posts) must be deposited through digital 1Link banking channels using a computerized 17-digit PSID token."
      },
      {
        question: "What is the age relaxation for female candidates in Punjab?",
        answer: "Under Government of Punjab service notifications, female candidates receive 8 years general age relaxation over the upper age limit for general provincial posts, while male candidates receive 5 years."
      }
    ]
  },

  "sindh-job-portal": {
    slug: "sindh-job-portal",
    aliasSlug: "sindh-jobs",
    targetKeyword: "sindh job portal",
    monthlySearches: "90,500 / month",
    kd: 25,
    name: "Sindh Job Portal",
    shortName: "Sindh",
    provinceName: "Sindh",
    h1: "Sindh Job Portal 2026: Latest Verified Govt & Private Jobs in Sindh",
    metaTitle: "Sindh Job Portal 2026 — Latest Govt & Private Jobs in Sindh | Tainaati",
    metaDescription: "Find verified vacancies on Sindh Job Portal 2026. SPSC civil service exams, municipal officers, Karachi fintech, banking, maritime ports, and healthcare cadres.",
    tagline: "Unified job aggregator for Government of Sindh public recruitment, SPSC competitive examinations, and Karachi corporate, banking, and maritime careers.",
    intro: "The Sindh Job Portal provides unified access to public sector recruitments conducted by the Sindh Public Service Commission (SPSC), municipal corporations, Karachi Port Trust, State Bank of Pakistan, and Karachi's thriving private financial and technology ecosystems. Listings adhere strictly to statutory 60:40 Rural to Urban quota allocations and official NBP treasury challan deposit instructions.",
    highlights: [
      { label: "Search Volume", value: "90,500 / mo" },
      { label: "Commission", value: "SPSC (spsc.gov.pk)" },
      { label: "Quota Allocation", value: "60:40 Rural to Urban" },
      { label: "Major Centers", value: "Karachi, Hyderabad, Sukkur" }
    ],
    officialNotice: "Sindh public sector positions adhere to a 60% Sindh (Rural) and 40% Sindh (Urban) statutory allocation. Applicants must possess a valid Permanent Residence Certificate (PRC Form D) and Domicile Certificate of the relevant district.",
    cities: [
      { name: "Karachi Careers Hub", href: "/city/karachi", note: "Financial & Maritime Capital" }
    ],
    agencies: [
      { name: "SPSC Commission Hub", href: "/agency/spsc", note: "Municipal, Health & CCE Cadres" }
    ],
    guides: [
      { name: "How to Apply for Police Jobs in Sindh", href: "/blog/how-to-apply-police-job-pakistan", badge: "Uniformed" },
      { name: "Job vs Business in Pakistan", href: "/blog/job-vs-business-which-is-better-pakistan", badge: "Career Guide" },
      { name: "Sindh Quota Allocation Rules", href: "/faq#commissions", badge: "Service Rules" }
    ],
    faqs: [
      {
        question: "What is Sindh Job Portal?",
        answer: "Sindh Job Portal is the unified recruitment hub indexing verified public sector openings from the Sindh Public Service Commission (SPSC), Karachi municipal departments, and corporate banking/tech firms across Karachi, Hyderabad, and Sukkur."
      },
      {
        question: "How is the Sindh quota divided between rural and urban?",
        answer: "Sindh government positions follow a 60:40 statutory quota distribution: 60% reserved for Sindh Rural domicile holders and 40% for Sindh Urban (Karachi, Hyderabad, and Sukkur city municipal limits)."
      },
      {
        question: "What document is mandatory for applying to Sindh government jobs?",
        answer: "Candidates must hold a valid District Domicile Certificate and Permanent Residence Certificate (PRC Form D) verifying their rural or urban provincial classification."
      }
    ]
  },

  "national-job-portal": {
    slug: "national-job-portal",
    aliasSlug: "all-pakistan-jobs",
    targetKeyword: "national job portal",
    monthlySearches: "74,000 / month",
    kd: 29,
    name: "National Job Portal",
    shortName: "National",
    provinceName: "All Pakistan",
    h1: "National Job Portal (NJP) Pakistan: All Verified Federal & Provincial Jobs 2026",
    metaTitle: "National Job Portal 2026 — Verified Govt & Private Jobs in Pakistan | Tainaati",
    metaDescription: "Search all active vacancies on National Job Portal (NJP) aggregator. Verified FPSC, PPSC, SPSC, KPPSC, BPSC, NTS, and top corporate careers across Pakistan.",
    tagline: "Comprehensive nationwide repository covering all 6 public service commissions, federal ministries, autonomous state enterprises, and national private employers.",
    intro: "The National Job Portal (NJP) aggregation engine on Tainaati provides candidates across Pakistan with a single verified directory of employment opportunities. We index vacancies from the Federal Public Service Commission (FPSC), all four provincial service commissions (PPSC, SPSC, KPPSC, BPSC), National Testing Service (NTS), and autonomous bodies like WAPDA, NADRA, and the State Bank of Pakistan. Every circular is parsed and validated against gazette circulars to ensure zero expired listings and zero fabricated details.",
    highlights: [
      { label: "Search Volume", value: "74,000 / mo" },
      { label: "Coverage", value: "All Pakistan (6 Commissions)" },
      { label: "Audit Cycle", value: "Automated 6-Hour Pipeline" },
      { label: "Integrity", value: "100% Verified Circulars" }
    ],
    officialNotice: "All federal vacancies are subject to provincial quota allocations notified by the Establishment Division (Merit 7.5%, Punjab 50%, Sindh Rural 11.4%, Sindh Urban 7.6%, KPK 11.5%, Balochistan 6%, Ex-FATA/GB 4%, AJK 2%).",
    cities: [
      { name: "Islamabad & Rawalpindi", href: "/city/islamabad", note: "Federal Ministries Hub" },
      { name: "Lahore Hub", href: "/city/lahore", note: "Punjab Commercial Center" },
      { name: "Karachi Hub", href: "/city/karachi", note: "National Financial Center" },
      { name: "Peshawar Hub", href: "/city/peshawar", note: "KPK Administrative Center" },
      { name: "Quetta Hub", href: "/city/quetta", note: "Balochistan Provincial Center" }
    ],
    agencies: [
      { name: "FPSC Federal Commission", href: "/agency/fpsc", note: "CSS & BPS-16+ Officers" },
      { name: "PPSC Punjab Commission", href: "/agency/ppsc", note: "Punjab Civil Service" },
      { name: "SPSC Sindh Commission", href: "/agency/spsc", note: "Sindh Provincial Service" },
      { name: "KPPSC KPK Commission", href: "/agency/kppsc", note: "Khyber Pakhtunkhwa Service" },
      { name: "BPSC Balochistan Commission", href: "/agency/bpsc", note: "Balochistan Civil Cadres" },
      { name: "NTS Testing Service", href: "/agency/nts", note: "Judiciary & Power Sector" }
    ],
    guides: [
      { name: "How to Apply for FIA Jobs", href: "/blog/how-to-apply-fia-jobs", badge: "Federal" },
      { name: "How to Apply for WAPDA Jobs", href: "/blog/how-to-apply-wapda-jobs", badge: "Power Sector" },
      { name: "How to Apply for NADRA Jobs", href: "/blog/how-to-apply-nadra-jobs-online", badge: "Autonomous" },
      { name: "Federal Age Relaxation Rules", href: "/blog/age-relaxation-in-govt-jobs", badge: "Service Rules" }
    ],
    faqs: [
      {
        question: "What is National Job Portal (NJP)?",
        answer: "The National Job Portal (NJP) is a centralized federal hiring gateway established by the Government of Pakistan to facilitate online recruitment for federal ministries, departments, and public sector organizations."
      },
      {
        question: "What is the difference between NJP and FPSC?",
        answer: "FPSC is a constitutional recruitment commission handling gazetted posts in BPS-16 and above, whereas NJP serves as an online submission portal for ministries, staff, and non-gazetted positions (BPS-01 to BPS-15) alongside contract projects."
      },
      {
        question: "Does National Job Portal charge an application fee?",
        answer: "Most federal ministry applications submitted directly through the National Job Portal do not charge an application fee, except when testing is delegated to a testing agency (such as NTS or OTS)."
      }
    ]
  },

  "kpk-job-portal": {
    slug: "kpk-job-portal",
    aliasSlug: "kpk-jobs",
    targetKeyword: "kpk job portal",
    monthlySearches: "15,000+ / month",
    kd: 22,
    name: "KPK Job Portal",
    shortName: "KPK",
    provinceName: "Khyber Pakhtunkhwa",
    h1: "KPK Job Portal 2026: Latest Verified Jobs in Khyber Pakhtunkhwa",
    metaTitle: "KPK Job Portal 2026 — Latest Govt & Private Jobs in KPK | Tainaati",
    metaDescription: "Verified public and private job vacancies on KPK Job Portal 2026. KPPSC advertisements, ETEA screening tests, Peshawar careers, and tribal district quotas.",
    tagline: "Official employment circulars, KPPSC competitive examination timetables, and ETEA test schedules across Khyber Pakhtunkhwa and merged tribal districts.",
    intro: "The KPK Job Portal covers public sector recruitment managed by the Khyber Pakhtunkhwa Public Service Commission (KPPSC), Educational Testing and Evaluation Agency (ETEA), and regional health and education directorates. Jobs are categorized by provincial administrative zones (Zones 1 through 5) and special allocations for newly merged tribal districts (formerly FATA), ensuring transparent merit access for candidates from Peshawar, Mardan, Swat, Abbottabad, and D.I. Khan.",
    highlights: [
      { label: "Key Commission", value: "KPPSC (kppsc.gov.pk)" },
      { label: "Testing Agency", value: "ETEA (etea.edu.pk)" },
      { label: "Quota System", value: "5 Administrative Zones" },
      { label: "Fee Gateway", value: "JazzCash / EasyPaisa" }
    ],
    officialNotice: "KPPSC recruitment is allocated across 5 statutory zones plus merged tribal districts. Applications are submitted online with examination fees deposited via EasyPaisa or JazzCash.",
    cities: [
      { name: "Peshawar Careers Hub", href: "/city/peshawar", note: "Provincial Capital & University Town" }
    ],
    agencies: [
      { name: "KPPSC Commission Hub", href: "/agency/kppsc", note: "Provincial Civil Service & PMS" }
    ],
    guides: [
      { name: "How to Apply for Police Jobs in KPK", href: "/blog/how-to-apply-police-job-pakistan", badge: "Fast-Track DSP" },
      { name: "KPK Zonal Quotas Explained", href: "/faq#commissions", badge: "Service Rules" }
    ],
    faqs: [
      {
        question: "How do I apply for KPPSC jobs online?",
        answer: "Visit kppsc.gov.pk, create an account using your CNIC, enter your academic marks, pay the fee via EasyPaisa / JazzCash, and submit before 5:00 PM on the advertised closing date."
      },
      {
        question: "What are the 5 zones in KPK recruitment?",
        answer: "KPK is divided into 5 recruitment zones based on district groupings to guarantee balanced geographic representation in provincial civil service inductions."
      }
    ]
  },

  "balochistan-job-portal": {
    slug: "balochistan-job-portal",
    aliasSlug: "balochistan-jobs",
    targetKeyword: "balochistan job portal",
    monthlySearches: "10,000+ / month",
    kd: 18,
    name: "Balochistan Job Portal",
    shortName: "Balochistan",
    provinceName: "Balochistan",
    h1: "Balochistan Job Portal 2026: Latest Verified Jobs in Balochistan (BPSC & Govt)",
    metaTitle: "Balochistan Job Portal 2026 — Latest Govt & Private Jobs in Balochistan | Tainaati",
    metaDescription: "Search verified openings on Balochistan Job Portal 2026. Official BPSC Consolidated Advertisements, Quetta medical cadres, P&D engineering, and collegiate posts.",
    tagline: "Verified provincial gazette announcements, BPSC consolidated advertisements, and healthcare/educational appointments across Balochistan.",
    intro: "The Balochistan Job Portal tracks active recruitment gazettes announced by the Balochistan Public Service Commission (BPSC), provincial line departments (Planning & Development, Colleges & Higher Education, Health Department), and trauma centers in Quetta and divisional headquarters. With comprehensive coverage of the 43-year provincial age relaxation policy and 1Link fee payment guidelines, candidates have direct access to verified career openings with zero guesswork.",
    highlights: [
      { label: "Key Commission", value: "BPSC (bpsc.gob.pk)" },
      { label: "Age Policy", value: "Up to 43 Years Relaxed" },
      { label: "Fee Gateway", value: "1Link PSID" },
      { label: "HQ Center", value: "Quetta" }
    ],
    officialNotice: "Candidates must hold a verified Local or Domicile Certificate of Balochistan Province. Examination fees are payable via 1Link Banking Channels (Mobile Banking, EasyPaisa, JazzCash, ATMs) using generic computerized PSIDs.",
    cities: [
      { name: "Quetta Careers Hub", href: "/city/quetta", note: "Provincial Capital & Specialized Hospitals" }
    ],
    agencies: [
      { name: "BPSC Commission Hub", href: "/agency/bpsc", note: "Lecturers, Engineers & Registrars" }
    ],
    guides: [
      { name: "BPSC Consolidated Advertisement Guide", href: "/agency/bpsc", badge: "Gazette Notice" },
      { name: "Balochistan 43-Year Age Relaxation", href: "/blog/age-relaxation-in-govt-jobs", badge: "Service Rules" }
    ],
    faqs: [
      {
        question: "How do I apply for BPSC jobs in Balochistan?",
        answer: "Visit bpsc.gob.pk, choose your desired post from active Consolidated Advertisements, generate your 1Link fee PSID, deposit the fee (PKR 800 for BPS-16/17), and submit online before the closing date."
      },
      {
        question: "What is the general age limit for Balochistan government jobs?",
        answer: "The Government of Balochistan provides an extended upper age limit up to 43 years for fresh general provincial candidates, subject to valid government notifications."
      }
    ]
  }
};

export const PORTAL_FILTERS = {
  "punjab-job-portal": (job) => {
    const text = ((job.province || '') + ' ' + (job.city || '') + ' ' + (job.quota || '') + ' ' + (job.agency || '') + ' ' + (job.department || '')).toLowerCase();
    return text.includes('punjab') || text.includes('lahore') || text.includes('rawalpindi') || text.includes('faisalabad') || text.includes('multan') || text.includes('dg khan') || text.includes('ppsc') || text.includes('all pakistan');
  },
  "sindh-job-portal": (job) => {
    const text = ((job.province || '') + ' ' + (job.city || '') + ' ' + (job.quota || '') + ' ' + (job.agency || '') + ' ' + (job.department || '')).toLowerCase();
    return text.includes('sindh') || text.includes('karachi') || text.includes('hyderabad') || text.includes('sukkur') || text.includes('tharparkar') || text.includes('spsc') || text.includes('all pakistan');
  },
  "national-job-portal": () => true,
  "kpk-job-portal": (job) => {
    const text = ((job.province || '') + ' ' + (job.city || '') + ' ' + (job.quota || '') + ' ' + (job.agency || '') + ' ' + (job.department || '')).toLowerCase();
    return text.includes('kpk') || text.includes('khyber') || text.includes('peshawar') || text.includes('abbottabad') || text.includes('mardan') || text.includes('kppsc') || text.includes('etea') || text.includes('all pakistan');
  },
  "balochistan-job-portal": (job) => {
    const text = ((job.province || '') + ' ' + (job.city || '') + ' ' + (job.quota || '') + ' ' + (job.agency || '') + ' ' + (job.department || '')).toLowerCase();
    return text.includes('balochistan') || text.includes('quetta') || text.includes('bpsc') || text.includes('all pakistan');
  }
};
