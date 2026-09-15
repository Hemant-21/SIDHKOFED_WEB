'use client';

/**
 * Renders published Website Metrics (Stage 6) for one placement (`homepage` |
 * `about_us`). Distinct data source from `<OperationalReportCard>` (Operational
 * Reports module) — these come from the Website Metrics module's public snapshots. The
 * backend is the source of truth for every figure; this component only renders
 * label/value/unit/period/as-of/disclosure, never calculates.
 *
 * Two presentations share the same data shape:
 *  - `variant="card"` (default): light-background bordered cards, for use on
 *    regular page backgrounds (e.g. the homepage).
 *  - `variant="band"`: compact white-text-on-primary presentation, for use inside
 *    a colored header band (e.g. About Us's primary-colored header), matching that
 *    band's existing value/label typography (`text-lg font-black text-white` /
 *    `text-xs font-medium text-white/50`).
 *
 * Per spec, an empty `metrics` array renders nothing at all (no heading, no empty
 * box) so a placement with no published metrics yet is genuinely invisible.
 */

import { Info } from 'lucide-react';
import type { Language } from '@/i18n/dictionary';
import type { PublicWebsiteMetric } from '@/lib/types/content';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import { formatDate, formatDateRange, formatNumber } from '@/utils/format';

interface WebsiteMetricGridProps {
  metrics: PublicWebsiteMetric[];
  variant?: 'card' | 'band';
}

/** Small "Period: … · As of …" caption built from the metric's period + as_of_date. */
function buildCaption(metric: PublicWebsiteMetric, language: Language): string {
  const parts: string[] = [];
  if (metric.period.start) {
    parts.push(`Period: ${formatDateRange(metric.period.start, metric.period.end, language)}`);
  }
  if (metric.as_of_date) {
    parts.push(`As of ${formatDate(metric.as_of_date, language)}`);
  }
  return parts.join(' · ');
}

export function WebsiteMetricGrid({ metrics, variant = 'card' }: WebsiteMetricGridProps) {
  const { language } = useLanguage();
  if (metrics.length === 0) return null;

  if (variant === 'band') {
    return (
      <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-6">
        {metrics.map((metric) => (
          <BandMetric key={metric.metric_key} metric={metric} language={language} />
        ))}
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {metrics.map((metric) => (
        <CardMetric key={metric.metric_key} metric={metric} language={language} />
      ))}
    </ul>
  );
}

function CardMetric({ metric, language }: { metric: PublicWebsiteMetric; language: Language }) {
  const label = pickText(metric.label_en, metric.label_hi, language);
  const value = formatNumber(metric.value, language);
  const disclosure = pickText(metric.disclosure_note_en, metric.disclosure_note_hi, language);
  const caption = buildCaption(metric, language);
  const tooltip = [caption, disclosure].filter(Boolean).join(' · ');

  return (
    <li className="relative rounded-lg border border-border bg-surface px-3.5 py-3 shadow-sm">
      <p className="flex items-baseline gap-1 text-xl font-bold text-primary">
        {value}
        {metric.unit && <span className="text-xs font-medium text-muted-foreground">{metric.unit}</span>}
      </p>
      <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground" title={label}>
        {label}
      </p>
      {tooltip && (
        <span
          className="absolute right-2.5 top-2.5 text-muted-foreground/50"
          title={tooltip}
          aria-label={tooltip}
        >
          <Info className="h-3.5 w-3.5" />
        </span>
      )}
    </li>
  );
}

function BandMetric({ metric, language }: { metric: PublicWebsiteMetric; language: Language }) {
  const label = pickText(metric.label_en, metric.label_hi, language);
  const value = formatNumber(metric.value, language);
  const disclosure = pickText(metric.disclosure_note_en, metric.disclosure_note_hi, language);
  const caption = buildCaption(metric, language);

  return (
    <div className="flex max-w-[220px] flex-col gap-0.5">
      <div className="flex flex-wrap items-baseline gap-1.5">
        <span className="text-lg font-black text-white">
          {value}
          {metric.unit ? ` ${metric.unit}` : ''}
        </span>
        <span className="text-xs font-medium text-white/50">{label}</span>
      </div>
      {caption && <span className="text-[10px] text-white/40">{caption}</span>}
      {disclosure && <span className="text-[10px] leading-snug text-white/35">{disclosure}</span>}
    </div>
  );
}
