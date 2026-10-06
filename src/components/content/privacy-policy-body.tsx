'use client';

import { useLanguage } from '@/providers/language-provider';

/** Translated body of /privacy-policy - split out so the server page.tsx can keep its `metadata` export. */
export function PrivacyPolicyBody() {
  const { t } = useLanguage();
  return (
    <div className="prose prose-gray max-w-3xl dark:prose-invert">
      <p className="lead">{t('page.privacyPolicy.body.intro')}</p>

      <h2>{t('page.privacyPolicy.body.collect.heading')}</h2>
      <p>{t('page.privacyPolicy.body.collect.text')}</p>

      <h2>{t('page.privacyPolicy.body.use.heading')}</h2>
      <p>{t('page.privacyPolicy.body.use.text')}</p>

      <h2>{t('page.privacyPolicy.body.cookies.heading')}</h2>
      <p>{t('page.privacyPolicy.body.cookies.text')}</p>

      <h2>{t('page.privacyPolicy.body.thirdPartyLinks.heading')}</h2>
      <p>{t('page.privacyPolicy.body.thirdPartyLinks.text')}</p>

      <h2>{t('page.privacyPolicy.body.security.heading')}</h2>
      <p>{t('page.privacyPolicy.body.security.text')}</p>

      <h2>{t('page.privacyPolicy.body.contact.heading')}</h2>
      <p>
        {t('page.privacyPolicy.body.contact.part1')} <a href="tel:06512913142">0651-2913142</a>,{' '}
        {t('page.privacyPolicy.body.contact.part2')} <a href="mailto:sidhokanhofed@gmail.com">sidhokanhofed@gmail.com</a>.
      </p>

      <p className="text-sm text-muted-foreground">{t('page.privacyPolicy.body.lastUpdated')}</p>
    </div>
  );
}
