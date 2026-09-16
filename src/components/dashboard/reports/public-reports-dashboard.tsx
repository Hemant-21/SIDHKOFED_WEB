'use client';

/**
 * Public Reports dashboard — the client-side orchestrator: shared FY selector and Programme/
 * District/Commodity tabs, all from one already-fetched FY bundle. Switching FY re-fetches the
 * bundle for that FY only (client-side; the endpoint reads straight from an immutable published
 * snapshot, never a live query). No Excel export, no live endpoint.
 */
import { useState } from 'react';
import { getOneClient } from '@/lib/api/client';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import { ProgrammeReportTable, DistrictReportTable, CommodityReportTable } from './report-tables';
import type { PublicFinancialYearSummary, PublicReportBundle, ReportKey } from '@/lib/types/reports';

const TABS: { key: ReportKey; label: string }[] = [
  { key: 'programme_report', label: 'Programme' },
  { key: 'district_activity_coverage', label: 'District Activity' },
  { key: 'commodity_report', label: 'Commodity-wise' },
];

function formatIst(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST';
}

export function PublicReportsDashboard({
  years,
  initialLabel,
  initialBundle,
}: {
  years: PublicFinancialYearSummary[];
  initialLabel: string | null;
  initialBundle: PublicReportBundle | null;
}) {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(initialLabel);
  const [bundle, setBundle] = useState<PublicReportBundle | null>(initialBundle);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<ReportKey>('programme_report');

  const publishedYears = years.filter((y) => y.isPublished);
  const currentYear = years.find((y) => y.isCurrentFinancialYear);

  const handleSelectYear = async (label: string) => {
    setSelectedLabel(label);
    setLoading(true);
    try {
      const data = await getOneClient<PublicReportBundle>(PUBLIC_ENDPOINTS.reportsForYear(label));
      setBundle(data);
    } catch {
      setBundle(null);
    } finally {
      setLoading(false);
    }
  };

  if (publishedYears.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-base font-medium text-foreground">No reports have been published yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">Check back soon — published figures will appear here once available.</p>
      </div>
    );
  }

  const currentUnpublished = currentYear && !currentYear.isPublished;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="fy-select" className="text-sm font-medium text-foreground">
          Financial year
        </label>
        <select
          id="fy-select"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={selectedLabel ?? ''}
          onChange={(e) => void handleSelectYear(e.target.value)}
        >
          {publishedYears.map((y) => (
            <option key={y.id} value={y.label}>
              {y.label}
              {y.isAllYearsAggregate ? ' (combined)' : y.isCurrentFinancialYear ? ' (current)' : ''}
            </option>
          ))}
        </select>
        {bundle ? <span className="text-sm text-muted-foreground">Last updated: {formatIst(bundle.publishedAt)}</span> : null}
      </div>

      {currentUnpublished ? (
        <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-warning">
          The current financial year ({currentYear.label}) has not been published yet. Showing the most recently published
          financial year instead.
        </div>
      ) : null}

      {loading || !bundle ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>
      ) : (
        <>
          <div className="flex flex-wrap items-center border-b border-border">
            <div className="inline-flex gap-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={
                    tab === t.key
                      ? '-mb-px border-b-2 border-primary px-3 py-2 text-sm font-medium text-foreground'
                      : '-mb-px border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground'
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            {tab === 'programme_report' ? <ProgrammeReportTable rows={bundle.programmeReport.rows} /> : null}
            {tab === 'district_activity_coverage' ? <DistrictReportTable rows={bundle.districtReport.rows} /> : null}
            {tab === 'commodity_report' ? <CommodityReportTable rows={bundle.commodityReport.rows} /> : null}
          </div>
        </>
      )}
    </div>
  );
}
