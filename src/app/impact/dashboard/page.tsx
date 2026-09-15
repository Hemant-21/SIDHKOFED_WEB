import type { Metadata } from 'next';
import { getOneSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import type { OperationalReportsResponse } from '@/lib/types/content';
import { buildMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumb';
import { Container } from '@/components/ui/container';
import { LocalizedHero } from '@/components/listing/localized-heading';
import { OperationalReportCard } from '@/components/dashboard/operational-report-card';
import { EmptyState } from '@/components/feedback/states';
import { PageFaqSection } from '@/components/content/page-faq-section';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Public dashboard',
  description: 'Live operational reports and impact figures, sourced from the CMS.',
  path: '/impact/dashboard',
});

/**
 * The public dashboard's data source is now the live Operational Reports endpoint
 * (`GET /public/operational-reports`) — the six operational reports, restricted to
 * public-eligible measures, calculated for the current financial year. This
 * replaces the retired `DashboardReport`/`DashboardMetric` fixed-catalog concept
 * (previously grouped into training/procurement/membership/programmes buckets);
 * with only six reports total, a flat list of sections reads cleanly without that
 * extra grouping layer.
 */
export default async function DashboardPage() {
  const data = await getOneSafe<OperationalReportsResponse>(PUBLIC_ENDPOINTS.operationalReports);
  const reports = data?.reports ?? [];

  return (
    <>
      <Breadcrumbs items={[{ label: 'Public dashboard' }]} />

      {/* Page header — same band style as /notifications and /publications */}
      <LocalizedHero titleKey="page.dashboard.title" subtitleKey="page.dashboard.subtitle" />

      <Container className="py-8">
        {reports.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <OperationalReportCard
                key={report.report_key}
                report={report}
                linkHref={`/impact/dashboard/${report.report_key}`}
              />
            ))}
          </div>
        )}
      </Container>

      <PageFaqSection pageKey="impact-dashboard" />
    </>
  );
}
