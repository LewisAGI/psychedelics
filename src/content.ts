import rawContent from '../data/content.json';
import rawSources from '../data/sources.json';
import type { ContentPack, Entry, Fact, Source } from './types';

export const pack = rawContent as ContentPack;
export const sources = rawSources as Source[];

const sourceIndex = new Map(sources.map((source) => [source.id, source]));

export function sourceById(id: string): Source | undefined {
  return sourceIndex.get(id);
}

export function entryById(id: string): Entry | undefined {
  return pack.entries.find((entry) => entry.id === id);
}

export function allFacts(entry: Entry): Fact[] {
  return [
    ...entry.historic_use,
    ...entry.modern_clinical_use,
    ...entry.legal_trial_status,
    ...entry.effects_spectrum.positive,
    ...entry.effects_spectrum.negative,
    ...entry.risks,
    ...entry.contraindications,
    ...entry.interactions,
    ...entry.harm_reduction,
  ];
}
