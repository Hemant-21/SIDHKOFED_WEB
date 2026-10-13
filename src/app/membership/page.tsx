import type { Metadata } from 'next';
import { getListSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import type { MembershipSummary } from '@/lib/types/content';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/container';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { MemberHierarchy } from '@/components/membership/member-hierarchy';
import {
  MembershipUnderstandingSection,
  MembershipProcessSection,
  MembershipFormsSection,
  MembershipDirectoryIntro,
  MembershipDirectoryFootnote,
  MembershipCta,
} from '@/components/membership/membership-content';
import { ServiceJsonLd } from '@/components/seo/json-ld';
import { PageFaqSection } from '@/components/content/page-faq-section';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Membership',
  description:
    'Understand SIDHKOFED cooperative membership - types, benefits, application process and member directory.',
  path: '/membership',
});

export default async function MembershipPage() {
  const [apex, duList] = await Promise.all([
    getListSafe<MembershipSummary>(PUBLIC_ENDPOINTS.memberships, {
      query: { membership_level: 'sidhkofed', page_size: 5 },
    }),
    getListSafe<MembershipSummary>(PUBLIC_ENDPOINTS.memberships, {
      query: { membership_level: 'district_union', page_size: 50, ordering: 'display_order' },
    }),
  ]);

  const apexRecord = apex.items[0] ?? null;
  const duRecords = duList.items;
  const totalPrimary = duRecords.reduce((sum, r) => sum + r.primary_member_count, 0);
  const totalNominal = duRecords.reduce((sum, r) => sum + r.nominal_member_count, 0);

  return (
    <>
      <ServiceJsonLd
        name="SIDHKOFED cooperative membership"
        description="Membership of the SIDHKOFED cooperative federation - types, benefits, application process and member directory."
        serviceType="Cooperative membership"
        url="/membership"
      />
      {/* ── PAGE HEADER ── */}
      <LocalizedHero
        titleKey="page.membership.title"
        subtitleKey="page.membership.subtitle"
        breadcrumb={[{ labelKey: 'page.membership.title' }]}
      />

      {/* ── SECTION 1: WHAT DOES MEMBERSHIP MEAN ── */}
      <Container className="py-12">
        <MembershipUnderstandingSection />
      </Container>

      {/* ── SECTION 2: APPLICATION PROCESS + FEE ── */}
      <div className="bg-muted/40">
        <Container className="py-12">
          <MembershipProcessSection />
        </Container>
      </div>

      {/* ── SECTION 3: MEMBERSHIP FORMS ── */}
      <div id="membership-forms">
        <Container className="py-12">
          <MembershipFormsSection />
        </Container>
      </div>

      {/* ── SECTION 4: MEMBER HIERARCHY ── */}
      <div className="bg-muted/40">
        <Container className="py-12">
          <MembershipDirectoryIntro />
          <MemberHierarchy
            apexRecord={apexRecord}
            duRecords={duRecords}
            totalPrimary={totalPrimary}
            totalNominal={totalNominal}
          />
          <MembershipDirectoryFootnote />
        </Container>
      </div>

      {/* ── SECTION 5: APPLY CTA ── */}
      <Container className="py-12">
        <MembershipCta />
      </Container>

      {/* ── SECTION 6: FAQs - the last content section, immediately above the shared footer ── */}
      <PageFaqSection pageKey="membership" />
    </>
  );
}
