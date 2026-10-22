import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pack, sourceById } from '../content';
import { entriesCiting, readingAnchor } from '../reading';
import { LinkedText } from './LinkedText';

export function ReadingPage() {
  useEffect(() => {
    document.title = 'Reading — Psychedelics';
    return () => {
      document.title = 'Psychedelics';
    };
  }, []);

  return (
    <div className="sheet">
      <h1>Reading</h1>
      <ul className="reading">
        {pack.further_reading.map((item) => {
          const source = sourceById(item.source);
          const cited = entriesCiting(item.source);
          return (
            <li key={item.source} id={readingAnchor(item.source)}>
              <p>
                <LinkedText text={item.why} />
              </p>
              {source ? (
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.authors} ({source.year}). {source.title}
                </a>
              ) : (
                <p>{item.source}</p>
              )}
              {source ? <span className="source-quality">{source.quality}</span> : null}
              {cited.length > 0 ? (
                <p className="cited-by">
                  {cited.map((entry, index) => (
                    <span key={entry.id}>
                      {index > 0 ? ' · ' : null}
                      <Link className="crosslink" to={`/substance/${entry.id}`}>
                        {entry.name}
                      </Link>
                    </span>
                  ))}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
