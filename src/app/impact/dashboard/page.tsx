import type { Metadata } from 'next';
import { getOneSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import type { PublicFinancialYearSummary, PublicReportBundle } from '@/lib/types/reports';
import { buildMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumb';
import { Container } from '@/components/ui/container';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { PublicReportsDashboard } from '@/components/dashboard/reports/public-reports-dashboard';
import { PageFaqSection } from '@/components/content/page-faq-section';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Public dashboard',
  description: 'Approved Programme, District Activity Coverage, and Commodity-wise reports, published per financial year.',
  path: '/impact/dashboard',
});

/**
 * Replaces the six-report Operational Reports public dashboard with the three approved-snapshot
 * report tabs (Task 6). Never queries live operational data — reads only from immutable, approved
 * `ReportPublication` snapshots via `/public/reports/*`. Defaults to the current FY if it has been
 * published; otherwise falls back to the most recently published FY and says so explicitly
 * (`PublicReportsDashboard` renders that notice) rather than silently presenting another FY as
 * current.
 */
export default async function DashboardPage() {
  const years = (await getOneSafe<PublicFinancialYearSummary[]>(PUBLIC_ENDPOINTS.reportYears)) ?? [];
  const current = years.find((y) => y.isCurrentFinancialYear);
  const defaultLabel =
    current?.isPublished
      ? current.label
      : years.filter((y) => y.isPublished).sort((a, b) => b.startDate.localeCompare(a.startDate))[0]?.label ?? null;

  const initialBundle = defaultLabel
    ? await getOneSafe<PublicReportBundle>(PUBLIC_ENDPOINTS.reportsForYear(defaultLabel))
    : null;

  return (
    <>
      <Breadcrumbs items={[{ label: 'Public dashboard' }]} />

      <LocalizedHero titleKey="page.dashboard.title" subtitleKey="page.dashboard.subtitle" />

      <Container className="py-8">
        <PublicReportsDashboard years={years} initialLabel={defaultLabel} initialBundle={initialBundle} />
      </Container>

      <PageFaqSection pageKey="impact-dashboard" />
    </>
  );
}
