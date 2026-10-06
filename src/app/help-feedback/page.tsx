import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/container';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { HelpFeedbackBody } from '@/components/content/help-feedback-body';

export const metadata: Metadata = buildMetadata({
  title: 'Help and Feedback',
  description: 'How to get help using this website, and how to share feedback.',
  path: '/help-feedback',
});

export default function HelpFeedbackPage() {
  return (
    <>
      <LocalizedHero
        titleKey="page.helpFeedback.title"
        subtitleKey="page.helpFeedback.subtitle"
        breadcrumb={[{ labelKey: 'page.helpFeedback.title' }]}
      />
      <Container className="py-12">
        <HelpFeedbackBody />
      </Container>
    </>
  );
}
