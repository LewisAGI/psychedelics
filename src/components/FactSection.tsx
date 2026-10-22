import type { ReactNode } from 'react';
import type { Fact } from '../types';
import { FactView } from './FactView';

export function FactSection({
  title,
  facts,
  id,
  extra,
}: {
  title: string;
  facts: Fact[];
  id: string;
  extra?: ReactNode;
}) {
  if (facts.length === 0 && !extra) return null;
  return (
    <section aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {facts.map((fact, index) => (
        <FactView key={`${id}-${index}`} fact={fact} citeId={`${id}-${index}`} />
      ))}
      {extra}
    </section>
  );
}
