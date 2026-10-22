# Psychedelics

A static educational site on psychedelic substances. Harm-reduction framing. Not medical advice. No sourcing, purchasing, extraction, or synthesis information.

The dataset is content pack v3 in [`data/`](data/README.md): 15 substances, 155 sourced facts, 21 timeline events, 12 further-reading items, and 55 sources. Citations were checked on 2026-10-22. The JSON shape is documented in [`data/schema.json`](data/schema.json) and [`data/README.md`](data/README.md).

Each fact is `evidence`, `inference`, or `uncertain`. Evidence and inference are shown with a badge. Facts typed `uncertain` stay in the dataset and are omitted from the site, including search.

EU status comes from EMA's medicines list. Esketamine (Spravato) is the centrally authorised medicine. The other substances that list was checked for show **No EU central authorisation**, with that dataset as the source. National authorisations are outside that list. The methoxetamine entry is a stub and is marked Incomplete.

The interface is icon controls with hover and long-press labels. Search, filters, related substances, and compare pickers open as pop-outs. Pages cover the catalogue, substance detail, a substance-filtered timeline, origins, a glossary of pack class lines, sourced interaction rows, side-by-side comparison, and the further-reading list. Substance names in the pack are cross-linked. Nothing is added beyond the pack.

```bash
npm ci
npm run dev
```

```bash
npm test
npm run test:e2e
```

```bash
npm ci && npm run build
```

The production files land in `dist/`. The HOHM bridge publishes that directory to Cloudflare Pages project `psychedelics`. This repository does not contain Cloudflare credentials.

## Licence

MIT. See `LICENSE`. The globe uses NASA Blue Marble imagery (public domain) and Natural Earth land polygons (public domain), the same base as [history-of-humanity-map](https://github.com/LewisAGI/history-of-humanity-map).
