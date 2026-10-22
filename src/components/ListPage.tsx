import { Link, useSearchParams } from 'react-router-dom';
import { pack } from '../content';
import { browse, familyOf, isIncomplete, readFamily } from '../filter';
import { FAMILY_LABEL } from '../types';

export function ListPage() {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const family = readFamily(params.get('family'));
  const entries = browse(pack.entries, query, family);

  return (
    <div className="sheet">
      {entries.length === 0 ? <p className="empty">No matches</p> : null}
      <ul className="catalog">
        {entries.map((entry) => (
          <li key={entry.id}>
            <Link to={`/substance/${entry.id}`} className="card">
              <h2>{entry.name}</h2>
              <p>{FAMILY_LABEL[familyOf(entry)]}</p>
              {isIncomplete(entry) ? <p className="incomplete">Incomplete</p> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
