import Image from 'next/image';
import Link from 'next/link';
import { getListSafe, getOneSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import type {
  EventSummary,
  GalleryDetail,
  ProgrammeSummary,
  DocumentSummary,
  TenderSummary,
  Leader,
  InstitutionSummary,
} from '@/lib/types/content';
import { Container } from '@/components/ui/container';
import { HeroSearch } from '@/components/home/hero-search';
import { LatestBar, type LatestBarItem } from '@/components/home/latest-bar';
import { QuickLinks } from '@/components/home/quick-links';
import { TrainingTimeline } from '@/components/home/training-timeline';
import { ProgrammeCard } from '@/components/cards/programme-card';
import { DocumentCard } from '@/components/cards/document-card';
import { TenderCard } from '@/components/cards/tender-card';
import { HomeSection } from '@/components/home/home-section';
import { PageFaqSection } from '@/components/content/page-faq-section';
import { LeadersSection } from '@/components/home/leaders-section';
import { AboutEditorial } from '@/components/home/about-editorial';
import { EyebrowHeading } from '@/components/home/section-header';
import { KnowledgeHub } from '@/components/home/knowledge-hub';
import { ViewAllLink } from '@/components/home/view-all-link';
import { CapacityBuildingBody } from '@/components/home/capacity-building-body';
import { PartnersCarousel } from '@/components/home/partners-carousel';
import { OrganizationJsonLd } from '@/components/seo/json-ld';
import { detailPath } from '@/lib/api/endpoints';
import { isLocalMediaUrl, mediaUrl } from '@/utils/media-url';

export const revalidate = 300;

export default async function HomePage() {
  const [heroGallery, leaders, programmes, notices, tenders, trainings, galleryEvents, partners] = await Promise.all([
    getOneSafe<GalleryDetail>(detailPath(PUBLIC_ENDPOINTS.galleries, 'hero-slides')),
    getListSafe<Leader>(PUBLIC_ENDPOINTS.leadership, { query: { page_size: 12 } }),
    getListSafe<ProgrammeSummary>(PUBLIC_ENDPOINTS.programmes, { query: { show_on_homepage: true, page_size: 6 } }),
    // Notices - switched from OfficialCommunication to notification Documents, matching the
    // consolidated `/notifications` destination (the OfficialCommunication-backed
    // `/notifications/notices` listing is retired; its `[slug]` detail pages still read
    // OfficialCommunication and are unaffected). Spans all communication types (notice,
    // office order, public announcement) rather than just `notice`, since this band is the
    // homepage's general "latest updates" feed, not a notice-only one.
    getListSafe<DocumentSummary>(PUBLIC_ENDPOINTS.documents, {
      query: { document_section: 'notifications', page_size: 4, ordering: '-publication_date' },
    }),
    getListSafe<TenderSummary>(PUBLIC_ENDPOINTS.tenders, { query: { tender_status: 'open', page_size: 4 } }),
    getListSafe<EventSummary>(PUBLIC_ENDPOINTS.events, { query: { event_type: 'training', page_size: 3, ordering: '-start_date' } }),
    getListSafe<EventSummary>(PUBLIC_ENDPOINTS.events, { query: { page_size: 10, ordering: '-start_date' } }),
    // Already capped + ordered server-side (showOnHomepage + display_order), per the
    // CMS-configurable `homepage.featured_partners_limit` setting.
    getListSafe<InstitutionSummary>(PUBLIC_ENDPOINTS.homePartners),
  ]);

  const galleryItems = galleryEvents.items.filter((e) => e.cover_media !== null).slice(0, 6);

  // Combined "Latest" feed for the bar under the hero - notices + tenders, newest first.
  const latestItems: LatestBarItem[] = [
    ...notices.items.map((n) => ({
      id: `notice-${n.id}`,
      title_en: n.title_en,
      title_hi: n.title_hi,
      href: n.public_url,
      date: n.publication_date,
    })),
    ...tenders.items.map((tdr) => ({
      id: `tender-${tdr.id}`,
      title_en: tdr.title_en,
      title_hi: tdr.title_hi,
      href: tdr.public_url,
      date: tdr.publish_date,
    })),
  ]
    .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
    .slice(0, 5)
    .map(({ date, ...item }) => item);

  return (
    <>
      <OrganizationJsonLd />

      {/* 1. Hero - split layout, static text with a photo carousel, embedded search */}
      <section className="overflow-hidden bg-hero">
        <HeroSearch slides={heroGallery?.images ?? []} />
      </section>

      <LatestBar items={latestItems} />

      {/* 2. Quick Access */}
      <QuickLinks />

      {/* 3. Governance band - notices + tenders (promoted: carries the "latest updates"
          job the retired announcement ticker used to do) */}
      {(notices.items.length > 0 || tenders.items.length > 0) && (
        <section className="border-y border-border bg-surface-alt">
          <Container className="py-14">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <HomeSection
                titleKey="home.section.communications"
                viewAllHref="/notifications#listing"
                show={notices.items.length > 0}
                bare
              >
                <div className="space-y-4">
                  {notices.items.map((n) => (
                    <DocumentCard key={n.id} document={n} />
                  ))}
                </div>
              </HomeSection>
              <HomeSection
                titleKey="home.section.tenders"
                viewAllHref="/notifications/tenders"
                show={tenders.items.length > 0}
                bare
              >
                <div className="space-y-4">
                  {tenders.items.map((tdr) => (
                    <TenderCard key={tdr.id} tender={tdr} />
                  ))}
                </div>
              </HomeSection>
            </div>
          </Container>
        </section>
      )}

      {/* 4. Leadership - demoted below Quick Access/KPI/Governance so it no longer
          outranks citizen tasks; CMS-driven via the Leadership module */}
      <LeadersSection leaders={leaders.items} />

      {/* 5. About editorial - 2-col */}
      <section>
        <Container className="py-14">
          <AboutEditorial />
        </Container>
      </section>

      {/* 6. Partners & Institutions - active, homepage-flagged institutions only, capped
          and ordered server-side (`homepage.featured_partners_limit` CMS setting). Becomes
          a scrollable carousel on its own once the logos overflow the row. Placed right
          after Leadership/About so the "who we are, who we work with" story reads together
          before the page moves on to programmatic content. */}
      {partners.items.length > 0 && (
        <section className="border-t border-border">
          <Container className="py-14">
            <div className="mb-8">
              <EyebrowHeading eyebrowKey="home.eyebrow.partners" titleKey="home.heading.partners" />
            </div>
            <PartnersCarousel partners={partners.items} />
          </Container>
        </section>
      )}

      {/* 7. Activities & Commodities - CMS programmes */}
      {programmes.items.length > 0 && (
        <section>
          <Container className="py-14">
            <div className="mb-8">
              <EyebrowHeading
                eyebrowKey="home.eyebrow.activitiesCommodities"
                titleKey="home.heading.activitiesCommodities"
              />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programmes.items.map((p) => (
                <ProgrammeCard key={p.id} programme={p} />
              ))}
            </div>
            <div className="mt-8 text-right">
              <ViewAllLink href="/programmes" labelKey="common.viewAllProgrammes" className="justify-end" />
            </div>
          </Container>
        </section>
      )}

      {/* 8. Capacity Building - training events timeline. Always on stone: the preceding
          "About editorial" section always renders in --background, so this never sits
          next to the (also-stone) governance band above. */}
      <section className="border-y border-border bg-surface-alt">
        <Container className="py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <EyebrowHeading eyebrowKey="home.eyebrow.capacityBuilding" titleKey="home.heading.capacityBuilding" />
              <CapacityBuildingBody />
            </div>
            <div className="pt-2">
              <TrainingTimeline events={trainings.items} />
            </div>
          </div>
        </Container>
      </section>

      {/* 9. Knowledge Hub - static category cards */}
      <section className="border-t border-border">
        <Container className="py-14">
          <KnowledgeHub />
        </Container>
      </section>

      {/* 10. Media Gallery - event cover photos, hidden when fewer than 2 images */}
      {galleryItems.length >= 2 && (
        <section>
          <Container className="py-14">
            <div className="mb-8 flex items-end justify-between gap-4">
              <EyebrowHeading eyebrowKey="home.eyebrow.photoGallery" titleKey="home.heading.photoGallery" />
              <ViewAllLink href="/publications/media" labelKey="common.viewAll" className="shrink-0" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {galleryItems.map((event) => (
                <Link
                  key={event.id}
                  href={event.public_url}
                  className="group relative aspect-[4/3] overflow-hidden rounded-md bg-muted"
                >
                  <Image
                    src={mediaUrl(event.cover_media!, 'card')}
                    alt={event.cover_media!.alt_text || event.cover_media!.title || event.title_en || ''}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px"
                    unoptimized={isLocalMediaUrl(mediaUrl(event.cover_media!, 'card'))}
                  />
                  {/* Caption stays visible (not hover-only) so it's available on touch devices too. */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-3 pb-2.5 pt-6">
                    <p className="text-xs font-medium leading-snug text-white line-clamp-2">
                      {event.title_en}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 11. FAQ - the last content section, immediately above the shared footer. */}
      <PageFaqSection pageKey="home" titleKey="home.section.faq" />
    </>
  );
}
