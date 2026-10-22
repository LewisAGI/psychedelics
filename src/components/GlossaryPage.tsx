import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pack } from '../content';
import { glossaryAnchor, glossaryTerms } from '../glossary';

export function GlossaryPage() {
  const terms = glossaryTerms(pack.entries);

  useEffect(() => {
    document.title = 'Glossary — Psychedelics';
    return () => {
      document.title = 'Psychedelics';
    };
  }, []);

  return (
    <div className="sheet">
      <h1>Glossary</h1>
      <ul className="glossary">
        {terms.map((term) => (
          <li key={term.id} id={glossaryAnchor(term.id)}>
            <Link className="entry-title" to={`/substance/${term.id}`}>
              {term.term}
            </Link>
            <p className="class-line">{term.gloss}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
