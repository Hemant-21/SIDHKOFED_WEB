import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/container';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { SitemapBody } from '@/components/content/sitemap-body';

export const metadata: Metadata = buildMetadata({
  title: 'Sitemap',
  description: 'A full list of sections on the SIDHKOFED website.',
  path: '/sitemap',
});

export default function SitemapPage() {
  return (
    <>
      <LocalizedHero
        titleKey="page.sitemap.title"
        subtitleKey="page.sitemap.subtitle"
        breadcrumb={[{ labelKey: 'page.sitemap.title' }]}
      />
      <Container className="py-12">
        <SitemapBody />
      </Container>
    </>
  );
}
