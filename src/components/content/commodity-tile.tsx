'use client';

/**
 * One "Key Commodities" tile on /about. A client leaf (per the server-rendered
 * About page's pattern for CMS-driven bilingual text) so the commodity name follows
 * the language toggle instead of being pinned to `name_en`.
 */

import { Leaf } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import { CoverImage } from '@/components/content/cover-image';
import type { Commodity } from '@/lib/types/api';

export function CommodityTile({ commodity }: { commodity: Commodity }) {
  const { language } = useLanguage();
  const name = pickText(commodity.name_en, commodity.name_hi, language);
  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-surface p-4 text-center">
      {commodity.icon_media ? (
        <CoverImage
          media={commodity.icon_media}
          fallbackAlt={name}
          rounded
          className="mb-3 h-10 w-10"
          sizes="40px"
        />
      ) : (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Leaf className="h-4 w-4 text-primary" aria-hidden="true" />
        </div>
      )}
      <p className="text-sm font-bold text-foreground">{name}</p>
      {commodity.category && <p className="mt-0.5 text-xs text-muted-foreground">{commodity.category}</p>}
    </div>
  );
}
