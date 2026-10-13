import type { MetadataRoute } from 'next';
import { env } from '@/config/env';
import { getListSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';

interface SlugRow {
  slug: string;
  public_url?: string;
  published_at?: string | null;
  updated_at?: string | null;
}

// Static + dynamic public routes. Listings are fetched page by page (100 per request).
// changefreq/priority are omitted on purpose - Google ignores them; lastModified is only
// emitted where the backend supplies a real date.
const STATIC_ROUTES = [
  '',
  '/about',
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
  '/contact',
  '/privacy-policy',
  '/disclaimer',
  '/sitemap',
  '/accessibility-statement',
  '/terms-of-use',
  '/copyright-policy',
  '/hyperlinking-policy',
  '/help-feedback',
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

/** Safety cap so a misbehaving backend can never make the sitemap loop forever. */
const MAX_PAGES = 50;

/** Walk every page of a listing (not just the first) so older content stays discoverable. */
async function fetchAllRows(endpoint: string): Promise<SlugRow[]> {
  const rows: SlugRow[] = [];
  let totalPages = 1;
  for (let page = 1; page <= Math.min(totalPages, MAX_PAGES); page += 1) {
    const result = await getListSafe<SlugRow>(endpoint, { query: { page, page_size: 100 }, revalidate: 3600 });
    if (result.error) break;
    rows.push(...result.items);
    totalPages = result.pagination.total_pages;
  }
  return rows;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.siteUrl;

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route}`,
  }));

  const dynamicLists = await Promise.all(
    DYNAMIC_SOURCES.map(async ({ endpoint, prefix }) => {
      const items = await fetchAllRows(endpoint);
      return items.map((row) => ({
        url: `${base}${row.public_url ?? `${prefix}/${row.slug}`}`,
        ...(row.updated_at || row.published_at
          ? { lastModified: new Date(row.updated_at ?? row.published_at!) }
          : {}),
      }));
    }),
  );

  return [...staticEntries, ...dynamicLists.flat()];
}
