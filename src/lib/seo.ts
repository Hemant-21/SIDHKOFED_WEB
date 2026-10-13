import type { Metadata } from 'next';
import { env } from '@/config/env';

/** Share-card fallback for pages without their own cover image: the SIDHKOFED emblem centred on a
 *  1200x630 white card (public/og-default.png, kept under ~300 KB so WhatsApp/Facebook accept it). */
export const DEFAULT_OG_IMAGE = { url: '/og-default.png', width: 1200, height: 630, alt: 'SIDHKOFED emblem' };

/**
 * Build per-page metadata from backend content (codex §11: backend metadata only,
 * never fabricated). Sets canonical URL, Open Graph and Twitter cards. Titles flow
 * through the root layout template (`%s · SIDHKOFED`).
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
}: {
  /** Plain string (gets the `· SIDHKOFED` suffix) or `{ absolute }` to skip the template. */
  title: string | { absolute: string };
  description?: string | null;
  /** Absolute site path, e.g. `/events/lac-training`. */
  path: string;
  image?: string | null;
  type?: 'website' | 'article';
}): Metadata {
  const canonical = `${env.siteUrl}${path}`;
  const desc = description?.trim() || undefined;
  const images = image ? [{ url: image }] : [DEFAULT_OG_IMAGE];
  const plainTitle = typeof title === 'string' ? title : title.absolute;

  return {
    title,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title: plainTitle,
      description: desc,
      url: canonical,
      type,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: plainTitle,
      description: desc,
      images: [image ?? DEFAULT_OG_IMAGE.url],
    },
  };
}
