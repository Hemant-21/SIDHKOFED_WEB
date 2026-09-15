import type { Metadata } from 'next';
import { getListSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import type { Faq } from '@/lib/types/content';
import { buildMetadata } from '@/lib/seo';
import { PAGE_SIZE, toPage, qstr } from '@/lib/listing';
import { ListingLayout } from '@/components/listing/listing-layout';
import { FilterBar } from '@/components/listing/filter-bar';
import { PaginationNav } from '@/components/listing/pagination-nav';
import { ResultsSummary } from '@/components/listing/results-summary';
import { EmptyState } from '@/components/feedback/states';
import { FaqAccordion } from '@/components/details/faq-accordion';
import { FaqJsonLd } from '@/components/seo/json-ld';
import { stripTags } from '@/utils/sanitize-html';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Frequently asked questions',
  description: 'Answers to common questions about SIDHKOFED services and content.',
  path: '/faqs',
});

type SP = Record<string, string | string[] | undefined>;

/**
 * The complete FAQ directory — every eligible public FAQ, paginated, with search. No category
 * filter (categories are gone); page assignment doesn't affect this listing at all, since /faqs
 * intentionally shows FAQs regardless of which main pages (if any) they're also assigned to.
 */
export default async function FaqsPage({ searchParams }: { searchParams: SP }) {
  const page = toPage(searchParams.page);

  const list = await getListSafe<Faq>(PUBLIC_ENDPOINTS.faqs, {
    query: {
      page,
      page_size: PAGE_SIZE,
      search: qstr(searchParams.search),
    },
  });

  return (
    <ListingLayout
      titleKey="page.faqs.title"
      subtitleKey="page.faqs.subtitle"
      crumb="FAQs"
      filters={<FilterBar />}
      summary={<ResultsSummary total={list.pagination.total_items} />}
      pagination={<PaginationNav page={list.pagination.page} totalPages={list.pagination.total_pages} />}
    >
      <FaqJsonLd
        items={list.items.map((f) => ({ question: f.question_en, answer: stripTags(f.answer_en) }))}
      />
      {list.items.length === 0 ? <EmptyState /> : <FaqAccordion faqs={list.items} />}
    </ListingLayout>
  );
}
