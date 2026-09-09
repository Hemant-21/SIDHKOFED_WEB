'use client';

import Link from 'next/link';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/language-provider';

/** Empty state for listings with no published content. */
export function EmptyState({ title, body }: { title?: string; body?: string }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center">
      <Inbox className="mb-3 h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <p className="text-lg font-semibold text-foreground">{title ?? t('state.empty.title')}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{body ?? t('state.empty.body')}</p>
    </div>
  );
}

/** Centered "go home" block used by 404. */
export function NotFoundBlock() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">{t('state.notFound.title')}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{t('state.notFound.body')}</p>
      <Link href="/" className="mt-6">
        <Button>{t('state.notFound.cta')}</Button>
      </Link>
    </div>
  );
}
