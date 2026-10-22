import { FactView } from './FactView';
import type { Fact } from '../types';

export function Spectrum({ positive, negative }: { positive: Fact[]; negative: Fact[] }) {
  if (positive.length + negative.length === 0) return null;
  return (
    <section className="spectrum" aria-label="Effects spectrum">
      <h2>Effects</h2>
      <div className="spectrum-board">
        <div className="pole">
          <h3>Reported effects</h3>
          {positive.map((fact, index) => (
            <FactView key={`pos-${index}`} fact={fact} citeId={`effect-pos-${index}`} />
          ))}
        </div>
        <div className="axis" aria-hidden="true" />
        <div className="pole">
          <h3>Difficult effects</h3>
          {negative.map((fact, index) => (
            <FactView key={`neg-${index}`} fact={fact} citeId={`effect-neg-${index}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
