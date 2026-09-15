import { permanentRedirect } from 'next/navigation';
import { buildLegacyRedirectUrl, type SP } from '@/lib/legacy-redirects';

/**
 * Retired standalone listing — consolidated onto `/activities?event_category=trainings&
 * event_type=training#listing` (see `src/lib/legacy-redirects.ts` for the exact scope,
 * passthrough and page-preservation rules for this route).
 */
export default function TrainingsPage({ searchParams }: { searchParams: SP }): never {
  permanentRedirect(buildLegacyRedirectUrl('activities/trainings', searchParams));
}
