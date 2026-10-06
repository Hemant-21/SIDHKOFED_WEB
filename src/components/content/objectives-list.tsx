'use client';

import { useLanguage } from '@/providers/language-provider';
import type { TranslationKey } from '@/i18n/dictionary';

export function ObjectivesList({ itemKeys }: { itemKeys: TranslationKey[] }) {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {itemKeys.map((key, index) => (
        <div
          key={key}
          className="flex items-start gap-3 rounded-md border border-border bg-surface px-3.5 py-3"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
            {index + 1}
          </span>
          <p className="text-sm leading-snug text-foreground">{t(key)}</p>
        </div>
      ))}
    </div>
  );
}
