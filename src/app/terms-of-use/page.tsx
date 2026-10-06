import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/container';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { TermsOfUseBody } from '@/components/content/terms-of-use-body';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Use',
  description: 'Terms governing use of the SIDHKOFED website.',
  path: '/terms-of-use',
});

export default function TermsOfUsePage() {
  return (
    <>
      <LocalizedHero
        titleKey="page.termsOfUse.title"
        subtitleKey="page.termsOfUse.subtitle"
        breadcrumb={[{ labelKey: 'page.termsOfUse.title' }]}
      />
      <Container className="py-12">
        <TermsOfUseBody />
      </Container>
    </>
  );
}
