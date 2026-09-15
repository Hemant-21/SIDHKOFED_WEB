import { permanentRedirect } from 'next/navigation';
import { buildLegacyRedirectUrl, type SP } from '@/lib/legacy-redirects';

/**
 * Retired standalone listing — consolidated onto `/procurement?procurement_update_category=
 * announcements-schedules#listing`, an intentional narrowing from the old all-update-types
 * scope to just Announcements & Schedules. Only the LIST view moves;
 * `/procurement/announcements/[slug]` detail pages are untouched and keep their URLs. See
 * `src/lib/legacy-redirects.ts` for the exact scope, passthrough and page-preservation rules.
 */
export default function AnnouncementsPage({ searchParams }: { searchParams: SP }): never {
  permanentRedirect(buildLegacyRedirectUrl('procurement/announcements', searchParams));
}
