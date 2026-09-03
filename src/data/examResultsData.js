/**
 * Verified Direct Portal Endpoints for Pakistani Testing Commissions & Agencies
 * Roll Number Slips, Admission Certificates, Written Results, and Merit Lists.
 */

export const COMMISSIONS_PORTALS = [
  {
    agencyId: "fpsc",
    agencyName: "Federal Public Service Commission (FPSC)",
    jurisdiction: "Federal / All Pakistan",
    officialDomain: "fpsc.gov.pk",
    logoText: "FPSC",
    badgeColor: "emerald",
    verifiedPortalUrl: "https://www.fpsc.gov.pk",
    description: "Federal recruiting agency responsible for CSS Competitive Examination, FIA, IB, Motorway Police, and BPS-16+ ministries.",
    services: [
      {
        title: "Download Admission Certificate / Roll Number Slip",
        type: "slip",
        url: "https://online.fpsc.gov.pk",
        note: "Requires CNIC number and candidate tracking token. Slips are typically issued 7 to 10 days before exam date."
      },
      {
        title: "CSS Competitive Examination (MPT & Written Results)",
        type: "result",
        url: "https://www.fpsc.gov.pk/news/results",
        note: "Comprehensive gazette lists for CSS Preliminary MCQ (MPT) and final written allocations."
      },
      {
        title: "General Recruitment Final Recommendations & Merit Lists",
        type: "result",
        url: "https://www.fpsc.gov.pk",
        note: "Merit lists for Assistant Director, Inspector Customs, Preventive Officers, and Federal Ministry cadres."
      },
      {
        title: "Interview Programmes & Call Letters",
        type: "interview",
        url: "https://www.fpsc.gov.pk",
        note: "Check interview dates and venue allocations across Islamabad, Lahore, Karachi, Peshawar, and Quetta centers."
      }
    ]
  },
  {
    agencyId: "ppsc",
    agencyName: "Punjab Public Service Commission (PPSC)",
    jurisdiction: "Punjab Province",
    officialDomain: "ppsc.gop.pk",
    logoText: "PPSC",
    badgeColor: "blue",
    verifiedPortalUrl: "https://www.ppsc.gop.pk",
    description: "Recruitment commission for Punjab Government departments, School Educators, College Lecturers, Tehsildars, and PMS officers.",
    services: [
      {
        title: "Print Admission Letter (Roll Number Slip)",
        type: "slip",
        url: "https://www.ppsc.gop.pk/(S(1))/PrintAdmissionLetter.aspx",
        note: "Enter your 13-digit CNIC without dashes and select your applied post to download your official examination slip."
      },
      {
        title: "Written Examination Results (Pass / Fail Status)",
        type: "result",
        url: "https://www.ppsc.gop.pk/(S(1))/Results.aspx",
        note: "Updated immediately following test evaluation. Searchable by Case Number or Post Title."
      },
      {
        title: "Final Merit Lists & Departmental Recommendations",
        type: "result",
        url: "https://www.ppsc.gop.pk/(S(1))/Recommendations.aspx",
        note: "Final gazetted candidate selection rosters submitted to administrative departments."
      },
      {
        title: "Single Candidate Detailed Mark Certificate (DMC)",
        type: "result",
        url: "https://www.ppsc.gop.pk",
        note: "View your verified MCQ score breakdown and academic marks after declaration of final results."
      }
    ]
  },
  {
    agencyId: "spsc",
    agencyName: "Sindh Public Service Commission (SPSC)",
    jurisdiction: "Sindh Province",
    officialDomain: "spsc.gos.pk",
    logoText: "SPSC",
    badgeColor: "purple",
    verifiedPortalUrl: "https://spsc.gos.pk",
    description: "Constitutional body recruiting civil services, medical doctors, town officers, and CCE candidates in Sindh.",
    services: [
      {
        title: "Online Admission Slip Download Portal",
        type: "slip",
        url: "https://spsc.gos.pk",
        note: "Login to your candidate dashboard using CNIC and password to print your center entry slip."
      },
      {
        title: "Combined Competitive Examination (CCE) Results",
        type: "result",
        url: "https://spsc.gos.pk",
        note: "Screening test, written exam, and viva voce merit lists for Assistant Commissioners and Section Officers."
      },
      {
        title: "General Recruitment Screening Test Results",
        type: "result",
        url: "https://spsc.gos.pk",
        note: "Results for Municipal Officers, Town Officers, Medical Officers, and Assistant Registrars."
      }
    ]
  },
  {
    agencyId: "kppsc",
    agencyName: "Khyber Pakhtunkhwa Public Service Commission (KPPSC)",
    jurisdiction: "KPK Province",
    officialDomain: "kppsc.gov.pk",
    logoText: "KPPSC",
    badgeColor: "amber",
    verifiedPortalUrl: "https://kppsc.gov.pk",
    description: "Provincial agency recruiting PMS executive cadres, college professors, and specialized healthcare personnel in Khyber Pakhtunkhwa.",
    services: [
      {
        title: "Roll Number Slips & Ability Test Call Letters",
        type: "slip",
        url: "https://kppsc.gov.pk",
        note: "Download test schedule slips with assigned center in Peshawar, Mardan, Swat, Abbottabad, or D.I. Khan."
      },
      {
        title: "Merit Lists & Recommended Candidates Archive",
        type: "result",
        url: "https://kppsc.gov.pk",
        note: "Zonal quota allocations (Zone 1 to Zone 5) and merit list notifications."
      },
      {
        title: "Interview Schedules & Document Verification Notices",
        type: "interview",
        url: "https://kppsc.gov.pk",
        note: "Verification schedules for short-listed candidates prior to psychological assessment."
      }
    ]
  },
  {
    agencyId: "nts",
    agencyName: "National Testing Service (NTS)",
    jurisdiction: "All Pakistan / Multi-Agency",
    officialDomain: "nts.org.pk",
    logoText: "NTS",
    badgeColor: "rose",
    verifiedPortalUrl: "https://www.nts.org.pk",
    description: "Pakistan's primary testing service for State Bank of Pakistan (SBOTS), WAPDA, Judiciary, and public enterprise recruitments.",
    services: [
      {
        title: "NTS Roll Number Slips by CNIC Search",
        type: "slip",
        url: "https://www.nts.org.pk",
        note: "Check your test date, reporting time, and test center by typing your 13-digit CNIC."
      },
      {
        title: "NTS All Projects Results & Answer Keys",
        type: "result",
        url: "https://www.nts.org.pk",
        note: "Access provisional results, color-coded answer keys (White, Pink, Green, Yellow), and candidate lists."
      }
    ]
  },
  {
    agencyId: "regional",
    agencyName: "AJKPSC & BPSC (Balochistan & Azad Kashmir)",
    jurisdiction: "AJK & Balochistan",
    officialDomain: "ajkpsc.gov.pk / bpsc.gob.pk",
    logoText: "Regional",
    badgeColor: "teal",
    verifiedPortalUrl: "http://ajkpsc.gov.pk",
    description: "Direct official portals for Azad Jammu & Kashmir and Balochistan Public Service Commissions.",
    services: [
      {
        title: "AJKPSC Roll No Slips & Interview Gazette",
        type: "slip",
        url: "http://ajkpsc.gov.pk",
        note: "Official portal of Azad Jammu & Kashmir PSC for Muzaffarabad and Mirpur centers."
      },
      {
        title: "BPSC Quetta Results & Examination Notices",
        type: "result",
        url: "https://bpsc.gob.pk",
        note: "Balochistan Civil Service, Tehsildar, and Health Department competitive examination results."
      }
    ]
  }
];
