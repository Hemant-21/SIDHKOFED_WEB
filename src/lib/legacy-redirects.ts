/**
 * Centralized mapping for the legacy standalone listing routes being consolidated onto the
 * four hub listing pages (Activities/Publications/Notifications/Procurement). Each old
 * `page.tsx` under these paths is now a thin `permanentRedirect()` built from this table —
 * see the seven route files under `src/app/**\/page.tsx` that import `buildLegacyRedirectUrl`.
 *
 * Per-route behaviour:
 * - `fixedParams` is the route's scope. It ALWAYS wins: any incoming query value for the same
 *   key (e.g. `?event_category=workshops` on the trainings route) is discarded, not merged.
 * - `passthroughKeys` is an allow-list of incoming params forwarded unchanged onto the
 *   destination (using the same param name — none of these seven routes need name remapping,
 *   since the destination hub pages already accept identical query keys). Anything not
 *   allow-listed is dropped, so an unrelated view-switch param (e.g. `?category=tenders`) never
 *   leaks through.
 * - `preservePage` is true only when the destination's scope AND ordering are equivalent to the
 *   legacy route's own (documented per-entry below); otherwise `page` is dropped so a preserved
 *   page number can't point at the wrong content under a different scope/order.
 * - The redirect target always lands on the destination's `#listing` in-page section, since the
 *   old route *was* a dedicated listing page — this matches how the hub pages' own category
 *   cards link to `#listing`.
 */
export type SP = Record<string, string | string[] | undefined>;

export interface LegacyRedirectSpec {
  /** Destination hub path (no query/hash). */
  path: string;
  /** Scope params that always win over any conflicting incoming value. */
  fixedParams: Record<string, string>;
  /** Incoming param keys forwarded through unchanged. */
  passthroughKeys: string[];
  /** Whether the incoming `page` value is safe to carry over. */
  preservePage: boolean;
}

export const LEGACY_REDIRECTS = {
  'activities/trainings': {
    path: '/activities',
    fixedParams: { event_category: 'trainings', event_type: 'training' },
    passthroughKeys: ['search', 'event_status', 'district', 'year'],
    // Same scope (event_type=training, identical to the old route's fixed type) and same
    // ordering (-start_date) as before — page numbers still line up.
    preservePage: true,
  },
  'publications/reports-research': {
    path: '/publications',
    fixedParams: { knowledge_category: 'research-and-reports' },
    passthroughKeys: ['search', 'year'],
    // Same category (whole category, no type narrowing) and same ordering (-publication_date).
    preservePage: true,
  },
  'publications/training-materials': {
    path: '/publications',
    fixedParams: { knowledge_category: 'training-resources' },
    passthroughKeys: ['search', 'year'],
    // Same category (whole category — deliberately NOT narrowed to document_type=training-material)
    // and same ordering (-publication_date).
    preservePage: true,
  },
  'publications/policies-guidelines-sops': {
    path: '/publications',
    fixedParams: { knowledge_category: 'training-resources', document_type: 'guideline,manuals' },
    passthroughKeys: ['search', 'year'],
    // Relabelled from two now-retired knowledge categories (policies-and-guidelines,
    // sops-and-manuals) onto one active category + type filter — scope isn't equivalent, so old
    // page numbers don't line up with the new result set.
    preservePage: false,
  },
  'publications/forms-formats': {
    path: '/publications',
    fixedParams: { knowledge_category: 'acts-and-rules', document_type: 'form' },
    passthroughKeys: ['search', 'year'],
    // Ordering changes from the old route's display_order to the destination's -publication_date
    // (a deliberate consolidation onto Publications' native ordering, not silently replicated) —
    // page numbers don't line up under the new order.
    preservePage: false,
  },
  'notifications/notices': {
    path: '/notifications',
    fixedParams: { communication_type: 'notice' },
    passthroughKeys: ['search', 'year'],
    // Data source changes from OfficialCommunication (-issue_date) to Documents
    // (-publication_date) — different scope and ordering, so page numbers don't line up.
    preservePage: false,
  },
  'procurement/announcements': {
    path: '/procurement',
    fixedParams: { procurement_update_category: 'announcements-schedules' },
    passthroughKeys: ['search', 'procurement_update_type', 'commodity', 'district', 'year'],
    // Intentional narrowing from all procurement update types to just Announcements &
    // Schedules, and ordering changes from -effective_date to the destination's native ordering
    // (published_at desc) — page numbers don't line up under the new scope/order.
    preservePage: false,
  },
} as const satisfies Record<string, LegacyRedirectSpec>;

export type LegacyRedirectKey = keyof typeof LEGACY_REDIRECTS;

/** Take the first value of a repeated query key, discarding the rest. Same explicit
 *  take-first convention as `qstr()` in `src/lib/listing.ts` — Next's `searchParams` already
 *  collapses a repeated key (`?x=1&x=2`) into a `string[]`, and we deliberately keep only the
 *  first value rather than merging, so behaviour is documented instead of an accidental
 *  first-wins default. */
function first(v: string | string[] | undefined): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.trim().length > 0 ? s.trim() : undefined;
}

/** Build the destination path + query string + `#listing` fragment for a legacy route
 *  redirect. See module doc for the fixed-scope / passthrough / page-preservation rules. */
export function buildLegacyRedirectUrl(key: LegacyRedirectKey, searchParams: SP): string {
  const spec = LEGACY_REDIRECTS[key];
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(spec.fixedParams)) qs.set(k, v);
  for (const passKey of spec.passthroughKeys) {
    const value = first(searchParams[passKey]);
    if (value) qs.set(passKey, value);
  }
  if (spec.preservePage) {
    const page = first(searchParams.page);
    if (page && page !== '1') qs.set('page', page);
  }
  const query = qs.toString();
  return `${spec.path}${query ? `?${query}` : ''}#listing`;
}
