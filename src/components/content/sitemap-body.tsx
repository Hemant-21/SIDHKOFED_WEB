'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import { PRIMARY_NAV, FOOTER_NAV } from '@/config/navigation';
import type { TranslationKey } from '@/i18n/dictionary';

/** Policy pages aren't in PRIMARY_NAV/FOOTER_NAV, so their labels come from the page
 *  dictionary keys (each page's own `.title`, already defined for its hero/breadcrumb). */
const GIGW_LINKS: { key: string; titleKey: TranslationKey; href: string }[] = [
  { key: 'accessibility', titleKey: 'page.accessibilityStatement.title', href: '/accessibility-statement' },
  { key: 'terms', titleKey: 'page.termsOfUse.title', href: '/terms-of-use' },
  { key: 'copyright', titleKey: 'page.copyrightPolicy.title', href: '/copyright-policy' },
  { key: 'hyperlinking', titleKey: 'page.hyperlinkingPolicy.title', href: '/hyperlinking-policy' },
  { key: 'help', titleKey: 'page.helpFeedback.title', href: '/help-feedback' },
  { key: 'privacy', titleKey: 'page.privacyPolicy.title', href: '/privacy-policy' },
  { key: 'disclaimer', titleKey: 'page.disclaimer.title', href: '/disclaimer' },
];

function LinkColumn({ heading, items }: { heading: string; items: { key: string; label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{heading}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.key}>
            <Link href={item.href} className="text-link hover:underline">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Translated body of /sitemap - split out so the server page.tsx can keep its `metadata` export. */
export function SitemapBody() {
  const { t, language } = useLanguage();
  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
      <LinkColumn
        heading={t('page.sitemap.section.mainNav')}
        items={PRIMARY_NAV.map((item) => ({
          key: item.key,
          label: pickText(item.labelEn, item.labelHi, language),
          href: item.href,
        }))}
      />
      <LinkColumn
        heading={t('page.sitemap.section.about')}
        items={FOOTER_NAV.about.map((item) => ({
          key: item.key,
          label: pickText(item.labelEn, item.labelHi, language),
          href: item.href,
        }))}
      />
      <LinkColumn
        heading={t('page.sitemap.section.resources')}
        items={FOOTER_NAV.resources.map((item) => ({
          key: item.key,
          label: pickText(item.labelEn, item.labelHi, language),
          href: item.href,
        }))}
      />
      <LinkColumn
        heading={t('page.sitemap.section.policies')}
        items={GIGW_LINKS.map((item) => ({ key: item.key, label: t(item.titleKey), href: item.href }))}
      />
    </div>
  );
}
