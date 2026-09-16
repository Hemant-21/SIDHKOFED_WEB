/**
 * Public Report Publications types — mirrors the backend's `reports.types.ts` /
 * `publications.public.service.ts` (Sidhkofed-Website). Wire shape is camelCase (a deliberate
 * difference from the snake_case `content.ts` types, matching the backend's own convention for
 * this module — see that module's header comments for why).
 *
 * These are read straight from an immutable, approved `ReportPublication` snapshot — never a live
 * query — so every field here is exactly what was reviewed and published, nothing recalculated.
 */

export type ReportKey = 'programme_report' | 'district_activity_coverage' | 'commodity_report';

export type ToolkitItemStatus = 'distributed' | 'partially_distributed' | 'not_distributed' | 'not_recorded';

export interface ToolkitItemDetail {
  toolkitItemId: string;
  toolkitId: string;
  itemNameEn: string;
  itemNameHi: string | null;
  distributionPattern: string;
  defaultGroupSize: number | null;
  defaultQuantityPerUnit: number | null;
  unit: string | null;
  status: ToolkitItemStatus;
}

export interface ToolkitInfo {
  applicable: boolean;
  items: ToolkitItemDetail[];
}

export interface MissingDataCounts {
  missingAttendance: number;
  missingDistrict?: number;
  missingBlock?: number;
}

export interface FinancialYearOption {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isAllYearsAggregate: boolean;
}

export interface ChartDatum {
  key: string;
  label: string;
  value: number | null;
}

export type ChartMeasure = 'completed_events' | 'recorded_participants';

export interface ChartDataset {
  measure: ChartMeasure;
  unit: string;
  data: ChartDatum[];
  allUnavailable: boolean;
}

export interface ProgrammeDistrictDrilldown {
  districtId: string | null;
  districtNameEn: string;
  blocksReached: number;
  completedEvents: number;
  recordedParticipants: number | null;
  missing: MissingDataCounts;
  toolkit: ToolkitInfo;
}

export interface ProgrammeReportRow {
  programmeSchemeId: string;
  programmeNameEn: string;
  targetCommoditiesEn: string[];
  districtsReached: number;
  completedEvents: number;
  recordedParticipants: number | null;
  missing: MissingDataCounts;
  toolkit: ToolkitInfo;
  districtDrilldown: ProgrammeDistrictDrilldown[];
}

export interface DistrictProgrammeBreakdown {
  programmeSchemeId: string | null;
  programmeNameEn: string;
  completedEvents: number;
  blocksReached: number;
  recordedParticipants: number | null;
  missing: MissingDataCounts;
}

export interface DistrictBlockBreakdown {
  blockId: string | null;
  blockNameEn: string;
  completedEvents: number;
  recordedParticipants: number | null;
  missing: MissingDataCounts;
}

export interface DistrictEventTypeBreakdown {
  eventTypeId: string;
  eventTypeNameEn: string;
  completedEvents: number;
  recordedParticipants: number | null;
  missing: MissingDataCounts;
}

export interface DistrictReportRow {
  districtId: string | null;
  districtNameEn: string;
  blocksReached: number;
  programmesCovered: number;
  completedEvents: number;
  recordedParticipants: number | null;
  missing: MissingDataCounts;
  toolkit: ToolkitInfo;
  programmeBreakdown: DistrictProgrammeBreakdown[];
  blockBreakdown: DistrictBlockBreakdown[];
  eventTypeBreakdown: DistrictEventTypeBreakdown[];
}

export interface CommodityDistrictBreakdown {
  districtId: string | null;
  districtNameEn: string;
  completedEvents: number;
  blocksReached: number;
  recordedParticipants: number | null;
  missing: MissingDataCounts;
}

export interface CommodityBlockBreakdown {
  districtId: string | null;
  districtNameEn: string;
  blockId: string | null;
  blockNameEn: string;
  completedEvents: number;
  recordedParticipants: number | null;
  missing: MissingDataCounts;
}

export interface CommodityEventTypeBreakdown {
  eventTypeId: string;
  eventTypeNameEn: string;
  completedEvents: number;
  recordedParticipants: number | null;
  missing: MissingDataCounts;
}

export interface CommodityReportRow {
  commodityId: string;
  commodityNameEn: string;
  districtsReached: number;
  completedEvents: number;
  recordedParticipants: number | null;
  missing: MissingDataCounts;
  toolkit: ToolkitInfo;
  districtBreakdown: CommodityDistrictBreakdown[];
  blockBreakdown: CommodityBlockBreakdown[];
  eventTypeBreakdown: CommodityEventTypeBreakdown[];
}

export type ReportRow = ProgrammeReportRow | DistrictReportRow | CommodityReportRow;

export interface ReportResult<Row extends ReportRow = ReportRow> {
  reportKey: ReportKey;
  scope: string;
  financialYear: FinancialYearOption;
  rows: Row[];
  chart: ChartDataset;
  calculationVersion: number;
  generatedAt: string;
}

/** `GET /public/reports/years` */
export interface PublicFinancialYearSummary {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  isCurrentFinancialYear: boolean;
  isAllYearsAggregate: boolean;
  isPublished: boolean;
  publishedAt: string | null;
}

/** `GET /public/reports/:label` */
export interface PublicReportBundle {
  financialYear: { id: string; label: string; startDate: string; endDate: string };
  publishedAt: string;
  calculationVersion: number;
  programmeReport: ReportResult<ProgrammeReportRow>;
  districtReport: ReportResult<DistrictReportRow>;
  commodityReport: ReportResult<CommodityReportRow>;
}
