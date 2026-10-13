import { env } from '@/config/env';

/**
 * Structured data (JSON-LD) helpers for SEO. Rendered as a <script> tag in Server
 * Components. Only data that maps cleanly to schema.org types is emitted; values
 * come from backend content, never fabricated.
 */

/**
 * Serialize JSON-LD safely for inline injection. Values originate from CMS content,
 * so a title/answer could contain `</script>` (or the U+2028/U+2029 line separators)
 * and break out of the <script> block. Escaping `<`, `>`, `&` and those separators to
 * their unicode escapes keeps the payload valid JSON while making script-tag breakout
 * impossible. (U+2028/U+2029 are referenced via charCode so the source carries no raw
 * line-separator characters.)
 */
const LINE_SEP = String.fromCharCode(0x2028);
const PARA_SEP = String.fromCharCode(0x2029);

function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .split(LINE_SEP)
    .join('\\u2028')
    .split(PARA_SEP)
    .join('\\u2029');
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${env.siteUrl}/#website`,
        url: env.siteUrl,
        name: 'SIDHKOFED',
        alternateName: [
          'Sidho-Kanho Agriculture and Forest Produce State Co-operative Federation Ltd.',
          'SIDHKOFED Jharkhand',
        ],
        inLanguage: ['en-IN', 'hi-IN'],
        publisher: { '@id': `${env.siteUrl}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${env.siteUrl}/search?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

export function OrganizationJsonLd({ sameAs = [] }: { sameAs?: string[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'GovernmentOrganization',
        '@id': `${env.siteUrl}/#organization`,
        name: 'Sidho-Kanho Agriculture and Forest Produce State Co-operative Federation Ltd.',
        alternateName: 'SIDHKOFED',
        url: env.siteUrl,
        logo: `${env.siteUrl}/logo-sidhkofed.png`,
        description:
          'Jharkhand state cooperative federation supporting agriculture and minor forest produce livelihoods, programmes and market access.',
        areaServed: 'Jharkhand, India',
        ...(sameAs.length > 0 ? { sameAs } : {}),
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; url: string }> }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${env.siteUrl}${item.url}`,
        })),
      }}
    />
  );
}

export function ArticleJsonLd({
  headline,
  description,
  datePublished,
  image,
  url,
}: {
  headline: string;
  description?: string | null;
  datePublished?: string | null;
  image?: string | null;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline,
        ...(description ? { description } : {}),
        ...(datePublished ? { datePublished } : {}),
        ...(image ? { image: [image] } : {}),
        mainEntityOfPage: `${env.siteUrl}${url}`,
        author: { '@id': `${env.siteUrl}/#organization` },
        publisher: { '@id': `${env.siteUrl}/#organization` },
      }}
    />
  );
}

/** Publisher reference shared by the content types below (resolves to the home page entity). */
const PUBLISHER = { '@id': `${env.siteUrl}/#organization` };

export function EventJsonLd({
  name,
  description,
  startDate,
  endDate,
  location,
  image,
  url,
}: {
  name: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  image?: string | null;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Event',
        name,
        ...(description ? { description } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
        ...(location
          ? {
              location: {
                '@type': 'Place',
                name: location,
                address: { '@type': 'PostalAddress', addressRegion: 'Jharkhand', addressCountry: 'IN' },
              },
            }
          : {}),
        ...(image ? { image: [image] } : {}),
        organizer: PUBLISHER,
        url: `${env.siteUrl}${url}`,
      }}
    />
  );
}

/** A published file (act, SOP, report, notice...). Maps to schema.org DigitalDocument. */
export function DocumentJsonLd({
  name,
  description,
  datePublished,
  fileUrl,
  mimeType,
  url,
}: {
  name: string;
  description?: string | null;
  datePublished?: string | null;
  fileUrl?: string | null;
  mimeType?: string | null;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'DigitalDocument',
        name,
        ...(description ? { description } : {}),
        ...(datePublished ? { datePublished } : {}),
        ...(mimeType ? { encodingFormat: mimeType } : {}),
        ...(fileUrl ? { contentUrl: fileUrl } : {}),
        mainEntityOfPage: `${env.siteUrl}${url}`,
        publisher: PUBLISHER,
      }}
    />
  );
}

/**
 * A tender notice. schema.org has no Tender type, so this is a plain WebPage carrying the
 * tender number as `identifier` and the bid deadline as `expires` - accurate, and it lets
 * crawlers see publish/expiry dates without claiming a rich-result type that doesn't exist.
 */
export function TenderJsonLd({
  name,
  description,
  tenderNumber,
  datePublished,
  submissionDeadline,
  url,
}: {
  name: string;
  description?: string | null;
  tenderNumber?: string | null;
  datePublished?: string | null;
  submissionDeadline?: string | null;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name,
        ...(description ? { description } : {}),
        ...(tenderNumber ? { identifier: tenderNumber } : {}),
        ...(datePublished ? { datePublished } : {}),
        ...(submissionDeadline ? { expires: submissionDeadline } : {}),
        url: `${env.siteUrl}${url}`,
        isPartOf: { '@id': `${env.siteUrl}/#website` },
        publisher: PUBLISHER,
      }}
    />
  );
}

/** A scheme / programme / service offered by SIDHKOFED (schema.org GovernmentService). */
export function ServiceJsonLd({
  name,
  description,
  serviceType,
  image,
  url,
}: {
  name: string;
  description?: string | null;
  serviceType?: string | null;
  image?: string | null;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'GovernmentService',
        name,
        ...(description ? { description } : {}),
        ...(serviceType ? { serviceType } : {}),
        ...(image ? { image: [image] } : {}),
        url: `${env.siteUrl}${url}`,
        provider: PUBLISHER,
        areaServed: { '@type': 'AdministrativeArea', name: 'Jharkhand, India' },
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: Array<{ question: string; answer: string }> }) {
  if (items.length === 0) return null;
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }}
    />
  );
}
