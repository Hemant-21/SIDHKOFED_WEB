import { permanentRedirect } from 'next/navigation';
import { buildLegacyRedirectUrl, type SP } from '@/lib/legacy-redirects';

/**
 * Retired standalone listing — consolidated onto `/publications?knowledge_category=
 * training-resources&document_type=guideline,manuals#listing`. The old route's two source
 * knowledge categories (`policies-and-guidelines`, `sops-and-manuals`) are retired in the CMS
 * taxonomy (see `content-classification.ts` in the CMS repo); `training-resources` is the
 * closest active category, refined to just the Guideline/Manuals document types. See
 * `src/lib/legacy-redirects.ts` for the exact scope, passthrough and page-preservation rules.
 */
export default function PoliciesGuidelinesPage({ searchParams }: { searchParams: SP }): never {
  permanentRedirect(buildLegacyRedirectUrl('publications/policies-guidelines-sops', searchParams));
}
