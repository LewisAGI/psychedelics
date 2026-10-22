/** Names the pack itself uses for an entry. Longer terms win, so 5-MeO-DMT is not also DMT. */
export const ALIASES: { id: string; term: string }[] = [
  { id: '5-meo-dmt', term: '5-MeO-DMT' },
  { id: 'amanita-muscaria', term: 'Amanita muscaria' },
  { id: 'nitrous-oxide', term: 'Nitrous oxide' },
  { id: 'nitrous-oxide', term: 'nitrous oxide' },
  { id: 'methoxetamine', term: 'Methoxetamine' },
  { id: 'methoxetamine', term: 'MXE' },
  { id: 'salvia', term: 'Salvia divinorum' },
  { id: 'salvia', term: 'Salvia' },
  { id: 'psilocybin', term: 'Magic Mushroom' },
  { id: 'psilocybin', term: 'Psilocybin' },
  { id: 'psilocybin', term: 'psilocybin' },
  { id: 'mescaline', term: 'Mescaline' },
  { id: 'mescaline', term: 'mescaline' },
  { id: 'mescaline', term: 'peyote' },
  { id: 'ibogaine', term: 'Ibogaine' },
  { id: 'ibogaine', term: 'ibogaine' },
  { id: 'ibogaine', term: 'iboga' },
  { id: 'ketamine', term: 'esketamine' },
  { id: 'ketamine', term: 'Esketamine' },
  { id: 'ketamine', term: 'Spravato' },
  { id: 'ketamine', term: 'Ketamine' },
  { id: 'ketamine', term: 'ketamine' },
  { id: 'mdma', term: 'midomafetamine' },
  { id: 'mdma', term: 'MDMA' },
  { id: 'dmt-ayahuasca', term: 'Ayahuasca' },
  { id: 'dmt-ayahuasca', term: 'ayahuasca' },
  { id: 'dmt-ayahuasca', term: 'hoasca' },
  { id: 'dmt-ayahuasca', term: 'DMT' },
  { id: 'lsd', term: 'LSD' },
  { id: '2c-b', term: '2C-B' },
  { id: 'dom', term: 'DOM' },
  { id: 'cannabis', term: 'Cannabis' },
  { id: 'cannabis', term: 'cannabis' },
];

export interface TextPart {
  text: string;
  entryId?: string;
}

const ORDERED = [...ALIASES].sort((a, b) => b.term.length - a.term.length || a.term.localeCompare(b.term));

function edge(term: string): string {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return `(?<![A-Za-z0-9])${escaped}(?![A-Za-z0-9])`;
}

/** Split text into plain runs and substance links. exceptId stays text so a page does not link to itself. */
export function linkParts(text: string, exceptId?: string): TextPart[] {
  const found: { start: number; end: number; id: string }[] = [];
  for (const alias of ORDERED) {
    const re = new RegExp(edge(alias.term), 'g');
    for (const match of text.matchAll(re)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;
      if (found.some((span) => start < span.end && end > span.start)) continue;
      found.push({ start, end, id: alias.id });
    }
  }
  found.sort((a, b) => a.start - b.start);
  const parts: TextPart[] = [];
  let cursor = 0;
  for (const span of found) {
    if (span.start > cursor) parts.push({ text: text.slice(cursor, span.start) });
    const entryId = span.id === exceptId ? undefined : span.id;
    parts.push({ text: text.slice(span.start, span.end), entryId });
    cursor = span.end;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor) });
  if (parts.length === 0) parts.push({ text });
  return parts;
}

export function mentionsEntry(text: string, entryId: string): boolean {
  return linkParts(text).some((part) => part.entryId === entryId);
}
