export const FACT_TYPES = ['evidence', 'inference', 'uncertain'] as const;
export type FactType = (typeof FACT_TYPES)[number];

export interface Fact {
  text: string;
  sources: string[];
  type: FactType;
}

export interface EffectsSpectrum {
  positive: Fact[];
  negative: Fact[];
}

export interface Entry {
  id: string;
  name: string;
  class: string;
  historic_use: Fact[];
  modern_clinical_use: Fact[];
  legal_trial_status: Fact[];
  effects_spectrum: EffectsSpectrum;
  risks: Fact[];
  contraindications: Fact[];
  interactions: Fact[];
  harm_reduction: Fact[];
  /** Editorial caveat. Not a sourced fact. */
  uncertainty: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
  sources: string[];
}

export interface FurtherReading {
  source: string;
  why: string;
}

export interface ContentPack {
  pack: string;
  version: number;
  generated: string;
  /** Date the pack's citations were checked. */
  verified: string;
  disclaimer: string;
  entries: Entry[];
  timeline: TimelineEvent[];
  further_reading: FurtherReading[];
}

export interface Source {
  id: string;
  title: string;
  authors: string;
  url: string;
  year: number;
  quality: string;
}

export const FAMILIES = ['classic', 'entactogen', 'dissociative', 'other'] as const;
export type Family = (typeof FAMILIES)[number];

export const FAMILY_LABEL: Record<Family, string> = {
  classic: 'Classic',
  entactogen: 'Entactogen',
  dissociative: 'Dissociative',
  other: 'Other',
};
