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

  it('renders an inference badge', () => {
    const html = renderToStaticMarkup(
      <FactView fact={{ text: 'Extended claim.', sources: ['dea-sched'], type: 'inference' }} />,
    );
    expect(html).toContain('Inference');
    expect(html).toContain('Extended claim.');
  });

  it('omits an uncertain fact', () => {
    const html = renderToStaticMarkup(
      <FactView fact={{ text: 'Press-report claim.', sources: ['maps-2026'], type: 'uncertain' }} />,
    );
    expect(html).toBe('');
  });
});
