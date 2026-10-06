'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';

export function ContactCta() {
  const { t } = useLanguage();
  return (
    <div className="mt-12 rounded-md border border-primary/20 bg-primary/5 p-8 text-center">
      <h2 className="mb-2 text-xl font-bold text-foreground">{t('about.contactCta.title')}</h2>
      <p className="mb-6 text-sm text-muted-foreground">{t('about.contactCta.body')}</p>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
      >
        {t('about.contactCta.cta')}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
