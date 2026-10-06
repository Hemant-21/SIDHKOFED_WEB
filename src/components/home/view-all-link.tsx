'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { cn } from '@/utils/cn';
import type { TranslationKey } from '@/i18n/dictionary';

/** A "View All X" text link with the arrow icon (never a literal "→" glyph - Noto's
 *  subset doesn't include it, so it silently falls back to Arial). */
export function ViewAllLink({ href, labelKey, className }: { href: string; labelKey: TranslationKey; className?: string }) {
  const { t } = useLanguage();
  return (
    <Link
      href={href}
      className={cn('inline-flex items-center gap-1 text-sm font-medium text-link hover:underline', className)}
    >
      {t(labelKey)}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}
