import { permanentRedirect } from 'next/navigation';
import { buildLegacyRedirectUrl, type SP } from '@/lib/legacy-redirects';

/**
 * Retired standalone listing — consolidated onto `/publications?knowledge_category=
 * training-resources#listing` (see `src/lib/legacy-redirects.ts` for the exact scope,
 * passthrough and page-preservation rules for this route). Deliberately whole-category
 * scope — NOT narrowed to `document_type=training-material`.
 */
export default function TrainingMaterialsPage({ searchParams }: { searchParams: SP }): never {
  permanentRedirect(buildLegacyRedirectUrl('publications/training-materials', searchParams));
}
