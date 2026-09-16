import { permanentRedirect } from 'next/navigation';
import { buildLegacyRedirectUrl, type SP } from '@/lib/legacy-redirects';

/**
 * Retired standalone listing — this unfiltered, unsectioned Documents listing duplicated
 * `/publications` and `/notifications` combined (both list the same underlying Document entity,
 * split by `document_section`). Consolidated onto `/publications#listing` (see
 * `src/lib/legacy-redirects.ts` for the exact scope, passthrough and page-preservation rules for
 * this route). Document DETAIL pages (`/documents/[slug]`) are untouched — every document card
 * across the site still links there.
 */
export default function DocumentsPage({ searchParams }: { searchParams: SP }): never {
  permanentRedirect(buildLegacyRedirectUrl('documents', searchParams));
}
