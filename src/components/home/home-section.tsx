'use client';

import { useLanguage } from '@/providers/language-provider';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import type { TranslationKey } from '@/i18n/dictionary';

/**
 * Homepage section wrapper. Renders nothing when `show` is false so empty backend
 * sections disappear cleanly. `bare` omits the Container (for column layouts that
 * provide their own).
 */
export function HomeSection({
  titleKey,
  viewAllHref,
  show,
  bare = false,
  children,
}: {
  titleKey: TranslationKey;
  viewAllHref?: string;
  show: boolean;
  bare?: boolean;
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  if (!show) return null;

  const inner = (
    <section>
      <SectionHeading title={t(titleKey)} viewAllHref={viewAllHref} viewAllLabel={t('common.viewAll')} />
      {children}
    </section>
  );

  return bare ? inner : <Container>{inner}</Container>;
}
