'use client';

/**
 * Bilingual "selected category" heading + filter hint, shared by the four
 * category-card listing pages (/activities, /notifications, /procurement,
 * /publications). Each page passes the currently selected master option (its
 * `name_en`/`name_hi`, resolved server-side) plus the dictionary keys for its
 * "all items" heading and its two hint sentences; this client leaf picks the
 * right language for both the CMS-owned category name and the dictionary-owned
 * surrounding copy.
 */

import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import type { TranslationKey } from '@/i18n/dictionary';

interface SelectedCategoryOption {
  name_en: string;
  name_hi?: string | null;
}

/** The "Browse by Category" heading above a `CategoryCards` grid - same dictionary
 *  key, slightly different type scale per page's existing layout. */
export function CategoryBrowseHeading({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  return (
    <h2
      className={
        compact
          ? 'font-display text-lg font-bold tracking-tight text-heading sm:text-xl'
          : 'font-display text-xl font-bold tracking-tight text-heading sm:text-2xl'
      }
    >
      <span className="border-l-4 border-primary pl-3">{t('common.browseByCategory')}</span>
    </h2>
  );
}

export function CategoryListingHeader({
  selected,
  allLabelKey,
  filterHintKey,
  browseHintKey,
  forced,
}: {
  selected: SelectedCategoryOption | undefined;
  allLabelKey: TranslationKey;
  filterHintKey: TranslationKey;
  browseHintKey: TranslationKey;
  /** Overrides the selected/all-items logic entirely - e.g. notifications' fixed
   *  "Tenders" view, which isn't a master-driven category. */
  forced?: { titleKey: TranslationKey; hintKey: TranslationKey };
}) {
  const { t, language } = useLanguage();
  if (forced) {
    return (
      <header className="mb-6">
        <h2 className="text-xl font-bold text-foreground">{t(forced.titleKey)}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t(forced.hintKey)}</p>
      </header>
    );
  }
  const categoryLabel = selected ? pickText(selected.name_en, selected.name_hi, language) : null;
  return (
    <header className="mb-6">
      <h2 className="text-xl font-bold text-foreground">{categoryLabel ?? t(allLabelKey)}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {categoryLabel ? t(filterHintKey, { category: categoryLabel.toLowerCase() }) : t(browseHintKey)}
      </p>
    </header>
  );
}
