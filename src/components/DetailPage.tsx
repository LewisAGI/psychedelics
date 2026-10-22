import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { entryById, pack } from '../content';
import { familyOf, isIncomplete, shownFacts } from '../filter';
import { IconBack, IconCompare, IconPrint, IconRelated, IconSections } from '../icons';
import type { Entry, Fact } from '../types';
import { FactSection } from './FactSection';
import { IconButton } from './IconButton';
import { LegalSection } from './LegalSection';
import { LinkedText } from './LinkedText';
import { Spectrum } from './Spectrum';
import { useLocalPanel } from '../useLocalPanel';

function sectionLinks(entry: Entry): { href: string; label: string }[] {
  const links: { href: string; label: string }[] = [];
  const add = (id: string, label: string, facts: Fact[], safety = false) => {
    const visible = safety ? facts : shownFacts(facts);
    if (visible.length > 0) links.push({ href: `#${id}`, label });
  };
  add('history', 'History', entry.historic_use);
  add('modern', 'Modern use', entry.modern_clinical_use);
  add('legal', 'Legal and trial status', entry.legal_trial_status);
  add('effects', 'Effects', [...entry.effects_spectrum.positive, ...entry.effects_spectrum.negative]);
  add('risks', 'Risks', entry.risks, true);
  add('contraindications', 'Contraindications', entry.contraindications, true);
  add('interactions', 'Interactions', entry.interactions, true);
  add('harm', 'Harm reduction', entry.harm_reduction, true);
  if (entry.uncertainty.trim()) links.push({ href: '#unresolved', label: 'Unresolved' });
  return links;
}

export function DetailPage() {
  const { id } = useParams();
  const entry = id ? entryById(id) : undefined;
  const sections = useLocalPanel();
  const relatedPanel = useLocalPanel();

  useEffect(() => {
    document.title = entry ? `${entry.name} — Psychedelics` : 'Psychedelics';
    return () => {
      document.title = 'Psychedelics';
    };
  }, [entry]);

  if (!entry) {
    return (
      <div className="sheet">
        <Link to="/" className="icon-button" data-tip="Substances" aria-label="Substances">
          <IconBack />
        </Link>
        <p className="empty">No matches</p>
      </div>
    );
  }

  const links = sectionLinks(entry);
  const related = pack.entries.filter((item) => item.id !== entry.id && familyOf(item) === familyOf(entry));

  return (
    <article className="sheet">
      <div className="page-tools">
        <Link to="/" className="icon-button" data-tip="Substances" aria-label="Substances">
          <IconBack />
        </Link>
        <div className="tool" ref={sections.ref}>
          <IconButton label="Sections" toggle expanded={sections.open} controls="section-popout" onClick={sections.toggle}>
            <IconSections />
          </IconButton>
          <div id="section-popout" className="popout" hidden={!sections.open} role="navigation" aria-label="Sections">
            {links.map((link) => (
              <a key={link.href} className="menu-option" href={link.href} onClick={sections.close}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
        {related.length > 0 ? (
          <div className="tool" ref={relatedPanel.ref}>
            <IconButton
              label="Related"
              toggle
              expanded={relatedPanel.open}
              controls="related-popout"
              onClick={relatedPanel.toggle}
            >
              <IconRelated />
            </IconButton>
            <div id="related-popout" className="popout" hidden={!relatedPanel.open} role="navigation" aria-label="Related">
              {related.map((item) => (
                <Link key={item.id} className="menu-option" to={`/substance/${item.id}`} onClick={relatedPanel.close}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        <Link to={`/compare?a=${entry.id}`} className="icon-button" data-tip="Compare" aria-label="Compare">
          <IconCompare />
        </Link>
        <IconButton label="Print" onClick={() => window.print()}>
          <IconPrint />
        </IconButton>
      </div>
      <h1>{entry.name}</h1>
      {isIncomplete(entry) ? <p className="incomplete">Incomplete</p> : null}
      <p className="class-line">{entry.class}</p>
      <FactSection id="history" title="History" facts={entry.historic_use} exceptId={entry.id} />
      <FactSection id="modern" title="Modern use" facts={entry.modern_clinical_use} exceptId={entry.id} />
      <LegalSection entry={entry} />
      <Spectrum
        positive={entry.effects_spectrum.positive}
        negative={entry.effects_spectrum.negative}
        exceptId={entry.id}
      />
      <FactSection id="risks" title="Risks" facts={entry.risks} exceptId={entry.id} safety />
      <FactSection id="contraindications" title="Contraindications" facts={entry.contraindications} exceptId={entry.id} safety />
      <FactSection id="interactions" title="Interactions" facts={entry.interactions} exceptId={entry.id} safety />
      <FactSection id="harm" title="Harm reduction" facts={entry.harm_reduction} exceptId={entry.id} safety />
      {entry.uncertainty.trim() ? (
        <section aria-labelledby="unresolved">
          <h2 id="unresolved">Unresolved</h2>
          <p className="caveat">
            <LinkedText text={entry.uncertainty} exceptId={entry.id} />
          </p>
        </section>
      ) : null}
      <p className="notice notice-foot">{pack.disclaimer}</p>
    </article>
  );
}
