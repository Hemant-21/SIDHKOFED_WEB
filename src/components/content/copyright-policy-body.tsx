'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';

/** Translated body of /copyright-policy - split out so the server page.tsx can keep its `metadata` export. */
export function CopyrightPolicyBody() {
  const { t } = useLanguage();
  return (
    <div className="prose prose-gray max-w-3xl dark:prose-invert">
      <p className="lead">{t('page.copyrightPolicy.body.intro')}</p>

      <h2>{t('page.copyrightPolicy.body.reuse.heading')}</h2>
      <p>{t('page.copyrightPolicy.body.reuse.text')}</p>

      <h2>{t('page.copyrightPolicy.body.thirdParty.heading')}</h2>
      <p>{t('page.copyrightPolicy.body.thirdParty.text')}</p>

      <h2>{t('page.copyrightPolicy.body.reporting.heading')}</h2>
      <p>
        {t('page.copyrightPolicy.body.reporting.part1')} <Link href="/contact">{t('nav.contactPage')}</Link>{' '}
        {t('page.copyrightPolicy.body.reporting.part2')}
      </p>
    </div>
  );
}
