'use client';

import { useLanguage } from '@/providers/language-provider';
import type { TranslationKey } from '@/i18n/dictionary';

/** Small uppercase eyebrow + large H2, the repeated pattern above every homepage
 *  content section. Resolves both from i18n keys so the section stays bilingual. */
export function EyebrowHeading({ eyebrowKey, titleKey }: { eyebrowKey: TranslationKey; titleKey: TranslationKey }) {
  const { t, language } = useLanguage();
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-accent-action" lang={language}>
        {t(eyebrowKey)}
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold text-heading sm:text-3xl" lang={language}>
        {t(titleKey)}
      </h2>
    </div>
  );
}
