import { permanentRedirect } from 'next/navigation';
import { buildLegacyRedirectUrl, type SP } from '@/lib/legacy-redirects';

/**
 * Retired standalone listing - consolidated onto `/publications?knowledge_category=
 * forms-and-formats#listing` (the `forms-and-formats` category in the CMS taxonomy, see
 * `content-classification.ts` in the CMS repo). See `src/lib/legacy-redirects.ts` for the
 * exact scope, passthrough and page-preservation rules.
 */
export default function FormsFormatsPage({ searchParams }: { searchParams: SP }): never {
  permanentRedirect(buildLegacyRedirectUrl('publications/forms-formats', searchParams));
}
