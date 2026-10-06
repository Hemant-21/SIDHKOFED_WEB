'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumb';
import { Container } from '@/components/ui/container';
import { useLanguage } from '@/providers/language-provider';

/**
 * Translated /about hero - kept as its own component (rather than `LocalizedHero`)
 * because of the registration badge sitting beside the title, and the Hindi org-name
 * line that's always shown alongside the English one rather than swapped by the
 * language toggle.
 */
export function AboutHero() {
  const { t } = useLanguage();
  return (
    <div className="bg-hero">
      <Container className="py-10 sm:py-14">
        <Breadcrumbs items={[{ labelKey: 'page.about.title' }]} variant="hero" />
        <div className="mb-6 flex flex-wrap items-start gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-hero-foreground sm:text-4xl">
              {t('page.about.title')}
            </h1>
            <p className="mt-2 text-base font-medium text-hero-muted" lang="en">
              Sidho-Kanho Agriculture and Forest Produce State Cooperative Federation Ltd.
            </p>
            <p className="mt-1 text-base text-hero-muted" lang="hi">
              सिद्धो-कान्हो कृषि एवं वनोपज राज्य सहकारी संघ लि०
            </p>
          </div>
          <span className="mt-1 shrink-0 rounded-full border border-hero-foreground/25 bg-hero-foreground/10 px-3 py-0.5 text-xs font-medium text-hero-muted">
            {t('about.registrationLabel', { number: '02/H.Q./2021' })}
          </span>
        </div>
      </Container>
    </div>
  );
}
