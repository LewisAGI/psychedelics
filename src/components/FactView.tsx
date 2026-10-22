import { useEffect, useId, useState } from 'react';
import { sourceById } from '../content';
import type { Fact, FactType } from '../types';
import { IconSources } from '../icons';
import { IconButton } from './IconButton';
import { LinkedText } from './LinkedText';

const TYPE_LABEL: Record<FactType, string> = {
  evidence: 'Evidence',
  inference: 'Inference',
  uncertain: 'Uncertain',
};

export function FactView({
  fact,
  citeId,
  showType = true,
  exceptId,
}: {
  fact: Fact;
  citeId?: string;
  showType?: boolean;
  exceptId?: string;
}) {
  const reactId = useId();
  const id = citeId ?? reactId;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      if (!element?.closest(`[data-fact="${id}"]`)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, id]);

  return (
    <article className="fact" data-fact={id} data-type={fact.type}>
      <p>
        <LinkedText text={fact.text} exceptId={exceptId} />
      </p>
      <div className="fact-meta">
        {showType ? <span className={`badge badge-${fact.type}`}>{TYPE_LABEL[fact.type]}</span> : null}
        <IconButton label="Sources" expanded={open} controls={`${id}-sources`} onClick={() => setOpen((value) => !value)}>
          <IconSources />
        </IconButton>
      </div>
      <div id={`${id}-sources`} className="popout source-popout" hidden={!open} role="region" aria-label="Sources">
        <ul>
          {fact.sources.map((sourceId) => {
            const source = sourceById(sourceId);
            if (!source) {
              return (
                <li key={sourceId}>
                  <span>{sourceId}</span>
                </li>
              );
            }
            return (
              <li key={source.id}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.authors} ({source.year}). {source.title}
                </a>
                <span className="source-quality">{source.quality}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
