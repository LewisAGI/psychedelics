import type { Entry, Fact } from './types';

export interface InteractionGroup {
  entry: Entry;
  facts: Fact[];
}

export function interactionAnchor(id: string): string {
  return `i-${id}`;
}

/** Every interaction row, including uncertain ones. */
export function interactionGroups(entries: Entry[]): InteractionGroup[] {
  return entries
    .map((entry) => ({ entry, facts: entry.interactions }))
    .filter((group) => group.facts.length > 0);
}

/**
 * Pack sentence that names the trial behind a pronoun.
 * DOM's chlorpromazine line says "its" and "1967"; the STP historic fact is that antecedent.
 */
export function interactionLead(entry: Entry, fact: Fact): Fact | undefined {
  const years = fact.text.match(/\b\d{4}\b/g);
  if (!years) return undefined;
  const pool = [
    ...entry.historic_use,
    ...entry.modern_clinical_use,
    ...entry.legal_trial_status,
    ...entry.effects_spectrum.positive,
    ...entry.effects_spectrum.negative,
    ...entry.risks,
    ...entry.contraindications,
    ...entry.harm_reduction,
  ];
  return pool.find(
    (item) =>
      item.text !== fact.text &&
      years.some((year) => item.text.includes(year)) &&
      item.sources.some((id) => fact.sources.includes(id)),
  );
}
