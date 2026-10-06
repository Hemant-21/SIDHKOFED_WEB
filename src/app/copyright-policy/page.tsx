import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/container';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { CopyrightPolicyBody } from '@/components/content/copyright-policy-body';

export const metadata: Metadata = buildMetadata({
  title: 'Copyright Policy',
  description: 'Copyright terms for content published on the SIDHKOFED website.',
  path: '/copyright-policy',
});

export default function CopyrightPolicyPage() {
  return (
    <>
      <LocalizedHero
        titleKey="page.copyrightPolicy.title"
        subtitleKey="page.copyrightPolicy.subtitle"
        breadcrumb={[{ labelKey: 'page.copyrightPolicy.title' }]}
      />
      <Container className="py-12">
        <CopyrightPolicyBody />
      </Container>
    </>
  );
}
