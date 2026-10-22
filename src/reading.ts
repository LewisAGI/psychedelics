import { allFacts, pack } from './content';
import { shownFacts } from './filter';
import type { Entry } from './types';

export function readingAnchor(sourceId: string): string {
  return `r-${sourceId}`;
}

/** Entries whose visible facts cite this further-reading source. */
export function entriesCiting(sourceId: string): Entry[] {
  return pack.entries.filter((entry) =>
    shownFacts(allFacts(entry)).some((fact) => fact.sources.includes(sourceId)),
  );
}
