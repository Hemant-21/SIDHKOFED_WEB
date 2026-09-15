import { describe, expect, it } from 'vitest';
import { buildLegacyRedirectUrl } from './legacy-redirects';

describe('legacy listing redirects', () => {
  it('forwards allow-listed filters and preserves page when scope/ordering are unchanged (trainings)', () => {
    const url = buildLegacyRedirectUrl('activities/trainings', {
      search: 'lac',
      district: 'ranchi,khunti',
      year: '2024',
      page: '3',
    });
    expect(url).toBe(
      '/activities?event_category=trainings&event_type=training&search=lac&district=ranchi%2Ckhunti&year=2024&page=3#listing',
    );
  });

  it('enforces the fixed scope over a conflicting incoming category/type value', () => {
    const url = buildLegacyRedirectUrl('activities/trainings', {
      event_category: 'workshops',
      event_type: 'workshop',
    });
    expect(url).toBe('/activities?event_category=trainings&event_type=training#listing');
  });

  it('drops unrelated view-switch params not on the allow-list', () => {
    const url = buildLegacyRedirectUrl('notifications/notices', {
      category: 'tenders',
      communication_type: 'office-order',
      search: 'agm',
    });
    const parsed = new URL(url, 'http://localhost');
    expect(parsed.searchParams.get('category')).toBeNull();
    // The route's fixed scope (notice) wins over any incoming communication_type.
    expect(parsed.searchParams.get('communication_type')).toBe('notice');
    expect(parsed.searchParams.get('search')).toBe('agm');
  });

  it('takes only the first value of a repeated query key', () => {
    const url = buildLegacyRedirectUrl('publications/reports-research', {
      year: ['2023', '2022'],
      search: ['first', 'second'],
    });
    const parsed = new URL(url, 'http://localhost');
    expect(parsed.searchParams.get('year')).toBe('2023');
    expect(parsed.searchParams.get('search')).toBe('first');
  });

  it('drops page when the destination scope/ordering differ from the legacy route (policies/SOPs)', () => {
    const url = buildLegacyRedirectUrl('publications/policies-guidelines-sops', { page: '4' });
    const parsed = new URL(url, 'http://localhost');
    expect(parsed.searchParams.has('page')).toBe(false);
    expect(parsed.searchParams.get('knowledge_category')).toBe('training-resources');
    expect(parsed.searchParams.get('document_type')).toBe('guideline,manuals');
  });

  it('maps forms-formats onto acts-and-rules with type=form and drops page (ordering changes)', () => {
    const url = buildLegacyRedirectUrl('publications/forms-formats', { page: '2', search: 'membership' });
    const parsed = new URL(url, 'http://localhost');
    expect(parsed.searchParams.has('page')).toBe(false);
    expect(parsed.searchParams.get('knowledge_category')).toBe('acts-and-rules');
    expect(parsed.searchParams.get('document_type')).toBe('form');
    expect(parsed.searchParams.get('search')).toBe('membership');
  });

  it('narrows procurement announcements to the announcements-schedules category and forwards its filters', () => {
    const url = buildLegacyRedirectUrl('procurement/announcements', {
      commodity: 'lac,honey',
      district: 'ranchi',
      procurement_update_type: 'rate-notification',
      year: '2025',
    });
    const parsed = new URL(url, 'http://localhost');
    expect(parsed.searchParams.get('procurement_update_category')).toBe('announcements-schedules');
    expect(parsed.searchParams.get('commodity')).toBe('lac,honey');
    expect(parsed.searchParams.get('district')).toBe('ranchi');
    expect(parsed.searchParams.get('procurement_update_type')).toBe('rate-notification');
    expect(parsed.searchParams.get('year')).toBe('2025');
  });

  it('produces bare destination + #listing when there is nothing to forward', () => {
    const url = buildLegacyRedirectUrl('publications/training-materials', {});
    expect(url).toBe('/publications?knowledge_category=training-resources#listing');
  });

  it('ignores empty-string and whitespace-only incoming values', () => {
    const url = buildLegacyRedirectUrl('activities/trainings', { search: '', district: '   ' });
    const parsed = new URL(url, 'http://localhost');
    expect(parsed.searchParams.has('search')).toBe(false);
    expect(parsed.searchParams.has('district')).toBe(false);
  });
});
