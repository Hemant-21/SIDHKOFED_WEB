import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getOneOrNull } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS, detailPath } from '@/lib/api/endpoints';
import type { PublicOperationalReport } from '@/lib/types/content';
import { buildMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumb';
import { Container } from '@/components/ui/container';
import { OperationalReportCard } from '@/components/dashboard/operational-report-card';

export const revalidate = 300;

const load = (key: string) =>
  getOneOrNull<PublicOperationalReport>(detailPath(PUBLIC_ENDPOINTS.operationalReports, key));

export async function generateMetadata({ params }: { params: { report: string } }): Promise<Metadata> {
  const report = await load(params.report);
  if (!report) return { title: 'Report not found' };
  return buildMetadata({
    title: report.title_en,
    description: null,
    path: `/impact/dashboard/${params.report}`,
  });
}

export default async function DashboardReportPage({ params }: { params: { report: string } }) {
  const report = await load(params.report);
  if (!report) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Impact', href: '/impact' },
          { label: 'Public Dashboard', href: '/impact/dashboard' },
          { label: report.title_en },
        ]}
      />
      <Container className="py-8">
        <OperationalReportCard report={report} />
      </Container>
    </>
  );
}
