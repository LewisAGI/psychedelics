import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FactView } from '../src/components/FactView';

describe('FactView', () => {
  it('badges evidence without an unverified marker', () => {
    const html = renderToStaticMarkup(
      <FactView fact={{ text: 'Cited claim.', sources: ['dea-sched'], type: 'evidence' }} />,
    );
    expect(html).toContain('Evidence');
    expect(html).toContain('Cited claim.');
    expect(html).not.toContain('Unverified');
  });

  it('badges an uncertain fact and marks it unverified', () => {
    const html = renderToStaticMarkup(
      <FactView fact={{ text: 'Press-report claim.', sources: ['maps-2026'], type: 'uncertain' }} />,
    );
    expect(html).toContain('Uncertain');
    expect(html).toContain('Unverified');
    expect(html).toContain('is-uncertain');
    expect(html).toContain('Press-report claim.');
    expect(html).toContain('maps.org');
  });
});
