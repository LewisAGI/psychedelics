import { describe, expect, it } from 'vitest';
import { pack } from '../src/content';
import { browse, familyOf, isIncomplete, lacksCentralEuAuthorisation, matchesQuery } from '../src/filter';
import { ORIGINS } from '../src/origins';

const entry = (id: string) => pack.entries.find((item) => item.id === id)!;

describe('browse', () => {
  it('filters by name and by class family', () => {
    expect(browse(pack.entries, 'iboga', 'all').map((item) => item.id)).toEqual(['ibogaine']);
    expect(browse(pack.entries, '', 'entactogen').map((item) => item.id)).toEqual(['mdma']);
    expect(familyOf(entry('ketamine'))).toBe('dissociative');
    expect(familyOf(entry('salvia'))).toBe('other');
    expect(familyOf(entry('amanita-muscaria'))).toBe('other');
    expect(familyOf(entry('methoxetamine'))).toBe('dissociative');
    expect(browse(pack.entries, 'no-such-substance', 'all')).toEqual([]);
  });

  it('hides uncertain facts from search', () => {
    expect(matchesQuery(entry('mdma'), 'resubmitted the NDA')).toBe(false);
    expect(matchesQuery(entry('salvia'), 'Interaction data are limited')).toBe(false);
    expect(matchesQuery(entry('mdma'), 'serotonin syndrome')).toBe(true);
  });
});

describe('EU authorisation', () => {
  it('marks every non-esketamine EMA row as not centrally authorised', () => {
    const absent = pack.entries.filter((item) => item.legal_trial_status.some(lacksCentralEuAuthorisation));
    expect(absent.map((item) => item.id).sort()).toEqual(
      [
        'psilocybin',
        'lsd',
        'mdma',
        'dmt-ayahuasca',
        'mescaline',
        'ibogaine',
        '5-meo-dmt',
        'salvia',
        '2c-b',
        'dom',
        'methoxetamine',
      ].sort(),
    );
    expect(entry('ketamine').legal_trial_status.some(lacksCentralEuAuthorisation)).toBe(false);
    expect(entry('ketamine').legal_trial_status.some((fact) => /EU-wide marketing authorisation/.test(fact.text))).toBe(
      true,
    );
    for (const id of ['amanita-muscaria', 'nitrous-oxide', 'cannabis']) {
      expect(entry(id).legal_trial_status.some(lacksCentralEuAuthorisation)).toBe(false);
    }
  });
});

describe('incomplete entries', () => {
  it('marks only the methoxetamine stub', () => {
    expect(pack.entries.filter(isIncomplete).map((item) => item.id)).toEqual(['methoxetamine']);
  });
});

describe('origins', () => {
  it('pins only places named in a historic fact', () => {
    expect(ORIGINS.map((pin) => pin.id)).toEqual(['psilocybin', 'salvia', 'dmt-ayahuasca']);
    for (const pin of ORIGINS) {
      expect(entry(pin.id).historic_use.some((fact) => fact.text.includes(pin.place))).toBe(true);
    }
  });
});
