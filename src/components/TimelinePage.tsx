import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { pack } from '../content';
import { mentionsEntry } from '../crosslink';
import { IconFilter } from '../icons';
import { anchoredTimeline } from '../timeline';
import { FactView } from './FactView';
import { IconButton } from './IconButton';
import { useLocalPanel } from '../useLocalPanel';

export function TimelinePage() {
  const [params, setParams] = useSearchParams();
  const filter = useLocalPanel();
  const substance = params.get('substance');
  const anchored = anchoredTimeline(pack.timeline);
  const visible = substance ? anchored.filter((item) => mentionsEntry(item.event.event, substance)) : anchored;
  const present = pack.entries
    .filter((entry) => anchored.some((item) => mentionsEntry(item.event.event, entry.id)))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));

  useEffect(() => {
    document.title = 'Timeline — Psychedelics';
    return () => {
      document.title = 'Psychedelics';
    };
  }, []);

  function select(id: string | null) {
    const next = new URLSearchParams(params);
    if (id) next.set('substance', id);
    else next.delete('substance');
    setParams(next);
    filter.close();
  }

  return (
    <div className="sheet">
      <div className="page-head">
        <h1>Timeline</h1>
        <div className="tool" ref={filter.ref}>
          <IconButton
            label="Substance"
            toggle
            pressed={Boolean(substance)}
            expanded={filter.open}
            controls="timeline-filter"
            onClick={filter.toggle}
          >
            <IconFilter />
          </IconButton>
          <div id="timeline-filter" className="popout" hidden={!filter.open} role="group" aria-label="Substance">
            <button type="button" className="menu-option" aria-pressed={!substance} onClick={() => select(null)}>
              All
            </button>
            {present.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className="menu-option"
                aria-pressed={substance === entry.id}
                onClick={() => select(entry.id)}
              >
                {entry.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {visible.length === 0 ? <p className="empty">No matches</p> : null}
      <ol className="timeline">
        {visible.map((item) => (
          <li key={item.anchor} id={item.anchor}>
            <p className="when">{item.event.date}</p>
            <FactView
              fact={{ text: item.event.event, sources: item.event.sources, type: 'evidence' }}
              citeId={item.anchor}
              showType={false}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
