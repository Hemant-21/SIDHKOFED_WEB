import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { GraduationCap, ImageIcon, BookOpen, FileText, Folder } from 'lucide-react';
import { getListSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import type { DocumentSummary } from '@/lib/types/content';
import { buildMetadata } from '@/lib/seo';
import { PAGE_SIZE, toPage, qstr, getMasterOptions, yearOptions } from '@/lib/listing';
import { CategoryCards, type CategoryCardDef } from '@/components/listing/category-cards';
import { FilterBar } from '@/components/listing/filter-bar';
import { PaginationNav } from '@/components/listing/pagination-nav';
import { ResultsSummary } from '@/components/listing/results-summary';
import { ListingEmptyState } from '@/components/feedback/states';
import { DocumentCard } from '@/components/cards/document-card';
import { Breadcrumbs } from '@/components/ui/breadcrumb';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
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
 *  Document listing) with its own dedicated page — kept as a static extra card alongside the
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

  // Document types per knowledge category — powers both the card descriptions and the type
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
      const en = types.length ? types.map((t) => t.name_en).join(', ') : 'No document types yet.';
      const hi = types.length ? types.map((t) => t.name_hi ?? t.name_en).join(', ') : undefined;
      return {
        icon: CATEGORY_ICONS[c.value] ?? <Folder className={ICON_CLASS} aria-hidden="true" />,
        titleKey: '',
        descriptionKey: '',
        title: { en: c.name_en, hi: c.name_hi },
        description: { en, hi },
        href: `/publications?knowledge_category=${c.value}#listing`,
      };
    }),
    MEDIA_CARD,
  ];

  return (
    <>
      <Breadcrumbs items={[{ label: 'Publications' }]} />

      {/* Page header */}
      <div className="bg-primary">
        <Container className="py-10 sm:py-14">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Publications</h1>
          <p className="mt-2 max-w-2xl text-base text-white/70">
            Acts, rules, SOPs, annual reports, training materials and official forms from SIDHKOFED.
          </p>
        </Container>
      </div>

      {/* Category nav cards — master-driven, ordered by display_order */}
      <div className="bg-muted/40 border-b border-border">
        <Container className="py-8">
          <SectionHeading title="Browse by Category" />
          <CategoryCards categories={publicationCategories} />
        </Container>
      </div>

      {/* Full listing — same-page filters; category cards above set the same knowledge_category param */}
      <Container id="listing" className="scroll-mt-24 py-8">
        <header className="mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {selectedCategoryOption ? selectedCategoryOption.name_en : 'All Publications'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedCategoryOption
              ? `Filter ${selectedCategoryOption.name_en.toLowerCase()} by document type, or browse another category above.`
              : 'Browse the complete document library or filter by document type, or pick a category above.'}
          </p>
        </header>
        <div className="mb-2">
          <FilterBar
            selects={[
              ...(selectedCategory
                ? [{ key: 'document_type', multiple: true, labelKey: 'filter.documentType', options: documentTypes }]
                : []),
              { key: 'year', labelKey: 'filter.year', options: yearOptions() },
            ]}
          />
        </div>
        {!list.error && <ResultsSummary total={list.pagination.total_items} />}
        {list.items.length === 0 ? (
          <ListingEmptyState failed={list.error} filtered={Object.entries(searchParams).some(([key, value]) => key !== 'page' && Boolean(value))} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
