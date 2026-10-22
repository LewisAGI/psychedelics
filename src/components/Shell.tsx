import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { pack } from '../content';
import { IconBook, IconClock, IconCompare, IconFilter, IconGlobe, IconGlossary, IconInteractions, IconLife, IconSearch } from '../icons';
import { RESOURCES } from '../resources';
import { readFamily } from '../filter';
import { searchHits } from '../search';
import { FAMILIES, FAMILY_LABEL, type Family } from '../types';
import { IconButton } from './IconButton';

type Panel = 'search' | 'filter' | 'resources' | null;

export function Shell() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [panel, setPanel] = useState<Panel>(null);
  const query = params.get('q') ?? '';
  const family = readFamily(params.get('family'));
  const [draft, setDraft] = useState(query);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  useEffect(() => {
    if (panel === 'search') document.querySelector<HTMLInputElement>('#search-popout input')?.focus();
  }, [panel]);

  useEffect(() => {
    let timer: number | null = null;
    const clearTip = () => {
      if (timer) window.clearTimeout(timer);
      timer = null;
      document.querySelectorAll('.is-long-tip').forEach((node) => node.classList.remove('is-long-tip'));
    };
    const onDown = (event: PointerEvent) => {
      clearTip();
      const element = event.target instanceof Element ? event.target : null;
      const tipHost = element?.closest<HTMLElement>('[data-tip]');
      const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (tipHost && (!fineHover || event.pointerType === 'touch')) {
        timer = window.setTimeout(() => tipHost.classList.add('is-long-tip'), 500);
      }
      if (!element?.closest('.popout, [data-panel-toggle]')) setPanel(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel(null);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerup', clearTip);
    document.addEventListener('pointercancel', clearTip);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', clearTip);
      document.removeEventListener('pointercancel', clearTip);
      document.removeEventListener('keydown', onKey);
      clearTip();
    };
  }, []);

  function toggle(next: Panel) {
    setPanel((current) => (current === next ? null : next));
  }

  const hits = searchHits(draft);

  function writeBrowse(nextQuery: string, nextFamily: Family | 'all') {
    const search = new URLSearchParams();
    if (nextQuery.trim()) search.set('q', nextQuery);
    if (nextFamily !== 'all') search.set('family', nextFamily);
    const value = search.toString();
    void navigate({ pathname: '/', search: value ? `?${value}` : '' });
  }

  return (
    <div id="app" data-ready="true">
      <header className="topbar">
        <Link to="/" className="wordmark">
          Psychedelics
        </Link>
        <p className="notice">{pack.disclaimer}</p>
        <div className="tools">
          <div className="tool">
            <IconButton
              label="Search"
              toggle
              expanded={panel === 'search'}
              controls="search-popout"
              onClick={() => toggle('search')}
            >
              <IconSearch />
            </IconButton>
            <form
              id="search-popout"
              className="popout"
              hidden={panel !== 'search'}
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                setPanel(null);
              }}
            >
              <input
                name="q"
                aria-label="Search"
                value={draft}
                autoComplete="off"
                enterKeyHint="search"
                onChange={(event) => {
                  const next = event.target.value;
                  setDraft(next);
                  writeBrowse(next, family);
                }}
              />
              {hits.length > 0 ? (
                <ul className="hit-list">
                  {hits.map((hit) => (
                    <li key={hit.href}>
                      <Link to={hit.href} className="menu-option" onClick={() => setPanel(null)}>
                        {hit.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </form>
          </div>
          <div className="tool">
            <IconButton
              label="Filter"
              toggle
              pressed={family !== 'all'}
              expanded={panel === 'filter'}
              controls="filter-popout"
              onClick={() => toggle('filter')}
            >
              <IconFilter />
            </IconButton>
            <div id="filter-popout" className="popout" hidden={panel !== 'filter'} role="group" aria-label="Filter">
              <button
                type="button"
                className="menu-option"
                aria-pressed={family === 'all'}
                onClick={() => {
                  writeBrowse(query, 'all');
                  setPanel(null);
                }}
              >
                All
              </button>
              {FAMILIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="menu-option"
                  aria-pressed={family === item}
                  onClick={() => {
                    writeBrowse(query, item);
                    setPanel(null);
                  }}
                >
                  {FAMILY_LABEL[item]}
                </button>
              ))}
            </div>
          </div>
          <div className="tool">
            <IconButton
              label="Harm reduction"
              toggle
              expanded={panel === 'resources'}
              controls="resources-popout"
              onClick={() => toggle('resources')}
            >
              <IconLife />
            </IconButton>
            <div id="resources-popout" className="popout" hidden={panel !== 'resources'} role="navigation" aria-label="Harm reduction">
              <ul className="resource-list">
                {RESOURCES.map((resource) => (
                  <li key={resource.href}>
                    <a href={resource.href} target="_blank" rel="noreferrer">
                      {resource.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <NavLink
            to="/timeline"
            className={({ isActive }) => (isActive ? 'icon-button is-current' : 'icon-button')}
            data-tip="Timeline"
            aria-label="Timeline"
          >
            <IconClock />
          </NavLink>
          <NavLink
            to="/reading"
            className={({ isActive }) => (isActive ? 'icon-button is-current' : 'icon-button')}
            data-tip="Reading"
            aria-label="Reading"
          >
            <IconBook />
          </NavLink>
          <NavLink
            to="/origins"
            className={({ isActive }) => (isActive ? 'icon-button is-current' : 'icon-button')}
            data-tip="Origins"
            aria-label="Origins"
          >
            <IconGlobe />
          </NavLink>
          <NavLink
            to="/glossary"
            className={({ isActive }) => (isActive ? 'icon-button is-current' : 'icon-button')}
            data-tip="Glossary"
            aria-label="Glossary"
          >
            <IconGlossary />
          </NavLink>
          <NavLink
            to="/interactions"
            className={({ isActive }) => (isActive ? 'icon-button is-current' : 'icon-button')}
            data-tip="Interactions"
            aria-label="Interactions"
          >
            <IconInteractions />
          </NavLink>
          <NavLink
            to="/compare"
            className={({ isActive }) => (isActive ? 'icon-button is-current' : 'icon-button')}
            data-tip="Compare"
            aria-label="Compare"
          >
            <IconCompare />
          </NavLink>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
