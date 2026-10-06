'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import type { InstitutionSummary } from '@/lib/types/content';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import { isLocalMediaUrl, mediaUrl } from '@/utils/media-url';

const PX_PER_SECOND = 40;

function PartnerLogo({
  partner,
  name,
  decorative,
}: {
  partner: InstitutionSummary;
  name: string;
  decorative: boolean;
}) {
  return (
    <Link
      href={partner.public_url}
      title={name}
      aria-hidden={decorative || undefined}
      tabIndex={decorative ? -1 : undefined}
      className="flex h-36 w-56 shrink-0 items-center justify-center rounded-md bg-surface p-4"
    >
      {partner.logo?.url ? (
        <div className="relative h-full max-h-28 w-full max-w-48">
          <Image
            src={mediaUrl(partner.logo, 'card')}
            alt={decorative ? '' : name}
            fill
            sizes="224px"
            className="object-contain"
            unoptimized={isLocalMediaUrl(mediaUrl(partner.logo, 'card'))}
          />
        </div>
      ) : (
        <span className="flex flex-col items-center gap-1 text-center" aria-hidden="true">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </span>
      )}
      {!decorative && <span className="sr-only">{name}</span>}
    </Link>
  );
}

/**
 * Horizontally scrolling strip of partner/institution logos. Once the logos don't
 * all fit at the current viewport width, the row is duplicated end-to-end (as one
 * flat, evenly-gapped list) and continuously translated - a classic marquee: the
 * first logo scrolls off the left edge and the loop repeats seamlessly, rather than
 * resetting or bouncing back. Otherwise it's a plain static row. Paused on
 * hover/focus and for reduced motion.
 */
export function PartnersCarousel({ partners }: { partners: InstitutionSummary[] }) {
  const { t, language } = useLanguage();
  const animationName = `partners-marquee-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [loopWidth, setLoopWidth] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Measure the exact pixel distance from the track's start to where the
  // duplicated copy begins (the first child past `partners.length`), including
  // the gap - that distance is what the loop must translate by to be seamless.
  useEffect(() => {
    const outerEl = outer.current;
    const trackEl = track.current;
    if (!outerEl || !trackEl) return;
    const measure = () => {
      const firstOriginal = trackEl.children[0] as HTMLElement | undefined;
      const firstDuplicate = trackEl.children[partners.length] as HTMLElement | undefined;
      if (!firstOriginal) return;
      const overflowing = trackEl.scrollWidth > outerEl.clientWidth;
      setIsOverflowing(overflowing);
      if (overflowing && firstDuplicate) {
        setLoopWidth(firstDuplicate.getBoundingClientRect().left - firstOriginal.getBoundingClientRect().left);
      }
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(outerEl);
    resizeObserver.observe(trackEl);
    return () => resizeObserver.disconnect();
  }, [partners.length]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const animate = isOverflowing && !reducedMotion && loopWidth > 0;
  const duration = loopWidth / PX_PER_SECOND;

  return (
    <div
      ref={outer}
      role={isOverflowing ? 'region' : undefined}
      aria-roledescription={isOverflowing ? 'marquee' : undefined}
      aria-label={isOverflowing ? t('home.section.partners') : undefined}
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {animate && (
        <style>{`
          @keyframes ${animationName} {
            from { transform: translateX(0); }
            to { transform: translateX(-${loopWidth}px); }
          }
        `}</style>
      )}
      <div
        ref={track}
        className="flex w-max gap-6"
        style={
          animate
            ? { animation: `${animationName} ${duration}s linear infinite`, animationPlayState: paused ? 'paused' : 'running' }
            : undefined
        }
      >
        {partners.map((partner) => (
          <PartnerLogo
            key={partner.id}
            partner={partner}
            name={pickText(partner.name_en, partner.name_hi, language)}
            decorative={false}
          />
        ))}
        {isOverflowing &&
          partners.map((partner) => (
            <PartnerLogo
              key={`${partner.id}-dup`}
              partner={partner}
              name={pickText(partner.name_en, partner.name_hi, language)}
              decorative
            />
          ))}
      </div>
    </div>
  );
}
