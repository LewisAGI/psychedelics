import { shownFacts } from './filter';
import type { Entry, Fact } from './types';

export interface InteractionGroup {
  entry: Entry;
  facts: Fact[];
}

export function interactionAnchor(id: string): string {
  return `i-${id}`;
}

/** Interaction rows that are evidence or inference. Uncertain rows are omitted. */
export function interactionGroups(entries: Entry[]): InteractionGroup[] {
  return entries
    .map((entry) => ({ entry, facts: shownFacts(entry.interactions) }))
    .filter((group) => group.facts.length > 0);
}
