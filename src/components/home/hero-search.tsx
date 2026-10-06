'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import { cn } from '@/utils/cn';
import { isLocalMediaUrl, mediaUrl } from '@/utils/media-url';
import { Container } from '@/components/ui/container';
import { HeroSearchBar } from './hero-search-bar';
import type { GalleryImage } from '@/lib/types/content';

interface HeroSearchProps {
  slides: GalleryImage[];
}

const ROTATE_MS = 7000;

const controlButton =
  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent focus-visible:ring-offset-2';

export function HeroSearch({ slides }: HeroSearchProps) {
  const { t, language } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // A slide image that fails to decode (corrupt/mislabeled source file, or an
  // optimizer error at a width variant only some viewports request) otherwise leaves
  // a bare broken <img> showing its raw filename as alt text. Track failures per
  // slide id and fall back to the static hero image instead.
  const [failedSlideIds, setFailedSlideIds] = useState<Set<string>>(new Set());
  const markSlideFailed = useCallback(
    (id: string) => setFailedSlideIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id))),
    [],
  );
  const hasSlides = slides.length > 0;
  const isCarousel = slides.length > 1;
  const total = slides.length;
  const autoRotating = isCarousel && !paused && !reducedMotion && !hovered && !focusWithin;

  const next = useCallback(() => setCurrent((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  // Honour the reduced-motion preference outright - no auto-rotation at all, regardless
  // of the pause toggle's state.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!autoRotating) return;
    const id = setInterval(next, ROTATE_MS);
    return () => clearInterval(id);
  }, [autoRotating, next]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!isCarousel) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    }
  };

  const headlineLines = t('home.hero.headline').split('\n');

  return (
    <Container className="grid grid-cols-1 items-center gap-8 py-6 sm:py-8 lg:grid-cols-[4fr_8fr] lg:items-stretch lg:gap-12 lg:py-0">
      {/* ── TEXT COLUMN - never changes when a slide changes. Carries its own
          vertical padding at lg+ (the row itself has none there) so the
          stretched carousel next to it fills the row's full height edge-to-
          edge, instead of being inset by padding that only the text needs. ── */}
      <div className="max-w-xl lg:py-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-hero-muted sm:mb-4">
          {t('home.hero.eyebrow')}
        </p>

        <h1
          className="font-display text-3xl font-semibold leading-[1.12] text-hero-foreground sm:text-4xl lg:text-[44px]"
          lang={language}
        >
          {headlineLines.map((line, i) => (
            <span key={i} className="block text-balance">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-hero-muted lg:text-lg" lang={language}>
          {t('home.hero.sub')}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/activities"
            className="inline-flex h-12 items-center justify-center rounded-sm bg-white px-6 text-sm font-semibold text-hero transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {t('home.hero.cta.activities')}
          </Link>
          <Link
            href="/procurement"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-accent-action px-6 text-sm font-semibold text-accent-action-foreground transition-colors hover:bg-accent-action/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {t('home.hero.cta.procurement')} <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 max-w-sm">
          <HeroSearchBar />
        </div>
      </div>

      {/* ── PHOTO CAROUSEL ── */}
      <section
        role="region"
        aria-roledescription="carousel"
        aria-label={t('home.hero.carousel.label')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={() => setFocusWithin(false)}
        onKeyDown={onKeyDown}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-md md:aspect-video lg:aspect-auto lg:h-auto lg:self-stretch"
      >
        {hasSlides ? (
          slides.map((slide, i) => {
            const slideFailed = failedSlideIds.has(slide.id);
            const isActive = i === current;
            const caption = pickText(slide.caption_en, slide.caption_hi, language);
            const alt = slide.media.alt_text || caption || slide.media.title || '';
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${total}`}
                aria-hidden={!isActive}
                className={cn(
                  'absolute inset-0 transition-opacity duration-700',
                  isActive ? 'opacity-100' : 'invisible opacity-0',
                )}
              >
                {slideFailed ? (
                  <Image src="/hero-cooperative.png" alt={alt} fill className="object-cover" />
                ) : (
                  <Image
                    src={mediaUrl(slide.media, 'hero')}
                    alt={alt}
                    fill
                    className="object-cover"
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    unoptimized={isLocalMediaUrl(mediaUrl(slide.media, 'hero'))}
                    onError={() => markSlideFailed(slide.id)}
                  />
                )}
              </div>
            );
          })
        ) : (
          <Image
            src="/hero-cooperative.png"
            alt={t('home.hero.fallbackAlt')}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Control bar */}
        {hasSlides && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-foreground px-3 py-1 text-white dark:bg-background sm:px-4">
            <div className="flex min-w-0 items-center gap-2 text-xs">
              <span className="shrink-0 font-medium tabular-nums">
                {current + 1} / {total}
              </span>
              {(() => {
                const caption = pickText(slides[current]?.caption_en, slides[current]?.caption_hi, language);
                return caption ? (
                  <span className="hidden min-w-0 truncate text-white/90 md:inline">{caption}</span>
                ) : null;
              })()}
            </div>

            {isCarousel && (
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" onClick={prev} aria-label={t('home.hero.slide.previous')} className={controlButton}>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused || reducedMotion ? t('home.hero.slide.play') : t('home.hero.slide.pause')}
                  aria-pressed={paused}
                  className={controlButton}
                >
                  {paused || reducedMotion ? (
                    <Play className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Pause className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
                <button type="button" onClick={next} aria-label={t('home.hero.slide.next')} className={controlButton}>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </Container>
  );
}
