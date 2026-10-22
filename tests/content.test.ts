import { describe, expect, it } from 'vitest';
import { allFacts, pack, sourceById, sources } from '../src/content';
import { FACT_TYPES } from '../src/types';

const banned =
  /where to (buy|get|order)|dark ?web|how to (extract|synthesi[sz]e|grow)|synthesis steps|for sale|checkout/i;

describe('content pack', () => {
  it('loads the verified v3 pack', () => {
    expect(pack.pack).toBe('psychedelics');
    expect(pack.version).toBe(3);
    expect(pack.verified).toBe('2026-10-22');
    expect(pack.entries).toHaveLength(15);
    expect(pack.timeline).toHaveLength(21);
    expect(pack.further_reading).toHaveLength(12);
    expect(sources).toHaveLength(55);
    expect(pack.disclaimer).toMatch(/Not medical advice/);
    expect(pack.disclaimer).toMatch(/No sourcing/);
  });

  it('gives every fact, timeline event, and reading item a source that resolves', () => {
    const facts = pack.entries.flatMap(allFacts);
    expect(facts).toHaveLength(155);
    const types = new Set(facts.map((fact) => fact.type));
    expect([...types].sort()).toEqual([...FACT_TYPES].sort());
    for (const fact of facts) {
      expect(fact.text.trim().length).toBeGreaterThan(0);
      expect(fact.sources.length).toBeGreaterThan(0);
      expect(banned.test(fact.text)).toBe(false);
      for (const id of fact.sources) expect(sourceById(id)?.url).toMatch(/^https?:\/\//);
    }
    for (const event of pack.timeline) {
      expect(event.date.trim().length).toBeGreaterThan(0);
      expect(event.event.trim().length).toBeGreaterThan(0);
      for (const id of event.sources) expect(sourceById(id)?.url).toMatch(/^https?:\/\//);
    }
    for (const item of pack.further_reading) {
      expect(item.why.trim().length).toBeGreaterThan(0);
      expect(sourceById(item.source)?.url).toMatch(/^https?:\/\//);
    }
  });
});
