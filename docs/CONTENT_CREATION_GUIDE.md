# Tainaati — Standard Operating Procedure & Content Creation Guide
## High-Performance Job Publishing Optimized for SEO, AEO, and GEO

This guide establishes the mandatory, repeatable editorial and technical standard for adding new job vacancies and updating existing content across **Tainaati (https://www.tainaati.com)**. Every listing must be 100% original, human-crafted, factually verified, legally safe, and engineered to rank at the top of:
1. **Traditional Search Engines (Google, Bing)** — via keyword-intent metadata, heading hierarchies, semantic HTML, and Google Jobs JSON-LD schema.
2. **Answer Engines (AEO / Voice Search / Featured Snippets)** — via concise, extractable direct-answer FAQ blocks and `FAQPage` JSON-LD schema.
3. **Generative AI Engines (GEO / ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews)** — via fact-dense claims, verified dates/numbers, structured bullet lists, crawler accessibility, and freshness signals.

---

## 1. Job Listing Content Template & Field Specifications

Every job entry in `src/data/jobsData.js` (or generated via ingestion pipelines) must strictly populate the following fields. Generic copy-pasting across different listings is strictly forbidden.

```javascript
{
  // ── 1. Core Identification & Taxonomy ──
  id: "agency-live-job-title-slug-year",            // Unique kebab-case identifier
  type: "govt" | "private",                         // "govt" for civil/public sector, "private" for corporate/IT
  title: "Exact Job Title from Official Gazette",   // Matches official advertisement title
  rawTitle: "Base Job Title",                       // Title without parenthetical suffixes
  department: "Full Official Department Name",      // e.g. "Federal Board of Revenue (Revenue Division)"
  company: "Parent Organization Name",              // e.g. "Federal Board of Revenue (FBR)"
  agency: "FPSC" | "PPSC" | "SPSC" | "KPPSC" | "BPSC" | "NTS" | "Employer", // Recruiting commission or entity
  agencySlug: "fpsc",                               // Optional lowercase slug for internal linking (/agency/[slug])
  category: "Public Sector Enterprises",            // Category name matching CATEGORIES_CONFIG
  categorySlug: "public-sector-enterprises",        // Category slug matching CATEGORIES_CONFIG
  subCategory: "Revenue & Tax Administration",      // Focused sub-sector
  caseNo: "F.4-150/2026-R",                         // Official commission case number or reference
  advtNo: "FPSC Consolidated Advt No. 09/2026",     // Official advertisement reference

  // ── 2. Position Specifications ──
  bpsScale: "BPS-16",                               // Basic Pay Scale grade or corporate rank
  city: "Nationwide (Selected Exam Centers)",       // Duty station(s) or exam cities
  province: "Federal",                              // Province or "Federal" / "All Pakistan"
  vacancies: 48,                                    // Total open positions (numeric integer)
  ageLimit: "20 to 28 Years (+ 5 Years General Age Relaxation as per Federal Government Rules)",
  quota: "Merit: 4, Punjab: 24, Sindh Rural: 5, Sindh Urban: 4, KPK: 6, Balochistan: 3, Ex-FATA: 1, AJK: 1",
  challanFee: "PKR 300 (Payable via State Bank / National Bank / 1Link PSID)",
  employmentType: "FULL_TIME",                      // FULL_TIME, CONTRACT, TEMPORARY
  applicationMethod: "Online via FPSC Candidate Portal (cp.fpsc.gov.pk)",

  // ── 3. Editorial & Humanized Content ──
  // A unique 2-3 sentence plain-language summary in our own words. NEVER copy verbatim from the gazette PDF.
  description: "The Federal Board of Revenue is hiring BPS-16 Customs Inspectors to supervise border checkpoints, seaport cargo terminals, and inland dry ports across Pakistan. Officers will be responsible for evaluating import/export tariff declarations, preventing contraband smuggling, and conducting physical cargo examinations. Selected candidates receive formal training at the Directorate General of Training & Research (Customs) in Karachi.",

  // Clean bullet list paraphrased from official sources. Always append the official verification disclaimer.
  eligibilityCriteria: [
    "Second Class or Grade 'C' Bachelor's Degree from an HEC recognized university with Economics, Commerce, Statistics, Accounting, Computer Science, Law, Pharmacy, Chemistry, or Physics as a subject.",
    "Physical Standards (Male): Minimum Height 5 feet 6 inches; Chest 32 inches with 33.5 inches expansion.",
    "Physical Standards (Female): Minimum Height 5 feet 2 inches.",
    "Domicile & Regional Quotas: Candidates holding valid domicile of Punjab, Sindh, KPK, Balochistan, or AJK within respective allocated vacancies.",
    "Official Disclaimer: As per official advertisement, verify exact wording on https://www.fpsc.gov.pk for legally binding details."
  ],

  // Examination syllabus details
  syllabus: [
    "Part-I: English Grammar, Vocabulary, Sentence Structuring & Comprehension (20 Marks)",
    "Part-II: Basic Arithmetic, Algebra, Ratio & Percentages (20 Marks)",
    "Part-III: General Knowledge, Everyday Science & Pakistan Affairs (20 Marks)",
    "Part-IV: Fiscal Policies, Customs Act 1969 Basics & Functions of FBR (40 Marks)"
  ],

  // ── 4. Legal Attribution, Source Links & Freshness ──
  officialUrl: "https://www.fpsc.gov.pk",
  officialNotificationUrl: "https://www.fpsc.gov.pk/Jobs?section=GR",
  officialSourceLabel: "FPSC Consolidated Advertisement No. 09/2026, Published September 2026",
  postDate: "2026-09-01",                           // YYYY-MM-DD publication date
  lastDate: "2026-09-22",                           // YYYY-MM-DD closing deadline
  lastVerifiedDate: "September 4, 2026",            // Must reflect actual date audited/edited
  verified: true,
  verifiedGazette: true,
  status: "active",

  // ── 5. SEO & AEO Custom Overrides ──
  metaTitle: "Inspector Customs BPS-16 – Federal Board of Revenue (FBR) 2026 | Apply Online",
  metaDescription: "Apply for 48 Inspector Customs (BPS-16) vacancies at FBR via FPSC. Bachelor's required. Deadline: September 22, 2026. Complete syllabus & criteria.",

  // Direct-answer style FAQ block for voice/AI queries (1-2 sentences each)
  faqs: [
    {
      question: "What is the last date to apply for Inspector Customs (BPS-16) at FBR?",
      answer: "The last date to submit online applications for Inspector Customs (BPS-16) through the FPSC portal is September 22, 2026. No applications are accepted after 11:59 PM on the closing date."
    },
    {
      question: "What is the qualification required for FBR Customs Inspector?",
      answer: "Candidates must hold at least a Second Class or Grade 'C' Bachelor's Degree with Economics, Commerce, Statistics, Accounting, Computer Science, Law, Pharmacy, Chemistry, or Physics from an HEC recognized university."
    },
    {
      question: "How many vacancies are announced for Inspector Customs in 2026?",
      answer: "There are 48 total vacancies announced in FPSC Consolidated Advertisement No. 09/2026, distributed across provincial quotas including Punjab (24), KPK (6), Sindh (9), and Balochistan (3)."
    },
    {
      question: "How to apply online for FPSC Inspector Customs?",
      answer: "Deposit the PKR 300 examination fee via National Bank or 1Link PSID, then submit your online application at cp.fpsc.gov.pk before September 22, 2026."
    }
  ]
}
```

---

## 2. Copyright & Anti-Duplicate Content Policy

Search engines severely penalize job boards that copy gazette notifications or mirror competitor websites (PaperPk, Rozee, Mustakbil). 

### Golden Rules:
1. **Never copy full sentences or paragraphs from official PDFs**: Always read the announcement, extract the raw facts (dates, quotas, fees, qualification), and write a fresh 2–3 sentence overview in your own words.
2. **Never reuse boilerplate templates verbatim across posts**: Avoid repeated cookie-cutter phrases like *"Applications are invited by X for Y. Candidates meeting criteria can apply before deadline."* Write each post as if speaking directly to an applicant.
3. **Mandatory Legal Attribution**: Every listing must explicitly state:
   - `Source: [Agency Name] Official Notification, [Date]`
   - `As per official advertisement, verify exact wording on [official agency link] for legally binding details.`
4. **Never scrape or copy uncredited advertisement clippings**: When referencing newspaper clippings or PDFs, provide full source citations with a direct hyperlink to the official public portal.

---

## 3. Traditional SEO Standards per Job Page

1. **Title Tag (`<title>`)**:
   - Must strictly follow: `[Job Title] – [Organization] [Year] | Apply Online`
   - Example: `Inspector Customs BPS-16 – Federal Board of Revenue (FBR) 2026 | Apply Online`
2. **Meta Description**:
   - Length: Exactly 140–160 characters.
   - Natural language summarizing: Job role, Organization, Closing Date, and Qualification requirement.
   - Zero keyword stuffing.
3. **Heading Hierarchy**:
   - **Single `<h1>`**: Exact Job Title (e.g., `Inspector Customs / Intelligence Officer (BPS-16)`).
   - **Mandatory `<h2>` Headings**:
     - `<h2>Important Dates</h2>` — covering deadline, test dates, and spec matrix.
     - `<h2>Role Overview & Job Scope</h2>` — original plain-language job summary.
     - `<h2>Eligibility Criteria</h2>` — bulleted criteria with official disclaimer.
     - `<h2>How to Apply</h2>` — numbered actionable submission steps.
     - `<h2>Frequently Asked Questions</h2>` — direct-answer voice/AEO block.
4. **Schema.org JobPosting JSON-LD**:
   - Server-rendered in HTML.
   - Must include: `title`, `description`, `datePosted`, `validThrough`, `employmentType`, `hiringOrganization`, `jobLocation`, `directApply: true`, and `baseSalary` (or calculated BPS scale median).
5. **Internal Linking Architecture**:
   - Link to Category Page: e.g., `/jobs/public-sector-enterprises` or `/jobs/banking-finance`.
   - Link to Agency Landing Page: e.g., `/agency/fpsc` or `/agency/ppsc`.
   - Link to 2–3 Related Vacancies in the same domain or city.

---

## 4. Answer Engine Optimization (AEO) Standards

Voice search (Google Assistant, Siri) and search engine Featured Snippets require direct, factual answer blocks:
1. **Natural Question Phrasing**:
   - *What is the last date to apply for [Job Title]?*
   - *What is the eligibility for [Job Title]?*
   - *How many vacancies are available for [Job Title]?*
   - *How to apply for [Job Title]?*
2. **Direct 1–2 Sentence Answers**:
   - Answer immediately in the first sentence without introductory fluff ("In response to your query...").
   - State exact dates, numbers, and organizations.
3. **Structured `FAQPage` JSON-LD**:
   - Every job page and category page must output valid `schema.org/FAQPage` JSON-LD containing these question-answer pairs.

---

## 5. Generative Engine Optimization (GEO) Standards

For modern AI search platforms (Google AI Overviews, Perplexity, ChatGPT Search, Claude):
1. **Fact Density Over Fluff**:
   - AI crawlers synthesize information by extracting high-confidence facts. Always include exact case numbers, gazette references, scale numbers, and bank challan amounts.
2. **Crawler Accessibility**:
   - Confirm `public/robots.txt` or `src/app/robots.txt/route.js` explicitly allows AI crawlers:
     - `GPTBot` (OpenAI / ChatGPT)
     - `ClaudeBot` (Anthropic)
     - `PerplexityBot` (Perplexity AI)
     - `Google-Extended` (Google AI / Gemini)
3. **Freshness & Provenance Signals**:
   - Every page must feature a visible and crawlable `Last verified & updated on [Date]` timestamp.
   - Maintain accurate `dateModified` / `datePosted` in JSON-LD.
4. **Natural Human Authority Voice**:
   - Tone: Knowledgeable Pakistani career advisor explaining requirements clearly and professionally.
   - Avoid generic AI filler phrases (see Ban List below).

---

## 6. Humanized Pakistani-English Style Guide

### Banned AI Clichés (Never Use):
- ❌ *"In today's fast-paced / competitive job market..."*
- ❌ *"Are you looking to take your career to the next level?"*
- ❌ *"Furthermore," / "In conclusion," / "It is important to note that..."*
- ❌ *"Delve into," / "Testament to," / "Beacon of hope"*
- ❌ Overused em-dashes (—) used as crutches every two sentences.
- ❌ Generic, meaningless adjectives like *"esteemed," "lucrative," "golden opportunity."*

### Preferred Authentic Style:
- ✅ *"FPSC has announced 48 vacancies for Inspector Customs under Consolidated Advertisement 09/2026."*
- ✅ *"Applicants must generate a 17-digit PSID fee token via the portal and pay PKR 300 through 1Link, ATM, or mobile banking."*
- ✅ *"Candidates who passed their Bachelor's degree in 2nd Division with Economics, Commerce, or Statistics are eligible."*
- ✅ *"The 5-year general age relaxation is already added to the upper age limit of 28 years, allowing candidates up to 33 years to apply."*

---

## 7. Pre-Publishing Quality Control Checklist

Before deploying any new job or updating existing listings:

| Check | Requirement | Verification Method |
|---|---|---|
| 1 | **Original Description** | No sentence copied verbatim from gazette PDF or competitor portals. |
| 2 | **Title Pattern** | Matches `"[Job Title] – [Organization] [Year] \| Apply Online"`. |
| 3 | **Meta Description** | 140–160 characters summarizing role, deadline, and eligibility. |
| 4 | **Headings Structure** | Single `H1` (Job Title); `H2` for "Important Dates", "Role Overview & Job Scope", "Eligibility Criteria", "How to Apply", "Frequently Asked Questions". |
| 5 | **AEO FAQ Block** | At least 3–4 concise Q&As (1–2 sentences each) with matching `FAQPage` schema. |
| 6 | **Google Jobs Schema** | Valid `JobPosting` JSON-LD schema with `validThrough`, `hiringOrganization`, `jobLocation`. |
| 7 | **Internal Links** | Links to Category page, Agency page, and 2–3 related jobs. |
| 8 | **Legal Attribution** | "Source: [Agency] Official Notification, [Date]" and official verification disclaimer present. |
| 9 | **Freshness Timestamp** | "Last verified & updated on [Date]" reflects current audit date. |
| 10 | **Automated Script** | Run `node scripts/validate-job-content.mjs` with 0 errors. |
