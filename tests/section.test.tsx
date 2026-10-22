import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { FactSection } from '../src/components/FactSection';
import type { Fact } from '../src/types';

const mixed: Fact[] = [
  { text: 'Known claim.', sources: ['dea-sched'], type: 'evidence' },
  { text: 'Press-report claim.', sources: ['maps-2026'], type: 'uncertain' },
];

function renderSection(safety = false) {
  return renderToStaticMarkup(
    <MemoryRouter>
      <FactSection id="history" title="History" facts={mixed} safety={safety} />
    </MemoryRouter>,
  );
}

describe('FactSection', () => {
  it('drops uncertain facts unless the section is safety', () => {
    const history = renderSection(false);
    expect(history).toContain('Known claim.');
    expect(history).not.toContain('Press-report claim.');
    expect(history).not.toContain('Uncertain');

    const safety = renderSection(true);
    expect(safety).toContain('Known claim.');
    expect(safety).toContain('Press-report claim.');
    expect(safety).toContain('Uncertain');
  });
});
