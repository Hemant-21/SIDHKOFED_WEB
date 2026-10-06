import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/container';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { DisclaimerBody } from '@/components/content/disclaimer-body';

export const metadata: Metadata = buildMetadata({
  title: 'Disclaimer',
  description: 'Disclaimer for the SIDHKOFED website.',
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <>
      <LocalizedHero
        titleKey="page.disclaimer.title"
        subtitleKey="page.disclaimer.subtitle"
        breadcrumb={[{ labelKey: 'page.disclaimer.title' }]}
      />
      <Container className="py-12">
        <DisclaimerBody />
      </Container>
    </>
  );
}
