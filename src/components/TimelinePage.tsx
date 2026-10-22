import { useEffect } from 'react';
import { pack } from '../content';
import { orderedTimeline } from '../timeline';
import { FactView } from './FactView';

export function TimelinePage() {
  const events = orderedTimeline(pack.timeline);

  useEffect(() => {
    document.title = 'Timeline — Psychedelics';
    return () => {
      document.title = 'Psychedelics';
    };
  }, []);

  return (
    <div className="sheet">
      <h1>Timeline</h1>
      <ol className="timeline">
        {events.map((item, index) => (
          <li key={`${item.date}-${index}`}>
            <p className="when">{item.date}</p>
            <FactView
              fact={{ text: item.event, sources: item.sources, type: 'evidence' }}
              citeId={`timeline-${index}`}
              showType={false}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
