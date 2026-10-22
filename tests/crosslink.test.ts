import { describe, expect, it } from 'vitest';
import { linkParts, mentionsEntry } from '../src/crosslink';
import { pack } from '../src/content';
import { eventsForEntry } from '../src/timeline';

describe('cross-links', () => {
  it('keeps 5-MeO-DMT distinct from DMT and does not link a page to itself', () => {
    const parts = linkParts('5-MeO-DMT differs from DMT');
    expect(parts.map((part) => [part.text, part.entryId])).toEqual([
      ['5-MeO-DMT', '5-meo-dmt'],
      [' differs from ', undefined],
      ['DMT', 'dmt-ayahuasca'],
    ]);
    expect(linkParts('5-MeO-DMT', '5-meo-dmt').every((part) => part.entryId === undefined)).toBe(true);
    expect(mentionsEntry('5-MeO-DMT', 'dmt-ayahuasca')).toBe(false);
    expect(linkParts('esketamine')[0]).toEqual({ text: 'esketamine', entryId: 'ketamine' });
  });

  it('attaches timeline rows only when the event names the substance', () => {
    expect(eventsForEntry(pack.timeline, 'lsd').some((event) => event.date === '1938/1943')).toBe(true);
    expect(eventsForEntry(pack.timeline, 'lsd').some((event) => event.event.includes('Amanita'))).toBe(false);
    expect(eventsForEntry(pack.timeline, 'psilocybin').some((event) => event.date === '1957-05-13')).toBe(true);
    expect(eventsForEntry(pack.timeline, 'ketamine').some((event) => event.event.includes('Spravato'))).toBe(true);
    expect(eventsForEntry(pack.timeline, 'dmt-ayahuasca').some((event) => event.event.includes('hoasca'))).toBe(true);
    expect(eventsForEntry(pack.timeline, null)).toHaveLength(21);
  });
});
