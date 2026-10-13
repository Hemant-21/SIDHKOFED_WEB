'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MediaRef } from '@/lib/types/api';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import { cn } from '@/utils/cn';
import { isLocalMediaUrl, mediaUrl } from '@/utils/media-url';

export interface CarouselSlide {
  id: string;
  media: MediaRef;
  caption_en?: string | null;
  caption_hi?: string | null;
}

/**
 * Carousel over the photos of the galleries linked to an event: one slide at a time,
 * prev/next buttons, arrow-key navigation while focused, dot indicators, and
 * auto-advance that pauses on hover/focus and is disabled for reduced motion.
 */
export function EventGalleryCarousel({ images, alt }: { images: CarouselSlide[]; alt: string }) {
  const { t, language } = useLanguage();
  const total = images.length;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);

  useEffect(() => {
    if (total < 2 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(next, 5000);
    return () => window.clearInterval(id);
  }, [total, paused, next]);

  // Keep the active thumbnail in view (scrolls the strip only, never the page).
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[current] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({ left: thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2, behavior: 'smooth' });
  }, [current]);

  if (total === 0) return null;

  return (
    <div>
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={alt}
      tabIndex={0}
      className="group relative overflow-hidden rounded-md bg-black focus-visible:ring-2 focus-visible:ring-primary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
      }}
    >
      <div
        className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, i) => {
          const caption = pickText(img.caption_en, img.caption_hi, language);
          const src = mediaUrl(img.media, 'hero');
          return (
            <div
              key={img.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${total}`}
              aria-hidden={i !== current}
              className="relative aspect-[16/9] w-full shrink-0"
            >
              <Image
                src={src}
                alt={caption || t('gallery.photoNumber', { number: i + 1 })}
                fill
                sizes="(max-width: 1024px) 100vw, 720px"
                className="object-contain"
                priority={i === 0}
                unoptimized={isLocalMediaUrl(src)}
              />
              {caption && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-4">
                  <p className="text-sm text-white">{caption}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label={t('gallery.previousPhoto')}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={t('gallery.nextPhoto')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
            {current + 1} / {total}
          </span>
        </>
      )}
    </div>

    {total > 1 && (
      <div ref={thumbsRef} className="relative mt-3 flex gap-2 overflow-x-auto pb-2">
        {images.map((img, i) => {
          const thumbSrc = mediaUrl(img.media, 'thumb');
          return (
            <button
              key={img.id}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={t('gallery.photoNumber', { number: i + 1 })}
              aria-current={i === current}
              className={cn(
                'relative h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all focus-visible:ring-2 focus-visible:ring-primary',
                i === current ? 'border-primary opacity-100' : 'border-transparent opacity-50 hover:opacity-90',
              )}
            >
              <Image src={thumbSrc} alt="" fill sizes="80px" className="object-cover" unoptimized={isLocalMediaUrl(thumbSrc)} />
            </button>
          );
        })}
      </div>
    )}
    </div>
  );
}
