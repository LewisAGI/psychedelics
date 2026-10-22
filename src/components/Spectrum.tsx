import { shownFacts } from '../filter';
import type { Fact } from '../types';
import { FactView } from './FactView';

export function Spectrum({
  positive,
  negative,
  headingId = 'effects',
  exceptId,
}: {
  positive: Fact[];
  negative: Fact[];
  headingId?: string;
  exceptId?: string;
}) {
  const reported = shownFacts(positive);
  const difficult = shownFacts(negative);
  if (reported.length + difficult.length === 0) return null;
  return (
    <section className="spectrum" aria-label="Effects spectrum">
      <h2 id={headingId}>Effects</h2>
      <div className="spectrum-board">
        <div className="pole">
          <h3>Reported effects</h3>
          {reported.map((fact, index) => (
            <FactView key={`pos-${index}`} fact={fact} citeId={`${headingId}-pos-${index}`} exceptId={exceptId} />
          ))}
        </div>
        <div className="axis" aria-hidden="true" />
        <div className="pole">
          <h3>Difficult effects</h3>
          {difficult.map((fact, index) => (
            <FactView key={`neg-${index}`} fact={fact} citeId={`${headingId}-neg-${index}`} exceptId={exceptId} />
          ))}
        </div>
      </div>
    </section>
  );
}
