import { permanentRedirect } from 'next/navigation';
import { buildLegacyRedirectUrl, type SP } from '@/lib/legacy-redirects';

/**
 * Retired standalone listing - consolidated onto `/publications?knowledge_category=
 * policies-guidelines-and-training-resources&document_type=training-material#listing` (see `src/lib/legacy-redirects.ts` for the exact scope,
 * passthrough and page-preservation rules for this route).
 */
export default function TrainingMaterialsPage({ searchParams }: { searchParams: SP }): never {
  permanentRedirect(buildLegacyRedirectUrl('publications/training-materials', searchParams));
}
