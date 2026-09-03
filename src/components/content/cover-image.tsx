import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { MediaRef } from '@/lib/types/api';
import { isLocalMediaUrl, mediaUrl, type MediaVariantName } from '@/utils/media-url';

/**
 * Render a media reference as an optimized image with meaningful alt text. Falls
 * back to a neutral placeholder when no media exists. Alt text uses the media
 * `alt_text` → `title` → caption → provided fallback (codex accessibility).
 */
export function CoverImage({
  media,
  fallbackAlt = '',
  className,
  sizes = '(max-width: 768px) 100vw, 400px',
  priority = false,
  rounded = true,
  variant = 'card',
}: {
  media: MediaRef | null | undefined;
  fallbackAlt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  rounded?: boolean;
  variant?: MediaVariantName;
}) {
  const wrapper = cn('relative overflow-hidden bg-muted', rounded && 'rounded-md', className);

  if (!media?.url) {
    return (
      <div className={cn(wrapper, 'flex items-center justify-center')} aria-hidden="true">
        <ImageOff className="h-8 w-8 text-muted-foreground/50" />
      </div>
    );
  }

  // alt="" marks a decorative image; meaningful images get descriptive text.
  const alt = media.alt_text || media.title || media.caption || fallbackAlt;
  const src = mediaUrl(media, variant);

  return (
    <div className={wrapper}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        unoptimized={isLocalMediaUrl(src)}
      />
    </div>
  );
}
