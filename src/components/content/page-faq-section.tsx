import type { Faq } from '@/lib/types/content';
import { getListSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import { Container } from '@/components/ui/container';
import { FaqAccordion } from '@/components/details/faq-accordion';
import { FaqSectionHeading } from './faq-section-heading';
import type { TranslationKey } from '@/i18n/dictionary';

const PAGE_SIZE = 100;
const MAX_PAGES = 5; // 500 FAQs on one main page is far beyond any realistic assignment.

/**
 * The FAQ block for one registered main page (faqs.pages.registry.ts on the backend), rendered as
 * the last content section before the shared footer - mount it as the final JSX element on each
 * target page, never in layout.tsx or a `[slug]` detail layout (that would leak it onto every
 * detail page). Fetches ALL FAQs assigned to `pageKey`, in that page's own order; renders nothing
 * on an empty result or a fetch failure (`getListSafe` never throws - a failed fetch just comes
 * back with zero items) rather than showing an empty accordion.
 */
export async function PageFaqSection({
  pageKey,
  titleKey = 'page.faqs.title',
  viewAllHref = '/faqs',
  viewAllLabelKey = 'common.viewAllFaqs',
}: {
  pageKey: string;
  /** i18n key for the section title - resolved client-side so this stays localized
   *  (this component itself is a Server Component and fetches data, so it can't call
   *  `useLanguage()` directly; see `FaqSectionHeading`). */
  titleKey?: TranslationKey;
  viewAllHref?: string | null;
  viewAllLabelKey?: TranslationKey;
}) {
  const faqs: Faq[] = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const result = await getListSafe<Faq>(PUBLIC_ENDPOINTS.faqs, { query: { page_key: pageKey, page, page_size: PAGE_SIZE } });
    if (result.error) break;
    faqs.push(...result.items);
    if (page >= result.pagination.total_pages) break;
  }

  if (faqs.length === 0) return null;

  return (
    <section className="border-t border-border">
      <Container className="py-12 md:py-14">
        <FaqSectionHeading
          titleKey={titleKey}
          viewAllHref={viewAllHref ?? undefined}
          viewAllLabelKey={viewAllLabelKey}
        />
        <FaqAccordion faqs={faqs} />
      </Container>
    </section>
  );
}
