'use client';

import { Eye, Crosshair } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';

export function VisionMissionCards() {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Eye className="h-4 w-4 text-primary" aria-hidden="true" />
          </span>
          <h2 className="text-base font-bold text-foreground">{t('about.vision.title')}</h2>
        </div>
        <p className="text-sm leading-snug text-foreground">{t('about.vision.body')}</p>
      </div>

      <div className="rounded-md border border-accent/20 bg-accent/5 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10">
            <Crosshair className="h-4 w-4 text-accent" aria-hidden="true" />
          </span>
          <h2 className="text-base font-bold text-foreground">{t('about.mission.title')}</h2>
        </div>
        <p className="text-sm leading-snug text-foreground">{t('about.mission.body')}</p>
      </div>
    </div>
  );
}
