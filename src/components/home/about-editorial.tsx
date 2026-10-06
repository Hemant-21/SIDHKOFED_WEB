'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { EyebrowHeading } from './section-header';

/** Homepage "About" teaser - eyebrow/heading on the left, copy + CTA on the right. */
export function AboutEditorial() {
  const { t, language } = useLanguage();
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
      <EyebrowHeading eyebrowKey="home.eyebrow.institutionalIdentity" titleKey="home.heading.institutionalIdentity" />
      <div>
        <p className="text-base leading-relaxed text-foreground" lang={language}>
          {t('home.about.paragraph1')}
        </p>
        <p className="mt-3 text-base leading-relaxed text-foreground" lang={language}>
          {t('home.about.paragraph2')}
        </p>
        <Link
          href="/about"
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-link hover:underline"
        >
          {t('home.about.cta')}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
