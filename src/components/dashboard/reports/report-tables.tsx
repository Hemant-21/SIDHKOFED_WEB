'use client';

/**
 * The three report tables (Programme / District Activity Coverage / Commodity-wise) for the
 * public Reports dashboard - table view of an approved FY snapshot's rows, with expandable
 * drill-downs, mirroring the CMS's equivalent (Task 3).
 *
 * Row data (district/programme/block/event-type/commodity names) comes from the reports API
 * as English-only fields (`*NameEn`, no `*NameHi` sibling) - only the toolkit item name is
 * bilingual. The table chrome (headings, empty states, tab labels) is dictionary-owned and
 * fully bilingual; the row names themselves stay English until the reports API adds Hindi
 * fields.
 */
import { Fragment, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { Badge } from '@/components/ui/badge';
import { ToolkitDisclosure } from './toolkit-info';
import type {
  CommodityReportRow,
  DistrictReportRow,
  ProgrammeReportRow,
} from '@/lib/types/reports';
import type { TranslationKey } from '@/i18n/dictionary';

function ParticipantsCell({ value, missingAttendance }: { value: number | null; missingAttendance: number }) {
  const { t } = useLanguage();
  if (value === null) return <Badge tone="warning" className="italic">{t('reports.table.unavailable')}</Badge>;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-medium text-foreground">{value.toLocaleString('en-IN')}</span>
      {missingAttendance > 0 ? (
        <Badge tone="warning">{t('reports.table.missingSuffix', { count: missingAttendance })}</Badge>
      ) : null}
    </span>
  );
}

function ExpandToggle({ expanded, onToggle, label }: { expanded: boolean; onToggle: () => void; label: string }) {
  return (
    <button type="button" onClick={onToggle} aria-expanded={expanded} className="flex items-center gap-1.5 text-left font-medium text-foreground hover:text-primary">
      {expanded ? (
        <ChevronDown className="h-4 w-4 shrink-0 text-primary" />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
      <span className="break-words">{label}</span>
    </button>
  );
}

// ── Programme ──────────────────────────────────────────────────────────────────────────────────
function ProgrammeDrilldown({ rows }: { rows: ProgrammeReportRow['districtDrilldown'] }) {
  const { t } = useLanguage();
  if (rows.length === 0) return <p className="py-3 text-sm text-muted-foreground">{t('reports.table.noDistrictData')}</p>;
  return (
    <div className="ml-6 space-y-3 rounded-md border border-primary/20 border-l-4 border-l-primary bg-muted/60 p-4 shadow-sm">
      <h4 className="text-xs font-bold uppercase tracking-wide text-primary">{t('reports.table.districtBreakdown')}</h4>
      <div className="overflow-x-auto rounded border border-border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-primary/30 bg-primary/10 text-left text-xs font-bold text-primary">
              <th className="py-1.5 px-3">{t('reports.table.col.district')}</th>
              <th className="py-1.5 px-3">{t('reports.table.col.blocksReached')}</th>
              <th className="py-1.5 px-3">{t('reports.table.col.completedEvents')}</th>
              <th className="py-1.5 px-3">{t('reports.table.col.recordedParticipants')}</th>
              <th className="py-1.5 px-3">{t('reports.table.col.toolkit')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d, i) => (
              <tr
                key={d.districtId ?? 'not-recorded'}
                className={`border-b border-border last:border-0 align-top hover:bg-primary/5 ${i % 2 === 1 ? 'bg-muted/50' : ''}`}
              >
                <td className="py-1.5 px-3 font-medium text-foreground">{d.districtNameEn}</td>
                <td className="py-1.5 px-3">{d.blocksReached}</td>
                <td className="py-1.5 px-3">{d.completedEvents}</td>
                <td className="py-1.5 px-3"><ParticipantsCell value={d.recordedParticipants} missingAttendance={d.missing.missingAttendance} /></td>
                <td className="py-1.5 px-3"><ToolkitDisclosure title={d.districtNameEn} toolkit={d.toolkit} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProgrammeReportTable({ rows }: { rows: ProgrammeReportRow[] }) {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  if (rows.length === 0) return <p className="py-6 text-center text-sm text-muted-foreground">{t('reports.table.noProgrammeData')}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-primary/30 bg-primary/10 text-left text-xs font-bold text-primary">
            <th className="py-2 pr-3">{t('reports.table.col.programme')}</th>
            <th className="py-2 pr-3">{t('reports.table.col.targetCommodities')}</th>
            <th className="py-2 pr-3">{t('reports.table.col.districtsReached')}</th>
            <th className="py-2 pr-3">{t('reports.table.col.completedEvents')}</th>
            <th className="py-2 pr-3">{t('reports.table.col.recordedParticipants')}</th>
            <th className="py-2 pr-3">{t('reports.table.col.toolkit')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const expanded = expandedId === row.programmeSchemeId;
            return (
              <Fragment key={row.programmeSchemeId}>
                <tr
                  className={`border-b border-border align-top hover:bg-primary/10 ${
                    expanded ? 'border-l-4 border-l-primary bg-primary/10' : index % 2 === 1 ? 'bg-muted/50' : ''
                  }`}
                >
                  <td className="py-2.5 pr-3"><ExpandToggle expanded={expanded} onToggle={() => setExpandedId(expanded ? null : row.programmeSchemeId)} label={row.programmeNameEn} /></td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{row.targetCommoditiesEn.length > 0 ? row.targetCommoditiesEn.join(', ') : '-'}</td>
                  <td className="py-2.5 pr-3">{row.districtsReached}</td>
                  <td className="py-2.5 pr-3">{row.completedEvents}</td>
                  <td className="py-2.5 pr-3"><ParticipantsCell value={row.recordedParticipants} missingAttendance={row.missing.missingAttendance} /></td>
                  <td className="py-2.5 pr-3"><ToolkitDisclosure title={row.programmeNameEn} toolkit={row.toolkit} /></td>
                </tr>
                {expanded ? (
                  <tr>
                    <td colSpan={6} className="bg-muted/30 py-3">
                      <ProgrammeDrilldown rows={row.districtDrilldown} />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── District Activity Coverage ────────────────────────────────────────────────────────────────
function DistrictDrilldown({ row }: { row: DistrictReportRow }) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<'programme' | 'block' | 'eventType'>('programme');
  const rows =
    tab === 'programme'
      ? row.programmeBreakdown.map((r) => ({ key: r.programmeSchemeId ?? 'unassigned', label: r.programmeNameEn, completedEvents: r.completedEvents, recordedParticipants: r.recordedParticipants, missingAttendance: r.missing.missingAttendance }))
      : tab === 'block'
        ? row.blockBreakdown.map((r) => ({ key: r.blockId ?? 'not-recorded', label: r.blockNameEn, completedEvents: r.completedEvents, recordedParticipants: r.recordedParticipants, missingAttendance: r.missing.missingAttendance }))
        : row.eventTypeBreakdown.map((r) => ({ key: r.eventTypeId, label: r.eventTypeNameEn, completedEvents: r.completedEvents, recordedParticipants: r.recordedParticipants, missingAttendance: r.missing.missingAttendance }));

  const tabKeys: Record<typeof tab, TranslationKey> = {
    programme: 'reports.table.tab.programme',
    block: 'reports.table.tab.block',
    eventType: 'reports.table.tab.eventType',
  };

  return (
    <div className="ml-6 space-y-3 rounded-md border border-primary/20 border-l-4 border-l-primary bg-muted/60 p-4 shadow-sm">
      <div className="inline-flex gap-1 text-xs">
        {(['programme', 'block', 'eventType'] as const).map((tKey) => (
          <button key={tKey} type="button" onClick={() => setTab(tKey)} className={tKey === tab ? 'rounded bg-primary px-2 py-1 font-medium text-primary-foreground' : 'px-2 py-1 text-muted-foreground hover:text-foreground'}>
            {t(tabKeys[tKey])}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">{t('reports.table.noBreakdownData')}</p>
      ) : (
        <div className="overflow-x-auto rounded border border-border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-primary/30 bg-primary/10 text-left text-xs font-bold text-primary">
                <th className="py-1.5 px-3">{t('reports.table.col.category')}</th>
                <th className="py-1.5 px-3">{t('reports.table.col.completedEvents')}</th>
                <th className="py-1.5 px-3">{t('reports.table.col.recordedParticipants')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.key} className={`border-b border-border last:border-0 hover:bg-primary/5 ${i % 2 === 1 ? 'bg-muted/50' : ''}`}>
                  <td className="py-1.5 px-3 font-medium text-foreground">{r.label}</td>
                  <td className="py-1.5 px-3">{r.completedEvents}</td>
                  <td className="py-1.5 px-3"><ParticipantsCell value={r.recordedParticipants} missingAttendance={r.missingAttendance} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function DistrictReportTable({ rows }: { rows: DistrictReportRow[] }) {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  if (rows.length === 0) return <p className="py-6 text-center text-sm text-muted-foreground">{t('reports.table.noDistrictActivityData')}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-primary/30 bg-primary/10 text-left text-xs font-bold text-primary">
            <th className="py-2 pr-3">{t('reports.table.col.district')}</th>
            <th className="py-2 pr-3">{t('reports.table.col.blocksReached')}</th>
            <th className="py-2 pr-3">{t('reports.table.col.programmesCovered')}</th>
            <th className="py-2 pr-3">{t('reports.table.col.completedEvents')}</th>
            <th className="py-2 pr-3">{t('reports.table.col.recordedParticipants')}</th>
            <th className="py-2 pr-3">{t('reports.table.col.toolkit')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const key = row.districtId ?? 'not-recorded';
            const expanded = expandedId === key;
            return (
              <Fragment key={key}>
                <tr
                  className={`border-b border-border align-top hover:bg-primary/10 ${
                    expanded ? 'border-l-4 border-l-primary bg-primary/10' : index % 2 === 1 ? 'bg-muted/50' : ''
                  }`}
                >
                  <td className="py-2.5 pr-3"><ExpandToggle expanded={expanded} onToggle={() => setExpandedId(expanded ? null : key)} label={row.districtNameEn} /></td>
                  <td className="py-2.5 pr-3">{row.blocksReached}</td>
                  <td className="py-2.5 pr-3">{row.programmesCovered}</td>
                  <td className="py-2.5 pr-3">{row.completedEvents}</td>
                  <td className="py-2.5 pr-3"><ParticipantsCell value={row.recordedParticipants} missingAttendance={row.missing.missingAttendance} /></td>
                  <td className="py-2.5 pr-3"><ToolkitDisclosure title={row.districtNameEn} toolkit={row.toolkit} /></td>
                </tr>
                {expanded ? (
                  <tr>
                    <td colSpan={6} className="bg-muted/30 py-3">
                      <DistrictDrilldown row={row} />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Commodity-wise ─────────────────────────────────────────────────────────────────────────────
function CommodityDrilldown({ row }: { row: CommodityReportRow }) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<'district' | 'block' | 'eventType'>('district');
  const rows =
    tab === 'district'
      ? row.districtBreakdown.map((r) => ({ key: r.districtId ?? 'not-recorded', label: r.districtNameEn, completedEvents: r.completedEvents, recordedParticipants: r.recordedParticipants, missingAttendance: r.missing.missingAttendance }))
      : tab === 'block'
        ? row.blockBreakdown.map((r) => ({ key: `${r.districtId ?? 'x'}-${r.blockId ?? 'x'}`, label: `${r.districtNameEn} - ${r.blockNameEn}`, completedEvents: r.completedEvents, recordedParticipants: r.recordedParticipants, missingAttendance: r.missing.missingAttendance }))
        : row.eventTypeBreakdown.map((r) => ({ key: r.eventTypeId, label: r.eventTypeNameEn, completedEvents: r.completedEvents, recordedParticipants: r.recordedParticipants, missingAttendance: r.missing.missingAttendance }));

  const tabKeys: Record<typeof tab, TranslationKey> = {
    district: 'reports.table.tab.district',
    block: 'reports.table.tab.block',
    eventType: 'reports.table.tab.eventType',
  };

  return (
    <div className="ml-6 space-y-3 rounded-md border border-primary/20 border-l-4 border-l-primary bg-muted/60 p-4 shadow-sm">
      <div className="inline-flex gap-1 text-xs">
        {(['district', 'block', 'eventType'] as const).map((tKey) => (
          <button key={tKey} type="button" onClick={() => setTab(tKey)} className={tKey === tab ? 'rounded bg-primary px-2 py-1 font-medium text-primary-foreground' : 'px-2 py-1 text-muted-foreground hover:text-foreground'}>
            {t(tabKeys[tKey])}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">{t('reports.table.noBreakdownData')}</p>
      ) : (
        <div className="overflow-x-auto rounded border border-border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-primary/30 bg-primary/10 text-left text-xs font-bold text-primary">
                <th className="py-1.5 px-3">{t('reports.table.col.category')}</th>
                <th className="py-1.5 px-3">{t('reports.table.col.completedEvents')}</th>
                <th className="py-1.5 px-3">{t('reports.table.col.recordedParticipants')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.key} className={`border-b border-border last:border-0 hover:bg-primary/5 ${i % 2 === 1 ? 'bg-muted/50' : ''}`}>
                  <td className="py-1.5 px-3 font-medium text-foreground">{r.label}</td>
                  <td className="py-1.5 px-3">{r.completedEvents}</td>
                  <td className="py-1.5 px-3"><ParticipantsCell value={r.recordedParticipants} missingAttendance={r.missingAttendance} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function CommodityReportTable({ rows }: { rows: CommodityReportRow[] }) {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  if (rows.length === 0) return <p className="py-6 text-center text-sm text-muted-foreground">{t('reports.table.noCommodityData')}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-primary/30 bg-primary/10 text-left text-xs font-bold text-primary">
            <th className="py-2 pr-3">{t('reports.table.col.commodity')}</th>
            <th className="py-2 pr-3">{t('reports.table.col.districtsReached')}</th>
            <th className="py-2 pr-3">{t('reports.table.col.completedEvents')}</th>
            <th className="py-2 pr-3">{t('reports.table.col.recordedParticipants')}</th>
            <th className="py-2 pr-3">{t('reports.table.col.toolkit')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const expanded = expandedId === row.commodityId;
            return (
              <Fragment key={row.commodityId}>
                <tr
                  className={`border-b border-border align-top hover:bg-primary/10 ${
                    expanded ? 'border-l-4 border-l-primary bg-primary/10' : index % 2 === 1 ? 'bg-muted/50' : ''
                  }`}
                >
                  <td className="py-2.5 pr-3"><ExpandToggle expanded={expanded} onToggle={() => setExpandedId(expanded ? null : row.commodityId)} label={row.commodityNameEn} /></td>
                  <td className="py-2.5 pr-3">{row.districtsReached}</td>
                  <td className="py-2.5 pr-3">{row.completedEvents}</td>
                  <td className="py-2.5 pr-3"><ParticipantsCell value={row.recordedParticipants} missingAttendance={row.missing.missingAttendance} /></td>
                  <td className="py-2.5 pr-3"><ToolkitDisclosure title={row.commodityNameEn} toolkit={row.toolkit} /></td>
                </tr>
                {expanded ? (
                  <tr>
                    <td colSpan={5} className="bg-muted/30 py-3">
                      <CommodityDrilldown row={row} />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
