import 'server-only';

/**
 * Server-side helpers for listing pages: searchParam coercion, master-driven
 * filter options, and a year range. Filter values use slugs (the API accepts
 * comma-separated UUIDs/slugs) for readable, stable URLs.
 */

import { getListSafe } from './api/server';
import { PUBLIC_ENDPOINTS } from './api/endpoints';
import type { MasterRef } from './types/api';
import type { FilterOption } from '@/components/listing/filter-bar';

export const PAGE_SIZE = 12;

/** Coerce a searchParam to a 1-based page number (defaults to 1). */
export function toPage(v: string | string[] | undefined): number {
  const raw = Array.isArray(v) ? v[0] : v;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

/** Coerce a searchParam to a single trimmed string, or undefined when empty. */
export function qstr(v: string | string[] | undefined): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.trim().length > 0 ? s.trim() : undefined;
}

/**
 * Fetch an active public master list as filter options (value = slug).
 * `category` scopes `event-types` to a single `event-categories` slug (`?event_category=`).
 * `knowledgeCategory`/`communicationType` similarly scope `document-types` to a single
 * `knowledge-categories`/`communication-types` slug (`?knowledge_category=`/`?communication_type=`).
 * `procurementCategory` scopes `procurement-update-types` to a single
 * `procurement-update-categories` slug (`?procurement_update_category=`). At most one of these
 * should be passed per call.
 */
export async function getMasterOptions(
  key: string,
  opts: { category?: string; knowledgeCategory?: string; communicationType?: string; procurementCategory?: string } = {},
): Promise<FilterOption[]> {
  const { items } = await getListSafe<MasterRef>(`${PUBLIC_ENDPOINTS.masters}/${key}`, {
    query: {
      page_size: 100,
      ...(opts.category ? { event_category: opts.category } : {}),
      ...(opts.knowledgeCategory ? { knowledge_category: opts.knowledgeCategory } : {}),
      ...(opts.communicationType ? { communication_type: opts.communicationType } : {}),
      ...(opts.procurementCategory ? { procurement_update_category: opts.procurementCategory } : {}),
    },
    revalidate: 3600,
  });
  return items.map((m) => ({ value: m.slug, name_en: m.name_en, name_hi: m.name_hi }));
}

/** A descending range of recent years as filter options. */
export function yearOptions(back = 6): FilterOption[] {
  const current = new Date().getFullYear();
  return Array.from({ length: back }, (_, i) => String(current - i)).map((v) => ({ value: v, name_en: v }));
}

/**
 * Known status/enum values mapped to their Hindi label, mirroring the `badge.status.*`
 * dictionary entries so a filter dropdown's wording matches the badge shown on each card.
 * This runs server-side (no access to the client's language), so Hindi has to be a static
 * lookup rather than a `t()` call - unrecognised values just get an English-only option.
 */
const ENUM_LABEL_HI: Record<string, string> = {
  scheduled: 'निर्धारित',
  upcoming: 'आगामी',
  ongoing: 'चालू',
  completed: 'पूर्ण',
  postponed: 'स्थगित',
  cancelled: 'रद्द',
  open: 'खुला',
  closed: 'बंद',
  awarded: 'प्रदत्त',
  active: 'सक्रिय',
  upcoming_period: 'आगामी अवधि',
};

/** Map fixed enum values to filter options, with Hindi labels for known values (see `ENUM_LABEL_HI`). */
export function enumOptions(values: string[]): FilterOption[] {
  return values.map((v) => ({
    value: v,
    name_en: v.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    name_hi: ENUM_LABEL_HI[v],
  }));
}
