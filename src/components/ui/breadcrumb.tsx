'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import { Container } from './container';
import type { TranslationKey } from '@/i18n/dictionary';

export interface Crumb {
  /** Literal, already-resolved text (e.g. a page title that doesn't vary by language). */
  label?: string;
  /** Dictionary key, resolved via `t()`. Takes precedence over `label`/`labelEn` when set. */
  labelKey?: TranslationKey;
  /**
   * A CMS record's bilingual title (e.g. `event.title_en`/`event.title_hi`), resolved
   * client-side via `pickText` so the breadcrumb's final crumb follows the language
   * toggle - server components can't call `useLanguage()` themselves, so they pass
   * both fields instead of pre-resolving one. Takes precedence over `label`.
   */
  labelEn?: string;
  labelHi?: string | null;
  href?: string;
}

/**
 * Accessible breadcrumb trail. The last crumb is the current page (aria-current).
 *
 * `variant="hero"` renders the trail unwrapped (no Container/background of its own) in
 * navy-safe colours, for placement at the top of a `bg-hero` page-header band instead of
 * the default standalone bar above it.
 */
export function Breadcrumbs({
  items,
  homeLabel,
  variant = 'default',
}: {
  items: Crumb[];
  /** Overrides the "Home" crumb's literal text; defaults to the `nav.home` dictionary key. */
  homeLabel?: string;
  variant?: 'default' | 'hero';
}) {
  const { t, language } = useLanguage();
  const resolve = (crumb: Crumb) =>
    crumb.labelKey
      ? t(crumb.labelKey)
      : crumb.labelEn !== undefined
        ? pickText(crumb.labelEn, crumb.labelHi, language)
        : (crumb.label ?? '');
  const all: Crumb[] = [{ label: homeLabel ?? t('nav.home'), href: '/' }, ...items];
  const list = (
    <ol
      className={
        variant === 'hero'
          ? 'flex flex-wrap items-center gap-1 text-sm text-hero-muted'
          : 'flex flex-wrap items-center gap-1 text-sm text-muted-foreground'
      }
    >
      {all.map((crumb, i) => {
        const isLast = i === all.length - 1;
        return (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight
                className={variant === 'hero' ? 'h-4 w-4 shrink-0 text-hero-muted/70' : 'h-4 w-4 shrink-0 text-muted-foreground/60'}
                aria-hidden="true"
              />
            )}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className={variant === 'hero' ? 'text-hero-foreground hover:underline' : 'hover:text-link hover:underline'}
              >
                {resolve(crumb)}
              </Link>
            ) : (
              <span
                className={variant === 'hero' ? 'font-medium text-hero-foreground' : 'font-medium text-foreground'}
                aria-current={isLast ? 'page' : undefined}
              >
                {resolve(crumb)}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );

  if (variant === 'hero') {
    return <nav aria-label={t('a11y.breadcrumb')} className="mb-4">{list}</nav>;
  }

  return (
    <nav aria-label={t('a11y.breadcrumb')} className="border-b border-border bg-surface">
      <Container className="py-3">{list}</Container>
    </nav>
  );
}
