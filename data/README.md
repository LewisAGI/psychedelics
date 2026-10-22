# Psychedelics content pack (v1, 2026-10-22)
## Schema
content.json: {pack, version, disclaimer, entries[]}. Each entry has id, name, class, historic_use[], modern_clinical_use[], legal_trial_status[], effects_spectrum{positive[],negative[]}, risks[], contraindications[], interactions[], harm_reduction[], uncertainty (string).
Each fact is {text, sources[] (ids in sources.json), type: evidence|inference|uncertain}.
sources.json: [{id,title,authors,url,year,quality}].
## Counts
v2: 9 substances, 106 sourced facts, 42 sources. Validated: JSON parses, every fact has at least one source id that resolves.
## Evidence, inference and uncertainty
- evidence: stated in the cited source. inference: reasonable extension (flagged). uncertain: secondary or press-release-stage.
- LSD phase 3, the DMT/5-MeO-DMT pipeline, the MDMA 2026 resubmission and Texas ibogaine rows rely on an aggregator (resolv.social). Verify against sponsor/FDA before publishing.
## Gaps
- Only FDA, Lykos, Compass and some search-surfaced pages were fetched live. Many DOIs/citations come from known literature and were not individually re-opened. A source-check pass (open each DOI) is recommended before launch.
- No EMA/UK MHRA status rows yet. No pharmacokinetic/dose tables (deliberately conservative).
- No sourcing, purchasing, extraction or synthesis content, by design.

## Verification log (v2, 2026-10-22)
Every source was opened: DOIs via Crossref/OpenAlex (titles and abstracts checked against the citing facts), and URLs via HTTP fetch or WebFetch.
- Fixed wrong DOIs: nayak-lithium → 10.1055/a-1524-2794 (Pharmacopsychiatry 2021); mescaline-review → 10.1016/j.neuropharm.2022.109294; hppd-review replaced (the old DOI pointed to an unrelated paper) with the 2025 HPPD systematic review 10.1097/hrp.0000000000000439.
- Fixed dead FDA URLs (404): fda-spravato now points to the NDA 211243 approval package (accessdata.fda.gov); fda-ketamine-compounded now points to the archived 2023 alert linked from FDA's Compounding Risk Alerts page.
- Removed resolv-status (aggregator). Replaced it with Definium Emerge/Voyage press releases (LSD), the AtaiBeckley BPL-003 release (5-MeO-DMT), the Texas Governor SB 2308 release (ibogaine), and a MAPS statement (MDMA resubmission, marked uncertain because the sponsor hasn't announced it). Dropped the DMT-analogue pipeline fact; no primary source was gathered for it.
- Removed nutt-2010 (unused).
- Added eCFR 21 CFR 1308.11 for US Schedule I status of psilocybin, DMT, 5-MeO-DMT, ibogaine and mescaline. The DEA page only names LSD, ecstasy, peyote and ketamine (III).
- Rewrote facts the source abstract did not support: mescaline (1897/1919 isolation dates removed; peyote overharvesting removed; nausea replaced with the abstract's 'psychotomimetic, mostly mild'); ibogaine (Bwiti/Gabon claim removed; Noller sample corrected to 14 participants, 8 completers; risk restated as reported sudden deaths hypothesised to be arrhythmic); 5-MeO-DMT (toad-secretion and 'ego dissolution' wording removed); ayahuasca (rewritten to match Callaway & Grob abstract).
- EMA/MHRA added: EMA Spravato EPAR (EU authorisation 18 Dec 2019); UK Schedule 1 for psilocybin (Home Office written answer, Nov 2025: no MHRA marketing authorisation), and for LSD and ecstasy (BNF); UK ketamine Schedule 2 (BNF).
- Existence-only checks: some pages block bots (StatPearls, DanceSafe, Justia, congress.gov, TGA), so their content wasn't re-read. TGA's URL was confirmed by search.
## Remaining gaps
- EMA: no EU authorisation found for psilocybin, MDMA or LSD, but EMA's site search couldn't be read automatically. Treat 'not authorised in EU' as unverified, so it is not stated in content.json.
- Sarparast 2022 abstract not retrievable; the citation exists but its supporting text isn't re-checked.
- MHRA has no product status for MDMA, DMT, ibogaine, mescaline or salvia beyond scheduling.

## v3 changelog (2026-10-22)
Counts: 15 entries, 155 sourced facts, 21 timeline events, 12 further-reading items, 55 sources. JSON checks pass: every fact, timeline item and reading item resolves to a source, and none are unused.
- New entries: 2C-B (Papaseit 2018 observational study), DOM/DOx (Snyder 1967, Science), Amanita muscaria (2026 Molecules review; FDA food alert of 18 Dec 2024), nitrous oxide (FRANK; Nagele 2021 phase 2 RCT; 2026 Cureus systematic review of B12 complications), cannabis including as an adjunct (FRANK; Di Forti 2019 EU-GEI), and methoxetamine/ketamine analogues (a stub: one letter, title-level only).
- EMA gap closed: I downloaded EMA's medicines dataset (generated 22 Oct 2026) and searched its active-substance fields. Only esketamine (Spravato) appears. Psilocybin, MDMA, LSD, DMT, mescaline, ibogaine, 5-MeO-DMT, salvinorin A, 2C-B, DOM and methoxetamine aren't centrally authorised. Each relevant entry now carries this fact, with the caveat that national authorisations aren't covered.
- Psilocybin: added the Johnson 2014 tobacco-cessation open-label pilot (80% abstinence at 6 months, n=15).
- Added a `timeline` array (date, event, sources[]) and a `further_reading` array (source, why).
- Verification: every new DOI was checked via Crossref, and abstracts were read via OpenAlex or PubMed. FRANK pages were fetched and quoted text matched. The FDA Amanita page was confirmed via search excerpt.
- Not verified at abstract level: Cole 2002 (2C-B) and Loeffler 2013 (MXE) have no abstracts and are title-level only (marked uncertain or further reading). The Amanita poisoning case literature (Toxicon 2005/2014) has no abstracts available, so it isn't used.
- Not added: DOM-class modern data (none found); a cannabis-psychedelic co-use study (only preprints or MDMA co-use found); 2C-B and Amanita UK/US scheduling (no regulator page fetched).
- Still excluded: sourcing, dose tables and synthesis.
