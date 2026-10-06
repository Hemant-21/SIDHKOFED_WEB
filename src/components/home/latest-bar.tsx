'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Pause, Play } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';

export interface LatestBarItem {
  id: string;
  title_en: string;
  title_hi: string | null;
  href: string;
}

const ROTATE_MS = 5000;

export function LatestBar({ items }: { items: LatestBarItem[] }) {
  const { t, language } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const isCarousel = items.length > 1;
  const autoRotating = isDesktop && isCarousel && !paused && !reducedMotion && !hovered && !focusWithin;

  const next = useCallback(() => setCurrent((i) => (i + 1) % items.length), [items.length]);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    setReducedMotion(motionQuery.matches);
    setIsDesktop(desktopQuery.matches);
    const onMotionChange = () => setReducedMotion(motionQuery.matches);
    const onDesktopChange = () => setIsDesktop(desktopQuery.matches);
    motionQuery.addEventListener('change', onMotionChange);
    desktopQuery.addEventListener('change', onDesktopChange);
    return () => {
      motionQuery.removeEventListener('change', onMotionChange);
      desktopQuery.removeEventListener('change', onDesktopChange);
    };
  }, []);

  useEffect(() => {
    if (!autoRotating) return;
    const id = setInterval(next, ROTATE_MS);
    return () => clearInterval(id);
  }, [autoRotating, next]);

  if (items.length === 0) return null;

  const activeItem = items[isDesktop ? current : 0]!;

  return (
    <div className="w-full border-b border-border bg-surface text-foreground shadow-sm">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={() => setFocusWithin(false)}
        className="mx-auto flex min-h-[52px] w-full max-w-container flex-col items-start gap-1.5 px-4 py-2.5 sm:px-6 md:flex-row md:items-center md:gap-4 md:py-0 lg:px-8"
      >
        <span className="shrink-0 rounded-sm bg-accent-action px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-accent-action-foreground sm:text-xs">
          {t('badge.highlight.latest')}
        </span>

        <div
          aria-live={!isDesktop || paused || !isCarousel ? 'polite' : 'off'}
          className="min-w-0 flex-1"
        >
          <Link
            key={activeItem.id}
            href={activeItem.href}
            className="block text-sm font-medium text-foreground underline-offset-2 hover:text-link hover:underline focus-visible:text-link focus-visible:underline focus-visible:outline-none md:truncate"
          >
            {pickText(activeItem.title_en, activeItem.title_hi, language)}
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          {isCarousel && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              className="hidden items-center gap-1.5 text-xs font-semibold text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline focus-visible:outline-none md:inline-flex"
            >
              {paused || reducedMotion ? (
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {paused || reducedMotion ? t('home.hero.slide.play') : t('home.hero.slide.pause')}
            </button>
          )}
          <Link
            href="/notifications#listing"
            className="text-xs font-semibold text-link underline-offset-2 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            {t('home.latest.all')} →
          </Link>
        </div>
      </div>
    </div>
  );
}
