import { permanentRedirect } from 'next/navigation';
import { buildLegacyRedirectUrl, type SP } from '@/lib/legacy-redirects';

/**
 * Retired standalone listing — consolidated onto `/procurement?upcoming=true#listing` (see
 * `src/lib/legacy-redirects.ts` for the exact scope, passthrough and page-preservation rules for
 * this route).
 */
export default function UpcomingProcurementPage({ searchParams }: { searchParams: SP }): never {
  permanentRedirect(buildLegacyRedirectUrl('procurement/upcoming', searchParams));
}
