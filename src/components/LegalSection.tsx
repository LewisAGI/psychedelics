import { NO_EU_CENTRAL_AUTHORISATION, lacksCentralEuAuthorisation, shownFacts } from '../filter';
import type { Entry } from '../types';
import { FactView } from './FactView';

export function LegalSection({ entry, id = 'legal' }: { entry: Entry; id?: string }) {
  const facts = shownFacts(entry.legal_trial_status);
  if (facts.length === 0) return null;
  return (
    <section aria-labelledby={id}>
      <h2 id={id}>Legal and trial status</h2>
      {facts.map((fact, index) =>
        lacksCentralEuAuthorisation(fact) ? (
          <div key={`${id}-${index}`} className="eu-note" data-status="eu">
            <p className="eu-status">{NO_EU_CENTRAL_AUTHORISATION}</p>
            <FactView fact={fact} citeId={`${id}-${index}`} exceptId={entry.id} />
          </div>
        ) : (
          <FactView key={`${id}-${index}`} fact={fact} citeId={`${id}-${index}`} exceptId={entry.id} />
        ),
      )}
    </section>
  );
}
