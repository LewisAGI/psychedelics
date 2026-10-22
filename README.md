# Psychedelics

A static educational site on psychedelic substances. Harm-reduction framing. Not medical advice. No sourcing, purchasing, extraction, or synthesis information.

The dataset is content pack v3 in [`data/`](data/README.md): 15 substances, 155 sourced facts, 21 timeline events, 12 further-reading items, and 55 sources. Citations were checked on 2026-10-22. The JSON shape is documented in [`data/schema.json`](data/schema.json) and [`data/README.md`](data/README.md).

Each fact is `evidence`, `inference`, or `uncertain`, shown as a badge. A fact typed `uncertain` also carries an Unverified marker. Nothing is dropped because of its type.

EU status comes from EMA's medicines list. Esketamine (Spravato) is the approved medicine. The other substances that list was checked for show **not approved in the EU**, with that dataset as the source. The methoxetamine entry is a stub and is marked Incomplete.

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
