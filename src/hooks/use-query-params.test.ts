import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQueryParams } from './use-query-params';

const navigation = vi.hoisted(() => ({ push: vi.fn(), query: '' }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: navigation.push }),
  usePathname: () => '/activities',
  useSearchParams: () => new URLSearchParams(navigation.query),
}));

describe('listing URL state', () => {
  it('preserves other filters and resets pagination when selections change', () => {
    navigation.query = 'event_type=training,workshop&search=lac&page=3';
    const { result } = renderHook(() => useQueryParams());
    result.current.setParams({ district: 'ranchi,khunti' });
    const url = new URL(navigation.push.mock.lastCall![0], 'http://localhost');
    expect(url.searchParams.get('event_type')).toBe('training,workshop');
    expect(url.searchParams.get('district')).toBe('ranchi,khunti');
    expect(url.searchParams.get('search')).toBe('lac');
    expect(url.searchParams.has('page')).toBe(false);
  });

  it('keeps all selections when changing pages and clears the complete query', () => {
    navigation.query = 'event_type=training,workshop&district=ranchi,khunti';
    const { result } = renderHook(() => useQueryParams());
    result.current.setParams({ page: 2 });
    const url = new URL(navigation.push.mock.lastCall![0], 'http://localhost');
    expect(url.searchParams.get('page')).toBe('2');
    expect(url.searchParams.get('district')).toBe('ranchi,khunti');
    result.current.clearParams();
    expect(navigation.push).toHaveBeenLastCalledWith('/activities', { scroll: false });
  });
});
