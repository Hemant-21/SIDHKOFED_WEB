'use client';

/**
 * The /membership page's static (frontend-owned) body - everything except the hero
 * and the live-data member hierarchy, which the server page still renders directly.
 * Pulled into one client component because nearly every paragraph on this page is
 * bilingual via dictionary.ts, and there's no data-fetching to keep server-side here.
 */

import Link from 'next/link';
import { Users, Building2, FileDown, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { SectionHeading } from '@/components/ui/section-heading';
import type { TranslationKey } from '@/i18n/dictionary';

const SHAREHOLDER_BENEFITS: TranslationKey[] = [
  'membership.shareholder.benefit1',
  'membership.shareholder.benefit2',
  'membership.shareholder.benefit3',
  'membership.shareholder.benefit4',
  'membership.shareholder.benefit5',
];

const NON_SHAREHOLDER_BENEFITS: TranslationKey[] = [
  'membership.nonShareholder.benefit1',
  'membership.nonShareholder.benefit2',
  'membership.nonShareholder.benefit3',
  'membership.nonShareholder.benefit4',
  'membership.nonShareholder.benefit5',
];

const PROCESS_STEPS: { step: string; titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
  { step: '01', titleKey: 'membership.process.step1.title', bodyKey: 'membership.process.step1.body' },
  { step: '02', titleKey: 'membership.process.step2.title', bodyKey: 'membership.process.step2.body' },
  { step: '03', titleKey: 'membership.process.step3.title', bodyKey: 'membership.process.step3.body' },
  { step: '04', titleKey: 'membership.process.step4.title', bodyKey: 'membership.process.step4.body' },
  { step: '05', titleKey: 'membership.process.step5.title', bodyKey: 'membership.process.step5.body' },
];

export function MembershipUnderstandingSection() {
  const { t } = useLanguage();
  return (
    <>
      <SectionHeading title={t('membership.understanding.title')} />
      <p className="mb-8 max-w-3xl text-base leading-relaxed text-muted-foreground">
        {t('membership.understanding.body')}
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Primary / Shareholder */}
        <div className="rounded-md border border-primary/20 bg-primary/5 p-6">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div className="mb-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {t('membership.shareholder.badge')}
          </div>
          <h2 className="mb-1 text-lg font-bold text-foreground">{t('membership.shareholder.title')}</h2>
          <p className="mb-4 text-xs text-muted-foreground">{t('membership.shareholder.desc')}</p>
          <ul className="space-y-2 text-sm text-foreground">
            {SHAREHOLDER_BENEFITS.map((key) => (
              <li key={key} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {t(key)}
              </li>
            ))}
          </ul>
        </div>

        {/* Nominal / Non-shareholder */}
        <div className="rounded-md border border-accent/20 bg-accent/5 p-6">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Building2 className="h-5 w-5 text-accent" aria-hidden="true" />
          </div>
          <div className="mb-1 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
            {t('membership.nonShareholder.badge')}
          </div>
          <h2 className="mb-1 text-lg font-bold text-foreground">{t('membership.nonShareholder.title')}</h2>
          <p className="mb-4 text-xs text-muted-foreground">{t('membership.nonShareholder.desc')}</p>
          <ul className="space-y-2 text-sm text-foreground">
            {NON_SHAREHOLDER_BENEFITS.map((key) => (
              <li key={key} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export function MembershipProcessSection() {
  const { t } = useLanguage();
  return (
    <>
      <SectionHeading title={t('membership.process.title')} />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Steps */}
        <div className="space-y-5">
          {PROCESS_STEPS.map(({ step, titleKey, bodyKey }) => (
            <div key={step} className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                {step}
              </div>
              <div>
                <p className="font-semibold text-foreground">{t(titleKey)}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{t(bodyKey)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fee table */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t('membership.feeStructure.label')}
          </p>
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">{t('membership.feeStructure.col.category')}</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">{t('membership.feeStructure.col.admissionFee')}</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">{t('membership.feeStructure.col.shareValue')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-surface">
                  <td className="px-4 py-3 text-foreground">{t('membership.feeStructure.row1.category')}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t('membership.feeStructure.asPerByelaws')}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t('membership.feeStructure.minOneShare')}</td>
                </tr>
                <tr className="bg-surface">
                  <td className="px-4 py-3 text-foreground">{t('membership.feeStructure.row2.category')}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t('membership.feeStructure.asPerByelaws')}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t('membership.feeStructure.asPrescribed')}</td>
                </tr>
                <tr className="bg-surface">
                  <td className="px-4 py-3 text-foreground">{t('membership.feeStructure.row3.category')}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t('membership.feeStructure.asPerByelaws')}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t('membership.feeStructure.notApplicable')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{t('membership.feeStructure.footnote')}</p>
        </div>
      </div>
    </>
  );
}

export function MembershipFormsSection() {
  const { t } = useLanguage();
  return (
    <>
      <SectionHeading title={t('membership.forms.title')} />
      <p className="mb-6 text-sm text-muted-foreground">{t('membership.forms.body')}</p>
      <Link
        href="/publications?knowledge_category=acts-and-rules&document_type=form#listing"
        className="flex w-fit items-center gap-3 rounded-lg border border-border bg-surface px-5 py-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
      >
        <FileDown className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-sm font-semibold text-foreground">{t('membership.forms.browseLink')}</p>
      </Link>
    </>
  );
}

export function MembershipDirectoryIntro() {
  const { t } = useLanguage();
  return (
    <>
      <SectionHeading title={t('membership.directory.title')} />
      <p className="mb-8 text-sm text-muted-foreground">{t('membership.directory.body')}</p>
    </>
  );
}

export function MembershipDirectoryFootnote() {
  const { t } = useLanguage();
  return <p className="mt-6 text-xs text-muted-foreground">{t('membership.directory.footnote')}</p>;
}

export function MembershipCta() {
  const { t } = useLanguage();
  return (
    <div className="rounded-md border border-primary/20 bg-primary/5 p-8 text-center">
      <h2 className="mb-2 text-xl font-bold text-foreground">{t('membership.cta.title')}</h2>
      <p className="mb-6 text-sm text-muted-foreground">{t('membership.cta.body')}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/publications?knowledge_category=acts-and-rules&document_type=form#listing"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          <FileDown className="h-4 w-4" aria-hidden="true" />
          {t('membership.forms.browseLink')}
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
        >
          {t('membership.cta.contactOffice')}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
