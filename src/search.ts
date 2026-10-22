import { pack, sourceById } from './content';
import { glossaryAnchor, glossaryTerms } from './glossary';
import { interactionAnchor, interactionGroups } from './interactions';
import { readingAnchor } from './reading';
import { anchoredTimeline } from './timeline';

export interface SearchHit {
  href: string;
  label: string;
}

/** Timeline, reading, glossary, and interaction hits. The catalog is filtered separately. */
export function searchHits(query: string): SearchHit[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const has = (text: string) => words.every((word) => text.toLowerCase().includes(word));

  const timeline = anchoredTimeline(pack.timeline)
    .filter((item) => has(`${item.event.date} ${item.event.event}`))
    .slice(0, 3)
    .map((item) => ({
      href: `/timeline#${item.anchor}`,
      label: `${item.event.date} ${item.event.event}`,
    }));

  const reading = pack.further_reading
    .filter((item) => {
      const source = sourceById(item.source);
      return has(`${item.why} ${source?.title ?? ''} ${source?.authors ?? ''}`);
    })
    .slice(0, 3)
    .map((item) => {
      const source = sourceById(item.source);
      return {
        href: `/reading#${readingAnchor(item.source)}`,
        label: source ? `${source.authors} (${source.year})` : item.why,
      };
    });

  const glossary = glossaryTerms(pack.entries)
    .filter((term) => has(`${term.term} ${term.gloss}`))
    .slice(0, 3)
    .map((term) => ({ href: `/glossary#${glossaryAnchor(term.id)}`, label: term.term }));

  const interactions = interactionGroups(pack.entries)
    .filter((group) => has(group.facts.map((fact) => fact.text).join('\n')))
    .slice(0, 3)
    .map((group) => ({
      href: `/interactions#${interactionAnchor(group.entry.id)}`,
      label: group.entry.name,
    }));

  return [...timeline, ...reading, ...glossary, ...interactions].slice(0, 8);
}
