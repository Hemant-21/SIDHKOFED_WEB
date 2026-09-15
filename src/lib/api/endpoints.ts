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

  // Operational Reports — live-calculated replacement for the retired
  // `/public/dashboard*` (DashboardReport/DashboardMetric) routes. Returns the six
  // operational reports restricted to public-eligible measures, current financial
  // year, no filters. Use `detailPath(operationalReports, key)` for the single-report
  // variant (`GET /public/operational-reports/:key`).
  operationalReports: '/public/operational-reports',

  // Website Metrics (Stage 6) — curated public figures per placement, distinct from
  // the Dashboard module above (different backend source: Website Metric snapshots).
  websiteMetrics: (placement: string) => `/public/website-metrics?placement=${placement}`,

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
