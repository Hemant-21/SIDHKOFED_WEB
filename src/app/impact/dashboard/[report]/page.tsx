import { redirect } from 'next/navigation';

/**
 * Legacy per-report URLs (`/impact/dashboard/event_activity_outcomes`, etc.) from the retired
 * six-report Operational Reports dashboard have no equivalent single-report page in the new
 * three-tab Reports dashboard (Task 6) — there is no way to map an old report key to "which tab,
 * which FY". Rather than 404 a bookmarked/shared link, redirect to the new dashboard so visitors
 * land on working content instead of a broken link.
 */
export default function LegacyDashboardReportRoute() {
  redirect('/impact/dashboard');
}
