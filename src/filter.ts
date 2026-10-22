import { FAMILIES, type Entry, type Fact, type Family } from './types';

/** Visible label for an EMA medicines-list row with no central authorisation. */
export const NO_EU_CENTRAL_AUTHORISATION = 'No EU central authorisation';

/** EMA medicines list: no central authorisation. The row still carries its source. */
export function lacksCentralEuAuthorisation(fact: Fact): boolean {
  return fact.sources.includes('ema-dataset') && /no centrally authorised/i.test(fact.text);
}

/** Evidence and inference. Uncertain rows stay out of non-safety sections and out of search outside safety. */
export function shownFacts(facts: Fact[]): Fact[] {
  return facts.filter((fact) => fact.type !== 'uncertain');
}

/** Risks, contraindications, interactions, and harm reduction keep uncertain rows. */
function searchableFacts(entry: Entry): Fact[] {
  return [
    ...shownFacts(entry.historic_use),
    ...shownFacts(entry.modern_clinical_use),
    ...shownFacts(entry.legal_trial_status),
    ...shownFacts(entry.effects_spectrum.positive),
    ...shownFacts(entry.effects_spectrum.negative),
    ...entry.risks,
    ...entry.contraindications,
    ...entry.interactions,
    ...entry.harm_reduction,
  ];
}

/** The methoxetamine entry is a stub in the pack. */
export function isIncomplete(entry: Entry): boolean {
  return entry.id === 'methoxetamine' || /\bstub\b/i.test(entry.uncertainty);
}

export function readFamily(value: string | null): Family | 'all' {
  if (value && (FAMILIES as readonly string[]).includes(value)) return value as Family;
  return 'all';
}

export function familyOf(entry: Entry): Family {
  const label = entry.class.toLowerCase();
  if (label.includes('entactogen')) return 'entactogen';
  if (label.includes('dissociative')) return 'dissociative';
  if (label.includes('not a classic psychedelic')) return 'other';
  if (label.includes('psychedelic')) return 'classic';
  return 'other';
}

export function matchesQuery(entry: Entry, query: string): boolean {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = [entry.name, entry.class, entry.id, entry.uncertainty, ...searchableFacts(entry).map((fact) => fact.text)]
    .join('\n')
    .toLowerCase();
  return words.every((word) => haystack.includes(word));
}

export function browse(entries: Entry[], query: string, family: Family | 'all'): Entry[] {
  return entries.filter((entry) => {
    if (family !== 'all' && familyOf(entry) !== family) return false;
    return matchesQuery(entry, query);
  });
}
