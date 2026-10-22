import type { ReactNode } from 'react';
import { shownFacts } from '../filter';
import type { Fact } from '../types';
import { FactView } from './FactView';

export function FactSection({
  title,
  facts,
  id,
  extra,
  exceptId,
  safety = false,
}: {
  title: string;
  facts: Fact[];
  id: string;
  extra?: ReactNode;
  exceptId?: string;
  /** Risks, contraindications, interactions, and harm reduction keep uncertain rows. */
  safety?: boolean;
}) {
  const visible = safety ? facts : shownFacts(facts);
  if (visible.length === 0 && !extra) return null;
  return (
    <section aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {visible.map((fact, index) => (
        <FactView key={`${id}-${index}`} fact={fact} citeId={`${id}-${index}`} exceptId={exceptId} />
      ))}
      {extra}
    </section>
  );
}
