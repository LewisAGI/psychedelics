import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { InteractionsPage } from '../src/components/InteractionsPage';
import { pack } from '../src/content';
import { interactionGroups, interactionLead } from '../src/interactions';

const entry = (id: string) => pack.entries.find((item) => item.id === id)!;

describe('interaction index', () => {
  it('keeps uncertain interaction rows for 2C-B, cannabis, and salvia', () => {
    const ids = interactionGroups(pack.entries).map((group) => group.entry.id);
    expect(ids).toEqual(expect.arrayContaining(['2c-b', 'cannabis', 'salvia']));
    expect(entry('salvia').interactions.some((fact) => fact.type === 'uncertain')).toBe(true);
    expect(entry('2c-b').interactions.every((fact) => fact.type === 'uncertain')).toBe(true);
    expect(entry('cannabis').interactions.every((fact) => fact.type === 'uncertain')).toBe(true);
  });

  it('places the pack STP sentence ahead of the DOM chlorpromazine row', () => {
    const dom = entry('dom');
    const row = dom.interactions[0];
    expect(row?.text).toMatch(/chlorpromazine/);
    const lead = interactionLead(dom, row!);
    expect(lead?.text).toContain("street drug 'STP'");
    expect(lead?.text).toContain('1967');
    expect(interactionLead(entry('mdma'), entry('mdma').interactions[0]!)).toBeUndefined();

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <InteractionsPage />
      </MemoryRouter>,
    );
    const section = html.slice(html.indexOf('id="i-dom"'));
    const stp = section.search(/street drug (?:&#x27;|')STP(?:&#x27;|')/);
    const chlorpromazine = section.indexOf('chlorpromazine');
    expect(stp).toBeGreaterThan(-1);
    expect(chlorpromazine).toBeGreaterThan(stp);
  });
});
