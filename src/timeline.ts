import type { TimelineEvent } from './types';

/** First year, then month and day when the pack date includes them. */
export function eventSortKey(date: string): number {
  const match = date.match(/(\d{3,4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  const year = Number(match[1]);
  const month = Number(match[2] ?? '1');
  const day = Number(match[3] ?? '1');
  return year * 10000 + month * 100 + day;
}

export function orderedTimeline(events: TimelineEvent[]): TimelineEvent[] {
  return events
    .map((event, index) => ({ event, index }))
    .sort((a, b) => eventSortKey(a.event.date) - eventSortKey(b.event.date) || a.index - b.index)
    .map((item) => item.event);
}
