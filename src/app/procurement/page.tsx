import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { IndianRupee, Megaphone, Award, Handshake, Folder } from 'lucide-react';
import { getListSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import type { ProcurementSummary } from '@/lib/types/content';
import { buildMetadata } from '@/lib/seo';
import { PAGE_SIZE, toPage, qstr, getMasterOptions, yearOptions } from '@/lib/listing';
import { FilterBar, type FilterSelect } from '@/components/listing/filter-bar';
import { PaginationNav } from '@/components/listing/pagination-nav';
import { ResultsSummary } from '@/components/listing/results-summary';
import { CategoryCards, type CategoryCardDef } from '@/components/listing/category-cards';
import { CategoryBrowseHeading, CategoryListingHeader } from '@/components/listing/category-listing-header';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { ListingEmptyState } from '@/components/feedback/states';
import { ProcurementCard } from '@/components/cards/procurement-card';
import { Container } from '@/components/ui/container';
import { PageFaqSection } from '@/components/content/page-faq-section';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Procurement',
  description: 'Minor forest produce and commodity procurement by SIDHKOFED across Jharkhand.',
  path: '/procurement',
});

type SP = Record<string, string | string[] | undefined>;

const ICON_CLASS = 'h-5 w-5 text-primary';

/** Deterministic icon per known category slug; unrecognised/future categories fall back to Folder. */
const CATEGORY_ICONS: Record<string, ReactNode> = {
  'rates-trade': <IndianRupee className={ICON_CLASS} aria-hidden="true" />,
  'announcements-schedules': <Megaphone className={ICON_CLASS} aria-hidden="true" />,
  achievements: <Award className={ICON_CLASS} aria-hidden="true" />,
};

/** The Timing filter's one real option; FilterBar always prepends its own "All" placeholder.
 *  Mirrors the `page.procurement.timingUpcomingOnly` dictionary key - a server component can't
 *  call `t()`, so the Hindi label is spelled out here too. */
const TIMING_OPTIONS = [{ value: 'true', name_en: 'Upcoming only', name_hi: 'केवल आगामी' }];


export default async function ProcurementPage({ searchParams }: { searchParams: SP }) {
  const page = toPage(searchParams.page);
  const upcoming = qstr(searchParams.upcoming) === 'true';
  const today = new Date().toISOString().slice(0, 10);
  const selectedCategory = qstr(searchParams.procurement_update_category);

  const [list, procurementCategories, commodities, districts] = await Promise.all([
    getListSafe<ProcurementSummary>(PUBLIC_ENDPOINTS.procurement, {
      query: {
        page,
        page_size: PAGE_SIZE,
        search: qstr(searchParams.search),
        procurement_update_category: selectedCategory,
        procurement_update_type: qstr(searchParams.procurement_update_type),
        commodity: qstr(searchParams.commodity),
        district: qstr(searchParams.district),
        year: qstr(searchParams.year),
        date_from: upcoming ? today : undefined,
        // Upcoming keeps its earliest-effective-date view; the default view now relies on the
        // API's public default ordering (published_at desc, nulls last, id tie-break).
        ordering: upcoming ? 'effective_date' : undefined,
      },
    }),
    getMasterOptions('procurement-update-categories'),
    getMasterOptions('commodities'),
    getMasterOptions('districts'),
  ]);

  // Procurement update types per category - powers both the card descriptions and the type
  // filter's options (only rendered once a category is selected).
  const typesByCategory = new Map(
    await Promise.all(
      procurementCategories.map(
        async (c) => [c.value, await getMasterOptions('procurement-update-types', { procurementCategory: c.value })] as const,
      ),
    ),
  );

  const selectedCategoryOption = procurementCategories.find((c) => c.value === selectedCategory);
  const procurementTypes = selectedCategory ? (typesByCategory.get(selectedCategory) ?? []) : [];

  const categoryCards: CategoryCardDef[] = [
    ...procurementCategories.map((c): CategoryCardDef => {
      const types = typesByCategory.get(c.value) ?? [];
      const hasTypes = types.length > 0;
      const en = types.map((t) => t.name_en).join(', ');
      const hi = types.map((t) => t.name_hi ?? t.name_en).join(', ');
      return {
        icon: CATEGORY_ICONS[c.value] ?? <Folder className={ICON_CLASS} aria-hidden="true" />,
        title: { en: c.name_en, hi: c.name_hi },
        description: hasTypes ? { en, hi } : undefined,
        descriptionKey: hasTypes ? undefined : 'common.noSubtypesYet',
        href: `/procurement?procurement_update_category=${c.value}#listing`,
      };
    }),
    {
      icon: <Handshake className={ICON_CLASS} aria-hidden="true" />,
      titleKey: 'page.procurement.enquiry.title',
      descriptionKey: 'page.procurement.enquiry.subtitle',
      href: '/procurement/enquiry',
    },
  ];

  return (
    <>
      {/* Page header - same band style as /publications. The "Submit Enquiry" CTA is the
          one terracotta action on this screen. */}
      <LocalizedHero
        titleKey="page.procurement.title"
        subtitleKey="page.procurement.subtitle"
        breadcrumb={[{ labelKey: 'page.procurement.title' }]}
        cta={{ labelKey: 'page.procurement.enquiry.cta', href: '/procurement/enquiry' }}
      />

      {/* Browse by Category - master-driven, ordered by display_order (Enquiry stays as a fixed non-category shortcut) */}
      <div className="border-b border-border bg-muted/40">
        <Container className="py-8">
          <CategoryBrowseHeading />
          <CategoryCards categories={categoryCards} />
        </Container>
      </div>

      {/* Full listing - same-page filters; the cards above set the same query params */}
      <Container id="listing" className="scroll-mt-24 py-8">
        <CategoryListingHeader
          selected={selectedCategoryOption}
          allLabelKey="page.procurement.allUpdates"
          filterHintKey="page.procurement.filterHint"
          browseHintKey="page.procurement.browseHint"
        />
        <div className="mb-2">
          <FilterBar
            searchPlaceholderKey="search.placeholder.procurement"
            selects={[
              { key: 'upcoming', labelKey: 'filter.timing', options: TIMING_OPTIONS },
              ...(selectedCategory
                ? [{ key: 'procurement_update_type', multiple: true, labelKey: 'filter.type', options: procurementTypes } satisfies FilterSelect]
                : []),
              { key: 'commodity', multiple: true, labelKey: 'filter.commodity', options: commodities },
              { key: 'district', multiple: true, labelKey: 'filter.district', options: districts },
              { key: 'year', labelKey: 'filter.year', options: yearOptions() },
            ] satisfies FilterSelect[]}
          />
        </div>
        {!list.error && <ResultsSummary total={list.pagination.total_items} />}
        {list.items.length === 0 ? (
          <ListingEmptyState failed={list.error} filtered={Object.entries(searchParams).some(([key, value]) => key !== 'page' && Boolean(value))} />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {list.items.map((item) => (
              <ProcurementCard key={item.id} item={item} />
            ))}
          </div>
        )}
        <PaginationNav page={list.pagination.page} totalPages={list.pagination.total_pages} />
      </Container>

      <PageFaqSection pageKey="procurement" />
    </>
  );
}
