'use client';

/**
 * The three report tables (Programme / District Activity Coverage / Commodity-wise) for the
 * public Reports dashboard — table view of an approved FY snapshot's rows, with expandable
 * drill-downs, mirroring the CMS's equivalent (Task 3).
 */
import { Fragment, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ToolkitDisclosure } from './toolkit-info';
import type {
  CommodityReportRow,
  DistrictReportRow,
  ProgrammeReportRow,
} from '@/lib/types/reports';

function ParticipantsCell({ value, missingAttendance }: { value: number | null; missingAttendance: number }) {
  if (value === null) return <span className="italic text-muted-foreground">Unavailable</span>;
  return (
    <span>
      {value.toLocaleString('en-IN')}
      {missingAttendance > 0 ? <span className="ml-1.5 text-xs text-muted-foreground">({missingAttendance} missing)</span> : null}
    </span>
  );
}

function ExpandToggle({ expanded, onToggle, label }: { expanded: boolean; onToggle: () => void; label: string }) {
  return (
    <button type="button" onClick={onToggle} aria-expanded={expanded} className="flex items-center gap-1.5 text-left font-medium text-foreground hover:text-primary">
      {expanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
      <span className="break-words">{label}</span>
    </button>
  );
}

// ── Programme ──────────────────────────────────────────────────────────────────────────────────
function ProgrammeDrilldown({ rows }: { rows: ProgrammeReportRow['districtDrilldown'] }) {
  if (rows.length === 0) return <p className="py-3 text-sm text-muted-foreground">No district data for this programme.</p>;
  return (
    <div className="ml-6 space-y-3 border-l border-border pl-4 py-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">District breakdown</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="py-1.5 pr-3">District</th>
              <th className="py-1.5 pr-3">Blocks reached</th>
              <th className="py-1.5 pr-3">Completed events</th>
              <th className="py-1.5 pr-3">Recorded participants</th>
              <th className="py-1.5 pr-3">Toolkit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.districtId ?? 'not-recorded'} className="border-b border-border/60 last:border-0 align-top">
                <td className="py-1.5 pr-3">{d.districtNameEn}</td>
                <td className="py-1.5 pr-3">{d.blocksReached}</td>
                <td className="py-1.5 pr-3">{d.completedEvents}</td>
                <td className="py-1.5 pr-3"><ParticipantsCell value={d.recordedParticipants} missingAttendance={d.missing.missingAttendance} /></td>
                <td className="py-1.5 pr-3"><ToolkitDisclosure title={d.districtNameEn} toolkit={d.toolkit} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProgrammeReportTable({ rows }: { rows: ProgrammeReportRow[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  if (rows.length === 0) return <p className="py-6 text-center text-sm text-muted-foreground">No programmes with qualifying activity in this financial year.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="py-2 pr-3">Programme</th>
            <th className="py-2 pr-3">Target commodities</th>
            <th className="py-2 pr-3">Districts reached</th>
            <th className="py-2 pr-3">Completed events</th>
            <th className="py-2 pr-3">Recorded participants</th>
            <th className="py-2 pr-3">Toolkit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const expanded = expandedId === row.programmeSchemeId;
            return (
              <Fragment key={row.programmeSchemeId}>
                <tr className="border-b border-border align-top">
                  <td className="py-2.5 pr-3"><ExpandToggle expanded={expanded} onToggle={() => setExpandedId(expanded ? null : row.programmeSchemeId)} label={row.programmeNameEn} /></td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{row.targetCommoditiesEn.length > 0 ? row.targetCommoditiesEn.join(', ') : '—'}</td>
                  <td className="py-2.5 pr-3">{row.districtsReached}</td>
                  <td className="py-2.5 pr-3">{row.completedEvents}</td>
                  <td className="py-2.5 pr-3"><ParticipantsCell value={row.recordedParticipants} missingAttendance={row.missing.missingAttendance} /></td>
                  <td className="py-2.5 pr-3"><ToolkitDisclosure title={row.programmeNameEn} toolkit={row.toolkit} /></td>
                </tr>
                {expanded ? (
                  <tr>
                    <td colSpan={6} className="bg-muted/20 py-0">
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
  const [tab, setTab] = useState<'programme' | 'block' | 'eventType'>('programme');
  const rows =
    tab === 'programme'
      ? row.programmeBreakdown.map((r) => ({ key: r.programmeSchemeId ?? 'unassigned', label: r.programmeNameEn, completedEvents: r.completedEvents, recordedParticipants: r.recordedParticipants, missingAttendance: r.missing.missingAttendance }))
      : tab === 'block'
        ? row.blockBreakdown.map((r) => ({ key: r.blockId ?? 'not-recorded', label: r.blockNameEn, completedEvents: r.completedEvents, recordedParticipants: r.recordedParticipants, missingAttendance: r.missing.missingAttendance }))
        : row.eventTypeBreakdown.map((r) => ({ key: r.eventTypeId, label: r.eventTypeNameEn, completedEvents: r.completedEvents, recordedParticipants: r.recordedParticipants, missingAttendance: r.missing.missingAttendance }));

  return (
    <div className="ml-6 space-y-3 border-l border-border pl-4 py-3">
      <div className="inline-flex gap-1 text-xs">
        {(['programme', 'block', 'eventType'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={t === tab ? 'rounded bg-muted px-2 py-1 font-medium' : 'px-2 py-1 text-muted-foreground'}>
            {t === 'programme' ? 'Programme' : t === 'block' ? 'Block' : 'Event type'}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">No data for this breakdown.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-1.5 pr-3">Category</th>
                <th className="py-1.5 pr-3">Completed events</th>
                <th className="py-1.5 pr-3">Recorded participants</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-b border-border/60 last:border-0">
                  <td className="py-1.5 pr-3">{r.label}</td>
                  <td className="py-1.5 pr-3">{r.completedEvents}</td>
                  <td className="py-1.5 pr-3"><ParticipantsCell value={r.recordedParticipants} missingAttendance={r.missingAttendance} /></td>
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  if (rows.length === 0) return <p className="py-6 text-center text-sm text-muted-foreground">No districts with qualifying activity in this financial year.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="py-2 pr-3">District</th>
            <th className="py-2 pr-3">Blocks reached</th>
            <th className="py-2 pr-3">Programmes covered</th>
            <th className="py-2 pr-3">Completed events</th>
            <th className="py-2 pr-3">Recorded participants</th>
            <th className="py-2 pr-3">Toolkit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = row.districtId ?? 'not-recorded';
            const expanded = expandedId === key;
            return (
              <Fragment key={key}>
                <tr className="border-b border-border align-top">
                  <td className="py-2.5 pr-3"><ExpandToggle expanded={expanded} onToggle={() => setExpandedId(expanded ? null : key)} label={row.districtNameEn} /></td>
                  <td className="py-2.5 pr-3">{row.blocksReached}</td>
                  <td className="py-2.5 pr-3">{row.programmesCovered}</td>
                  <td className="py-2.5 pr-3">{row.completedEvents}</td>
                  <td className="py-2.5 pr-3"><ParticipantsCell value={row.recordedParticipants} missingAttendance={row.missing.missingAttendance} /></td>
                  <td className="py-2.5 pr-3"><ToolkitDisclosure title={row.districtNameEn} toolkit={row.toolkit} /></td>
                </tr>
                {expanded ? (
                  <tr>
                    <td colSpan={6} className="bg-muted/20 py-0">
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
  const [tab, setTab] = useState<'district' | 'block' | 'eventType'>('district');
  const rows =
    tab === 'district'
      ? row.districtBreakdown.map((r) => ({ key: r.districtId ?? 'not-recorded', label: r.districtNameEn, completedEvents: r.completedEvents, recordedParticipants: r.recordedParticipants, missingAttendance: r.missing.missingAttendance }))
      : tab === 'block'
        ? row.blockBreakdown.map((r) => ({ key: `${r.districtId ?? 'x'}-${r.blockId ?? 'x'}`, label: `${r.districtNameEn} — ${r.blockNameEn}`, completedEvents: r.completedEvents, recordedParticipants: r.recordedParticipants, missingAttendance: r.missing.missingAttendance }))
        : row.eventTypeBreakdown.map((r) => ({ key: r.eventTypeId, label: r.eventTypeNameEn, completedEvents: r.completedEvents, recordedParticipants: r.recordedParticipants, missingAttendance: r.missing.missingAttendance }));

  return (
    <div className="ml-6 space-y-3 border-l border-border pl-4 py-3">
      <div className="inline-flex gap-1 text-xs">
        {(['district', 'block', 'eventType'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={t === tab ? 'rounded bg-muted px-2 py-1 font-medium' : 'px-2 py-1 text-muted-foreground'}>
            {t === 'district' ? 'District' : t === 'block' ? 'Block' : 'Event type'}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">No data for this breakdown.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-1.5 pr-3">Category</th>
                <th className="py-1.5 pr-3">Completed events</th>
                <th className="py-1.5 pr-3">Recorded participants</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-b border-border/60 last:border-0">
                  <td className="py-1.5 pr-3">{r.label}</td>
                  <td className="py-1.5 pr-3">{r.completedEvents}</td>
                  <td className="py-1.5 pr-3"><ParticipantsCell value={r.recordedParticipants} missingAttendance={r.missingAttendance} /></td>
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  if (rows.length === 0) return <p className="py-6 text-center text-sm text-muted-foreground">No commodities with qualifying activity in this financial year.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="py-2 pr-3">Commodity</th>
            <th className="py-2 pr-3">Districts reached</th>
            <th className="py-2 pr-3">Completed events</th>
            <th className="py-2 pr-3">Recorded participants</th>
            <th className="py-2 pr-3">Toolkit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const expanded = expandedId === row.commodityId;
            return (
              <Fragment key={row.commodityId}>
                <tr className="border-b border-border align-top">
                  <td className="py-2.5 pr-3"><ExpandToggle expanded={expanded} onToggle={() => setExpandedId(expanded ? null : row.commodityId)} label={row.commodityNameEn} /></td>
                  <td className="py-2.5 pr-3">{row.districtsReached}</td>
                  <td className="py-2.5 pr-3">{row.completedEvents}</td>
                  <td className="py-2.5 pr-3"><ParticipantsCell value={row.recordedParticipants} missingAttendance={row.missing.missingAttendance} /></td>
                  <td className="py-2.5 pr-3"><ToolkitDisclosure title={row.commodityNameEn} toolkit={row.toolkit} /></td>
                </tr>
                {expanded ? (
                  <tr>
                    <td colSpan={5} className="bg-muted/20 py-0">
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
