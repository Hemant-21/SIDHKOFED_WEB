import { permanentRedirect } from 'next/navigation';
import { buildLegacyRedirectUrl, type SP } from '@/lib/legacy-redirects';

/**
 * Retired standalone listing - consolidated onto `/publications?knowledge_category=
 * policies-guidelines-and-training-resources&document_type=policy,guideline,acts,bye-laws#listing`. The old route's two source
 * categories are retired in the CMS taxonomy (see `content-classification.ts` in the CMS repo). See
 * `src/lib/legacy-redirects.ts` for the exact scope, passthrough and page-preservation rules.
 */
export default function PoliciesGuidelinesPage({ searchParams }: { searchParams: SP }): never {
  permanentRedirect(buildLegacyRedirectUrl('publications/policies-guidelines-sops', searchParams));
}
