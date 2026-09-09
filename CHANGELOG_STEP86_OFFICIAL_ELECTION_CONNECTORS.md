# STEP86 — VANDIRA Official Election Data Connectors

Date: 2026-09-08

## Objective

Start the primary-source retrieval layer for VANDIRA. STEP86 does not rewrite the immutable election/booth JSON dataset. It adds official-source discovery connectors that surface current ECI, CEO Uttar Pradesh, Uttar Pradesh Legislative Assembly and Uttar Pradesh Government resources with source attribution and retrieval timestamps.

## Added

- `data/official_source_connectors_step86.json`
- `functions/api/official-sources.js`
- `functions/api/eci-up.js`
- `functions/api/up-government.js`
- `functions/api/up-assembly.js`
- `functions/api/ai.js` updated to retrieve official connector evidence before news discovery when a live query is required.

## Connector coverage

1. Election Commission of India
   - Assembly Election hub
   - Statistical Reports
   - Terms of Houses
2. Chief Electoral Officer, Uttar Pradesh
3. Uttar Pradesh Legislative Assembly Proceedings Search
4. Uttar Pradesh Government IPR
   - Cabinet decisions
   - Chief Minister press releases

## Architecture rule

Primary-source retrieval is additive. Existing canonical JSON, Form-20 data and booth datasets are read-only and must not be rewritten by live connectors.

## Important limitation

STEP86 is an official-source discovery layer, not a claim that the entire public web or every ECI/CEO document has already been permanently ingested. The next ingestion stages can use the discovered official URLs to build normalized source records, document snapshots, checksums, freshness timestamps and entity mappings.

## API endpoints

- `/api/official-sources?topic=all&q=...`
- `/api/eci-up?q=...`
- `/api/up-government?q=...`
- `/api/up-assembly?q=...`

## Verification target

After deployment, test all four endpoints. A connector may return `ok:false` for an external source without failing the whole AI system; the response records the failure so VANDIRA can expose a data gap rather than inventing an answer.
