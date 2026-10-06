import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { GraduationCap, Megaphone, Users2, Folder } from 'lucide-react';
import { getListSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import type { EventSummary } from '@/lib/types/content';
import { buildMetadata } from '@/lib/seo';
import { PAGE_SIZE, toPage, qstr, getMasterOptions, yearOptions, enumOptions } from '@/lib/listing';
import { FilterBar, type FilterSelect } from '@/components/listing/filter-bar';
import { PaginationNav } from '@/components/listing/pagination-nav';
import { ResultsSummary } from '@/components/listing/results-summary';
import { CategoryCards, type CategoryCardDef } from '@/components/listing/category-cards';
import { CategoryBrowseHeading, CategoryListingHeader } from '@/components/listing/category-listing-header';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { ListingEmptyState } from '@/components/feedback/states';
import { EventCard } from '@/components/cards/event-card';
import { Container } from '@/components/ui/container';
import { PageFaqSection } from '@/components/content/page-faq-section';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Activities',
  description: 'Trainings, workshops, field visits, meetings and institutional activities across Jharkhand.',
  path: '/activities',
});

type SP = Record<string, string | string[] | undefined>;

const ICON_CLASS = 'h-5 w-5 text-primary';

/** Deterministic icon per known category slug; unrecognised/future categories fall back to Folder. */
const CATEGORY_ICONS: Record<string, ReactNode> = {
  trainings: <GraduationCap className={ICON_CLASS} aria-hidden="true" />,
  'workshops-awareness': <Megaphone className={ICON_CLASS} aria-hidden="true" />,
  'institutional-activities': <Users2 className={ICON_CLASS} aria-hidden="true" />,
};

export default async function ActivitiesPage({ searchParams }: { searchParams: SP }) {
  const page = toPage(searchParams.page);
  const selectedCategory = qstr(searchParams.event_category);

  const [list, eventCategories, districts] = await Promise.all([
    getListSafe<EventSummary>(PUBLIC_ENDPOINTS.events, {
      query: {
        page,
        page_size: PAGE_SIZE,
        search: qstr(searchParams.search),
        event_category: selectedCategory,
        event_type: qstr(searchParams.event_type),
        event_status: qstr(searchParams.event_status),
        district: qstr(searchParams.district),
        year: qstr(searchParams.year),
        ordering: '-start_date',
      },
    }),
    getMasterOptions('event-categories'),
    getMasterOptions('districts'),
  ]);

  // Event types per category - powers both the card descriptions and the type filter's options.
  const typesByCategory = new Map(
    await Promise.all(
      eventCategories.map(async (c) => [c.value, await getMasterOptions('event-types', { category: c.value })] as const),
    ),
  );

  const selectedCategoryOption = eventCategories.find((c) => c.value === selectedCategory);
  const eventTypes = selectedCategory ? (typesByCategory.get(selectedCategory) ?? []) : [];

  const activityCategories: CategoryCardDef[] = eventCategories.map((c) => {
    const types = typesByCategory.get(c.value) ?? [];
    const hasTypes = types.length > 0;
    const en = types.map((t) => t.name_en).join(', ');
    const hi = types.map((t) => t.name_hi ?? t.name_en).join(', ');
    return {
      icon: CATEGORY_ICONS[c.value] ?? <Folder className={ICON_CLASS} aria-hidden="true" />,
      title: { en: c.name_en, hi: c.name_hi },
      description: hasTypes ? { en, hi } : undefined,
      descriptionKey: hasTypes ? undefined : 'common.noSubtypesYet',
      href: `/activities?event_category=${c.value}#listing`,
    };
  });

  return (
    <>
      {/* Page header - stays generic "Activities" regardless of the selected category */}
      <LocalizedHero
        titleKey="page.activities.title"
        subtitleKey="page.activities.subtitle"
        breadcrumb={[{ labelKey: 'page.activities.title' }]}
        compact
      />

      {/* Browse by Category - master-driven, ordered by display_order */}
      <div className="border-b border-border bg-muted/40">
        <Container className="py-5">
          <CategoryBrowseHeading compact />
          <CategoryCards categories={activityCategories} />
        </Container>
      </div>

      {/* Full listing - same-page filters; category cards above set the same event_category param */}
      <Container id="listing" className="scroll-mt-24 py-5">
        <CategoryListingHeader
          selected={selectedCategoryOption}
          allLabelKey="page.activities.allActivities"
          filterHintKey="page.activities.filterHint"
          browseHintKey="page.activities.browseHint"
        />
        <div className="mb-2">
          <FilterBar
            searchPlaceholderKey="search.placeholder.activities"
            selects={[
              ...(selectedCategory
                ? [{ key: 'event_type', multiple: true, labelKey: 'filter.type', options: eventTypes } satisfies FilterSelect]
                : []),
              {
                key: 'event_status',
                labelKey: 'filter.status',
                options: enumOptions(['scheduled', 'ongoing', 'completed', 'postponed', 'cancelled']),
              },
              { key: 'district', multiple: true, labelKey: 'filter.district', options: districts },
              { key: 'year', labelKey: 'filter.year', options: yearOptions() },
            ] satisfies FilterSelect[]}
          />
        </div>
        {!list.error && <ResultsSummary total={list.pagination.total_items} />}
        {list.items.length === 0 ? (
          <ListingEmptyState failed={list.error} filtered={Object.entries(searchParams).some(([key, value]) => key !== 'page' && Boolean(value))} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.items.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        <PaginationNav page={list.pagination.page} totalPages={list.pagination.total_pages} />
      </Container>

      <PageFaqSection pageKey="activities" />
    </>
  );
}
