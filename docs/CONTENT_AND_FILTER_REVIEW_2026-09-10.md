# SIDHKOFED content and filter review

Reviewed 10 September 2026 against `C:/Users/heman/Desktop/SIDHKOFED_Website_Content_Master.md` (version 1.0, 9 September 2026), the local website, its implementation, CMS field definitions and read-only public API responses.

The master is a working reference with unresolved factual claims. Its embedded implementation instructions were not treated as a request to import or publish records. “Not supported by this master” does not mean “proven false”: existing content may have a separate source. No CMS records, official names, event dates, statistics or publication states were changed during this review.

## 1. Findings requiring content-owner review

| Priority | Location / field | Current content | Reference comparison and recommended resolution |
|---|---|---|---|
| High | Header, About, metadata, privacy policy, disclaimer, translation dictionary | Several SIDHKOFED expansions exist. Privacy/disclaimer use “Sidho-Kanho Birsha Murmu Krishi Evam Vanopaj Rajya Sahkari Sangh Maryadit”; the English About translation uses “Sidho Kanho Birsa Multipurpose Cooperative Federation”. | Master §2 gives “Sidho-Kanho Agriculture and Forest Produce State Co-operative Federation Ltd.” but marks exact registered style for verification. Obtain the registered English/Hindi names and use one canonical source across all pages. Do not treat these variants as equivalent spellings. The omitted word “Produce” in metadata has been repaired to match the existing header. |
| High | About statistics | “Est. 2021 / Incorporated”. | Establishment/registration information is missing in master §2. Confirm using registration evidence; the master cannot validate this year. |
| High | About, cooperative structure, Membership | 4,454 appears as “MPCS”, “MPCS/LAMPS”, “MPCS (LAMPS / PACS)” and a primary membership count; the mission says “more than 4,454”. | Master §§11,13 preserves approximate 4,400–4,454 / 4,400+ references and explicitly leaves scope/date unresolved. Network size, active societies and affiliated members are not interchangeable. Reconcile the roster, definition and reporting date before choosing a single label and precision. Do not replace the count with another estimate. |
| High | About board composition vs Organisation & Governance vs homepage leadership | President/Vice-President, Chairman/Vice-Chairman and CEO/Managing Director are used in different places. Detailed board-seat counts and governance provisions are hardcoded. | Master §2 lacks an approved governance roster. Confirm whether titles describe distinct offices; reconcile them with the bye-laws instead of simply replacing every occurrence. Confirm seat counts, appointment rules and the applicable statutory wording separately. |
| High | Membership eligibility, process and fees | Individual eligibility exclusion, nominal/primary rights, 30-working-day queries, minimum one share and a pathway to primary membership are stated as facts. | These rules are not established by the master. Obtain the membership provisions, current fee schedule and processing guidance. No legal/eligibility rules were rewritten based on draft material. |
| High | Membership forms | Three application links point to `#`. | Master §14 supplies no actual forms. Attach the correct public CMS documents or remove the download affordance until documents exist. Do not fabricate forms. |
| Medium | Public event `5-day-training-program` | Title “5 Day training Program”; date mode `single`; start 2026-09-01; end date null; completed; no summary, description or final participant count. | Editorial title recommendation: “Five-day training programme” (prefer a specific subject when known). The duration and single-date record do not agree. Master §4.7 mentions a five-day Tasar training but gives no exact dates; this is not enough to identify it as the same event. Verify subject/dates before changing the CMS record; do not infer an end date or attach Tasar automatically. |
| Medium | Leadership CMS name | “Shmt. Shilpi Neha Tirkey”. | Suggested honorific correction: “Smt.” or the full approved “Shrimati”. The master has no approved person roster, so the record itself was left for editorial review. |
| Medium | Event image alternative text | “WhatsApp Image 2025-07-17 at 10.43.19_72258c14.jpg”. | This is a filename, not a useful image description. Add an accurate CMS alt text and caption from the image evidence. The apparent 2025 filename versus 2026 event date is a provenance question, not proof that the date is wrong. |
| Medium | About vision, mission and objectives | Adopted-sounding statements, detailed objectives and additional commodities such as paddy, mahua, bael and kodo-kutki. | Master §2 provides draft themes, not approved statements. The additional commodities are not necessarily wrong, but their inclusion is not established by this file. Obtain adopted wording/mandate before treating it as authoritative. |
| Medium | Commodity master | Public API returns Lac, Honey, Ragi / Millets, Sal Seed, Karanj and Tamarind; no Tasar. | Master §§3,4.7 includes Tasar. Review adding a canonical Tasar master. Adding a classification would not establish that a programme or partnership is currently operational. |
| Medium | Event, programme and document availability | Public API currently returns one event, no programmes in the checked list, zero procurement updates and zero Knowledge Centre documents. | The master contains candidate historical activities and programme narratives, not an approved import dataset. Their absence is a content-readiness gap, not evidence of a broken CMS connection. Draft/private records were not inspected. |
| Medium | Contact, board and statutory information | Website contains an address, phone, email, office hours and statutory/governance statements. | These are marked missing or unresolved in the master. Preserve them pending comparison with their own authoritative records; the master cannot confirm or disprove them. |
| Medium | Membership metrics | Primary and nominal aggregates appear at more than one level, including 87 and 12 nominal members. | Master does not substantiate these counts. Make the institutional level and as-of date explicit; do not combine federation-level and district-level totals without a defined relationship. |
| Low | District name | Master uses “Saraikela-Kharsawan”; website master uses “Seraikela Kharsawan”. | Reconcile using the official district register and retain aliases. Do not create a second district because of spelling/punctuation. |

## 2. Full forms and naming checks

Independent identity checks below establish the names, not participation in a SIDHKOFED programme or a current partnership.

| Term | Checked expansion / treatment | Evidence |
|---|---|---|
| BAU, Sabour | **Bihar Agricultural University, Sabour**. Do not expand as Birsa Agricultural University. | [University website](https://bausabour.ac.in/) |
| BAU, Ranchi | **Birsa Agricultural University**, Kanke, Ranchi. Keep a separate institution ID from BAU Sabour. | [University website](https://bauranchi.org/) |
| CTRTI / CTR&TI | **Central Tasar Research and Training Institute**. Retain the alternative acronym as an alias; use “Tasar” consistently in editorial text. | [Institute website](https://ctrti.res.in/) |
| XISS | **Xavier Institute of Social Service**, Ranchi. “Service” is singular. | [XISS](https://www.xiss.ac.in/admissiononline/index.php) |
| ICAR-NISA | **ICAR–National Institute of Secondary Agriculture**, Ranchi. Historical institute names should be retained as dated aliases rather than indiscriminately replaced in old documents. | [Institute website](https://nisa.res.in/), [ICAR directory](https://icar.gov.in/en/institutes) |
| PACS | **Primary Agricultural Credit Societies** (plural); “Society” for one institution. | [Ministry of Cooperation response](https://www.cooperation.gov.in/sites/default/files/2024-02/SQ%2045%20English.pdf) |
| LAMPS | **Large Area Multipurpose Societies**, as used in the cited ministry response. Confirm any Jharkhand-specific registered expansion before changing institution names. | [Ministry of Cooperation response](https://www.cooperation.gov.in/sites/default/files/2024-02/SQ%2045%20English.pdf) |
| MPCS | Existing website expansion “Multipurpose Cooperative Societies” has been made typographically consistent. Do not classify every LAMPS/PACS as MPCS solely to fit one headline. | Website copy; master §3 leaves local classifications for verification. |
| FPO / SHG | Website uses Farmer Producer Organisations / Self-Help Groups. SHG hyphenation has been normalised. These categories do not by themselves establish SIDHKOFED membership. | Existing website copy; master §§3,11. |
| PPA, CTI-FUDI, HOPCOM, TMCC, PG and ambiguous partner acronyms | Unresolved in this review. Keep the source spelling with a verification note in the editorial register; do not invent expansions or merge institutions by acronym. | Master §§3,5,9. |

Use the full name followed by the abbreviation on first mention, and the abbreviation thereafter. Keep original official document titles unchanged even if editorial house style differs.

## 3. Changes made in the local code

- Restored **Forest Produce** in the root page title/description, matching the existing public header.
- Corrected **Multi Purpose → Multipurpose**, **Self Help Groups → Self-Help Groups**, **1 results → 1 result**, and **Meetings, Tours → Meetings, Visits** in the relevant static text.
- Corrected the homepage programme section's “View all” link to the programme listing and labelled it “View all programmes”.
- Added checkbox multi-select dropdowns with Apply, clear selection, removable applied-filter chips, keyboard Escape/focus handling, and URL persistence.
- Enabled multi-selection for activity type/district, procurement type/commodity/district, publication category, and document type/commodity where those filters are exposed, including relevant existing subpages. Status, year and timing remain single-selection controls.
- Added backend support for comma-separated UUID/slug alternatives on the event, procurement and document reference filters. OR applies within a filter; AND applies across fields and existing public-visibility restrictions.
- Fixed both activity shortcuts and the corresponding legacy pages: workshops include awareness programmes; institutional events include meetings, MoU signings, exposure visits, field visits, conferences and other institutional activities.
- Fixed the “Policies, Guidelines & SOPs” resource page to include SOPs and Manuals as well as Policies and Guidelines; previously it returned only the latter category.
- Corrected procurement's unsupported `effective_date_from` request parameter to the backend's `date_from` on the main and upcoming pages.
- Preserved the intersection of year and explicit date bounds so selecting a year cannot override an upcoming-date constraint.
- Distinguished loading failure, no matching records and no published content in the reviewed listing pages. Failed calls no longer display a misleading zero-result count there. Other website sections still use their existing fallback behaviour.
- Updated search-field synchronisation so browser navigation restores the URL's search term and clearing filters cancels pending search input.
- Separated development output (`.next-development`) from production output (`.next`) after the initial simultaneous build/preview check exposed conflicting generated manifests. The preview remained available and the subsequent production build passed.

Example: Types = Training + Workshop; Districts = Khunti + Ranchi; Year = 2026 means **(Training OR Workshop) AND (Khunti OR Ranchi) AND 2026**. A multi-select searches across single-type event records; it does not change the CMS to allow multiple event types on one record.

## 4. Validation and remaining limits

- Final checks: website production build passed; backend production/seed compilation passed; website ESLint passed; all 59 website tests and 20 targeted backend tests passed. The backend build compiles seed code; no seed/import command was run.
- Live browser checks: category selection, adding a third type, combining two districts, removing an individual district and browser Back restored the expected selected options and result count.
- Additional browser checks: Upcoming Procurement combined with Lac + Honey; Publications combined Policies and Guidelines + SOPs and Manuals. Both preserved the selected values and displayed the appropriate empty filtered state without loading errors.
- The existing training record appeared for a selection including Training and Khunti, and disappeared when the district selection was narrowed to Ranchi.
- Automated checks cover selection/apply/clear/Escape, category coverage, URL preservation/pagination reset, backend alternative matching, date intersections and retention of public document/content restrictions.
- The procurement and Knowledge Centre public endpoints both returned successful empty lists during the audit. This establishes their public result state only, not the absence of draft/internal CMS records.
- No historical figures, proposed activities, institution affiliations or missing dates were imported from the master. In particular, the five-day Tasar reference was not merged with the existing 2026 event.
- Verified official identity, affiliation scope, dates, fees, governance rules, service status and approved source documents remain editorial work. This review does not establish those facts merely because the current website displays them.
