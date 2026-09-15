import { describe, expect, it } from 'vitest';
import { ACTIVITY_TYPES } from './activity-groups';

describe('public activity category coverage', () => {
  it('includes awareness programmes and every kind of institutional event', () => {
    expect(ACTIVITY_TYPES.workshops.split(',')).toEqual(['workshop', 'awareness-programme']);
    expect(ACTIVITY_TYPES.institutional.split(',')).toEqual([
      'meeting', 'mou-signing', 'exposure-visit', 'field-visit', 'conference', 'other-institutional-activity',
    ]);
    const all = Object.values(ACTIVITY_TYPES).flatMap((value) => value.split(','));
    expect(new Set(all).size).toBe(9);
  });
});
