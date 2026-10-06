'use client';

/**
 * Client heading/paragraph that resolve i18n keys so listing chrome is bilingual.
 * The server pre-renders these in the default language (good for SEO crawlers);
 * the language toggle re-renders them client-side without a network round-trip.
 */

import Link from 'next/link';
import { SectionHeading } from '@/components/ui/section-heading';
import { Container } from '@/components/ui/container';
import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumb';
import { buttonClasses } from '@/components/ui/button';
import { useLanguage } from '@/providers/language-provider';
import type { TranslationKey } from '@/i18n/dictionary';

/** A bilingual `en`/`hi` pair, e.g. from a master record's `name_en`/`name_hi` (used by `CategoryCards`). */
export interface BilingualText {
  en: string;
  hi?: string | null;
}

/**
 * Bilingual page-header "hero" band - a solid navy (`bg-hero`) strip with a large title +
 * subtitle. Mirrors the `/publications` page header exactly (same markup/classes), just
 * resolving text from i18n keys instead of hardcoded English so pages with existing bilingual
 * copy (like `/activities`) don't lose Hindi support to match the visual style.
 */
export function LocalizedHero({
  titleKey,
  subtitleKey,
  compact,
  breadcrumb,
  cta,
  children,
}: {
  titleKey: TranslationKey;
  subtitleKey?: TranslationKey;
  /** Tighter padding for pages with content-dense sections below (e.g. category cards + filters). */
  compact?: boolean;
  /** Breadcrumb trail rendered at the top of the band, in hero-safe colours. */
  breadcrumb?: Crumb[];
  /**
   * The one terracotta action for this screen (e.g. the Procurement page's "Submit Enquiry").
   * Only one page may set this - terracotta is reserved for a single key action per screen.
   */
  cta?: { labelKey: TranslationKey; href: string };
  /** Extra content rendered after the subtitle/cta (e.g. the Media Gallery count pills). */
  children?: React.ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <div className="bg-hero">
      <Container className={compact ? 'py-6 sm:py-8' : 'py-10 sm:py-14'}>
        {breadcrumb ? <Breadcrumbs items={breadcrumb} variant="hero" /> : null}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-hero-foreground sm:text-4xl">
          {t(titleKey)}
        </h1>
        {subtitleKey ? <p className="mt-2 max-w-2xl text-base text-hero-muted">{t(subtitleKey)}</p> : null}
        {cta ? (
          <Link href={cta.href} className={buttonClasses('accent', 'md', 'mt-5')}>
            {t(cta.labelKey)}
          </Link>
        ) : null}
        {children}
      </Container>
    </div>
  );
}

export function LocalizedHeading({
  titleKey,
  as = 'h1',
}: {
  titleKey: TranslationKey;
  as?: 'h1' | 'h2' | 'h3';
}) {
  const { t } = useLanguage();
  return <SectionHeading title={t(titleKey)} as={as} />;
}

/** `SectionHeading`, resolving both the title and the optional "view all" link from
 *  dictionary keys - for server-component call sites that can't call `t()` themselves. */
export function LocalizedSectionHeading({
  titleKey,
  viewAllHref,
  viewAllLabelKey = 'common.viewAll',
}: {
  titleKey: TranslationKey;
  viewAllHref?: string;
  viewAllLabelKey?: TranslationKey;
}) {
  const { t } = useLanguage();
  return <SectionHeading title={t(titleKey)} viewAllHref={viewAllHref} viewAllLabel={t(viewAllLabelKey)} />;
}

export function LocalizedText({ textKey, className }: { textKey: TranslationKey; className?: string }) {
  const { t } = useLanguage();
  const value = t(textKey);
  if (!value) return null;
  return <p className={className}>{value}</p>;
}

/** Like `LocalizedText`, but a `<span>` - for use inside an existing block element
 *  (e.g. a `<p>` wrapper that also carries the eyebrow styling). */
export function LocalizedTextInline({ textKey, className }: { textKey: TranslationKey; className?: string }) {
  const { t } = useLanguage();
  const value = t(textKey);
  if (!value) return null;
  return <span className={className}>{value}</span>;
}
