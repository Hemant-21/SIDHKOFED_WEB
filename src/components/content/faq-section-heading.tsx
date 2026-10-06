'use client';

import { useLanguage } from '@/providers/language-provider';
import { SectionHeading } from '@/components/ui/section-heading';
import type { TranslationKey } from '@/i18n/dictionary';

/**
 * Client-side title/view-all resolver for `PageFaqSection` (a Server Component that
 * can't call `useLanguage()` itself because it awaits data). Mirrors the
 * `LocalizedHeading`/`HomeSection` pattern used elsewhere for the same reason.
 */
export function FaqSectionHeading({
  titleKey,
  viewAllHref,
  viewAllLabelKey,
}: {
  titleKey: TranslationKey;
  viewAllHref?: string;
  viewAllLabelKey: TranslationKey;
}) {
  const { t } = useLanguage();
  return <SectionHeading title={t(titleKey)} viewAllHref={viewAllHref} viewAllLabel={t(viewAllLabelKey)} />;
}
