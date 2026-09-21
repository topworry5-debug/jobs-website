import React from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  ShieldCheck, 
  Landmark, 
  Clock, 
  CreditCard, 
  FileText, 
  ArrowLeft, 
  ExternalLink,
  Layers,
  GraduationCap
} from 'lucide-react';
import { getSiteUrl } from '../../utils/siteUrl';
import { generateBreadcrumbSchema } from '../../utils/seoHelpers';

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Frequently Asked Questions (FAQ) — Government Jobs & Public Commissions | Tainaati",
  description: "Comprehensive verified answers on PPSC 1Link fees, FPSC negative marking, SPSC 60:40 quota, KPPSC zones, BPSC applications, age relaxation rules, and recruitment procedures in Pakistan.",
  alternates: {
    canonical: `${siteUrl}/faq`
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) — Pakistan Public Service Commissions | Tainaati",
    description: "Verified answers to top questions about PPSC, FPSC, SPSC, KPPSC, BPSC, NTS, age relaxation, and challan payments.",
    url: `${siteUrl}/faq`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

const FAQ_SECTIONS = [
  {
    id: "commissions",
    title: "Public Service Commissions (FPSC, PPSC, SPSC, KPPSC, BPSC, NTS)",
    icon: Landmark,
    questions: [
      {
        q: "What is the difference between FPSC and Provincial Public Service Commissions (PPSC, SPSC, etc.)?",
        a: "The Federal Public Service Commission (FPSC) recruits for federal ministries, constitutional bodies, and civil posts across all Pakistan (BPS-16 to BPS-21) and conducts the Central Superior Services (CSS) competitive examination. Provincial commissions (PPSC in Punjab, SPSC in Sindh, KPPSC in Khyber Pakhtunkhwa, BPSC in Balochistan) recruit strictly for provincial government departments and provincial management cadres (PMS/CCE)."
      },
      {
        q: "Does FPSC have negative marking in screening tests?",
        a: "No. FPSC General Recruitment screening MCQ tests have zero negative marking. Candidates should attempt all 100 questions. Conversely, PPSC enforces a penalty of -0.25 marks for every incorrect answer."
      },
      {
        q: "How does the Sindh (SPSC) 60:40 quota work?",
        a: "Under statutory Sindh civil service rules, provincial positions are allocated in a 60:40 ratio: 60% reserved for candidates holding Sindh (Rural) domicile and 40% for Sindh (Urban) domicile (Karachi, Hyderabad, and Sukkur municipal areas)."
      },
      {
        q: "What is the KPPSC zonal quota allocation system?",
        a: "Khyber Pakhtunkhwa is administratively divided into 5 geographic zones plus the newly merged tribal districts (formerly FATA). Provincial commission posts are distributed proportionally among these zones to ensure merit representation across all regions."
      },
      {
        q: "How do candidates apply for BPSC jobs in Balochistan?",
        a: "Candidates register at bpsc.gob.pk, generate a computerized 1Link PSID for fee payment (PKR 800 for BPS-16/17), and submit an online application before the closing date. Valid Local or Domicile certificate of Balochistan is mandatory."
      },
      {
        q: "What is NTS and how are its fees deposited?",
        a: "The National Testing Service (NTS) is an autonomous testing agency administering screening tests for universities, district judiciary benches, and public authorities like WAPDA. Fees are paid via 1Link 1Bill using a unique consumer invoice number on mobile banking, ATM, EasyPaisa, or JazzCash."
      }
    ]
  },
  {
    id: "age-relaxation",
    title: "Age Limits & Statutory Age Relaxation",
    icon: Clock,
    questions: [
      {
        q: "What is the general age relaxation for Federal Government jobs?",
        a: "Under the Initial Appointment to Civil Posts (Relaxation of Upper Age Limit) Rules 1993, all candidates automatically receive a 5-year general age relaxation over the advertised upper age limit across federal ministries and FPSC posts."
      },
      {
        q: "What is the age relaxation for female candidates in Punjab (PPSC)?",
        a: "Under Government of Punjab service notifications, female candidates receive 8 years general age relaxation over the upper age limit for general provincial recruitment, whereas male candidates receive 5 years."
      },
      {
        q: "On what date is an applicant's age calculated?",
        a: "Your age is always calculated on the official closing date of receipt of applications, as stated in the advertisement. Events or birthdays occurring after the closing date do not alter your legal eligibility."
      },
      {
        q: "Does age relaxation apply to CSS and PMS competitive exams?",
        a: "No. The broad 5-year general age relaxation does NOT apply to CSS or PMS exams. CSS strictly limits age relaxation to a maximum of 2 years for recognized tribes, government servants with 2 continuous years of service, and special categories."
      }
    ]
  },
  {
    id: "fees-challan",
    title: "Challan Fees, 1Link PSID & Online Payments",
    icon: CreditCard,
    questions: [
      {
        q: "How do I pay the PPSC application fee through mobile banking?",
        a: "When applying on ppsc.gop.pk, the system generates a 17-digit PSID number. Open your mobile banking app, go to Bill Payments -> 1Bill / GoPb, enter the 17-digit PSID, and pay PKR 600. The portal updates payment status automatically."
      },
      {
        q: "Can I use a photocopy or mobile screenshot of the bank challan at the exam hall?",
        a: "No. Testing commissions (especially FPSC) require candidates to submit the physical, original bank-stamped green treasury challan receipt at the examination center. Photocopies or mobile screenshots are strictly rejected."
      },
      {
        q: "Can the application fee be deposited after the application deadline?",
        a: "No. The fee must be deposited in the bank or via 1Link on or before the closing date. Challans deposited after the cutoff date are void and disqualify the application."
      }
    ]
  },
  {
    id: "verification-integrity",
    title: "Tainaati Platform & Zero-Tolerance Anti-Fabrication Pledge",
    icon: ShieldCheck,
    questions: [
      {
        q: "How does Tainaati guarantee 100% verified listings?",
        a: "Every job listing on Tainaati is verified against primary government gazettes, consolidated advertisements, and direct public portal circulars. If a quota or fee detail cannot be verified with 100% certainty, we state it transparently rather than guessing."
      },
      {
        q: "How often are job listings synchronized on Tainaati?",
        a: "Our automated ingestion pipeline synchronizes directly with official public service commission endpoints and gazette repositories every 6 hours."
      },
      {
        q: "What happens when a job application deadline passes?",
        a: "Our automated expiry engine evaluates deadlines daily at 00:00 PKT. Expired vacancies are moved to archived status, JobPosting search schema is omitted to prevent outdated Google search results, and users are presented with verified active alternatives."
      }
    ]
  }
];

export default function FaqPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Frequently Asked Questions', url: `${siteUrl}/faq` }
  ]);

  // Generate Google FAQPage Schema
  const allFaqItems = FAQ_SECTIONS.flatMap(s => s.questions);
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  return (
    <div className="container-xl py-8">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="card p-6 md:p-8 mb-8 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-verified">
              <HelpCircle size={14} />
              <span>Verified Answers Hub</span>
            </span>
            <span className="text-xs text-muted">AEO & Fast Candidate Guidance</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-3">
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="text-secondary text-sm md:text-base leading-relaxed">
            Verified, accurate answers to common questions regarding Pakistani public service commissions (FPSC, PPSC, SPSC, KPPSC, BPSC, NTS), statutory age relaxation rules, 1Link challan payments, and screening test patterns.
          </p>

          <div className="mt-4 pt-4 border-t border-subtle flex items-center gap-4 flex-wrap text-xs text-muted">
            <span>• 100% Official Regulations</span>
            <span>• Zero Fabrication</span>
            <span>• Updated Daily</span>
          </div>
        </div>

        {/* Quick Navigation Anchor Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {FAQ_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="btn btn-outline btn-xs flex items-center gap-1.5 flex-shrink-0 text-xs py-1.5 px-3 rounded-full"
              >
                <Icon size={12} className="text-emerald-500" />
                <span>{sec.title.split('(')[0].trim()}</span>
              </a>
            );
          })}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {FAQ_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <section key={sec.id} id={sec.id} className="card p-6 md:p-8 scroll-mt-20">
                <h2 className="text-lg md:text-xl font-bold text-primary mb-5 flex items-center gap-2 border-b border-subtle pb-3">
                  <Icon size={20} className="text-emerald-500 flex-shrink-0" />
                  <span>{sec.title}</span>
                </h2>

                <div className="space-y-6">
                  {sec.questions.map((item, idx) => (
                    <div key={idx} className="bg-surface-subtle p-4 md:p-5 rounded-xl border border-subtle">
                      <h3 className="text-sm md:text-base font-bold text-primary mb-2 flex items-start gap-2">
                        <span className="text-emerald-500 font-mono">Q:</span>
                        <span>{item.q}</span>
                      </h3>
                      <p className="text-xs md:text-sm text-secondary leading-relaxed pl-6 m-0">
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Essential In-Depth Guides Callout */}
        <div className="card p-6 md:p-8 mt-8 bg-surface-subtle border border-emerald-500/20">
          <h2 className="text-base md:text-lg font-bold text-primary mb-3 flex items-center gap-2">
            <FileText size={18} className="text-emerald-500" />
            <span>Need Deeper Guidance on Official Rules?</span>
          </h2>
          <p className="text-xs md:text-sm text-secondary leading-relaxed mb-4">
            Explore our comprehensive, verified long-form guides tailored for competitive exam aspirants across Pakistan:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link 
              href="/blog/age-relaxation-in-govt-jobs" 
              className="p-3.5 rounded-lg border border-subtle bg-surface hover:border-emerald-500 transition-colors flex items-center justify-between text-xs"
            >
              <div>
                <strong className="text-primary block font-semibold">Age Relaxation Full Rules</strong>
                <span className="text-muted text-[11px]">Federal, Punjab, Sindh, KPK & Balochistan</span>
              </div>
              <span className="text-emerald-500 font-bold ml-2">→</span>
            </Link>

            <Link 
              href="/blog/how-to-apply-fia-jobs" 
              className="p-3.5 rounded-lg border border-subtle bg-surface hover:border-emerald-500 transition-colors flex items-center justify-between text-xs"
            >
              <div>
                <strong className="text-primary block font-semibold">How to Apply for FIA Jobs</strong>
                <span className="text-muted text-[11px]">FPSC Portal, Fee & Physical Standards</span>
              </div>
              <span className="text-emerald-500 font-bold ml-2">→</span>
            </Link>

            <Link 
              href="/blog/job-vs-business-which-is-better-pakistan" 
              className="p-3.5 rounded-lg border border-subtle bg-surface hover:border-emerald-500 transition-colors flex items-center justify-between text-xs"
            >
              <div>
                <strong className="text-primary block font-semibold">Job vs Business in Pakistan</strong>
                <span className="text-muted text-[11px]">BPS Pensions, Hyper-Inflation & Reality</span>
              </div>
              <span className="text-emerald-500 font-bold ml-2">→</span>
            </Link>

            <Link 
              href="/blog/job-titles-explained" 
              className="p-3.5 rounded-lg border border-subtle bg-surface hover:border-emerald-500 transition-colors flex items-center justify-between text-xs"
            >
              <div>
                <strong className="text-primary block font-semibold">Job Titles Glossary (MTO, Rigger, Teller)</strong>
                <span className="text-muted text-[11px]">Pakistani Role Definitions & Bands</span>
              </div>
              <span className="text-emerald-500 font-bold ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
