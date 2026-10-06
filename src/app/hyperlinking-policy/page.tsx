import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/container';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { HyperlinkingPolicyBody } from '@/components/content/hyperlinking-policy-body';

export const metadata: Metadata = buildMetadata({
  title: 'Hyperlinking Policy',
  description: 'How this website links to, and may be linked from, other websites.',
  path: '/hyperlinking-policy',
});

export default function HyperlinkingPolicyPage() {
  return (
    <>
      <LocalizedHero
        titleKey="page.hyperlinkingPolicy.title"
        subtitleKey="page.hyperlinkingPolicy.subtitle"
        breadcrumb={[{ labelKey: 'page.hyperlinkingPolicy.title' }]}
      />
      <Container className="py-12">
        <HyperlinkingPolicyBody />
      </Container>
    </>
  );
}
