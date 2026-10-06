'use client';

import Link from 'next/link';
import { FileSignature, CalendarClock, ExternalLink } from 'lucide-react';
import type { TenderSummary } from '@/lib/types/content';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import { formatDate, truncate } from '@/utils/format';
import { Card } from '@/components/ui/card';
import { Badge, HighlightBadge, StatusBadge } from '@/components/ui/badge';

export function TenderCard({ tender }: { tender: TenderSummary }) {
  const { t, language } = useLanguage();
  const title = pickText(tender.title_en, tender.title_hi, language);
  const summary = pickText(tender.summary_en, tender.summary_hi, language);

  return (
    <Card className="flex min-h-[148px] gap-4 p-4">
      <FileSignature className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <Badge tone="primary">{pickText(tender.tender_type.name_en, tender.tender_type.name_hi, language)}</Badge>
          <StatusBadge status={tender.tender_status} />
          <HighlightBadge type={tender.highlight_type} />
          {tender.tender_number && <span className="text-xs text-muted-foreground">#{tender.tender_number}</span>}
        </div>
        <h3 className="font-sans text-base font-semibold leading-snug text-heading">
          <Link href={tender.public_url} className="hover:text-link hover:underline">
            {title}
          </Link>
        </h3>
        {summary && <p className="mt-1 text-sm text-muted-foreground">{truncate(summary, 150)}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {tender.submission_deadline && (
            <span className="flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              {t('detail.submissionDeadline')}: {formatDate(tender.submission_deadline, language)}
            </span>
          )}
          {tender.gem_url && (
            <a
              href={tender.gem_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-link hover:underline"
            >
              GeM <ExternalLink className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only"> {t('common.opensNewTab')}</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
