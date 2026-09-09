# STEP88 — VANDIRA ECI Actual Data Ingestion & Normalization Engine

## Objective
Move from official-source discovery to a controlled, queryable ingestion layer for Election Commission of India resources while preserving the project's immutable canonical election/booth data.

## Added
- `data/eci_normalization_contract_step88.json`
- `data/eci_ingestion_registry_step88.json`
- `functions/api/eci-ingest.js`
- `functions/api/election-data.js`

## AI integration
`functions/api/ai.js` now adds structured local-dataset evidence for election/result/candidate/booth/Form-20 style queries before external discovery evidence is ranked.

## API routes
- `/api/eci-ingest?year=2022` — discovers and normalizes official ECI Uttar Pradesh Assembly resources for the requested supported election year.
- `/api/election-data?dataset=2022` — read-only structured access to the project's existing verified local election/booth datasets.
- `/api/election-data?dataset=2024-ls` — read-only access to the 2024 Lok Sabha assembly-segment datasets; this layer explicitly keeps them separate from a 2024 Assembly election.

## Integrity rules
- No canonical JSON is rewritten.
- No transient ECI backend download token is persisted as a source-of-truth URL.
- Official source URL, tier, retrieval time and data-quality state are retained.
- Failed/partial retrieval is surfaced instead of silently converted into facts.
- 2024 Lok Sabha segment data remains labeled as Lok Sabha/segment data.

## Validation
- Existing JSON files are byte-preserved from STEP86.
- New JavaScript functions pass `node --check`.
- ECI connector only uses allowlisted ECI landing pages and follows links discovered from those pages.
