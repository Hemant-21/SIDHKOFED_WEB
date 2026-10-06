'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';
import { EyebrowHeading } from './section-header';
import type { TranslationKey } from '@/i18n/dictionary';

const CARDS: { labelKey: TranslationKey; descKey: TranslationKey; href: string }[] = [
  {
    labelKey: 'home.knowledgeHub.reports.label',
    descKey: 'home.knowledgeHub.reports.desc',
    href: '/publications?knowledge_category=research-and-reports#listing',
  },
  {
    labelKey: 'home.knowledgeHub.policies.label',
    descKey: 'home.knowledgeHub.policies.desc',
    href: '/publications?knowledge_category=training-resources&document_type=guideline,manuals#listing',
  },
  {
    labelKey: 'home.knowledgeHub.training.label',
    descKey: 'home.knowledgeHub.training.desc',
    href: '/publications?knowledge_category=training-resources#listing',
  },
  {
    labelKey: 'home.knowledgeHub.forms.label',
    descKey: 'home.knowledgeHub.forms.desc',
    href: '/publications?knowledge_category=acts-and-rules&document_type=form#listing',
  },
];

export function KnowledgeHub() {
  const { t, language } = useLanguage();
  return (
    <>
      <div className="mb-8">
        <EyebrowHeading eyebrowKey="home.eyebrow.knowledgeHub" titleKey="home.heading.knowledgeHub" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-md border border-border bg-surface p-5 transition-colors hover:border-primary"
          >
            <p className="font-semibold text-foreground transition-colors group-hover:text-link" lang={language}>
              {t(item.labelKey)}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground" lang={language}>
              {t(item.descKey)}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
