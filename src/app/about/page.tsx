import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getListSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import type { Commodity } from '@/lib/types/api';
import type { TranslationKey } from '@/i18n/dictionary';
import { Container } from '@/components/ui/container';
import { AboutHero } from '@/components/content/about-hero';
import { CooperativeStructure } from '@/components/content/cooperative-structure';
import { OrgStructureSection } from '@/components/content/org-structure-section';
import { ContactCta } from '@/components/content/contact-cta';
import { CommodityTile } from '@/components/content/commodity-tile';
import { ObjectivesList } from '@/components/content/objectives-list';
import { VisionMissionCards } from '@/components/content/vision-mission-cards';
import { PageFaqSection } from '@/components/content/page-faq-section';
import { LocalizedHeading, LocalizedText, LocalizedTextInline } from '@/components/listing/localized-heading';

export const metadata: Metadata = buildMetadata({
  title: 'About SIDHKOFED',
  description:
    'Learn about SIDHKOFED, the Sidho-Kanho Agriculture and Forest Produce State Cooperative Federation Ltd., and its work for cooperative livelihoods across Jharkhand.',
  path: '/about',
});

const STATE_BOARD: { roleKey: TranslationKey; noteKey: TranslationKey }[] = [
  { roleKey: 'about.governance.state.role1', noteKey: 'about.governance.state.note1' },
  { roleKey: 'about.governance.state.role2', noteKey: 'about.governance.state.note2' },
  { roleKey: 'about.governance.state.role3', noteKey: 'about.governance.state.note3' },
  { roleKey: 'about.governance.state.role4', noteKey: 'about.governance.state.note4' },
  { roleKey: 'about.governance.state.role5', noteKey: 'about.governance.state.note5' },
  { roleKey: 'about.governance.state.role6', noteKey: 'about.governance.state.note6' },
  { roleKey: 'about.governance.state.role7', noteKey: 'about.governance.state.note7' },
  { roleKey: 'about.governance.state.role8', noteKey: 'about.governance.state.note8' },
  { roleKey: 'about.governance.state.role9', noteKey: 'about.governance.state.note9' },
];

const DISTRICT_BOARD: { roleKey: TranslationKey; noteKey: TranslationKey }[] = [
  { roleKey: 'about.governance.district.role1', noteKey: 'about.governance.district.note1' },
  { roleKey: 'about.governance.district.role2', noteKey: 'about.governance.district.note2' },
  { roleKey: 'about.governance.district.role3', noteKey: 'about.governance.district.note3' },
  { roleKey: 'about.governance.district.role4', noteKey: 'about.governance.district.note4' },
  { roleKey: 'about.governance.district.role5', noteKey: 'about.governance.district.note5' },
];

const OBJECTIVE_KEYS: TranslationKey[] = [
  'about.objectives.item1',
  'about.objectives.item2',
  'about.objectives.item3',
  'about.objectives.item4',
  'about.objectives.item5',
  'about.objectives.item6',
];

export default async function AboutPage() {
  const { items: commodities } = await getListSafe<Commodity>(`${PUBLIC_ENDPOINTS.masters}/commodities`, {
    query: { page_size: 100 },
    revalidate: 3600,
  });

  return (
    <>
      {/* ── 1. PAGE HEADER BAND ── */}
      <AboutHero />

      {/* ── 2. ABOUT + COOPERATIVE STRUCTURE ── */}
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4 text-base leading-relaxed text-foreground">
            <LocalizedText textKey="about.intro.paragraph1" />
            <LocalizedText textKey="about.intro.paragraph2" />
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <LocalizedTextInline textKey="about.cooperativeStructure.label" />
            </p>
            <CooperativeStructure />
          </div>
        </div>
      </Container>

      {/* ── 3. ORGANISATION STRUCTURE + GOVERNANCE ── */}
      <div className="bg-muted/40">
        <Container className="py-12">
          <OrgStructureSection stateBoard={STATE_BOARD} districtBoard={DISTRICT_BOARD} />
        </Container>
      </div>

      {/* ── 3B. OBJECTIVES + VISION & MISSION ── */}
      <Container className="py-10">
        <LocalizedHeading titleKey="about.objectives.title" as="h2" />
        <ObjectivesList itemKeys={OBJECTIVE_KEYS} />
        <div className="mt-6">
          <VisionMissionCards />
        </div>
      </Container>

      {/* ── 5. KEY COMMODITIES ── */}
      {commodities.length > 0 && (
        <div className="bg-muted/40">
          <Container className="py-12">
            <LocalizedHeading titleKey="about.keyCommodities.title" as="h2" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {commodities.map((c) => (
                <CommodityTile key={c.id} commodity={c} />
              ))}
            </div>
          </Container>
        </div>
      )}

      {/* ── 6. CONTACT CTA ── */}
      <Container className="py-12">
        <ContactCta />
      </Container>

      {/* ── 7. FAQ - the last content section, immediately above the shared footer ── */}
      <PageFaqSection pageKey="about" />
    </>
  );
}
