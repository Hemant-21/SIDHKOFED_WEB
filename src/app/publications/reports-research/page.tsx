import { permanentRedirect } from 'next/navigation';
import { buildLegacyRedirectUrl, type SP } from '@/lib/legacy-redirects';

/**
 * Retired standalone listing — consolidated onto `/publications?knowledge_category=
 * research-and-reports#listing` (see `src/lib/legacy-redirects.ts` for the exact scope,
 * passthrough and page-preservation rules for this route).
 */
export default function ReportsResearchPage({ searchParams }: { searchParams: SP }): never {
  permanentRedirect(buildLegacyRedirectUrl('publications/reports-research', searchParams));
}
