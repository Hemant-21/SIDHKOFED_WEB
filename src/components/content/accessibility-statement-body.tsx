'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';

/** Translated body of /accessibility-statement - split out so the server page.tsx can keep its `metadata` export. */
export function AccessibilityStatementBody() {
  const { t } = useLanguage();
  return (
    <div className="prose prose-gray max-w-3xl dark:prose-invert">
      <p className="lead">{t('page.accessibilityStatement.body.intro')}</p>

      <h2>{t('page.accessibilityStatement.body.aim.heading')}</h2>
      <ul>
        <li>{t('page.accessibilityStatement.body.aim.item1')}</li>
        <li>{t('page.accessibilityStatement.body.aim.item2')}</li>
        <li>{t('page.accessibilityStatement.body.aim.item3')}</li>
        <li>{t('page.accessibilityStatement.body.aim.item4')}</li>
      </ul>

      <h2>{t('page.accessibilityStatement.body.limitations.heading')}</h2>
      <p>{t('page.accessibilityStatement.body.limitations.text')}</p>

      <h2>{t('page.accessibilityStatement.body.reporting.heading')}</h2>
      <p>
        {t('page.accessibilityStatement.body.reporting.part1')}{' '}
        <Link href="/help-feedback">{t('page.helpFeedback.title')}</Link>{' '}
        {t('page.accessibilityStatement.body.reporting.part2')} <Link href="/contact">{t('nav.contactPage')}</Link>{' '}
        {t('page.accessibilityStatement.body.reporting.part3')}
      </p>
    </div>
  );
}
