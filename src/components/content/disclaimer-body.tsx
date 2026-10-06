'use client';

import { useLanguage } from '@/providers/language-provider';

/** Translated body of /disclaimer - split out so the server page.tsx can keep its `metadata` export. */
export function DisclaimerBody() {
  const { t } = useLanguage();
  return (
    <div className="prose prose-gray max-w-3xl dark:prose-invert">
      <p className="lead">{t('page.disclaimer.body.intro')}</p>

      <h2>{t('page.disclaimer.body.accuracy.heading')}</h2>
      <p>{t('page.disclaimer.body.accuracy.text')}</p>

      <h2>{t('page.disclaimer.body.noLiability.heading')}</h2>
      <p>{t('page.disclaimer.body.noLiability.text')}</p>

      <h2>{t('page.disclaimer.body.externalLinks.heading')}</h2>
      <p>{t('page.disclaimer.body.externalLinks.text')}</p>

      <h2>{t('page.disclaimer.body.officialComms.heading')}</h2>
      <p>{t('page.disclaimer.body.officialComms.text')}</p>

      <h2>{t('page.disclaimer.body.governingLaw.heading')}</h2>
      <p>{t('page.disclaimer.body.governingLaw.text')}</p>

      <p className="text-sm text-muted-foreground">{t('page.disclaimer.body.lastUpdated')}</p>
    </div>
  );
}
