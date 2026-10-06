'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';

/** Translated body of /terms-of-use - split out so the server page.tsx can keep its `metadata` export. */
export function TermsOfUseBody() {
  const { t } = useLanguage();
  return (
    <div className="prose prose-gray max-w-3xl dark:prose-invert">
      <p className="lead">{t('page.termsOfUse.body.intro')}</p>

      <h2>{t('page.termsOfUse.body.permitted.heading')}</h2>
      <p>{t('page.termsOfUse.body.permitted.text')}</p>

      <h2>{t('page.termsOfUse.body.noWarranty.heading')}</h2>
      <p>
        {t('page.termsOfUse.body.noWarranty.part1')} <Link href="/disclaimer">{t('page.disclaimer.title')}</Link>{' '}
        {t('page.termsOfUse.body.noWarranty.part2')}
      </p>

      <h2>{t('page.termsOfUse.body.ip.heading')}</h2>
      <p>
        {t('page.termsOfUse.body.ip.part1')} <Link href="/copyright-policy">{t('page.copyrightPolicy.title')}</Link>{' '}
        {t('page.termsOfUse.body.ip.part2')}
      </p>

      <h2>{t('page.termsOfUse.body.changes.heading')}</h2>
      <p>{t('page.termsOfUse.body.changes.text')}</p>

      <h2>{t('page.termsOfUse.body.governingLaw.heading')}</h2>
      <p>{t('page.termsOfUse.body.governingLaw.text')}</p>
    </div>
  );
}
