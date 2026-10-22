import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { pack } from '../content';
import { isIncomplete } from '../filter';
import { IconCompare } from '../icons';
import type { Entry } from '../types';
import { FactSection } from './FactSection';
import { IconButton } from './IconButton';
import { LegalSection } from './LegalSection';
import { Spectrum } from './Spectrum';
import { useLocalPanel } from '../useLocalPanel';

function readEntry(id: string | null): Entry | undefined {
  if (!id) return undefined;
  return pack.entries.find((entry) => entry.id === id);
}

function Column({ entry }: { entry: Entry }) {
  return (
    <div className="compare-column">
      <h2 className="entry-title">
        <Link className="crosslink" to={`/substance/${entry.id}`}>
          {entry.name}
        </Link>
      </h2>
      {isIncomplete(entry) ? <p className="incomplete">Incomplete</p> : null}
      <p className="class-line">{entry.class}</p>
      <FactSection id={`${entry.id}-history`} title="History" facts={entry.historic_use} exceptId={entry.id} />
      <FactSection id={`${entry.id}-modern`} title="Modern use" facts={entry.modern_clinical_use} exceptId={entry.id} />
      <LegalSection entry={entry} id={`${entry.id}-legal`} />
      <Spectrum
        positive={entry.effects_spectrum.positive}
        negative={entry.effects_spectrum.negative}
        headingId={`${entry.id}-effects`}
        exceptId={entry.id}
      />
      <FactSection id={`${entry.id}-risks`} title="Risks" facts={entry.risks} exceptId={entry.id} />
      <FactSection id={`${entry.id}-contraindications`} title="Contraindications" facts={entry.contraindications} exceptId={entry.id} />
      <FactSection id={`${entry.id}-interactions`} title="Interactions" facts={entry.interactions} exceptId={entry.id} />
      <FactSection id={`${entry.id}-harm`} title="Harm reduction" facts={entry.harm_reduction} exceptId={entry.id} />
    </div>
  );
}

export function ComparePage() {
  const [params, setParams] = useSearchParams();
  const first = useLocalPanel();
  const second = useLocalPanel();
  const left = readEntry(params.get('a'));
  const right = readEntry(params.get('b'));

  useEffect(() => {
    document.title = 'Compare — Psychedelics';
    return () => {
      document.title = 'Psychedelics';
    };
  }, []);

  function choose(side: 'a' | 'b', id: string) {
    const next = new URLSearchParams(params);
    next.set(side, id);
    setParams(next);
    first.close();
    second.close();
  }

  return (
    <div className="sheet sheet-wide">
      <div className="page-head">
        <h1>Compare</h1>
        <div className="page-tools">
          <div className="tool" ref={first.ref}>
            <IconButton label="First" toggle pressed={Boolean(left)} expanded={first.open} controls="compare-a" onClick={first.toggle}>
              <IconCompare />
            </IconButton>
            <div id="compare-a" className="popout" hidden={!first.open} role="group" aria-label="First">
              {pack.entries.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className="menu-option"
                  aria-pressed={left?.id === entry.id}
                  onClick={() => choose('a', entry.id)}
                >
                  {entry.name}
                </button>
              ))}
            </div>
          </div>
          <div className="tool" ref={second.ref}>
            <IconButton
              label="Second"
              toggle
              pressed={Boolean(right)}
              expanded={second.open}
              controls="compare-b"
              onClick={second.toggle}
            >
              <IconCompare />
            </IconButton>
            <div id="compare-b" className="popout" hidden={!second.open} role="group" aria-label="Second">
              {pack.entries.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className="menu-option"
                  aria-pressed={right?.id === entry.id}
                  onClick={() => choose('b', entry.id)}
                >
                  {entry.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="compare-grid">
        {left ? <Column entry={left} /> : <div />}
        {right ? <Column entry={right} /> : <div />}
      </div>
    </div>
  );
}
