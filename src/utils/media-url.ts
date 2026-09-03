import type { MediaRef } from '@/lib/types/api';

export type MediaVariantName = 'thumb' | 'card' | 'hero';

export function mediaUrl(media: MediaRef, variant: MediaVariantName = 'card'): string {
  return media.variants?.[variant]?.url ?? media.url;
}

export function isLocalMediaUrl(url: string): boolean {
  return url.startsWith('http://localhost');
}
