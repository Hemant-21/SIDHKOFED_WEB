import { ACTIVITY_TYPES } from '@/config/activity-groups';
import type { Metadata } from 'next';
import { getListSafe } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS } from '@/lib/api/endpoints';
import type { EventSummary } from '@/lib/types/content';
import { buildMetadata } from '@/lib/seo';
import { PAGE_SIZE, toPage, qstr, getMasterOptions, yearOptions, enumOptions } from '@/lib/listing';
import { ListingLayout } from '@/components/listing/listing-layout';
import { FilterBar } from '@/components/listing/filter-bar';
import { PaginationNav } from '@/components/listing/pagination-nav';
import { ResultsSummary } from '@/components/listing/results-summary';
import { ListingEmptyState } from '@/components/feedback/states';
import { EventCard } from '@/components/cards/event-card';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Meetings, Visits & Institutional Events',
  description: 'Board meetings, field visits, conferences and MoU signings by SIDHKOFED.',
  path: '/activities/institutional-events',
});

type SP = Record<string, string | string[] | undefined>;

export default async function InstitutionalEventsPage({ searchParams }: { searchParams: SP }) {
  const page = toPage(searchParams.page);

  const [list, districts] = await Promise.all([
    getListSafe<EventSummary>(PUBLIC_ENDPOINTS.events, {
      query: {
        page,
        page_size: PAGE_SIZE,
        search: qstr(searchParams.search),
        event_type: ACTIVITY_TYPES.institutional,
        event_status: qstr(searchParams.event_status),
        district: qstr(searchParams.district),
        year: qstr(searchParams.year),
        ordering: '-start_date',
      },
    }),
    getMasterOptions('districts'),
  ]);

  return (
    <ListingLayout
      titleKey="page.activities.institutional.title"
      subtitleKey="page.activities.institutional.subtitle"
      crumb="Meetings, Visits & Institutional Events"
      parentCrumbs={[{ label: 'Activities', href: '/activities' }]}
      filters={
        <FilterBar
          selects={[
            {
              key: 'event_status',
              labelKey: 'filter.status',
              options: enumOptions(['scheduled', 'ongoing', 'completed', 'postponed', 'cancelled']),
            },
            { key: 'district', multiple: true, labelKey: 'filter.district', options: districts },
            { key: 'year', labelKey: 'filter.year', options: yearOptions() },
          ]}
        />
      }
      summary={list.error ? null : <ResultsSummary total={list.pagination.total_items} />}
      pagination={<PaginationNav page={list.pagination.page} totalPages={list.pagination.total_pages} />}
    >
      {list.items.length === 0 ? (
        <ListingEmptyState failed={list.error} filtered={Object.entries(searchParams).some(([key, value]) => key !== 'page' && Boolean(value))} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.items.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </ListingLayout>
  );
}
