/**
 * RozgarPK Career Intelligence & SEO/GEO Content Hub Knowledge Base
 * Structured for Google Featured Snippets (AEO), AI Answer Engine Citations (GEO),
 * and High-Intent Organic Search Traffic across Pakistan.
 */

export const BLOG_CLUSTERS = [
  { id: 'all', label: 'All Guides' },
  { id: 'govt-commissions', label: 'Government Commissions' },
  { id: 'today-jobs', label: 'Freshness & Today Roundups' },
  { id: 'armed-forces', label: 'Security & Uniformed Services' },
  { id: 'city-guides', label: 'City Career Hubs' },
  { id: 'how-to', label: 'Application & Exam Prep' }
];

export const BLOG_ARTICLES = [
  {
    slug: 'ppsc-jobs-complete-guide',
    title: 'PPSC Jobs 2026: Complete Application Process, Eligibility, Challan Fee & Syllabus Breakdown',
    metaTitle: 'PPSC Jobs 2026: Online Apply, Eligibility, Fee & Syllabus Guide',
    metaDescription: 'Complete master guide for PPSC jobs in 2026. Learn the online application procedure, 1Link PSID challan payment, age relaxation rules, single-paper MCQ pattern, and syllabus breakdown.',
    cluster: 'govt-commissions',
    clusterLabel: 'Government Commissions',
    readTime: '8 min read',
    publishedDate: '2026-08-15',
    updatedDate: '2026-09-01',
    author: {
      name: 'RozgarPK Intelligence Team',
      role: 'Punjab Public Sector Recruitment Specialist',
      avatar: '/logos/ppsc.svg'
    },
    targetKeywords: ['ppsc jobs', 'ppsc online apply', 'ppsc challan fee', 'ppsc eligibility criteria 2026', 'ppsc test syllabus'],
    directAnswer: 'PPSC (Punjab Public Service Commission) recruits civil servants and specialists for BPS-11 through BPS-20 positions across the Government of Punjab. Candidates must hold Punjab domicile, register online via ppsc.gop.pk, pay a PKR 600 application fee via 1Link PSID ATM/Mobile Banking, and clear a 100-mark single-paper screening MCQ examination (90 minutes with 0.25 negative marking) followed by an academic evaluation and interview.',
    tableOfContents: [
      { id: 'what-is-ppsc', title: '1. What is PPSC and Which Positions Are Covered?' },
      { id: 'eligibility-criteria', title: '2. Eligibility Criteria, Domicile & Age Limits' },
      { id: 'step-by-step-apply', title: '3. Step-by-Step Online Application Procedure' },
      { id: 'fee-psid-payment', title: '4. 1Link PSID Challan Fee Payment Guide' },
      { id: 'exam-pattern-syllabus', title: '5. Examination Pattern, Negative Marking & Syllabus' },
      { id: 'ppsc-faqs', title: '6. Frequently Asked Questions (FAQs)' }
    ],
    contentSections: [
      {
        id: 'what-is-ppsc',
        heading: 'What is PPSC and Which Positions Are Covered?',
        content: `The **Punjab Public Service Commission (PPSC)** is the constitutionally mandated recruitment authority for the province of Punjab, Pakistan. Headquartered in Lahore, PPSC conducts merit-based recruitments for provincial departments, specialized institutions, and autonomous bodies.

Key departments frequently hiring through PPSC include:
- **Specialized Healthcare & Medical Education**: Senior Registrars, Medical Officers, Pharmacists (BPS-17/18).
- **School & Higher Education**: Lecturers, Assistant Professors, Subject Specialists (BPS-17).
- **Board of Revenue**: Tehsildars, Naib Tehsildars, Sub-Inspectors (BPS-14 to BPS-16).
- **Punjab Police**: Sub-Inspectors, Inspectors (Legal), Station House Officers.
- **Agriculture & Irrigation**: Assistant Research Officers, Sub-Divisional Officers (SDOs).`
      },
      {
        id: 'eligibility-criteria',
        heading: 'Eligibility Criteria, Domicile & Age Limits',
        content: `### 1. Domicile Requirement
Only candidates holding a **valid Punjab Domicile** and computerised National Identity Card (CNIC) issued by NADRA are eligible. Candidates with dual domicile must surrender one before the closing date.

### 2. General Age Limits & Government Concessions
- **Male Candidates**: 21 to 30 years + **5 Years General Age Relaxation** = Upper Limit **35 Years**.
- **Female Candidates**: 21 to 30 years + **8 Years General Age Relaxation** = Upper Limit **38 Years**.
- **Special Persons (Disability Quota)**: Up to **15 Years** age relaxation upon submission of an approved Disability Certificate.
- **In-Service Government Servants**: Up to 10 years relaxation for continuous 4 years of provincial government service.`
      },
      {
        id: 'step-by-step-apply',
        heading: 'Step-by-Step Online Application Procedure',
        content: `Applying for PPSC jobs is 100% computerized. Follow these sequential steps to avoid rejection:

1. **Visit the Official Portal**: Navigate to \`ppsc.gop.pk\` and select **Apply Online**.
2. **Select the Advertisement & Post**: Choose the exact Case Number (e.g., *Case No. 08-RH/2026*).
3. **Input Identity Details**: Enter your CNIC number without dashes and provide an active mobile number and email address.
4. **Generate 1Link PSID**: The system will automatically generate a **17-digit PSID number** for challan payment.
5. **Upload Documents**:
   - Passport-sized photograph (max 25KB, white background).
   - Front side of CNIC (max 15KB).
6. **Enter Academic & Experience Data**: Enter matric, intermediate, graduation, and master's degree marks. Ensure all degrees are verified by the Higher Education Commission (HEC).
7. **Final Submission**: Review your summary carefully and click **Submit Application**. Save your Application Number and Token Number for roll number slip download.`
      },
      {
        id: 'fee-psid-payment',
        heading: '1Link PSID Challan Fee Payment Guide',
        content: `PPSC no longer accepts traditional paper-based bank deposit slips across counters. All payments are verified via 1Link e-Payment channels:

| Payment Method | How to Pay | Confirmation Time |
| :--- | :--- | :--- |
| **JazzCash / EasyPaisa** | Go to Govt Payments &rarr; Punjab &rarr; PPSC &rarr; Enter 17-digit PSID | Instant (SMS & Email) |
| **Mobile Banking Apps** | Select 1Bill Invoices / Govt Dues &rarr; Enter PSID | Instant |
| **ATM Transfer** | Select 1Link &rarr; Bill Payment &rarr; Enter PSID | Instant |
| **Bank Counter OTC** | Visit any 1Link member commercial bank branch | 1 to 2 hours |

*Standard Application Fee: PKR 600 for General Recruitment (BPS-11 to BPS-18) and PKR 1,000 for Special Departmental / PMS Competitive Exams.*`
      },
      {
        id: 'exam-pattern-syllabus',
        heading: 'Examination Pattern, Negative Marking & Syllabus',
        content: `PPSC screening tests follow a standardized single-paper format designed to test both general ability and domain-specific knowledge:

- **Total Marks**: 100 MCQs
- **Total Duration**: 90 Minutes (1.5 Hours)
- **Negative Marking**: **0.25 Marks deducted** for each incorrect answer (4 wrong answers = -1.0 mark).
- **Passing Threshold**: Minimum 40% (40 marks out of 100) to qualify for academic merit calculation.

### Syllabus Distribution (General vs Specific Posts)
- **General Ability Posts (80/20 Rule)**: 100% General Knowledge (Pakistan Affairs, Current Affairs, Islamic Studies, Geography, Basic Math, English, Everyday Science, and Computer Studies).
- **Technical/Subject Posts (80/20 Rule)**: 80% Questions from Qualification Discipline (e.g., Computer Science, Pharmacy, Civil Engineering) + 20% General Knowledge.`
      }
    ],
    faqs: [
      {
        question: "What is the age limit for female candidates in PPSC jobs?",
        answer: "Female candidates in Punjab receive an 8-year general age relaxation over the standard upper age limit of 30 years, giving them an effective maximum age limit of 38 years for most BPS-16 and BPS-17 posts."
      },
      {
        question: "How do I pay the PPSC application fee online?",
        answer: "During the online application, PPSC generates a 17-digit 1Link PSID. You can pay the PKR 600 fee instantly through mobile banking apps (Allied, HBL, Meezan), EasyPaisa, JazzCash, or any 1Link ATM under 'Government Dues'."
      },
      {
        question: "Is there negative marking in PPSC screening tests?",
        answer: "Yes, PPSC imposes a negative marking penalty of 0.25 marks for every incorrect answer in the 100-mark single-paper MCQ test."
      },
      {
        question: "Can candidates with other provincial domiciles apply for PPSC jobs?",
        answer: "No, PPSC posts require a valid Punjab Domicile. Candidates from Sindh, KPK, or Balochistan must apply through their respective provincial commissions (SPSC, KPPSC, BPSC) or federal openings (FPSC)."
      }
    ],
    relatedTools: [
      { title: 'Practice PPSC Past Papers MCQs', href: '/test-prep', icon: 'BookOpen', badge: 'Mock Tests' },
      { title: 'Check PPSC Exam Timetable', href: '/exams', icon: 'Calendar', badge: 'Live Tracker' },
      { title: 'Build ATS Resume for BPS Posts', href: '/cv-builder', icon: 'FileText', badge: 'Free Tool' }
    ]
  },

  {
    slug: 'fpsc-jobs-complete-guide',
    title: 'FPSC Jobs 2026: General Recruitment, CSS Exam Schedule, Challan 32-A & Online Apply',
    metaTitle: 'FPSC Jobs 2026: Online Apply, CSS Exam, Syllabus & Challan Guide',
    metaDescription: 'Comprehensive guide to FPSC jobs in 2026. Explore Federal General Recruitment (BPS-16 to BPS-19), CSS competitive examination timeline, Challan 32-A fee deposit, and provincial quota distribution.',
    cluster: 'govt-commissions',
    clusterLabel: 'Government Commissions',
    readTime: '7 min read',
    publishedDate: '2026-08-20',
    updatedDate: '2026-09-01',
    author: {
      name: 'RozgarPK Intelligence Team',
      role: 'Federal Services & Central Competitive Examination Lead',
      avatar: '/logos/fpsc.svg'
    },
    targetKeywords: ['fpsc jobs', 'fpsc online apply 2026', 'fpsc challan form 32-a', 'fpsc syllabus', 'css exam 2027 schedule'],
    directAnswer: 'FPSC (Federal Public Service Commission) is the premier federal recruitment body for civilian officers across Pakistan. It administers all BPS-16 to BPS-22 gazetted recruitments for federal ministries (FIA, IB, FBR, ASF, Defence) and conducts the annual CSS (Central Superior Services) examination based on provincial and regional quota distributions.',
    tableOfContents: [
      { id: 'what-is-fpsc', title: '1. What is FPSC and What Institutions Does It Cover?' },
      { id: 'provincial-quota-system', title: '2. Federal Provincial & Regional Quota System' },
      { id: 'challan-32a-payment', title: '3. National Bank Challan 32-A Fee Structure' },
      { id: 'general-recruitment-phases', title: '4. General Recruitment Phases & Screening Tests' },
      { id: 'fpsc-faqs', title: '5. Frequently Asked Questions (FAQs)' }
    ],
    contentSections: [
      {
        id: 'what-is-fpsc',
        heading: 'What is FPSC and What Institutions Does It Cover?',
        content: `The **Federal Public Service Commission (FPSC)** operates under Article 242 of the Constitution of Pakistan to recruit gazetted civil servants for the Federal Government. 

FPSC is responsible for two distinct hiring pipelines:
1. **General Recruitment (GR)**: Direct recruitment to specialized gazetted posts (BPS-16 to BPS-21) such as Assistant Directors (FIA), Intelligence Officers (IB), Appraising/Valuation Officers (FBR Customs), Inspectors (ASF), and Secondary School Teachers (FGEI).
2. **Competitive Examination (CSS)**: Annual national competitive examination for entry into the 12 occupational cadres of Central Superior Services (PAS, PSP, FSP, IRS, Customs, OMG, Postal, Military Lands).`
      },
      {
        id: 'provincial-quota-system',
        heading: 'Federal Provincial & Regional Quota System',
        content: `Unlike provincial commissions that restrict eligibility to one province, FPSC recruitments are open to all Pakistani citizens, allocated strictly across federal quotas:

| Region / Quota | Percentage Allocation | Description |
| :--- | :--- | :--- |
| **Open Merit (National)** | **7.5%** | Highest scores nationwide regardless of domicile |
| **Punjab (incl. ICT)** | **50%** | Candidates holding Punjab or Islamabad domicile |
| **Sindh (Rural)** | **11.4%** | Rural districts of Sindh Province |
| **Sindh (Urban)** | **7.6%** | Karachi, Hyderabad, Sukkur urban municipal limits |
| **Khyber Pakhtunkhwa** | **11.5%** | Settled & Merged Tribal Districts (Ex-FATA) |
| **Balochistan** | **6%** | Permanent residents of Balochistan Province |
| **Gilgit-Baltistan / AJK** | **4%** | Combined quota for GB and Azad Jammu & Kashmir |
| **Minority / Women** | **5% / 10%** | Reserved sub-quotas across all regional distributions |`
      },
      {
        id: 'challan-32a-payment',
        heading: 'National Bank Challan 32-A Fee Structure',
        content: `FPSC requires physical or online treasury deposit via **Challan Form 32-A** under Head of Account \`C02101-ORGANS OF STATE EXAMINATION FEE REALIZED BY FPSC\`:

- **BPS-16 to BPS-17**: PKR 300
- **BPS-18**: PKR 750
- **BPS-19**: PKR 1,200
- **BPS-20 & Above**: PKR 1,500
- **CSS Competitive Examination**: PKR 2,200

Fee can be deposited at any branch of the **National Bank of Pakistan (NBP)** or the State Bank of Pakistan (SBP). The original treasury receipt must be retained for submission during the descriptive test/interview.`
      },
      {
        id: 'general-recruitment-phases',
        heading: 'General Recruitment Phases & Screening Tests',
        content: `FPSC conducts screening tests in structured 4-phase annual cycles:

1. **Phase I**: January – February (Advertisements from Q3/Q4 of preceding year).
2. **Phase II**: April – May (Spring gazette circulars).
3. **Phase III**: August – September (Mid-year recruitment pipeline).
4. **Phase IV**: November – December (End-of-year special recruitments).

**Screening Format**: 100 Marks MCQ Paper with **NO negative marking** in general screening phases (giving candidates a statistical advantage compared to provincial commissions). Part I comprises 20 marks English Grammar & Vocabulary; Part II comprises 80 marks General Intelligence or Professional Subject.`
      }
    ],
    faqs: [
      {
        question: "Is there negative marking in FPSC General Recruitment tests?",
        answer: "Unlike PPSC, FPSC General Recruitment screening tests do not have negative marking. Each question carries 1 mark, with 0 deduction for incorrect answers."
      },
      {
        question: "Where can I pay the FPSC Challan 32-A fee?",
        answer: "FPSC challan fee can be deposited in any branch of National Bank of Pakistan (NBP) or State Bank of Pakistan (SBP) under government account head C02101."
      },
      {
        question: "What is the fee for BPS-17 FPSC job applications?",
        answer: "The application fee for BPS-16 and BPS-17 positions in FPSC is PKR 300."
      }
    ],
    relatedTools: [
      { title: 'View Upcoming FPSC Exam Dates', href: '/exams', icon: 'Calendar', badge: 'Timetable' },
      { title: 'Practice Everyday Science & English MCQs', href: '/test-prep', icon: 'BookOpen', badge: 'Syllabus' },
      { title: 'Browse Federal Govt Vacancies', href: '/agency/fpsc', icon: 'Landmark', badge: 'Official Ads' }
    ]
  },

  {
    slug: 'today-govt-jobs-pakistan-live-digest',
    title: 'Today Govt Jobs in Pakistan 2026: Daily Verified Gazette Announcements & Direct Online Apply',
    metaTitle: 'Today Govt Jobs in Pakistan 2026: Live Verified Gazette Updates',
    metaDescription: 'Track today’s newest government jobs in Pakistan. Daily cross-verified gazette announcements from FPSC, PPSC, NTS, SPSC, and autonomous federal ministries with direct apply links.',
    cluster: 'today-jobs',
    clusterLabel: 'Freshness & Today Roundups',
    readTime: '5 min read',
    publishedDate: '2026-08-28',
    updatedDate: '2026-09-01',
    author: {
      name: 'RozgarPK Intelligence Team',
      role: 'Gazette Auditing & Telemetry Desk',
      avatar: '/logos/verified.svg'
    },
    targetKeywords: ['today govt jobs in pakistan', 'free jobs in pakistan', 'government jobs in pakistan today online apply', 'govt jobs in pakistan 2026'],
    directAnswer: 'Today govt jobs in Pakistan encompass gazetted public service circulars issued by Federal (FPSC), Punjab (PPSC), Sindh (SPSC), Khyber Pakhtunkhwa (KPPSC), and testing bodies (NTS). RozgarPK audits these gazettes every 6 hours to eliminate duplicate, expired, or misleading circulars, providing job seekers direct application portals and authentic deadline countdowns.',
    tableOfContents: [
      { id: 'daily-gazette-cycle', title: '1. How Government Recruitment Gazettes Work in Pakistan' },
      { id: 'avoiding-fake-ads', title: '2. 5 Signs of Fake Job Advertisements & How to Avoid Them' },
      { id: 'top-active-sectors', title: '3. Top Hiring Sectors Currently Active' },
      { id: 'today-faqs', title: '4. Frequently Asked Questions (FAQs)' }
    ],
    contentSections: [
      {
        id: 'daily-gazette-cycle',
        heading: 'How Government Recruitment Gazettes Work in Pakistan',
        content: `Government recruitment in Pakistan follows a strict constitutional publication cycle. Official vacancies are first notified via the **Gazette of Pakistan (Federal)** or **Provincial Official Gazettes** before being released on official commission portals on specific weekly publication schedules:

- **PPSC (Punjab)**: New consolidated advertisements are published on alternating **Sundays** in national daily newspapers and uploaded immediately to \`ppsc.gop.pk\`.
- **FPSC (Federal)**: Consolidate circulars appear on the **first Friday** of every calendar month.
- **SPSC (Sindh)**: Regular consolidated advertisements published bi-monthly.
- **NTS Testing**: Rolling project announcements released continuously throughout the week.`
      },
      {
        id: 'avoiding-fake-ads',
        heading: '5 Signs of Fake Job Advertisements & How to Avoid Them',
        content: `Job fraud has increased across unverified classified websites and social media groups. Here is how RozgarPK protects candidates from scam circulars:

1. **Unverifiable Account Numbers**: Legitimate government commissions never ask for fee payments to personal EasyPaisa / JazzCash accounts. Always verify that payments go through official **1Link PSID** or **National Bank of Pakistan (NBP) Challan 32-A**.
2. **Missing Case or Advertisement Number**: Every official posting must carry an identifiable reference number (e.g. *Advt No. 08/2026*, *Case No. 14-RD/2026*).
3. **Guaranteed Selection Claims**: Any agent promising direct appointment without appearing for screening tests is committing criminal fraud.
4. **Altered Newspaper Clippings**: Scammers often Photoshop old advertisements with changed dates. Always cross-verify the deadline directly with the commission portal.
5. **No Official Domain**: Real applications are submitted exclusively on \`.gov.pk\` or \`.gop.pk\` domains.`
      },
      {
        id: 'top-active-sectors',
        heading: 'Top Hiring Sectors Currently Active',
        content: `Federal and provincial departments actively recruiting across Pakistan include:
- **Education & Academia**: College Lecturers (BPS-17), Educators (BPS-14 to BPS-16), University Administrative Officers.
- **Healthcare & Nursing**: Charge Nurses (BPS-16), Medical Officers (BPS-17), Technologists.
- **Revenue & Administration**: Junior Clerks (BPS-11), Data Entry Operators (BPS-14), Assistant Directors.
- **Public Safety & Police**: Constables, Sub-Inspectors, Wireless Operators.`
      }
    ],
    faqs: [
      {
        question: "How do I know if a government job advertisement is real or fake?",
        answer: "Genuine government vacancies always contain an official Advertisement or Case Number, require fee payment only through 1Link PSID or National Bank of Pakistan Challan, and are published on official .gov.pk / .gop.pk portals."
      },
      {
        question: "Which day of the week are PPSC and FPSC jobs advertised?",
        answer: "PPSC jobs are typically released on alternating Sundays, while FPSC publishes its consolidated advertisements on the first Friday of every calendar month."
      },
      {
        question: "Can I apply for government jobs online for free?",
        answer: "While RozgarPK provides 100% free access to verified notices and tools, government commissions charge official examination processing fees (typically PKR 300 for FPSC and PKR 600 for PPSC) deposited directly into government treasury accounts."
      }
    ],
    relatedTools: [
      { title: 'Explore All Live Verified Jobs', href: '/', icon: 'Briefcase', badge: 'Real-Time Feed' },
      { title: 'Set Up Free Daily Email Alerts', href: '/alerts', icon: 'Bell', badge: 'Zero Spam' },
      { title: 'Test Preparation Hub', href: '/test-prep', icon: 'BookOpen', badge: 'Past Papers' }
    ]
  },

  {
    slug: 'national-job-portal-complete-guide',
    title: 'National Job Portal (NJP) Pakistan 2026: Profile Creation, Online Apply & Department Tracking',
    metaTitle: 'National Job Portal (NJP) Pakistan Guide 2026: Profile & Online Apply',
    metaDescription: 'Complete walkthrough for National Job Portal (njp.gov.pk). Learn how to create an NJP profile, upload verified credentials, track federal applications, and optimize your CV.',
    cluster: 'govt-commissions',
    clusterLabel: 'Government Commissions',
    readTime: '6 min read',
    publishedDate: '2026-08-25',
    updatedDate: '2026-09-01',
    author: {
      name: 'RozgarPK Intelligence Team',
      role: 'Federal Digital Governance Specialist',
      avatar: '/logos/njp.svg'
    },
    targetKeywords: ['national job portal', 'njp gov pk apply online', 'national job portal profile sign in', 'federal government jobs njp'],
    directAnswer: 'The National Job Portal (NJP - njp.gov.pk) is the central digital hiring platform launched by the Federal Government of Pakistan for contract and regular recruitments across federal ministries, autonomous authorities, and public sector enterprises. Unlike FPSC, NJP applications are typically fee-free and allow candidates to apply directly with a single digital profile.',
    tableOfContents: [
      { id: 'what-is-njp', title: '1. What is the National Job Portal (NJP)?' },
      { id: 'njp-vs-fpsc', title: '2. NJP vs FPSC — What is the Difference?' },
      { id: 'create-njp-profile', title: '3. How to Build a 100% Complete NJP Profile' },
      { id: 'njp-faqs', title: '4. Frequently Asked Questions (FAQs)' }
    ],
    contentSections: [
      {
        id: 'what-is-njp',
        heading: 'What is the National Job Portal (NJP)?',
        content: `The **National Job Portal (NJP)** is an initiative of the Ministry of Information Technology and Telecommunication (MoITT) designed to streamline federal civilian hiring into a unified online ecosystem.

Key features of NJP include:
- **Zero Application Fee**: Most NJP positions do not charge a challan fee.
- **Single CV Repository**: Once you build your digital CV on NJP, you can apply for multiple ministry openings with a single click.
- **Direct Ministry Recruitments**: Covers positions in NADRA, Ministry of Foreign Affairs (MoFA), Ministry of Planning, Ignite, and telecom regulatory authorities.`
      },
      {
        id: 'njp-vs-fpsc',
        heading: 'NJP vs FPSC — What is the Difference?',
        content: `Candidates often confuse NJP with FPSC. Here is the critical distinction:

| Feature | National Job Portal (NJP) | Federal Public Service Commission (FPSC) |
| :--- | :--- | :--- |
| **Nature of Jobs** | Contractual, Project-based & Regular Ministry Jobs | Permanent Gazetted Civil Service Posts (BPS-16 to 22) |
| **Application Fee** | Generally **Free (PKR 0)** | PKR 300 to PKR 1,500 via Challan 32-A |
| **Recruitment Authority** | Respective Federal Ministry / Department directly | Independent Constitutional Commission (FPSC) |
| **Test Pattern** | Departmental testing or screening by UTS/NTS/PTS | Official FPSC General Recruitment Examination |`
      },
      {
        id: 'create-njp-profile',
        heading: 'How to Build a 100% Complete NJP Profile',
        content: `To prevent system disqualification on NJP, ensure your profile reaches 100% completion:

1. **CNIC Authentication**: Sign up with your 13-digit CNIC and verify via SMS OTP.
2. **Personal Information**: Enter full name as per matriculation certificate, father's name, and permanent address.
3. **Academic Degrees**: Add degrees chronologically starting from Matriculation up to your highest qualification.
4. **Professional Experience**: List previous employment details with exact joining and relieving dates.
5. **Attach Digital Documents**: Upload a clear photograph and CNIC scan under 500KB.`
      }
    ],
    faqs: [
      {
        question: "Is applying for jobs on the National Job Portal free?",
        answer: "Yes, applying for most federal vacancies advertised on the National Job Portal (njp.gov.pk) is completely free and does not require a bank challan."
      },
      {
        question: "How long does it take for NJP shortlisting?",
        answer: "Shortlisting on NJP is handled directly by the hiring ministry, usually taking between 4 to 8 weeks after the advertisement closing date."
      }
    ],
    relatedTools: [
      { title: 'Create an ATS Resume for NJP', href: '/cv-builder', icon: 'FileText', badge: 'ATS Compliant' },
      { title: 'Explore Federal Govt Openings', href: '/jobs/govt', icon: 'Landmark', badge: 'Live List' }
    ]
  },

  {
    slug: 'ppsc-vs-fpsc-difference-comparison',
    title: 'PPSC vs FPSC: Key Differences in Eligibility, Domicile, Test Pattern & Salary Explained',
    metaTitle: 'PPSC vs FPSC: Differences in Exam Pattern, Domicile & Salary',
    metaDescription: 'Compare PPSC vs FPSC in 2026. Understand provincial vs federal jurisdiction, negative marking rules, fee structures, screening test difficulty, and promotion cadres.',
    cluster: 'how-to',
    clusterLabel: 'Application & Exam Prep',
    readTime: '6 min read',
    publishedDate: '2026-08-30',
    updatedDate: '2026-09-01',
    author: {
      name: 'RozgarPK Intelligence Team',
      role: 'Comparative Civil Services Analyst',
      avatar: '/logos/verified.svg'
    },
    targetKeywords: ['ppsc vs fpsc', 'difference between ppsc and fpsc', 'fpsc vs ppsc test pattern', 'ppsc syllabus vs fpsc'],
    directAnswer: 'The core difference between PPSC and FPSC lies in jurisdiction: PPSC conducts recruitments exclusively for the Government of Punjab and requires Punjab domicile, whereas FPSC recruits for the Federal Government of Pakistan across all provincial quotas. Additionally, PPSC enforces a 0.25 negative marking penalty in screening tests, while FPSC screening tests carry no negative marking penalty.',
    tableOfContents: [
      { id: 'comprehensive-comparison-table', title: '1. Comprehensive PPSC vs FPSC Comparison Table' },
      { id: 'domicile-and-quotas', title: '2. Domicile Requirements & Quota Allocations' },
      { id: 'test-patterns-marking', title: '3. Screening Test Patterns & Negative Marking' },
      { id: 'comparison-faqs', title: '4. Frequently Asked Questions (FAQs)' }
    ],
    contentSections: [
      {
        id: 'comprehensive-comparison-table',
        heading: 'Comprehensive PPSC vs FPSC Comparison Table',
        content: `Here is the definitive side-by-side comparison of Pakistan's two largest public service commissions:

| Comparison Metric | Punjab Public Service Commission (PPSC) | Federal Public Service Commission (FPSC) |
| :--- | :--- | :--- |
| **Jurisdiction** | Provincial (Punjab Government only) | Federal (Federal Ministries & Islamabad) |
| **Domicile Requirement** | **Strictly Punjab Domicile only** | **All Pakistan Citizens** (Allocated via Quota) |
| **Application Fee** | PKR 600 via **1Link PSID** | PKR 300 (BPS-16/17) via **NBP Challan 32-A** |
| **Negative Marking** | **YES (0.25 marks per wrong answer)** | **NO Negative Marking in Screening** |
| **Test Duration** | 90 Minutes (100 MCQs) | 100 Minutes (100 MCQs) |
| **Competitive Examination** | PMS (Provincial Management Service) | CSS (Central Superior Services) |
| **Headquarters** | Lahore, Punjab | Islamabad, Capital Territory |`
      },
      {
        id: 'domicile-and-quotas',
        heading: 'Domicile Requirements & Quota Allocations',
        content: `Understanding domicile boundaries is critical when planning your competitive career:

- **PPSC**: All positions belong to the Punjab Civil Service Cadre. A candidate from Lahore, Multan, or Rawalpindi competes directly against applicants within Punjab.
- **FPSC**: Every vacancy has a designated regional quota. For example, an Assistant Director post might specify "Quota: Sindh (Rural) - 01 Post" or "Khyber Pakhtunkhwa - 02 Posts". Candidates only compete against peers within their matching domicile quota.`
      },
      {
        id: 'test-patterns-marking',
        heading: 'Screening Test Patterns & Negative Marking',
        content: `The scoring strategy differs significantly between the two bodies:

- **Strategy for PPSC**: Because 4 wrong answers deduct a full 1.0 mark, candidates should **avoid blind guessing**. Only attempt questions where you can eliminate at least two incorrect options.
- **Strategy for FPSC**: Because there is **zero penalty for incorrect answers**, candidates should attempt all 100 questions before time expires.`
      }
    ],
    faqs: [
      {
        question: "Can a candidate from Sindh or KPK apply for PPSC jobs?",
        answer: "No. PPSC jobs require a valid Punjab Domicile. Candidates from other provinces must apply through their respective provincial commission (SPSC, KPPSC, BPSC) or federal openings (FPSC)."
      },
      {
        question: "Does FPSC have negative marking?",
        answer: "No, FPSC General Recruitment screening tests do not have negative marking, whereas PPSC deducts 0.25 marks for every wrong answer."
      }
    ],
    relatedTools: [
      { title: 'PPSC Complete Master Guide', href: '/blog/ppsc-jobs-complete-guide', icon: 'FileText', badge: 'Cluster 1' },
      { title: 'FPSC Complete Master Guide', href: '/blog/fpsc-jobs-complete-guide', icon: 'FileText', badge: 'Cluster 1' },
      { title: 'Practice Timed MCQ Quizzes', href: '/test-prep', icon: 'BookOpen', badge: 'Test Prep' }
    ]
  }
];
