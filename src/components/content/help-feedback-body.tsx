'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';

/** Translated body of /help-feedback - split out so the server page.tsx can keep its `metadata` export. */
export function HelpFeedbackBody() {
  const { t } = useLanguage();
  return (
    <div className="prose prose-gray max-w-3xl dark:prose-invert">
      <h2>{t('page.helpFeedback.body.finding.heading')}</h2>
      <p>
        {t('page.helpFeedback.body.finding.part1')} <Link href="/search">{t('nav.search')}</Link>{' '}
        {t('page.helpFeedback.body.finding.part2')} <Link href="/sitemap">{t('page.sitemap.title')}</Link>{' '}
        {t('page.helpFeedback.body.finding.part3')} <Link href="/faqs">{t('nav.faqsShort')}</Link>{' '}
        {t('page.helpFeedback.body.finding.part4')}
      </p>

      <h2>{t('page.helpFeedback.body.procurement.heading')}</h2>
      <p>
        {t('page.helpFeedback.body.procurement.part1')}{' '}
        <Link href="/procurement/enquiry">{t('page.procurement.enquiry.title')}</Link>{' '}
        {t('page.helpFeedback.body.procurement.part2')}
      </p>

      <h2>{t('page.helpFeedback.body.report.heading')}</h2>
      <p>
        {t('page.helpFeedback.body.report.part1')} <Link href="/contact">{t('nav.contactPage')}</Link>{' '}
        {t('page.helpFeedback.body.report.part2')}
      </p>
    </div>
  );
}
