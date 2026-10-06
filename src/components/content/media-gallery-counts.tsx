'use client';

import { Images, Video as VideoIcon } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';

/** The gallery/video count pills in the Media Gallery hero - split out as a small
 *  client component (rather than inlined in the server page.tsx) purely so the
 *  count labels can go through the dictionary like the rest of the hero. */
export function MediaGalleryCounts({ totalGalleries, totalVideos }: { totalGalleries: number; totalVideos: number }) {
  const { t } = useLanguage();
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <div className="inline-flex items-center gap-2 rounded-full bg-hero-foreground/15 px-4 py-1.5 text-sm font-medium text-hero-foreground">
        <Images className="h-4 w-4" aria-hidden="true" />
        {totalGalleries} {t(totalGalleries === 1 ? 'page.publications.media.gallery.singular' : 'page.publications.media.gallery.plural')}
      </div>
      <div className="inline-flex items-center gap-2 rounded-full bg-hero-foreground/15 px-4 py-1.5 text-sm font-medium text-hero-foreground">
        <VideoIcon className="h-4 w-4" aria-hidden="true" />
        {totalVideos} {t(totalVideos === 1 ? 'page.publications.media.video.singular' : 'page.publications.media.video.plural')}
      </div>
    </div>
  );
}
