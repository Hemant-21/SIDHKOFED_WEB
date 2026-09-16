import { permanentRedirect } from 'next/navigation';
import { buildLegacyRedirectUrl, type SP } from '@/lib/legacy-redirects';

/**
 * Retired standalone listing — consolidated onto `/activities?event_category=
 * institutional-activities#listing` (see `src/lib/legacy-redirects.ts` for the exact scope,
 * passthrough and page-preservation rules for this route).
 */
export default function InstitutionalEventsPage({ searchParams }: { searchParams: SP }): never {
  permanentRedirect(buildLegacyRedirectUrl('activities/institutional-events', searchParams));
}
