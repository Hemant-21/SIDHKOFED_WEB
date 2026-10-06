import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/container';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { AccessibilityStatementBody } from '@/components/content/accessibility-statement-body';

export const metadata: Metadata = buildMetadata({
  title: 'Accessibility Statement',
  description: 'Accessibility standards this website aims to meet, and how to report a barrier.',
  path: '/accessibility-statement',
});

export default function AccessibilityStatementPage() {
  return (
    <>
      <LocalizedHero
        titleKey="page.accessibilityStatement.title"
        subtitleKey="page.accessibilityStatement.subtitle"
        breadcrumb={[{ labelKey: 'page.accessibilityStatement.title' }]}
      />
      <Container className="py-12">
        <AccessibilityStatementBody />
      </Container>
    </>
  );
}
