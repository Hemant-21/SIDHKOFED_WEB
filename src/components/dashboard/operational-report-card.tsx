'use client';

/**
 * Renders one Operational Report's public-eligible measures (`GET
 * /public/operational-reports[/:key]`) — the live-calculated replacement for the
 * retired Dashboard Reports (`DashboardReport`/`DashboardMetric`) concept. The
 * backend is the source of truth for every figure; this component only renders
 * label/value/unit/note + the resolved period, never calculates.
 *
 * A report with no public-eligible measures renders nothing (never a crash / empty
 * shell) — this can't happen with the current registry (every one of the six
 * reports has at least one `publicEligible` measure) but is degraded gracefully
 * regardless, since that's a data-registry fact this component must not assume.
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Language } from '@/i18n/dictionary';
import type { PublicOperationalReport, PublicOperationalMeasure } from '@/lib/types/content';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import { formatDateRange, formatNumber } from '@/utils/format';

interface OperationalReportCardProps {
  report: PublicOperationalReport;
  /** When provided, renders a "View details" link to the report's own page. */
  linkHref?: string;
}

export function OperationalReportCard({ report, linkHref }: OperationalReportCardProps) {
  const { t, language } = useLanguage();
  const measures = report.measures ?? [];
  if (measures.length === 0) return null;

  const title = pickText(report.title_en, report.title_hi, language);
  const period = formatDateRange(report.resolved_period.start, report.resolved_period.end, language);

  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            <span className="border-l-4 border-primary pl-3">{title}</span>
          </h2>
          {period && <p className="mt-1 pl-4 text-xs text-muted-foreground">{period}</p>}
        </div>
        {linkHref && (
          <Link
            href={linkHref}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t('common.viewDetails')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {measures.map((measure) => (
          <MeasureTile key={measure.measure_key} measure={measure} language={language} />
        ))}
      </ul>
    </section>
  );
}

function MeasureTile({ measure, language }: { measure: PublicOperationalMeasure; language: Language }) {
  const label = pickText(measure.label_en, measure.label_hi, language);
  const note = pickText(measure.note_en, measure.note_hi, language);
  const value = measure.value != null ? formatNumber(measure.value, language) : '—';

  return (
    <li className="rounded-lg border border-border bg-surface p-4">
      <p className="text-2xl font-extrabold text-primary">
        {value}
        {measure.unit && <span className="ml-1 text-sm font-semibold text-muted-foreground">{measure.unit}</span>}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      {note && <p className="mt-2 text-[11px] leading-snug text-muted-foreground/70">{note}</p>}
    </li>
  );
}
