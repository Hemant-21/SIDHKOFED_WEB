'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';

/** Translated body of /hyperlinking-policy - split out so the server page.tsx can keep its `metadata` export. */
export function HyperlinkingPolicyBody() {
  const { t } = useLanguage();
  return (
    <div className="prose prose-gray max-w-3xl dark:prose-invert">
      <h2>{t('page.hyperlinkingPolicy.body.toOthers.heading')}</h2>
      <p>
        {t('page.hyperlinkingPolicy.body.toOthers.part1')} <Link href="/disclaimer">{t('page.disclaimer.title')}</Link>.
      </p>

      <h2>{t('page.hyperlinkingPolicy.body.fromOthers.heading')}</h2>
      <p>{t('page.hyperlinkingPolicy.body.fromOthers.text')}</p>

      <h2>{t('page.hyperlinkingPolicy.body.requesting.heading')}</h2>
      <p>
        {t('page.hyperlinkingPolicy.body.requesting.part1')} <Link href="/contact">{t('nav.contactPage')}</Link>{' '}
        {t('page.hyperlinkingPolicy.body.requesting.part2')}
      </p>
    </div>
  );
}
