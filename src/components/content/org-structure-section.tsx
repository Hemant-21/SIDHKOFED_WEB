'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/providers/language-provider';
import type { TranslationKey } from '@/i18n/dictionary';
import { LocalizedHeading, LocalizedTextInline } from '@/components/listing/localized-heading';
import { GovernanceToggle } from '@/components/content/governance-toggle';

export type BoardKey = 'state' | 'district';
type BoardRow = { roleKey: TranslationKey; noteKey: TranslationKey };

export function OrgStructureSection({
  stateBoard,
  districtBoard,
}: {
  stateBoard: BoardRow[];
  districtBoard: BoardRow[];
}) {
  const { t } = useLanguage();
  const [active, setActive] = useState<BoardKey>('state');

  const descriptionKey: TranslationKey =
    active === 'state' ? 'about.orgStructure.state.body' : 'about.orgStructure.district.body';

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
      <div className="flex flex-col">
        <LocalizedHeading titleKey="about.orgStructure.title" as="h2" />
        <p className="text-base leading-relaxed text-foreground">{t(descriptionKey)}</p>
        <div className="mt-8 flex flex-1 items-center justify-center">
          <Image
            src="/logo-sidhkofed.png"
            alt="SIDHKOFED"
            width={280}
            height={280}
            className="h-auto w-48 opacity-90 sm:w-64 lg:w-72"
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <LocalizedTextInline textKey="about.governance.label" />
        </p>
        <GovernanceToggle
          stateBoard={stateBoard}
          districtBoard={districtBoard}
          active={active}
          onChange={setActive}
        />
      </div>
    </div>
  );
}
