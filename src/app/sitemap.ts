import type { MetadataRoute } from 'next';
import { env } from '@/config/env';
import { getListSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';

interface SlugRow {
  slug: string;
  public_url?: string;
  published_at?: string | null;
}

// Static + dynamic public routes. Listings are bounded to the first page (100) per
// content type to keep the sitemap lightweight (codex: keep payloads small). For a
// very large corpus this would paginate into a sitemap index.
const STATIC_ROUTES = [
  '',
  '/about',
  '/about/vision-mission-objectives-functions',
  '/about/organisation-governance',
  '/activities',
  '/membership',
  '/procurement',
  '/procurement/enquiry',
  '/impact/dashboard',
  '/publications',
  '/publications/media',
  '/publications/media/galleries',
  '/publications/media/videos',
  '/notifications',
  '/notifications/tenders',
  '/events',
  '/news',
  '/programmes',
  '/toolkits',
  '/institutions',
  '/faqs',
  '/digital-services',
  '/search',
  '/contact',
  '/privacy-policy',
  '/disclaimer',
];

const DYNAMIC_SOURCES: Array<{ endpoint: string; prefix: string }> = [
  { endpoint: PUBLIC_ENDPOINTS.events, prefix: '/events' },
  { endpoint: PUBLIC_ENDPOINTS.news, prefix: '/news' },
  { endpoint: PUBLIC_ENDPOINTS.programmes, prefix: '/programmes' },
  { endpoint: PUBLIC_ENDPOINTS.documents, prefix: '/documents' },
  { endpoint: PUBLIC_ENDPOINTS.toolkits, prefix: '/toolkits' },
  { endpoint: PUBLIC_ENDPOINTS.institutions, prefix: '/institutions' },
  { endpoint: PUBLIC_ENDPOINTS.communications, prefix: '/notifications/notices' },
  { endpoint: PUBLIC_ENDPOINTS.tenders, prefix: '/notifications/tenders' },
  { endpoint: PUBLIC_ENDPOINTS.galleries, prefix: '/galleries' },
  { endpoint: PUBLIC_ENDPOINTS.videos, prefix: '/videos' },
  { endpoint: PUBLIC_ENDPOINTS.procurement, prefix: '/procurement/announcements' },
];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.siteUrl;
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.7,
  }));

  const dynamicLists = await Promise.all(
    DYNAMIC_SOURCES.map(async ({ endpoint, prefix }) => {
      const { items } = await getListSafe<SlugRow>(endpoint, { query: { page_size: 100 }, revalidate: 3600 });
      return items.map((row) => ({
        url: `${base}${row.public_url ?? `${prefix}/${row.slug}`}`,
        lastModified: row.published_at ? new Date(row.published_at) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }),
  );

  return [...staticEntries, ...dynamicLists.flat()];
}
