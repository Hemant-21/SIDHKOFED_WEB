import type { Metadata } from 'next';
import { getListSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import type { GallerySummary, Video } from '@/lib/types/content';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/container';
import { LocalizedHero, LocalizedSectionHeading } from '@/components/listing/localized-heading';
import { MediaGalleryCounts } from '@/components/content/media-gallery-counts';
import { LocalizedEmptyState } from '@/components/feedback/states';
import { GalleryCard } from '@/components/cards/gallery-card';
import { VideoCard } from '@/components/cards/video-card';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Media Gallery',
  description: 'Photo galleries and videos from SIDHKOFED activities and events.',
  path: '/publications/media',
});

// hero-slides is an internal homepage gallery, not a public media gallery entry.
const INTERNAL_GALLERY_SLUGS = new Set(['hero-slides']);

export default async function MediaGalleryPage() {
  const [galleriesRaw, videos] = await Promise.all([
    getListSafe<GallerySummary>(PUBLIC_ENDPOINTS.galleries, {
      query: { page_size: 9, ordering: 'display_order' },
    }),
    getListSafe<Video>(PUBLIC_ENDPOINTS.videos, {
      query: { page_size: 8, ordering: 'display_order' },
    }),
  ]);

  const internalInBatch = galleriesRaw.items.filter((g) => INTERNAL_GALLERY_SLUGS.has(g.slug)).length;
  const totalGalleries = Math.max(0, galleriesRaw.pagination.total_items - internalInBatch);
  const totalVideos = videos.pagination.total_items;

  const galleries = {
    ...galleriesRaw,
    items: galleriesRaw.items.filter((g) => !INTERNAL_GALLERY_SLUGS.has(g.slug)).slice(0, 8),
  };

  return (
    <>
      <LocalizedHero
        titleKey="page.publications.media.title"
        subtitleKey="page.publications.media.subtitle"
        breadcrumb={[
          { labelKey: 'page.publications.title', href: '/publications' },
          { labelKey: 'page.publications.media.title' },
        ]}
      >
        <MediaGalleryCounts totalGalleries={totalGalleries} totalVideos={totalVideos} />
      </LocalizedHero>

      {/* Photo Galleries */}
      <Container className="py-10">
        <LocalizedSectionHeading
          titleKey="page.publications.media.galleries.title"
          viewAllHref={galleries.pagination.total_items > 8 ? '/publications/media/galleries' : undefined}
        />

        {galleries.items.length === 0 ? (
          <LocalizedEmptyState
            titleKey="page.publications.media.galleries.empty.title"
            bodyKey="page.publications.media.galleries.empty.body"
          />
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {galleries.items.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        )}
      </Container>

      {/* Videos */}
      <div className="border-t border-border bg-muted/30">
        <Container className="py-10">
          <LocalizedSectionHeading
            titleKey="page.publications.media.videos.title"
            viewAllHref={videos.pagination.total_items > 8 ? '/publications/media/videos' : undefined}
          />

          {videos.items.length === 0 ? (
            <LocalizedEmptyState
              titleKey="page.publications.media.videos.empty.title"
              bodyKey="page.publications.media.videos.empty.body"
            />
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {videos.items.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
