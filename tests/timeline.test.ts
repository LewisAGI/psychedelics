import { describe, expect, it } from 'vitest';
import { pack } from '../src/content';
import { eventSortKey, orderedTimeline } from '../src/timeline';

describe('timeline order', () => {
  it('sorts pack dates from the first year and keeps same-day order', () => {
    expect(eventSortKey('1938/1943')).toBeLessThan(eventSortKey('1957-05-13'));
    expect(eventSortKey('2026-04-24')).toBeLessThan(eventSortKey('2026-06-22 / 2026-08-12'));
    expect(eventSortKey('2026-06-22 / 2026-08-12')).toBeLessThan(eventSortKey('2026-08-10'));
    const ordered = orderedTimeline(pack.timeline);
    expect(ordered).toHaveLength(21);
    expect(ordered[0]?.date).toBe('1938/1943');
    expect(ordered.at(-1)?.date).toBe('2026-08-10');
  });
});
