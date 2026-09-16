import { permanentRedirect } from 'next/navigation';
import { buildLegacyRedirectUrl, type SP } from '@/lib/legacy-redirects';

/**
 * Retired standalone listing — redundant with Activities' own Trainings category (same
 * event_type=training data). Consolidated onto `/activities?event_category=trainings&
 * event_type=training#listing` (see `src/lib/legacy-redirects.ts` for the exact scope,
 * passthrough and page-preservation rules for this route).
 */
export default function TrainingBeneficiariesPage({ searchParams }: { searchParams: SP }): never {
  permanentRedirect(buildLegacyRedirectUrl('impact/training-beneficiaries', searchParams));
}
