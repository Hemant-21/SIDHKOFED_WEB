'use client';

/**
 * Linked-document list used on detail pages (events, communications, procurement).
 * Documents are uploaded once and linked by reference (codex §4.5). Rows link to the
 * document's own detail page rather than duplicating Preview/Download actions here -
 * that page is the one place those actions live.
 */

import Link from 'next/link';
import { FileText } from 'lucide-react';
import type { DocumentLinkRef } from '@/lib/types/api';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import { humanizeEnum } from '@/utils/format';

export function DocumentLinks({ documents }: { documents: DocumentLinkRef[] }) {
  const { language } = useLanguage();
  if (documents.length === 0) return null;

  return (
    <ul className="space-y-2">
      {documents.map((doc) => {
        const title = pickText(doc.title_en, doc.title_hi, language);
        return (
          <li key={doc.id}>
            <Link
              href={`/documents/${doc.slug}`}
              className="flex min-w-0 items-start gap-2.5 rounded-md border border-border bg-surface p-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0">
                <p className="break-words text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{humanizeEnum(doc.document_type)}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
