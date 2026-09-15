import { permanentRedirect } from 'next/navigation';
import { buildLegacyRedirectUrl, type SP } from '@/lib/legacy-redirects';

/**
 * Retired standalone listing — consolidated onto `/publications?knowledge_category=
 * acts-and-rules&document_type=form#listing`. The old route's `forms-and-formats` knowledge
 * category is retired in the CMS taxonomy (see `content-classification.ts` in the CMS repo);
 * `acts-and-rules` (which carries the `form` document type) is the closest active single-
 * category mapping that keeps forms discoverable. See `src/lib/legacy-redirects.ts` for the
 * exact scope, passthrough and page-preservation rules.
 */
export default function FormsFormatsPage({ searchParams }: { searchParams: SP }): never {
  permanentRedirect(buildLegacyRedirectUrl('publications/forms-formats', searchParams));
}
