import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DetailPage } from '../src/components/DetailPage';
import { InteractionsPage } from '../src/components/InteractionsPage';
import { NO_EU_CENTRAL_AUTHORISATION } from '../src/filter';

function renderDetail(id: string) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[`/substance/${id}`]}>
      <Routes>
        <Route path="substance/:id" element={<DetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('EU authorisation badge', () => {
  it('uses the central-authorisation label and does not badge ketamine', () => {
    expect(NO_EU_CENTRAL_AUTHORISATION).toBe('No EU central authorisation');
    const psilocybin = renderDetail('psilocybin');
    expect(psilocybin).toContain('No EU central authorisation');
    expect(psilocybin).toContain('data-status="eu"');
    expect(psilocybin).not.toContain('not approved in the EU');

    const ketamine = renderDetail('ketamine');
    expect(ketamine).not.toContain('No EU central authorisation');
    expect(ketamine).not.toContain('data-status="eu"');
    expect(ketamine).not.toContain('not approved in the EU');
    expect(ketamine).toContain('EU-wide marketing authorisation');
  });

  it('keeps non-safety uncertain facts hidden and shows safety rows', () => {
    const mdma = renderDetail('mdma');
    expect(mdma).not.toContain('resubmitted the NDA');
    expect(mdma).not.toContain('Unverified');
    expect(mdma).toContain('Evidence');

    const interactions = renderToStaticMarkup(
      <MemoryRouter>
        <InteractionsPage />
      </MemoryRouter>,
    );
    expect(interactions).toContain('serotonin syndrome');
    expect(interactions).toContain('Interaction data are limited');
    expect(interactions).toContain('id="i-salvia"');
    expect(interactions).toContain('id="i-2c-b"');
    expect(interactions).toContain('id="i-cannabis"');
    expect(interactions).toContain('Uncertain');

    const salvia = renderDetail('salvia');
    expect(salvia).toContain('Interaction data are limited');
    expect(salvia).toContain('Uncertain');
    const cannabis = renderDetail('cannabis');
    expect(cannabis).toContain('with psychedelics is reported to intensify');
    const twoCb = renderDetail('2c-b');
    expect(twoCb).toContain('Combining with other drugs is unpredictable');
    const mxe = renderDetail('methoxetamine');
    expect(mxe).toContain('misuse and toxicity');
    expect(mxe).toContain('Uncertain');
  });
});
