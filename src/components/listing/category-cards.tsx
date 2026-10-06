'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import type { BilingualText } from './localized-heading';
import type { TranslationKey } from '@/i18n/dictionary';

export interface CategoryCardDef {
  /** Pre-rendered icon element, e.g. `<GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />`.
   *  Must be a rendered element (not a component reference) - this crosses the Server→Client
   *  Component boundary, and only serializable ReactNode, not functions, can cross it. */
  icon: ReactNode;
  /** i18n key for the card title. Ignored when `title` is set; required otherwise. */
  titleKey?: TranslationKey;
  /** i18n key for the card description. Ignored when `description` is set; required otherwise. */
  descriptionKey?: TranslationKey;
  /** Same-page deep link, e.g. `/activities?event_type=training#listing`. */
  href: string;
  /** Bilingual title for API-driven cards (e.g. a master's name_en/name_hi) - overrides `titleKey`. */
  title?: BilingualText;
  /** Bilingual description for API-driven cards - overrides `descriptionKey`. */
  description?: BilingualText;
}

/**
 * "Browse by Category" card grid. Cards are plain same-page links carrying a query param
 * that the listing below already reads (`FilterBar` + `useQueryParams`) - clicking a card is
 * indistinguishable from picking the same value in the filter dropdown, so no separate sync
 * logic is needed; the URL query string is the single source of truth for both.
 *
 * This is the same pattern `/publications` built inline for its own category cards, extracted
 * here (bilingual via i18n keys) so any listing page can reuse the identical markup/interaction
 * instead of a parallel one-off.
 */
/** Pick an `lg:` column count that fits the actual item count without leaving a lone
 *  orphan card stretched across the final row (e.g. 5 cards in a rigid 4-column grid).
 *  Tailwind needs each full class string present in source to generate it - every
 *  candidate is spelled out literally rather than built dynamically. */
function lgColsFor(count: number): string {
  if (count <= 1) return 'lg:grid-cols-1';
  if (count === 2) return 'lg:grid-cols-2';
  if (count === 3) return 'lg:grid-cols-3';
  if (count === 4) return 'lg:grid-cols-4';
  return count % 4 === 1 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
}

export function CategoryCards({ categories }: { categories: CategoryCardDef[] }) {
  const { t, language } = useLanguage();
  return (
    <div className={`mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 ${lgColsFor(categories.length)}`}>
      {categories.map(({ icon, titleKey, descriptionKey, href, title, description }) => (
        <Link
          key={href}
          href={href}
          className="group flex flex-col gap-2 rounded-md border border-border bg-surface p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 transition-colors group-hover:bg-primary/20">
              {icon}
            </div>
            <p className="text-sm font-semibold leading-tight text-foreground">
              {title ? pickText(title.en, title.hi, language) : titleKey ? t(titleKey) : ''}
            </p>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {description ? pickText(description.en, description.hi, language) : descriptionKey ? t(descriptionKey) : ''}
          </p>
        </Link>
      ))}
    </div>
  );
}
