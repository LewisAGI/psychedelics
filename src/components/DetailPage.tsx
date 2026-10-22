import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { entryById, pack } from '../content';
import { isIncomplete, lacksCentralEuAuthorisation } from '../filter';
import { IconBack } from '../icons';
import { FactSection } from './FactSection';
import { FactView } from './FactView';
import { Spectrum } from './Spectrum';

export function DetailPage() {
  const { id } = useParams();
  const entry = id ? entryById(id) : undefined;

  useEffect(() => {
    document.title = entry ? `${entry.name} — Psychedelics` : 'Psychedelics';
    return () => {
      document.title = 'Psychedelics';
    };
  }, [entry]);

  if (!entry) {
    return (
      <div className="sheet">
        <Link to="/" className="icon-button" data-tip="Substances" aria-label="Substances">
          <IconBack />
        </Link>
        <p className="empty">No matches</p>
      </div>
    );
  }

  return (
    <article className="sheet">
      <Link to="/" className="icon-button" data-tip="Substances" aria-label="Substances">
        <IconBack />
      </Link>
      <h1>{entry.name}</h1>
      {isIncomplete(entry) ? <p className="incomplete">Incomplete</p> : null}
      <p className="class-line">{entry.class}</p>
      <FactSection id="history" title="History" facts={entry.historic_use} />
      <FactSection id="modern" title="Modern use" facts={entry.modern_clinical_use} />
      {entry.legal_trial_status.length > 0 ? (
        <section aria-labelledby="legal">
          <h2 id="legal">Legal and trial status</h2>
          {entry.legal_trial_status.map((fact, index) =>
            lacksCentralEuAuthorisation(fact) ? (
              <div key={`legal-${index}`} className="eu-note" data-status="eu">
                <p className="eu-status">not approved in the EU</p>
                <FactView fact={fact} citeId={`legal-${index}`} />
              </div>
            ) : (
              <FactView key={`legal-${index}`} fact={fact} citeId={`legal-${index}`} />
            ),
          )}
        </section>
      ) : null}
      <Spectrum positive={entry.effects_spectrum.positive} negative={entry.effects_spectrum.negative} />
      <FactSection id="risks" title="Risks" facts={entry.risks} />
      <FactSection id="contraindications" title="Contraindications" facts={entry.contraindications} />
      <FactSection id="interactions" title="Interactions" facts={entry.interactions} />
      <FactSection id="harm" title="Harm reduction" facts={entry.harm_reduction} />
      <section aria-labelledby="unresolved">
        <h2 id="unresolved">Unresolved</h2>
        <p className="caveat">{entry.uncertainty}</p>
      </section>
      <p className="notice notice-foot">{pack.disclaimer}</p>
    </article>
  );
}
