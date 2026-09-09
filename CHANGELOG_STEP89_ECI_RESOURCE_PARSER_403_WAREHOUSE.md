# STEP89 — VANDIRA ECI Resource Parser + 403 Constituency Normalized Warehouse

## Objective
Build the next evidence layer after STEP88: a stable normalized warehouse keyed by Assembly Constituency number, plus a live parser for official ECI result pages. The canonical project data remains read-only.

## Added
- `data/eci_warehouse_contract_step89.json`
- `data/eci_assembly_2022_warehouse_step89.json`
- `functions/api/eci-result-parser.js`
- `functions/api/eci-warehouse.js`

## Warehouse
- 403/403 Uttar Pradesh Assembly constituencies are normalized for the 2022 election.
- AC number is the primary entity key; constituency name is descriptive.
- Stable local canonical values are copied into the warehouse without rewriting the canonical source.
- Official ECI statistical-report landing page is retained as an authority reference.
- The warehouse does not claim that a transient backend URL is a permanent source of truth.

## Live ECI parser
`/api/eci-result-parser?ac=252` fetches the official ECI 2022 result page and attempts to normalize candidate, party, EVM votes, postal votes, total votes and vote-share fields.

The parser is additive evidence only. It never overwrites the local warehouse or canonical JSON.

## Warehouse API
- `/api/eci-warehouse?summary=1` — 403-coverage health summary.
- `/api/eci-warehouse?ac=252` — normalized AC record.
- `/api/eci-warehouse?ac=252&mode=hybrid` — normalized record plus live ECI candidate evidence when available.
- `/api/eci-warehouse` — full normalized 403-record warehouse.

## AI integration
`functions/api/ai.js` now checks STEP89 normalized warehouse evidence first for election/result/candidate queries. When an AC number is already present in the AI context, it additionally attempts the official ECI result page parser. The result is included as source-grounded evidence and is never treated as a forecast.

## Integrity
- No existing JSON from STEP88 was modified.
- No canonical election/booth JSON was rewritten.
- 2024 Lok Sabha assembly-segment data remains explicitly separate from any 2024 Assembly election claim.
- Parser failures become data gaps; no missing candidate or vote is invented.

## Validation target
- 403 normalized constituency records.
- JavaScript syntax checks pass.
- Existing STEP88 files remain byte-identical.
