# Tainaati.com Comprehensive Platform & SEO Audit

**Audit Date:** November 11, 2026  
**Target Domain:** [https://www.tainaati.com](https://www.tainaati.com)  
**Active Branch:** `fix/seo-rebuild`  
**Audit Mode:** Read-only / Zero-Code-Change Audit  

---

## 1. Executive Summary

An exhaustive technical, architectural, content, and SEO audit was conducted across the live production deployment ([https://www.tainaati.com](https://www.tainaati.com)) and the underlying codebase.

### Primary Root-Cause Findings:
1. **The "0 Listings" vs "90 Openings" Paradox:**  
   The platform's deadline validation logic (`src/utils/jobStatus.js` and `src/utils/jobMetrics.js`) calculates days remaining against the current date. All 112 stored job records (80 in `liveScrapedJobs.json` + 32 in `jobsData.js`) have expired application deadlines dating between September 3, 2026 and October 14, 2026. Because `filterActiveJobs()` removes expired jobs, active job count is **0**.  
   However, hero category counters (`govtCount: 90`, `privateCount: 17`) and commissions bar counters (`PPSC 69 Active`) count raw array entries without checking deadlines. As a result:
   - The Hero dynamic counter computes `totalListings: 0` &rarr; displays **"0+ Verified Job Openings"**.
   - The listings feed computes `filteredJobs: 0` &rarr; displays **"Showing 0 listings"** and **"No matching positions found"**.
   - The Category and Commission cards display hardcoded/unfiltered counts &rarr; **"Govt Openings (90)"** and **"PPSC 69 Active"**.
2. **Missing Essential Assets:**  
   `https://www.tainaati.com/og-image.png` and `https://www.tainaati.com/favicon.ico` return **HTTP 404 Not Found** on the live production site.
3. **Flawed Cron / Architecture Sync:**  
   Vercel serverless cron route (`/api/cron/pipeline`) attempts to execute `fs.writeFileSync()` to `src/data/liveScrapedJobs.json`. On Vercel, the serverless filesystem is read-only (ephemeral in `/tmp`) and cannot update the git repository or deployed static bundles. The GitHub Actions workflow (`.github/workflows/scraper-cron.yml`) executes a test script (`node pipeline/run-test.js`) but lacks any `git commit` or `git push` step. The site is therefore frozen in time with September 2026 data.
4. **Pervasive Unprovable Claims:**  
   117+ instances of marketing claims that violate Rule 1 & Rule 2 ("100% Verified", "100% Anti-Scam Guarantee", "Updated Every 6 Hours", "Tainaati Intelligence Team", "ad-free", "Pakistan's #1") are scattered across metadata, UI templates, and translations.
5. **Navbar Accessibility & UI Defects:**  
   The desktop navbar renders icon-only links for `/saved-jobs` and `/alerts` with empty text nodes, causing bots and screen readers to fall back to raw URL strings. A stray `"null"` text string is rendered in the navbar DOM between the language switcher and main content.

---

## 2. Detected Tech Stack & Deployment Architecture

| Component | Detected Technology | Details / Configuration |
|---|---|---|
| **Framework** | Next.js 14.2.24 (App Router) | React 18.3.1, modern React Server Components (RSC) + Client Components |
| **Hosting Platform** | Vercel | Production CDN deployment (`server: Vercel`, edge node `bom1`, `x-vercel-id`) |
| **Branch Previews** | Enabled via Vercel GitHub App | Pushing any branch to the remote repository creates a preview deployment |
| **Database** | None (Static Flat JSON / JS) | No PostgreSQL, MySQL, MongoDB, Prisma, or Supabase. Jobs are loaded from static files: `src/data/liveScrapedJobs.json` and `src/data/jobsData.js` |
| **API Endpoints** | Next.js Route Handlers (`src/app/api`) | `/api/admin/auth`, `/api/contact`, `/api/cron/expiry`, `/api/cron/pipeline` |
| **Scraper Pipeline** | Custom Node.js ESM Scrapers (`pipeline/`) | Targeted at FPSC, PPSC, SPSC, KPPSC, BPSC, NTS. Executed via Cheerio / Native Fetch |
| **Styling** | Custom CSS + Tailwind utility classes | Configured with dark/light theme tokens and RTL/LTR support |
| **Icons & Media** | `lucide-react` (v0.475.0) | Vector SVG icons, SVGs stored in `public/logos/` |

---

## 3. Real Job Count & Data Origin Analysis

### Data Inventory:
- **`src/data/liveScrapedJobs.json`**: Exactly **80 records**.
  - SPSC: 5 records (CCE-2026 Assistant Commissioner, Section Officer, Excise Officer, etc.)
  - PPSC: 67 records (Lecturers, Medical Officers, Engineers, Assistants from Advt 08/2026)
  - NTS: 4 records
  - BPSC: 3 records
  - KPPSC: 1 record
- **`src/data/jobsData.js` (`BASE_JOBS_DATA`)**: Exactly **32 records**.
  - NCCIA, POF Labour, WAPDA, SBP, Motorway Police, CAA, etc.
- **Combined Platform Dataset (`JOBS_DATA`)**: **112 records**.

### Active vs Expired Status as of Audit Date (Nov 11, 2026):
- **Active Jobs (Deadline &ge; Today):** **0**
- **Expired Jobs (Deadline &lt; Today):** **112** (100% of the dataset)
  - Earliest deadline: `2026-09-03`
  - Latest deadline: `2026-10-14`

### Data Provenance & Credentials:
- **Are the records real?** Yes. The scraped jobs match authentic official gazettes (e.g., SPSC Advt No. 04/2026, PPSC Advt No. 08/2026) with valid official application URLs and gazette PDF links.
- **Does it require database credentials?** No database credentials exist or are required. The application relies entirely on flat JSON/JS files loaded at build time or during SSR.
- **Why is the data stale?**
  1. The Vercel cron route `/api/cron/pipeline` cannot write to disk on Vercel's read-only serverless environment.
  2. The GitHub Actions scraper `.github/workflows/scraper-cron.yml` executes `node pipeline/run-test.js` without persisting changes back to the git repository.

---

## 4. Live Homepage: Googlebot SSR vs Real Browser Comparison

| Inspection Point | Googlebot (Raw HTML via `curl -A Googlebot`) | Real Browser (Headless Chrome DOM) | Root Cause Analysis |
|---|---|---|---|
| **Hero Openings Counter** | `0+ Verified Job Openings` | `0+ Verified Job Openings` | `computeJobMetrics()` passes active jobs (`filterActiveJobs`), which returns `0` |
| **Hero Verified Depts** | `0 Verified Depts & Agencies` | `0 Verified Depts & Agencies` | Computed dynamically from active jobs; active jobs = 0 |
| **Hero Closing Soon** | `0 Closing in ≤ 3 Days` | `0 Closing in ≤ 3 Days` | Computed dynamically from active jobs; active jobs = 0 |
| **Hero Exams Counter** | `10 Upcoming Exam Schedules` | `10 Upcoming Exam Schedules` | Reads static `EXAM_SCHEDULES` in `examCalendarData.js` |
| **Category Cards** | `Explore Govt Openings (90)`, `Explore Tech Jobs (17)` | `Explore Govt Openings (90)`, `Explore Tech Jobs (17)` | Uses raw `jobs.filter(j => j.type === 'govt')` without checking deadline expiry |
| **Commissions Bar** | `PPSC 69 Active`, `SPSC 5 Active`, `FPSC 2 Active` | `PPSC 69 Active`, `SPSC 5 Active`, `FPSC 2 Active` | Uses raw `jobs.filter(j => j.agency === 'PPSC')` without checking deadline expiry |
| **Job Listings Feed** | Empty state: `<h3 class="text-xl font-bold font-display mb-2">No matching positions found</h3>` | Empty state: `Showing 0 verified listings • 100% cross-checked with official gazette notices.` | `HomeClientFilter.jsx` filters out expired jobs via `isJobExpired(j)`. When length is 0, empty state renders |
| **Job Cards in Raw HTML** | 0 job card articles | 0 job card articles | RSC stream embeds JSON objects inside script payloads, but HTML DOM renders empty state |
| **Navbar Text Glitch** | Raw text `⌘K English null 100% Verified Advertisements` | Raw text `⌘K English null 100% Verified Advertisements` | A dangling nullish expression in `Navbar.jsx` outputs literal `"null"` into the DOM |

---

## 5. Live URLs Audit (24 Specified URLs)

Every URL was requested from the live domain (`https://www.tainaati.com`) mimicking Googlebot.

| URL Path | Status | Page Title (`<title>`) | Heading 1 (`<h1>`) | Word Count | Content Assessment |
|---|---|---|---|---|---|
| `/` | 200 | Tainaati — Verified Jobs in Pakistan (FPSC, PPSC, SPSC, KPPSC & NTS) | The Authority on Careers & Competitive Exams in Pakistan | 660 | **Empty State (0 listings displayed)** |
| `/jobs/govt` | 200 | Government Jobs in Pakistan 2026 (FPSC, PPSC, SPSC, KPPSC & NTS) - Tainaati | Government Jobs in Pakistan 2026 | 811 | Real Content (Passes all govt jobs without filtering expiry) |
| `/jobs/private` | 200 | Private Sector & Corporate Jobs in Pakistan — Tainaati - Tainaati | Private Sector & Corporate Jobs in Pakistan | 796 | Real Content (Passes private jobs without filtering expiry) |
| `/exams` | 200 | Competitive Exam Calendar 2026 (FPSC, PPSC, SPSC, KPPSC Schedules) - Tainaati | Competitive Exam Calendar & Test Schedules 2026 | 915 | Real Content (Static exam schedule dataset) |
| `/test-prep` | 200 | FPSC, PPSC & NTS Test Preparation (MCQs & Past Papers 2026) - Tainaati | Competitive Exam MCQ Practice & Past Papers | 355 | Real Content |
| `/cv-builder` | 200 | Free ATS CV & Resume Builder for Pakistan Jobs (Govt & Tech) - Tainaati | Template - Your Full Name | 357 | Real Content (**Defective H1 tag**) |
| `/alerts` | 200 | Verified Email Job Alerts in Pakistan (FPSC, PPSC & Tech) - Tainaati | Verified Email Job Alerts in Pakistan - Tainaati • Instant Verified Job Alert | 303 | Real Content |
| `/saved-jobs` | 200 | Saved Jobs & Application Tracker — Tainaati - Tainaati | **None** | 195 | Real Content (**Missing H1 tag**) |
| `/blog` | 200 | Career Guides & Exam Intelligence Hub (PPSC, FPSC & Govt Jobs) - Tainaati - Tainaati | Pakistani Public Service & Career Intelligence Guides | 592 | Real Content |
| `/about` | 200 | About Tainaati — Pakistan's Verified Career Intelligence Authority - Tainaati | About Tainaati | 534 | Real Content |
| `/contact` | 200 | Contact Desk & Verification Inquiries — Tainaati - Tainaati | Contact Tainaati | 318 | Real Content |
| `/privacy-policy` | 200 | Privacy Policy — Tainaati - Tainaati | Privacy Policy | 753 | Real Content |
| `/terms-of-service` | 200 | Terms of Service — Tainaati - Tainaati | Terms of Service | 759 | Real Content |
| `/city/lahore` | 200 | Jobs in Lahore 2026 — Government (PPSC) & Private IT Careers - Tainaati | Latest Verified Jobs in Lahore (Government & IT 2026) | 815 | Real Content (Landing page with city-filtered jobs) |
| `/city/karachi` | 200 | Jobs in Karachi 2026 — Sindh Govt, Banking & IT Careers - Tainaati | Verified Jobs in Karachi (Sindh Govt, Ports & Tech) | 793 | Real Content (Landing page with city-filtered jobs) |
| `/city/islamabad` | 200 | Jobs in Islamabad 2026 — Federal Ministries (FPSC) & Software Houses - Tainaati | Federal Govt Jobs & Tech Openings in Islamabad (FPSC 2026) | 677 | Real Content (Landing page with city-filtered jobs) |
| `/city/peshawar` | 200 | Jobs in Peshawar 2026 — KPPSC & KPK Provincial Departments - Tainaati | Verified Jobs in Peshawar (KPPSC & Education 2026) | 526 | Real Content (Landing page with city-filtered jobs) |
| `/city/quetta` | 200 | Jobs in Quetta 2026 — BPSC & Balochistan Provincial Openings - Tainaati | Verified Jobs in Quetta (BPSC & Federal Quota 2026) | 571 | Real Content (Landing page with city-filtered jobs) |
| `/agency/fpsc` | 200 | FPSC Jobs 2026 — Official Online Application & Consolidated Advt - Tainaati | FPSC Jobs 2026 (Federal Public Service Commission) | 515 | Real Content (Landing page with agency-filtered jobs) |
| `/agency/ppsc` | 200 | PPSC Jobs 2026 — Punjab Public Service Commission Advertisements - Tainaati | PPSC Jobs 2026 (Punjab Public Service Commission) | 809 | Real Content (Landing page with agency-filtered jobs) |
| `/agency/spsc` | 200 | SPSC Jobs 2026 — Sindh Public Service Commission Gazette Notices - Tainaati | SPSC Jobs 2026 (Sindh Public Service Commission) | 593 | Real Content (Landing page with agency-filtered jobs) |
| `/agency/kppsc` | 200 | KPPSC Jobs 2026 — Khyber Pakhtunkhwa Commission Schedules - Tainaati | KPPSC Jobs 2026 (Khyber Pakhtunkhwa Commission) | 465 | Real Content (Landing page with agency-filtered jobs) |
| `/agency/bpsc` | 200 | BPSC Jobs 2026 — Balochistan Public Service Commission Advertisements - Tainaati | BPSC Jobs 2026 (Balochistan Public Service Commission) | 480 | **Empty State (0 listings displayed)** |
| `/agency/nts` | 200 | NTS Jobs 2026 — National Testing Service Career Projects & Results - Tainaati | NTS Jobs 2026 (National Testing Service) | 476 | Real Content (Landing page with agency-filtered jobs) |

### Key Metadata Inconsistencies Discovered:
- **Duplicate Title Suffixes:** Many pages render with double branding: `... — Tainaati - Tainaati`. This is caused by `src/app/layout.jsx` defining `title: { template: '%s | Tainaati', default: ... }` while page-level metadata already includes `— Tainaati` in its title string.
- **Missing H1:** `/saved-jobs` has no `<h1>` heading.
- **Misleading H1:** `/cv-builder` defines its `<h1>` as `Template | Your Full Name` instead of an informative heading.

---

## 6. Technical SEO, Infrastructure & Assets Audit

| Item | Live Status | Diagnostic Findings | Severity |
|---|---|---|---|
| **`og-image.png`** | **404 Not Found** | `https://www.tainaati.com/og-image.png` returns 404. Missing from `public/` folder. Every social share and OpenGraph tag points to a broken image. | **CRITICAL** |
| **`favicon.ico`** | **404 Not Found** | `https://www.tainaati.com/favicon.ico` returns 404. Missing from `public/` and `src/app/`. Causes browser console errors on every visit. | **HIGH** |
| **Redirects (non-www to www)** | **308 &rarr; 308 Double Hop** | `http://tainaati.com` &rarr; `https://tainaati.com/` (308) &rarr; `https://www.tainaati.com/` (308). Wastes crawl budget; should redirect directly to canonical destination in a single 301/308 hop. | **MEDIUM** |
| **HTTPS Enforcement** | 308 Permanent | `http://www.tainaati.com` &rarr; `https://www.tainaati.com/`. Proper HSTS header present (`max-age=63072000`). | PASS |
| **Canonical Tags** | Correct | Canonical tags are present across tested pages pointing to `https://www.tainaati.com...`. | PASS |
| **`robots.txt`** | 200 OK | Correctly serves `User-agent: *`, allows crawler access, disallows `/admin` and `/api/admin`, declares `Sitemap: https://www.tainaati.com/sitemap.xml`. | PASS |
| **`sitemap.xml`** | 200 OK (Stale) | Dynamically generated (26 KB), but contains hardcoded `<lastmod>` dates (`2026-09-20T16:35:44.165Z`) across entries and contains links to expired positions. | **HIGH** |
| **404 Page Behavior** | 200 / 404 Standard | Returns proper HTTP 404 status code with standard Next.js not-found layout. | PASS |

---

## 7. Inventory of Unenforced, Fake, or Unprovable Claims

In accordance with Global Rule 1 and Rule 2, the codebase was audited for unprovable, fabricated, or exaggerated claims. A total of **117 occurrences** were cataloged across templates, translations, and data files.

### Representative Specific Occurrences:

#### A. Unprovable Verification, Guarantee & Authority Claims
- `src/app/layout.jsx:46, 73` &mdash; `"Tainaati — Pakistan's #1 Verified Jobs & Exam Intelligence Portal"`
- `src/app/layout.jsx:54` &mdash; `authors: [{ name: "Tainaati Intelligence Team" }]`
- `src/components/Footer.jsx:193` &mdash; `<span>100% Gazette Verified</span>`
- `src/app/jobs/govt/page.jsx:54` &mdash; `<span>100% Gazette Verified</span>`
- `src/components/CategoryLandingPage.jsx:143` &mdash; `"Zero Fake Jobs / 100% Verified Gazette standard"`
- `src/components/CvBuilder.jsx:1037` &mdash; `<span>100% Single-Column ATS Guaranteed</span>`
- `src/app/about/page.jsx:16, 48` &mdash; `"100% verified government gazette pipeline"`, `"100% verified accuracy"`
- `src/data/translations.js:30` &mdash; `"100% Verified Advertisements — No Outdated Ads or Clutter"`
- `src/data/translations.js:104` &mdash; `"verified listings • 100% cross-checked with official gazette notices."`
- `src/data/translations.js:232, 753` &mdash; `"100% Anti-Scam Verification Guarantee"`, `"100% Anti-Scam Guarantee"`
- `src/utils/seoHelpers.js:106` &mdash; `"Pakistan's 100% verified zero-fabrication public sector recruitment and career opportunities platform"`

#### B. False Pipeline Frequency & Team Claims
- `src/components/CommissionsBar.jsx:14` &mdash; `subHeading: "Updated Every 6 Hours with Direct Gazette Links"`
- `src/data/translations.js:206` &mdash; `"Updated Every 6 Hours with Direct Gazette Links"`
- `src/data/blogData.js:34, 177, 298, 398, 496` &mdash; Author listed as `"Tainaati Intelligence Team"`
- `src/data/blogArticlesExtended.js:152` &mdash; Author listed as `"Tainaati Intelligence Team"`

#### C. Fabricated / Unenforced Counts & Stats
- `src/components/HeroSection.jsx:308` &mdash; `Explore Govt Openings ({metrics.govtCount})` &rarr; Evaluates to `(90)` on live site despite 0 active jobs.
- `src/components/HeroSection.jsx:329` &mdash; `Explore Tech Jobs ({metrics.privateCount})` &rarr; Evaluates to `(17)` on live site despite 0 active jobs.
- `src/components/CommissionsBar.jsx:45-75` &mdash; `PPSC 69 Active`, `SPSC 5 Active`, `FPSC 2 Active` &rarr; Unfiltered historical tallies claiming to be currently "Active".
- `src/data/portalHubsData.js:71, 82` &mdash; `monthlySearches: "90,500 / month"` &mdash; Hardcoded unverified marketing claim.
- `src/data/landingPagesData.js:90` &mdash; `govtVacancies: "190+", privateOpenings: "50+"` &mdash; Hardcoded stats.

#### D. Ad-Free / Unprovable User-Facing Claims
- `src/data/translations.js:34, 256, 760` &mdash; `"all in one modern, ad-free interface"`, `"Tainaati is an independent, ad-free career intelligence platform"`
- `src/data/portalHubsData.js:25` &mdash; `"in one unified, ad-free interface"`

---

## 8. UI & Navigation Bugs

1. **Navbar Action Buttons Missing Accessible Text:**  
   In `src/components/Navbar.jsx` (lines 533-556), the desktop `/saved-jobs` and `/alerts` buttons contain only SVG icons and zero text nodes. While `aria-label` is present, search engine text scrapers and text browsers extract empty strings `""` or fallback to `/saved-jobs` and `/alerts`.
2. **Navbar Literal `"null"` Rendering:**  
   Between the language picker button and main content, an unhandled conditional render evaluates to the string `"null"`, visible in raw DOM queries and text dumps.
3. **Data Mismatch Across Route Types:**  
   - On the homepage (`/`), `HomeClientFilter` uses `activeJobs` (filtered against expiry), rendering **0 listings**.
   - On `/jobs/govt`, the component directly passes all `govtJobs` without filtering for expiry, rendering **12 expired jobs** with badges such as "5d left" or "12d left" based on flawed relative date logic.
   - On `/agency/bpsc`, an empty state is rendered, whereas `/agency/ppsc` renders expired jobs.
4. **Interactive Filters Disconnected from Empty States:**  
   When 0 jobs are active, selecting BPS scale, City, or Category chips produces confusing empty states that prompt candidates to "clear filters", even though clearing filters still yields 0 positions.

---

## 9. Prioritized Problem List

### Critical Priority (Immediate Platform Blockers)
1. **Broken Data Lifecycle & Stale Dataset:**  
   All 112 stored jobs are expired. The homepage shows 0 listings while category badges advertise 90 openings. The live Vercel cron cannot write to disk, leaving the platform permanently stale without a functioning data ingestion mechanism.
2. **Missing Essential Media Assets (HTTP 404):**  
   `og-image.png` (used in all OpenGraph / social previews) and `favicon.ico` return 404.
3. **Pervasive Violation of Global Rules 1 & 2:**  
   Dozens of claims alleging "100% Verified", "Anti-Scam Guarantee", "Updated Every 6 Hours", and "Tainaati Intelligence Team" exist without code enforcement or factual verification.

### High Priority (Major SEO & UX Degradations)
4. **Duplicate Title Tags (`— Tainaati - Tainaati`):**  
   Metadata inheritance bug creates double brand suffixes on 20+ routes.
5. **Missing / Defective Headings:**  
   `/saved-jobs` lacks an `<h1>`. `/cv-builder` uses `Template | Your Full Name` as its `<h1>`.
6. **Inconsistent Job Filtering Between Routes:**  
   `/` filters out expired jobs, while `/jobs/govt` and `/agency/ppsc` display expired jobs as active.
7. **Stale Sitemap Entries:**  
   `sitemap.xml` publishes fixed historical `lastmod` timestamps from September 2026.

### Medium Priority (Polish, Cleanliness & Optimization)
8. **Double Redirect on Non-WWW HTTP:**  
   `http://tainaati.com` &rarr; `https://tainaati.com` &rarr; `https://www.tainaati.com`.
9. **Navbar `"null"` DOM Artifact & Icon Button Text:**  
   Fix stray null rendering and provide clean hidden/accessible text for desktop saved/alert icon buttons.
10. **Dead Link & Hardcoded Counter Clean-up:**  
   Align all landing page statistics directly to genuine, stored data.

---

## 10. Proposed Plan for Next Tasks

To ensure complete adherence to Global Rules 1–8, the following phased execution plan is proposed:

- **Phase 1: Brand Integrity & Claim Sanitation**  
  Purge all 117 unprovable marketing claims ("100% Verified", "Anti-Scam Guarantee", "Updated Every 6 Hours", "Tainaati Intelligence Team", "ad-free"). Replace with honest, fact-based terminology (e.g., "Gazette Sourced", "Official Links Provided").
- **Phase 2: Assets & Technical SEO Fixes**  
  Create authentic `og-image.png` and `favicon.ico` assets in `public/`. Fix the duplicate title template bug in `layout.jsx`. Correct missing/defective `<h1>` tags on `/saved-jobs` and `/cv-builder`.
- **Phase 3: Data Integrity, Synchronization & Honest Empty States**  
  Establish a truthful single source of truth for job statuses. When genuine active data is absent, show informative empty states with official commission links (FPSC, PPSC, SPSC portals) rather than contradictory counters. Fix the scraper ingestion or establish a verifiable ingestion workflow.
- **Phase 4: Verification & Proof**  
  Execute headless browser runs, curl tests, and screenshot verification across all 24 URLs on `fix/seo-rebuild` to prove every fix with concrete evidence.
