import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { GraduationCap, ImageIcon, BookOpen, FileText, Folder } from 'lucide-react';
import { getListSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import type { DocumentSummary } from '@/lib/types/content';
import { buildMetadata } from '@/lib/seo';
import { PAGE_SIZE, toPage, qstr, getMasterOptions, yearOptions } from '@/lib/listing';
import { CategoryCards, type CategoryCardDef } from '@/components/listing/category-cards';
import { CategoryBrowseHeading, CategoryListingHeader } from '@/components/listing/category-listing-header';
import { FilterBar, type FilterSelect } from '@/components/listing/filter-bar';
import { PaginationNav } from '@/components/listing/pagination-nav';
import { ResultsSummary } from '@/components/listing/results-summary';
import { ListingEmptyState } from '@/components/feedback/states';
import { DocumentCard } from '@/components/cards/document-card';
import { Container } from '@/components/ui/container';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { PageFaqSection } from '@/components/content/page-faq-section';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Publications',
  description: 'Acts, rules, SOPs, research, publications and training resources.',
  path: '/publications',
});

type SP = Record<string, string | string[] | undefined>;

const ICON_CLASS = 'h-5 w-5 text-primary';

/** Deterministic icon per known knowledge-category slug; unrecognised/future categories fall
 *  back to Folder (same fallback pattern as /activities' event-category icons). */
const CATEGORY_ICONS: Record<string, ReactNode> = {
  'bye-laws': <FileText className={ICON_CLASS} aria-hidden="true" />,
  'training-resources': <GraduationCap className={ICON_CLASS} aria-hidden="true" />,
  'sops-and-manuals': <BookOpen className={ICON_CLASS} aria-hidden="true" />,
  'policies-and-guidelines': <FileText className={ICON_CLASS} aria-hidden="true" />,
  'forms-and-formats': <FileText className={ICON_CLASS} aria-hidden="true" />,
  'research-and-reports': <FileText className={ICON_CLASS} aria-hidden="true" />,
};

/** Media Gallery is a separate content type (galleries/videos, not a knowledge-category-scoped
 *  Document listing) with its own dedicated page - kept as a static extra card alongside the
 *  master-driven knowledge-category cards, same treatment as Tenders on /notifications. */
const MEDIA_CARD: CategoryCardDef = {
  icon: <ImageIcon className={ICON_CLASS} aria-hidden="true" />,
  titleKey: 'page.publications.category.media.title',
  descriptionKey: 'page.publications.category.media.subtitle',
  href: '/publications/media',
};

export default async function PublicationsPage({ searchParams }: { searchParams: SP }) {
  const page = toPage(searchParams.page);
  const selectedCategory = qstr(searchParams.knowledge_category);

  const [list, knowledgeCategories] = await Promise.all([
    getListSafe<DocumentSummary>(PUBLIC_ENDPOINTS.knowledgeCentre, {
      query: {
        page,
        page_size: PAGE_SIZE,
        search: qstr(searchParams.search),
        knowledge_category: selectedCategory,
        document_type: qstr(searchParams.document_type),
        year: qstr(searchParams.year),
        ordering: '-publication_date',
      },
    }),
    getMasterOptions('knowledge-categories'),
  ]);

  // Document types per knowledge category - powers both the card descriptions and the type
  // filter's options (mirrors /activities' event-types-per-event-category).
  const typesByCategory = new Map(
    await Promise.all(
      knowledgeCategories.map(
        async (c) => [c.value, await getMasterOptions('document-types', { knowledgeCategory: c.value })] as const,
      ),
    ),
  );

  const selectedCategoryOption = knowledgeCategories.find((c) => c.value === selectedCategory);
  const documentTypes = selectedCategory ? (typesByCategory.get(selectedCategory) ?? []) : [];

  const publicationCategories: CategoryCardDef[] = [
    ...knowledgeCategories.map((c) => {
      const types = typesByCategory.get(c.value) ?? [];
      const hasTypes = types.length > 0;
      const en = types.map((t) => t.name_en).join(', ');
      const hi = types.map((t) => t.name_hi ?? t.name_en).join(', ');
      return {
        icon: CATEGORY_ICONS[c.value] ?? <Folder className={ICON_CLASS} aria-hidden="true" />,
        title: { en: c.name_en, hi: c.name_hi },
        description: hasTypes ? { en, hi } : undefined,
        descriptionKey: hasTypes ? undefined : ('common.noSubtypesYet' as const),
        href: `/publications?knowledge_category=${c.value}#listing`,
      };
    }),
    MEDIA_CARD,
  ];

  return (
    <>
      {/* Page header */}
      <LocalizedHero
        titleKey="page.publications.title"
        subtitleKey="page.publications.subtitle"
        breadcrumb={[{ labelKey: 'page.publications.title' }]}
      />

      {/* Category nav cards - master-driven, ordered by display_order */}
      <div className="bg-muted/40 border-b border-border">
        <Container className="py-8">
          <CategoryBrowseHeading />
          <CategoryCards categories={publicationCategories} />
        </Container>
      </div>

      {/* Full listing - same-page filters; category cards above set the same knowledge_category param */}
      <Container id="listing" className="scroll-mt-24 py-8">
        <CategoryListingHeader
          selected={selectedCategoryOption}
          allLabelKey="page.publications.allPublications"
          filterHintKey="page.publications.filterHint"
          browseHintKey="page.publications.browseHint"
        />
        <div className="mb-2">
          <FilterBar
            searchPlaceholderKey="search.placeholder.publications"
            selects={[
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
            {list.items.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        )}
        <PaginationNav page={list.pagination.page} totalPages={list.pagination.total_pages} />
      </Container>

      <PageFaqSection pageKey="publications" />
    </>
  );
}
