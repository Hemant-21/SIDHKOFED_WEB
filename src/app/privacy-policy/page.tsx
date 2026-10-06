import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/container';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { PrivacyPolicyBody } from '@/components/content/privacy-policy-body';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'Privacy policy for the SIDHKOFED website.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <LocalizedHero
        titleKey="page.privacyPolicy.title"
        subtitleKey="page.privacyPolicy.subtitle"
        breadcrumb={[{ labelKey: 'page.privacyPolicy.title' }]}
      />
      <Container className="py-12">
        <PrivacyPolicyBody />
      </Container>
    </>
  );
}
