import type { Entry } from './types';

export interface GlossaryTerm {
  id: string;
  term: string;
  /** The pack's class line. Not a definition written for the page. */
  gloss: string;
}

export function glossaryAnchor(id: string): string {
  return `g-${id}`;
}

export function glossaryTerms(entries: Entry[]): GlossaryTerm[] {
  return entries
    .map((entry) => ({ id: entry.id, term: entry.name, gloss: entry.class }))
    .sort((a, b) => a.term.localeCompare(b.term, 'en'));
}
