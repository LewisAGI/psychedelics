import { useEffect } from 'react';
import { pack, sourceById } from '../content';

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
          return (
            <li key={item.source}>
              <p>{item.why}</p>
              {source ? (
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.authors} ({source.year}). {source.title}
                </a>
              ) : (
                <p>{item.source}</p>
              )}
              {source ? <span className="source-quality">{source.quality}</span> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
