import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Bell, FileStack, Megaphone, Gavel, Folder } from 'lucide-react';
import { getListSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import type { DocumentSummary, TenderSummary } from '@/lib/types/content';
import { buildMetadata } from '@/lib/seo';
import { PAGE_SIZE, toPage, qstr, getMasterOptions, yearOptions } from '@/lib/listing';
import { FilterBar, type FilterSelect } from '@/components/listing/filter-bar';
import { PaginationNav } from '@/components/listing/pagination-nav';
import { ResultsSummary } from '@/components/listing/results-summary';
import { CategoryCards, type CategoryCardDef } from '@/components/listing/category-cards';
import { CategoryBrowseHeading, CategoryListingHeader } from '@/components/listing/category-listing-header';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { ListingEmptyState } from '@/components/feedback/states';
import { DocumentCard } from '@/components/cards/document-card';
import { TenderCard } from '@/components/cards/tender-card';
import { Container } from '@/components/ui/container';
import { PageFaqSection } from '@/components/content/page-faq-section';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Notifications',
  description: 'Notices, circulars and official communications from SIDHKOFED, Government of Jharkhand.',
  path: '/notifications',
});

type SP = Record<string, string | string[] | undefined>;

const ICON_CLASS = 'h-5 w-5 text-primary';

/** Deterministic icon per known communication-type slug; unrecognised/future types fall back
 *  to Folder (same fallback pattern as /activities' event-category icons). */
const CATEGORY_ICONS: Record<string, ReactNode> = {
  notice: <Bell className={ICON_CLASS} aria-hidden="true" />,
  circular: <FileStack className={ICON_CLASS} aria-hidden="true" />,
  'public-announcement': <Megaphone className={ICON_CLASS} aria-hidden="true" />,
};

/** Tenders uses its own backend endpoint, but this card keeps users on the
 * notifications page and swaps the listing below instead of opening a separate index. */
const TENDERS_CARD: CategoryCardDef = {
  icon: <Gavel className={ICON_CLASS} aria-hidden="true" />,
  titleKey: 'page.notifications.tenders.title',
  descriptionKey: 'page.notifications.tenders.subtitle',
  href: '/notifications?category=tenders#listing',
};

export default async function NotificationsPage({ searchParams }: { searchParams: SP }) {
  const page = toPage(searchParams.page);
  const selectedView = qstr(searchParams.category) === 'tenders' ? 'tenders' : 'documents';
  const selectedCategory = selectedView === 'documents' ? qstr(searchParams.communication_type) : undefined;

  const listPromise = selectedView === 'tenders'
    ? getListSafe<TenderSummary>(PUBLIC_ENDPOINTS.tenders, {
      query: {
        page,
        page_size: PAGE_SIZE,
        search: qstr(searchParams.search),
        tender_type: qstr(searchParams.tender_type),
        tender_status: qstr(searchParams.tender_status),
        year: qstr(searchParams.year),
        ordering: '-publish_date',
      },
    })
    : getListSafe<DocumentSummary>(PUBLIC_ENDPOINTS.documents, {
      query: {
        page,
        page_size: PAGE_SIZE,
        search: qstr(searchParams.search),
        document_section: 'notifications',
        communication_type: selectedCategory,
        document_type: qstr(searchParams.document_type),
        year: qstr(searchParams.year),
        ordering: '-publication_date',
      },
    });

  const [list, communicationTypes, tenderTypes] = await Promise.all([
    listPromise,
    getMasterOptions('communication-types'),
    selectedView === 'tenders' ? getMasterOptions('tender-types') : Promise.resolve([]),
  ]);

  // Document types per communication type - powers both the card descriptions and the type
  // filter's options (mirrors /activities' event-types-per-event-category).
  const typesByCategory = new Map(
    await Promise.all(
      communicationTypes.map(
        async (c) => [c.value, await getMasterOptions('document-types', { communicationType: c.value })] as const,
      ),
    ),
  );

  const selectedCategoryOption = communicationTypes.find((c) => c.value === selectedCategory);
  const documentTypes = selectedCategory ? (typesByCategory.get(selectedCategory) ?? []) : [];

  const notificationCategories: CategoryCardDef[] = [
    ...communicationTypes.map((c) => {
      const types = typesByCategory.get(c.value) ?? [];
      const hasTypes = types.length > 0;
      const en = types.map((t) => t.name_en).join(', ');
      const hi = types.map((t) => t.name_hi ?? t.name_en).join(', ');
      return {
        icon: CATEGORY_ICONS[c.value] ?? <Folder className={ICON_CLASS} aria-hidden="true" />,
        title: { en: c.name_en, hi: c.name_hi },
        description: hasTypes ? { en, hi } : undefined,
        descriptionKey: hasTypes ? undefined : ('common.noSubtypesYet' as const),
        href: `/notifications?communication_type=${c.value}#listing`,
      };
    }),
    TENDERS_CARD,
  ];

  return (
    <>
      {/* Page header - same band style as /publications */}
      <LocalizedHero
        titleKey="page.notifications.title"
        subtitleKey="page.notifications.subtitle"
        breadcrumb={[{ labelKey: 'page.notifications.title' }]}
      />

      {/* Browse by Category - master-driven, ordered by display_order */}
      <div className="border-b border-border bg-muted/40">
        <Container className="py-8">
          <CategoryBrowseHeading />
          <CategoryCards categories={notificationCategories} />
        </Container>
      </div>

      {/* Full listing - same-page filters; category cards above set the same communication_type
          param. Documents whose type parents to a Communication Type, sorted by publication_date
          (same shape as /publications). Notices/circulars issued as Official Communications keep
          living at /notifications/notices, unaffected by this listing. */}
      <Container id="listing" className="scroll-mt-24 py-8">
        <CategoryListingHeader
          selected={selectedView === 'tenders' ? undefined : selectedCategoryOption}
          allLabelKey="page.notifications.allNotifications"
          filterHintKey="page.notifications.filterHint"
          browseHintKey="page.notifications.browseHint"
          forced={
            selectedView === 'tenders'
              ? { titleKey: 'page.notifications.tendersCardTitle', hintKey: 'page.notifications.tendersBrowseHint' }
              : undefined
          }
        />
        <div className="mb-2">
          <FilterBar
            searchPlaceholderKey="search.placeholder.notifications"
            selects={selectedView === 'tenders'
              ? [
                { key: 'tender_type', labelKey: 'filter.type', options: tenderTypes },
                {
                  key: 'tender_status',
                  labelKey: 'filter.status',
                  options: [
                    { value: 'open', name_en: 'Open', name_hi: 'खुला' },
                    { value: 'closed', name_en: 'Closed', name_hi: 'बंद' },
                    { value: 'cancelled', name_en: 'Cancelled', name_hi: 'रद्द' },
                    { value: 'awarded', name_en: 'Awarded', name_hi: 'प्रदत्त' },
                  ],
                },
                { key: 'year', labelKey: 'filter.year', options: yearOptions() },
              ] satisfies FilterSelect[]
              : [
                ...(selectedCategory
                  ? [{ key: 'document_type', multiple: true, labelKey: 'filter.documentType', options: documentTypes } satisfies FilterSelect]
                  : []),
                { key: 'year', labelKey: 'filter.year', options: yearOptions() },
              ] satisfies FilterSelect[]}
          />
        </div>
        {!list.error && <ResultsSummary total={list.pagination.total_items} />}
        {list.items.length === 0 ? (
          <ListingEmptyState failed={list.error} filtered={Object.entries(searchParams).some(([key, value]) => key !== 'page' && Boolean(value))} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {selectedView === 'tenders'
              ? (list.items as TenderSummary[]).map((tender) => (
                <TenderCard key={tender.id} tender={tender} />
              ))
              : (list.items as DocumentSummary[]).map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
          </div>
        )}
        <PaginationNav page={list.pagination.page} totalPages={list.pagination.total_pages} />
      </Container>

      <PageFaqSection pageKey="notifications" />
    </>
  );
}
