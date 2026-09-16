/**
 * Public endpoint map — the single source of truth for the public API surface the
 * website consumes. These are exactly the routes mounted by the backend under
 * `/api/v1/public/*` (see backend `src/routes/index.ts`). The website never calls
 * an admin or auth endpoint.
 */

export const PUBLIC_ENDPOINTS = {
  homePartners: '/public/home/partners',

  // Content listings + details ({slug})
  events: '/public/events',
  news: '/public/news',
  programmes: '/public/programmes',
  documents: '/public/documents',
  knowledgeCentre: '/public/knowledge-centre',
  toolkits: '/public/toolkits',
  institutions: '/public/institutions',
  communications: '/public/official-communications',
  tenders: '/public/tenders',
  procurement: '/public/procurement-updates',
  memberships: '/public/memberships',
  galleries: '/public/galleries',
  videos: '/public/videos',
  faqs: '/public/faqs',
  digitalServices: '/public/digital-services',
  leadership: '/public/leadership',

  // Reports (replaces the Operational Reports / Website Metrics public dashboard above) — reads
  // only from immutable, approved FY `ReportPublication` snapshots, never a live query.
  //   reportYears        — every FY with isPublished/isCurrentFinancialYear/publishedAt.
  //   reportsForYear(l)  — the approved Programme/District/Commodity bundle for FY label `l`.
  reportYears: '/public/reports/years',
  reportsForYear: (label: string) => `/public/reports/${encodeURIComponent(label)}`,

  // Masters (for filter dropdowns)
  masters: '/public/masters', // /{key}

  // Search
  search: '/public/search',

  // Public enquiry submission (POST only — no public list; API spec §6 Enquiries).
  enquiries: '/public/enquiries',

  // Curated public settings groups (settings.public.controller.ts allow-list).
  settings: '/public/settings', // /{group}
} as const;

/** Build `/public/<resource>/<slug>` */
export function detailPath(base: string, slug: string): string {
  return `${base}/${encodeURIComponent(slug)}`;
}

/** Build `/public/settings/<group>` (e.g. `contact`). */
export function publicSettingsPath(group: string): string {
  return `${PUBLIC_ENDPOINTS.settings}/${encodeURIComponent(group)}`;
}
