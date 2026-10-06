'use client';

import { useLanguage } from '@/providers/language-provider';

function Connector() {
  return (
    <div className="flex justify-center py-0.5">
      <div className="relative h-7 w-px bg-border">
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-border" />
      </div>
    </div>
  );
}

export function CooperativeStructure() {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-sm">

      {/* Tier 1 - Apex */}
      <div className="rounded-md bg-primary px-5 py-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-hero-muted">
          {t('about.cooperativeStructure.apex.level')}
        </p>
        <p className="mt-1 text-base font-black text-white">{t('about.cooperativeStructure.apex.name')}</p>
        <p className="mt-0.5 text-xs text-white/90">{t('about.cooperativeStructure.apex.desc')}</p>
      </div>

      <Connector />

      {/* Tier 2 - District */}
      <div className="rounded-md border border-primary/25 bg-primary/10 px-5 py-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          {t('about.cooperativeStructure.district.level')}
        </p>
        <p className="mt-1 text-base font-bold text-foreground">{t('about.cooperativeStructure.district.name')}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{t('about.cooperativeStructure.district.desc')}</p>
      </div>

      <Connector />

      {/* Tier 3 - Panchayat */}
      <div className="rounded-md border border-accent/30 bg-accent/10 px-5 py-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-accent-action">
          {t('about.cooperativeStructure.panchayat.level')}
        </p>
        <p className="mt-1 text-base font-bold text-foreground">{t('about.cooperativeStructure.panchayat.name')}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{t('about.cooperativeStructure.panchayat.desc')}</p>
      </div>

    </div>
  );
}
