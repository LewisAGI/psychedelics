import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pack } from '../content';
import { interactionAnchor, interactionGroups, interactionLead } from '../interactions';
import { FactView } from './FactView';

export function InteractionsPage() {
  const groups = interactionGroups(pack.entries);

  useEffect(() => {
    document.title = 'Interactions — Psychedelics';
    return () => {
      document.title = 'Psychedelics';
    };
  }, []);

  return (
    <div className="sheet">
      <h1>Interactions</h1>
      {groups.map((group) => (
        <section key={group.entry.id} id={interactionAnchor(group.entry.id)} aria-labelledby={`ix-${group.entry.id}`}>
          <h2 id={`ix-${group.entry.id}`} className="entry-title">
            <Link className="crosslink" to={`/substance/${group.entry.id}`}>
              {group.entry.name}
            </Link>
          </h2>
          {group.facts.map((fact, index) => {
            const lead = interactionLead(group.entry, fact);
            return (
              <div key={index}>
                {lead ? (
                  <FactView fact={lead} citeId={`ix-${group.entry.id}-${index}-lead`} exceptId={group.entry.id} />
                ) : null}
                <FactView fact={fact} citeId={`ix-${group.entry.id}-${index}`} exceptId={group.entry.id} />
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
