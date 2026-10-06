'use client';

import Link from 'next/link';
import { FileText, CalendarClock, Paperclip } from 'lucide-react';
import type { DocumentSummary } from '@/lib/types/content';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import { formatDate, formatFileSize, formatFileType, truncate } from '@/utils/format';
import { Card } from '@/components/ui/card';
import { Badge, HighlightBadge } from '@/components/ui/badge';

/**
 * Document card for listings. No Preview/Download actions here - the whole card
 * links to the document's own detail page, which has both (codex §4.5); keeping
 * list rows to a single action avoids repeating two buttons per row.
 *
 * Layout mirrors TenderCard (icon + badges + title + icon-led meta row) so the two
 * card types sit uniformly side by side in the homepage governance band and anywhere
 * else they're mixed. The communication-type badge is shown alongside the document
 * type since /notifications now lists notices, office orders and public announcements
 * together - it's the thing that tells those apart at a glance.
 */
export function DocumentCard({ document }: { document: DocumentSummary }) {
  const { t, language } = useLanguage();
  const title = pickText(document.title_en, document.title_hi, language);
  const description = pickText(document.description_en, document.description_hi, language);
  const fileType = formatFileType(document.file?.mime_type);
  const fileSize = formatFileSize(document.file?.file_size);
  const fileMeta = [fileType, fileSize].filter(Boolean).join(' · ');
  const communicationTypeName = document.communication_type
    ? pickText(document.communication_type.name_en, document.communication_type.name_hi, language)
    : undefined;
  const documentTypeName = pickText(document.document_type.name_en, document.document_type.name_hi, language);

  return (
    <Card className="flex min-h-[148px] gap-4 p-4">
      <FileText className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          {communicationTypeName && <Badge tone="primary">{communicationTypeName}</Badge>}
          {documentTypeName !== communicationTypeName && <Badge>{documentTypeName}</Badge>}
          <HighlightBadge type={document.highlight_type} />
        </div>
        <h3 className="font-sans text-base font-semibold leading-snug text-heading">
          <Link href={document.public_url} className="hover:text-link hover:underline">
            {title}
          </Link>
        </h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{truncate(description, 150)}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {document.publication_date && (
            <span className="flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              {t('common.publishedOn')} {formatDate(document.publication_date, language)}
            </span>
          )}
          {fileMeta && (
            <span className="flex items-center gap-1">
              <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
              <span lang="en">{fileMeta}</span>
              {document.language && (
                <span lang="en" className="uppercase">
                  {' '}
                  · {document.language}
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
