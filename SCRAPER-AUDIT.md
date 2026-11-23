# Scraper Accuracy and Coverage Audit Report (Task S — Part A)

**Date of Audit:** 15 November 2026 (Asia/Karachi)  
**Branch:** `fix/scraper-accuracy`  
**Dataset Examined:** `src/data/liveScrapedJobs.json` (95 total jobs: 14 open jobs, 81 archived jobs)  
**Verification Method:** Direct HTTP/HTTPS portal scraping, raw HTML analysis, official PDF & image circular downloads, and automated text extraction via `pypdf` / visual inspection.

---

## 1. Source-by-Source Extraction Logic & Hardcoded Fallbacks

This section details how each of the 6 scrapers currently operates, which URLs/APIs it calls, what fields it extracts, and the exact lines where hardcoded defaults or synthetic values are injected.

### 1.1 Federal Public Service Commission (FPSC)
- **File:** `pipeline/scrapers/fpscLiveScraper.js`
- **Source URL / API:**
  - Primary: `https://www.fpsc.gov.pk/api/jobs`
  - Fallbacks: `https://www.fpsc.gov.pk/Jobs?section=GR` and `https://www.fpsc.gov.pk/Jobs?section=CSS`
- **Fields Extracted:**
  - `title`: Direct mapping from `item.title` (or HTML `<h2>`).
  - `lastDate`: Direct mapping from `item.expiryDate` (or fallback 30 days ahead).
  - `postDate`: `item.date || today`.
  - `officialNotificationUrl`: PDF link extracted from TinyMCE HTML description.
- **Hardcoded / Synthetic Defaults:**
  - **Vacancies (Lines 123, 174):**
    ```javascript
    vacancies: isCSS ? 250 : 50,
    ```
    *Flaw:* Never attempts to parse vacancies from the circular. Injects 250 for any CSS item and 50 for everything else.
  - **Department (Lines 115, 166):**
    ```javascript
    department: isCSS ? "Federal Public Service Commission (CSS Cadres)" : "Federal Ministries & Attached Departments",
    ```
  - **Location / City (Lines 120, 171):**
    ```javascript
    city: "Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Quetta",
    ```
  - **Scale / BPS (Lines 119, 170):**
    ```javascript
    bpsScale: isCSS ? "BPS-17" : "BPS-16 to BPS-19",
    ```
  - **Age Limit (Lines 124, 175):**
    ```javascript
    ageLimit: isCSS ? "21 to 30 Years (Cut-off date 31st December)" : "18 to 35 Years (General Relaxation applicable)",
    ```
  - **Quota (Lines 125, 176):**
    ```javascript
    quota: "National Provincial Quota (Punjab, Sindh, KPK, Balochistan, Ex-FATA, AJK, GB)",
    ```
  - **Content Filtering Bug:** The API returns general notifications (e.g. `category: "Others"`). The scraper accepts all items without checking if they are recruitment notices vs exam timetables / departmental schedules (e.g. scraping FPO probationer exam schedule as a 50-vacancy job).

---

### 1.2 Punjab Public Service Commission (PPSC)
- **File:** `pipeline/scrapers/ppscLiveScraper.js`
- **Source URL / API:** `https://www.ppsc.gop.pk/Jobs.aspx` (Live ASP.NET session table).
- **Fields Extracted:**
  - `caseNo`: Column 2 (`tdMatches[2]`).
  - `postName`: Column 3 (`tdMatches[3]`).
  - `challanFee`: Column 4 (`tdMatches[4]`).
  - `department`: Column 5 (`tdMatches[5]`).
  - `postDate`: Column 6 (`tdMatches[6]`, parsed via `parseDateToISO`).
  - `lastDate`: Column 7 (`tdMatches[7]`, parsed via `parseDateToISO`).
- **Hardcoded / Synthetic Defaults:**
  - **Vacancies (Line 87):**
    ```javascript
    const meta = PPSC_ADVT_08_2026_METADATA[caseNoNorm] || {};
    const vacancies = meta.vacancies || 1;
    ```
    *Flaw:* The live HTML table on PPSC's portal does not have a vacancy count column. The scraper references a static metadata dictionary (`pipeline/utils/ppscGazetteDetails.js`) that ONLY contains cases from Advertisement 08/2026. Any case from Advertisement 09, 10, 11, or 12/2026 defaults to `1` vacancy. For example, Case 106-C/2026 (PMS / Combined Competitive Examination with 48 total posts) is saved as `1` vacancy.
  - **City / Location (Line 108):**
    ```javascript
    city: "Lahore / All Punjab Districts",
    ```
  - **Age Limit (Line 88):**
    ```javascript
    ageLimit: meta.ageLimit || "Male: 21 to 30 + 5 = 35 Years | Female: 21 to 30 + 8 = 38 Years (Subject to post-specific criteria)",
    ```
  - **Scale (Line 86):**
    ```javascript
    bpsScale: meta.bpsScale || extractBpsScale(postName) || "BPS-16 to BPS-18",
    ```

---

### 1.3 Sindh Public Service Commission (SPSC)
- **File:** `pipeline/scrapers/spscLiveScraper.js`
- **Source URL / API:** `https://spsc.gov.pk/advertisements`
- **Fields Extracted:**
  - `title`: PDF link anchor text (`<a>` containing `adv`).
  - `lastDate`: Regex match on anchor text `(\d{1,2})[\.\/-](\d{1,2})[\.\/-](\d{4})`.
  - `officialNotificationUrl`: PDF hyperlink.
- **Hardcoded / Synthetic Defaults:**
  - **Vacancies (Line 83):**
    ```javascript
    vacancies: 1,
    ```
    *Flaw:* SPSC publishes consolidated gazettes (e.g. Advt 07/2026 has 8 pages of posts; Advt 08/2026 is a CCE corrigendum). The scraper treats the entire PDF notice as a single job and hardcodes `1` vacancy.
  - **Department (Line 75):**
    ```javascript
    department: "Services, General Administration & Coordination Department, Government of Sindh",
    ```
    *Flaw:* Injects SGA&CD regardless of whether the notice is for the Energy Department, Health Department, or Agriculture.
  - **City (Line 80):**
    ```javascript
    city: "Karachi, Hyderabad, Sukkur, Larkana",
    ```
  - **Post Date (Line 86):**
    ```javascript
    postDate: today,
    ```
    *Flaw:* Never extracts the actual gazette issue date (which is printed in the PDF banner).

---

### 1.4 Khyber Pakhtunkhwa Public Service Commission (KPPSC)
- **File:** `pipeline/scrapers/kppscLiveScraper.js`
- **Source URL / API:** `https://www.kppsc.gov.pk/advertisement`
- **Fields Extracted:**
  - `title`: Anchor text of links matching `adv`.
  - `lastDate`: Regex `(\d{1,2})[\.\/-](\d{1,2})[\.\/-](\d{4})` on anchor text.
- **Hardcoded / Synthetic Defaults:**
  - **Vacancies (Line 63):**
    ```javascript
    vacancies: 1,
    ```
  - **Department (Line 55):**
    ```javascript
    department: "Government of Khyber Pakhtunkhwa",
    ```
  - **City (Line 60):**
    ```javascript
    city: "Peshawar",
    ```
  - **Post Date (Line 66):**
    ```javascript
    postDate: today,
    ```
  - **Coverage Flaw:** KPPSC's portal currently displays `"No active advertisement!"`. Scraper correctly extracts 0 active jobs when none are open, but will default to 1 vacancy when any new ad link appears.

---

### 1.5 Balochistan Public Service Commission (BPSC)
- **File:** `pipeline/scrapers/bpscLiveScraper.js`
- **Source URL / API:** `https://bpsc.gob.pk/BPSC/pages?jobs`
- **Fields Extracted:**
  - Table rows matching regex `adv`.
  - Closing date regex `(\d{1,2})[\.\/-](\d{1,2})[\.\/-](\d{4})` on table text.
- **Hardcoded / Synthetic Defaults:**
  - **Vacancies (Line 65):**
    ```javascript
    vacancies: 1,
    ```
  - **Department (Line 57):**
    ```javascript
    department: "Government of Balochistan",
    ```
  - **City (Line 62):**
    ```javascript
    city: "Quetta",
    ```
  - **Post Date (Line 68):**
    ```javascript
    postDate: today,
    ```
  - **Parsing Failure Bug (Lines 34–43):**
    ```javascript
    if (tds.length > 0 && tds[0].toLowerCase().includes('adv')) {
      const dateMatch = titleText.match(/(\d{1,2})[\.\/-](\d{1,2})[\.\/-](\d{4})/);
    ```
    *Flaw:* BPSC's active job notice is listed as `"Addendum Dated 02-11-2026. Last date for submission of online application has been extended up to 17 November 2026."` followed by `"Advertisement no 09-2026"`. Because the addendum row starts with "Addendum" instead of "adv", the scraper skips it. And because the "Advertisement no 09-2026" row lacks an inline date in its title column, the scraper drops it as having no date. BPSC active notices are completely missed.

---

### 1.6 National Testing Service (NTS)
- **File:** `pipeline/scrapers/ntsScraper.js`
- **Source URL / API:**
  - Primary listing: `https://www.nts.org.pk/new/projectsnew.php`
  - Subpages: `https://portal.nts.org.pk/Alldetail/<base64>` and `https://nts.org.pk/Test&Products/Announced/...`
- **Fields Extracted:**
  - `title`: Product name link text.
  - `lastDate`: Regex on `Submission is:` or `Last Date:`.
  - `department`: Parsed via `rawTitle.split('(')[0].trim()`.
- **Hardcoded / Synthetic Defaults:**
  - **Vacancies (Lines 110, 120):**
    ```javascript
    let vacancies = 12;
    ...
    if (lower.includes('tharparkar') || lower.includes('judge')) vacancies = 18;
    ```
    *Flaw:* Hardcoded 12 as global default, and 18 if the title has "tharparkar" or "judge"! This caused District & Session Judge Hyderabad (4 real vacancies) to be given 18 vacancies, District & Session Judge Dadu (28 real vacancies) to be given 18 vacancies, FESCO (5 real vacancies) to be given 12 vacancies, GEPCO (5 real vacancies) to be given 12 vacancies, and Sahiwal Cardiology (13 real vacancies) to be given 12 vacancies.
  - **Location (Lines 114, 124):**
    ```javascript
    let city = 'Multiple Districts';
    ...
    if (lower.includes('tharparkar') || lower.includes('judge')) city = "Mithi / Tharparkar";
    ```
    *Flaw:* Injects "Mithi / Tharparkar" for any job containing "judge", causing District & Session Judge Hyderabad and Dadu to show the location "Mithi / Tharparkar".
  - **Subpage Vacancy Ignored:** The NTS portal subpages (`portal.nts.org.pk/Alldetail/...`) explicitly contain `<b>Total Post:</b> X` and `<b>Post Name:</b> Y` for each post, but the scraper never parses them.
  - **Keyword Whitelist Dropping Jobs (Lines 55–69):** The employment filter requires words like `career`, `vacancies`, `recruitment`, `judge`, etc. It drops valid opportunities like `Multinational Oil and Gas Company (Induction of Field Production Trainees)`.

---

## 2. Official Portal Coverage Table (Open Advertisements Today)

Portal checks conducted live on 15 November 2026:

| Agency | Official Advertisement Number / Title | Official Last Date (Exact Quote from Portal / Circular) | Do We Have It? | Stored ID (or Missing Reason) |
| :--- | :--- | :--- | :---: | :--- |
| **FPSC** | CSS Competitive Examination-2027 (Written Exam) | `"Applications for written part of CSS CE-2027 are invited well before 25th November, 2026."` / Hardcopy: `"reach FPSC before 4th December 2026."` | **Yes (Data Stale/Wrong)** | `fpsc-live-api-101` (Stored deadline is wrong: `2026-12-08`) |
| **FPSC** | GR — Consolidated Advertisement No. 4/2026 | `"Intending candidates may apply on-line upto 23rd November, 2026."` / `"Closing Date for submission of applications is Monday, 23rd November, 2026."` | **Yes (Data Stale/Wrong)** | `fpsc-live-api-100` (Stored deadline is wrong: `2026-12-06`) |
| **FPSC** | Positions Vacant — FPSC Ministerial Posts [Balochistan Quota] | `"apply through National Job Portal website: (http://www.njp.gov.pk/) within fifteen days from the date of advertisement."` (Ad dated 13 Nov 2026 -> 28/29 Nov 2026) | **Yes** | `fpsc-live-api-103` (Stored deadline: `2026-11-29`) |
| **FPSC** | FPO Examination-2026 of 52nd CTP Probationers (IRS & PCS) | Timetable: `"Time Table - FPO Exam-2026 (Inland Revenue Service & Pakistan Customs Service)"` commencing 15-12-2026 | **Yes (SHOULD NOT EXIST)** | `fpsc-live-api-102` (Non-job in-service exam schedule scraped as job vacancy) |
| **PPSC** | Advertisement No. 12/2026 (Case No. 106-RC/2026: Combined Competitive Examination-2026) | `"Closing Date for Submission of Online Applications 30 November 2026"` | **Yes (Data Stale/Wrong)** | `ppsc-live-106c2026-1` (Vacancies wrong: stored `1` vs official `48`) |
| **SPSC** | Advertisement No. 08/2026 (CCE-2026 Corrigendum / Extension) | `"REVISED CLOSING DATE FOR SUBMISSION OF ONLINE APPLICATION: 23.11.2026"` / `"APPLY ONLINE WELL BEFORE 23-11-2026"` | **Yes** | `spsc-live-advertisement-08-26-closing-dt-2026-11-23` (Stored vacancies default: `1`) |
| **SPSC** | Consolidated Advertisement No. 07/2026 | `"CLOSING DATE: 14.12.2026"` | **Yes** | `spsc-live-advertisement-07-26-closing-dt-2026-12-14` (Stored vacancies default: `1`) |
| **KPPSC** | Official Advertisement Page | `"No active advertisement!"` (Confirmed directly on `kppsc.gov.pk/advertisement`) | **N/A** | 0 active ads currently open |
| **BPSC** | Consolidated Advertisement No. 09/2026 & Addendum | `"Last date for submission of online application has been extended up to 17 November 2026."` | **NO (MISSING)** | Missed by scraper: BPSC addendum row has "Addendum" instead of "adv", and PDF date not parsed |
| **NTS** | Faisalabad Electric Supply Company Limited (FESCO) Career Opportunities | `"Last Date of Application Form Submission is: 23rd November 2026"` (NTS Portal) / `"upto 25.11.2026"` (Ad image) | **Yes** | `nts-live-faisalabad-electric-supply-company-limit-2026-11-23` |
| **NTS** | District & Session Judge, Hyderabad (Career Opportunities) | `"addressed to the 'District & Sessions Judge, Hyderabad' on or before 25.11.2026 till 03.00pm."` | **Yes** | `nts-live-district-session-judge-hyderabad-career--2026-11-25` |
| **NTS** | Gujranwala Electric Power Company (GEPCO) Balochistan Quota | `"Last Date of Application Form Submission is: 23rd November 2026"` | **Yes** | `nts-live-gujranwala-electric-power-company-gepco--2026-11-23` |
| **NTS** | District & Session Judge, Dadu (Career Opportunities) | `"within 15 days from the date of publication... closing date for submission of online applications"` (16 Nov 2026) | **Yes** | `nts-live-district-session-judge-dadu-career-oppor-2026-11-16` |
| **NTS** | Hub & Spoke Model at Zahir Pir RYK Sheikh Zayed Medical College (101392) | `"Last Date of Application Form Submission is: 15th November 2026"` | **Yes** | `nts-live-hub-spoke-model-at-zahir-pir-ryk-sheikh--2026-11-15` |
| **NTS** | Newly Established Hub & Spoke Model at Zahir Pir RYK (101391) | `"Last Date of Application Form Submission is: 15th November 2026"` | **Yes** | `nts-live-newly-established-hub-spoke-model-at-zah-2026-11-15` |
| **NTS** | Sahiwal Institute of Cardiology Vacant Position - I | `"Last Date of Application Form Submission is: 04th December 2026"` | **Yes** | `nts-live-sahiwal-institute-of-cardiology-vacant-p-2026-12-04` |
| **NTS** | Multinational Oil and Gas Company (Induction of Field Production Trainees) | `"Last Date of Application Form Submission is: Friday, 27th November 2026"` | **NO (MISSING)** | Missed by scraper: title lacked keywords `career/posts/vacancies` |

---

## 3. Accuracy Audit Table

Verified against downloaded official notices and portal HTML:
- **All 14 currently open jobs** (`lastDate >= 2026-11-14`)
- **10 sampled archived jobs** (`lastDate < 2026-11-14`)

| # | Job ID | Stored Deadline | Official Deadline (Quoted from Official Source) | Stored Vac. | Official Vacancies | Stored Location | Official Location | Match? |
| :-: | :--- | :---: | :--- | :---: | :--- | :--- | :--- | :---: |
| 1 | `fpsc-live-api-101` | 2026-12-08 | `"Applications for written part of CSS CE-2027 are invited well before 25th November, 2026."` | 250 | Unspecified in notice (allocated post-exam by Federal Govt) | Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Quetta | Federal (19 exam centres nationwide) | **NO** (Deadline: 8 Dec vs 25 Nov; Vacancies: synthetic 250) |
| 2 | `fpsc-live-api-100` | 2026-12-06 | `"Closing Date for submission of applications is Monday, 23rd November, 2026."` | 50 | 48 individual cases totaling ~278 posts across federal departments | Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Quetta | Federal Ministries / Anywhere in Pakistan | **NO** (Deadline: 6 Dec vs 23 Nov; Vacancies: synthetic 50 vs ~278) |
| 3 | `ppsc-live-106c2026-1` | 2026-11-30 | `"Closing Date for Submission of Online Applications 30 November 2026"` | 1 | **48 POSTS** (`PMS: 45, ETO: 1, AD Local Fund Audit: 2`) | Lahore / All Punjab Districts | `"Anywhere in Punjab"` | **NO** (Vacancies: 1 vs 48; Deadline matches) |
| 4 | `nts-live-faisalabad-electric-supply-company-limit-2026-11-23` | 2026-11-23 | `"Last Date of Application Form Submission is: 23rd November 2026"` | 12 | **5 POSTS** (`Junior Engineer / SDO: 5`) | Multiple Districts | FESCO Jurisdiction (8 Punjab districts) / Balochistan Quota | **NO** (Vacancies: 12 vs 5; Location generic default) |
| 5 | `nts-live-district-session-judge-hyderabad-career--2026-11-25` | 2026-11-25 | `"addressed to the 'District & Sessions Judge, Hyderabad' on or before 25.11.2026 till 03.00pm."` | 18 | **4 POSTS** (`Junior Clerk: 2, Naib Qasid: 1, Lift Operator: 1`) | Mithi / Tharparkar | **District Hyderabad** | **NO** (Vacancies: 18 vs 4; Location: Mithi / Tharparkar vs District Hyderabad) |
| 6 | `nts-live-gujranwala-electric-power-company-gepco--2026-11-23` | 2026-11-23 | `"Last Date of Application Form Submission is: 23rd November 2026"` | 12 | **5 POSTS** (`Jr Eng: 2, AM CS/RO: 1, AM Material: 1, AM MIS/IT: 1`) | Multiple Districts | GEPCO Region (Punjab) / Balochistan Quota | **NO** (Vacancies: 12 vs 5; Location generic default) |
| 7 | `nts-live-district-session-judge-dadu-career-oppor-2026-11-16` | 2026-11-16 | `"within 15 days from the date of publication... closing date for submission of online applications"` (16 Nov 2026) | 18 | **28 POSTS** (`Stenographer: 7, Data Coder: 1, Junior Clerk: 20`) | Mithi / Tharparkar | **District Dadu** | **NO** (Vacancies: 18 vs 28; Location: Mithi / Tharparkar vs District Dadu) |
| 8 | `nts-live-hub-spoke-model-at-zahir-pir-ryk-sheikh--2026-11-15` | 2026-11-15 | `"Last Date of Application Form Submission is: 15th November 2026"` | 12 | **8 positions** (`Steno, JT Anesthesia, MCH, Cardiac, Pathology, Surgical, Plumber, Driver`) | Multiple Districts | **Rahim Yar Khan (Zahir Pir, Punjab)** | **NO** (Vacancies: default 12; Location generic default) |
| 9 | `nts-live-newly-established-hub-spoke-model-at-zah-2026-11-15` | 2026-11-15 | `"Last Date of Application Form Submission is: 15th November 2026"` | 12 | **1 POST** (`Assistant BPS-16`) | Multiple Districts | **Rahim Yar Khan (Zahir Pir, Punjab)** | **NO** (Vacancies: 12 vs 1; Location generic default) |
| 10 | `fpsc-live-api-103` | 2026-11-29 | `"apply through National Job Portal... within fifteen days from the date of advertisement."` | 50 | **3 POSTS** (`Assistant: 1, Stenotypist: 1, DEO: 1`) | Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Quetta | FPSC Secretariat, Islamabad (Balochistan Quota) | **NO** (Vacancies: 50 vs 3; Location generic default) |
| 11 | `fpsc-live-api-102` | 2026-12-05 | `"Time Table - FPO Exam-2026 (Inland Revenue Service & Pakistan Customs Service)"` | 50 | **0 POSTS (NON-JOB)** (Departmental timetable for 52nd CTP probationers) | Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Quetta | Examination Centres (IRS & PCS Academy) | **NO** (FABRICATED VACANCY: Departmental exam timetable scraped as 50-vacancy job) |
| 12 | `spsc-live-advertisement-08-26-closing-dt-2026-11-23` | 2026-11-23 | `"REVISED CLOSING DATE FOR SUBMISSION OF ONLINE APPLICATION: 23.11.2026"` | 1 | CCE-2026 Corrigendum / Age relaxation extension (Refers to CCE-2026) | Karachi, Hyderabad, Sukkur, Larkana | Sindh Provincial | **Partial** (Deadline matches; Vacancies default 1) |
| 13 | `spsc-live-advertisement-07-26-closing-dt-2026-12-14` | 2026-12-14 | `"CLOSING DATE: 14.12.2026"` | 1 | Multi-department consolidated gazette (8 pages of posts) | Karachi, Hyderabad, Sukkur, Larkana | Sindh Provincial (Various Departments) | **Partial** (Deadline matches; Vacancies default 1) |
| 14 | `nts-live-sahiwal-institute-of-cardiology-vacant-p-2026-12-04` | 2026-12-04 | `"Last Date of Application Form Submission is: 04th December 2026"` | 12 | **13 POSTS** (`Steno: 4, JT Cardiac: 4, JT Path: 1, JT Surg: 2, JT Physio: 2`) | Multiple Districts | **Sahiwal (Punjab)** | **NO** (Vacancies: 12 vs 13; Location generic default) |
| 15 | `ppsc-live-23a2026-1` *(Archived)* | 2026-10-05 | PPSC Advt 09/2026 Case 23-A/2026 closing date `05-10-2026` | 1 | Case from Advt 09/2026 | Lahore / All Punjab Districts | Punjab | **Partial** (Deadline matched; Vacancies defaulted to 1 because not in Advt 08 metadata) |
| 16 | `ppsc-live-24a2026-2` *(Archived)* | 2026-10-05 | PPSC Advt 09/2026 Case 24-A/2026 closing date `05-10-2026` | 1 | Case from Advt 09/2026 | Lahore / All Punjab Districts | Punjab | **Partial** (Deadline matched; Vacancies defaulted to 1) |
| 17 | `spsc-live-advertisement-06-26-closing-dt-2026-11-11` *(Archived)* | 2026-11-11 | `"CLOSING DATE FOR SUBMISSION OF ONLINE APPLICATION: 11-11-2026"` | 1 | CCE-2026 Corrigendum / Age relaxation extension | Karachi, Hyderabad, Sukkur, Larkana | Sindh Provincial | **Partial** (Deadline matches; Vacancies default 1) |
| 18 | `spsc-live-cce2026-1` *(Archived)* | 2026-09-23 | SPSC Advt 04/2026 CCE-2026 closing date `23-09-2026` | 45 | 45 Assistant Commissioner posts | Karachi, Hyderabad, Sukkur, Larkano | Sindh Provincial | **YES** (Direct match) |
| 19 | `kppsc-live-dsp-fast-track-2026` *(Archived)* | 2026-09-28 | KPPSC Fast Track Promotion Quota circular | 4 | 4 DSP promotion posts | Peshawar | Khyber Pakhtunkhwa | **YES** (Direct match) |
| 20 | `bpsc-live-lecturer-physical-education-2026` *(Archived)* | 2026-10-14 | `"Nineteen (19) posts of Lecturer in Physical Education (B-17) (Men's Section)"` / Closing: `"14th October, 2026 (Wednesday)"` | 19 | **19 POSTS** | Quetta | Balochistan Zonal Allocation | **YES** (Direct match from BPSC Advt 07/2026) |
| 21 | `bpsc-live-asst-engineer-civil-2026` *(Archived)* | 2026-10-14 | `"Three (03) posts of Assistant Engineer (B-17) in Divisional Directorates Development"` / Closing: `"14th October, 2026 (Wednesday)"` | 3 | **3 POSTS** | Quetta | Balochistan Zonal Allocation | **YES** (Direct match from BPSC Advt 07/2026) |
| 22 | `nts-live-1789920224359-1` *(Archived)* | 2026-09-28 | NTS PWCA Announcement closing `28th September 2026` | 12 | **3 POSTS** (`Deputy Director Design: 1, Computer Operator: 2`) | Multiple Districts | **Lahore (Punjab)** | **NO** (Vacancies: 12 vs 3; Location generic default) |
| 23 | `nts-live-1788345128521-1` *(Archived)* | 2026-09-16 | `"Last Date of Application Form Submission is: Wednesday, 16th September 2026"` | 12 | **3 POSTS** (`Assistant Director: 1, Senior Assistant: 1, Junior Assistant: 1`) | Multiple Districts | **Islamabad** | **NO** (Vacancies: 12 vs 3; Location generic default) |
| 24 | `nts-live-1788345128522-2` *(Archived)* | 2026-09-11 | `"Last Date of Application Form Submission is: Friday, 11th September 2026"` | 18 | **18 POSTS** (`Steno: 1, Jr Clerk: 7, Driver: 2, Bailiff: 3, Naib Qasid: 1, Farash: 1, Chowkidar: 1, Sweeper: 2, Mali: 1`) | Mithi / Tharparkar | **Mithi / Tharparkar** | **YES** (The original job from which the hardcoded rule was created!) |

---

## 4. Root Cause Analysis by Mismatch Category

### Root Cause 1: FPSC API `expiryDate` Represents Web Banner Ticker Expiry, Not the Application Deadline
- **Affected File:** `pipeline/scrapers/fpscLiveScraper.js` (Lines 87–89, 122).
- **Explanation:** In the FPSC CMS database (`https://www.fpsc.gov.pk/api/jobs`), the field `expiryDate` is used by the frontend team to automatically hide the homepage ticker item weeks after applications close. For example:
  - For CSS 2027, the application closing date stated in the public notice is **25th November 2026** (hardcopy deadline: 4th December 2026), but the API field `expiryDate` is `2026-12-08`.
  - For Consolidated Advertisement 4/2026, the application closing date stated on Page 1 and Page 24 is **23rd November 2026**, but the API field `expiryDate` is `2026-12-06`.
- **Impact:** Tainaati displays deadlines 13–15 days too late, misleading job seekers.

### Root Cause 2: Synthetic Hardcoded Vacancy Defaults in FPSC
- **Affected File:** `pipeline/scrapers/fpscLiveScraper.js` (Lines 123, 174).
- **Code:** `vacancies: isCSS ? 250 : 50`
- **Explanation:** The scraper never parses or calculates vacancies for FPSC items. It injects `250` for CSS and `50` for every other FPSC posting. Notice 103 (Ministerial Posts) had 3 posts, but was displayed as 50. Consolidated Advt 04/2026 had ~278 posts across 48 cases, but was displayed as 50.

### Root Cause 3: Non-Job Examination Schedules Scraped as Recruitment Vacancies in FPSC
- **Affected File:** `pipeline/scrapers/fpscLiveScraper.js` (Lines 75–85).
- **Explanation:** FPSC API returns items with `category: "Others"`. The scraper accepts these blindly without checking if they represent active job recruitment vs in-service exam timetables. This caused `FPO Examination-2026 of 52nd CTP Probationers (IRS & PCS)` (a departmental exam schedule for existing civil servants) to be published on Tainaati as an open government job with 50 vacancies and a fake deadline.

### Root Cause 4: PPSC Gazette Metadata Hardcoded to Advertisement 08/2026 Only
- **Affected Files:** `pipeline/scrapers/ppscLiveScraper.js` (Line 87) and `pipeline/utils/ppscGazetteDetails.js`.
- **Code:** `const vacancies = meta.vacancies || 1;`
- **Explanation:** PPSC's live table on `Jobs.aspx` does not provide a vacancy column. To solve this, a previous developer built `ppscGazetteDetails.js` containing case metadata strictly for Advertisement 08/2026. Because no other advertisements were added to that registry, any newer advertisement (e.g. Advt 12/2026, Case 106-C/2026 PMS) falls back to `1` vacancy, despite having 48 posts (45 PMS + 1 ETO + 2 AD Local Fund Audit).

### Root Cause 5: SPSC Single-Job PDF Lump-Sum Default
- **Affected File:** `pipeline/scrapers/spscLiveScraper.js` (Lines 75, 80, 83).
- **Explanation:** SPSC publishes multi-page consolidated recruitment PDFs (e.g. Advt 07/2026 with 8 pages of posts) and corrigendums. The scraper creates a single job entry per PDF link and hardcodes `vacancies: 1`, `city: "Karachi, Hyderabad, Sukkur, Larkana"`, and `department: "Services, General Administration & Coordination Department"`.

### Root Cause 6: BPSC Scraper Skips Addenda and Scanned PDF Circulars
- **Affected File:** `pipeline/scrapers/bpscLiveScraper.js` (Lines 34–43).
- **Explanation:** BPSC publishes extensions and addenda as table rows starting with `"Addendum..."`. The scraper strictly filters by `tds[0].toLowerCase().includes('adv')`, discarding addendum rows. Furthermore, BPSC's advertisement row does not display the closing date in HTML text; the date is inside the addendum image or PDF. As a result, BPSC currently extracts 0 active jobs despite Advertisement 09/2026 being open until 17 November 2026.

### Root Cause 7: NTS Hardcoded Rules for "Judge" and "Tharparkar" Overriding Real Data
- **Affected File:** `pipeline/scrapers/ntsScraper.js` (Lines 110, 114, 120, 124).
- **Code:**
  ```javascript
  let vacancies = 12;
  let city = 'Multiple Districts';
  if (lower.includes('tharparkar') || lower.includes('judge')) vacancies = 18;
  if (lower.includes('tharparkar') || lower.includes('judge')) city = "Mithi / Tharparkar";
  ```
- **Explanation:** A developer once manually verified `District & Session Judge, Tharparkar` (which had 18 vacancies and location Mithi / Tharparkar) and wrote a blanket rule matching `lower.includes('judge')`. This polluted every judicial job across Sindh:
  - District & Session Judge, Hyderabad (4 vacancies in Hyderabad) -> shown as 18 vacancies in Mithi / Tharparkar.
  - District & Session Judge, Dadu (28 vacancies in Dadu) -> shown as 18 vacancies in Mithi / Tharparkar.
  - Furthermore, NTS subpages contain exact `<b>Total Post:</b>` and `<b>Post Name:</b>` data for FESCO, GEPCO, and Sahiwal Cardiology, which the scraper ignored in favor of the default `12`.

---

## 5. Proposed Part B Fix Plan

When approved by the user, Part B will execute the following surgical improvements:

1. **Fix FPSC Scraper (`pipeline/scrapers/fpscLiveScraper.js`):**
   - **Filter Out Non-Jobs:** Ignore items containing `FPO Examination`, `Time Table`, `Admission Certificate`, `Departmental Exam`, or `Roll Number`.
   - **Extract Authentic Deadlines:** For Consolidated Advertisements and CSS notices, parse the actual deadline from the official PDF notice or link description (e.g. 23 Nov 2026 for Advt 04/2026; 25 Nov 2026 for CSS 2027) instead of blindly adopting the CMS ticker `expiryDate`.
   - **Replace Synthetic Vacancies:** Stop emitting `50` / `250`. Parse vacancy counts from official circulars or clearly label CSS as `vacancies: 0` / `"TBD by Federal Govt"` rather than fabricating 250.

2. **Fix PPSC Scraper & Metadata (`pipeline/scrapers/ppscLiveScraper.js` & `pipeline/utils/ppscGazetteDetails.js`):**
   - Add Advertisement 12/2026 (Case 106-C/2026) verified metadata: 48 vacancies (45 PMS, 1 ETO, 2 AD Local Fund Audit), closing date 2026-11-30, BPS-17.
   - For cases without metadata, do not guess: extract vacancy numbers if present in the post title (e.g. "(45 POSTS)") or leave as 1 with an explicit unverified flag.

3. **Fix NTS Scraper (`pipeline/scrapers/ntsScraper.js`):**
   - **Remove Harmful Hardcoded Rules:** Delete `if (lower.includes('tharparkar') || lower.includes('judge'))` overrides that forced 18 posts and Mithi / Tharparkar.
   - **Parse Subpage Post Details:** Extract actual `<b>Total Post:</b>` and position names from `portal.nts.org.pk/Alldetail/...` for projects like FESCO (5 posts), GEPCO (5 posts), Sahiwal Cardiology (13 posts), Hub & Spoke (8 posts / 1 post).
   - **Extract Location from Title/Employer:** Extract real city/district (e.g. Hyderabad, Dadu, Faisalabad, Gujranwala, Sahiwal, Rahim Yar Khan) rather than defaulting to "Multiple Districts" or "Mithi / Tharparkar".
   - **Broaden Employment Whitelist:** Include `induction`, `trainees`, `interns`, and `apprentices` so opportunities like `Multinational Oil and Gas Company (Induction of Field Production Trainees)` are not skipped.

4. **Fix BPSC Scraper (`pipeline/scrapers/bpscLiveScraper.js`):**
   - Parse `Addendum` rows to extract date extensions for active advertisements (e.g. 17 November 2026 for Advt 09/2026).
   - Link the addendum closing date to its corresponding advertisement circular.

5. **Fix SPSC Scraper (`pipeline/scrapers/spscLiveScraper.js`):**
   - Distinguish Corrigendum notices (e.g. Advt 08/2026 and Advt 06/2026 for CCE-2026) from new recruitment gazettes.
   - Extract real department and closing date from the official notice header.

6. **Regenerate & Verify `src/data/liveScrapedJobs.json`:**
   - Run the updated pipeline and verify that all 14 open jobs reflect accurate official deadlines, correct vacancy counts, and authentic locations.
   - Verify that non-job exam timetables (FPO 102) are purged.

