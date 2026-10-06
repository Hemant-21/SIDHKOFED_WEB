'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';

/** Body copy + CTA under the "Capacity Building" heading on the homepage. */
export function CapacityBuildingBody() {
  const { t, language } = useLanguage();
  return (
    <>
      <p className="mt-4 text-base text-muted-foreground" lang={language}>
        {t('home.capacityBuilding.body')}
      </p>
      <Link
        href="/activities?event_category=trainings&event_type=training#listing"
        className="mt-6 inline-block rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {t('common.viewAllTrainings')}
      </Link>
    </>
  );
}
